-- 1. Vypište názvy a ceny všech knih, které stojí méně než 300 Kč
SELECT title,
    price
FROM books
WHERE price <= 300;
-- 2. Najděte všechny autory narozené v 19. století (tj. roky 1801 až 1900 včetně). Vypište jejich celé jméno (jako jeden sloupec, např. pomocí konkatenace) a rok narození.
SELECT first_name || ' ' || last_name AS cele_jmeno
FROM authors
WHERE birth_year BETWEEN 1801 AND 1900;
-- 3. Vypište názvy a ISBN všech knih, které mají přiřazené ISBN.
SELECT title,
    isbn
FROM books
WHERE isbn IS NOT NULL;
-- 4. Zobrazte 5 knih s největším počtem stran. Výstup seřaďte sestupně podle počtu stran. Vypište název a počet stran.
SELECT *
FROM books
ORDER BY page_count DESC
LIMIT 5;
-- 5. Najděte všechny vydavatele, jejichž sídlo je v Praze. Vypište pouze jejich jména.
SELECT *
FROM publishers
WHERE headquarters LIKE '%Praha%';
-- 6. Vypište unikátní roky vydání pro knihy vydané nakladatelstvím "Argo" (ID vydavatele je 1).
SELECT DISTINCT publication_year
FROM books
WHERE publisher_id = 1;
-- 7. Vypište názvy všech knih od vydavatelů Host (ID 2) nebo Paseka (ID 5), seřazené abecedně podle názvu.
SELECT title
FROM books
WHERE publisher_id IN (2, 5)
ORDER BY title;
-- 8. Najděte autory, jejichž křestní jméno začíná na 'A' a příjmení končí na 'e' (bez ohledu na veliko st písmen). Vypište jejich křestní jméno a příjmení.
SELECT first_name,
    last_name
FROM authors
WHERE first_name LIKE 'A%'
    AND last_name LIKE '%e';
-- 9. Vypište názvy a roky vydání knih, které nebyly vydány v 80. letech 20. století (tj. mimo roky 1980-1989 včetně).
SELECT title,
    publication_year
FROM books
WHERE publication_year NOT BETWEEN 1980 AND 1989;
-- 10. Najděte všechny autory, u kterých je znám rok narození, a seřaďte je od nejstaršího po nejmladšího. Vypište celé jméno a rok narození.
SELECT first_name,
    last_name,
    birth_year
FROM authors
WHERE birth_year IS NOT NULL
ORDER BY birth_year;
-- 11. Najděte 3 nejlevnější knihy vydané nakladatelstvím "Paseka" (ID 5). Vypište název a cenu.
SELECT title,
    price
FROM books
WHERE publisher_id = 5
ORDER BY price
LIMIT 3;
-- 12. Vypište názvy knih a jejich počet stran, přičemž sloupec s počtem stran pojmenujte aliasem pocet_stranek. Výsledky seřaďte sestupně podle tohoto aliasu.
SELECT title,
    page_count AS pocet_stranek
FROM books
ORDER BY pocet_stranek DESC;