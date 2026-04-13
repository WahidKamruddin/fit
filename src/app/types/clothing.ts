export const WEATHER_OPTIONS = ['hot', 'warm', 'mild', 'cool', 'cold', 'rainy', 'windy', 'snowy'] as const;
export type Weather = typeof WEATHER_OPTIONS[number];

export const VIBE_OPTIONS = [
  'streetwear', 'minimalist', 'sporty', 'casual', 'formal', 'preppy',
  'bohemian', 'vintage', 'techwear', 'athleisure', 'smart-casual', 'loungewear',
] as const;
export type Vibe = typeof VIBE_OPTIONS[number];

export const STYLE_OPTIONS = [
  'layering-piece', 'statement', 'basic', 'accent', 'versatile', 'seasonal',
] as const;
export type Style = typeof STYLE_OPTIONS[number];

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'] as const;
export type Size = typeof SIZE_OPTIONS[number];

export const CLOTHING_TYPES = ['Outerwear', 'Top', 'Bottom', 'Shoes', 'Accessory'] as const;
export type ClothingType = typeof CLOTHING_TYPES[number];

export type Color = [string, string]; // [color name, hex code] e.g. ["Charcoal", "#36454F"]

export interface ClothingMetadata {
  size: Size | null;
  material: string;
  comfort: number;
  warmth: number;
  weather: Weather[];
  style: Style[];
  vibe: Vibe[];
}

// Everything Gemini infers from the image
export interface ClothingAnalysis {
  name: string;
  color: Color;
  type: ClothingType;
  metadata: ClothingMetadata;
}

export interface ClothingRow {
  id: string;
  user_id: string;
  name: string;
  color: Color;
  type: ClothingType;
  image: string;
  image_id: string | null;
  starred: boolean;
  size: Size | null;
  material: string;
  comfort: number;
  warmth: number;
  weather: Weather[];
  style: Style[];
  vibe: Vibe[];
  created_at: string;
}

export interface ClothingItem {
  id: string;
  imageId: string | null;
  name: string;
  color: Color;
  type: ClothingType;
  image: string;
  starred: boolean;
  metadata: ClothingMetadata;
}
