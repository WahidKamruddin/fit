class Clothing {
    //private fields
    private material = {
        name: "name",
        warm: 0,
        comfort: 0
        };
    
    private style = [];

    public starred:boolean = false;

    //constructor
    public constructor(private name:string, private color:string, private type:string, material?:any, style?:any){
        this.name = name;
        this.color = color;
        this.type = type;
        if (material != undefined) { this.material = material; }
        if (style != undefined) { this.style = style; }
    }

    //setter
    public setFields(aName?:string, aColor?:string, aType?:string, aMaterial?:any, aStyle?:any) {
        if (aName != undefined) { this.name = aName;}
        if (aColor != undefined) { this.color = aColor; }
        if (aType != undefined) { this.type = aType; }
        if (aMaterial != undefined) { this.material = aMaterial; }
        if (aStyle != undefined) { this.style.concat(aStyle);}
    }

    public getName() { return this.name; }

    public getColor() { return this.color; }

    public getType() { return this.type; }

    public getMaterial() { return this.material; }

    public getStyle() { return this.style; }

    public getStarred() { return this.starred; }

    
}

export default Clothing



// let aClothing = new Clothing("sweater", "blue", "top");

// console.log(aClothing);