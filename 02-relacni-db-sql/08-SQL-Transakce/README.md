## 8. Transakce, Indexy, Pohledy

V této části se podíváme na tři důležité koncepty v SQL a relačních databázích: transakce pro zajištění konzistence operací, indexy pro optimalizaci výkonu dotazů a pohledy pro zjednodušení a zabezpečení přístupu k datům.

### Transakce (Transaction Control Language - TCL)

Jak jsme již zmínili v úvodu (sekce 1), **transakce** je posloupnost databázových operací (`INSERT`, `UPDATE`, `DELETE`), která se provádí jako **jedna nedělitelná jednotka práce** (všechno, nebo nic), a která musí splňovat **ACID** vlastnosti (Atomicita, Konzistence, Izolace, Trvanlivost).

Pro explicitní řízení transakcí slouží příkazy **Transaction Control Language (TCL)**:

* **`BEGIN`** nebo **`START TRANSACTION`**: Zahájí novou transakci. Všechny následující SQL příkazy až do `COMMIT` nebo `ROLLBACK` jsou součástí této transakce.
    * *Poznámka:* Mnoho SQL klientů a nástrojů (včetně pgAdminu ve výchozím nastavení) funguje v režimu "autocommit", kde každý jednotlivý SQL příkaz je automaticky obalen do vlastní transakce a ihned potvrzen. Pokud chcete provést více příkazů v jedné transakci, musíte explicitně použít `BEGIN`.
* **`COMMIT`**: Úspěšně ukončí aktuální transakci a **trvale uloží** všechny změny provedené v rámci této transakce do databáze.
* **`ROLLBACK`**: Neúspěšně ukončí aktuální transakci a **zruší (vrátí zpět)** všechny změny provedené v rámci této transakce od posledního `BEGIN` (nebo `SAVEPOINT`). Databáze se vrátí do stavu před začátkem transakce.
* **`SAVEPOINT nazev_bodu`**: Vytvoří pojmenovaný "záchytný bod" uvnitř probíhající transakce.
* **`ROLLBACK TO SAVEPOINT nazev_bodu`**: Vrátí transakci zpět pouze k určenému záchytnému bodu. Změny provedené *po* tomto bodu jsou zrušeny, ale změny provedené *před* ním zůstávají součástí transakce (a mohou být později potvrzeny pomocí `COMMIT` nebo zrušeny celkovým `ROLLBACK`).

**Příklad použití transakce:**

Představme si, že chceme převést knihu "Duna" (book_id=6) od vydavatele "Argo" (publisher_id=1) k vydavateli "Host" (publisher_id=2) a zároveň mírně zvýšit její cenu. Chceme, aby se obě změny provedly, nebo žádná.

```sql
BEGIN; -- Zahájení transakce

-- Změna vydavatele
UPDATE books
SET publisher_id = 2 -- ID vydavatele Host
WHERE book_id = 6;

-- Zvýšení ceny
UPDATE books
SET price = price + 20.00
WHERE book_id = 6;

-- Zde bychom mohli provést další operace...

-- Pokud vše proběhlo v pořádku, potvrdíme transakci
COMMIT;
-- Nyní jsou obě změny trvale uloženy.

-- Příklad s ROLLBACK: Pokusíme se vložit autora, který již existuje (poruší UNIQUE constraint)
BEGIN;

-- Tento INSERT projde (pokud ID 14 neexistuje)
INSERT INTO authors (author_id, first_name, last_name, birth_year)
VALUES (14, 'Test', 'Autor', 2000);

-- Tento INSERT selže, protože autor 'Jo Nesbø' již existuje (UNIQUE constraint)
INSERT INTO authors (first_name, last_name, birth_year)
VALUES ('Jo', 'Nesbø', 1961); -- Chyba!

-- Protože druhý INSERT selhal, celou transakci vrátíme zpět
ROLLBACK;
-- Žádný nový autor (ani Test Autor) nebude v databázi uložen.
```

### Indexy (Indexes)

**Co je index?**

Index je speciální databázová struktura (často B-strom), která je asociovaná s tabulkou a slouží k **urychlení vyhledávání dat** (operací `SELECT`, zejména s klauzulí `WHERE`, a také operací `JOIN`). Funguje podobně jako rejstřík na konci knihy – místo procházení celé knihy (tabulky) stránku po stránce (řádek po řádku) se databáze podívá do indexu, kde rychle najde "odkazy" (ukazatele) na relevantní stránky (řádky).

**Výhody:**

* **Výrazné zrychlení `SELECT` dotazů:** Zejména u velkých tabulek a dotazů filtrujících podle indexovaného sloupce.
* **Zrychlení `JOIN` operací:** Indexy na sloupcích používaných ve spojovacích podmínkách (`ON` klauzule) jsou klíčové pro výkon.
* **Vynucení `UNIQUE` omezení:** Unikátní indexy zajišťují unikátnost hodnot ve sloupci.

**Nevýhody:**

* **Zabírají místo na disku:** Index je další datová struktura, která musí být uložena.
* **Zpomalují operace měnící data (`INSERT`, `UPDATE`, `DELETE`):** Při každé změně dat v tabulce musí databáze aktualizovat i všechny relevantní indexy, což přidává režii.

**Kdy vytvářet indexy?**

* Na sloupcích, které se **často používají v `WHERE` klauzulích**.
* Na sloupcích, které se **často používají pro spojování tabulek (`JOIN ... ON ...`)** – zejména na cizích klíčích.
* Na sloupcích, podle kterých se **často řadí (`ORDER BY`)**.
* **Automaticky se vytvářejí** pro sloupce s omezením `PRIMARY KEY` a `UNIQUE`.

**Vytváření a mazání indexů:**

```sql
-- Vytvoření standardního (B-tree) indexu nad sloupcem 'title' v tabulce 'books'
CREATE INDEX idx_books_title ON books (title);

-- Vytvoření indexu nad více sloupci
CREATE INDEX idx_authors_names ON authors (last_name, first_name);

-- Vytvoření unikátního indexu (navíc vynucuje unikátnost)
-- CREATE UNIQUE INDEX idx_books_isbn ON books (isbn); -- Není třeba, máme UNIQUE constraint

-- Smazání indexu
DROP INDEX idx_books_title;
```
*Název indexu (`idx_books_title`) je konvence, měl by být popisný.*

**Typy indexů (zmínka):** PostgreSQL podporuje různé typy indexů (B-tree, Hash, GiST, GIN, BRIN) optimalizované pro různé datové typy a typy dotazů. Pro většinu běžných účelů je výchozí B-tree dostačující.

### Pohledy (Views)

**Co je pohled?**

Pohled je **virtuální tabulka**, jejíž obsah je definován `SELECT` dotazem. Pohled sám o sobě **neukládá data** (obvykle), ale funguje jako uložený dotaz, na který se můžeme odkazovat jménem, jako bychom se dotazovali na běžnou tabulku.

**Výhody:**

* **Zjednodušení složitých dotazů:** Často používané nebo komplexní dotazy (např. s více `JOIN`y nebo agregacemi) můžeme "schovat" do pohledu a pak se dotazovat jednoduše na tento pohled.
* **Bezpečnost a řízení přístupu:** Můžeme vytvořit pohled, který zobrazuje pouze určité sloupce nebo řádky z podkladových tabulek, a uživatelům dát práva pouze k tomuto pohledu, nikoli k celým tabulkám.
* **Logická nezávislost na datech:** Pokud se změní struktura podkladových tabulek, můžeme někdy upravit definici pohledu tak, aby aplikace používající pohled nemusely být měněny.

**Vytváření a mazání pohledů:**

```sql
-- Vytvoření pohledu zobrazujícího názvy knih a jména jejich vydavatelů
CREATE VIEW v_book_publishers AS
SELECT
    b.title AS book_title,
    p.name AS publisher_name
FROM
    books AS b
LEFT JOIN -- Použijeme LEFT JOIN, abychom viděli i knihy bez vydavatele
    publishers AS p ON b.publisher_id = p.publisher_id;

-- Vytvoření nebo nahrazení existujícího pohledu
CREATE OR REPLACE VIEW v_prolific_authors AS
SELECT
    a.first_name || ' ' || a.last_name AS author_name,
    COUNT(ba.book_id) AS book_count
FROM
    authors AS a
JOIN
    book_authors AS ba ON a.author_id = ba.author_id
GROUP BY
    a.author_id, author_name -- Můžeme grupovat podle aliasu, pokud je jednoznačný
HAVING
    COUNT(ba.book_id) > 1;

-- Smazání pohledu
DROP VIEW v_book_publishers;
```

**Použití pohledů:**

Na pohled se dotazujeme stejně jako na běžnou tabulku:

```sql
-- Vybrat všechny záznamy z pohledu knih a vydavatelů
SELECT * FROM v_book_publishers;

-- Vybrat knihy od vydavatele začínajícího na 'A' pomocí pohledu
SELECT book_title
FROM v_book_publishers
WHERE publisher_name LIKE 'A%';

-- Vybrat nejplodnější autory z pohledu
SELECT * FROM v_prolific_authors ORDER BY book_count DESC;
```

**Aktualizovatelné pohledy:**

Některé jednoduché pohledy (typicky definované nad jednou tabulkou bez `GROUP BY`, `DISTINCT` a složitějších funkcí) mohou být aktualizovatelné, což znamená, že přes ně lze provádět příkazy `INSERT`, `UPDATE`, `DELETE`, které se promítnou do podkladové tabulky. Komplexní pohledy obvykle aktualizovatelné nejsou.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte index:** Vytvořte B-tree index s názvem `idx_books_pub_year` na sloupci `publication_year` v tabulce `books`. Proč by mohl být takový index užitečný?
2.  **Vytvořte pohled:** Vytvořte pohled `v_author_book_details`, který zobrazí celé jméno autora, název knihy a rok vydání knihy pro všechny vazby autor-kniha.
    * _Nápověda: Budete potřebovat spojit tabulky `authors`, `book_authors` a `books`._
3.  **Použijte pohled:** Napište dotaz nad pohledem `v_author_book_details` (vytvořeným v předchozím kroku), který najde všechny knihy napsané autory, jejichž příjmení je 'Tolkien'.
4.  **Transakce (Teoreticky):** Popište slovně (nebo pomocí SQL příkazů `BEGIN`, `UPDATE`, `COMMIT`/`ROLLBACK`), jak byste provedli následující operaci jako jednu transakci: Zvýšit cenu všech knih vydaných před rokem 1950 o 50 Kč a zároveň snížit cenu všech knih vydaných po roce 2010 o 20 Kč. Co by se mělo stát, pokud by jedna z `UPDATE` operací selhala?
5.  **Vytvořte pohled `v_modern_books`:** Tento pohled by měl zobrazovat pouze knihy vydané v roce 2000 nebo později. Měl by obsahovat sloupce `title`, `publication_year`, `price` a `publisher_name` (z tabulky `publishers`). Následně napište dotaz, který z tohoto pohledu vybere všechny knihy od vydavatele "Argo".
    * _Nápověda: Definice pohledu bude obsahovat `JOIN` a `WHERE publication_year >= 2000`. Dotaz nad pohledem pak bude jednoduchý `SELECT ... FROM v_modern_books WHERE ...`._
6.  **Indexy (Teoreticky):** Proč by mohl být vícesloupcový index `idx_authors_names` (vytvořený v příkladu výše jako `CREATE INDEX idx_authors_names ON authors (last_name, first_name);`) užitečnější pro vyhledávání a řazení autorů podle celého jména než dva samostatné indexy na sloupcích `last_name` a `first_name`?
    * _Nápověda: Zamyslete se nad tím, jak databáze může využít index při podmínkách typu `WHERE last_name = '...' AND first_name = '...'` nebo při `ORDER BY last_name, first_name`._

*(Správnost syntaxe `CREATE INDEX` a `CREATE VIEW` si ověřte spuštěním. Výsledky dotazů nad pohledy si ověřte.)*
