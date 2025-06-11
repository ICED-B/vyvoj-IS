-- Vyhledání knih podle ISBN
DROP INDEX IF EXISTS idx_books_isbn;
EXPLAIN ANALYZE
SELECT *
FROM books
WHERE isbn = '6937059401802';
CREATE INDEX idx_books_isbn ON books(isbn);
EXPLAIN ANALYZE
SELECT *
FROM books
WHERE isbn = '6937059401802';
-- Vyhledání všech knih od konkrétního vydavatele
DROP INDEX IF EXISTS idx_books_publisher_id;
EXPLAIN ANALYZE
SELECT *
FROM books b
    JOIN publishers p ON b.publisher_id = p.publisher_id
WHERE p.name = 'Vydavatel 150';
CREATE INDEX idx_books_publisher_id ON books(publisher_id);
EXPLAIN ANALYZE
SELECT *
FROM books b
    JOIN publishers p ON b.publisher_id = p.publisher_id
WHERE p.name = 'Vydavatel 150';
-- Vyhledání autorů podle příjmení a roku narození
EXPLAIN ANALYZE
SELECT *
FROM authors
WHERE last_name = 'Příjmení42'
    AND birth_year > 1950;
CREATE INDEX idx_authors_last_name_birth_year ON authors(last_name, birth_year);
EXPLAIN ANALYZE
SELECT *
FROM authors
WHERE last_name = 'Příjmení42'
    AND birth_year > 1950;