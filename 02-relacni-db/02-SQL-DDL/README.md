## 2. Jazyk SQL: Definice dat (DDL)

V této části se zaměříme na **Data Definition Language (DDL)**, podmnožinu jazyka SQL, která slouží k **definování a úpravě struktury databázových objektů**. Na rozdíl od DML (Data Manipulation Language), které pracuje s daty *uvnitř* tabulek (INSERT, UPDATE, DELETE), a DQL (Data Query Language), které data *vybírá* (SELECT), DDL definuje samotné "kontejnery" pro data – především tabulky.

Základními příkazy DDL jsou:

* `CREATE`: Vytváří nové databázové objekty (databáze, tabulky, pohledy, indexy, ...).
* `ALTER`: Modifikuje strukturu existujících objektů (přidává/odebírá sloupce, mění datové typy, přidává/odebírá omezení).
* `DROP`: Odstraňuje (maže) existující databázové objekty.

V této lekci se soustředíme na nejdůležitější DDL příkaz: `CREATE TABLE`.

### Příkaz `CREATE TABLE`

Tento příkaz slouží k vytvoření nové tabulky v databázi. Základní syntaxe vypadá následovně:

```sql
CREATE TABLE nazev_tabulky (
    nazev_sloupce1 datovy_typ [omezeni_sloupce...],
    nazev_sloupce2 datovy_typ [omezeni_sloupce...],
    ...,
    [omezeni_tabulky...]
);
```

* `nazev_tabulky`: Jméno nové tabulky. Mělo by být unikátní v rámci schématu databáze.
* `nazev_sloupceN`: Jméno sloupce (atributu).
* `datovy_typ`: Určuje typ dat, která může sloupec obsahovat (viz níže).
* `omezeni_sloupce`: Pravidla platná pro daný sloupec (např. `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `DEFAULT`, `CHECK`). Lze definovat přímo u sloupce.
* `omezeni_tabulky`: Pravidla platná pro více sloupců nebo celou tabulku (např. `PRIMARY KEY(sloupec1, sloupec2)`, `FOREIGN KEY`, `UNIQUE(sloupec1, sloupec2)`, `CHECK`). Definují se obvykle na konci definice tabulky.

**Doporučení pro názvy:** Používejte popisné názvy v jednotném stylu (často `snake_case` - malá písmena, slova oddělená podtržítkem), vyhýbejte se rezervovaným slovům SQL a diakritice.

### Datové typy v PostgreSQL (Výběr)

Správná volba datového typu je klíčová pro efektivitu ukládání, výkon dotazů a integritu dat. PostgreSQL nabízí širokou škálu typů, zde jsou nejběžnější:

* **Celá čísla:**
    * `SMALLINT`: Malé celé číslo (-32768 až +32767).
    * `INTEGER` (nebo `INT`): Standardní celé číslo (cca -2 miliardy až +2 miliardy). Nejčastější volba pro číselné ID.
    * `BIGINT`: Velké celé číslo (pro velmi velký rozsah).
    * `SERIAL`: Speciální typ pro auto-inkrementující se `INTEGER` primární klíč (automaticky se vytvoří sekvence a nastaví `NOT NULL`). PostgreSQL interně použije `INTEGER`.
    * `BIGSERIAL`: Totéž jako `SERIAL`, ale pro `BIGINT`.
* **Čísla s desetinnou čárkou:**
    * `NUMERIC(p, s)` nebo `DECIMAL(p, s)`: Číslo s pevnou řádovou čárkou, kde `p` je celková přesnost (počet číslic) a `s` je počet číslic za desetinnou čárkou. Vhodné pro finanční data.
    * `REAL`: Jednoduchá přesnost (cca 6 des. míst).
    * `DOUBLE PRECISION` (nebo `FLOAT`): Dvojitá přesnost (cca 15 des. míst).
* **Textové řetězce:**
    * `VARCHAR(n)`: Řetězec proměnné délky s maximální délkou `n` znaků.
    * `CHAR(n)`: Řetězec pevné délky `n` znaků (doplňuje se mezerami). Méně časté.
    * `TEXT`: Řetězec proměnné délky bez explicitního omezení. V PostgreSQL je často stejně efektivní jako `VARCHAR`.
* **Datum a čas:**
    * `DATE`: Pouze datum (např. '2025-04-08').
    * `TIME`: Pouze čas (např. '15:30:00').
    * `TIMESTAMP`: Datum i čas (např. '2025-04-08 15:30:00'). Lze použít i variantu `TIMESTAMP WITH TIME ZONE` (`TIMESTAMPTZ`), která ukládá i informaci o časovém pásmu (doporučeno).
* **Logické hodnoty:**
    * `BOOLEAN`: Může nabývat hodnot `TRUE`, `FALSE` nebo `NULL`.
* **Ostatní:**
    * `UUID`: Unikátní identifikátor.
    * `JSON`, `JSONB`: Pro ukládání JSON dat (JSONB je binární, efektivnější pro dotazování).
    * `BYTEA`: Binární data.
    * `ARRAY`: Pole (array) jiných datových typů.

### Omezení (Constraints)

Omezení definují pravidla pro data v tabulkách a pomáhají zajistit jejich integritu a konzistenci.

* **`NOT NULL`**: Zajišťuje, že sloupec nesmí obsahovat hodnotu `NULL`.
    ```sql
    CREATE TABLE priklad (
        id SERIAL PRIMARY KEY,
        jmeno VARCHAR(50) NOT NULL, -- Jméno musí být vždy zadáno
        email VARCHAR(100)
    );
    ```

* **`UNIQUE`**: Zajišťuje, že všechny hodnoty ve sloupci (nebo kombinace hodnot ve více sloupcích) jsou v rámci tabulky unikátní. Povoluje `NULL` hodnoty (obvykle jen jednu, záleží na konkrétní implementaci DBMS).
    ```sql
    CREATE TABLE uzivatele (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE, -- Každé uživ. jméno musí být unikátní
        email VARCHAR(100) UNIQUE -- I email musí být unikátní
    );
    -- Nebo jako omezení tabulky pro více sloupců:
    -- UNIQUE (username, email) -- Kombinace jména a emailu musí být unikátní
    ```

* **`PRIMARY KEY` (PK)**: Jednoznačně identifikuje každý řádek. Kombinuje `NOT NULL` a `UNIQUE`. Každá tabulka by měla mít právě jeden PK.
    ```sql
    -- Inline definice:
    CREATE TABLE produkty (
        product_id INTEGER PRIMARY KEY, -- Jednoduchý PK
        nazev VARCHAR(100) NOT NULL
    );

    -- Definice jako omezení tabulky (nutné pro složený PK):
    CREATE TABLE objednavka_polozky (
        objednavka_id INTEGER,
        produkt_id INTEGER,
        mnozstvi INTEGER NOT NULL,
        -- ... další sloupce ...
        PRIMARY KEY (objednavka_id, produkt_id) -- Složený PK
        -- Zde by měly být i cizí klíče na objednavky a produkty!
    );
    ```
    * **Použití `SERIAL` / `BIGSERIAL`:** Velmi časté pro automatické generování PK.
        ```sql
        CREATE TABLE kategorie (
            kategorie_id SERIAL PRIMARY KEY, -- Automaticky generované ID
            nazev VARCHAR(50) NOT NULL UNIQUE
        );
        ```

* **`FOREIGN KEY` (FK)**: Vytváří vazbu na primární klíč jiné tabulky, zajišťuje referenční integritu.
    ```sql
    CREATE TABLE knihy (
        book_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        publisher_id INTEGER, -- Sloupec pro cizí klíč
        -- ... další sloupce ...

        -- Definice cizího klíče jako omezení tabulky:
        FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) -- Odkazuje na PK v tabulce publishers
            ON DELETE SET NULL -- Co dělat, když je smazán odkazovaný vydavatel? Nastav NULL.
            ON UPDATE CASCADE -- Co dělat, když se změní PK odkazovaného vydavatele? Změň i hodnotu zde.
    );
    ```
    * **Akce `ON DELETE` / `ON UPDATE`:** Určují, co se stane s řádkem obsahujícím FK, pokud je referencovaný řádek (s PK) smazán nebo jeho PK změněn:
        * `NO ACTION` / `RESTRICT`: Výchozí. Operaci (DELETE/UPDATE) na referencovaném řádku zakáže, pokud na něj existují odkazy.
        * `CASCADE`: Pokud je referencovaný řádek smazán/změněn, smažou/změní se i všechny odkazující řádky. Používat opatrně!
        * `SET NULL`: Pokud je referencovaný řádek smazán/změněn, hodnota FK v odkazujících řádcích se nastaví na `NULL` (sloupec FK musí povolovat `NULL`).
        * `SET DEFAULT`: Podobné jako `SET NULL`, ale nastaví se výchozí hodnota sloupce (sloupec musí mít definován `DEFAULT`).

* **`CHECK`**: Umožňuje definovat vlastní podmínku, která musí být splněna pro hodnoty ve sloupci (nebo pro řádek).
    ```sql
    CREATE TABLE produkty (
        product_id SERIAL PRIMARY KEY,
        nazev VARCHAR(100) NOT NULL,
        cena NUMERIC(10, 2) NOT NULL CHECK (cena > 0), -- Cena musí být kladná
        skladem INTEGER DEFAULT 0 CHECK (skladem >= 0) -- Skladem nesmí být záporný
    );
    ```

* **`DEFAULT`**: Nastaví výchozí hodnotu sloupce, pokud není explicitně zadána při `INSERT`.
    ```sql
    CREATE TABLE objednavky (
        objednavka_id SERIAL PRIMARY KEY,
        datum_vytvoreni TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Výchozí je aktuální čas
        status VARCHAR(20) DEFAULT 'prijata' -- Výchozí status
    );
    ```

### Příklad: Schéma databáze Knihovny

Nyní si vytvoříme tabulky pro náš příklad s knihovnou pomocí `CREATE TABLE`.

```sql
-- Tabulka pro vydavatele
CREATE TABLE publishers (
    publisher_id SERIAL PRIMARY KEY, -- Unikátní ID vydavatele
    name VARCHAR(100) NOT NULL UNIQUE, -- Název vydavatele musí být unikátní
    headquarters TEXT -- Sídlo (může být delší text)
);

-- Tabulka pro žánry
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- Název žánru musí být unikátní
);

-- Tabulka pro autory
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_year INTEGER CHECK (birth_year > 0), -- Rok narození (jednoduchá kontrola)
    -- Kombinace jména a příjmení by měla být unikátní
    UNIQUE (first_name, last_name)
);

-- Tabulka pro knihy
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_year INTEGER CHECK (publication_year > 0),
    isbn VARCHAR(13) UNIQUE, -- ISBN by mělo být unikátní, pokud je zadáno
    publisher_id INTEGER, -- Cizí klíč na vydavatele
    genre_id INTEGER, -- Cizí klíč na žánr

    -- Definice cizích klíčů
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
        ON DELETE SET NULL -- Pokud smažeme vydavatele, u knihy se publisher_id nastaví na NULL
        ON UPDATE CASCADE, -- Pokud se změní publisher_id, změní se i zde

    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
        ON DELETE RESTRICT -- Nedovolíme smazat žánr, pokud k němu existují knihy
        ON UPDATE CASCADE
);

-- Asociační tabulka pro vztah M:N mezi knihami a autory
CREATE TABLE book_authors (
    book_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,

    -- Primární klíč je složený z obou cizích klíčů
    PRIMARY KEY (book_id, author_id),

    -- Definice cizích klíčů
    FOREIGN KEY (book_id) REFERENCES books(book_id)
        ON DELETE CASCADE -- Pokud smažeme knihu, smažou se i její vazby na autory
        ON UPDATE CASCADE,

    FOREIGN KEY (author_id) REFERENCES authors(author_id)
        ON DELETE CASCADE -- Pokud smažeme autora, smažou se i jeho vazby na knihy
        ON UPDATE CASCADE
);
```

### Spuštění DDL příkazů

Tyto `CREATE TABLE` příkazy můžete spustit:

* V nástroji **pgAdmin**: Otevřete Query Tool pro vaši databázi (`sql_knihovna_db`) a vložte/napište příkazy. Poté je spusťte (obvykle tlačítkem "Execute" nebo klávesou F5).
* V **SQLTools** (VS Code): Připojte se k databázi, otevřete nový SQL soubor, vložte příkazy a spusťte je (obvykle pravým kliknutím -> Run Query nebo klávesovou zkratkou).
* V terminálu pomocí `psql`: Připojte se k databázi a vložte příkazy.

Po úspěšném spuštění těchto příkazů bude ve vaší databázi `sql_knihovna_db` vytvořena struktura tabulek připravená pro vkládání dat (což je téma pro DML).
