import { Shape, Circle, Rectangle } from './shapes'; // Import z lokálního modulu

console.log("===============================================");
console.log("  TypeScript Docker Příklad - Start          ");
console.log("===============================================\n");

// 1. Základní typy a typové anotace
console.log("--- 1. Základní typy ---");
let projectTitle: string = "Ukázka TypeScriptu v Dockeru";
let versionNumber: number = 1.0;
let isReleased: boolean = true;
let tags: string[] = ["TypeScript", "Docker", "Node.js", "Example"];
let authorInfo: { name: string, contact?: string } = { name: "Vývojář IS" };
authorInfo.contact = "[email protected]";

console.log(`Projekt: ${projectTitle} (Verze: ${versionNumber})`);
console.log(`Vydáno: ${isReleased ? 'Ano' : 'Ne'}`);
console.log("Tagy:", tags.join(' | '));
console.log(`Autor: ${authorInfo.name}, Kontakt: ${authorInfo.contact || 'Není uveden'}\n`);

// 2. Funkce s typy
console.log("--- 2. Funkce s typy ---");
function calculateSum(a: number, b: number): number {
    return a + b;
}
const num1: number = 15;
const num2: number = 7;
console.log(`Součet ${num1} + ${num2} = ${calculateSum(num1, num2)}`);

function createGreeting(personName: string, greetingText: string = "Hello"): string {
    return `${greetingText}, ${personName}! How are you today?`;
}
console.log(createGreeting("Alice"));
console.log(createGreeting("Bob", "Good morning"));
console.log("");

// 3. Rozhraní a Třídy (importováno z shapes.ts)
console.log("--- 3. Rozhraní a Třídy ---");
const myFavoriteCircle = new Circle(7);       // Poloměr 7
const standardRectangle = new Rectangle(8, 5); // Šířka 8, Výška 5

const shapesArray: Shape[] = [myFavoriteCircle, standardRectangle];

shapesArray.forEach(shape => {
    console.log(`Tvar: ${shape.name}`);
    console.log(`  Plocha: ${shape.area().toFixed(2)}`);
    if (shape.perimeter) { // Kontrola, zda metoda existuje (je definována v rozhraní jako volitelná)
        console.log(`  Obvod: ${shape.perimeter().toFixed(2)}`);
    }
});
console.log("");

// 4. Enumy (Výčtové typy)
console.log("--- 4. Enumy ---");
enum Priority {
    Low,       // 0
    Medium,    // 1
    High,      // 2
    Critical   // 3
}

enum TaskStatus {
    Open = "OPEN",
    InProgress = "IN_PROGRESS",
    Done = "DONE",
    Cancelled = "CANCELLED"
}

let taskPriority: Priority = Priority.High;
let currentTaskStatus: TaskStatus = TaskStatus.InProgress;

console.log(`Priorita úkolu: ${Priority[taskPriority]} (hodnota: ${taskPriority})`);
console.log(`Stav úkolu: ${currentTaskStatus}\n`);

// 5. Generika (jednoduchý příklad)
console.log("--- 5. Generika ---");
function identity<T>(arg: T): T {
    return arg;
}
let outputString = identity<string>("Toto je generický řetězec");
let outputNumber = identity<number>(12345);
console.log(outputString);
console.log(outputNumber);

interface GenericContainer<T> {
    value: T;
    getValue: () => T;
}
let numberContainer: GenericContainer<number> = {
    value: 42,
    getValue: function () { return this.value; }
};
console.log(`Hodnota z generického kontejneru: ${numberContainer.getValue()}\n`);

// 6. Union typy a Type Aliases
console.log("--- 6. Union typy a Typové Aliasy ---");
type Identifier = string | number; // Typový alias
type ProcessingResult = "success" | "error" | "pending"; // Literálový union typ

let resourceId: Identifier = "product-xyz";
console.log(`ID zdroje: ${resourceId} (typ: ${typeof resourceId})`);
resourceId = 777;
console.log(`ID zdroje: ${resourceId} (typ: ${typeof resourceId})`);

let lastOperationStatus: ProcessingResult = "success";
console.log(`Stav poslední operace: ${lastOperationStatus}`);
// lastOperationStatus = "unknown"; // Chyba: Typ '"unknown"' nelze přiřadit typu 'ProcessingResult'.
console.log("");

// 7. Ukázka asynchronního kódu s Promise (jen pro úplnost, není hlavní téma této ukázky)
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAsyncTask() {
    console.log("--- 7. Asynchronní operace (Promise) ---");
    console.log("Začíná asynchronní operace...");
    await delay(1000); // Čekej 1 sekundu
    console.log("Asynchronní operace dokončena po 1 sekundě.");
    console.log("\n===============================================");
    console.log("  TypeScript Docker Příklad - Konec          ");
    console.log("===============================================");
}

runAsyncTask();
