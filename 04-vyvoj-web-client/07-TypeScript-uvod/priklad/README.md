# Příklad: TypeScript s Dockerem

Tento příklad demonstruje základní nastavení TypeScript projektu, jeho kompilaci a spuštění v Docker kontejneru pomocí Docker Compose. Aplikace je jednoduchý konzolový program, který vypisuje různé ukázky TypeScript kódu.

## Struktura projektu

```
.
├── Dockerfile              # Definuje Docker image pro naši aplikaci
├── docker-compose.yml      # Definuje službu pro spuštění aplikace
├── package.json            # Definuje závislosti projektu a skripty
├── tsconfig.json           # Konfigurační soubor pro TypeScript kompilátor
├── src/                    # Adresář se zdrojovými TypeScript soubory
│   ├── index.ts            # Hlavní vstupní bod aplikace
│   └── shapes.ts           # Pomocný modul s definicí tvarů
└── dist/                   # Adresář pro zkompilované JavaScript soubory (vytvoří se po buildu)
```

## Předpoklady

* Nainstalovaný **Docker** a **Docker Compose**.
* Základní znalost příkazové řádky.

## Jak spustit příklad

1.  **Naklonujte repozitář** (nebo si stáhněte soubory tohoto příkladu do jednoho adresáře).
2.  **Otevřete terminál** nebo příkazovou řádku a přejděte do kořenového adresáře tohoto příkladu (tam, kde se nachází soubor `docker-compose.yml`).
3.  **Sestavte Docker image a spusťte kontejner:**
    ```bash
    docker-compose up --build
    ```
    * Příkaz `--build` zajistí, že se Docker image sestaví podle `Dockerfile` (pokud ještě neexistuje nebo pokud se `Dockerfile` změnil).
    * `docker-compose up` spustí službu definovanou v `docker-compose.yml`.

4.  **Sledujte výstup:**
    Po úspěšném sestavení a spuštění byste měli v terminálu vidět výstupy z `console.log()` příkazů definovaných v `src/index.ts`. Kontejner se po dokončení skriptu (`node dist/index.js`) ukončí.

    Pokud chcete kontejner spustit na pozadí (detached mode), můžete použít:
    ```bash
    docker-compose up --build -d
    ```
    V tomto případě si výstupy zobrazíte pomocí:
    ```bash
    docker-compose logs -f typescript_app
    ```
    (Kde `typescript_app` je název služby definovaný v `docker-compose.yml`).

5.  **Zastavení a odstranění kontejneru:**
    Pokud jste nespustili s `-d`, stiskněte `Ctrl+C` v terminálu, kde běží `docker-compose up`.
    Pro odstranění kontejneru (a sítě vytvořené Docker Compose) spusťte:
    ```bash
    docker-compose down
    ```

## Soubory projektu

### `src/index.ts`
Hlavní soubor s ukázkami TypeScriptu:
* Základní typy (string, number, boolean, array, object).
* Typové anotace.
* Funkce s typovanými parametry a návratovými hodnotami.
* Použití rozhraní (Interfaces) a tříd (Classes) importovaných z `shapes.ts`.
* Enumy.
* Jednoduchý příklad generik.
* Union typy a typové aliasy.

### `src/shapes.ts`
Definuje rozhraní `Shape` a třídy `Circle` a `Rectangle`, které toto rozhraní implementují. Slouží k demonstraci modulů a OOP v TypeScriptu.

### `tsconfig.json`
Konfigurace pro TypeScript kompilátor (`tsc`). Určuje, jak se `.ts` soubory překládají do `.js`, cílovou verzi JavaScriptu, adresáře pro zdrojové a výstupní soubory atd.

### `package.json`
Standardní soubor pro Node.js projekty. Definuje metadata projektu, závislosti (např. `typescript`) a skripty (`build` pro kompilaci, `start` pro spuštění).

### `Dockerfile`
Instrukce pro sestavení Docker image:
1.  Vychází z oficiálního Node.js image.
2.  Nainstaluje projektové závislosti (`npm install`).
3.  Zkopíruje zdrojové kódy.
4.  Zkompiluje TypeScript na JavaScript (`npm run build`, což volá `tsc`).
5.  Nastaví výchozí příkaz pro spuštění zkompilované aplikace (`npm start`, což volá `node dist/index.js`).

### `docker-compose.yml`
Definuje službu `typescript_app`, která používá image sestavený z `Dockerfile`. Usnadňuje spuštění aplikace jedním příkazem.

## Experimentování
Můžete upravovat kód v souborech v adresáři `src/`, následně znovu sestavit a spustit aplikaci pomocí `docker-compose up --build`, abyste viděli dopad svých změn. Zkuste například:
* Přidat nové funkce nebo třídy.
* Experimentovat s různými typy.
* Úmyslně vytvořit typovou chybu v `.ts` souboru a sledovat, jak `tsc` (během `docker-compose build`) ohlásí chybu.
