import type { Vibe, Style, Weather } from './clothing';

export interface UserPreferences {
  preferred_vibes: Vibe[];
  preferred_styles: Style[];
  avoid_vibes: Vibe[];
  climate: Weather[];
  comfort_priority: number;
}
