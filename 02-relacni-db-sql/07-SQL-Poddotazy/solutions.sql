--1. Najděte všechny knihy, které byly vydány ve stejném roce jako kniha 'Mort'. Vypište jejich názvy a rok vydání. (Nezahrnujte samotn0ho Morta do výsledku).
SELECT title,
    publication_year
FROM books
WHERE publication_year =(
        SELECT publication_year
        FROM books
        WHERE title = 'Mort'
    )
    AND title != 'Mort';
--2. Najděte jména všech autorů, kteří napsali alespoň jednu knihu vydanou nakladatelstvím "Argo" (ID 1). Použijte operátor IN nebo EXISTS.
SELECT first_name || ' ' || last_name AS author_name
FROM authors
WHERE author_id IN (
        SELECT author_id
        FROM book_authors
        WHERE book_id IN (
                SELECT book_id
                FROM books
                WHERE publisher_id = 1
            )
    );
--3. Najděte název a cenu nejdražší knihy (nebo knih, pokud jich je více se stejnou nejvyšší cenou).
SELECT title,
    price
FROM books
WHERE price = (
        SELECT MAX(price)
        FROM books
    );
--4. Vypište názvy všech knih, které napsal 'Terry Pratchett'. Použijte poddotaz k nalezení author_id Terryho Pratchetta.
SELECT title
FROM books
WHERE book_id IN (
        SELECT book_id
        FROM book_authors
        WHERE author_id = (
                SELECT author_id
                FROM authors
                WHERE first_name = 'Terry'
                    AND last_name = 'Pratchett'
            )
    );
--5. Pro každou knihu zobrazte její název, cenu a průměrnou cenu všech knih v databázi
SELECT title,
    price,
    (
        SELECT AVG(price)
        FROM books
    ) AS average_price
FROM books;
--6. Zjistěte průměrnou cenu knih pro ty vydavatele, kteří vydali více než 2 knihy. Vypište název vydavatele a průměrnou cenu.
SELECT name,
    (
        SELECT AVG(price)
        FROM books
        WHERE publisher_id = publishers.publisher_id
    ) AS average_price
FROM publishers
WHERE publisher_id IN (
        SELECT publisher_id
        FROM books
        GROUP BY publisher_id
        HAVING COUNT(*) > 2
    );
--7. Najděte všechny knihy, jejichž cena je vyšší než průměrná cena knih vydaných jejich vlastním vydavatelem. Vypište název knihy, její cenu a ID vydavatele.
SELECT title,
    price,
    publisher_id
FROM books
WHERE price > (
        SELECT AVG(price)
        FROM books
        WHERE publisher_id = books.publisher_id
    );
--8. Najděte vydavatele, kteří nevydali žádnou knihu v 21. století (tj. rok vydání >= 2000). Vypište jejich jména.
SELECT name
FROM publishers
WHERE publisher_id NOT IN (
        SELECT publisher_id
        FROM books
        WHERE publication_year >= 2000
    );