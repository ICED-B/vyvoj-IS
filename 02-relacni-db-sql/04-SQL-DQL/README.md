## 4. Jazyk SQL: Dotazování (DQL) - SELECT

**Data Query Language (DQL)** slouží k získávání (vybírání, čtení) dat z databáze. Zatímco DDL definuje strukturu a DML mění obsah, DQL nám umožňuje data prohlížet a analyzovat. Základním a nejdůležitějším příkazem DQL je `SELECT`.

> **DŮLEŽITÉ UPOZORNĚNÍ:** Než začnete zkoušet příklady `SELECT` dotazů v této sekci, ujistěte se, že máte databázi `sql_knihovna_db` naplněnou daty. Spusťte SQL skript [data.sql](./data.sql), který vloží potřebná ukázková data. Tím zajistíte, že vám příklady budou vracet očekávané výsledky a budete mít s čím pracovat ve cvičeních.


### Základní příkaz `SELECT`

Příkaz `SELECT` umožňuje vybrat data z jedné nebo více tabulek.

**Základní syntaxe:**

```sql
SELECT seznam_sloupcu -- Co chceme vidět
FROM nazev_tabulky; -- Odkud to chceme vzít
```

* `seznam_sloupcu`: Určuje, které sloupce chceme ve výsledku zobrazit. Může to být:
    * Seznam názvů sloupců oddělených čárkou (např. `title, publication_year`).
    * Hvězdička (`*`) pro výběr **všech** sloupců z tabulky. **POZOR:** Použití `*` je pohodlné pro rychlé prozkoumání, ale ve finálních aplikacích nebo složitějších dotazech se nedoporučuje (méně efektivní, nejasné, co se vrací, křehké vůči změnám tabulky). Vždy je lepší explicitně vyjmenovat potřebné sloupce.
* `nazev_tabulky`: Jméno tabulky, ze které data vybíráme.

**Příklady:**

```sql
-- Vybrat všechny informace o všech vydavatelích
SELECT * FROM publishers;

-- Vybrat pouze jména a příjmení všech autorů
SELECT first_name, last_name FROM authors;

-- Vybrat názvy všech knih a jejich cenu
SELECT title, price FROM books;
```

### Aliasy (Aliases)

Aliasy umožňují dočasně přejmenovat tabulky nebo sloupce v rámci jednoho dotazu. Používá se klíčové slovo `AS` (které je často volitelné).

* **Aliasy sloupců:** Zlepšují čitelnost výsledků nebo přejmenovávají vypočítané hodnoty.
  ```sql
  SELECT
      name AS nazev_vydavatele, -- Přejmenování sloupce 'name' na 'nazev_vydavatele'
      headquarters AS sidlo   -- Přejmenování 'headquarters' na 'sidlo'
  FROM
      publishers;
  ```
* **Aliasy tabulek:** Zkracují zápis, zejména při spojování více tabulek (viz další sekce), a pomáhají rozlišit sloupce se stejným názvem z různých tabulek.
  ```sql
  SELECT p.name, p.headquarters -- Použití aliasu 'p' pro přístup ke sloupcům
  FROM publishers AS p; -- Definice aliasu 'p' pro tabulku 'publishers'
  ```

### Výběr unikátních hodnot (`DISTINCT`)

Pokud chceme z výsledku odstranit duplicitní řádky (nebo zobrazit pouze unikátní hodnoty v určitém sloupci), použijeme klíčové slovo `DISTINCT`.

```sql
-- Vybrat unikátní roky vydání knih
SELECT DISTINCT publication_year FROM books;

-- Vybrat unikátní kombinace jména a příjmení autora (zde zbytečné, máme UNIQUE constraint)
SELECT DISTINCT first_name, last_name FROM authors;
```

### Klauzule `WHERE` - Filtrování řádků

Jedna z nejdůležitějších částí `SELECT` dotazu. `WHERE` umožňuje specifikovat podmínky, které musí řádky splňovat, aby byly zahrnuty do výsledku.

**Syntaxe:**

```sql
SELECT seznam_sloupcu
FROM nazev_tabulky
WHERE podminka;
```

**Operátory v `WHERE`:**

* **Porovnávací:** `=`, `!=` nebo `<>`, `<`, `>`, `<=`, `>=`
  ```sql
  -- Knihy vydané po roce 2000
  SELECT title, publication_year FROM books WHERE publication_year > 2000;

  -- Knihy s cenou přesně 299.00
  SELECT title, price FROM books WHERE price = 299.00;
  ```
* **Logické:** `AND`, `OR`, `NOT` (používejte závorky `()` pro prioritu)
  ```sql
  -- Knihy vydané po roce 1980 s cenou pod 300
  SELECT title, publication_year, price FROM books WHERE publication_year > 1980 AND price < 300;

  -- Autoři narození před 1900 NEBO po 1960
  SELECT first_name, last_name FROM authors WHERE birth_year < 1900 OR birth_year > 1960;
  ```
* **`BETWEEN ... AND ...`**: Hodnoty v rozsahu (včetně hranic).
  ```sql
  -- Knihy s počtem stran mezi 200 a 300 (včetně)
  SELECT title, page_count FROM books WHERE page_count BETWEEN 200 AND 300;
  ```
* **`IN (...)`**: Hodnoty v seznamu.
  ```sql
  -- Knihy vydané vydavateli Argo (ID 1) nebo Host (ID 2)
  SELECT title FROM books WHERE publisher_id IN (1, 2);
  ```
* **`LIKE` / `ILIKE`**: Vyhledávání podle vzoru (`%`, `_`). `ILIKE` je case-insensitive.
  ```sql
  -- Autoři, jejichž příjmení končí na 'n' (case-insensitive)
  SELECT first_name, last_name FROM authors WHERE last_name ILIKE '%n';

  -- Knihy, které mají v názvu slovo 'prsten' (case-insensitive)
  SELECT title FROM books WHERE title ILIKE '%prsten%';
  ```
* **`IS NULL` / `IS NOT NULL`**: Testování na `NULL`.
  ```sql
  -- Knihy, které nemají zadané ISBN
  SELECT title FROM books WHERE isbn IS NULL;

  -- Autoři, kteří mají zadaný rok narození
  SELECT first_name, last_name FROM authors WHERE birth_year IS NOT NULL;
  ```

### Klauzule `ORDER BY` - Řazení výsledků

Umožňuje seřadit výsledné řádky podle hodnot v jednom nebo více sloupcích.

**Syntaxe:**

```sql
SELECT seznam_sloupcu
FROM nazev_tabulky
WHERE podminka -- Nepovinné
ORDER BY sloupec1 [ASC | DESC], sloupec2 [ASC | DESC], ...;
```

* `ASC`: Vzestupné řazení (od nejmenšího po největší, A-Z). **Výchozí**, nemusí se uvádět.
* `DESC`: Sestupné řazení (od největšího po nejmenší, Z-A).
* Lze řadit podle více sloupců – nejprve se seřadí podle prvního, a řádky se stejnou hodnotou v prvním sloupci se pak seřadí podle druhého atd.

**Příklady:**

```sql
-- Seřadit autory podle příjmení vzestupně
SELECT first_name, last_name FROM authors ORDER BY last_name; -- ASC je výchozí

-- Seřadit knihy podle roku vydání sestupně (od nejnovějších)
SELECT title, publication_year FROM books ORDER BY publication_year DESC;

-- Seřadit knihy nejprve podle roku vydání (sestupně) a v rámci stejného roku podle názvu (vzestupně)
SELECT title, publication_year FROM books ORDER BY publication_year DESC, title ASC;
```

### Klauzule `LIMIT` a `OFFSET` - Omezení počtu řádků

* `LIMIT pocet`: Omezí počet vrácených řádků na zadaný `pocet`.
* `OFFSET start`: Přeskočí prvních `start` řádků, než začne vracet výsledky.

Tyto klauzule se často používají společně pro **stránkování** výsledků a píší se obvykle na konec dotazu (po `ORDER BY`).

**Syntaxe:**

```sql
SELECT seznam_sloupcu
FROM nazev_tabulky
WHERE podminka     -- Nepovinné
ORDER BY sloupec   -- Nepovinné, ale důležité pro konzistentní stránkování
LIMIT pocet        -- Nepovinné
OFFSET start;      -- Nepovinné (obvykle se používá jen s LIMIT)
```

**Příklady:**

```sql
-- Vybrat 5 nejnovějších knih
SELECT title, publication_year
FROM books
ORDER BY publication_year DESC
LIMIT 5;

-- Vybrat 10 knih, ale přeskočit prvních 5 (zobrazení "druhé stránky" výsledků, pokud stránkujeme po 5)
SELECT title, publication_year
FROM books
ORDER BY title -- Řadíme podle názvu pro konzistentní stránkování
LIMIT 10 OFFSET 5;
```

### Shrnutí základního DQL

Příkaz `SELECT` s klauzulemi `FROM`, `WHERE`, `ORDER BY`, `LIMIT` a `OFFSET` tvoří základ dotazování v SQL. Umožňují nám vybrat specifické sloupce, filtrovat řádky podle různých kritérií, seřadit výsledky a omezit jejich počet. V dalších sekcích se podíváme na pokročilejší techniky, jako je spojování více tabulek a agregace dat.

---

### Cvičení (Samostatná práce)

Následující úkoly vám pomohou procvičit si základní `SELECT` dotazy. Použijte databázi `sql_knihovna_db` naplněnou daty ze skriptu `data.sql`.

1.  **Vypište názvy a ceny všech knih, které stojí méně než 300 Kč.**
    * _Nápověda: Použijte `SELECT`, `FROM books` a `WHERE price ...`._
2.  **Najděte všechny autory narozené v 19. století (tj. roky 1801 až 1900 včetně). Vypište jejich celé jméno (jako jeden sloupec, např. pomocí konkatenace) a rok narození.**
    * _Nápověda: Použijte `WHERE birth_year BETWEEN ...`, pro spojení jména a příjmení v PostgreSQL můžete použít operátor `||` (např. `first_name || ' ' || last_name AS cele_jmeno`)._
3.  **Vypište názvy a ISBN všech knih, které *mají* přiřazené ISBN.**
    * _Nápověda: Použijte `WHERE isbn ...`._
4.  **Zobrazte 5 knih s největším počtem stran. Výstup seřaďte sestupně podle počtu stran. Vypište název a počet stran.**
    * _Nápověda: Použijte `ORDER BY ... DESC` a `LIMIT ...`._
5.  **Najděte všechny vydavatele, jejichž sídlo je v Praze. Vypište pouze jejich jména.**
    * _Nápověda: Použijte `WHERE headquarters LIKE ...` nebo `ILIKE`._
6.  **Vypište unikátní roky vydání pro knihy vydané nakladatelstvím "Argo" (ID vydavatele je 1).**
    * _Nápověda: Použijte `SELECT DISTINCT ...`, `FROM books` a `WHERE publisher_id = ...`._
7.  **Vypište názvy všech knih od vydavatelů Host (ID 2) nebo Paseka (ID 5), seřazené abecedně podle názvu.**
    * _Nápověda: Použijte `WHERE publisher_id IN (...)` a `ORDER BY title`._
8.  **Najděte autory, jejichž křestní jméno začíná na 'A' a příjmení končí na 'e' (bez ohledu na veliko st písmen). Vypište jejich křestní jméno a příjmení.**
    * _Nápověda: Použijte `WHERE first_name ILIKE ... AND last_name ILIKE ...`._
9.  **Vypište názvy a roky vydání knih, které nebyly vydány v 80. letech 20. století (tj. mimo roky 1980-1989 včetně).**
    * _Nápověda: Použijte `WHERE publication_year NOT BETWEEN ... AND ...` nebo kombinaci `<` a `>` s `OR`._
10. **Najděte všechny autory, u kterých je znám rok narození, a seřaďte je od nejstaršího po nejmladšího. Vypište celé jméno a rok narození.**
     * _Nápověda: Použijte `WHERE birth_year IS NOT NULL` a `ORDER BY birth_year ASC`._
11. **Najděte 3 nejlevnější knihy vydané nakladatelstvím "Paseka" (ID 5). Vypište název a cenu.**
     * _Nápověda: Použijte `WHERE publisher_id = ...`, `ORDER BY price ASC` a `LIMIT ...`._
12. **Vypište názvy knih a jejich počet stran, přičemž sloupec s počtem stran pojmenujte aliasem `pocet_stranek`. Výsledky seřaďte sestupně podle tohoto aliasu.**
     * _Nápověda: Použijte `SELECT title, page_count AS pocet_stranek ... ORDER BY pocet_stranek DESC`._


*(Řešení těchto úkolů bude probráno na cvičení)*
