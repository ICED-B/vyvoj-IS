# 7. Úvod do TypeScriptu: Typový systém, rozdíly oproti JavaScriptu, konfigurace

Zatímco JavaScript je dynamicky typovaný jazyk, což přináší flexibilitu, u větších projektů může vést k chybám, které se projeví až za běhu aplikace. **TypeScript (TS)** řeší tento problém tím, že přidává do JavaScriptu **statický typový systém** a další funkce, které usnadňují vývoj robustnějších a lépe udržitelných aplikací.

## Co je TypeScript?

* **Nadstavba JavaScriptu (Superset of JavaScript):** Každý platný JavaScriptový kód je také platným TypeScriptovým kódem. TypeScript rozšiřuje JavaScript o volitelné statické typování, třídy, rozhraní, generika a další moderní programovací konstrukce.
* **Kompilovaný do JavaScriptu:** Kód napsaný v TypeScriptu (soubory s příponou `.ts` nebo `.tsx` pro React komponenty) se **nepouští přímo v prohlížeči**. Musí být nejprve **zkompilován (transpilován)** do čistého JavaScriptu pomocí TypeScript kompilátoru (`tsc`). Výsledný JavaScriptový kód pak může běžet v jakémkoli prohlížeči nebo Node.js prostředí.
* **Open-source:** Vyvíjen a udržován společností Microsoft.

## Proč používat TypeScript? (Výhody)

1.  **Statická typová kontrola:**
    * **Odhalení chyb při kompilaci:** Největší výhoda. Typové chyby (např. předání řetězce funkci, která očekává číslo, překlepy v názvech vlastností objektů) jsou odhaleny již během vývoje (v editoru) a při kompilaci, nikoli až za běhu aplikace u uživatele.
    * **Lepší predikovatelnost kódu:** Díky typům je jasnější, jaká data funkce přijímají a vracejí, a jaká je struktura objektů.
2.  **Lepší podpora v editorech (IntelliSense):**
    * Editory jako VS Code dokážou díky typovým informacím poskytovat přesnější našeptávání, automatické doplňování, refaktorování a detekci chyb v reálném čase.
3.  **Snazší údržba a refaktorování:**
    * Typy slouží jako dokumentace. Při změnách v kódu kompilátor pomůže odhalit místa, která je potřeba upravit.
4.  **Vhodný pro velké projekty a týmovou spolupráci:**
    * Jasně definovaná rozhraní a typy usnadňují spolupráci více vývojářů na jednom projektu.
5.  **Přístup k moderním JavaScriptovým funkcím:**
    * TypeScript umožňuje používat nejnovější funkce ECMAScriptu (i ty, které ještě nejsou plně podporovány všemi prohlížeči) a kompilátor je převede do kompatibilního JavaScriptu.
6.  **Postupná adopce:**
    * TypeScript lze do existujícího JavaScriptového projektu přidávat postupně. Můžete začít typovat jen některé části a zbytek nechat jako JavaScript.

## Klíčové rozdíly a funkce oproti JavaScriptu

### 1. Typové anotace (Type Annotations)

Umožňují explicitně definovat typy pro proměnné, parametry funkcí a návratové hodnoty funkcí.

```typescript
let jmeno: string = "Alice";
let vek: number = 30;
let jeStudent: boolean = false;
let konicky: string[] = ["čtení", "plavání"]; // Pole řetězců
let osoba: { jmeno: string, vek: number } = { jmeno: "Bob", vek: 25 };

function pozdrav(jmenoOsoby: string): string {
    return `Ahoj, ${jmenoOsoby}!`;
}

function vypisZpravu(zprava: string): void { // void znamená, že funkce nic nevrací
    console.log(zprava);
}

// jmeno = 123; // Chyba: Typ 'number' nelze přiřadit typu 'string'.
// vek = "čtyřicet"; // Chyba
```

### 2. Základní typy

TypeScript rozšiřuje základní typy JavaScriptu:

* **`string`**: Textové řetězce.
* **`number`**: Čísla (celá i desetinná).
* **`boolean`**: `true` nebo `false`.
* **`array`**: Pole. Lze definovat typ prvků: `number[]` (pole čísel), `Array<string>` (pole řetězců - generický typ).
* **`object`**: Obecný objekt (méně specifický než definice konkrétní struktury).
* **`any`**: Speciální typ, který reprezentuje jakoukoli hodnotu. **Používat s rozvahou**, protože vypíná typovou kontrolu pro danou proměnnou/výraz. Často se používá při migraci JS kódu nebo při práci s dynamickými daty.
* **`unknown`**: Podobný `any`, ale bezpečnější. Proměnnou typu `unknown` nelze přímo použít, dokud se neověří její typ (např. pomocí `typeof` nebo type assertion).
* **`void`**: Používá se jako návratový typ funkcí, které nic nevracejí.
* **`null`** a **`undefined`**: Mají své vlastní typy `null` a `undefined`. Ve výchozím nastavení jsou podtypy všech ostatních typů (lze změnit pomocí `strictNullChecks` v `tsconfig.json`).
* **`never`**: Reprezentuje typ hodnoty, která se nikdy nevyskytne (např. funkce, která vždy vyhodí výjimku nebo nekonečný cyklus).
* **`enum` (Výčtový typ):** Umožňuje definovat sadu pojmenovaných konstant.
    ```typescript
    enum Barva { Cervena, Zelena, Modra }
    let c: Barva = Barva.Zelena; // c má hodnotu 1 (číselný enum)

    enum StatusObjednavky {
        Prijata = "PRIJATA",
        ZpracovavaSe = "ZPRACOVAVA_SE",
        Odeslana = "ODESLANA",
        Dorucena = "DORUCENA"
    }
    let status: StatusObjednavky = StatusObjednavky.Odeslana; // status má hodnotu "ODESLANA"
    ```

### 3. Rozhraní (Interfaces)

Rozhraní definují **kontrakt (strukturu)**, kterou musí objekty splňovat. Používají se k definování tvaru objektů.

```typescript
interface Uzivatel {
    id: number;
    jmeno: string;
    email: string;
    jeAktivni: boolean;
    telefon?: string; // Otazník znamená volitelnou vlastnost
    readonly apiKlic: string; // Vlastnost jen pro čtení
}

function zobrazUzivatele(uzivatel: Uzivatel): void {
    console.log(`ID: ${uzivatel.id}, Jméno: ${uzivatel.jmeno}, Email: ${uzivatel.email}`);
    if (uzivatel.telefon) {
        console.log(`Telefon: ${uzivatel.telefon}`);
    }
}

let mujUzivatel: Uzivatel = {
    id: 1,
    jmeno: "Karel",
    email: "[email protected]",
    jeAktivni: true,
    apiKlic: "xyz123"
    // telefon zde není, což je v pořádku, protože je volitelný
};

zobrazUzivatele(mujUzivatel);
// mujUzivatel.apiKlic = "abc"; // Chyba: apiKlic je jen pro čtení
```
Rozhraní lze také použít pro definování tvaru funkcí nebo tříd (implementace rozhraní).

### 4. Typové aliasy (Type Aliases)

Umožňují vytvořit vlastní název pro jakýkoli typ.

```typescript
type Identifikator = number | string; // Union type - ID může být číslo nebo řetězec
type Bod = { x: number; y: number };
type CallbackFunkce = (data: any) => void;

let mojeId: Identifikator = "abc-123";
let dalsiId: Identifikator = 101;

let startovniBod: Bod = { x: 0, y: 0 };
```

### 5. Union typy (Sjednocení typů)

Proměnná může mít jeden z několika možných typů. Používá se operátor `|`.

```typescript
let vysledek: string | number;
vysledek = "Výhra!";
vysledek = 100;
// vysledek = true; // Chyba
```

### 6. Literálové typy (Literal Types)

Umožňují specifikovat přesné hodnoty, které proměnná může nabývat.

```typescript
type Zarovnani = "left" | "center" | "right";
let textZarovnani: Zarovnani;
textZarovnani = "center";
// textZarovnani = "justify"; // Chyba: "justify" není povolená hodnota
```

### 7. Generika (Generics)

Umožňují psát znovupoužitelný kód, který může pracovat s různými typy, aniž by ztratil typovou bezpečnost.

```typescript
function vratPrvniPrvek<T>(pole: T[]): T | undefined {
    return pole.length > 0 ? pole[0] : undefined;
}

let cisla = [1, 2, 3];
let prvniCislo: number | undefined = vratPrvniPrvek(cisla); // T je odvozeno jako number

let retezce = ["a", "b", "c"];
let prvniRetezec: string | undefined = vratPrvniPrvek(retezce); // T je odvozeno jako string
```

### 8. Třídy (Classes)

TypeScript plně podporuje ES6 třídy a rozšiřuje je o typové anotace, modifikátory přístupu (`public`, `private`, `protected`), abstraktní třídy atd.

```typescript
class Zvire {
    public jmeno: string; // public je výchozí
    private vek: number; // Přístupné pouze uvnitř třídy Zvire

    constructor(jmeno: string, vek: number) {
        this.jmeno = jmeno;
        this.vek = vek;
    }

    public pohyb(vzdalenostVMetrech: number = 0): void {
        console.log(`${this.jmeno} se pohnulo o ${vzdalenostVMetrech}m.`);
    }
}

class Pes extends Zvire {
    constructor(jmeno: string, vek: number) {
        super(jmeno, vek); // Volání konstruktoru rodičovské třídy
    }

    stekej(): void {
        console.log("Haf haf!");
    }

    // Přepsání metody rodiče
    public pohyb(vzdalenostVMetrech: number = 5): void {
        console.log("Běžím...");
        super.pohyb(vzdalenostVMetrech);
    }
}

let rex = new Pes("Rex", 5);
rex.pohyb(10);
rex.stekej();
// console.log(rex.vek); // Chyba: vek je private
```

## Nastavení a konfigurace TypeScriptu

1.  **Instalace TypeScriptu:**
    Globálně (pro použití `tsc` příkazu kdekoli):
    ```bash
    npm install -g typescript
    ```
    Nebo lokálně v projektu (doporučeno):
    ```bash
    npm install --save-dev typescript
    # nebo
    yarn add --dev typescript
    ```

2.  **Konfigurační soubor `tsconfig.json`:**
    Tento soubor v kořenovém adresáři projektu říká TypeScript kompilátoru (`tsc`), jak má projekt kompilovat. Lze ho vygenerovat příkazem:
    ```bash
    tsc --init
    ```
    Obsahuje mnoho voleb, např.:
    * `target`: Verze JavaScriptu, do které se má kompilovat (např. `"ES2016"`, `"ESNext"`).
    * `module`: Systém modulů (např. `"commonjs"`, `"es2015"`).
    * `outDir`: Adresář pro výstupní JavaScript soubory (např. `"./dist"`).
    * `rootDir`: Kořenový adresář vstupních TypeScript souborů (např. `"./src"`).
    * `strict`: Zapíná sadu striktních typových kontrol (doporučeno, např. `strictNullChecks`, `noImplicitAny`).
    * `esModuleInterop`: Umožňuje lepší interoperabilitu s CommonJS moduly.
    * `jsx`: Pokud používáte React (`"preserve"` nebo `"react-jsx"`).

    Příklad základního `tsconfig.json` pro projekt s Next.js (Next.js si ho často generuje samo):
    ```json
    {
      "compilerOptions": {
        "target": "es5", // Cílová verze JS
        "lib": ["dom", "dom.iterable", "esnext"], // Dostupné knihovny typů
        "allowJs": true, // Povolit i JS soubory
        "skipLibCheck": true, // Přeskočit kontrolu typů v deklaračních souborech
        "strict": true, // Zapnout striktní kontroly
        "forceConsistentCasingInFileNames": true,
        "noEmit": true, // Next.js se stará o emitování JS, tsc jen kontroluje typy
        "esModuleInterop": true,
        "module": "esnext", // Systém modulů
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve", // Pro JSX v Reactu
        "incremental": true,
        "baseUrl": ".", // Pro absolutní importy
        "paths": { // Aliasy pro importy
          "@/*": ["./src/*"]
        }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"], // Které soubory zahrnout
      "exclude": ["node_modules"] // Které soubory vyloučit
    }
    ```

3.  **Kompilace:**
    Pokud máte TypeScript nainstalovaný globálně nebo lokálně a `scripts` v `package.json`, můžete kompilovat:
    ```bash
    tsc
    ```
    Nebo pokud je v `package.json` skript (např. `"build": "tsc"`):
    ```bash
    npm run build
    ```
    V projektech s Next.js, Vite, Create React App atd. je TypeScript kompilátor často integrován do vývojového a build procesu, takže `tsc` nemusíte volat přímo.

## Příklad: "Hello World" v TypeScriptu

1.  Vytvořte soubor `hello.ts`:
    ```typescript
    function pozdravSvet(jmeno: string): string {
        return `Ahoj, ${jmeno}! Vítej ve světě TypeScriptu.`;
    }

    let uzivatel: string = "Student";
    console.log(pozdravSvet(uzivatel));

    // Zkuste přiřadit číslo, abyste viděli chybu od kompilátoru/editoru:
    // uzivatel = 123;
    ```
2.  Zkompilujte ho (pokud nemáte build proces, který to dělá automaticky):
    ```bash
    tsc hello.ts
    ```
    Vytvoří se soubor `hello.js`.
3.  Spusťte `hello.js` (např. v Node.js nebo v HTML stránce):
    ```bash
    node hello.js
    ```
    Výstup: `Ahoj, Student! Vítej ve světě TypeScriptu.`

## Shrnutí

TypeScript je mocný nástroj, který přináší výhody statického typování do světa JavaScriptu. Pomáhá psát čistší, robustnější a lépe udržitelný kód, zejména ve větších projektech. Jeho integrace s moderními frameworky jako React (pomocí Next.js) je dnes velmi běžná a doporučovaná.

---

### Cvičení (Samostatná práce)

1.  **Nastavení TypeScript projektu (pokud ještě nemáte):**
    * Vytvořte nový adresář pro cvičení.
    * Inicializujte Node.js projekt: `npm init -y`
    * Nainstalujte TypeScript: `npm install --save-dev typescript`
    * Vygenerujte `tsconfig.json`: `npx tsc --init` (nebo `yarn tsc --init`)
    * V `tsconfig.json` můžete pro začátek nastavit `outDir` na `"./dist"` a `rootDir` na `"./src"`. Vytvořte adresář `src`.
2.  **Vytvořte soubor `src/cviceni.ts` a v něm:**
    * Definujte `interface` s názvem `Produkt` s vlastnostmi:
        * `id` (typ `number`)
        * `nazev` (typ `string`)
        * `cena` (typ `number`)
        * `skladem` (typ `boolean`, volitelná)
    * Vytvořte pole (`array`) několika objektů typu `Produkt`.
    * Napište funkci `vypisProdukty(produkty: Produkt[]): void`, která přijme pole produktů a vypíše do konzole název a cenu každého produktu. Pokud je produkt skladem (a vlastnost `skladem` je `true`), přidejte k výpisu "(Skladem)".
    * Napište funkci `najdiProduktPodleId(id: number, produkty: Produkt[]): Produkt | undefined`, která najde a vrátí produkt podle ID, nebo `undefined`, pokud produkt neexistuje.
    * Zavolejte obě funkce s vaším polem produktů a výsledky vypište do konzole.
3.  **Zkompilujte a spusťte:**
    * Zkompilujte kód: `npx tsc` (nebo `yarn tsc`). Měl by se vytvořit soubor `dist/cviceni.js`.
    * Spusťte zkompilovaný JavaScript: `node dist/cviceni.js`.
4.  **Experimentujte:** Zkuste úmyslně vytvořit typovou chybu (např. přiřadit řetězec do `cena` produktu) a sledujte, jak TypeScript kompilátor (a váš editor) chybu ohlásí.

*(Toto cvičení vám pomůže osahat si základní syntaxi TypeScriptu, práci s typy, rozhraními a kompilací.)*
