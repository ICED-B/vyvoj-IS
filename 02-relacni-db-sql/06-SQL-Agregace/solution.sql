--1. Spočítejte celkový počet autorů v databázi.
SELECT COUNT(author_id) as pocet_autoru
FROM authors;
--2. Zjistěte průměrný počet stran knih vydaných nakladatelstvím "Host" (ID 2).
SELECT AVG(page_count) as prumerny_pocet_stran_host
FROM books
WHERE publisher_id = 2;
--3. Vypište názvy všech vydavatelů a počet knih, které každý z nich vydal. Zahrňte i vydavatele, kteří nevydali žádnou knihu (měli by mít počet 0). Seřaďte výsledek podle počtu knih sestupně.
SELECT publishers.name,
    COUNT(books.book_id) AS pocet_knih
FROM books
    RIGHT JOIN publishers USING(publisher_id)
GROUP BY publishers.name
ORDER BY pocet_knih DESC;
--4. Najděte rok (nebo roky), ve kterém bylo vydáno nejvíce knih. Vypište rok a počet knih.
SELECT publication_year,
    COUNT(book_id) AS pocet_knih
FROM books
GROUP BY publication_year
ORDER BY pocet_knih DESC
LIMIT 1;
--5. Vypište jména autorů (celé jméno) a počet knih, které napsali, ale pouze pro ty autory, kteří napsali alespoň 2 knihy.
SELECT a.first_name || ' ' || a.last_name,
    COUNT(b.book_id) as pocet_knih
FROM authors as a
    INNER JOIN book_authors USING(author_id)
    INNER JOIN books as b USING(book_id)
GROUP BY a.author_id,
    a.first_name,
    a.last_name
HAVING COUNT(b.book_id) >= 2;
--6. Pro každého vydavatele zjistěte rok vydání jeho nejstarší a nejnovější knihy. Vypište název vydavatele, nejstarší rok a nejnovější rok.
SELECT publishers.name,
    MAX(books.publication_year) AS nejnovejsi_kniha,
    MIN(books.publication_year) AS nejstarsi_kniha
FROM books
    INNER JOIN publishers USING(publisher_id)
GROUP BY publishers.name;
--7. Spočítejte celkový počet stran všech knih pro každého autora. Vypište celé jméno autora a celkový počet stran jeho knih. Zahrňte i autory bez knih (měli by mít součet 0 nebo NULL).
SELECT a.first_name || ' ' || a.last_name,
    COALESCE(SUM(b.page_count), 0) as celkovy_pocet_stran
FROM authors as a
    LEFT JOIN book_authors USING(author_id)
    left JOIN books as b USING(book_id)
GROUP BY A.author_id,
    a.first_name,
    a.last_name;
--8. Najděte vydavatele, jejichž průměrná cena knihy je vyšší než 350 Kč. Vypište název vydavatele a jeho průměrnou cenu.
SELECT publishers.name,
    AVG(books.price) AS prumerna_cena
FROM books
    RIGHT JOIN publishers USING(publisher_id)
GROUP BY publishers.name
HAVING AVG(books.price) > 350;