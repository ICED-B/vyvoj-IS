## 5. Jazyk SQL: Spojování tabulek (JOIN)

Dosud jsme v příkazech `SELECT` pracovali vždy jen s daty z jedné tabulky. Síla relačních databází ale spočívá v možnosti **propojovat data z více tabulek** na základě definovaných vztahů (primárních a cizích klíčů). K tomuto propojování slouží operace **`JOIN`**.

### Proč spojovat tabulky?

Databáze jsou obvykle navrženy tak, aby se minimalizovala redundance dat (opakované ukládání stejné informace) – tento proces se nazývá normalizace. Například informace o vydavateli (název, sídlo) neukládáme přímo u každé knihy, ale máme samostatnou tabulku `publishers` a v tabulce `books` máme jen cizí klíč (`publisher_id`), který na vydavatele odkazuje.

Pokud bychom chtěli zobrazit seznam knih *spolu s názvy jejich vydavatelů*, potřebujeme data z obou tabulek (`books` a `publishers`) spojit do jednoho výsledku.

### Základní princip a syntaxe `JOIN`

Operace `JOIN` kombinuje řádky ze dvou (nebo více) tabulek na základě **spojovací podmínky (join condition)**. Tato podmínka typicky porovnává hodnoty ve sloupcích, které definují vztah mezi tabulkami (obvykle PK = FK).

**Preferovaná syntaxe (Explicitní JOIN):**

```sql
SELECT
    t1.sloupec1,
    t1.sloupec2,
    t2.sloupecA,
    t2.sloupecB
FROM
    tabulka1 AS t1 -- 't1' je alias pro tabulka1
JOIN_TYPE -- Např. INNER JOIN, LEFT JOIN
    tabulka2 AS t2 -- 't2' je alias pro tabulka2
ON
    t1.spojovaci_sloupec = t2.spojovaci_sloupec; -- Spojovací podmínka
```

* `JOIN_TYPE`: Určuje typ spojení (viz níže).
* `ON`: Klauzule definující podmínku, na základě které se řádky spojují. Nejčastěji se porovnává primární klíč jedné tabulky s cizím klíčem druhé tabulky.
* **Aliasy tabulek (`AS t1`, `AS t2`)**: Jsou **velmi doporučené** (a někdy nutné), zejména pokud tabulky obsahují sloupce se stejnými názvy (např. `id`, `name`). Pomocí aliasu pak specifikujeme, ze které tabulky chceme sloupec vybrat (`t1.sloupec1`, `t2.sloupecA`).

*(Existuje i starší, implicitní syntaxe JOINů s čárkou v klauzuli FROM a podmínkou ve WHERE, např. `FROM tabulka1, tabulka2 WHERE t1.id = t2.fk_id`. Tato syntaxe se však **nedoporučuje**, protože je méně čitelná a snadno se v ní zapomene na spojovací podmínku, což vede k nechtěnému kartézskému součinu.)*

### Typy `JOIN` operací

#### 1. `INNER JOIN`

* Vrací pouze ty řádky, pro které **existuje shoda** ve spojovacím sloupci v **obou** spojovaných tabulkách.
* Pokud řádek v jedné tabulce nemá odpovídající řádek v druhé tabulce podle `ON` podmínky, není ve výsledku zahrnut.
* Klíčové slovo `INNER` je volitelné, `JOIN` bez dalšího upřesnění znamená `INNER JOIN`.

**Příklad: Získání názvů knih a jmen jejich vydavatelů**

```sql
SELECT
    b.title AS nazev_knihy,
    p.name AS nazev_vydavatele
FROM
    books AS b -- Tabulka knih s aliasem 'b'
INNER JOIN -- Spojíme s tabulkou vydavatelů
    publishers AS p -- Tabulka vydavatelů s aliasem 'p'
ON
    b.publisher_id = p.publisher_id; -- Spojovací podmínka (FK = PK)
```
*Tento dotaz vrátí pouze knihy, které mají platné `publisher_id` (není NULL) a pro toto ID existuje záznam v tabulce `publishers`.*

**Příklad: Spojení více než dvou tabulek (Kniha -> Vazba -> Autor)**

Chceme získat názvy knih a jména jejich autorů. Musíme spojit tři tabulky: `books`, `book_authors` (asociační tabulka) a `authors`.

```sql
SELECT
    b.title AS nazev_knihy,
    a.first_name || ' ' || a.last_name AS jmeno_autora -- Spojení jména a příjmení
FROM
    books AS b
INNER JOIN
    book_authors AS ba ON b.book_id = ba.book_id -- Spojení books a book_authors
INNER JOIN
    authors AS a ON ba.author_id = a.author_id; -- Spojení book_authors a authors
```
*Tento dotaz vrátí dvojice (název knihy, jméno autora) pro všechny knihy, které mají alespoň jednoho autora uvedeného v `book_authors`.*

#### 2. `LEFT JOIN` (nebo `LEFT OUTER JOIN`)

* Vrací **všechny řádky z levé tabulky** (ta uvedená před `LEFT JOIN`) a k nim připojené odpovídající řádky z pravé tabulky.
* Pokud pro řádek z levé tabulky **neexistuje shoda** v pravé tabulce podle `ON` podmínky, sloupce z pravé tabulky budou ve výsledném řádku obsahovat hodnotu `NULL`.

**Příklad: Získání všech knih a jejich vydavatelů (včetně knih bez vydavatele)**

```sql
SELECT
    b.title AS nazev_knihy,
    p.name AS nazev_vydavatele -- Bude NULL, pokud kniha nemá publisher_id nebo vydavatel neexistuje
FROM
    books AS b -- Levá tabulka (chceme všechny knihy)
LEFT JOIN
    publishers AS p ON b.publisher_id = p.publisher_id; -- Spojovací podmínka
```
*Tento dotaz vrátí všechny knihy. Pokud kniha `publisher_id` nemá (je `NULL`), sloupec `nazev_vydavatele` bude ve výsledku `NULL`.*

**Příklad: Získání všech autorů a jejich knih (včetně autorů bez knih)**

```sql
SELECT
    a.first_name || ' ' || a.last_name AS jmeno_autora,
    b.title AS nazev_knihy -- Bude NULL, pokud autor nemá žádnou knihu v DB
FROM
    authors AS a -- Levá tabulka (chceme všechny autory)
LEFT JOIN
    book_authors AS ba ON a.author_id = ba.author_id -- Spojení na vazební tabulku
LEFT JOIN
    books AS b ON ba.book_id = b.book_id; -- Spojení vazební tabulky na knihy
```
*Tento dotaz vypíše všechny autory. Pokud autor nemá žádný záznam v `book_authors`, `nazev_knihy` bude `NULL`.*

#### 3. `RIGHT JOIN` (nebo `RIGHT OUTER JOIN`)

* Funguje opačně než `LEFT JOIN`. Vrací **všechny řádky z pravé tabulky** (ta uvedená po `RIGHT JOIN`) a k nim připojené odpovídající řádky z levé tabulky.
* Pokud pro řádek z pravé tabulky neexistuje shoda v levé, sloupce z levé tabulky budou `NULL`.
* Používá se méně často, protože stejného výsledku lze obvykle dosáhnout prohozením pořadí tabulek a použitím `LEFT JOIN`.

**Příklad: Získání všech vydavatelů a jejich knih (včetně vydavatelů bez knih)**

```sql
SELECT
    b.title AS nazev_knihy, -- Bude NULL, pokud vydavatel nemá žádnou knihu
    p.name AS nazev_vydavatele
FROM
    books AS b -- Levá tabulka
RIGHT JOIN
    publishers AS p ON b.publisher_id = p.publisher_id; -- Pravá tabulka (chceme všechny vydavatele)

-- Ekvivalentní zápis pomocí LEFT JOIN:
-- SELECT b.title AS nazev_knihy, p.name AS nazev_vydavatele
-- FROM publishers AS p
-- LEFT JOIN books AS b ON b.publisher_id = p.publisher_id;
```

#### 4. `FULL JOIN` (nebo `FULL OUTER JOIN`)

* Kombinuje `LEFT JOIN` a `RIGHT JOIN`. Vrací **všechny řádky z obou tabulek**.
* Pokud pro řádek z jedné tabulky neexistuje shoda v druhé, sloupce z druhé tabulky budou `NULL`.
* Používá se relativně zřídka, typicky když potřebujeme vidět všechny záznamy z obou stran spojení, i ty nepropojené.

**Příklad: Zobrazení všech knih a všech vydavatelů**

```sql
SELECT
    b.title AS nazev_knihy, -- Bude NULL pro vydavatele bez knih
    p.name AS nazev_vydavatele -- Bude NULL pro knihy bez vydavatele
FROM
    books AS b
FULL OUTER JOIN
    publishers AS p ON b.publisher_id = p.publisher_id;
```

### Podmínka spojení (`ON` vs `USING`)

* **`ON`**: Nejobecnější a nejčastější způsob definice podmínky spojení. Umožňuje porovnávat libovolné sloupce, i s různými názvy (`ON t1.pk_id = t2.ref_id`). Lze použít i složitější podmínky s `AND`, `OR` atd. (i když to není běžné pro základní spojení).
* **`USING`**: Zkratka pro případ, kdy se sloupce, přes které spojujeme, jmenují v obou tabulkách **stejně**.
    ```sql
    -- Předpoklad: V tabulce books je sloupec 'publisher_id' a v publishers také 'publisher_id' (což v našem schématu platí)
    SELECT b.title, p.name
    FROM books AS b
    INNER JOIN publishers AS p USING (publisher_id); -- Spojí přes sloupec 'publisher_id'

    -- Ekvivalent s ON:
    -- INNER JOIN publishers AS p ON b.publisher_id = p.publisher_id;
    ```
    Při použití `USING` se spojovací sloupec ve výsledku objeví pouze jednou (není třeba specifikovat `p.publisher_id` nebo `b.publisher_id`).

### Shrnutí JOINů

Spojování tabulek je fundamentální operací v relačních databázích. Výběr správného typu `JOIN` (`INNER`, `LEFT`, `RIGHT`, `FULL`) závisí na tom, zda chcete ve výsledku pouze spárované řádky, nebo i řádky z jedné či obou tabulek, které nemají protějšek. Používání aliasů tabulek a explicitní syntaxe `JOIN ... ON ...` výrazně zlepšuje čitelnost a robustnost vašich SQL dotazů.

---

### Cvičení (Samostatná práce)

Následující úkoly vám pomohou procvičit si spojování tabulek. Použijte databázi `sql_knihovna_db` naplněnou daty ze skriptu `data.sql`.


1.  **Vypište názvy všech knih a jména jejich vydavatelů.** Použijte `INNER JOIN`.
    * _Nápověda: Spojte `books` a `publishers` přes `publisher_id`._
2.  **Vypište názvy všech knih a celá jména jejich autorů.** Zobrazte dvojice (název knihy, jméno autora). Knihy s více autory se zobrazí vícekrát. Použijte `INNER JOIN` přes tři tabulky.
    * _Nápověda: Spojte `books`, `book_authors` a `authors`._
3.  **Vypište jména všech vydavatelů a k nim názvy knih, které vydali. Zahrňte i vydavatele, kteří v databázi nemají žádnou knihu.** Výsledky seřaďte podle jména vydavatele a poté podle názvu knihy.
    * _Nápověda: Použijte `LEFT JOIN` (nebo `RIGHT JOIN` s prohozenými tabulkami) mezi `publishers` a `books`. Použijte `ORDER BY`._
4.  **Vypište názvy knih vydaných po roce 1980 spolu s celým jménem jejich autora (nebo autorů).**
    * _Nápověda: Spojte tři tabulky (`books`, `book_authors`, `authors`) a přidejte podmínku `WHERE` na `publication_year`._
5.  **Najděte všechny knihy, které nemají v tabulce `book_authors` přiřazeného žádného autora.** Vypište jejich názvy.
    * _Nápověda: Použijte `LEFT JOIN` z `books` na `book_authors` a ve `WHERE` otestujte, zda je sloupec z `book_authors` (např. `author_id`) `IS NULL`._
6.  **Vypište názvy knih, jména jejich autorů a jména jejich vydavatelů pro všechny knihy vydané nakladatelstvím "Argo" (ID 1).** Výsledky seřaďte podle názvu knihy.
    * _Nápověda: Spojte `books`, `publishers`, `book_authors` a `authors`. Použijte `WHERE` na `publisher_id` a `ORDER BY`._
7.  **Vypište jména a sídla všech vydavatelů, kteří v databázi nemají žádnou knihu.**
    * _Nápověda: Použijte `LEFT JOIN` mezi `publishers` a `books` a ve `WHERE` otestujte, zda je sloupec z `books` (např. `book_id` nebo `publisher_id`) `IS NULL`._
8.  **Najděte názvy knih, které napsali autoři narození před rokem 1900 a které zároveň vydalo nakladatelství "Argo" (ID 1).**
    * _Nápověda: Spojte `books`, `book_authors` a `authors`. Použijte `WHERE` s podmínkami na `authors.birth_year` a `books.publisher_id`._`._

*(Řešení těchto úkolů bude probráno na cvičení)*
