'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  ClothingAnalysis,
  CLOTHING_TYPES,
  WEATHER_OPTIONS,
  VIBE_OPTIONS,
  STYLE_OPTIONS,
} from "../../app/types/clothing";
import type { ClothingType } from "../../app/types/clothing";

const DEFAULT_ANALYSIS: ClothingAnalysis = {
  name: 'Untitled',
  color: ['Unknown', '#808080'],
  type: 'Top',
  metadata: {
    size: null, material: '', comfort: 5, warmth: 5,
    weather: [], style: [], vibe: [],
  },
};

export async function analyzeClothing(
  imageBase64: string,
  mimeType: string,
): Promise<ClothingAnalysis> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return DEFAULT_ANALYSIS;

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) return DEFAULT_ANALYSIS;

  const API_KEY = process.env.GEMENI_PUBLIC_API_KEY;
  if (!API_KEY) return DEFAULT_ANALYSIS;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze this clothing item and return ONLY a JSON object:
{
  "name": "<short descriptive name, e.g. 'Black Wool Overcoat', 'White Cotton Tee'>",
  "color": ["<color name>", "<hex code>"],
  "type": "<one of: ${CLOTHING_TYPES.join(', ')}>",
  "material": "<primary material, e.g. cotton, polyester, wool, denim, leather>",
  "comfort": <1-10, 1=very uncomfortable like a corset, 10=very comfortable like sweatpants>,
  "warmth": <1-10, 1=very cool/breathable, 10=very warm/insulating>,
  "weather": [<from: ${WEATHER_OPTIONS.join(', ')}>],
  "style": [<from: ${STYLE_OPTIONS.join(', ')}>],
  "vibe": [<from: ${VIBE_OPTIONS.join(', ')}>]
}
Return ONLY valid JSON, no markdown, no explanation.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType } },
    ]);

    const raw = result.response.text();
    // Gemini sometimes wraps the response in ```json ... ``` despite instructions
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(text);

    // Validate type
    const type: ClothingType = (CLOTHING_TYPES as readonly string[]).includes(parsed.type)
      ? parsed.type
      : 'Top';

    // Validate color tuple
    const color: [string, string] = Array.isArray(parsed.color) && parsed.color.length >= 2
      ? [String(parsed.color[0]), String(parsed.color[1])]
      : ['Unknown', '#808080'];

    return {
      name: String(parsed.name || 'Untitled'),
      color,
      type,
      metadata: {
        size: null,
        material: String(parsed.material || ''),
        comfort: Math.min(10, Math.max(1, Number(parsed.comfort) || 5)),
        warmth: Math.min(10, Math.max(1, Number(parsed.warmth) || 5)),
        weather: (parsed.weather || []).filter((w: string) =>
          (WEATHER_OPTIONS as readonly string[]).includes(w)),
        style: (parsed.style || []).filter((s: string) =>
          (STYLE_OPTIONS as readonly string[]).includes(s)),
        vibe: (parsed.vibe || []).filter((v: string) =>
          (VIBE_OPTIONS as readonly string[]).includes(v)),
      },
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error('[fit:ai-analysis]', JSON.stringify({
      step: 'ai_analysis',
      error: reason,
      ts: new Date().toISOString(),
    }));
    return DEFAULT_ANALYSIS;
  }
}
