# 6. Asynchronní JavaScript: Promise, async/await, fetch API pro komunikaci s backendem

Moderní webové aplikace často potřebují provádět operace, které nějakou dobu trvají – například načítání dat ze serveru (API), práce se soubory, nebo časově náročné výpočty. Pokud by se tyto operace prováděly **synchronně**, zablokovaly by hlavní vlákno JavaScriptu, což by vedlo k "zamrznutí" uživatelského rozhraní (stránka by nereagovala na akce uživatele).

**Asynchronní programování** umožňuje provádět tyto operace na pozadí, aniž by blokovaly hlavní vlákno. Jakmile je asynchronní operace dokončena (úspěšně nebo neúspěšně), JavaScript může zareagovat na výsledek.

## Problém se synchronním kódem

Představte si, že kliknete na tlačítko, které má načíst velký objem dat ze serveru. Kdyby kód pro načítání byl synchronní:
1. JavaScript by odeslal požadavek na server.
2. JavaScript by **čekal**, dokud server neodpoví.
3. Během tohoto čekání by celá stránka byla **neaktivní** – žádné animace, žádná reakce na další kliknutí, nic.
4. Až po obdržení odpovědi by se stránka "probudila".

Toto samozřejmě není pro uživatele ideální.

## Callback funkce (zpětná volání)

Historicky prvním mechanismem pro řešení asynchronicity v JavaScriptu byly **callback funkce**. Callback je funkce, která je předána jako argument jiné funkci a je zavolána až po dokončení nějaké operace.

```javascript
function nactiDataZeServeru(url, callbackPoUspechu, callbackPoChybe) {
    // Simulace síťového požadavku
    console.log(`Načítám data z: ${url}`);
    setTimeout(() => { // setTimeout simuluje zpoždění sítě
        const uspesne = Math.random() > 0.3; // Náhodně simulujeme úspěch/chybu
        if (uspesne) {
            const data = { message: "Data byla úspěšně načtena!" };
            callbackPoUspechu(data);
        } else {
            const chyba = { message: "Chyba při načítání dat." };
            callbackPoChybe(chyba);
        }
    }, 2000); // Simulované zpoždění 2 sekundy
}

// Použití:
nactiDataZeServeru(
    "[https://api.example.com/data](https://api.example.com/data)",
    function(data) { // Callback pro úspěch
        console.log("Úspěch:", data.message);
    },
    function(chyba) { // Callback pro chybu
        console.error("Chyba:", chyba.message);
    }
);

console.log("Požadavek na data odeslán, čekám na odpověď (kód pokračuje dál)...");
```
Problém s callbacky nastává, když potřebujeme provést více asynchronních operací za sebou, které na sebe navazují. To může vést k tzv. **"Callback Hell"** (nebo "Pyramid of Doom") – hluboce vnořeným callbackům, které jsou špatně čitelné a udržovatelné.

```javascript
// Příklad Callback Hell (NEPOUŽÍVAT TAKTO)
operace1(function(vysledek1) {
    operace2(vysledek1, function(vysledek2) {
        operace3(vysledek2, function(vysledek3) {
            // ... a tak dále
        });
    });
});
```

## Promises (Sliby) - ES6+

Promises (sliby) byly zavedeny v ES6 jako elegantnější řešení pro práci s asynchronními operacemi. Promise je objekt, který reprezentuje **budoucí výsledek** asynchronní operace. Může být v jednom ze tří stavů:

1.  **`pending` (čekající):** Počáteční stav; operace ještě nebyla dokončena.
2.  **`fulfilled` (splněný):** Operace byla úspěšně dokončena. Promise má výslednou hodnotu.
3.  **`rejected` (odmítnutý):** Operace selhala. Promise má důvod selhání (chybu).

Jakmile je promise `fulfilled` nebo `rejected`, je "usazená" (settled) a její stav se již nemění.

### Vytváření Promise

```javascript
const mujPrvniSlib = new Promise((resolve, reject) => {
    // Asynchronní operace zde (např. setTimeout, fetch)
    setTimeout(() => {
        const uspesne = Math.random() > 0.5;
        if (uspesne) {
            resolve("Operace proběhla úspěšně!"); // Splnění slibu s hodnotou
        } else {
            reject(new Error("Operace selhala.")); // Odmítnutí slibu s chybou
        }
    }, 1000);
});
```
Funkce předaná konstruktoru `Promise` přijímá dva argumenty: `resolve` a `reject`. Jsou to funkce, které zavoláme pro změnu stavu promise.

### Použití Promise (`.then()`, `.catch()`, `.finally()`)

* **`promise.then(onFulfilled, onRejected)`**:
    * `onFulfilled`: Funkce, která se zavolá, když je promise splněna. Jako argument obdrží výslednou hodnotu.
    * `onRejected` (volitelné): Funkce, která se zavolá, když je promise odmítnuta. Jako argument obdrží chybu.
* **`promise.catch(onRejected)`**: Syntaktický cukr pro `promise.then(null, onRejected)`. Používá se pro zachytávání chyb.
* **`promise.finally(onFinally)`**: Funkce, která se zavolá vždy, když je promise usazená (ať už `fulfilled` nebo `rejected`). Užitečné pro úklidové operace.

```javascript
mujPrvniSlib
    .then((hodnota) => {
        console.log("Výsledek slibu:", hodnota); // Spustí se, pokud resolve()
        return "Další hodnota pro další .then()";
    })
    .then((dalsiHodnota) => {
        console.log("Zřetězený .then():", dalsiHodnota);
    })
    .catch((chyba) => {
        console.error("Chyba slibu:", chyba.message); // Spustí se, pokud reject()
    })
    .finally(() => {
        console.log("Slib byl usazen (splněn nebo odmítnut).");
    });
```
Metody `.then()` a `.catch()` samy vracejí novou promise, což umožňuje **řetězení (chaining)**.

### Statické metody Promise

* **`Promise.all(iterable)`**: Čeká, až se splní **všechny** promises v iterovatelném objektu (např. poli). Pokud všechny uspějí, vrátí pole jejich výsledků (ve stejném pořadí). Pokud alespoň jedna selže, `Promise.all` okamžitě selže s chybou první odmítnuté promise.
    ```javascript
    const slib1 = Promise.resolve(1);
    const slib2 = new Promise(resolve => setTimeout(() => resolve(2), 100));
    const slib3 = Promise.resolve(3);

    Promise.all([slib1, slib2, slib3])
        .then(vysledky => console.log("Promise.all:", vysledky)); // [1, 2, 3]
    ```
* **`Promise.race(iterable)`**: Čeká, až se usadí (splní nebo odmítne) **první** promise z iterovatelného objektu. Výsledek `Promise.race` je pak výsledek této první usazené promise.
* **`Promise.allSettled(iterable)` (ES2020+):** Čeká, až se **všechny** promises usadí (ať už splněním nebo odmítnutím). Vrátí pole objektů popisujících výsledek každé promise (`{status: 'fulfilled', value: ...}` nebo `{status: 'rejected', reason: ...}`).
* **`Promise.any(iterable)` (ES2021+):** Čeká, až se splní **první** promise. Pokud všechny selžou, vrátí `AggregateError`.

## Async/Await (ES2017+)

`async` a `await` jsou syntaktický cukr nad Promises, který umožňuje psát asynchronní kód způsobem, který vypadá a chová se více jako synchronní kód. To výrazně zlepšuje čitelnost.

* **`async function`**: Klíčové slovo `async` před deklarací funkce znamená, že tato funkce **vždy vrací Promise**. Pokud funkce explicitně vrátí hodnotu, tato hodnota bude "zabalena" do splněné Promise. Pokud funkce vyhodí výjimku, Promise bude odmítnuta s touto výjimkou.
* **`await` operátor**: Lze použít **pouze uvnitř `async` funkce**. Pozastaví vykonávání `async` funkce, dokud se Promise za `await` neusadí. Pokud je Promise splněna, `await` vrátí její hodnotu. Pokud je odmítnuta, `await` vyhodí chybu (kterou lze zachytit pomocí `try...catch`).

```javascript
function ziskejDataPoZpozdeni(hodnota, zpozdeni) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Vracím hodnotu: ${hodnota}`);
            resolve(hodnota);
        }, zpozdeni);
    });
}

async function mojeAsynchronniFunkce() {
    console.log("Začátek asynchronní funkce");
    try {
        const vysledek1 = await ziskejDataPoZpozdeni("První data", 1000);
        console.log("Obdrženo:", vysledek1);

        const vysledek2 = await ziskejDataPoZpozdeni("Druhá data", 500);
        console.log("Obdrženo:", vysledek2);

        const vysledek3 = await ziskejDataPoZpozdeni("Třetí data", 1500);
        console.log("Obdrženo:", vysledek3);

        return `Všechny operace dokončeny: ${vysledek1}, ${vysledek2}, ${vysledek3}`;
    } catch (chyba) {
        console.error("Chyba v asynchronní funkci:", chyba);
        throw chyba; // Můžeme chybu znovu vyhodit, aby ji zachytil volající
    }
}

// Volání async funkce a zpracování její Promise
mojeAsynchronniFunkce()
    .then(konecnyVysledek => {
        console.log("Konečný výsledek:", konecnyVysledek);
    })
    .catch(chyba => {
        console.error("Chyba při volání asynchronní funkce:", chyba);
    });

console.log("Kód po volání asynchronní funkce pokračuje...");
```async/await` výrazně zjednodušuje práci s více navazujícími asynchronními operacemi.

## `fetch` API

`fetch` API je moderní webové API pro provádění HTTP požadavků (např. pro komunikaci s backendovým REST API). Je založené na Promises.

### Základní `GET` požadavek

```javascript
const apiUrl = '[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)'; // Veřejné testovací API

fetch(apiUrl) // fetch vrací Promise
    .then(response => {
        // Objekt 'response' obsahuje metadata o odpovědi (stavový kód, hlavičky atd.)
        // Tělo odpovědi je stream, který musíme zpracovat
        console.log('Stav odpovědi:', response.status); // např. 200
        console.log('OK?:', response.ok); // true, pokud je status v rozsahu 200-299

        if (!response.ok) {
            // Pokud server vrátil chybu (např. 404, 500), vyhodíme vlastní chybu
            throw new Error(`HTTP chyba! Stav: ${response.status}`);
        }
        return response.json(); // response.json() také vrací Promise, která se splní s naparsovanými JSON daty
        // Další metody: response.text(), response.blob(), response.formData()
    })
    .then(data => {
        // 'data' jsou nyní naparsovaná JSON data
        console.log('Přijatá data (JSON):', data);
        // Zde můžeme s daty pracovat (např. zobrazit je na stránce)
    })
    .catch(error => {
        // Zachytí chyby ze sítě (např. DNS chyba, server nedostupný)
        // nebo chyby vyhozené v .then() bloku (např. z !response.ok)
        console.error('Chyba při fetch operaci:', error);
    });
```

### `GET` požadavek s `async/await`

```javascript
async function nactiTodoPolozku(id) {
    const apiUrl = `https://jsonplaceholder.typicode.com/todos/${id}`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP chyba! Stav: ${response.status}, URL: ${response.url}`);
        }

        const data = await response.json(); // Čekáme na naparsování JSONu
        console.log(`Data pro TODO ${id}:`, data);
        return data;
    } catch (error) {
        console.error(`Nepodařilo se načíst TODO ${id}:`, error);
        // Můžeme zde chybu dále zpracovat nebo ji nechat "probublat"
        throw error;
    }
}

// Použití
nactiTodoPolozku(5)
    .then(todo => {
        if (todo) {
            // Zpracuj načtenou TODO položku
            document.body.innerHTML += `<p>Načteno TODO: ${todo.title}</p>`;
        }
    })
    .catch(err => console.log("Celková chyba při načítání TODO."));

nactiTodoPolozku(999) // Pokus o načtení neexistující položky (očekáváme 404)
    .catch(err => console.log("Chyba při načítání neexistující TODO (očekáváno)."));
```

### `POST` požadavek (a další metody)

Pro jiné HTTP metody (`POST`, `PUT`, `DELETE` atd.) nebo pro posílání dat v těle požadavku či nastavení hlaviček, `fetch` přijímá druhý volitelný argument – objekt s konfigurací.

```javascript
async function vytvorNovyPrispevek(dataPrispevku) {
    const apiUrl = '[https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // HTTP metoda
            headers: {
                'Content-Type': 'application/json; charset=UTF-8', // Typ obsahu, který posíláme
                // 'Authorization': 'Bearer VAS_TOKEN' // Příklad pro autentizaci
            },
            body: JSON.stringify(dataPrispevku) // Data převedená na JSON řetězec
        });

        if (!response.ok) {
            // response.statusText může obsahovat textový popis chyby od serveru
            throw new Error(`HTTP chyba! Stav: ${response.status} ${response.statusText}`);
        }

        const vytvorenyPrispevek = await response.json();
        console.log('Vytvořený příspěvek:', vytvorenyPrispevek);
        return vytvorenyPrispevek;
    } catch (error) {
        console.error('Chyba při vytváření příspěvku:', error);
        throw error;
    }
}

// Použití
const novyPrispevekData = {
    title: 'Můj nový příspěvek',
    body: 'Toto je obsah mého nového příspěvku.',
    userId: 1
};

vytvorNovyPrispevek(novyPrispevekData)
    .then(prispevek => {
        if (prispevek) {
            console.log(`Příspěvek s ID ${prispevek.id} byl úspěšně vytvořen.`);
        }
    });
```
Podobně by se postupovalo pro `PUT` (aktualizace) nebo `DELETE` (mazání), jen by se změnila `method` a případně tělo požadavku. Pro `DELETE` často není tělo potřeba a server může vrátit stav `204 No Content`.

### Zpracování chyb s `fetch`

* `fetch()` Promise je odmítnuta **pouze v případě síťové chyby** (např. server není dostupný, DNS problém).
* Pokud server vrátí HTTP chybový stav (např. 404 Not Found, 500 Internal Server Error), `fetch()` Promise je **splněna** (`fulfilled`), ale vlastnost `response.ok` bude `false` a `response.status` bude obsahovat chybový kód. Je tedy **na nás**, abychom explicitně zkontrolovali `response.ok` a případně vyhodili chybu, aby ji mohl zachytit `.catch()` blok.

## Shrnutí

Asynchronní JavaScript je nezbytný pro moderní webové aplikace, aby zůstaly responzivní. Promises a novější syntaxe `async/await` poskytují čisté a efektivní způsoby, jak pracovat s asynchronními operacemi. `fetch` API je standardním nástrojem pro provádění HTTP požadavků na straně klienta, umožňující komunikaci s backendovými API a načítání dat. Správné zpracování úspěšných odpovědí i chybových stavů je klíčové pro robustní aplikace.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte HTML soubor** (`fetch_cviceni.html`) se základní strukturou.
    * Přidejte tlačítko `<button id="nacistDataBtn">Načíst uživatele</button>`.
    * Přidejte prázdný `div` s `id="dataKontejner"`, kam budete vypisovat načtená data.
2.  **Připojte externí JavaScriptový soubor** (`skripty/fetch_skript.js`).
3.  **V `skripty/fetch_skript.js`:**
    * Napište `async` funkci `nactiUzivatele()`, která:
        * Použije `fetch` k načtení dat z URL: `https://jsonplaceholder.typicode.com/users` (toto API vrací pole uživatelů).
        * Zkontroluje, zda je `response.ok`. Pokud ne, vyhodí chybu.
        * Převede odpověď na JSON.
        * Vrátí pole uživatelů.
        * Implementuje `try...catch` pro ošetření chyb.
    * Přidejte `event listener` na tlačítko `#nacistDataBtn`. Po kliknutí:
        * Zavolejte funkci `nactiUzivatele()`.
        * Pokud je volání úspěšné (`.then()`):
            * Vyčistěte obsah `#dataKontejner`.
            * Pro každého uživatele v poli vytvořte HTML strukturu (např. `<div><h3>Jméno</h3><p>Email: email</p><p>Web: web</p></div>`) a vložte ji do `#dataKontejner`.
        * Pokud dojde k chybě (`.catch()`):
            * Vypište chybovou zprávu do `#dataKontejner` nebo do `console.error()`.
    * (Volitelně) Přidejte do `#dataKontejner` zprávu "Načítám data..." před spuštěním `fetch` a skryjte ji po dokončení (ať už úspěšném nebo neúspěšném).

4.  **Otevřete `fetch_cviceni.html` v prohlížeči** a otestujte funkčnost tlačítka. Sledujte konzoli pro případné chyby.

*(Toto cvičení vám pomůže prakticky si vyzkoušet `fetch` API, práci s Promises (skrze `async/await`) a dynamické zobrazování dat na stránce.)*
