# 3. Responzivní design a CSS Frameworky (Tailwind CSS)

V dnešní době uživatelé přistupují na web z nejrůznějších zařízení – od velkých desktopových monitorů přes tablety až po malé obrazovky mobilních telefonů. **Responzivní web design (RWD)** je přístup k návrhu a vývoji webových stránek, jehož cílem je zajistit, aby se layout a obsah stránky optimálně přizpůsobily velikosti obrazovky a orientaci zařízení, na kterém je zobrazena. Stránka by měla být dobře čitelná a snadno ovladatelná na všech zařízeních.

## Klíčové principy responzivního designu

1.  **Fluidní mřížka (Fluid Grid):**
    * Místo pevných šířek layoutu (např. `width: 960px`) se používají relativní jednotky jako procenta (`%`) nebo jednotky viewportu (`vw`).
    * Hlavní bloky layoutu se roztahují nebo smršťují podle dostupné šířky.
    * Příklad: Postranní panel může mít šířku `25%` a hlavní obsah `75%`.

2.  **Flexibilní obrázky a média (Flexible Images/Media):**
    * Obrázky, videa a další média by se měly také přizpůsobovat šířce svého kontejneru, aby nepřetékaly nebo nezpůsobovaly horizontální posuvník.
    * Často se používá CSS pravidlo:
        ```css
        img, video, iframe {
            max-width: 100%; /* Maximální šířka je 100% rodičovského elementu */
            height: auto;    /* Výška se automaticky přizpůsobí pro zachování poměru stran */
        }
        ```

3.  **Media Queries (Dotazy na média):**
    * Jsou základním nástrojem CSS pro aplikaci různých stylů v závislosti na charakteristikách zařízení nebo viewportu (šířka, výška, orientace, rozlišení atd.).
    * Umožňují definovat tzv. **breakpointy (body zlomu)** – šířky obrazovky, při kterých se mění layout nebo vzhled prvků.

## Media Queries

Syntaxe media query:

```css
@media typ_media (podminka_na_vlastnost: hodnota) {
    /* CSS pravidla, která se aplikují, pokud je podmínka splněna */
    selektor {
        vlastnost: hodnota;
    }
}
```

* **`typ_media`**: Určuje typ zařízení. Nejčastěji se používá:
    * `all`: Pro všechna zařízení (výchozí, pokud není uvedeno).
    * `screen`: Pro obrazovky počítačů, tabletů, mobilů.
    * `print`: Pro tiskárny.
    * `speech`: Pro hlasové čtečky.
* **`podminka_na_vlastnost: hodnota`**: Podmínky, které se testují. Běžné vlastnosti:
    * `width`, `height`: Šířka/výška viewportu.
    * `min-width`, `max-width`: Minimální/maximální šířka viewportu. Toto jsou nejčastěji používané pro definování breakpointů.
    * `min-height`, `max-height`: Minimální/maximální výška viewportu.
    * `orientation`: `portrait` (na výšku) nebo `landscape` (na šířku).
    * `aspect-ratio`, `resolution`, atd.

Lze kombinovat více podmínek pomocí `and`, `or`, `not`.

**Příklad použití `max-width` (Mobile First přístup):**

Při přístupu "Mobile First" nejprve stylujeme pro nejmenší obrazovky (mobily) a poté pomocí `min-width` media queries přidáváme nebo upravujeme styly pro větší obrazovky.

```css
/* Základní styly pro mobily (a všechna zařízení) */
.container {
    width: 95%;
    margin: 0 auto;
}

.sidebar {
    display: none; /* Na mobilech skryjeme postranní panel */
}

nav ul li {
    display: block; /* Položky menu pod sebou */
    margin-bottom: 10px;
}

/* Styly pro tablety a větší (např. od 768px) */
@media screen and (min-width: 768px) {
    .container {
        display: flex; /* Použijeme Flexbox pro layout */
    }
    .main-content {
        flex: 3; /* Hlavní obsah zabere 3 díly */
        margin-right: 20px;
    }
    .sidebar {
        display: block; /* Zobrazíme postranní panel */
        flex: 1;        /* Postranní panel zabere 1 díl */
    }
    nav ul li {
        display: inline-block; /* Položky menu vedle sebe */
        margin-right: 15px;
        margin-bottom: 0;
    }
}

/* Styly pro velké desktopy (např. od 1200px) */
@media screen and (min-width: 1200px) {
    .container {
        max-width: 1140px; /* Omezíme maximální šířku kontejneru */
    }
    h1 {
        font-size: 2.5rem; /* Větší nadpis na velkých obrazovkách */
    }
}
```

**Příklad použití `max-width` (Desktop First přístup - méně častý pro RWD):**

Nejprve stylujeme pro velké obrazovky a pak pomocí `max-width` upravujeme pro menší.

```css
/* Styly pro desktopy */
.column {
    width: 33.33%;
    float: left; /* Starší technika */
}

/* Styly pro tablety (např. do 992px) */
@media screen and (max-width: 992px) {
    .column {
        width: 50%;
    }
}

/* Styly pro mobily (např. do 600px) */
@media screen and (max-width: 600px) {
    .column {
        width: 100%;
        float: none;
    }
}
```

**Důležité meta tagy pro responzivitu:**

Nezapomeňte na `<meta name="viewport" content="width=device-width, initial-scale=1.0">` v `<head>` vašeho HTML, jak bylo zmíněno v minulé kapitole. Bez něj se stránka na mobilních zařízeních zobrazí zmenšená, jako by byla na desktopu.

## CSS Frameworky

Vytváření komplexních responzivních layoutů a stylování všech komponent od nuly může být časově náročné. **CSS frameworky** poskytují sadu předpřipravených CSS (a někdy i JavaScriptových) komponent, tříd a nástrojů, které zrychlují a zjednodušují vývoj.

**Výhody CSS frameworků:**
* **Rychlost vývoje:** Předpřipravené komponenty a utility třídy.
* **Konzistence:** Pomáhají udržet jednotný vzhled napříč projektem.
* **Responzivita:** Většina moderních frameworků je postavena s důrazem na responzivní design a nabízí nástroje pro snadné vytváření responzivních layoutů (např. grid systémy, responzivní utility).
* **Komunita a dokumentace:** Populární frameworky mají velkou komunitu a dobrou dokumentaci.
* **Cross-browser kompatibilita:** Tvůrci frameworků se obvykle snaží zajistit, aby jejich komponenty fungovaly dobře ve většině moderních prohlížečů.

**Nevýhody CSS frameworků:**
* **Nárůst velikosti CSS:** I když používáte jen část frameworku, můžete načítat více CSS, než je nutné (moderní nástroje jako PurgeCSS toto řeší).
* **"Stejný vzhled":** Pokud se nepoužije dostatečná customizace, weby postavené na stejném frameworku mohou vypadat podobně.
* **Nutnost naučit se framework:** Vyžaduje čas seznámit se s konvencemi a třídami daného frameworku.

**Příklady populárních CSS frameworků:**
* **Bootstrap:** Jeden z nejstarších a nejpopulárnějších. Nabízí širokou škálu komponent a utilit.
* **Tailwind CSS:** Utility-first framework, který poskytuje nízkoúrovňové utility třídy, ze kterých si skládáte vlastní design. Velmi flexibilní. **(Na tento se zaměříme)**
* **Foundation:** Další robustní framework s mnoha komponentami.
* **Bulma:** Moderní CSS framework založený na Flexboxu, bez JavaScriptu.
* **Materialize CSS:** Framework založený na principech Material Designu od Google.

## Úvod do Tailwind CSS

**Tailwind CSS** je moderní, **utility-first** CSS framework. Na rozdíl od frameworků jako Bootstrap, které poskytují hotové komponenty (např. `.btn`, `.card`), Tailwind poskytuje sadu malých, jednoúčelových **utility tříd**, které aplikujete přímo na HTML elementy.

**Příklad:**

Místo psaní vlastního CSS:
```css
.button-primary {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: bold;
}
```
A použití v HTML:
```html
<button class="button-primary">Klikni na mě</button>
```

S Tailwindem byste psali přímo v HTML:
```html
<button class="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-700">
  Klikni na mě
</button>
```
* `bg-blue-500`: Barva pozadí (modrá, odstín 500).
* `text-white`: Barva textu (bílá).
* `py-2`: Padding na svislé ose (nahoře a dole).
* `px-4`: Padding na vodorovné ose (vlevo a vpravo).
* `rounded`: Zaoblené rohy.
* `font-bold`: Tučné písmo.
* `hover:bg-blue-700`: Při najetí myší (`hover:`) se změní barva pozadí na tmavší modrou.

**Klíčové vlastnosti a výhody Tailwindu:**

* **Utility-First:** Styly se skládají přímo v HTML pomocí malých tříd. To vede k rychlému prototypování a menší potřebě psát vlastní CSS.
* **Vysoká konfigurovatelnost:** Vše (barvy, mezery, breakpointy, fonty) lze snadno přizpůsobit v konfiguračním souboru `tailwind.config.js`.
* **Responzivní design:** Obsahuje prefixy pro responzivní varianty tříd (např. `md:text-lg` aplikuje `text-lg` od breakpointu `md` a výše).
    * Výchozí breakpointy: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).
    * Příklad: `<div class="text-center sm:text-left">...</div>` (text bude na malých obrazovkách centrovaný, od `sm` breakpointu zarovnaný doleva).
* **Stavy (Hover, Focus, atd.):** Podporuje varianty pro stavy jako `hover:`, `focus:`, `active:`, `disabled:`, atd.
* **Dark Mode:** Snadná implementace tmavého režimu pomocí varianty `dark:`.
* **Optimalizace pro produkci (Purging):** Při sestavování pro produkci Tailwind automaticky odstraní všechny nepoužité CSS třídy, takže výsledný CSS soubor je velmi malý.
* **Komponentová abstrakce:** I když je utility-first, můžete si vytvářet vlastní znovupoužitelné komponenty (např. v Reactu, Vue, nebo pomocí `@apply` direktivy v CSS, pokud je to nutné).

**Jak začít s Tailwind CSS (základní způsoby):**

1.  **Přes CDN (pro rychlé testování):**
    * Vložíte `<script src="https://cdn.tailwindcss.com"></script>` do `<head>` vašeho HTML.
    * Umožňuje používat všechny utility třídy, ale bez možnosti konfigurace a optimalizace (purging). Není vhodné pro produkci.
    ```html
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
      <title>Tailwind CDN</title>
    </head>
    <body>
      <h1 class="text-3xl font-bold underline text-blue-600">
        Ahoj Tailwind!
      </h1>
    </body>
    </html>
    ```

2.  **Instalace pomocí npm/yarn (doporučeno pro projekty):**
    * Vyžaduje Node.js a npm/yarn.
    * Postup zahrnuje instalaci Tailwindu jako závislost projektu, vytvoření konfiguračního souboru (`tailwind.config.js`) a souboru s CSS direktivami Tailwindu, a následné zpracování (build) CSS souboru.
    * **Projektová šablona IS (Next.js):** Pokud používáte naši projektovou šablonu s Next.js, Tailwind CSS je již typicky nakonfigurován. Stačí přidávat třídy do vašich JSX komponent.

**Základní utility třídy v Tailwindu (příklady):**

* **Mezery (Padding, Margin):** `p-4` (padding všude), `pt-2` (padding-top), `mx-auto` (margin horizontálně auto - pro centrování).
* **Šířka/Výška:** `w-full` (šířka 100%), `h-screen` (výška 100vh), `w-1/2` (šířka 50%), `max-w-md` (maximální šířka).
* **Flexbox:** `flex`, `flex-col`, `items-center`, `justify-between`.
* **Grid:** `grid`, `grid-cols-3`, `gap-4`.
* **Typografie:** `text-lg` (velikost textu), `font-semibold` (tloušťka písma), `text-gray-700` (barva textu), `leading-relaxed` (výška řádku), `tracking-wider` (mezery mezi písmeny).
* **Pozadí:** `bg-red-500`, `bg-gradient-to-r from-purple-400 via-pink-500 to-red-500`.
* **Rámečky:** `border`, `border-2`, `border-dashed`, `border-green-500`, `rounded-lg` (zaoblené rohy).
* **Stíny:** `shadow-md`, `shadow-xl`.

Dokumentace Tailwind CSS ([https://tailwindcss.com/docs](https://tailwindcss.com/docs)) je vynikajícím zdrojem pro všechny dostupné utility třídy a jejich použití.

## Shrnutí

Responzivní design je dnes nutností. Klíčem jsou fluidní mřížky, flexibilní média a media queries. CSS frameworky jako Tailwind CSS mohou výrazně usnadnit a zrychlit proces tvorby responzivních a vizuálně atraktivních webových stránek tím, že poskytují sadu připravených utility tříd a nástrojů.

---

### Cvičení (Samostatná práce)

1.  **Experiment s Media Queries:**
    * Vezměte si HTML stránku z předchozích cvičení (nebo vytvořte jednoduchou novou s několika bloky textu a obrázkem).
    * Přidejte interní `<style>` tag nebo použijte váš externí `styl.css`.
    * Napište media query, které:
        * Pro obrazovky **užší než 600px** změní barvu pozadí `<body>` na `lightblue` a velikost písma hlavního nadpisu `<h1>` na `24px`.
        * Pro obrazovky **širší než 992px** změní barvu pozadí `<body>` na `lightgreen` a skryje nějaký element (např. `<p class="skryt-na-desktopu">Tento text je jen pro mobily a tablety.</p>`).
    * Otestujte v prohlížeči zmenšováním a zvětšováním okna (nebo pomocí nástrojů pro vývojáře pro simulaci různých zařízení).

2.  **První kroky s Tailwind CSS (pomocí CDN):**
    * Vytvořte nový HTML soubor (`tailwind_test.html`).
    * Vložte do `<head>` skript pro Tailwind CDN: `<script src="https://cdn.tailwindcss.com"></script>`.
    * Zkuste vytvořit následující prvky pouze pomocí Tailwind tříd:
        * Nadpis `<h1>` s velkým modrým textem, tučným písmem a podtržením.
        * Tlačítko `<button>` se zeleným pozadím, bílým textem, zaoblenými rohy a větším paddingem. Při najetí myší (`hover:`) by se měla barva pozadí mírně změnit.
        * Jednoduchou "kartu" (`<div>`) s rámečkem, stínem, vnitřním paddingem a nějakým textem uvnitř.
    * Podívejte se do dokumentace Tailwind CSS pro inspiraci, jaké třídy použít.

3.  **(Pro pokročilejší / pokud máte projekt s Node.js):**
    * Pokud máte již připravený projekt s Node.js (např. Next.js z projektové šablony, kde je Tailwind již nastaven, nebo si vytvořte nový malý projekt), zkuste si Tailwind nainstalovat podle oficiální dokumentace ([Tailwind CSS Installation](https://tailwindcss.com/docs/installation)) a vytvořit podobné prvky jako v bodě 2.
    * Vyzkoušejte si responzivní prefixy, např. `<div class="bg-red-500 md:bg-blue-500">...</div>` (červené pozadí na mobilech, modré od `md` breakpointu).

*(Tyto úkoly vám pomohou pochopit základní principy responzivního designu a seznámit se s filozofií utility-first přístupu Tailwind CSS.)*
