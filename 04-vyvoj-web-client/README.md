# Vývoj webových aplikací - Klientská část (Frontend)

Tato část předmětu se věnuje vývoji klientské části (frontendu) webových aplikací. Poté, co jsme v předchozí sekci vytvořili serverovou logiku (backend) a API, se nyní zaměříme na to, co uživatel vidí a s čím přímo interaguje ve svém webovém prohlížeči.

Frontend je zodpovědný za vizuální prezentaci dat, uživatelské rozhraní a interakci s uživatelem. Komunikuje s backendem prostřednictvím API, aby získal data a odeslal uživatelské vstupy.

## 1. Cíle této části předmětu

Po absolvování této části byste měli:

* Rozumět základním stavebním kamenům webu: **HTML, CSS a JavaScript**.
* Být schopni vytvářet strukturované a sémantické webové stránky pomocí **HTML**.
* Umět stylovat webové stránky a vytvářet responzivní design pomocí **CSS** a moderních CSS frameworků (jako příklad si ukážeme **Tailwind CSS**).
* Ovládat základy **JavaScriptu** pro přidání interaktivity a dynamického chování na straně klienta.
* Rozumět konceptu **DOM (Document Object Model)** a umět s ním manipulovat pomocí JavaScriptu.
* Chápat výhody typového systému a umět používat **TypeScript** pro robustnější vývoj.
* Získat praktické zkušenosti s moderní JavaScriptovou knihovnou/frameworkem pro tvorbu uživatelských rozhraní, konkrétně s **Reactem** (s využitím TypeScriptu) 
<!-- (a jeho frameworkem Next.js jako příkladem). -->
* Umět vytvářet komponentové uživatelské rozhraní, spravovat stav aplikace a komunikovat s backendovým API z React aplikace.
* Chápat principy asynchronní komunikace s API (**fetch, async/await**).

## 2. Klíčové koncepty

V této části se budeme zabývat následujícími tématy:

* **HTML (HyperText Markup Language):**
    * Struktura webových stránek (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
    * Sémantické elementy (např. `<header>`, `<footer>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`).
    * Základní tagy pro text (`<h1>`-`<h6>`, `<p>`, `<span>`, `<strong>`, `<em>`), seznamy (`<ul>`, `<ol>`, `<li>`), odkazy (`<a>`), obrázky (`<img>`).
    * Tabulky (`<table>`, `<tr>`, `<th>`, `<td>`).
    * Formuláře: Element `<form>` a jeho atributy, vstupní prvky (`<input>` s různými typy jako `text`, `password`, `email`, `number`, `date`, `checkbox`, `radio`, `submit`, `button`), `<select>`, `<option>`, `<textarea>`, `<label>`.
    * Atributy HTML elementů (globální jako `id`, `class`, `style`, `data-*`; specifické pro elementy).
* **CSS (Cascading Style Sheets):**
    * Způsoby vkládání CSS (inline, interní, externí).
    * Selektory: Základní (typ, třída, ID), atributové, kombinátory (potomek, následník, sourozenec), pseudotřídy (např. `:hover`, `:focus`, `:nth-child`), pseudoelementy (např. `::before`, `::after`).
    * Kaskáda, specificita a dědičnost.
    * Box model: `content`, `padding`, `border`, `margin`. Vlastnosti `width`, `height`, `box-sizing`.
    * Jednotky: Absolutní (`px`, `pt`), relativní (`em`, `rem`, `%`, `vw`, `vh`).
    * Barvy (názvy, hex, RGB, HSL), pozadí (`background-color`, `background-image`).
    * Typografie: `font-family`, `font-size`, `font-weight`, `line-height`, `text-align`, `text-decoration`.
    * Layoutovací techniky:
        * **Flexbox:** Koncept kontejneru a položek, hlavní a příčná osa, vlastnosti (`display: flex`, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `flex-grow`, `flex-shrink`, `flex-basis`).
        * **CSS Grid:** Koncept mřížky, definice řádků a sloupců, umisťování prvků (`display: grid`, `grid-template-columns`, `grid-template-rows`, `grid-gap`, `grid-column`, `grid-row`).
    * Responzivní design: Media queries (`@media`) pro přizpůsobení stylů různým velikostem obrazovek.
    * CSS proměnné (Custom Properties).
    * Základy animací (`@keyframes`, `animation`) a přechodů (`transition`).
    * CSS preprocesory (zmínka, např. SASS/SCSS).
* **JavaScript (JS):**
    * Základy jazyka: Proměnné (`var`, `let`, `const`), datové typy (primitivní: String, Number, Boolean, Null, Undefined, Symbol, BigInt; objekty), operátory (aritmetické, porovnávací, logické, přiřazovací).
    * Řídicí struktury: Podmínky (`if...else`, `switch`), cykly (`for`, `while`, `do...while`, `for...of`, `for...in`).
    * Funkce: Definice (function declaration, function expression, arrow functions), parametry, argumenty, návratové hodnoty, scope (rozsah platnosti), closures.
    * Objekty: Vytváření, vlastnosti, metody, `this`.
    * Pole (Arrays): Vytváření, přístup k prvkům, metody (např. `push`, `pop`, `slice`, `splice`, `forEach`, `map`, `filter`, `reduce`, `find`).
    * **DOM (Document Object Model):**
        * Stromová reprezentace HTML/XML dokumentu.
        * Výběr elementů: `document.getElementById()`, `document.getElementsByClassName()`, `document.getElementsByTagName()`, `document.querySelector()`, `document.querySelectorAll()`.
        * Manipulace s elementy: Čtení a změna obsahu (`innerHTML`, `textContent`), atributů (`getAttribute`, `setAttribute`, `removeAttribute`), stylů (`element.style.property`), tříd (`classList.add`, `classList.remove`, `classList.toggle`).
        * Vytváření a vkládání nových elementů (`document.createElement()`, `appendChild()`, `insertBefore()`).
    * **Události (Events):**
        * Zpracování uživatelských interakcí a systémových událostí.
        * Přidávání event listenerů: `element.addEventListener('typ_udalosti', callback_funkce)`.
        * Objekt události (`event`), `event.preventDefault()`, `event.stopPropagation()`.
        * Běžné typy událostí: `click`, `mouseover`, `mouseout`, `keydown`, `keyup`, `submit`, `load`, `DOMContentLoaded`.
    * **Asynchronní programování:**
        * Callback funkce, problém "callback hell".
        * **Promises:** Reprezentace výsledku asynchronní operace (`Pending`, `Fulfilled`, `Rejected`). Metody `.then()`, `.catch()`, `.finally()`.
        * **Async/Await:** Syntaktický cukr nad Promises pro čitelnější asynchronní kód.
    * **`fetch` API:** Moderní rozhraní pro provádění HTTP požadavků (náhrada za `XMLHttpRequest`). Práce s `Request` a `Response` objekty. Zpracování JSON dat.
    * Základy ES6+ syntaxe: Moduly (`import`/`export`), třídy (zmínka), destrukturalizace, spread/rest operátor, template literals.
    * Chybové stavy a jejich ošetření (`try...catch`).
* **TypeScript (TS)**:
    * Nadstavba JavaScriptu přidávající statický typový systém.
    * Základní typy (number, string, boolean, array, object, any, unknown, void, null, undefined).
    * Vlastní typy: Interface, Type aliasy, Enumy.
    * Generika.
    * Konfigurace TypeScriptu (`tsconfig.json`).
    * Výhody použití TypeScriptu (lepší čitelnost, dřívější odhalení chyb, robustnější kód).
* **React** (jako příklad moderní JS knihovny/frameworku):
    * **Komponentová architektura:** Rozdělení UI do znovupoužitelných, izolovaných komponent.
    * **JSX:** Syntaxe pro psaní HTML-like struktur v JavaScriptu/TypeScriptu.
    * **Props (Vlastnosti):** Mechanismus pro předávání dat z rodičovských komponent do dceřiných (jednosměrný datový tok).
    * **State (Stav):** Interní data komponenty, která se mohou měnit a ovlivňovat její renderování. Správa pomocí hooku `useState`.
    * **Hooks:** Funkce umožňující "zaháknout se" do stavu a životního cyklu Reactu z funkcionálních komponent.
        * `useState`: Pro správu lokálního stavu komponenty.
        * `useEffect`: Pro provádění vedlejších efektů (např. načítání dat, přihlašování k událostem, manuální manipulace s DOM) po renderování komponenty.
        * `useContext`: Pro sdílení stavu napříč komponentami bez nutnosti prop-drillingu (zmínka).
        * `useReducer`: Alternativa k `useState` pro složitější logiku stavu (zmínka).
        * Vlastní hooky (Custom Hooks): Pro extrakci znovupoužitelné logiky komponent.
    * Podmíněné renderování: Zobrazování různých částí UI na základě podmínek.
    * Renderování seznamů: Použití metody `map()` pro dynamické vytváření seznamů elementů.
    * Zpracování formulářů v Reactu: Kontrolované (controlled) a nekontrolované (uncontrolled) komponenty.
    * Routování na straně klienta (Client-Side Routing): Umožňuje navigaci mezi různými "stránkami" aplikace bez nutnosti nového načtení od serveru. 
<!-- (např. pomocí knihovny React Router nebo vestavěného routování v Next.js). -->
<!-- * **Next.js** (jako příklad React frameworku):
    * Základní principy a výhody: Framework postavený nad Reactem, který přidává funkce jako Server-Side Rendering (SSR), Static Site Generation (SSG), optimalizaci obrázků, API routes.
    * Struktura projektu: Adresářová struktura, zejména adresář `pages/` (pro Pages Router) nebo `app/` (pro App Router).
    * File-system routing: Routy jsou automaticky generovány na základě souborů v adresáři `pages/` nebo `app/`.
    * Načítání dat: Různé strategie pro načítání dat pro stránky (např. `getServerSideProps`, `getStaticProps`, `getStaticPaths` pro Pages Router; Server Components a `fetch` v App Routeru).
    * API Routes: Možnost vytvářet backendové API endpointy přímo v Next.js projektu (v adresáři `pages/api/` nebo pomocí Route Handlers v App Routeru). -->

## 3. Používané nástroje (Příklady pro výuku)

Pro praktické ukázky a vysvětlení teoretických konceptů budeme v této části kurzu používat následující technologie. Pamatujte, že pro každý z těchto nástrojů existuje mnoho alternativ.

* **Základní webové technologie:** HTML5, CSS3, JavaScript (ES6+).
* **CSS Framework (příklad):** **Tailwind CSS**. Alternativy: Bootstrap, Materialize, Bulma, Foundation, čisté CSS s vlastními metodikami (BEM, SMACSS).
* **JavaScriptová knihovna/framework (příklad):** **React** Alternativy: Vue.js (s Nuxt.js), Angular, Svelte (se SvelteKit), Ember.js, Preact.
* **Správce balíčků pro JavaScript:** **npm** (Node Package Manager) nebo **yarn**. Tyto nástroje jsou součástí Node.js.
* **Build nástroje (často integrované ve frameworcích):** Webpack, Parcel, Rollup, Vite (Next.js používá vlastní optimalizovaný build systém založený na Webpacku a Turbopacku).
* **Vývojové prostředí:** **VS Code** s doporučenými rozšířeními (např. ESLint, Prettier, Live Server, IntelliSense for CSS class names in HTML, React/Next.js snippets). Budeme využívat **Dev Container** pro frontend z naší projektové šablony.
* **Prohlížečové vývojářské nástroje (Developer Tools):** Nezbytné pro ladění HTML (Elements/Inspector), CSS (Styles), JavaScriptu (Console, Debugger, Network, Application) – např. v Chrome, Firefox, Edge, Safari.
* **Nástroje pro testování API (pro interakci s backendem):** Postman, Insomnia, REST Client (VS Code extension), nebo přímo Swagger UI/OpenAPI dokumentace backendu.

## 4. Praktický příklad: Frontend pro IS Knihovny (nebo váš projekt)

V této sekci budeme postupně vytvářet klientskou část (frontend) pro informační systém, jehož backend jsme připravovali v předchozí sekci. Tento frontend bude:

* Zobrazovat data načtená z backendového API (seznamy knih, autorů, detail knihy atd.).
* Umožňovat vytváření nových záznamů (např. přidání knihy) prostřednictvím formulářů.
* Umožňovat aktualizaci existujících záznamů.
* Umožňovat mazání záznamů (s potvrzením).
* Implementovat uživatelskou navigaci mezi různými pohledy/stránkami aplikace.
* Zahrnovat přihlašování a registraci uživatelů a zobrazovat/skrývat obsah nebo funkce na základě stavu autentizace a (volitelně) autorizace uživatele.
* Poskytovat zpětnou vazbu uživateli (např. notifikace o úspěchu/chybě operace, indikátory načítání).

Začneme jednoduchými HTML a CSS stránkami pro pochopení základů, postupně přidáme JavaScript pro interaktivitu a načítání dat z API, a nakonec přejdeme k tvorbě moderního komponentového UI pomocí Reactu v rámci Next.js projektu z naší projektové šablony.

## 5. Nastavení prostředí

Budeme pracovat s **projektovou šablonou IS**, kterou jste si připravili. Pro vývoj frontendu použijte jednu z následujících metod:

1.  **VS Code Dev Container (Doporučeno):**
    * Otevřete kořenový adresář šablony ve VS Code.
    * Použijte příkaz `Dev Containers: Reopen in Container...` a vyberte konfiguraci pro **frontend**.
    * VS Code se připojí k běžícímu frontend kontejneru se všemi potřebnými nástroji (Node.js, npm/yarn) a rozšířeními. Terminál a debugování budou probíhat uvnitř kontejneru.
    * Pokud adresář `frontend/` neobsahuje `package.json` a základní strukturu Next.js projektu, Dev Container by měl automaticky spustit `npx create-next-app@latest . --tailwind --eslint --app` (nebo podobný příkaz podle konfigurace `.devcontainer/devcontainer.json`) pro inicializaci nového Next.js projektu s Tailwind CSS a ESLint.
2.  **Manuální spuštění:**
    * Ujistěte se, že máte lokálně nainstalovaný Node.js (doporučená LTS verze) a npm/yarn.
    * V adresáři `frontend/` vaší šablony:
        * Pokud projekt ještě neexistuje: Inicializujte nový Next.js projekt, např.:
            ```bash
            npx create-next-app@latest . --tailwind --eslint --app
            ```
            (Tento příkaz vytvoří Next.js projekt v aktuálním adresáři (`.`) s Tailwind CSS, ESLint a novým App Routerem).
        * Pokud `package.json` již existuje: Nainstalujte závislosti:
            ```bash
            npm install
            # nebo
            yarn install
            ```
    * Spusťte vývojový server:
        ```bash
        npm run dev
        # nebo
        yarn dev
        ```

Frontendová aplikace bude typicky dostupná na `http://localhost:3000`. Backendová aplikace (z předchozí sekce) by měla běžet současně (např. na `http://localhost:5000`), aby s ní frontend mohl komunikovat.

## 6. Struktura této části

Materiály budou rozděleny do následujících podsekcí:

1.  [Základy HTML: Struktura dokumentu, základní tagy, sémantika, formuláře](./01-HTML-zaklady/README.md)
2.  [Základy CSS: Selektory, vlastnosti, box model, jednotky, úvod do Flexboxu a Gridu](./02-CSS-zaklady/README.md)
3.  [Responzivní design a CSS Frameworky (Tailwind CSS)](./03-Responzivni-design-Tailwind/README.md)
4.  [Základy JavaScriptu: Proměnné, typy, operátory, funkce, řídicí struktury](./04-JavaScript-zaklady/README.md)
5.  [JavaScript a DOM: Manipulace s HTML elementy, události](./05-JavaScript-DOM-Events/README.md)
6.  [Asynchronní JavaScript: Promise, async/await, fetch API pro komunikaci s backendem](./06-Asynchronni-JS-Fetch/README.md)
7.  [Úvod do TypeScriptu: Typový systém, rozdíly oproti JavaScriptu, konfigurace](./07-TypeScript-zaklady/README.md)
8.  [Úvod do Reactu: JSX, komponenty, props, state (useState)](./08-React-uvod/README.md)
9.  [React Hooks a správa stavu: useEffect, (volitelně useContext, useReducer)](./09-React-Hooks-State/README.md)
10. [Routování v React aplikacích](./10-React-Routing/README.md)
11. [Vytváření formulářů a komunikace s API](./11-ReactForms-API/README.md)
12. [(Volitelně) Pokročilejší témata: Globální správa stavu (Redux, Zustand - zmínka), testování](./12-React-Pokrocilejsi-temata/README.md)

## 7. Předpoklady

* Základní algoritmické myšlení.
* Schopnost pracovat s textovým editorem (doporučeno VS Code).
* Základní orientace v příkazové řádce.
* Znalost základů **Gitu** a **Dockeru** (viz sekce [`00-predpoklady`](../00-predpoklady/README.md)).
* Schopnost spustit a pracovat s poskytnutou šablonou projektu (včetně Dev Containers nebo manuálního spuštění).
* Mít spuštěný a funkční backend (z předchozí sekce), se kterým bude frontend komunikovat.
