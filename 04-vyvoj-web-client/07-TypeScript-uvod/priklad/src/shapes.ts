// Definice rozhraní (interface) pro obecný tvar
export interface Shape {
    name: string;       // Každý tvar bude mít jméno
    area(): number;     // Každý tvar bude mít metodu pro výpočet plochy
    perimeter?(): number; // Volitelná metoda pro obvod
}

// Třída Kruh implementující rozhraní Shape
export class Circle implements Shape {
    name: string = "Kruh"; // Výchozí jméno pro všechny instance kruhu

    // Konstruktor s veřejným parametrem 'radius', který se automaticky stane vlastností třídy
    constructor(public radius: number) { }

    area(): number {
        return Math.PI * this.radius * this.radius;
    }

    perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

// Třída Obdélník implementující rozhraní Shape
export class Rectangle implements Shape {
    name: string = "Obdélník";

    constructor(public width: number, public height: number) { }

    area(): number {
        return this.width * this.height;
    }

    perimeter(): number {
        return 2 * (this.width + this.height);
    }
}
