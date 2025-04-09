## 3. Jazyk SQL: Manipulace s daty (DML)

Po vytvoření struktury databáze pomocí DDL (Data Definition Language) přichází na řadu práce se samotnými daty. K tomu slouží **Data Manipulation Language (DML)**. Hlavními příkazy DML jsou:

* `INSERT`: Vkládá nové řádky (záznamy) do tabulky.
* `UPDATE`: Modifikuje (aktualizuje) existující řádky v tabulce.
* `DELETE`: Maže existující řádky z tabulky.

Na rozdíl od DDL, které mění *strukturu* databáze, DML mění *obsah* tabulek.

### Příkaz `INSERT INTO`

Slouží k vložení jednoho nebo více nových řádků do zadané tabulky.

**Základní syntaxe:**

```sql
-- Vložení jednoho řádku se specifikací sloupců (doporučený způsob)
INSERT INTO nazev_tabulky (sloupec1, sloupec2, sloupec3)
VALUES (hodnota1, hodnota2, hodnota3);

-- Vložení jednoho řádku bez specifikace sloupců (musí odpovídat pořadí a počtu sloupců v tabulce)
-- NENÍ DOPORUČENO - křehké vůči změnám struktury tabulky
INSERT INTO nazev_tabulky
VALUES (hodnota_pro_sloupec1, hodnota_pro_sloupec2, ...);

-- Vložení více řádků najednou
INSERT INTO nazev_tabulky (sloupec1, sloupec2)
VALUES
    (hodnotaA1, hodnotaA2),
    (hodnotaB1, hodnotaB2),
    (hodnotaC1, hodnotaC2);
```

**Důležité body:**

* **Pořadí hodnot:** Pokud explicitně uvedete názvy sloupců, pořadí hodnot v klauzuli `VALUES` musí odpovídat pořadí uvedených sloupců.
* **`SERIAL` / `BIGSERIAL` klíče:** Tyto sloupce (typicky primární klíče) **neuvádějte** v `INSERT` příkazu. Databáze jim hodnotu přiřadí automaticky.
* **`DEFAULT` hodnoty:** Pokud má sloupec definovanou `DEFAULT` hodnotu, můžete jej buď úplně vynechat v seznamu sloupců, nebo pro něj v `VALUES` uvést klíčové slovo `DEFAULT`.
* **`NULL` hodnoty:** Pokud sloupec povoluje `NULL` (nemá omezení `NOT NULL`), můžete jej buď vynechat (pokud nemá `DEFAULT`), nebo pro něj explicitně uvést hodnotu `NULL`.
* **Datové typy:** Vkládané hodnoty musí odpovídat datovým typům příslušných sloupců (nebo musí být implicitně převoditelné). Textové řetězce a datum/čas se obvykle uzavírají do jednoduchých uvozovek (`'text'`).
* **Omezení (Constraints):** Pokus o vložení dat, která porušují jakékoli definované omezení ( `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`), selže a příkaz `INSERT` nebude proveden.

**Klauzule `RETURNING` (PostgreSQL):**

Velmi užitečná vlastnost PostgreSQL. Umožňuje hned po `INSERT` (nebo `UPDATE`, `DELETE`) získat hodnoty z právě vloženého/změněného řádku, typicky automaticky generované ID.

```sql
INSERT INTO publishers (name, headquarters)
VALUES ('Albatros Media', 'Praha')
RETURNING publisher_id; -- Vrátí ID nově vloženého vydavatele
```

**Příklady pro databázi Knihovny:**

```sql
-- Vymazání existujících dat (volitelné, pro čistý start)
DELETE FROM book_authors;
DELETE FROM books;
DELETE FROM authors;
DELETE FROM publishers;
-- Resetování sekvencí
ALTER SEQUENCE publishers_publisher_id_seq RESTART WITH 1;
ALTER SEQUENCE authors_author_id_seq RESTART WITH 1;
ALTER SEQUENCE books_book_id_seq RESTART WITH 1;

-- Vložení vydavatelů (beze změny)
INSERT INTO publishers (name, headquarters) VALUES
('Argo', 'Praha'),                     -- ID bude 1
('Host', 'Brno'),                      -- ID bude 2
('Albatros Media', 'Praha'),           -- ID bude 3
('Euromedia Group', 'Praha'),          -- ID bude 4
('Paseka', 'Praha');                   -- ID bude 5

-- Vložení autorů (beze změny)
INSERT INTO authors (first_name, last_name, birth_year) VALUES
('Jo', 'Nesbø', 1960),                 -- ID bude 1
('J.R.R.', 'Tolkien', 1892),            -- ID bude 2
('George', 'Orwell', 1903),            -- ID bude 3
('Agatha', 'Christie', 1890),          -- ID bude 4
('Terry', 'Pratchett', 1948),          -- ID bude 5
('Frank', 'Herbert', 1920),            -- ID bude 6
('Arthur C.', 'Clarke', 1917),         -- ID bude 7
('Douglas', 'Adams', 1952);            -- ID bude 8

-- Vložení knih (AKTUALIZOVÁNO - přidán page_count, price; odstraněn genre_id)
INSERT INTO books (title, publication_year, isbn, page_count, price, publisher_id) VALUES
('Spasitel', 2009, '9788076620274', 496, 349.90, 1), -- Argo
('Pán prstenů: Společenstvo Prstenu', 1954, '9788025712152', 432, 429.00, 1), -- Argo
('Farma zvířat', 1945, '9788025710899', 128, 199.50, 1), -- Argo
('Deset malých černoušků', 1939, '9788024263372', 256, 279.00, 4), -- Euromedia
('Barva kouzel', 1983, '9788071976318', 288, 299.00, 5), -- Paseka
('Duna', 1965, '9788076621110', 688, 499.00, 1), -- Argo
('2001: Vesmírná odysea', 1968, '9788076620519', 240, 249.00, 1), -- Argo
('Stopařův průvodce po Galaxii', 1979, '9788025700500', 216, 269.00, 1), -- Argo
('Leviatan se probouzí', 2011, '9788075530060', 560, 399.00, 2), -- Host
('Silmarillion', 1977, '9788025704807', 416, 389.00, 1), -- Argo (ISBN opraveno)
('Netopýr', 1997, '9788076620601', 400, 329.00, 4), -- Euromedia
('Mort', 1987, '9788071976080', 272, 289.00, 5), -- Paseka
('1984', 1949, NULL, 328, 299.00, 1); -- Argo, bez ISBN

-- Vložení vazeb mezi knihami a autory (beze změny - používá ID 1-13 pro knihy, 1-8 pro autory)
INSERT INTO book_authors (book_id, author_id) VALUES
(1, 1),  -- Spasitel - Jo Nesbø
(2, 2),  -- Společenstvo Prstenu - J.R.R. Tolkien
(3, 3),  -- Farma zvířat - George Orwell
(4, 4),  -- Deset malých černoušků - Agatha Christie
(5, 5),  -- Barva kouzel - Terry Pratchett
(6, 6),  -- Duna - Frank Herbert
(7, 7),  -- 2001: Vesmírná odysea - Arthur C. Clarke
(8, 8),  -- Stopařův průvodce po Galaxii - Douglas Adams
-- Leviatan (ID 9) zde nemá autora v datech
(10, 2), -- Silmarillion - J.R.R. Tolkien
(11, 1), -- Netopýr - Jo Nesbø
(12, 5), -- Mort - Terry Pratchett
(13, 3); -- 1984 - George Orwell
```

### Příkaz `UPDATE`

Slouží k modifikaci hodnot v existujících řádcích tabulky.

**Základní syntaxe:**

```sql
UPDATE nazev_tabulky
SET sloupec1 = nova_hodnota1,
    sloupec2 = nova_hodnota2,
    ...
WHERE podminka; -- Specifikuje, KTERÉ řádky se mají aktualizovat
```

**!!! POZOR na klauzuli `WHERE` !!!**

* **Pokud klauzuli `WHERE` vynecháte, příkaz `UPDATE` změní hodnoty ve specifikovaných sloupcích pro VŠECHNY řádky v tabulce!** Toto je velmi častá a nebezpečná chyba.
* Klauzule `WHERE` funguje stejně jako u příkazu `SELECT` – používá logické podmínky (např. `=`, `<`, `>`, `LIKE`, `IN`, `BETWEEN`, `AND`, `OR`, `NOT`) k identifikaci řádků, které se mají aktualizovat.

**Příklady pro databázi Knihovny:**

```sql
-- Oprava roku narození George Orwella (author_id = 3)
UPDATE authors
SET birth_year = 1903
WHERE author_id = 3;

-- Změna sídla vydavatele Argo (ID 1)
UPDATE publishers
SET headquarters = 'Praha 1 - Staré Město'
WHERE publisher_id = 1;

-- Zvýšení ceny všech knih od vydavatele Argo (ID 1) o 10%
UPDATE books
SET price = price * 1.10
WHERE publisher_id = 1;

-- Aktualizace více sloupců najednou - změna ceny a počtu stran u Farmy zvířat (ISBN)
UPDATE books
SET price = 219.00,
    page_count = 136
WHERE isbn = '9788025710899';
```

### Příkaz `DELETE FROM`

Slouží k odstranění (smazání) existujících řádků z tabulky.

**Základní syntaxe:**

```sql
DELETE FROM nazev_tabulky
WHERE podminka; -- Specifikuje, KTERÉ řádky se mají smazat
```

**!!! POZOR na klauzuli `WHERE` !!!**

* **Pokud klauzuli `WHERE` vynecháte, příkaz `DELETE` smaže VŠECHNY řádky z tabulky!** Toto je ještě nebezpečnější chyba než u `UPDATE`. Obnova smazaných dat může být velmi obtížná nebo nemožná.
* Klauzule `WHERE` funguje stejně jako u `SELECT` a `UPDATE` k identifikaci řádků určených ke smazání.

**Vliv `FOREIGN KEY` omezení:**

Při mazání řádků, na které odkazují cizí klíče z jiných tabulek, se uplatní akce definovaná v `ON DELETE`:
* `RESTRICT` / `NO ACTION`: Mazání selže, pokud existují odkazující řádky.
* `CASCADE`: Smazání referencovaného řádku způsobí automatické smazání i všech odkazujících řádků.
* `SET NULL`: Hodnota FK v odkazujících řádcích se nastaví na `NULL`.
* `SET DEFAULT`: Hodnota FK v odkazujících řádcích se nastaví na výchozí hodnotu.

**Příklady pro databázi Knihovny:**

```sql
-- Smazání konkrétní knihy podle ISBN
DELETE FROM books
WHERE isbn = '9788024263372'; -- Smaže knihu Deset malých černoušků

-- Smazání všech knih vydaných před rokem 1940 (POZOR!)
DELETE FROM books WHERE publication_year < 1940; -- Raději zakomentováno

-- Smazání autora (předpokládejme author_id = 4 pro Agathu Christie)
-- Díky ON DELETE CASCADE v tabulce book_authors se smaže i odpovídající záznam v book_authors.
-- Odpovídající kniha (Deset malých černoušků) byla smazána výše, jinak by se tento DELETE také provedl.
DELETE FROM authors
WHERE author_id = 4;

-- Příklad smazání vydavatele (Argo, ID 1)
-- U knih, které vydalo Argo, se publisher_id nastaví na NULL (díky ON DELETE SET NULL)
DELETE FROM publishers WHERE publisher_id = 1; -- Raději zakomentováno
```

### Shrnutí DML

Příkazy `INSERT`, `UPDATE` a `DELETE` jsou základními nástroji pro práci s obsahem databáze. Je nezbytné rozumět jejich syntaxi a zejména **důsledkům použití (nebo nepoužití) klauzule `WHERE`** u příkazů `UPDATE` a `DELETE`. Dále je důležité pamatovat na **databázová omezení (constraints)**, která hlídají integritu dat a mohou způsobit selhání DML operací, pokud by data tato omezení porušovala.

---

### Cvičení (Samostatná práce)

Následující úkoly vám pomohou procvičit si manipulaci s daty. Použijte databázi `sql_knihovna_db` naplněnou daty ze skriptu `data.sql`. **Před každým mazáním (`DELETE`) si data nejprve ověřte pomocí `SELECT`!**

1.  **Vložte nového autora:** Vložte do tabulky `authors` záznam pro autora "Karel Čapek", narozeného v roce 1890.
    * _Nápověda: Použijte `INSERT INTO authors ... VALUES ...`._

2.  **Vložte novou knihu:** Vložte do tabulky `books` knihu "Bílá nemoc" od Karla Čapka (použijte ID autora z předchozího kroku, zjistěte si ho pomocí `SELECT` nebo předpokládejte, že bude mít další volné ID), vydanou v roce 1937, s 152 stranami a cenou 189.00 Kč. Vydavatele zvolte "Host" (ID 2). Nezapomeňte také vložit záznam do propojovací tabulky `book_authors`.
    * _Nápověda: Budete potřebovat dva `INSERT` příkazy. Pro druhý `INSERT` do `book_authors` potřebujete znát `book_id` nově vložené knihy (můžete použít `RETURNING book_id` u prvního `INSERT` nebo si ho zjistit `SELECT`em) a `author_id` Karla Čapka._

3.  **Aktualizujte cenu:** Zvyšte cenu knihy "Duna" (book_id = 6) na 525.00 Kč.
    * _Nápověda: Použijte `UPDATE books SET price = ... WHERE book_id = ...`._

4.  **Aktualizujte více knih:** Všem knihám vydaným nakladatelstvím "Paseka" (publisher_id = 5) nastavte počet stran na 300 (pokud je jejich aktuální počet stran menší než 300).
    * _Nápověda: Použijte `UPDATE books SET page_count = ... WHERE publisher_id = ... AND page_count < ...`._

5.  **Smažte autora:** Smažte autora "George Orwell" (author_id = 3). Ověřte si (pomocí `SELECT * FROM book_authors WHERE author_id = 3;`), že se díky `ON DELETE CASCADE` smazaly i odpovídající záznamy v tabulce `book_authors`.
    * _Nápověda: Použijte `DELETE FROM authors WHERE author_id = ...`._

*(Správnost syntaxe a výsledky si ověřte spuštěním příkazů a následných `SELECT` dotazů v pgAdminu nebo jiném SQL klientovi.)*