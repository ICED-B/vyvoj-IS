## 6. Jazyk SQL: Agregace (`GROUP BY`, `HAVING`, agregační funkce)

Dosud jsme pomocí `SELECT` vybírali jednotlivé řádky (případně filtrované nebo seřazené). Často ale potřebujeme provádět **výpočty nad skupinami řádků** – například zjistit celkový počet knih, průměrnou cenu, počet knih od každého vydavatele apod. K tomu slouží **agregační funkce** a klauzule `GROUP BY` a `HAVING`.

### Agregační funkce

Agregační funkce provádějí výpočet nad sadou hodnot (typicky hodnotami v jednom sloupci pro skupinu řádků) a vracejí **jedinou souhrnnou hodnotu**.

Nejběžnější agregační funkce:

* **`COUNT()`**: Spočítá počet řádků.
    * `COUNT(*)`: Spočítá všechny řádky ve skupině (nebo v celé tabulce, pokud není použito `GROUP BY`).
    * `COUNT(nazev_sloupce)`: Spočítá počet řádků, kde `nazev_sloupce` **není** `NULL`.
    * `COUNT(DISTINCT nazev_sloupce)`: Spočítá počet **unikátních** nenulových hodnot ve sloupci.
* **`SUM(nazev_sloupce)`**: Sečte hodnoty v numerickém sloupci. Ignoruje `NULL` hodnoty.
* **`AVG(nazev_sloupce)`**: Vypočítá průměrnou hodnotu v numerickém sloupci. Ignoruje `NULL` hodnoty.
* **`MIN(nazev_sloupce)`**: Najde minimální hodnotu ve sloupci. Ignoruje `NULL` hodnoty.
* **`MAX(nazev_sloupce)`**: Najde maximální hodnotu ve sloupci. Ignoruje `NULL` hodnoty.

**Použití na celou tabulku:**

Agregační funkce lze použít i bez `GROUP BY` k získání souhrnné hodnoty pro celou tabulku (nebo pro řádky vyfiltrované pomocí `WHERE`).

```sql
-- Celkový počet knih v databázi
SELECT COUNT(*) AS celkovy_pocet_knih FROM books;

-- Celkový počet knih, které mají zadané ISBN
SELECT COUNT(isbn) AS pocet_knih_s_isbn FROM books;

-- Počet unikátních vydavatelů, kteří vydali nějakou knihu (mají záznam v books)
SELECT COUNT(DISTINCT publisher_id) AS pocet_aktivnich_vydavatelu FROM books;

-- Průměrná cena všech knih (které mají cenu)
SELECT AVG(price) AS prumerna_cena FROM books WHERE price IS NOT NULL;

-- Nejnižší a nejvyšší rok vydání knihy
SELECT MIN(publication_year) AS nejstarsi_rok, MAX(publication_year) AS nejnovejsi_rok FROM books;

-- Celkový počet stran všech knih dohromady (které mají počet stran)
SELECT SUM(page_count) AS celkem_stran FROM books WHERE page_count IS NOT NULL;
```

### Klauzule `GROUP BY`

Samotné agregační funkce na celou tabulku nejsou vždy užitečné. Často chceme provádět agregace pro **skupiny řádků** – například počet knih *pro každého vydavatele*, průměrná cena knih *pro každého autora* atd. K tomu slouží klauzule `GROUP BY`.

`GROUP BY` seskupí řádky, které mají **stejnou hodnotu** ve specifikovaném sloupci (nebo více sloupcích), a poté aplikuje agregační funkci na každou takovou skupinu zvlášť.

**Syntaxe:**

```sql
SELECT
    sloupec_pro_grupovani1,
    sloupec_pro_grupovani2,
    ...,
    agregacni_funkce(sloupec_pro_agregaci) AS alias_agregace
FROM
    nazev_tabulky
WHERE
    podminka_filtrovani_radku -- Volitelné, aplikuje se PŘED grupováním
GROUP BY
    sloupec_pro_grupovani1,
    sloupec_pro_grupovani2,
    ...; -- Sloupce, podle kterých se grupuje
```

> **!! Důležité pravidlo `GROUP BY` !!**
> * Pokud v `SELECT` seznamu použijete jakoukoli agregační funkci, pak **všechny ostatní sloupce** v `SELECT` seznamu, které **nejsou** výsledkem agregační funkce, **musí být uvedeny v klauzuli `GROUP BY`**.
> * Proč? Protože databáze musí vědět, podle čeho má řádky seskupit, aby mohla pro každou skupinu vypočítat agregovanou hodnotu. Pro sloupce, které nejsou agregovány, musí být zajištěno, že mají v rámci dané skupiny stejnou hodnotu (což zajistí jejich uvedení v `GROUP BY`).

**Příklady:**

```sql
-- Počet knih pro každého vydavatele (ID vydavatele)
SELECT
    publisher_id,
    COUNT(*) AS pocet_knih -- Spočítá počet řádků (knih) v každé skupině
FROM
    books
WHERE
    publisher_id IS NOT NULL -- Vyloučíme knihy bez vydavatele
GROUP BY
    publisher_id -- Seskupíme řádky podle ID vydavatele
ORDER BY
    pocet_knih DESC; -- Seřadíme podle počtu knih

-- Počet knih pro každého vydavatele (s názvem vydavatele)
SELECT
    p.name AS nazev_vydavatele,
    COUNT(b.book_id) AS pocet_knih -- Je dobré počítat ID knihy pro přesnost
FROM
    publishers AS p
INNER JOIN -- Spojíme s knihami
    books AS b ON p.publisher_id = b.publisher_id
GROUP BY
    p.publisher_id, p.name -- Grupujeme podle ID (PK) a jména vydavatele
                           -- Musíme grupovat podle všech neagregovaných sloupců v SELECT
ORDER BY
    pocet_knih DESC;

-- Průměrná cena knih pro každého vydavatele
SELECT
    p.name AS nazev_vydavatele,
    AVG(b.price) AS prumerna_cena,
    MIN(b.price) AS minimalni_cena,
    MAX(b.price) AS maximalni_cena
FROM
    publishers AS p
JOIN -- INNER JOIN je výchozí
    books AS b ON p.publisher_id = b.publisher_id
WHERE
    b.price IS NOT NULL -- Vyloučíme knihy bez ceny z průměru
GROUP BY
    p.publisher_id, p.name -- Grupujeme podle vydavatele
ORDER BY
    prumerna_cena DESC;

-- Počet knih pro každého autora
SELECT
    a.first_name,
    a.last_name,
    COUNT(ba.book_id) AS pocet_napsanych_knih -- Počítáme vazby v book_authors
FROM
    authors AS a
LEFT JOIN -- Použijeme LEFT JOIN, abychom zahrnuli i autory bez knih (budou mít count 0)
    book_authors AS ba ON a.author_id = ba.author_id
GROUP BY
    a.author_id, a.first_name, a.last_name -- Grupujeme podle autora (včetně PK pro jistotu unikátnosti)
ORDER BY
    pocet_napsanych_knih DESC;
```

### Klauzule `HAVING` - Filtrování skupin

Klauzule `WHERE` filtruje řádky **před** provedením `GROUP BY`. Co když ale chceme filtrovat až **výsledky agregace** – například chceme zobrazit pouze ty vydavatele, kteří vydali *více než 3 knihy*? K tomu slouží klauzule `HAVING`.

`HAVING` se používá **po** `GROUP BY` a umožňuje specifikovat podmínky pro celé skupiny (typicky podmínky nad výsledky agregačních funkcí).

**Syntaxe:**

```sql
SELECT
    sloupec_pro_grupovani1,
    agregacni_funkce(sloupec_pro_agregaci) AS alias_agregace
FROM
    nazev_tabulky
WHERE
    podminka_filtrovani_radku -- Volitelné
GROUP BY
    sloupec_pro_grupovani1
HAVING
    podminka_pro_skupiny; -- Podmínka aplikovaná na výsledek agregace
```

**Příklady:**

```sql
-- Vydavatelé, kteří vydali více než 3 knihy
SELECT
    p.name AS nazev_vydavatele,
    COUNT(b.book_id) AS pocet_knih
FROM
    publishers AS p
JOIN
    books AS b ON p.publisher_id = b.publisher_id
GROUP BY
    p.publisher_id, p.name
HAVING
    COUNT(b.book_id) > 3 -- Filtrujeme až agregovaný počet knih
ORDER BY
    pocet_knih DESC;

-- Autoři, kteří napsali 2 nebo více knih
SELECT
    a.first_name,
    a.last_name,
    COUNT(ba.book_id) AS pocet_napsanych_knih
FROM
    authors AS a
JOIN
    book_authors AS ba ON a.author_id = ba.author_id
GROUP BY
    a.author_id, a.first_name, a.last_name
HAVING
    COUNT(ba.book_id) >= 2 -- Filtrujeme autory s počtem knih >= 2
ORDER BY
    pocet_napsanych_knih DESC;

-- Roky vydání, ve kterých byla vydána více než 1 kniha
SELECT
    publication_year,
    COUNT(*) as pocet_knih_v_roce
FROM
    books
WHERE
    publication_year IS NOT NULL -- Ignorujeme knihy bez roku vydání
GROUP BY
    publication_year
HAVING
    COUNT(*) > 1
ORDER BY
    publication_year;
```

### Logické pořadí zpracování dotazu

Pro lepší pochopení, jak klauzule spolupracují (a proč např. nelze použít alias z `SELECT` ve `WHERE`), je užitečné znát **logické pořadí**, ve kterém databáze (koncepčně) zpracovává části `SELECT` dotazu:

1.  **`FROM`** (a `JOIN`): Určení zdrojových tabulek a jejich spojení.
2.  **`WHERE`**: Filtrování jednotlivých řádků na základě podmínek.
3.  **`GROUP BY`**: Seskupení zbývajících řádků podle zadaných sloupců.
4.  **`HAVING`**: Filtrování celých skupin na základě podmínek (často nad agregovanými hodnotami).
5.  **`SELECT`**: Výběr a výpočet finálních sloupců pro výsledek (včetně aliasů).
6.  **`DISTINCT`**: Odstranění duplicitních řádků z výsledku (pokud je použito).
7.  **`ORDER BY`**: Seřazení finálního výsledku.
8.  **`LIMIT` / `OFFSET`**: Omezení počtu vrácených řádků.

---

### Cvičení (Samostatná práce)

Následující úkoly vám pomohou procvičit si agregace a grupování. Použijte databázi `sql_knihovna_db` naplněnou daty ze skriptu `data.sql`.

1.  **Spočítejte celkový počet autorů v databázi.**
    * _Nápověda: Použijte `COUNT(*)` nebo `COUNT(author_id)` na tabulku `authors`._
2.  **Zjistěte průměrný počet stran knih vydaných nakladatelstvím "Host" (ID 2).**
    * _Nápověda: Použijte `AVG(page_count)` a `WHERE publisher_id = ...`._
3.  **Vypište názvy všech vydavatelů a počet knih, které každý z nich vydal.** Zahrňte i vydavatele, kteří nevydali žádnou knihu (měli by mít počet 0). Seřaďte výsledek podle počtu knih sestupně.
    * _Nápověda: Použijte `LEFT JOIN` mezi `publishers` a `books`, `GROUP BY` podle vydavatele a `COUNT(b.book_id)`. Pozor na `NULL` hodnoty při počítání._
4.  **Najděte rok (nebo roky), ve kterém bylo vydáno nejvíce knih.** Vypište rok a počet knih.
    * _Nápověda: Seskupte knihy podle `publication_year`, spočítejte počet v každém roce (`COUNT(*)`), seřaďte sestupně podle počtu (`ORDER BY ... DESC`) a vezměte první řádek (`LIMIT 1`)._
5.  **Vypište jména autorů (celé jméno) a počet knih, které napsali, ale pouze pro ty autory, kteří napsali alespoň 2 knihy.**
    * _Nápověda: Spojte `authors` a `book_authors`, použijte `GROUP BY` podle autora, `COUNT(ba.book_id)` a `HAVING COUNT(ba.book_id) >= 2`._
6.  **Pro každého vydavatele zjistěte rok vydání jeho nejstarší a nejnovější knihy.** Vypište název vydavatele, nejstarší rok a nejnovější rok.
    * _Nápověda: Spojte `publishers` a `books`, použijte `GROUP BY` podle vydavatele a agregační funkce `MIN(b.publication_year)` a `MAX(b.publication_year)`._
7.  **Spočítejte celkový počet stran všech knih pro každého autora.** Vypište celé jméno autora a celkový počet stran jeho knih. Zahrňte i autory bez knih (měli by mít součet 0 nebo NULL).
    * _Nápověda: Spojte `authors`, `book_authors` a `books`. Použijte `LEFT JOIN` (začínající od `authors`), `GROUP BY` podle autora a `SUM(b.page_count)`. Možná budete potřebovat funkci `COALESCE(SUM(b.page_count), 0)` pro zobrazení 0 místo NULL u autorů bez knih._
8.  **Najděte vydavatele, jejichž průměrná cena knihy je vyšší než 350 Kč.** Vypište název vydavatele a jeho průměrnou cenu.
    * _Nápověda: Spojte `publishers` a `books`, seskupte podle vydavatele (`GROUP BY`), vypočítejte průměrnou cenu (`AVG(b.price)`) a filtrujte skupiny pomocí `HAVING AVG(b.price) > 350`._
    
*(Řešení těchto úkolů bude probráno na cvičení)*
