// Výpis do konzole pro kontrolu, že skript běží
console.log("Skript priklad.js byl úspěšně načten!");

// --- 1. Proměnné a Konstanty ---
console.log("--- 1. Proměnné a Konstanty ---");
let jmenoUzivatele = "Alena"; // Proměnná, jejíž hodnota se může měnit
const ROK_NAROZENI = 1995;   // Konstanta, hodnota se nemůže měnit
let vek;                     // Deklarace proměnné bez inicializace

jmenoUzivatele = "Alena Nová"; // Změna hodnoty proměnné 'let'
// ROK_NAROZENI = 1996; // Toto by vyvolalo chybu, konstantu nelze měnit

vek = new Date().getFullYear() - ROK_NAROZENI;

console.log("Jméno:", jmenoUzivatele);
console.log("Rok narození:", ROK_NAROZENI);
console.log("Věk:", vek);

// --- 2. Datové typy ---
console.log("--- 2. Datové typy ---");
let pozdrav = "Ahoj světe!"; // String
let pocetJablek = 10;        // Number
let cenaZaKus = 12.5;       // Number (desetinné)
let jeSkladem = true;        // Boolean
let auto = null;             // Null (úmyslná absence hodnoty)
let barva;                   // Undefined (deklarováno, ale bez hodnoty)

console.log("Typ proměnné 'pozdrav':", typeof pozdrav);
console.log("Typ proměnné 'pocetJablek':", typeof pocetJablek);
console.log("Typ proměnné 'jeSkladem':", typeof jeSkladem);
console.log("Typ proměnné 'auto':", typeof auto, "(typeof null je 'object' - historická chyba)");
console.log("Typ proměnné 'barva':", typeof barva);

// Template literal (zpětné uvozovky) pro dynamické řetězce
let infoProdukt = `Produkt: Jablka, Počet: ${pocetJablek}, Cena/ks: ${cenaZaKus} Kč`;
console.log(infoProdukt);

// --- 3. Operátory ---
console.log("--- 3. Operátory ---");
let a = 10;
let b = 4;
console.log("a + b =", a + b); // Sčítání
console.log("a - b =", a - b); // Odčítání
console.log("a * b =", a * b); // Násobení
console.log("a / b =", a / b); // Dělení
console.log("a % b =", a % b); // Modulo (zbytek po dělení)
console.log("a ** b =", a ** b); // Umocňování (10 na 4)

let c = "5";
console.log("a == c (string '5'):", a == c);   // false (10 == "5" -> false)
console.log("a === c (string '5'):", a === c); // false (striktní rovnost, různé typy)
let d = 10;
console.log("a === d (number 10):", a === d); // true

console.log("Logické AND (true && false):", true && false); // false
console.log("Logické OR (true || false):", true || false);   // true
console.log("Logické NOT (!true):", !true);                // false

// Ternární operátor
let stavObjednavky = (pocetJablek > 0) ? "Skladem" : "Vyprodáno";
console.log("Stav objednávky jablek:", stavObjednavky);

// --- 4. Řídicí struktury ---
console.log("--- 4. Řídicí struktury ---");
// Podmínka if...else
if (vek >= 18) {
    console.log(jmenoUzivatele + " je plnoletý/á.");
} else {
    console.log(jmenoUzivatele + " není plnoletý/á.");
}

// Cyklus for
console.log("Výpis čísel 0-2 pomocí for cyklu:");
for (let i = 0; i < 3; i++) {
    console.log("i =", i);
}

// --- 5. Funkce ---
console.log("--- 5. Funkce ---");
// Deklarace funkce
function sectiCisla(x, y) {
    return x + y;
}
let soucet = sectiCisla(7, 8);
console.log("Součet 7 + 8 =", soucet);

// Funkční výraz (šipková funkce)
const pozdravOsobu = (jmeno) => {
    return `Vítej, ${jmeno}!`;
};
console.log(pozdravOsobu("Lucie"));

// --- 6. Objekty ---
console.log("--- 6. Objekty ---");
let produkt = {
    nazev: "Notebook XT1000",
    vyrobce: "TechCorp",
    cena: 25000,
    specifikace: {
        cpu: "Intel i7",
        ram: "16GB",
        disk: "512GB SSD"
    },
    popis: function () {
        return `${this.nazev} od ${this.vyrobce}, cena: ${this.cena} Kč. CPU: ${this.specifikace.cpu}.`;
    }
};
console.log("Název produktu:", produkt.nazev);
console.log("RAM:", produkt.specifikace.ram);
console.log(produkt.popis());

// --- 7. Pole (Arrays) ---
console.log("--- 7. Pole (Arrays) ---");
let barvy = ["červená", "zelená", "modrá", "žlutá"];
console.log("První barva:", barvy[0]);
console.log("Počet barev:", barvy.length);

barvy.push("oranžová"); // Přidání na konec
console.log("Barvy po přidání 'oranžová':", barvy);

console.log("Iterace polem pomocí forEach:");
barvy.forEach(function (barva, index) {
    console.log(`Barva na indexu ${index}: ${barva}`);
});

let velkaPismenaBarvy = barvy.map(function (barva) {
    return barva.toUpperCase();
});
console.log("Barvy velkými písmeny:", velkaPismenaBarvy);

// --- Výstup na HTML stránku ---
// Najdeme kontejner na stránce pomocí jeho ID
const outputContainer = document.getElementById('js-output');

if (outputContainer) {
    // Funkce pro přidání odstavce do kontejneru
    function addParagraphToOutput(text) {
        const p = document.createElement('p');
        p.innerHTML = text; // Používáme innerHTML pro případné formátování (např. <code>)
        outputContainer.appendChild(p);
    }

    addParagraphToOutput(`Jméno uživatele: <code>${jmenoUzivatele}</code>`);
    addParagraphToOutput(`Věk: <code>${vek}</code>`);
    addParagraphToOutput(`Pozdrav od funkce: <code>${pozdravOsobu(jmenoUzivatele)}</code>`);
    addParagraphToOutput(`Informace o produktu: <code>${produkt.popis()}</code>`);

    let barvyHtml = "Oblíbené barvy: ";
    barvy.forEach(barva => {
        barvyHtml += `<code>${barva}</code> `;
    });
    addParagraphToOutput(barvyHtml);

} else {
    console.error("Element s ID 'js-output' nebyl na stránce nalezen.");
}

console.log("--- Konec ukázky základů JavaScriptu ---");
