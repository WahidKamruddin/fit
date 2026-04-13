import type { Weather, Vibe, Style } from './clothing';

export interface OutfitRow {
  id: string;
  user_id: string;
  outer_wear: string | null;
  top: string | null;
  bottom: string | null;
  shoes: string | null;
  accessories: string[];
  date: string | null;
  created_at: string;
}

export interface OutfitDoc {
  id: string;
  OuterWear: string | null;
  Top: string;
  Bottom: string;
  Shoes: string | null;
  Accessories: string[];
  Date: string | null;
}

export interface OutfitPreferences {
  vibes: Vibe[];
  styles: Style[];
  weather: Weather[];
}

export interface GeneratedOutfitItem {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  matchScore: number; // 0–1
}

export interface GeneratedOutfit {
  outerwear?: GeneratedOutfitItem;
  top: GeneratedOutfitItem;
  bottom: GeneratedOutfitItem;
  shoes?: GeneratedOutfitItem;
  accessories: GeneratedOutfitItem[];
  warmthScore: number;       // 0–100, weighted by role
  comfortScore: number;      // 0–100, weighted by role
  dominantVibes: Vibe[];     // vibes present in ≥2 selected items
  dominantStyles: Style[];   // styles present in ≥2 selected items
  weatherSuitability: Weather[];
  confidenceScore: number;   // 0–100, avg match score of selected items
}
