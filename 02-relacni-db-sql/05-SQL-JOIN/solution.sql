-- 1. Vypište názvy všech knih a jména jejich vydavatelů. Použijte INNER JOIN.
SELECT b.title AS book_title,
    p.name
FROM books as b
    INNER JOIN publishers AS p USING(publisher_id);
-- 2. Vypište názvy všech knih a celá jména jejich autorů. Zobrazte dvojice (název knihy, jméno autora). Knihy s více autory se zobrazí vícekrát. Použijte INNER JOIN přes tři tabulky.
SELECT b.title AS book_title,
    a.first_name || ' ' || a.last_name AS author_name
FROM books as b
    INNER JOIN book_authors AS ba USING(book_id)
    INNER JOIN authors as a USING(author_id);
-- 3. Vypište jména všech vydavatelů a k nim názvy knih, které vydali. Zahrňte i vydavatele, kteří v databázi nemají žádnou knihu. Výsledky seřaďte podle jména vydavatele a poté podle názvu knihy.
SELECT p.name AS publisher_name,
    b.title AS book_title
FROM publishers AS p
    LEFT JOIN books as b USING(publisher_id)
ORDER BY publisher_name,
    book_title;
-- 4. Vypište názvy knih vydaných po roce 1980 spolu s celým jménem jejich autora (nebo autorů).
SELECT b.title AS book_title,
    a.first_name || ' ' || a.last_name AS author_name
FROM books as b
    INNER JOIN book_authors AS ba USING(book_id)
    INNER JOIN authors as a USING(author_id)
WHERE b.publication_year > 1980;
-- 5. Najděte všechny knihy, které nemají v tabulce book_authors přiřazeného žádného autora. Vypište jejich názvy.
SELECT b.title AS book_title
FROM books as b
    LEFT JOIN book_authors AS ba USING(book_id)
WHERE ba.author_id ISNULL;
-- 6. Vypište názvy knih, jména jejich autorů a jména jejich vydavatelů pro všechny knihy vydané nakladatelstvím "Argo" (ID 1). Výsledky seřaďte podle názvu knihy.
SELECT b.title AS book_title,
    a.first_name || ' ' || a.last_name AS author_name,
    p.name
FROM books as b
    INNER JOIN book_authors AS ba USING(book_id)
    INNER JOIN authors as a USING(author_id)
    INNER JOIN publishers AS p USING(publisher_id)
WHERE p.name = 'Argo'
ORDER BY book_title;
-- 7. Vypište jména a sídla všech vydavatelů, kteří v databázi nemají žádnou knihu.
SELECT p.name AS publisher_name,
    P.headquarters AS publisher_headquater
FROM publishers AS p
    LEFT JOIN books as b USING(publisher_id)
WHERE b.title ISNULL;
-- 8. Najděte názvy knih, které napsali autoři narození před rokem 1900 a které zároveň vydalo nakladatelství "Argo" (ID 1).
SELECT b.title AS book_title
FROM books as b
    INNER JOIN book_authors AS ba USING(book_id)
    INNER JOIN authors as a USING(author_id)
    INNER JOIN publishers AS p USING(publisher_id)
WHERE p.name = 'Argo'
    AND a.birth_year < 1900
ORDER BY book_title;