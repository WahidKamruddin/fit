import Clothing from '../app/classes/clothes';
import type { Weather, Vibe, Style } from '../app/types/clothing';
import type { OutfitPreferences, GeneratedOutfit, GeneratedOutfitItem } from '../app/types/outfit';

export interface ClothingCard {
  clothing: Clothing;
  id: string;
  imageId: string | null;
}

const COLD_WEATHER: Weather[] = ['cool', 'cold', 'windy', 'snowy'];

const BASE_ROLE_WEIGHTS: Record<string, number> = {
  Outerwear: 0.35,
  Top:       0.20,
  Bottom:    0.20,
  Shoes:     0.15,
  Accessory: 0.10,
};

function overlap<T>(a: T[], b: T[]): number {
  return a.filter(x => b.includes(x)).length;
}

function scoreCard(card: ClothingCard, prefs: OutfitPreferences): number {
  const vibe    = card.clothing.getVibe();
  const style   = card.clothing.getStyle();
  const weather = card.clothing.getWeather();

  const vibeScore    = prefs.vibes.length    > 0 ? overlap(vibe,    prefs.vibes)    / prefs.vibes.length    : 0.5;
  const styleScore   = prefs.styles.length   > 0 ? overlap(style,   prefs.styles)   / prefs.styles.length   : 0.5;
  const weatherScore = prefs.weather.length  > 0 ? overlap(weather, prefs.weather)  / prefs.weather.length  : 0.5;

  return 0.4 * vibeScore + 0.3 * styleScore + 0.3 * weatherScore;
}

function toItem(card: ClothingCard, matchScore: number): GeneratedOutfitItem {
  return {
    id:       card.id,
    name:     card.clothing.getName(),
    type:     card.clothing.getType(),
    imageUrl: card.clothing.getImageUrl(),
    matchScore,
  };
}

function bestCard(cards: ClothingCard[], prefs: OutfitPreferences): [ClothingCard, number] | null {
  if (cards.length === 0) return null;
  let top = cards[0];
  let topScore = scoreCard(top, prefs);
  for (let i = 1; i < cards.length; i++) {
    const s = scoreCard(cards[i], prefs);
    if (s > topScore) { top = cards[i]; topScore = s; }
  }
  return [top, topScore];
}

function normalizeWeights(keys: string[]): Record<string, number> {
  const raw = keys.reduce((acc, k) => ({ ...acc, [k]: BASE_ROLE_WEIGHTS[k] ?? 0 }), {} as Record<string, number>);
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  if (total === 0) return raw;
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v / total]));
}

export function generateOutfit(
  cards: ClothingCard[],
  prefs: OutfitPreferences,
): GeneratedOutfit | { error: string } {
  const byType: Record<string, ClothingCard[]> = {};
  for (const card of cards) {
    const t = card.clothing.getType();
    if (!byType[t]) byType[t] = [];
    byType[t].push(card);
  }

  const topResult    = bestCard(byType['Top']    ?? [], prefs);
  const bottomResult = bestCard(byType['Bottom'] ?? [], prefs);

  if (!topResult || !bottomResult) {
    return { error: 'Not enough clothes found. Add at least one Top and one Bottom.' };
  }

  const useColdWeather  = prefs.weather.some(w => COLD_WEATHER.includes(w));
  const outerwearResult = useColdWeather ? bestCard(byType['Outerwear'] ?? [], prefs) : null;
  const shoesResult     = bestCard(byType['Shoes']     ?? [], prefs);
  const accessoryResult = bestCard(byType['Accessory'] ?? [], prefs);

  const selected: Array<{ item: GeneratedOutfitItem; card: ClothingCard; role: string }> = [];

  const topItem    = toItem(topResult[0],    topResult[1]);
  const bottomItem = toItem(bottomResult[0], bottomResult[1]);
  selected.push({ item: topItem,    card: topResult[0],    role: 'Top'    });
  selected.push({ item: bottomItem, card: bottomResult[0], role: 'Bottom' });

  let outerwearItem: GeneratedOutfitItem | undefined;
  if (outerwearResult) {
    outerwearItem = toItem(outerwearResult[0], outerwearResult[1]);
    selected.push({ item: outerwearItem, card: outerwearResult[0], role: 'Outerwear' });
  }

  let shoesItem: GeneratedOutfitItem | undefined;
  if (shoesResult) {
    shoesItem = toItem(shoesResult[0], shoesResult[1]);
    selected.push({ item: shoesItem, card: shoesResult[0], role: 'Shoes' });
  }

  const accessoryItems: GeneratedOutfitItem[] = [];
  if (accessoryResult) {
    const acc = toItem(accessoryResult[0], accessoryResult[1]);
    accessoryItems.push(acc);
    selected.push({ item: acc, card: accessoryResult[0], role: 'Accessory' });
  }

  const weights = normalizeWeights(selected.map(s => s.role));

  let warmthScore  = 0;
  let comfortScore = 0;
  for (const { card, role } of selected) {
    const w = weights[role] ?? 0;
    warmthScore  += ((card.clothing.getWarmth()  - 1) / 9 * 100) * w;
    comfortScore += ((card.clothing.getComfort() - 1) / 9 * 100) * w;
  }

  const vibeCounts:  Partial<Record<Vibe,    number>> = {};
  const styleCounts: Partial<Record<Style,   number>> = {};
  const weatherSet = new Set<Weather>();

  for (const { card } of selected) {
    for (const v of card.clothing.getVibe())    vibeCounts[v]  = (vibeCounts[v]  ?? 0) + 1;
    for (const s of card.clothing.getStyle())   styleCounts[s] = (styleCounts[s] ?? 0) + 1;
    for (const w of card.clothing.getWeather()) weatherSet.add(w);
  }

  const dominantVibes  = (Object.entries(vibeCounts)  as [Vibe,  number][]).filter(([, n]) => n >= 2).map(([v]) => v);
  const dominantStyles = (Object.entries(styleCounts) as [Style, number][]).filter(([, n]) => n >= 2).map(([s]) => s);
  const confidenceScore = (selected.reduce((sum, { item }) => sum + item.matchScore, 0) / selected.length) * 100;

  return {
    outerwear:          outerwearItem,
    top:                topItem,
    bottom:             bottomItem,
    shoes:              shoesItem,
    accessories:        accessoryItems,
    warmthScore:        Math.round(warmthScore),
    comfortScore:       Math.round(comfortScore),
    dominantVibes,
    dominantStyles,
    weatherSuitability: Array.from(weatherSet),
    confidenceScore:    Math.round(confidenceScore),
  };
}
