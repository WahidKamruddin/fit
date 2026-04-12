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
  OuterWear: string;
  Top: string;
  Bottom: string;
  Shoes: string | null;
  Accessories: string[];
  Date: string | null;
}
