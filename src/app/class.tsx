class Clothing {
    //constructor
    public constructor(private name:string, private color:string, private type:string, material?:any, style?:any){
        this.name = name;
        this.color = color;
        this.type = type;
        this.material = material;
        this.style = [style];
    }

    //setter
    public setFields(aName?:string, aColor?:string, aType?:string, aMaterial?:any, aStyle?:any) {
        if (aName != undefined) { this.name = aName;}
        if (aColor != undefined) { this.color = aColor; }
        if (aType != undefined) { this.type = aType; }
        if (aMaterial != undefined) { this.material = aMaterial; }
        if (aStyle != undefined) { this.style.concat(aStyle);}
    }

    public getName() {
        return this.name;
    }

    public getColor() {
        return this.color;
    }

    public getType() {
        return this.type;
    }
    
    //private fields
    private material = {
    name: "name",
    warm: 0,
    comfort: 0
    };

    private style = ["hello"];
}

export default Clothing

// let aMaterial:{name:string, warm:number, comfort: number} = {
//     name: "cotton",
//     warm: 0,
//     comfort: 0
// };

// let aStyle = ["goth", "soft", "alt"];
// let aClothing = new Clothing("sweater", "blue", "top", undefined, aStyle);

// console.log(aClothing);