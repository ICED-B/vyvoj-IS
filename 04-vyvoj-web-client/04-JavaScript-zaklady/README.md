# 4. Základy JavaScriptu: Proměnné, typy, operátory, funkce, řídicí struktury

Po zvládnutí HTML pro strukturu a CSS pro vzhled přichází na řadu **JavaScript (JS)**. JavaScript je **programovací jazyk**, který umožňuje přidat webovým stránkám **interaktivitu, dynamické chování a komunikaci se serverem** bez nutnosti neustálého znovunačítání stránky. Běží přímo v prohlížeči uživatele (na straně klienta), ale lze ho použít i na serveru (např. Node.js).

## Co je JavaScript?

* **Skriptovací jazyk:** Často se používá pro psaní menších skriptů, které manipulují s obsahem stránky, reagují na akce uživatele nebo komunikují asynchronně.
* **Interpretovaný jazyk:** Kód se typicky vykonává řádek po řádku interpretem v prohlížeči, není potřeba ho předem kompilovat (i když moderní prohlížeče provádějí JIT - Just-In-Time kompilaci pro optimalizaci).
* **Dynamicky typovaný:** Datový typ proměnné se určuje až za běhu a může se měnit.
* **Objektově orientovaný (prototypový):** Podporuje objektově orientované programování, i když jeho model dědičnosti je založen na prototypech, ne na třídách (ačkoliv ES6 zavedlo syntaktický cukr pro třídy).
* **Single-threaded s event loopem:** JavaScript sám o sobě je jednovláknový (v jednu chvíli dělá jen jednu věc), ale díky "event loop" (smyčce událostí) a asynchronním operacím dokáže efektivně zpracovávat události a I/O operace bez blokování hlavního vlákna.

## Způsoby vkládání JavaScriptu do HTML

Podobně jako CSS, i JavaScript lze do HTML stránky vložit několika způsoby:

1.  **Externí soubor (External JavaScript):**
    * **Doporučený způsob** pro většinu skriptů.
    * JavaScriptový kód je uložen v samostatném souboru s příponou `.js` (např. `skripty/main.js`).
    * Soubor se připojí k HTML pomocí tagu `<script>` s atributem `src`:
        ```html
        <script src="skripty/main.js"></script>
        ```
    * Tag `<script>` se obvykle umisťuje:
        * Na konec `<body>` (těsně před `</body>`): Toto je často preferované, protože HTML se nejprve načte a zobrazí, a až poté se začnou parsovat a spouštět skripty. Tím se zabrání blokování renderování stránky skripty.
        * Do `<head>`: Pokud skript musí být spuštěn dříve nebo pokud používá atribut `defer` nebo `async`.
            * `defer`: Skript se stáhne asynchronně s parsováním HTML, ale spustí se až po dokončení parsování HTML, v pořadí, v jakém jsou uvedeny.
            * `async`: Skript se stáhne asynchronně a spustí se, jakmile je stažen, bez ohledu na parsování HTML nebo pořadí ostatních skriptů.
    * **Výhody:** Oddělení kódu od HTML, lepší organizace, možnost sdílení skriptů mezi více stránkami, cachování prohlížečem.

2.  **Interní skript (Internal JavaScript):**
    * JavaScriptový kód je umístěn přímo v HTML dokumentu uvnitř tagu `<script> ... </script>`.
        ```html
        <script>
            // JavaScript kód zde
            console.log("Ahoj z interního skriptu!");
            function pozdrav() {
                alert("Hello World!");
            }
        </script>
        ```
    * Může být umístěn v `<head>` nebo `<body>`.
    * **Výhody:** Pro malé, specifické skripty pro jednu stránku nebo rychlé testování.
    * **Nevýhody:** Míchá kód s HTML, horší údržba pro větší skripty.

3.  **Inline JavaScript (v HTML atributech - nedoporučeno):**
    * Krátké kousky kódu přímo v HTML atributech jako `onclick`, `onmouseover` atd.
        ```html
        <button onclick="alert('Tlačítko bylo stisknuto!')">Klikni na mě</button>
        ```
    * **Silně nedoporučeno** pro většinu případů, protože to vede k nečitelnému a špatně udržovatelnému kódu. Lepší je používat `addEventListener` v samostatném skriptu.

## Základní syntaxe

### Komentáře

```javascript
// Toto je jednořádkový komentář

/*
Toto je
víceřádkový
komentář.
*/
```

### Proměnné

Proměnné slouží k ukládání dat. V moderním JavaScriptu (ES6+) se pro deklaraci proměnných používají klíčová slova `let` a `const`. Starší `var` se stále vyskytuje, ale jeho použití se obecně nedoporučuje kvůli jeho specifickému chování (hoisting, function scope).

* **`let`**: Deklaruje proměnnou, jejíž hodnota se může později změnit. Má blokový rozsah platnosti (block scope).
    ```javascript
    let vek = 30;
    vek = 31; // Hodnotu lze změnit
    let jmeno; // Deklarace bez inicializace, hodnota je 'undefined'
    ```
* **`const`**: Deklaruje konstantu, jejíž hodnota **nemůže** být po přiřazení změněna. Také má blokový rozsah platnosti. Musí být inicializována při deklaraci.
    ```javascript
    const PI = 3.14159;
    // PI = 3.14; // Toto by vyvolalo chybu
    const osoba = { jmeno: "Jan" };
    osoba.jmeno = "Petr"; // OK, měníme vlastnost objektu, ne samotnou konstantu (referenci)
    // osoba = { jmeno: "Eva" }; // Chyba, pokus o přiřazení nové reference ke konstantě
    ```
* **`var` (starší způsob):** Má funkční rozsah platnosti (function scope) nebo globální rozsah, pokud je deklarován mimo funkci. Proměnné deklarované s `var` jsou "vyzdviženy" (hoisted) na začátek svého scope.
    ```javascript
    var pozdrav = "Ahoj";
    ```

**Názvy proměnných:**
* Mohou obsahovat písmena, čísla, podtržítko (`_`) a dolar (`$`).
* Nesmí začínat číslem.
* Jsou case-sensitive (`vek` a `Vek` jsou různé proměnné).
* Konvence: `camelCase` pro proměnné a funkce (např. `mojePromenna`), `PascalCase` pro třídy.

### Datové typy

JavaScript je dynamicky typovaný jazyk. To znamená, že nemusíte explicitně deklarovat typ proměnné; typ se určí automaticky na základě přiřazené hodnoty.

**Primitivní datové typy:**

1.  **`String`**: Textový řetězec. Uzavírá se do jednoduchých (`'...'`), dvojitých (`"..."`) nebo zpětných uvozovek (backticks `` `...` ``).
    ```javascript
    let mesto = "Brno";
    let zprava = 'Vítejte!';
    let dynamickyText = `Moje jméno je ${jmeno}.`; // Template literal (zpětné uvozovky)
    ```
2.  **`Number`**: Číslo. Může být celé nebo desetinné. Zahrnuje i speciální hodnoty jako `Infinity`, `-Infinity` a `NaN` (Not a Number).
    ```javascript
    let pocet = 10;
    let cena = 199.90;
    let vysledek = 0 / 0; // NaN
    ```
3.  **`Boolean`**: Logická hodnota, `true` nebo `false`.
    ```javascript
    let jePlnolety = true;
    let maSlevu = false;
    ```
4.  **`Null`**: Reprezentuje úmyslnou absenci jakékoli objektové hodnoty. Je to primitivní hodnota, ale `typeof null` vrací `"object"` (historická chyba v JS).
    ```javascript
    let auto = null; // Proměnná auto explicitně nemá hodnotu
    ```
5.  **`Undefined`**: Proměnná, která byla deklarována, ale nebyla jí přiřazena hodnota, má automaticky hodnotu `undefined`. Také funkce, která nic nevrací, vrací `undefined`.
    ```javascript
    let adresa; // hodnota je undefined
    console.log(adresa); // Vypíše: undefined
    ```
6.  **`Symbol` (ES6+):** Unikátní a neměnný datový typ, často používaný jako identifikátor pro vlastnosti objektů.
7.  **`BigInt` (ES2020+):** Pro práci s celými čísly libovolné velikosti (většími, než `Number` dokáže bezpečně reprezentovat).

**Komplexní datový typ:**

* **`Object`**: Reprezentuje kolekci párů klíč-hodnota (vlastností). Může také obsahovat metody (funkce).
    * Pole (`Array`) a Funkce (`Function`) jsou speciální typy objektů.
    ```javascript
    let uzivatel = {
        jmeno: "Eva",
        prijmeni: "Nováková",
        vek: 28,
        jeAktivni: true,
        pozdrav: function() {
            console.log("Ahoj, já jsem " + this.jmeno);
        }
    };
    console.log(uzivatel.jmeno); // Eva
    uzivatel.pozdrav(); // Ahoj, já jsem Eva
    ```

Operátor `typeof` vrací řetězec s typem operandu:
```javascript
console.log(typeof "text");    // "string"
console.log(typeof 123);       // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (historická chyba)
console.log(typeof {a: 1});  // "object"
console.log(typeof [1, 2]);  // "object" (pole jsou objekty)
console.log(typeof function(){}); // "function" (funkce jsou speciální objekty)
```

### Operátory

* **Aritmetické:** `+` (sčítání, také konkatenace řetězců), `-` (odčítání), `*` (násobení), `/` (dělení), `%` (modulo - zbytek po dělení), `**` (umocňování - ES7+), `++` (inkrementace), `--` (dekrementace).
* **Přiřazovací:** `=`, `+=`, `-=`, `*=`, `/=`, `%=`.
* **Porovnávací:**
    * `==` (rovnost hodnoty, provádí typovou konverzi - **méně doporučeno**)
    * `===` (striktní rovnost hodnoty i typu - **doporučeno**)
    * `!=` (nerovnost hodnoty)
    * `!==` (striktní nerovnost hodnoty nebo typu)
    * `>` (větší než), `<` (menší než), `>=` (větší nebo rovno), `<=` (menší nebo rovno).
* **Logické:**
    * `&&` (logické AND - a zároveň)
    * `||` (logické OR - nebo)
    * `!` (logické NOT - negace)
* **Podmíněný (ternární) operátor:** `podminka ? hodnota_kdyz_pravda : hodnota_kdyz_nepravda`
    ```javascript
    let vekKlienta = 20;
    let typVstupenky = (vekKlienta < 18) ? "dětská" : "dospělá"; // "dospělá"
    ```
* **Bitové operátory:** `&`, `|`, `^`, `~`, `<<`, `>>` (méně časté v běžném webovém JS).
* **Další:** `typeof`, `instanceof`, `delete`, `new`, `in`, `void`, operátor čárky `,`, spread `...`, rest `...`.

### Řídicí struktury

Umožňují řídit tok programu.

* **Podmínky (`if...else if...else`):**
    ```javascript
    let hodina = 14;
    if (hodina < 12) {
        console.log("Dobré dopoledne!");
    } else if (hodina < 18) {
        console.log("Dobré odpoledne!");
    } else {
        console.log("Dobrý večer!");
    }
    ```
* **Přepínač (`switch`):** Alternativa k `if...else if...else` pro více možností na základě hodnoty jedné proměnné.
    ```javascript
    let den = "pondělí";
    switch (den) {
        case "pondělí":
            console.log("Začátek pracovního týdne.");
            break; // Důležité! Bez break by se pokračovalo dalším case.
        case "pátek":
            console.log("Konečně pátek!");
            break;
        default:
            console.log("Jiný den.");
    }
    ```
* **Cykly:**
    * **`for` cyklus:** Pro opakování kódu známý početkrát.
        ```javascript
        for (let i = 0; i < 5; i++) { // i od 0 do 4
            console.log("Číslo je: " + i);
        }
        ```
    * **`while` cyklus:** Opakuje kód, dokud je podmínka pravdivá. Podmínka se testuje na začátku.
        ```javascript
        let pocitadlo = 0;
        while (pocitadlo < 3) {
            console.log("While počitadlo: " + pocitadlo);
            pocitadlo++;
        }
        ```
    * **`do...while` cyklus:** Podobný `while`, ale kód se provede alespoň jednou, protože podmínka se testuje až na konci.
        ```javascript
        let x = 5;
        do {
            console.log("Do-while x: " + x);
            x++;
        } while (x < 5); // Provede se jednou, i když x není < 5
        ```
    * **`for...in` cyklus:** Pro iteraci přes vlastnosti objektu (klíče).
        ```javascript
        const auto = { znacka: "Tesla", model: "Model S", rok: 2022 };
        for (let klic in auto) {
            console.log(klic + ": " + auto[klic]);
        }
        // Výstup:
        // znacka: Tesla
        // model: Model S
        // rok: 2022
        ```
    * **`for...of` cyklus (ES6+):** Pro iteraci přes iterovatelné objekty (jako pole, řetězce, Map, Set).
        ```javascript
        const barvy = ["červená", "zelená", "modrá"];
        for (let barva of barvy) {
            console.log(barva);
        }
        // Výstup:
        // červená
        // zelená
        // modrá

        const text = "Ahoj";
        for (let pismeno of text) {
            console.log(pismeno);
        }
        // Výstup: A, h, o, j
        ```
    * `break`: Okamžitě ukončí cyklus.
    * `continue`: Přeskočí zbytek aktuální iterace a pokračuje další.

### Funkce

Funkce jsou bloky kódu, které lze definovat a opakovaně volat. Mohou přijímat argumenty (vstupní hodnoty) a vracet hodnotu.

* **Deklarace funkce (Function Declaration):**
    ```javascript
    function secti(a, b) {
        return a + b;
    }
    let vysledekScitani = secti(5, 3); // 8
    ```
    Deklarace funkcí jsou "vyzdviženy" (hoisted), takže je lze volat i před jejich definicí v kódu.

* **Funkční výraz (Function Expression):** Funkce je přiřazena do proměnné.
    ```javascript
    const odecti = function(a, b) {
        return a - b;
    };
    let vysledekOdcitani = odecti(10, 4); // 6
    ```
    Funkční výrazy nejsou hoisted.

* **Šipkové funkce (Arrow Functions - ES6+):** Kratší syntaxe pro funkční výrazy. Mají také odlišné chování `this`.
    ```javascript
    const nasob = (a, b) => {
        return a * b;
    };
    // Pokud má funkce jen jeden výraz, lze zkrátit:
    const umocni = (zaklad, exponent) => zaklad ** exponent;

    const pozdravJmenem = jmeno => `Ahoj, ${jmeno}!`; // Jeden parametr, bez závorek
    const vypisNeco = () => console.log("Něco..."); // Bez parametrů

    console.log(nasob(4, 5)); // 20
    console.log(pozdravJmenem("Petře")); // Ahoj, Petře!
    ```

* **Parametry a argumenty:**
    * Parametry jsou názvy uvedené v definici funkce.
    * Argumenty jsou skutečné hodnoty předané funkci při jejím volání.
    * **Výchozí hodnoty parametrů (ES6+):**
        ```javascript
        function pripojSe(uzivatel, server = "localhost") {
            console.log(`${uzivatel} se připojuje k ${server}`);
        }
        pripojSe("admin"); // admin se připojuje k localhost
        pripojSe("guest", "remote.server.com"); // guest se připojuje k remote.server.com
        ```
* **Návratová hodnota (`return`):** Funkce může vrátit hodnotu pomocí klíčového slova `return`. Pokud `return` chybí nebo nevrací žádnou hodnotu, funkce implicitně vrací `undefined`.

### Objekty

Objekty jsou kolekce vlastností (párů klíč-hodnota). Vlastnosti mohou být primitivní hodnoty nebo jiné objekty (včetně funkcí - pak se jim říká metody).

* **Vytvoření objektu (Object Literal):**
    ```javascript
    let kniha = {
        nazev: "Pán prstenů",
        autor: "J.R.R. Tolkien",
        rokVydani: 1954,
        pocetStran: 1200,
        zanry: ["Fantasy", "Dobrodružný"],
        informace: function() {
            return `${this.nazev} od ${this.autor}, vydáno ${this.rokVydani}.`;
        }
    };
    ```
* **Přístup k vlastnostem:**
    * Tečková notace: `objekt.vlastnost`
    * Závorková notace: `objekt['vlastnost']` (užitečné, pokud název vlastnosti obsahuje speciální znaky nebo je v proměnné)
    ```javascript
    console.log(kniha.nazev); // Pán prstenů
    console.log(kniha['autor']); // J.R.R. Tolkien
    console.log(kniha.informace());
    ```
* **Přidání/změna vlastností:**
    ```javascript
    kniha.isbn = "978-0618260274"; // Přidání nové vlastnosti
    kniha.rokVydani = 1965; // Změna existující vlastnosti
    ```
* **`this` klíčové slovo:** V kontextu metody objektu `this` odkazuje na samotný objekt, jehož metoda je volána. Chování `this` může být složitější (zejména u šipkových funkcí a v různých kontextech volání).

### Pole (Arrays)

Pole jsou speciální typ objektu, který slouží k ukládání uspořádané kolekce hodnot (různých typů). Jsou indexována číselně od 0.

* **Vytvoření pole (Array Literal):**
    ```javascript
    let cisla = [1, 2, 3, 4, 5];
    let ovoce = ["jablko", "banán", "pomeranč"];
    let smisene = [10, "text", true, null, { typ: "mix" }];
    ```
* **Přístup k prvkům:** Pomocí indexu v hranatých závorkách.
    ```javascript
    console.log(ovoce[0]); // "jablko"
    console.log(cisla[2]); // 3
    ovoce[1] = "hruška"; // Změna prvku
    ```
* **Vlastnost `length`:** Vrací počet prvků v poli.
    ```javascript
    console.log(ovoce.length); // 3
    ```
* **Běžné metody polí (ES6+):**
    * `push()`: Přidá prvek na konec pole.
    * `pop()`: Odebere a vrátí poslední prvek.
    * `shift()`: Odebere a vrátí první prvek.
    * `unshift()`: Přidá prvek na začátek pole.
    * `indexOf()`: Vrátí index prvního výskytu prvku (nebo -1).
    * `slice(start, end)`: Vrátí novou část pole (nekopíruje originál).
    * `splice(start, deleteCount, ...itemsToAdd)`: Mění pole odstraněním/přidáním prvků.
    * `forEach(callbackFn)`: Provede funkci pro každý prvek pole.
        ```javascript
        ovoce.forEach(function(polozka, index) {
            console.log(`Index ${index}: ${polozka}`);
        });
        ```
    * `map(callbackFn)`: Vytvoří nové pole s výsledky volání funkce pro každý prvek.
        ```javascript
        let dvojnasobky = cisla.map(function(cislo) {
            return cislo * 2;
        }); // [2, 4, 6, 8, 10]
        ```
    * `filter(callbackFn)`: Vytvoří nové pole s prvky, které splňují podmínku.
        ```javascript
        let sudaCisla = cisla.filter(function(cislo) {
            return cislo % 2 === 0;
        }); // [2, 4]
        ```
    * `reduce(callbackFn, initialValue)`: Aplikuje funkci na akumulátor a každý prvek pole (zleva doprava) tak, aby ho zredukoval na jednu hodnotu.
    * `find(callbackFn)`: Vrátí první prvek, který splňuje podmínku.
    * `some(callbackFn)`: Vrátí `true`, pokud alespoň jeden prvek splňuje podmínku.
    * `every(callbackFn)`: Vrátí `true`, pokud všechny prvky splňují podmínku.

## ES6+ (ECMAScript 2015 a novější)

ECMAScript je standard, na kterém je JavaScript založen. Verze ES6 (ECMAScript 2015) přinesla mnoho významných vylepšení jazyka, které se dnes běžně používají:

* `let` a `const` (již zmíněno)
* Šipkové funkce (Arrow Functions - již zmíněno)
* Template Literals (zpětné uvozovky `` `...` `` pro řetězce s interpolací proměnných `${...}`)
* Destrukturalizace (Destructuring Assignment) pro snadné rozbalování hodnot z polí a objektů.
    ```javascript
    const [prvni, druhy] = ["A", "B"]; // prvni = "A", druhy = "B"
    const { jmenoOsoby, vekOsoby } = { jmenoOsoby: "Karel", vekOsoby: 40 };
    ```
* Výchozí hodnoty parametrů funkcí (Default Parameters - již zmíněno)
* Rest parametr (`...args`) a Spread operátor (`...pole`)
* Třídy (Classes) - syntaktický cukr nad prototypovou dědičností.
* Moduly (`import`/`export`) pro organizaci kódu do souborů.
* Promises (pro asynchronní programování - viz další kapitola).
* A mnoho dalšího (`Map`, `Set`, `Symbol`, `for...of` loops).

Moderní JavaScriptový vývoj se bez těchto prvků prakticky neobejde.

## Konzole prohlížeče (Browser Console)

Nezbytný nástroj pro každého JavaScriptového vývojáře. Otevřete ji ve vývojářských nástrojích vašeho prohlížeče (obvykle klávesou F12, pak záložka "Console").

* **`console.log(hodnota1, hodnota2, ...)`**: Vypíše hodnoty do konzole. Velmi užitečné pro ladění a sledování stavu proměnných.
* `console.error("Chybová zpráva")`: Vypíše chybovou zprávu.
* `console.warn("Varování")`: Vypíše varování.
* `console.table(poleNeboObjekt)`: Zobrazí data v tabulkovém formátu.
* `console.dir(objekt)`: Interaktivní výpis vlastností objektu.
* Můžete v ní přímo psát a spouštět JavaScriptový kód.

## Shrnutí

JavaScript je dynamický a flexibilní jazyk, který oživuje webové stránky. Zvládnutí jeho základů – proměnných, datových typů, operátorů, řídicích struktur, funkcí, objektů a polí – je nezbytným předpokladem pro další kroky, jako je manipulace s DOM (Document Object Model) a interakce s uživatelem, kterým se budeme věnovat v následující kapitole.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte HTML soubor** (`js_cviceni.html`) se základní strukturou.
2.  **Připojte externí JavaScriptový soubor** (`skripty/cviceni.js`) na konec `<body>`.
3.  **V `skripty/cviceni.js` vyzkoušejte následující:**
    * Deklarujte proměnnou `jmeno` pomocí `let` a přiřaďte jí své jméno (řetězec).
    * Deklarujte konstantu `ROK_NAROZENI` a přiřaďte jí svůj rok narození (číslo).
    * Vypočítejte svůj přibližný věk a uložte ho do proměnné `vek`.
    * Pomocí `console.log()` vypište do konzole větu ve formátu: "Jmenuji se [jmeno], je mi [vek] let a narodil(a) jsem se v roce [ROK_NAROZENI]." (Použijte template literals).
    * Napište podmínku `if`, která zkontroluje, zda je váš věk větší nebo roven 18. Pokud ano, vypište do konzole "Jsem plnoletý/á.". Jinak vypište "Nejsem plnoletý/á.".
    * Vytvořte pole `oblibeneBarvy` s alespoň třemi vašimi oblíbenými barvami (řetězce).
    * Pomocí `for...of` cyklu vypište každou barvu z pole `oblibeneBarvy` do konzole.
    * Napište funkci `pozdravUzivatele(jmenoUzivatele)`, která přijme jako argument jméno a do konzole vypíše "Ahoj, [jmenoUzivatele]!". Zavolejte tuto funkci se svým jménem.
    * Vytvořte objekt `student` s vlastnostmi: `jmeno` (vaše jméno), `prijmeni` (vaše příjmení), `obor` (váš studijní obor) a metodou `celeJmeno()`, která vrátí řetězec "Jméno Příjmení". Vypište do konzole `student.obor` a výsledek volání `student.celeJmeno()`.
4.  **Otevřete `js_cviceni.html` v prohlížeči** a zkontrolujte výstupy v konzoli (F12).

*(Experimentujte s různými hodnotami a operátory, abyste si osvojili základy.)*
