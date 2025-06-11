-- Vytvořte funkci `cele_jmeno_autora`, která přijme ID autora jako vstupní parametr (`author_id`) a vrátí jeho celé jméno jako jeden textový řetězec ve formátu "Jméno Příjmení".
CREATE OR REPLACE FUNCTION cele_jmeno_autora(author_id INTEGER) RETURNS TEXT AS $$
DECLARE cele_jmeno TEXT;
BEGIN
SELECT CONCAT(first_name, ' ', last_name) INTO cele_jmeno
FROM authors
WHERE authors.author_id = cele_jmeno_autora.author_id;
RETURN cele_jmeno;
END;
$$ LANGUAGE plpgsql;
-- Zavolání funkce cele_jmeno_autora
SELECT cele_jmeno_autora(1);
--Vytvořte proceduru `pridej_knihu`, která zjednoduší vkládání nové knihy a jejího autora. Procedura přijme jméno a příjmení autora a název knihy. Logika by měla být následující:
CREATE OR REPLACE PROCEDURE pridej_knihu(
        jmeno_autora TEXT,
        prijmeni_autora TEXT,
        nazev_knihy TEXT
    ) AS $$
DECLARE v_author_id INTEGER;
v_book_id INTEGER;
BEGIN
SELECT authors.author_id INTO v_author_id
FROM authors
WHERE authors.first_name = jmeno_autora
    AND authors.last_name = prijmeni_autora;
IF v_author_id IS NULL THEN
INSERT INTO authors (first_name, last_name)
VALUES (jmeno_autora, prijmeni_autora)
RETURNING authors.author_id INTO v_author_id;
END IF;
INSERT INTO books (title)
VALUES (nazev_knihy)
RETURNING book_id INTO v_book_id;
INSERT INTO book_authors (book_id, author_id)
VALUES (v_book_id, v_author_id);
END;
$$ LANGUAGE plpgsql;
-- Smazani knihy z předchozícho volani
DELETE FROM books
WHERE title = 'The Hunger Games';
-- Smazani autora z předchozícho volani
DELETE FROM authors
WHERE first_name = 'Suzanne'
    AND last_name = 'Collins';
-- Zavolani procedury pridej_knihu
CALL pridej_knihu('Suzanne', 'Collins', 'The Hunger Games');
-- Zobrazeni vysledku procedury
SELECT *
FROM authors AS a -- Levá tabulka (chceme všechny autory)
    LEFT JOIN book_authors AS ba ON a.author_id = ba.author_id -- Spojení na vazební tabulku
    LEFT JOIN books AS b ON ba.book_id = b.book_id
WHERE b.title = 'The Hunger Games';
-- Odstranění sloupce price_with_dph z předchozího volání
ALTER TABLE books DROP COLUMN IF EXISTS price_with_dph;
-- Přidánín sloupce price_with_dph
ALTER TABLE books
ADD COLUMN price_with_dph NUMERIC;
-- Zavolání funkce spocitej_cenu_s_dph pro každý řádek a naplnění sloupce price_with_dph výslednou hodnotou
UPDATE books
SET price_with_dph = spocitej_cenu_s_dph(price, 21)
WHERE price IS NOT NULL;
-- Zobrazení výsledku operace
SELECT *
FROM books;