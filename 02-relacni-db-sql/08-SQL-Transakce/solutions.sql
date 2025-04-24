-- 1. Vytvořte index: Vytvořte B-tree index s názvem idx_books_pub_year na sloupci publication_year v tabulce books.
-- CREATE INDEX idx_books_pub_year ON books (publication_year);
-- 2. Vytvořte pohled: Vytvořte pohled v_author_book_details, který zobrazí celé jméno autora, název knihy a rok vydání knihy pro všechny vazby autor-kniha.
DROP VIEW IF EXISTS v_author_book_details;
CREATE VIEW v_author_book_details AS
SELECT a.first_name || ' ' || a.last_name AS author_name,
    b.title,
    b.publication_year
FROM authors a
    JOIN book_authors USING(author_id)
    JOIN books b USING(book_id);
SELECT *
FROM v_author_book_details;
-- 3. Použijte pohled: Napište dotaz nad pohledem v_author_book_details (vytvořeným v předchozím kroku), který najde všechny knihy napsané autory, jejichž příjmení je 'Tolkien'.
SELECT *
FROM v_author_book_details
WHERE author_name LIKE '%Tolkien';
-- 4. Popište slovně (nebo pomocí SQL příkazů `BEGIN`, `UPDATE`, `COMMIT`/`ROLLBACK`), jak byste provedli následující operaci jako jednu transakci: Zvýšit cenu všech knih vydaných před rokem 1950 o 50 Kč a zároveň snížit cenu všech knih vydaných po roce 2010 o 20 Kč. Co by se mělo stát, pokud by jedna z `UPDATE` operací selhala?
SELECT title,
    publication_year,
    price
FROM books;
BEGIN;
UPDATE books
SET price = price + 50
WHERE publication_year < 1950;
UPDATE books
SET price = price - 20
WHERE publication_year > 2010;
COMMIT;
SELECT title,
    publication_year,
    price
FROM books;
-- 5. Vytvořte pohled v_modern_books: Tento pohled by měl zobrazovat pouze knihy vydané v roce 2000 nebo později. Měl by obsahovat sloupce title, publication_year, price a publisher_name (z tabulky publishers). Následně napište dotaz, který z tohoto pohledu vybere všechny knihy od vydavatele "Argo".
DROP VIEW IF EXISTS v_modern_books;
CREATE VIEW v_modern_books AS
SELECT b.title,
    b.publication_year,
    b.price,
    p.name AS publisher_name
FROM books b
    JOIN publishers p USING(publisher_id)
WHERE b.publication_year >= 2000;
SELECT *
FROM v_modern_books;
SELECT *
FROM v_modern_books
WHERE publisher_name = 'Argo';