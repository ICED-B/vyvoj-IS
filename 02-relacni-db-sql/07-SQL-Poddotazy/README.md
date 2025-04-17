## 7. Jazyk SQL: Poddotazy (Subqueries)

Poddotazy, známé také jako vnořené dotazy (nested queries), jsou **SQL dotazy (`SELECT`) vložené uvnitř jiného SQL dotazu** (hlavního dotazu). Výsledek vnitřního dotazu (poddotazu) je pak použit vnějším (hlavním) dotazem.

### Proč používat poddotazy?

* **Rozdělení složitých problémů:** Umožňují rozložit komplexní dotaz na menší, logické kroky. Nejprve získáte nějakou mezihodnotu nebo sadu dat pomocí poddotazu a tu pak použijete pro filtrování nebo výpočet v hlavním dotazu.
* **Dotazy závislé na agregovaných hodnotách:** Často se používají pro porovnání hodnoty s nějakou agregovanou hodnotou (např. najít knihy dražší než průměrná cena).
* **Alternativa k `JOIN` (někdy):** Některé dotazy řešitelné pomocí `JOIN` lze zapsat i pomocí poddotazů (např. s operátorem `IN` nebo `EXISTS`). Volba závisí na čitelnosti a někdy i výkonu.
* **Někdy nezbytné:** Pro některé typy dotazů jsou poddotazy nejpřirozenějším nebo dokonce jediným způsobem řešení v rámci standardního SQL (i když pokročilejší techniky jako оконní funkce nebo CTE mohou nabídnout alternativy).

### Typy poddotazů (podle návratové hodnoty)

Poddotazy můžeme klasifikovat podle toho, jaký typ výsledku vracejí:

1.  **Skalární poddotaz (Scalar Subquery):** Vrací **jedinou hodnotu** (jeden řádek, jeden sloupec). Může být použit téměř všude, kde se očekává jedna hodnota (v `SELECT` seznamu, ve `WHERE` pro porovnání, v `SET` klauzuli `UPDATE`).
2.  **Sloupcový poddotaz (Column Subquery):** Vrací **jeden sloupec s více řádky**. Často se používá s operátory `IN`, `NOT IN`, `ANY`, `ALL`.
3.  **Řádkový poddotaz (Row Subquery):** Vrací **jeden řádek s více sloupci**. Méně časté, používá se pro porovnání celých řádků.
4.  **Tabulkový poddotaz (Table Subquery):** Vrací **více řádků a více sloupců** (v podstatě tabulku). Používá se hlavně v klauzuli `FROM` (jako tzv. odvozená tabulka - derived table).

### Použití poddotazů v různých částech dotazu

#### 1. Poddotazy v `SELECT` seznamu

* Musí jít o **skalární poddotazy**.
* Poddotaz se (logicky) vykoná pro každý řádek vrácený hlavním dotazem. Může být **korelovaný** (viz níže).
* Často se používá pro získání nějaké souhrnné nebo související informace ke každému řádku.

**Příklady:**

```sql
-- Zobrazení názvu knihy a PRŮMĚRNÉ ceny VŠECH knih (stejná pro každý řádek)
SELECT
    title,
    price,
    (SELECT AVG(price) FROM books WHERE price IS NOT NULL) AS celkova_prumerna_cena
FROM
    books;

-- Zobrazení názvu knihy a jména jejího vydavatele pomocí (korelovaného) poddotazu
-- POZNÁMKA: Toto je méně efektivní než JOIN, ale demonstruje princip.
SELECT
    b.title,
    (SELECT p.name FROM publishers p WHERE p.publisher_id = b.publisher_id) AS nazev_vydavatele
FROM
    books AS b;
```

#### 2. Poddotazy v klauzuli `FROM` (Odvozené tabulky)

* Poddotaz v `FROM` musí vracet tabulkový výsledek (více řádků/sloupců).
* Výsledek poddotazu se chová jako dočasná tabulka, se kterou může hlavní dotaz pracovat.
* **Musí mít definovaný alias!**

**Příklad:**

```sql
-- Vybrat informace o autorech a počtu jejich knih, ale pouze pro autory s více než 1 knihou
-- (Alternativa k použití HAVING)
SELECT
    jmeno,
    prijmeni,
    pocet_knih
FROM (
    -- Vnitřní dotaz (poddotaz) spočítá počet knih pro každého autora
    SELECT
        a.first_name AS jmeno,
        a.last_name AS prijmeni,
        COUNT(ba.book_id) AS pocet_knih
    FROM
        authors AS a
    LEFT JOIN
        book_authors AS ba ON a.author_id = ba.author_id
    GROUP BY
        a.author_id, a.first_name, a.last_name
) AS pocty_autoru -- Alias pro výsledek poddotazu (odvozenou tabulku)
WHERE
    pocet_knih > 1 -- Filtrování výsledku poddotazu v hlavním dotazu
ORDER BY
    pocet_knih DESC;
```

#### 3. Poddotazy v klauzuli `WHERE`

Toto je nejčastější místo použití poddotazů. Slouží k filtrování řádků hlavního dotazu na základě výsledku poddotazu.

* **Porovnání se skalárním poddotazem:** Použití operátorů `=`, `!=`, `<`, `>`, `<=`, `>=`.
  ```sql
  -- Najít knihy dražší než průměrná cena všech knih
  SELECT title, price
  FROM books
  WHERE price > (SELECT AVG(price) FROM books WHERE price IS NOT NULL);

  -- Najít nejstarší knihu (nebo knihy, pokud jich je více se stejným rokem)
  SELECT title, publication_year
  FROM books
  WHERE publication_year = (SELECT MIN(publication_year) FROM books);
  ```

* **Operátor `IN` / `NOT IN` se sloupcovým poddotazem:** Testuje, zda hodnota existuje (nebo neexistuje) v množině hodnot vrácených poddotazem.
  ```sql
  -- Najít knihy vydané vydavateli se sídlem v Praze
  SELECT title
  FROM books
  WHERE publisher_id IN (
      SELECT publisher_id FROM publishers WHERE headquarters ILIKE '%Praha%'
  );

  -- Najít autory, kteří NEMAJÍ žádnou knihu v tabulce knih (pomocí NOT IN)
  SELECT first_name, last_name
  FROM authors
  WHERE author_id NOT IN (
      SELECT DISTINCT author_id FROM book_authors -- Poddotaz vrací ID všech autorů, kteří mají knihu
  );
  ```
  > **POZOR:** Pokud sloupcový poddotaz použitý s `NOT IN` může vrátit `NULL` hodnotu, výsledek celého `NOT IN` bude vždy "nepravda" nebo `NULL`, což může vést k nečekaným (prázdným) výsledkům. Je jistější použít `NOT EXISTS` nebo zajistit, aby poddotaz nevracel `NULL`.

* **Operátor `EXISTS` / `NOT EXISTS`:** Testuje, zda poddotaz vrátí **alespoň jeden řádek** (`EXISTS`) nebo **žádný řádek** (`NOT EXISTS`). Často se používá s **korelovanými poddotazy**. Může být efektivnější než `IN`/`NOT IN`, protože se může ukončit hned, jakmile najde první vyhovující řádek (pro `EXISTS`) nebo ví, že žádný neexistuje (pro `NOT EXISTS`).
  ```sql
  -- Najít vydavatele, kteří vydali alespoň jednu knihu (pomocí EXISTS)
  SELECT name
  FROM publishers AS p
  WHERE EXISTS (
      SELECT 1 FROM books AS b WHERE b.publisher_id = p.publisher_id -- Korelovaný poddotaz
  );
  -- Poznámka: SELECT 1 je konvence, na výběru sloupců zde nezáleží, jen na existenci řádku.

  -- Najít autory, kteří NEMAJÍ žádnou knihu (pomocí NOT EXISTS) - často preferovaná varianta oproti NOT IN
  SELECT first_name, last_name
  FROM authors AS a
  WHERE NOT EXISTS (
      SELECT 1 FROM book_authors AS ba WHERE ba.author_id = a.author_id -- Korelovaný poddotaz
  );
  ```

* **Porovnání s `ANY` / `ALL` (méně časté):** Umožňují porovnat hodnotu s výsledky sloupcového poddotazu.
    * `> ANY (...)`: Větší než alespoň jedna hodnota z poddotazu.
    * `= ANY (...)`: Rovno alespoň jedné hodnotě (ekvivalent `IN`).
    * `> ALL (...)`: Větší než všechny hodnoty z poddotazu.
    * `< ALL (...)`: Menší než všechny hodnoty z poddotazu.
  ```sql
  -- Najít knihy dražší než NEJLEVNĚJŠÍ kniha od vydavatele Host (ID 2)
  SELECT title, price
  FROM books
  WHERE price > ANY (SELECT price FROM books WHERE publisher_id = 2 AND price IS NOT NULL);
  -- Ekvivalentní: WHERE price > (SELECT MIN(price) FROM books WHERE publisher_id = 2 AND price IS NOT NULL)

  -- Najít knihy dražší než VŠECHNY knihy od vydavatele Host (ID 2)
  SELECT title, price
  FROM books
  WHERE price > ALL (SELECT price FROM books WHERE publisher_id = 2 AND price IS NOT NULL);
   -- Ekvivalentní: WHERE price > (SELECT MAX(price) FROM books WHERE publisher_id = 2 AND price IS NOT NULL)
  ```

### Korelované vs. Nekorelované poddotazy

* **Nekorelovaný poddotaz:** Může být spuštěn nezávisle na vnějším dotazu. Jeho výsledek se vypočítá jednou a pak se použije v hlavním dotazu. (Např. `SELECT AVG(price) FROM books`).
* **Korelovaný poddotaz:** Odkazuje na sloupce z tabulek vnějšího dotazu. Logicky se musí přepočítat pro každý řádek zpracovávaný vnějším dotazem. Často se používají s `EXISTS`. Mohou být méně výkonné než nekorelované poddotazy nebo `JOIN`y, ale jsou nezbytné pro určité typy logiky. (Např. `WHERE EXISTS (SELECT 1 FROM books b WHERE b.publisher_id = p.publisher_id)` - hodnota `p.publisher_id` pochází z vnějšího dotazu).

### Shrnutí poddotazů

Poddotazy jsou mocným nástrojem SQL, který umožňuje vytvářet složitější dotazy vnořováním `SELECT` příkazů. Lze je použít v různých částech hlavního dotazu (`SELECT`, `FROM`, `WHERE`, `HAVING`) a s různými operátory (`IN`, `EXISTS`, porovnávací operátory) pro dosažení požadovaného výsledku. Je důležité rozumět rozdílu mezi korelovanými a nekorelovanými poddotazy a zvažovat i alternativy jako `JOIN` nebo CTE (Common Table Expressions - `WITH` klauzule, která bude probrána později) pro lepší čitelnost a výkon.

---

### Cvičení (Samostatná práce)

Následující úkoly vám pomohou procvičit si použití poddotazů. Použijte databázi `sql_knihovna_db` naplněnou daty ze skriptu `data.sql`.

1.  **Najděte všechny knihy, které byly vydány ve stejném roce jako kniha 'Duna'.** Vypište jejich názvy a rok vydání. (Nezahrnujte samotnou Dunu do výsledku).
    * _Nápověda: Použijte skalární poddotaz ve `WHERE` k zjištění roku vydání Duny. `WHERE publication_year = (SELECT ...)` a přidejte podmínku `AND title != 'Duna'`._
2.  **Najděte jména všech autorů, kteří napsali alespoň jednu knihu vydanou nakladatelstvím "Argo" (ID 1).** Použijte operátor `IN` nebo `EXISTS`.
    * _Nápověda (IN): `SELECT ... FROM authors WHERE author_id IN (SELECT author_id FROM book_authors WHERE book_id IN (SELECT book_id FROM books WHERE publisher_id = 1))`_
    * _Nápověda (EXISTS): `SELECT ... FROM authors a WHERE EXISTS (SELECT 1 FROM book_authors ba JOIN books b ON ba.book_id = b.book_id WHERE ba.author_id = a.author_id AND b.publisher_id = 1)`_
3.  **Najděte název a cenu nejdražší knihy (nebo knih, pokud jich je více se stejnou nejvyšší cenou).**
    * _Nápověda: Použijte skalární poddotaz s `MAX(price)` ve `WHERE` klauzuli._
4.  **Vypište názvy všech knih, které napsal 'Terry Pratchett'.** Použijte poddotaz k nalezení `author_id` Terryho Pratchetta.
    * _Nápověda: `SELECT title FROM books WHERE book_id IN (SELECT book_id FROM book_authors WHERE author_id = (SELECT author_id FROM authors WHERE first_name = 'Terry' AND last_name = 'Pratchett'))`._
5.  **Pro každou knihu zobrazte její název, cenu a průměrnou cenu všech knih v databázi.**
    * _Nápověda: Použijte skalární poddotaz v `SELECT` seznamu pro výpočet průměrné ceny._
6.  **Zjistěte průměrnou cenu knih pro ty vydavatele, kteří vydali více než 2 knihy.** Vypište název vydavatele a průměrnou cenu.
    * _Nápověda: Použijte poddotaz v klauzuli `FROM` (odvozená tabulka), který nejprve spočítá počet knih pro každého vydavatele (`GROUP BY publisher_id`), pak tento výsledek spojte s `publishers` a `books` a filtrujte (`WHERE pocet > 2`) a nakonec vypočítejte průměrnou cenu (`AVG`) s `GROUP BY` podle vydavatele. Nebo použijte CTE._
7.  **Najděte všechny knihy, jejichž cena je vyšší než průměrná cena knih vydaných *jejich vlastním* vydavatelem.** Vypište název knihy, její cenu a ID vydavatele.
    * _Nápověda: Použijte korelovaný skalární poddotaz ve `WHERE`. Pro každou knihu `b` porovnejte `b.price` s `(SELECT AVG(price) FROM books b2 WHERE b2.publisher_id = b.publisher_id)`._
8.  **Najděte vydavatele, kteří nevydali žádnou knihu v 21. století (tj. rok vydání >= 2000).** Vypište jejich jména.
    * _Nápověda: Použijte `NOT EXISTS` nebo `NOT IN`. `SELECT name FROM publishers p WHERE NOT EXISTS (SELECT 1 FROM books b WHERE b.publisher_id = p.publisher_id AND b.publication_year >= 2000)`._
    
*(Řešení těchto úkolů bude probráno na cvičení)*
