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
-- Vložení vydavatelů
INSERT INTO publishers (name, headquarters) VALUES
    ('Argo', 'Praha'),
    ('Host', 'Brno'),
    ('Albatros Media', 'Praha')
RETURNING publisher_id, name; -- Vrátí ID a jméno vložených vydavatelů

-- Vložení žánrů
INSERT INTO genres (name) VALUES
    ('Sci-fi'),
    ('Fantasy'),
    ('Detektivka'),
    ('Román')
RETURNING genre_id, name;

-- Vložení autorů
INSERT INTO authors (first_name, last_name, birth_year) VALUES
    ('Jo', 'Nesbø', 1960),
    ('J.R.R.', 'Tolkien', 1892),
    ('George', 'Orwell', 1903),
    ('Agatha', 'Christie', 1890)
RETURNING author_id, first_name, last_name;

-- Vložení knih (předpokládáme, že známe ID z předchozích INSERTů, nebo je zjistíme SELECTem)
-- Zde použijeme fiktivní ID pro ilustraci
INSERT INTO books (title, publication_year, isbn, publisher_id, genre_id) VALUES
    ('Spasitel', 2009, '9788076620274', 1, 3), -- Argo, Detektivka (ID 1, 3)
    ('Pán prstenů: Společenstvo Prstenu', 1954, '9788025712152', 1, 2), -- Argo, Fantasy (ID 1, 2)
    ('Farma zvířat', 1945, '9788025710899', 1, 4), -- Argo, Román (ID 1, 4)
    ('Deset malých černoušků', 1939, '9788024263372', 3, 3) -- Albatros, Detektivka (ID 3, 3)
RETURNING book_id, title;

-- Vložení vazeb mezi knihami a autory (M:N)
-- Předpokládáme, že známe ID knih a autorů
INSERT INTO book_authors (book_id, author_id) VALUES
    (1, 1), -- Spasitel - Jo Nesbø (ID 1, 1)
    (2, 2), -- Společenstvo Prstenu - J.R.R. Tolkien (ID 2, 2)
    (3, 3), -- Farma zvířat - George Orwell (ID 3, 3)
    (4, 4); -- Deset malých černoušků - Agatha Christie (ID 4, 4)
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
-- Oprava roku narození George Orwella (předpokládáme, že známe jeho author_id = 3)
UPDATE authors
SET birth_year = 1903 -- Správný rok
WHERE author_id = 3;

-- Změna sídla vydavatele Argo
UPDATE publishers
SET headquarters = 'Praha 1'
WHERE name = 'Argo'; -- Použití jiného unikátního sloupce v podmínce

-- Zvýšení roku vydání u všech knih vydaných před rokem 1950 o 1 rok (ilustrativní)
UPDATE books
SET publication_year = publication_year + 1
WHERE publication_year < 1950;

-- Aktualizace více sloupců najednou
UPDATE books
SET genre_id = 4, -- Změna žánru na Román (ID 4)
    publisher_id = 2 -- Změna vydavatele na Host (ID 2)
WHERE isbn = '9788025710899'; -- Identifikace knihy Farmy zvířat podle ISBN
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
DELETE FROM books
WHERE publication_year < 1940;

-- Smazání autora (předpokládejme author_id = 4 pro Agathu Christie)
-- Díky ON DELETE CASCADE v tabulce book_authors se smaže i odpovídající záznam v book_authors.
DELETE FROM authors
WHERE author_id = 4;

-- Pokus o smazání žánru "Detektivka" (předpokládejme genre_id = 3)
-- Toto selže, protože v tabulce books existují knihy s tímto žánrem
-- a omezení FOREIGN KEY pro genre_id má nastaveno ON DELETE RESTRICT.
DELETE FROM genres
WHERE genre_id = 3;
-- Chyba: update or delete on table "genres" violates foreign key constraint "books_genre_id_fkey" on table "books"
```

### Shrnutí DML

Příkazy `INSERT`, `UPDATE` a `DELETE` jsou základními nástroji pro práci s obsahem databáze. Je nezbytné rozumět jejich syntaxi a zejména **důsledkům použití (nebo nepoužití) klauzule `WHERE`** u příkazů `UPDATE` a `DELETE`. Dále je důležité pamatovat na **databázová omezení (constraints)**, která hlídají integritu dat a mohou způsobit selhání DML operací, pokud by data tato omezení porušovala.
