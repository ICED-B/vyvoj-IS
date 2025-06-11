-- Trigger pro kontrolu záporné ceny
CREATE OR REPLACE FUNCTION check_non_negative_price() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'UPDATE'
    OR TG_OP = 'INSERT'
    AND NEW.price < 0 THEN RAISE EXCEPTION 'Cena nemůže být záporná.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Přiřazení trigger funkce pro kontrolu záporné ceny k tabulce books
CREATE TRIGGER check_non_negative_price_trigger BEFORE
UPDATE
    OR
INSERT ON books FOR EACH ROW EXECUTE FUNCTION check_non_negative_price();
-- Test triggeru pro kontrolu záporné ceny
UPDATE books
SET price = -1
WHERE book_id = 1;
-- Trigger pro automatické nastavení data poslední změny
ALTER TABLE books DROP COLUMN IF EXISTS last_updated;
ALTER TABLE books
ADD COLUMN last_updated TIMESTAMPTZ;
CREATE OR REPLACE FUNCTION update_last_updated_column() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'UPDATE' THEN NEW.last_updated := NOW();
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Přiřazení trigger funkce pro automatické nastavení data poslední změny k tabulce books
CREATE OR REPLACE TRIGGER update_last_updated_column_trigger BEFORE
UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
UPDATE books
SET price = 349.9
WHERE book_id = 1;
-- Test triggeru pro automatické nastavení data poslední změny
SELECT *
FROM books
WHERE book_id = 1;
-- Trigger bránící smazání autora s knihami
CREATE OR REPLACE FUNCTION check_author_books_before_delete() RETURNS TRIGGER AS $$ BEGIN IF EXISTS (
        SELECT 1
        FROM books
            JOIN book_authors ON books.book_id = book_authors.book_id
        WHERE book_authors.author_id = OLD.author_id
    ) THEN RAISE EXCEPTION 'Cannot delete author with books.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Přiřazení trigger funkce bránící smazání autora s knihami k tabulce
CREATE OR REPLACE TRIGGER check_author_books_before_delete_trigger BEFORE DELETE ON authors FOR EACH ROW EXECUTE FUNCTION check_author_books_before_delete();
-- Test triggeru bránícího smazání autora s knihami
DELETE FROM authors
WHERE author_id = 1;