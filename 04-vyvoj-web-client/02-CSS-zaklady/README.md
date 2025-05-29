# 2. Základy CSS: Selektory, vlastnosti, box model, jednotky, úvod do Flexboxu a Gridu

V předchozí části jsme probírali strukturovat obsah webové stránky pomocí HTML. Nyní se podíváme na **CSS (Cascading Style Sheets)**, jazyk, který slouží k **vizuálnímu stylování** HTML dokumentů. CSS nám umožňuje definovat, jak mají jednotlivé HTML elementy vypadat – jejich barvy, písma, rozměry, pozicování a mnoho dalšího.

## Co je CSS?

CSS není programovací jazyk, ale **stylovací jazyk**. Pracuje na základě **pravidel**, která definují, jaké styly se mají aplikovat na vybrané HTML elementy.

* **Oddělení struktury od vzhledu:** Jedním z hlavních principů moderního web designu je oddělení obsahu (HTML) od jeho prezentace (CSS). To činí kód přehlednějším, snadněji udržovatelným a umožňuje snadnou změnu vzhledu webu bez nutnosti zasahovat do HTML struktury.
* **Kaskádování:** Název "Cascading" odkazuje na způsob, jakým prohlížeče určují, které CSS pravidlo se aplikuje, pokud jich na jeden element cílí více. Pravidla "kaskádují" dolů, dokud se nenajde to nejvíce specifické nebo poslední definované.

## Způsoby vkládání CSS do HTML

Existují tři hlavní způsoby, jak propojit CSS s HTML dokumentem:

1.  **Externí stylopis (External Stylesheet):**
    * Nejčastější a **doporučený** způsob pro většinu projektů.
    * CSS pravidla jsou definována v samostatném souboru s příponou `.css` (např. `styl.css`).
    * Tento soubor je pak propojen s HTML dokumentem pomocí tagu `<link>` v `<head>` sekci:
        ```html
        <head>
            <meta charset="UTF-8">
            <title>Moje stránka</title>
            <link rel="stylesheet" href="css/styl.css">
        </head>
        ```
    * **Výhody:** Oddělení stylů od HTML, možnost použít stejný stylopis pro více stránek, snadnější údržba, lepší cachování prohlížečem.

2.  **Interní stylopis (Internal Stylesheet):**
    * CSS pravidla jsou definována přímo v HTML dokumentu uvnitř tagu `<style>` v `<head>` sekci.
        ```html
        <head>
            <meta charset="UTF-8">
            <title>Moje stránka</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                }
                h1 {
                    color: navy;
                }
            </style>
        </head>
        ```
    * **Výhody:** Užitečné pro specifické styly jedné stránky nebo pro rychlé testování.
    * **Nevýhody:** Styly nelze snadno sdílet mezi více stránkami, míchá se struktura s prezentací.

3.  **Inline styly (Inline Styles):**
    * CSS pravidla jsou definována přímo v HTML elementu pomocí atributu `style`.
        ```html
        <h1 style="color: navy; text-align: center;">Hlavní nadpis</h1>
        <p style="font-size: 16px; color: green;">Toto je odstavec se specifickým stylem.</p>
        ```
    * **Výhody:** Pro velmi specifické, jednorázové úpravy.
    * **Nevýhody:** **Silně nedoporučeno** pro obecné stylování. Má nejvyšší specificitu (těžko se přepisuje), velmi špatně se udržuje, znepřehledňuje HTML kód.

## Základní syntaxe CSS pravidla

CSS pravidlo se skládá ze dvou hlavních částí:

* **Selektor (Selector):** Určuje, na které HTML elementy se má pravidlo aplikovat.
* **Blok deklarací (Declaration Block):** Uzavřený ve složených závorkách `{ }`. Obsahuje jednu nebo více **deklarací** oddělených středníkem `;`.
    * Každá **deklarace** se skládá z **vlastnosti (property)** a její **hodnoty (value)**, oddělených dvojtečkou `:`.

```css
/* Toto je CSS komentář */

selektor {
    vlastnost1: hodnota1;
    vlastnost2: hodnota2;
    /* ... další vlastnosti ... */
}
```

**Příklad:**

```css
h1 { /* Selektor: všechny <h1> elementy */
    color: blue;         /* Vlastnost: color, Hodnota: blue */
    text-align: center;  /* Vlastnost: text-align, Hodnota: center */
}

p {  /* Selektor: všechny <p> elementy */
    font-size: 16px;
    line-height: 1.5;
}
```

## Selektory

Selektory jsou klíčem k cílení na specifické HTML elementy.

### Základní selektory

* **Typový selektor (Type Selector):** Vybere všechny elementy daného typu (názvu tagu).
    ```css
    p { /* Všechny <p> elementy */
        color: gray;
    }
    div { /* Všechny <div> elementy */
        border: 1px solid black;
    }
    ```
* **Třídní selektor (Class Selector):** Vybere všechny elementy, které mají danou třídu (atribut `class`). Název třídy v CSS začíná tečkou `.`.
    ```html
    <p class="upozorneni">Toto je důležité upozornění.</p>
    <div class="box hlavni-box">Tento div má dvě třídy.</div>
    ```css
    .upozorneni { /* Všechny elementy s class="upozorneni" */
        color: red;
        font-weight: bold;
    }
    .box {
        padding: 10px;
    }
    .hlavni-box { /* Můžeme stylovat specifickou třídu */
        background-color: lightblue;
    }
    ```
    Element může mít více tříd, oddělených mezerou.
* **ID selektor (ID Selector):** Vybere element s unikátním ID (atribut `id`). Název ID v CSS začíná mřížkou `#`. **ID musí být na stránce unikátní!**
    ```html
    <div id="hlavni-menu">Navigace...</div>
    ```css
    #hlavni-menu { /* Element s id="hlavni-menu" */
        background-color: #333;
        color: white;
    }
    ```
    ID selektory mají vysokou specificitu, proto se doporučuje je používat s rozvahou, často spíše pro JavaScript než pro obecné stylování.
* **Univerzální selektor (`*`):** Vybere všechny elementy na stránce. Používá se opatrně, např. pro resetování výchozích stylů.
    ```css
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box; /* Častý reset pro box model */
    }
    ```
* **Atributový selektor:** Vybere elementy na základě přítomnosti nebo hodnoty jejich atributů.
    ```css
    a[target] { /* Všechny <a> elementy, které mají atribut 'target' */
        color: green;
    }
    a[target="_blank"] { /* Všechny <a> elementy s atributem target="_blank" */
        text-decoration: underline;
    }
    input[type="text"] { /* Všechny <input> elementy s type="text" */
        border: 1px solid gray;
    }
    ```

### Kombinátory

Kombinátory umožňují vybírat elementy na základě jejich vztahu k jiným elementům.

* **Selektor potomka (Descendant Selector) (mezera):** Vybere elementy, které jsou potomky (na jakékoli úrovni vnoření) jiného elementu.
    ```css
    article p { /* Všechny <p> elementy, které jsou uvnitř <article> */
        line-height: 1.6;
    }
    ```
* **Selektor přímého potomka (Child Selector) (`>`):** Vybere elementy, které jsou přímými potomky (první úroveň vnoření) jiného elementu.
    ```css
    ul > li { /* Všechny <li> elementy, které jsou přímým potomkem <ul> */
        list-style-type: square;
    }
    ```
* **Selektor přímého sourozence (Adjacent Sibling Selector) (`+`):** Vybere element, který je bezprostředním následujícím sourozencem jiného elementu.
    ```css
    h2 + p { /* <p> element, který následuje hned za <h2> */
        margin-top: 0;
    }
    ```
* **Selektor obecného sourozence (General Sibling Selector) (`~`):** Vybere všechny elementy, které jsou následujícími sourozenci jiného elementu (na stejné úrovni).
    ```css
    h2 ~ p { /* Všechny <p> elementy, které následují za <h2> a jsou jeho sourozenci */
        color: darkgray;
    }
    ```

### Pseudotřídy

Pseudotřídy umožňují stylovat elementy na základě jejich stavu nebo pozice, která není přímo v HTML kódu. Začínají dvojtečkou `:`.

* **Stavy odkazů:**
    * `:link` - Nenavštívený odkaz.
    * `:visited` - Navštívený odkaz.
    * `:hover` - Odkaz (nebo jiný element), nad kterým je kurzor myši.
    * `:active` - Odkaz (nebo jiný element) v momentě kliknutí.
    * `:focus` - Element, který má fokus (např. pole formuláře po kliknutí do něj).
    ```css
    a:link { color: blue; }
    a:visited { color: purple; }
    a:hover { text-decoration: underline; color: red; }
    a:active { color: orange; }
    input:focus { border-color: blue; }
    ```
* **Strukturální pseudotřídy:**
    * `:first-child` - První dítě svého rodiče.
    * `:last-child` - Poslední dítě svého rodiče.
    * `:nth-child(n)` - n-té dítě svého rodiče (např. `:nth-child(2)`, `:nth-child(odd)`, `:nth-child(2n+1)`).
    * `:nth-of-type(n)` - n-té dítě svého typu.
    * `:empty` - Element, který nemá žádné děti (ani text).
    ```css
    li:first-child { font-weight: bold; }
    tr:nth-child(even) { background-color: #f2f2f2; } /* Sudé řádky tabulky */
    ```
* **Uživatelského rozhraní:**
    * `:checked` - Zaškrtnutý `<input type="checkbox">` nebo `<input type="radio">`.
    * `:disabled` - Zakázaný formulářový prvek.
    * `:enabled` - Povolený formulářový prvek.

### Pseudoelementy

Pseudoelementy umožňují stylovat specifické části elementu. Začínají dvěma dvojtečkami `::` (i když starší syntaxe s jednou dvojtečkou je také podporována pro zpětnou kompatibilitu).

* `::before` - Vloží obsah *před* obsah elementu.
* `::after` - Vloží obsah *za* obsah elementu.
* `::first-line` - Vybere první řádek textu v blokovém elementu.
* `::first-letter` - Vybere první písmeno textu v blokovém elementu.
* `::selection` - Vybere část dokumentu, kterou uživatel označil (vybral myší).
* `::placeholder` - Styluje placeholder text ve formulářových polích.

```css
p::first-letter {
    font-size: 2em;
    font-weight: bold;
    color: navy;
}

.poznamka::before {
    content: "Pozn.: "; /* 'content' je povinná vlastnost pro ::before a ::after */
    font-weight: bold;
}

input::placeholder {
  color: #aaa;
}
```

## Kaskáda, Specificita a Dědičnost

Tyto tři koncepty určují, jak se aplikují CSS pravidla, pokud jich na jeden element cílí více.

* **Kaskáda (Cascade):** Pravidla se aplikují v určitém pořadí. Hlavní faktory jsou:
    1.  **Původ stylopisu:** Styly prohlížeče (výchozí) -> Uživatelské styly (definované uživatelem v prohlížeči) -> Autorské styly (definované vývojářem webu). Autorské styly mají obvykle přednost.
    2.  **Specificita selektoru:** Viz níže.
    3.  **Pořadí v kódu:** Pokud mají dva selektory stejnou specificitu, vyhrává ten, který je v CSS souboru definován později.
    * Pravidla s `!important` mají nejvyšší prioritu a přepisují ostatní (jejich použití by mělo být omezeno na výjimečné případy).
* **Specificita (Specificity):** Míra, jak "specifický" je selektor. Prohlížeč vypočítá specificitu pro každý selektor a použije pravidlo s nejvyšší specificitou.
    * Počítá se zhruba takto (od nejvyšší po nejnižší váhu):
        1.  Inline styly (atribut `style` v HTML) - nejvyšší specificita.
        2.  ID selektory (`#id`).
        3.  Třídní selektory (`.class`), atributové selektory (`[type="text"]`), pseudotřídy (`:hover`).
        4.  Typové selektory (`p`, `div`), pseudoelementy (`::before`).
    * Univerzální selektor (`*`) a kombinátory (` `, `>`, `+`, `~`) nemají na specificitu vliv.
    * Příklad: `#mojeId .trida p` je specifičtější než `.trida p`, které je specifičtější než `p`.
* **Dědičnost (Inheritance):** Některé CSS vlastnosti se dědí z rodičovského elementu na jeho potomky, pokud nejsou pro potomka explicitně definovány jinak. Typicky se dědí vlastnosti související s textem (např. `color`, `font-family`, `font-size`, `line-height`, `text-align`). Vlastnosti související s rozměry a pozicováním (např. `width`, `height`, `padding`, `margin`, `border`, `background`) se obvykle nedědí.

## Box Model

Každý HTML element je v CSS chápán jako obdélníkový box. Box model popisuje, jak se skládá velikost tohoto boxu. Má čtyři hlavní části (od vnitřku ven):

1.  **Obsah (Content):** Skutečný obsah elementu (text, obrázek atd.). Jeho rozměry jsou dány vlastnostmi `width` a `height`.
2.  **Vnitřní okraj (Padding):** Průhledná oblast kolem obsahu, uvnitř borderu. Ovládá se vlastnostmi `padding-top`, `padding-right`, `padding-bottom`, `padding-left` nebo zkratkou `padding`.
3.  **Rámeček (Border):** Čára kolem paddingu a obsahu. Ovládá se vlastnostmi jako `border-width`, `border-style` (např. `solid`, `dashed`, `dotted`), `border-color` nebo zkratkou `border`.
4.  **Vnější okraj (Margin):** Průhledná oblast kolem borderu, která odděluje element od ostatních elementů. Ovládá se vlastnostmi `margin-top`, `margin-right`, `margin-bottom`, `margin-left` nebo zkratkou `margin`.

**`box-sizing` vlastnost:**
* `content-box` (výchozí): `width` a `height` definují pouze velikost obsahu. Padding a border se přičítají k celkové velikosti elementu.
* `border-box`: `width` a `height` definují celkovou velikost elementu včetně paddingu a borderu. Obsah se zmenší, aby se vešel. Toto nastavení je často intuitivnější pro layout.
    ```css
    { /* Často používaný globální reset */
        box-sizing: border-box;
    }
    ```

## Jednotky v CSS

CSS používá různé jednotky pro specifikaci délek, velikostí atd.

* **Absolutní jednotky:** Mají pevnou velikost.
    * `px` (pixel): Nejčastěji používaná absolutní jednotka. 1 pixel na obrazovce.
    * `pt` (point): Body (1pt = 1/72 palce), často pro tisk.
    * `cm`, `mm`, `in`: Centimetry, milimetry, palce.
* **Relativní jednotky:** Jejich velikost je relativní k jiné hodnotě.
    * `%` (procento): Relativní k velikosti rodičovského elementu (pro `width`, `height`, `padding`, `margin`) nebo k velikosti písma (pro `font-size`, `line-height`).
    * `em`: Relativní k velikosti písma aktuálního elementu (pokud se používá pro `font-size`, tak k velikosti písma rodiče). `1em` = aktuální `font-size`.
    * `rem` (root em): Relativní k velikosti písma kořenového elementu (`<html>`). `1rem` = `font-size` elementu `<html>`. Velmi užitečné pro konzistentní škálování.
    * `vw` (viewport width): 1% šířky viewportu.
    * `vh` (viewport height): 1% výšky viewportu.
    * `vmin`, `vmax`: Menší/větší z `vw` a `vh`.

## Barvy a Pozadí

* **Barva textu:** `color: hodnota;`
* **Barva pozadí:** `background-color: hodnota;`
* **Obrázek na pozadí:** `background-image: url('cesta/k/obrazku.jpg');`
    * Další vlastnosti pozadí: `background-repeat`, `background-position`, `background-size`, `background-attachment`. Zkratka: `background`.

**Způsoby definice barev:**
* **Názvy barev:** např. `red`, `blue`, `green`, `lightgray`, `transparent`.
* **Hexadecimální kódy:** `#RRGGBB` (např. `#FF0000` pro červenou) nebo `#RGB` (zkráceně, např. `#F00`). Lze přidat i alfa kanál pro průhlednost: `#RRGGBBAA` nebo `#RGBA`.
* **RGB/RGBA:** `rgb(červená, zelená, modrá)` (hodnoty 0-255), `rgba(červená, zelená, modrá, alfa)` (alfa 0.0-1.0).
* **HSL/HSLA:** `hsl(odstín, saturace%, světlost%)`, `hsla(odstín, saturace%, světlost%, alfa)`. Odstín 0-360.

## Typografie (Základy)

* **`font-family`**: Seznam písem, která se mají použít (prohlížeč použije první dostupné). Vždy zakončete generickou rodinou (např. `sans-serif`, `serif`, `monospace`).
    ```css
    body {
        font-family: Arial, Helvetica, sans-serif;
    }
    code {
        font-family: "Courier New", Courier, monospace;
    }
    ```
* **`font-size`**: Velikost písma (např. `16px`, `1.2em`, `1rem`, `120%`).
* **`font-weight`**: Tloušťka písma (např. `normal`, `bold`, `100`-`900`).
* **`font-style`**: Styl písma (např. `normal`, `italic`, `oblique`).
* **`line-height`**: Výška řádku (např. `1.5`, `24px`, `150%`). Ovlivňuje vertikální mezery mezi řádky textu.
* **`text-align`**: Horizontální zarovnání textu (`left`, `right`, `center`, `justify`).
* **`text-decoration`**: Dekorace textu (např. `none`, `underline`, `overline`, `line-through`).
* **`text-transform`**: Transformace textu (`none`, `capitalize`, `uppercase`, `lowercase`).
* **`letter-spacing`**: Mezery mezi písmeny.
* **`word-spacing`**: Mezery mezi slovy.

## Základy layoutu (Úvod do Flexboxu a Gridu)

Pro komplexnější rozvržení prvků na stránce se dnes nejčastěji používají **Flexbox** a **CSS Grid**. Těmto technikám se budeme věnovat podrobněji v samostatné kapitole, ale je dobré o nich vědět.

* **Flexbox (Flexible Box Layout):** Jednorozměrný layoutovací model optimalizovaný pro uspořádání prvků v řádku nebo sloupci a jejich zarovnání a rozmístění v rámci kontejneru.
* **CSS Grid Layout:** Dvourozměrný layoutovací model umožňující definovat mřížku řádků a sloupců a umisťovat do ní prvky.

Starší techniky jako `float` nebo pozicování (`position: absolute/relative;`) se stále používají, ale pro celkové rozvržení stránky jsou Flexbox a Grid obecně vhodnější a flexibilnější.

## Komentáře v CSS

Komentáře v CSS se zapisují mezi `/*` a `*/`.

```css
/* Toto je jednořádkový komentář */

/*
Toto je
víceřádkový
komentář.
*/

h1 {
    color: navy; /* Nastaví barvu nadpisu na tmavě modrou */
}
```

## Shrnutí

CSS je silný nástroj pro vizuální prezentaci webových stránek. Pochopení selektorů, vlastností, box modelu, kaskády a specificity je klíčové pro efektivní práci s CSS. V dalších kapitolách se ponoříme hlouběji do responzivního designu a pokročilejších layoutovacích technik.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte externí CSS soubor:**
    * Vytvořte soubor `styl.css` ve stejném adresáři jako váš `index.html` (nebo v podadresáři `css/`).
    * Propojte `styl.css` s vaším `index.html` (z předchozího HTML cvičení) pomocí tagu `<link>` v `<head>`.
2.  **Základní styly:**
    * V `styl.css` nastavte pro element `<body>`:
        * Barvu pozadí (`background-color`) na světle šedou (např. `#f4f4f4`).
        * Rodinu písma (`font-family`) na nějaké bezpatkové písmo (např. `Arial, sans-serif`).
        * Barvu textu (`color`) na tmavě šedou (např. `#333`).
3.  **Stylování nadpisů a odstavců:**
    * Nastavte pro `<h1>` barvu (např. `navy`) a zarovnání textu na střed (`text-align: center`).
    * Nastavte pro všechny odstavce (`<p>`) výšku řádku (`line-height`) na `1.6`.
4.  **Stylování odkazů:**
    * Odstraňte podtržení u odkazů (`<a>`) ve výchozím stavu (`text-decoration: none;`).
    * Nastavte barvu odkazů.
    * Při najetí myší (`:hover`) na odkaz změňte jeho barvu a přidejte podtržení.
5.  **Použití třídy:**
    * Přidejte do HTML jednomu z vašich odstavců třídu, např. `class="highlight"`.
    * V CSS vytvořte pravidlo pro třídu `.highlight`, které změní barvu pozadí tohoto odstavce a udělá text tučným (`font-weight: bold;`).
6.  **Box Model:**
    * Vyberte si nějaký element (např. `article` nebo `section`, pokud je máte) a v CSS mu nastavte:
        * Rámeček (`border`), např. `1px solid #ccc`.
        * Vnitřní okraj (`padding`), např. `15px`.
        * Vnější okraj (`margin`), např. `20px auto` (pro vycentrování blokového elementu, pokud má nastavenou šířku).
        * Maximální šířku (`max-width`), např. `800px`.
7.  **Otevřete `index.html` pomocí Live Serveru** a sledujte, jak se aplikují vaše CSS styly. Experimentujte s různými vlastnostmi a hodnotami.

*(Tyto úkoly si můžete vyzkoušet lokálně. Není nutné je odevzdávat, slouží k procvičení.)*
