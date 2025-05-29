# 1. Základy HTML: Struktura dokumentu, základní tagy, sémantika, formuláře

Toto je první části věnovaná klientskému vývoji, kde se seznámíte s **HTML (HyperText Markup Language)**. HTML je základním stavebním kamenem každé webové stránky a definuje její **strukturu a obsah**.

## Co je HTML?

HTML není programovací jazyk v tradičním slova smyslu (nemá logiku pro podmínky, cykly atd.), ale **značkovací jazyk**. Používá **značky (tagy)** k označení různých částí obsahu, aby prohlížeč věděl, jak je interpretovat a zobrazit. Například značka `<p>` označuje odstavec textu, `<img>` obrázek a `<a>` odkaz.

Soubory HTML mají typicky příponu `.html` nebo `.htm`.

## Základní struktura HTML dokumentu

Každý HTML dokument by měl mít následující základní strukturu:

```html
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Název mé stránky</title>
    </head>
<body>
    <h1>Můj první nadpis</h1>
    <p>Toto je můj první odstavec.</p>
</body>
</html>
```

Pojďme si rozebrat jednotlivé části:

* **`<!DOCTYPE html>`**: Deklarace typu dokumentu (Document Type Declaration). Říká prohlížeči, že se jedná o HTML5 dokument. Je to první věc, která by měla být v HTML souboru.
* **`<html lang="cs">...</html>`**: Kořenový element celého HTML dokumentu. Atribut `lang="cs"` specifikuje jazyk dokumentu (čeština), což je důležité pro vyhledávače a asistivní technologie.
* **`<head>...</head>`**: Hlavička dokumentu. Obsahuje meta-informace o stránce, které nejsou přímo zobrazeny na stránce, ale jsou důležité pro prohlížeč a vyhledávače.
    * **`<meta charset="UTF-8">`**: Určuje kódování znaků dokumentu. `UTF-8` je standardní a doporučené kódování, které podporuje většinu světových znaků.
    * **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`**: Klíčové pro responzivní web design. Nastavuje šířku viewportu (viditelné oblasti stránky) na šířku zařízení a počáteční úroveň přiblížení.
    * **`<title>...</title>`**: Definuje název stránky, který se zobrazuje v titulku okna prohlížeče nebo na záložce stránky. Je také důležitý pro SEO (optimalizaci pro vyhledávače).
    * Do `<head>` se také vkládají odkazy na externí CSS soubory (`<link rel="stylesheet" href="style.css">`) nebo JavaScriptové soubory (`<script src="script.js"></script>`).
* **`<body>...</body>`**: Tělo dokumentu. Obsahuje veškerý **viditelný obsah** stránky – texty, obrázky, odkazy, tabulky, formuláře atd.

## Základní HTML tagy (Elementy)

HTML elementy jsou tvořeny párovými (např. `<p>Obsah</p>`) nebo nepárovými (např. `<img src="obrazek.jpg">`) tagy.

### Nadpisy

HTML nabízí šest úrovní nadpisů, od `<h1>` (nejdůležitější) po `<h6>` (nejméně důležitý). Nadpisy pomáhají strukturovat obsah a jsou důležité pro SEO.

```html
<h1>Hlavní nadpis stránky (úroveň 1)</h1>
<h2>Podnadpis (úroveň 2)</h2>
<h3>Nadpis úrovně 3</h3>
<h4>Nadpis úrovně 4</h4>
<h5>Nadpis úrovně 5</h5>
<h6>Nadpis úrovně 6</h6>
```

### Odstavce

Odstavce textu se definují pomocí tagu `<p>` (paragraph).

```html
<p>Toto je první odstavec textu. Může obsahovat více vět.</p>
<p>Toto je druhý odstavec.</p>
```

### Formátování textu (Inline elementy)

* **`<strong>...</strong>`**: Označuje silně důležitý text (typicky zobrazeno tučně).
* **`<em>...</em>`**: Označuje zdůrazněný text (typicky zobrazeno kurzívou).
* **`<span>...</span>`**: Obecný inline kontejner, který sám o sobě nemá vizuální význam, ale používá se pro stylování (pomocí CSS) nebo manipulaci (pomocí JavaScriptu) specifických částí textu.
* **`<br>`**: Zalomení řádku (nepárový tag).
* **`<hr>`**: Horizontální čára (nepárový tag, pro tematický předěl).

```html
<p>Tento text je <strong>velmi důležitý</strong> a toto je <em>zdůrazněno</em>. Použijeme <br> zalomení řádku.</p>
```

### Odkazy (Hypertextové odkazy)

Odkazy se vytvářejí pomocí tagu `<a>` (anchor) a jeho atributu `href` (hypertext reference), který specifikuje cílovou URL adresu.

```html
<a href="[https://www.example.com](https://www.example.com)">Odkaz na Example.com</a>
<a href="stranka2.html">Odkaz na lokální stránku</a>
<a href="mailto:[email protected]">Odeslat email</a>
<a href="#sekce1">Odkaz na sekci na téže stránce (vyžaduje id="sekce1" u cílového elementu)</a>
<a href="[https://www.example.com](https://www.example.com)" target="_blank">Odkaz na Example.com (otevře se v nové záložce)</a>
```
Atribut `target="_blank"` způsobí otevření odkazu v nové záložce/okně prohlížeče.

### Obrázky

Obrázky se vkládají pomocí nepárového tagu `<img>` a jeho povinných atributů:
* `src` (source): Cesta k obrázku.
* `alt` (alternative text): Alternativní text, který se zobrazí, pokud se obrázek nenačte, a je důležitý pro přístupnost (čtečky obrazovky) a SEO.

```html
<img src="obrazky/logo.png" alt="Logo naší firmy">
<img src="[https://placehold.co/600x400/EADEA4/000000?text=Ukázkový+obrázek](https://placehold.co/600x400/EADEA4/000000?text=Ukázkový+obrázek)" alt="Ukázkový obrázek z placeholderu">
```
Je dobré také specifikovat rozměry obrázku pomocí atributů `width` a `height`, aby prohlížeč mohl rezervovat místo ještě před načtením obrázku, což zabraňuje poskakování layoutu.

### Seznamy

HTML podporuje dva hlavní typy seznamů:

* **Neuspořádané seznamy (`<ul>` - unordered list):** Položky jsou typicky zobrazeny s odrážkami.
* **Uspořádané seznamy (`<ol>` - ordered list):** Položky jsou typicky zobrazeny s čísly nebo písmeny.

Položky seznamu se definují tagem `<li>` (list item).

```html
<h4>Neuspořádaný seznam:</h4>
<ul>
    <li>První položka</li>
    <li>Druhá položka</li>
    <li>Třetí položka</li>
</ul>

<h4>Uspořádaný seznam:</h4>
<ol>
    <li>První krok</li>
    <li>Druhý krok</li>
    <li>Třetí krok</li>
</ol>
```
Seznamy lze i vnořovat.

### Tabulky

Tabulky se používají pro zobrazení tabulkových dat. Základní struktura:
* `<table>...</table>`: Definuje tabulku.
* `<thead>...</thead>`: (Volitelné) Hlavička tabulky.
* `<tbody>...</tbody>`: (Volitelné, ale doporučené) Tělo tabulky.
* `<tfoot>...</tfoot>`: (Volitelné) Patička tabulky.
* `<tr>...</tr>`: Definuje řádek tabulky (table row).
* `<th>...</th>`: Definuje buňku záhlaví tabulky (table header). Text je typicky tučný a centrovaný.
* `<td>...</td>`: Definuje datovou buňku tabulky (table data).

```html
<table>
    <thead>
        <tr>
            <th>Jméno</th>
            <th>Příjmení</th>
            <th>Věk</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Jan</td>
            <td>Novák</td>
            <td>30</td>
        </tr>
        <tr>
            <td>Petra</td>
            <td>Svobodová</td>
            <td>25</td>
        </tr>
    </tbody>
</table>
```
Pro složitější tabulky lze použít atributy `colspan` (pro sloučení buněk horizontálně) a `rowspan` (pro sloučení buněk vertikálně).

## Sémantické HTML5 elementy

HTML5 zavedlo nové sémantické elementy, které lépe popisují význam různých částí stránky. Jejich používání zlepšuje strukturu dokumentu, přístupnost a SEO.

* **`<header>`**: Hlavička stránky nebo sekce (může obsahovat logo, navigační menu, nadpis).
* **`<footer>`**: Patička stránky nebo sekce (může obsahovat copyright, kontaktní informace, odkazy).
* **`<nav>`**: Navigační menu (hlavní navigace stránky).
* **`<main>`**: Hlavní obsah dokumentu. Měl by být na stránce pouze jeden.
* **`<article>`**: Samostatný, soběstačný obsah (např. blogový příspěvek, novinový článek, komentář).
* **`<section>`**: Obecná sekce dokumentu, která seskupuje související obsah (např. kapitola, úvodní sekce). Typicky má vlastní nadpis.
* **`<aside>`**: Postranní panel nebo obsah, který souvisí s hlavním obsahem, ale není jeho přímou součástí (např. související odkazy, reklama, biografie autora).
* **`<figure>` a `<figcaption>`**: Pro seskupení obrázků, diagramů, kódu atd. s jejich popiskem.

```html
<body>
    <header>
        <h1>Moje úžasná stránka</h1>
        <nav>
            <ul>
                <li><a href="/">Domů</a></li>
                <li><a href="/o-nas">O nás</a></li>
                <li><a href="/kontakt">Kontakt</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <h2>Nejnovější článek</h2>
            <p>Obsah článku...</p>
            <section>
                <h3>Komentáře</h3>
                <p>První komentář...</p>
            </section>
        </article>

        <aside>
            <h3>Související odkazy</h3>
            <ul>
                <li><a href="#">Odkaz 1</a></li>
                <li><a href="#">Odkaz 2</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 Moje Firma</p>
    </footer>
</body>
```

## Formuláře

Formuláře slouží ke sběru dat od uživatelů.

* **`<form>`**: Hlavní element formuláře.
    * Atribut `action`: URL adresa serverového skriptu, který zpracuje data formuláře.
    * Atribut `method`: HTTP metoda použitá pro odeslání dat (`GET` nebo `POST`).
        * `GET`: Data jsou připojena k URL (viditelná, omezená délka, pro idempotentní operace jako vyhledávání).
        * `POST`: Data jsou odeslána v těle HTTP požadavku (skrytá, větší objem dat, pro operace měnící stav na serveru).
* **`<label>`**: Popisek pro formulářový prvek. Atribut `for` by měl odpovídat `id` příslušného vstupního prvku pro lepší přístupnost.
* **`<input>`**: Univerzální vstupní prvek. Typ se určuje atributem `type`:
    * `type="text"`: Jednořádkové textové pole.
    * `type="password"`: Pole pro heslo (znaky jsou maskovány).
    * `type="email"`: Pole pro email (s validací formátu v moderních prohlížečích).
    * `type="number"`: Pole pro číslo.
    * `type="date"`: Pole pro výběr data.
    * `type="checkbox"`: Zaškrtávací políčko.
    * `type="radio"`: Přepínač (z skupiny přepínačů se stejným atributem `name` lze vybrat jen jeden).
    * `type="submit"`: Tlačítko pro odeslání formuláře.
    * `type="button"`: Obecné tlačítko (vyžaduje JavaScript pro akci).
    * `type="file"`: Pro nahrání souboru.
    * Další atributy: `name` (jméno pole, posílá se na server), `id` (unikátní identifikátor), `value` (výchozí nebo aktuální hodnota), `placeholder` (text nápovědy v poli), `required` (povinné pole), `disabled` (zakázané pole), `readonly` (pole jen pro čtení), `min`, `max`, `step` (pro číselné typy).
* **`<textarea>`**: Víceřádkové textové pole.
* **`<select>` a `<option>`**: Rozbalovací seznam (dropdown).
    * `<select>`: Kontejner seznamu.
    * `<option value="hodnota">Text položky</option>`: Jedna položka v seznamu.
* **`<button>`**: Obecné tlačítko, může mít typ `submit`, `reset` nebo `button`. Může obsahovat HTML obsah (např. obrázek).

```html
<form action="/zpracuj-formular" method="post">
    <div>
        <label for="jmeno">Jméno:</label>
        <input type="text" id="jmeno" name="uzivatelske_jmeno" required placeholder="Zadejte své jméno">
    </div>
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email_uzivatele" placeholder="jmeno@example.com">
    </div>
    <div>
        <label for="heslo">Heslo:</label>
        <input type="password" id="heslo" name="heslo_uzivatele" required minlength="8">
    </div>
    <div>
        <label for="vek">Věk:</label>
        <input type="number" id="vek" name="vek_uzivatele" min="18" max="100">
    </div>
    <div>
        <p>Souhlasíte s podmínkami?</p>
        <input type="checkbox" id="souhlas" name="souhlas_podminky" value="ano" checked>
        <label for="souhlas">Ano, souhlasím</label>
    </div>
    <div>
        <p>Vyberte pohlaví:</p>
        <input type="radio" id="muz" name="pohlavi" value="muz">
        <label for="muz">Muž</label>
        <input type="radio" id="zena" name="pohlavi" value="zena">
        <label for="zena">Žena</label>
    </div>
    <div>
        <label for="poznamka">Poznámka:</label>
        <textarea id="poznamka" name="poznamka_uzivatele" rows="4" cols="50" placeholder="Napište poznámku..."></textarea>
    </div>
    <div>
        <label for="zeme">Země:</label>
        <select id="zeme" name="zeme_uzivatele">
            <option value="">-- Vyberte zemi --</option>
            <option value="cz">Česká republika</option>
            <option value="sk">Slovensko</option>
            <option value="de">Německo</option>
        </select>
    </div>
    <div>
        <button type="submit">Odeslat formulář</button>
        <button type="reset">Vymazat formulář</button>
        <input type="submit" value="Odeslat (input)">
    </div>
</form>
```

## HTML Atributy

Atributy poskytují dodatečné informace o HTML elementech. Jsou vždy specifikovány v **počátečním tagu** a obvykle se skládají z dvojice `jméno="hodnota"`.

* **Globální atributy:** Mohou být použity na téměř všech HTML elementech.
    * `id`: Unikátní identifikátor elementu na stránce.
    * `class`: Jedna nebo více tříd pro stylování (CSS) nebo výběr (JavaScript). Názvy tříd se oddělují mezerou.
    * `style`: Inline CSS styly (méně doporučeno pro větší projekty, lepší je externí CSS).
    * `title`: Doplňující informace o elementu (často se zobrazí jako tooltip).
    * `lang`: Jazyk obsahu elementu.
    * `data-*`: Vlastní datové atributy pro ukládání specifických informací, které mohou být použity JavaScriptem.
* **Specifické atributy:** Platí pouze pro určité elementy (např. `href` pro `<a>`, `src` a `alt` pro `<img>`, `action` a `method` pro `<form>`).

## Komentáře v HTML

Komentáře slouží k vkládání poznámek do kódu, které prohlížeč ignoruje a nezobrazuje.

```html
<!--
Toto je
víceřádkový
komentář.
-->
```

## Zobrazování HTML souborů (Live Server)

HTML soubory lze otevřít přímo v prohlížeči (např. dvojklikem na soubor). Pro vývoj je však velmi užitečné používat rozšíření jako **Live Server** pro VS Code. Toto rozšíření:

1.  Spustí lokální vývojový server.
2.  Otevře vaši HTML stránku v prohlížeči.
3.  **Automaticky obnoví stránku v prohlížeči při každé změně a uložení HTML, CSS nebo JavaScript souboru.** To výrazně zrychluje vývoj, protože okamžitě vidíte dopad svých změn.

**Instalace a použití Live Serveru ve VS Code:**
1. Otevřete VS Code.
2. Přejděte do panelu Rozšíření (Extensions, `Ctrl+Shift+X`).
3. Vyhledejte "Live Server" (od Ritwick Dey).
4. Klikněte na "Install".
5. Po instalaci otevřete váš HTML soubor ve VS Code.
6. Klikněte pravým tlačítkem myši do editoru s HTML souborem a vyberte "Open with Live Server" nebo klikněte na tlačítko "Go Live" v pravém dolním rohu VS Code.

## Shrnutí

HTML je základem pro strukturování obsahu na webu. Porozumění jeho základním elementům, atributům a sémantice je klíčové pro každého webového vývojáře. V dalších částech se naučíme, jak tento strukturovaný obsah vizuálně upravovat pomocí CSS a přidávat mu interaktivitu pomocí JavaScriptu.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte jednoduchou osobní stránku:**
    * Vytvořte nový HTML soubor s názvem `index.html`.
    * Dodržte základní strukturu HTML dokumentu (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
    * V `<head>` nastavte `charset`, `viewport` a smysluplný `<title>`.
    * V `<body>` použijte:
        * Hlavní nadpis `<h1>` s vaším jménem.
        * Odstavec `<p>` s krátkým popisem o vás.
        * Podnadpis `<h2>` "Moje koníčky".
        * Neuspořádaný seznam `<ul>` s alespoň třemi vašimi koníčky (`<li>`).
        * Podnadpis `<h2>` "Kontakt".
        * Odkaz `<a>` na váš (fiktivní) email (`mailto:`).
        * Odkaz `<a>` na vaši oblíbenou webovou stránku (otevírající se v nové záložce).
    * Přidejte alespoň jeden obrázek `<img>` (můžete použít placeholder jako `https://placehold.co/300x200`). Nezapomeňte na `alt` atribut.
    * Použijte sémantické tagy `<header>`, `<main>`, `<footer>` pro rozdělení stránky.
2.  **Vytvořte stránku s jednoduchým formulářem:**
    * Vytvořte nový HTML soubor `formular.html`.
    * Formulář (`<form>`) by měl obsahovat alespoň:
        * Pole pro jméno (`<input type="text">` s `<label>`).
        * Pole pro email (`<input type="email">` s `<label>`).
        * Pole pro zprávu (`<textarea>` s `<label>`).
        * Odesílací tlačítko (`<button type="submit">` nebo `<input type="submit">`).
    * Nastavte atributy `action` a `method` formuláře (např. `action="#" method="post"` pro ukázku).
    * Přidejte k polím atribut `placeholder` a označte některá jako `required`.
3.  **Otevřete oba soubory pomocí Live Serveru** a sledujte, jak se zobrazují v prohlížeči. Vyzkoušejte si provést malé změny v HTML a uložte soubor – stránka by se měla automaticky obnovit.

*(Tyto úkoly si můžete vyzkoušet lokálně. Není nutné je odevzdávat, slouží k procvičení.)*
