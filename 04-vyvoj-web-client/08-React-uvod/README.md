# 8. Úvod do Reactu (s TypeScriptem): JSX, komponenty, props, state (useState)

Po seznámení se základy HTML, CSS, JavaScriptu a TypeScriptu se nyní ponoříme do **Reactu**. React je populární JavaScriptová (a TypeScriptová) knihovna pro vytváření uživatelských rozhraní (UI), zejména pro jednostránkové aplikace (Single Page Applications - SPAs).

## Co je React?

* **JavaScriptová knihovna, ne framework:** React se primárně stará o vykreslování UI a správu jeho stavu. Pro další aspekty aplikace (jako routování nebo komplexní správa globálního stavu) se často používají doplňující knihovny.
* **Komponentově orientovaný (Component-Based):** Uživatelské rozhraní se skládá z malých, znovupoužitelných a izolovaných částí nazývaných **komponenty**. Každá komponenta má vlastní logiku a vzhled.
* **Deklarativní:** Popisujete, *jak* má UI vypadat v určitém stavu, a React se postará o efektivní aktualizaci DOMu, aby tomuto stavu odpovídal. Nemusíte ručně manipulovat s DOM elementy jako v čistém JavaScriptu.
* **Virtual DOM:** React používá tzv. virtuální DOM. Když se stav komponenty změní, React nejprve aktualizuje tuto virtuální reprezentaci DOMu, porovná ji s předchozí verzí, zjistí minimální potřebné změny a teprve ty pak efektivně promítne do skutečného DOMu v prohlížeči. To vede k lepšímu výkonu.

## Proč React s TypeScriptem?

Kombinace Reactu s TypeScriptem přináší výhody statického typování do vývoje UI:

* **Typová bezpečnost pro props:** Můžete přesně definovat, jaké vlastnosti (props) komponenta očekává a jakého jsou typu.
* **Typová bezpečnost pro state:** Typy pro stav komponenty pomáhají předcházet chybám při jeho aktualizaci a používání.
* **Lepší čitelnost a údržba:** Typy slouží jako dokumentace a usnadňují pochopení kódu, zejména ve větších týmech a projektech.
* **Vylepšená podpora v editorech:** Přesnější našeptávání, refaktorování a odhalování chyb v reálném čase.

## Vytvoření React + TypeScript projektu pomocí Vite

**Vite** ([https://vitejs.dev/](https://vitejs.dev/)) je moderní a extrémně rychlý buildovací nástroj pro frontendové projekty. Nabízí šablony pro různé frameworky, včetně Reactu s TypeScriptem.

**Předpoklady:**
* Nainstalovaný Node.js (LTS verze) a npm (nebo yarn).

**Postup vytvoření projektu:**

1.  **Otevřete terminál** nebo příkazovou řádku.
2.  **Spusťte příkaz pro vytvoření nového Vite projektu:**
    ```bash
    npm create vite@latest muj-react-ts-projekt -- --template react-ts
    ```
    Nebo pomocí yarn:
    ```bash
    yarn create vite muj-react-ts-projekt --template react-ts
    ```
    * `muj-react-ts-projekt`: Nahraďte názvem vašeho projektu.
    * `--template react-ts`: Specifikuje šablonu pro React s TypeScriptem.

3.  **Přejděte do adresáře projektu:**
    ```bash
    cd muj-react-ts-projekt
    ```

4.  **Nainstalujte závislosti:**
    ```bash
    npm install
    # nebo
    yarn
    ```

5.  **Spusťte vývojový server:**
    ```bash
    npm run dev
    # nebo
    yarn dev
    ```
    Vite spustí vývojový server (obvykle na `http://localhost:5173` nebo podobném portu) s podporou Hot Module Replacement (HMR) pro okamžité promítnutí změn v kódu bez nutnosti obnovovat stránku.

**Struktura projektu (zjednodušeně):**
* `public/`: Statické soubory, které se kopírují do build adresáře (např. `favicon.ico`).
* `src/`: Hlavní adresář se zdrojovým kódem vaší aplikace.
    * `main.tsx`: Vstupní bod aplikace, kde se React aplikace renderuje do HTML.
    * `App.tsx`: Hlavní komponenta aplikace.
    * `vite-env.d.ts`: Deklarační soubor pro typy specifické pro Vite.
    * `assets/`: Adresář pro obrázky, fonty atd.
* `index.html`: Hlavní HTML soubor, do kterého se React aplikace vkládá.
* `package.json`: Definuje závislosti a skripty projektu.
* `tsconfig.json`: Konfigurace TypeScript kompilátoru.
* `vite.config.ts`: Konfigurační soubor pro Vite.

## Klíčové koncepty Reactu (s TypeScriptem)

### 1. Komponenty (Components)

Komponenty jsou základní stavební bloky React aplikací. Jsou to znovupoužitelné, nezávislé části UI. V moderním Reactu se píší převážně jako **funkcionální komponenty**.

* **Funkcionální komponenta:** Je to JavaScriptová/TypeScriptová funkce, která přijímá objekt vlastností (props) a vrací React element (typicky JSX), který popisuje, jak má daná část UI vypadat.
* Názvy komponent musí začínat velkým písmenem (např. `MojeKomponenta`).
* Soubory s React komponentami používající JSX mají příponu `.tsx` (pokud používají TypeScript) nebo `.jsx`.

```typescript
// src/components/Pozdrav.tsx
import React from 'react'; // Import Reactu je nutný pro JSX

// Definice typu pro props komponenty
interface PozdravProps {
  jmeno: string;
  vek?: number; // Volitelný prop
}

// Funkcionální komponenta Pozdrav
const Pozdrav: React.FC<PozdravProps> = (props) => {
  return (
    <div>
      <h1>Ahoj, {props.jmeno}!</h1>
      {props.vek && <p>Je ti {props.vek} let.</p>} {/* Podmíněné renderování */}
    </div>
  );
};

export default Pozdrav;
```
* `React.FC<PozdravProps>`: Typ pro funkcionální komponentu, který specifikuje typ jejích props. `FC` je zkratka pro Functional Component.

### 2. JSX (JavaScript XML)

JSX je syntaktické rozšíření JavaScriptu, které umožňuje psát HTML-like struktury přímo v JavaScriptovém/TypeScriptovém kódu. Není to HTML, ale syntaxe, která se překládá (transpiluje) na volání `React.createElement()`.

**Základní pravidla JSX:**
* **Jeden kořenový element:** Každá komponenta musí vracet pouze jeden kořenový element. Pokud potřebujete vrátit více elementů, obalte je do fragmentu (`<React.Fragment>...</React.Fragment>` nebo kratší syntaxe `<>...</>`).
* **Atributy jako v HTML, ale s camelCase:** Většina HTML atributů se používá stejně, ale ty, které v HTML obsahují pomlčku (např. `class`, `for`, `tabindex`), se v JSX píší pomocí `camelCase` (např. `className`, `htmlFor`, `tabIndex`).
* **JavaScriptové výrazy ve složených závorkách `{}`:** Umožňují vkládat JavaScriptové proměnné, funkce nebo výrazy přímo do JSX.
    ```typescript
    const uzivatel = "Svět";
    const element = <h1>Ahoj, {uzivatel}! Dnes je {new Date().toLocaleDateString()}.</h1>;
    ```
* **Komentáře v JSX:** ` {/* Toto je komentář v JSX */} `

### 3. Props (Vlastnosti)

Props (zkratka pro "properties") slouží k předávání dat z rodičovské komponenty do dceřiné. Jsou **read-only** – dceřiná komponenta by neměla props přímo modifikovat.

```typescript
// V rodičovské komponentě (např. App.tsx)
import Pozdrav from './components/Pozdrav';

function App() {
  return (
    <div>
      <Pozdrav jmeno="Petra" vek={28} />
      <Pozdrav jmeno="Tomáš" />
    </div>
  );
}
export default App;
```
V komponentě `Pozdrav` (viz výše) přistupujeme k těmto hodnotám přes `props.jmeno` a `props.vek`. TypeScript nám zde pomáhá zajistit, že předáváme správné typy props.

### 4. State (Stav)

State reprezentuje data, která jsou **privátní** dané komponentě a mohou se v čase měnit na základě interakcí uživatele nebo jiných událostí. Když se state změní, React automaticky znovu vykreslí (re-renderuje) komponentu a její potomky, aby se UI aktualizovalo.

Pro správu stavu ve funkcionálních komponentách se používá hook **`useState`**.

* **`useState<TypStavu>(pocatecniStav)`**:
    * Vrací pole se dvěma hodnotami:
        1.  Aktuální hodnota stavu.
        2.  Funkce pro aktualizaci tohoto stavu.
    * `<TypStavu>` je generický typový parametr pro definování typu stavové proměnné.
    * `pocatecniStav` je výchozí hodnota stavu.

```typescript
// src/components/Pocitadlo.tsx
import React, { useState } from 'react';

interface PocitadloProps {
  pocatecniHodnota?: number;
}

const Pocitadlo: React.FC<PocitadloProps> = ({ pocatecniHodnota = 0 }) => {
  // Deklarace stavové proměnné 'pocet' a funkce 'nastavPocet' pro její změnu
  // Typ stavu 'pocet' je odvozen jako 'number' z počáteční hodnoty
  const [pocet, nastavPocet] = useState<number>(pocatecniHodnota);

  const zvysPocet = () => {
    nastavPocet(aktualniPocet => aktualniPocet + 1); // Funkční aktualizace stavu
  };

  const snizPocet = () => {
    nastavPocet(pocet - 1); // Přímá aktualizace stavu
  };

  return (
    <div>
      <h2>Počítadlo</h2>
      <p>Aktuální počet: {pocet}</p>
      <button onClick={zvysPocet}>Přidat +1</button>
      <button onClick={snizPocet}>Ubrat -1</button>
    </div>
  );
};

export default Pocitadlo;
```
**Důležité:**
* Nikdy neměňte state přímo (např. `pocet = pocet + 1;`). Vždy používejte funkci pro nastavení stavu (zde `nastavPocet`).
* Aktualizace stavu je asynchronní. React může dávkovat více aktualizací pro optimalizaci výkonu. Pokud nový stav závisí na předchozím, je lepší použít funkční formu `setStav(predchoziStav => ...)`.

### 5. Hooks (Úvod)

Hooks jsou funkce, které umožňují "zaháknout se" do stavu a životního cyklu Reactu z funkcionálních komponent. Byly zavedeny v Reactu 16.8.

* **`useState`**: Pro přidání lokálního stavu do funkcionálních komponent (viz výše).
* **`useEffect`**: Pro provádění vedlejších efektů (side effects) v komponentách. Mezi vedlejší efekty patří např. načítání dat z API, manuální změny DOMu, přihlašování k odběrům (subscriptions). Tomuto hooku se budeme věnovat podrobněji později.

Existuje více vestavěných hooků (`useContext`, `useReducer`, `useCallback`, `useMemo`, `useRef`) a možnost vytvářet si vlastní.

## Jednoduchý "Hello World" v Reactu s TypeScriptem

Upravme soubor `src/App.tsx` vygenerovaný Vitem:

```typescript
// src/App.tsx
import React, { useState } from 'react';
import './App.css'; // Můžete si vytvořit základní CSS

// Jednoduchá komponenta
interface OsobniPozdravProps {
  osloveni: string;
}
const OsobniPozdrav: React.FC<OsobniPozdravProps> = ({ osloveni }) => {
  return <h2>Vítej zpět, {osloveni}!</h2>;
}

function App() {
  const [jmeno, setJmeno] = useState<string>("Uživateli");
  const [pocetKliknuti, setPocetKliknuti] = useState<number>(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Moje první React (TS) aplikace</h1>
        <OsobniPozdrav osloveni={jmeno} />
        
        <input 
          type="text" 
          placeholder="Zadej jméno" 
          value={jmeno === "Uživateli" ? "" : jmeno} // Aby placeholder nebyl přepsán výchozí hodnotou
          onChange={(e) => setJmeno(e.target.value || "Uživateli")} // Pokud je prázdné, vrátíme výchozí
          style={{ padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <p>Počet kliknutí na tlačítko: {pocetKliknuti}</p>
        <button 
          onClick={() => setPocetKliknuti(pocetKliknuti + 1)}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Klikni na mě!
        </button>
      </header>
    </div>
  );
}

export default App;
```
A můžete si vytvořit jednoduchý `src/App.css` (Vite ho standardně negeneruje, ale můžete si ho přidat a importovat):
```css
/* src/App.css */
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
```

## Spuštění React aplikace

Jak již bylo zmíněno, po instalaci závislostí (`npm install` nebo `yarn`) spustíte vývojový server pomocí:
```bash
npm run dev
# nebo
yarn dev
```
Otevřete adresu zobrazenou v terminálu (obvykle `http://localhost:5173`) ve vašem prohlížeči.

## Shrnutí

React je výkonná knihovna pro tvorbu moderních uživatelských rozhraní. Jeho komponentová architektura, deklarativní přístup a použití virtuálního DOMu usnadňují vývoj komplexních aplikací. Kombinace s TypeScriptem přidává typovou bezpečnost a zlepšuje celkovou kvalitu kódu. Klíčové koncepty jako JSX, props a state (spravovaný pomocí hooku `useState`) jsou základem pro pochopení fungování Reactu.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte nový React + TypeScript projekt** pomocí Vite, pokud jste tak ještě neučinili (např. `muj-prvni-react-app`).
2.  **Vytvořte komponentu `ProduktKarta.tsx`** v adresáři `src/components/`:
    * Komponenta by měla přijímat `props` s následující strukturou (definujte `interface ProduktKartaProps`):
        * `nazev: string`
        * `cena: number`
        * `obrazekUrl?: string` (volitelný)
        * `popis: string`
    * Komponenta by měla zobrazit tyto informace ve formátu jednoduché "karty" (použijte základní HTML a případně trochu inline stylů nebo tříd, pokud chcete experimentovat s CSS).
    * Pokud `obrazekUrl` není poskytnut, nezobrazujte `<img>` tag.
3.  **V `App.tsx`:**
    * Importujte a použijte vaši komponentu `ProduktKarta` alespoň dvakrát s různými daty.
    * (Volitelně) Vytvořte pole objektů s daty produktů a pomocí metody `map()` dynamicky vyrenderujte více `ProduktKarta` komponent.
4.  **Přidejte jednoduchý stav do `App.tsx`:**
    * Pomocí `useState` přidejte stavovou proměnnou, např. `zobrazitDalsiInfo` (boolean, výchozí `false`).
    * Přidejte tlačítko, které po kliknutí bude tento stav přepínat (`true`/`false`).
    * Podmíněně zobrazte nějaký text nebo další komponentu na základě hodnoty stavu `zobrazitDalsiInfo`.
5.  Spusťte aplikaci a otestujte její funkčnost.

*(Toto cvičení vám pomůže prakticky si vyzkoušet tvorbu komponent, práci s props, JSX a základní použití stavu s hookem `useState` v TypeScriptovém React projektu.)*
