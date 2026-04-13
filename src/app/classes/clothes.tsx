import type { Weather, Vibe, Style, Size, Color } from '../types/clothing';

class Clothing {
    private material: string = '';
    private comfort: number = 5;
    private warmth: number = 5;
    private weather: Weather[] = [];
    private style: Style[] = [];
    private vibe: Vibe[] = [];
    private size: Size | null = null;
    private imageUrl: string = '';
    public starred: boolean = false;

    public constructor(
        private name: string,
        private color: Color,
        private type: string,
        imageUrl?: string,
        material?: string,
        style?: Style[],
        comfort?: number,
        warmth?: number,
        weather?: Weather[],
        vibe?: Vibe[],
        size?: Size | null,
    ) {
        this.name = name;
        this.color = color;
        this.type = type;
        if (imageUrl != undefined) { this.imageUrl = imageUrl; }
        if (material != undefined) { this.material = material; }
        if (style != undefined) { this.style = style; }
        if (comfort != undefined) { this.comfort = comfort; }
        if (warmth != undefined) { this.warmth = warmth; }
        if (weather != undefined) { this.weather = weather; }
        if (vibe != undefined) { this.vibe = vibe; }
        if (size !== undefined) { this.size = size; }
    }

    public setFields(aName?: string, aColor?: Color, aType?: string, aMaterial?: string, aStyle?: Style[]) {
        if (aName != undefined) { this.name = aName; }
        if (aColor != undefined) { this.color = aColor; }
        if (aType != undefined) { this.type = aType; }
        if (aMaterial != undefined) { this.material = aMaterial; }
        if (aStyle != undefined) { this.style = aStyle; }
    }

    public getName() { return this.name; }
    public getColor() { return this.color; }
    public getColorName() { return this.color[0]; }
    public getColorHex() { return this.color[1]; }
    public getImageUrl() { return this.imageUrl; }
    public getType() { return this.type; }
    public getMaterial() { return this.material; }
    public getStyle() { return this.style; }
    public getStarred() { return this.starred; }
    public getComfort() { return this.comfort; }
    public getWarmth() { return this.warmth; }
    public getWeather() { return this.weather; }
    public getVibe() { return this.vibe; }
    public getSize() { return this.size; }
}

export default Clothing;
