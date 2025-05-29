# 5. JavaScript a DOM: Manipulace s HTML elementy, události

V předchozí kapitole jste se seznámili se základy JavaScriptu. Nyní se podíváme na to, jak JavaScript interaguje s HTML stránkou prostřednictvím **DOM (Document Object Model)** a jak reagovat na akce uživatele pomocí **událostí (Events)**.

## Co je DOM (Document Object Model)?

Když webový prohlížeč načte HTML dokument, vytvoří jeho **objektovou reprezentaci** v paměti. Tato reprezentace se nazývá DOM. DOM představuje HTML dokument jako **stromovou strukturu uzlů (nodes)**, kde každý uzel odpovídá části dokumentu (např. elementu, atributu, textu).

* **Stromová struktura:** Kořenem stromu je obvykle objekt `document`. Každý HTML element (`<h1>`, `<p>`, `<div>` atd.) je uzel v tomto stromu. Elementy mohou mít rodičovské uzly, dceřiné uzly a sourozenecké uzly.
* **Rozhraní pro JavaScript:** DOM poskytuje JavaScriptu rozhraní (API) pro dynamický přístup a manipulaci s obsahem, strukturou a styly HTML dokumentu. To znamená, že pomocí JavaScriptu můžeme:
    * Nacházet (vybírat) HTML elementy.
    * Měnit obsah HTML elementů.
    * Měnit atributy HTML elementů (např. `src` u obrázku, `href` u odkazu).
    * Měnit CSS styly HTML elementů.
    * Přidávat nové HTML elementy a atributy.
    * Odebírat existující HTML elementy.
    * Reagovat na události (viz dále).

## Přístup k DOM elementům (Výběr elementů)

Abychom mohli s HTML elementem pracovat, musíme ho nejprve v DOM najít a získat na něj referenci (odkaz). K tomu slouží různé metody objektu `document` (nebo jiných elementů):

1.  **`document.getElementById('idElementu')`**
    * Vybere element podle jeho unikátního atributu `id`.
    * Vrací **jeden element** nebo `null`, pokud element s daným `id` neexistuje.
    * Je to nejrychlejší metoda pro výběr, pokud znáte `id`.
    ```html
    <div id="hlavniKontejner">Toto je hlavní kontejner.</div>
    ```
    ```javascript
    const hlavniKontejner = document.getElementById('hlavniKontejner');
    if (hlavniKontejner) {
        console.log(hlavniKontejner.textContent); // Vypíše obsah divu
    }
    ```

2.  **`document.getElementsByClassName('nazevTridy')`**
    * Vybere všechny elementy, které mají danou třídu (atribut `class`).
    * Vrací **živou `HTMLCollection`** (pole-like objekt) elementů, i když najde jen jeden. Pokud nenajde žádný, vrací prázdnou kolekci.
    ```html
    <p class="poznamka">První poznámka.</p>
    <div class="poznamka">Druhá poznámka v divu.</div>
    ```
    ```javascript
    const poznamky = document.getElementsByClassName('poznamka');
    console.log(poznamky.length); // Vypíše počet elementů s třídou "poznamka"
    for (let i = 0; i < poznamky.length; i++) {
        poznamky[i].style.color = 'blue'; // Změní barvu textu všech poznámek na modrou
    }
    ```

3.  **`document.getElementsByTagName('nazevTagu')`**
    * Vybere všechny elementy daného HTML tagu (např. `p`, `div`, `li`).
    * Vrací **živou `HTMLCollection`** elementů.
    ```javascript
    const vsechnyOdstavce = document.getElementsByTagName('p');
    console.log(`Na stránce je ${vsechnyOdstavce.length} odstavců.`);
    ```

4.  **`document.querySelector('cssSelektor')`**
    * Vybere **první** element, který odpovídá zadanému CSS selektoru (může být jednoduchý i komplexní).
    * Vrací **jeden element** nebo `null`, pokud žádný neodpovídá.
    * Velmi flexibilní a často používaná metoda.
    ```html
    <div id="menu">
        <ul>
            <li class="polozka aktivni">Domů</li>
            <li class="polozka">Služby</li>
        </ul>
    </div>
    ```
    ```javascript
    const aktivniPolozkaMenu = document.querySelector('#menu li.aktivni'); // CSS selektor
    if (aktivniPolozkaMenu) {
        aktivniPolozkaMenu.style.fontWeight = 'bold';
    }
    const prvniOdstavec = document.querySelector('p'); // Najde první <p> na stránce
    ```

5.  **`document.querySelectorAll('cssSelektor')`**
    * Vybere **všechny** elementy, které odpovídají zadanému CSS selektoru.
    * Vrací **statickou `NodeList`** (pole-like objekt) elementů. Pokud nenajde žádný, vrací prázdný `NodeList`.
    * Na rozdíl od `HTMLCollection` (z `getElementsByClassName` a `getElementsByTagName`), `NodeList` vrácená `querySelectorAll` není "živá" – nezmění se automaticky, pokud se DOM změní po jejím vytvoření.
    ```javascript
    const vsechnyPolozkyMenu = document.querySelectorAll('#menu .polozka');
    vsechnyPolozkyMenu.forEach(function(polozka) {
        console.log(polozka.textContent);
    });
    ```

## Manipulace s DOM elementy

Jakmile máme referenci na element, můžeme s ním provádět různé operace:

### Změna obsahu

* **`element.innerHTML`**:
    * Umožňuje číst nebo **nastavovat HTML obsah** elementu.
    * Při nastavování parsuje řetězec jako HTML.
    * **Pozor na bezpečnost!** Pokud vkládáte obsah od uživatele pomocí `innerHTML`, může to vést k XSS (Cross-Site Scripting) útokům. Používejte opatrně.
    ```javascript
    const box = document.getElementById('box');
    box.innerHTML = '<strong>Nový tučný text</strong> a <a href="#">odkaz</a>';
    ```
* **`element.textContent`**:
    * Umožňuje číst nebo **nastavovat textový obsah** elementu a všech jeho potomků.
    * Ignoruje HTML tagy, zachází s nimi jako s textem.
    * **Bezpečnější** pro vkládání textu od uživatele.
    ```javascript
    const nadpis = document.querySelector('h1');
    nadpis.textContent = 'Změněný název stránky (pouze text)';
    ```
* **`element.innerText`**: Podobné `textContent`, ale bere v úvahu CSS styly (např. nezobrazí text ze skrytých elementů). Jeho chování může být méně konzistentní napříč prohlížeči než `textContent`.

### Změna atributů

* **`element.getAttribute('nazevAtributu')`**: Vrátí hodnotu zadaného atributu.
* **`element.setAttribute('nazevAtributu', 'novaHodnota')`**: Nastaví hodnotu atributu. Pokud atribut neexistuje, vytvoří ho.
* **`element.removeAttribute('nazevAtributu')`**: Odebere atribut.
* Pro běžné atributy jako `id`, `class`, `src`, `href` lze často přistupovat přímo jako k vlastnostem objektu:
    ```javascript
    const obrazek = document.querySelector('img');
    obrazek.src = 'novy_obrazek.jpg';
    obrazek.alt = 'Popis nového obrázku';

    const odkaz = document.querySelector('a');
    odkaz.href = '[https://www.google.com](https://www.google.com)';
    odkaz.setAttribute('target', '_blank');
    ```

### Změna stylů

* **`element.style.cssVlastnost = 'hodnota'`**: Umožňuje přímo měnit inline CSS styly elementu. Názvy CSS vlastností s pomlčkou (např. `background-color`) se v JavaScriptu píší pomocí camelCase (např. `backgroundColor`).
    ```javascript
    const upozorneni = document.getElementById('upozorneni');
    upozorneni.style.color = 'red';
    upozorneni.style.backgroundColor = '#ffeeee';
    upozorneni.style.padding = '10px';
    upozorneni.style.border = '1px solid darkred';
    upozorneni.style.fontWeight = 'bold';
    ```
    Toto nastavuje inline styly, které mají vysokou specificitu. Pro komplexnější změny vzhledu je lepší manipulovat s CSS třídami.

### Práce s CSS třídami

* **`element.className`**: Umožňuje číst nebo nastavit celý řetězec atributu `class`. Při nastavování přepíše všechny existující třídy.
* **`element.classList`**: Modernější a flexibilnější přístup. Poskytuje objekt s metodami:
    * `add('nazevTridy')`: Přidá třídu.
    * `remove('nazevTridy')`: Odebere třídu.
    * `toggle('nazevTridy')`: Přidá třídu, pokud neexistuje, jinak ji odebere.
    * `contains('nazevTridy')`: Vrací `true`, pokud element má danou třídu, jinak `false`.
    * `replace('staraTrida', 'novaTrida')`: Nahradí třídu.
    ```html
    <p id="message" class="info">Toto je zpráva.</p>
    ```
    ```javascript
    const zprava = document.getElementById('message');
    zprava.classList.remove('info');
    zprava.classList.add('success'); // Přidá třídu 'success'
    // Nyní má element class="success"

    if (zprava.classList.contains('success')) {
        zprava.textContent = 'Operace proběhla úspěšně!';
    }
    zprava.classList.toggle('visible'); // Přidá/odebere třídu 'visible'
    ```

## Vytváření a vkládání/odebírání elementů

* **`document.createElement('nazevTagu')`**: Vytvoří nový HTML element daného typu.
    ```javascript
    const novyOdstavec = document.createElement('p');
    ```
* **`element.appendChild(novyPotomek)`**: Připojí `novyPotomek` jako posledního potomka `elementu`.
    ```javascript
    novyOdstavec.textContent = 'Toto je dynamicky vytvořený odstavec.';
    document.body.appendChild(novyOdstavec); // Přidá odstavec na konec <body>
    ```
* **`element.insertBefore(novyUzel, referencniUzel)`**: Vloží `novyUzel` před `referencniUzel` uvnitř `elementu`.
* **`element.removeChild(potomek)`**: Odebere `potomka` z `elementu`.
* **`element.replaceChild(novyPotomek, staryPotomek)`**: Nahradí `staryPotomek` za `novyPotomek`.

## Traverzování DOM (Pohyb po stromu)

Můžeme se pohybovat po DOM stromu od jednoho uzlu k druhému:

* **Rodičovské uzly:**
    * `uzel.parentNode`: Vrátí rodičovský uzel (může být i jiný typ uzlu než element).
    * `uzel.parentElement`: Vrátí rodičovský element (nebo `null`, pokud rodič není element).
* **Dceřiné uzly:**
    * `uzel.childNodes`: Vrátí `NodeList` všech potomků (včetně textových uzlů, komentářů).
    * `uzel.children`: Vrátí `HTMLCollection` pouze elementových potomků. **(Častěji používané)**
    * `uzel.firstChild`: První potomek (může být textový uzel).
    * `uzel.lastChild`: Poslední potomek (může být textový uzel).
    * `uzel.firstElementChild`: První potomek, který je element.
    * `uzel.lastElementChild`: Poslední potomek, který je element.
* **Sourozenecké uzly:**
    * `uzel.previousSibling`: Předchozí sourozenec (může být textový uzel).
    * `uzel.nextSibling`: Následující sourozenec (může být textový uzel).
    * `uzel.previousElementSibling`: Předchozí sourozenec, který je element.
    * `uzel.nextElementSibling`: Následující sourozenec, který je element.

## JavaScriptové Události (Events)

Události jsou akce, které se dějí v prohlížeči, na které může JavaScript reagovat. Mohou být iniciovány:
* Uživatelem (např. kliknutí myší, stisk klávesy, odeslání formuláře).
* Prohlížečem (např. dokončení načítání stránky, změna velikosti okna).

**Zpracování událostí (Event Handling):**

1.  **Inline event handlery (v HTML atributech):**
    ```html
    <button onclick="alert('Kliknuto!');">Klikni zde</button>
    ```
    **Nedoporučeno** pro větší aplikace kvůli míchání HTML a JS a horší údržbě.

2.  **DOM property event handlery (Vlastnosti DOM elementů):**
    Přiřazení funkce vlastnosti elementu, která odpovídá události (např. `onclick`, `onmouseover`).
    ```javascript
    const tlacitko = document.getElementById('mojeTlacitko');
    if (tlacitko) {
        tlacitko.onclick = function() {
            console.log('Tlačítko (ID mojeTlacitko) bylo stisknuto!');
        };
        // Pozor: Na jednu událost lze takto přiřadit pouze jeden handler. Další přiřazení přepíše předchozí.
        tlacitko.onclick = () => console.log('Přepsaný handler!'); // Předchozí se už nespustí
    }
    ```

3.  **`element.addEventListener('typUdalosti', funkceHandler, [options])` (Doporučený způsob):**
    * Umožňuje přiřadit **více handlerů** k jedné události na jednom elementu.
    * Poskytuje větší kontrolu nad fází zachytávání/bublání události.
    * `typUdalosti`: Řetězec názvu události bez prefixu "on" (např. `'click'`, `'mouseover'`, `'keydown'`).
    * `funkceHandler`: Funkce, která se má spustit, když událost nastane. Tato funkce automaticky obdrží jako první argument objekt události (event object).
    * `options` (volitelné): Objekt s možnostmi, např. `{ capture: true/false, once: true/false, passive: true/false }`.
        * `capture: true` – handler se spustí ve fázi zachytávání, jinak ve fázi bublání (výchozí).
        * `once: true` – handler se po prvním spuštění automaticky odstraní.
    ```javascript
    const lepsiTlacitko = document.getElementById('lepsiTlacitko');
    function handleClick() {
        console.log('Lepší tlačítko bylo stisknuto!');
    }
    function jinyClickHandler() {
        console.log('Toto je druhý handler pro kliknutí!');
    }

    if (lepsiTlacitko) {
        lepsiTlacitko.addEventListener('click', handleClick);
        lepsiTlacitko.addEventListener('click', jinyClickHandler); // Oba handlery se spustí
    }
    ```
    **Odstranění event listeneru:** `element.removeEventListener('typUdalosti', funkceHandler, [options])`. Je nutné předat stejnou funkci, která byla použita pro přidání.

### Objekt události (Event Object)

Když nastane událost, funkce handleru obdrží jako argument objekt události (často pojmenovaný `event`, `evt` nebo `e`). Tento objekt obsahuje informace o události:
* `event.type`: Typ události (např. `'click'`).
* `event.target`: Element, na kterém událost původně nastala (nejvnitřnější element).
* `event.currentTarget`: Element, na kterém je aktuálně zpracováván handler (pokud se využívá event bubbling).
* `event.preventDefault()`: Metoda, která zabrání výchozí akci prohlížeče spojené s událostí (např. odeslání formuláře při kliknutí na submit tlačítko, následování odkazu).
* `event.stopPropagation()`: Metoda, která zastaví další šíření (bublání/zachytávání) události k rodičovským/dceřiným elementům.
* Specifické vlastnosti pro různé typy událostí:
    * Myš: `event.clientX`, `event.clientY`, `event.button`.
    * Klávesnice: `event.key`, `event.code`, `event.altKey`, `event.ctrlKey`, `event.shiftKey`.

### Běžné typy událostí

* **Myš:** `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, `mousemove`, `contextmenu` (pravé tlačítko).
* **Klávesnice:** `keydown` (stisk klávesy), `keyup` (uvolnění klávesy), `keypress` (zadání znaku - starší, méně spolehlivé).
* **Formuláře:**
    * `submit`: Při odeslání formuláře (na elementu `<form>`).
    * `change`: Když se změní hodnota formulářového prvku (např. `<input>`, `<select>`, `<textarea>`) a prvek ztratí fokus.
    * `input`: Při každé změně hodnoty vstupního pole (častěji používané pro okamžitou reakci než `change`).
    * `focus`: Když formulářový prvek získá fokus.
    * `blur`: Když formulářový prvek ztratí fokus.
* **Načítání dokumentu/zdrojů:**
    * `DOMContentLoaded`: Když je HTML kompletně načteno a zparsováno, DOM je připraven (CSS, obrázky atd. ještě nemusí být načteny). **Často používané pro spouštění JS kódu, který manipuluje s DOM.**
    * `load`: Když je celá stránka (HTML, CSS, obrázky, skripty atd.) kompletně načtena (na objektu `window`).
    * `error`: Pokud dojde k chybě při načítání zdroje (např. obrázku).
* **Okno prohlížeče:** `resize`, `scroll` (na objektu `window`).

### Event Bubbling a Capturing (Fáze událostí)

Když nastane událost na nějakém elementu, prochází třemi fázemi:
1.  **Capturing Phase (Fáze zachytávání):** Událost "cestuje" od kořene dokumentu (`window`) dolů k cílovému elementu. Handlery nastavené pro tuto fázi se spouští jako první.
2.  **Target Phase (Cílová fáze):** Událost dosáhne cílového elementu, na kterém byla přímo vyvolána.
3.  **Bubbling Phase (Fáze bublání):** Událost "bublá" od cílového elementu nahoru zpět k `window`. Handlery nastavené pro tuto fázi (výchozí pro `addEventListener`) se spouští v tomto pořadí.

Většina handlerů se registruje pro fázi bublání.
* `event.stopPropagation()` zastaví další šíření v aktuální fázi i přechod do další.

## Shrnutí

DOM poskytuje JavaScriptu mocné nástroje pro dynamickou interakci s HTML stránkou. Schopnost vybírat elementy, měnit jejich obsah, atributy a styly, a také vytvářet a mazat elementy, je základem pro tvorbu dynamických webových rozhraní. Události nám pak umožňují reagovat na akce uživatele a další dění v prohlížeči, čímž stránky ožívají. Metoda `addEventListener` je preferovaným způsobem pro registraci event handlerů.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte HTML soubor** (`dom_events_cviceni.html`) s následujícími prvky:
    * Nadpis `<h1>` s textem "Manipulace s DOM a Události".
    * Tlačítko `<button id="zmenNadpisBtn">Změň nadpis</button>`.
    * Další tlačítko `<button id="pridejOdstavecBtn">Přidej odstavec</button>`.
    * Prázdný `div` s `id="kontejnerProOdstavce"`.
    * Odstavec `<p id="pocitadloText">Počet kliknutí na Změň nadpis: 0</p>`.
2.  **Připojte externí JavaScriptový soubor** (`skripty/dom_cviceni.js`).
3.  **V `skripty/dom_cviceni.js` napište kód, který:**
    * Po kliknutí na tlačítko `#zmenNadpisBtn`:
        * Změní text hlavního nadpisu `<h1>` na "Nadpis byl změněn JavaScriptem!".
        * Změní barvu textu nadpisu na červenou.
        * Inkrementuje počítadlo kliknutí a aktualizuje text v odstavci `#pocitadloText`.
    * Po kliknutí na tlačítko `#pridejOdstavecBtn`:
        * Vytvoří nový element `<p>`.
        * Nastaví jeho textový obsah na "Nově přidaný odstavec."
        * Přidá tento nový odstavec do `divu` s `id="kontejnerProOdstavce"`.
    * (Volitelně pro pokročilejší) Když uživatel najede myší (`mouseover`) na `div` s `id="kontejnerProOdstavce"`, změňte jeho barvu pozadí. Když myš opustí tento `div` (`mouseout`), vraťte barvu pozadí na původní.
    * (Volitelně pro pokročilejší) Přidejte do `divu` `#kontejnerProOdstavce` posluchač událostí tak, že když se klikne na jakýkoliv odstavec uvnitř tohoto `divu` (využijte event bubbling a `event.target`), tak se text kliknutého odstavce vypíše do konzole.
4.  **Otevřete `dom_events_cviceni.html` v prohlížeči** a otestujte funkčnost. Sledujte změny na stránce i výstupy v konzoli.

*(Toto cvičení vám pomůže prakticky si vyzkoušet výběr elementů, manipulaci s jejich obsahem a styly, a registraci event handlerů.)*
