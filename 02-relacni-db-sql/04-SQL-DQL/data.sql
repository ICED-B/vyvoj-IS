-- data.sql
-- Rozšířený skript pro naplnění tabulek databáze 'sql_knihovna_db' ukázkovými daty.
-- Před spuštěním tohoto skriptu musí existovat struktura tabulek
-- (vytvořená pomocí příkazů CREATE TABLE z předchozí sekce).
-- Vymazání existujících dat (pokud skript spouštíme opakovaně)
-- POZOR: Smaže všechna data v tabulkách! Používat opatrně.
DELETE FROM book_authors;
DELETE FROM books;
DELETE FROM authors;
DELETE FROM publishers;
-- Resetování sekvencí pro SERIAL ID (zajišťuje, že ID začnou znovu od 1)
ALTER SEQUENCE publishers_publisher_id_seq RESTART WITH 1;
ALTER SEQUENCE authors_author_id_seq RESTART WITH 1;
ALTER SEQUENCE books_book_id_seq RESTART WITH 1;
-- Vložení vydavatelů
INSERT INTO publishers (name, headquarters)
VALUES ('Argo', 'Praha'),
    -- ID: 1
    ('Host', 'Brno'),
    -- ID: 2
    ('Albatros Media', 'Praha'),
    -- ID: 3
    ('Euromedia Group', 'Praha'),
    -- ID: 4
    ('Paseka', 'Praha'),
    -- ID: 5
    ('Knižní klub', 'Praha'),
    -- ID: 6
    ('Mladá fronta', 'Praha');
-- ID: 7
-- Vložení autorů
INSERT INTO authors (first_name, last_name, birth_year)
VALUES ('Jo', 'Nesbø', 1960),
    -- ID: 1
    ('J.R.R.', 'Tolkien', 1892),
    -- ID: 2
    ('George', 'Orwell', 1903),
    -- ID: 3
    ('Agatha', 'Christie', 1890),
    -- ID: 4
    ('Terry', 'Pratchett', 1948),
    -- ID: 5
    ('Frank', 'Herbert', 1920),
    -- ID: 6
    ('Arthur C.', 'Clarke', 1917),
    -- ID: 7
    ('Douglas', 'Adams', 1952),
    -- ID: 8
    ('Neil', 'Gaiman', 1960),
    -- ID: 9
    ('Dan', 'Brown', 1964),
    -- ID: 10
    ('Ken', 'Follett', 1949),
    -- ID: 11
    ('Stieg', 'Larsson', 1954),
    -- ID: 12
    ('Isaac', 'Asimov', 1920),
    -- ID: 13
    ('Karel', 'Čapek', 1890);
-- ID: 14
-- Používáme ID vydavatelů 1-7 a autorů 1-14
INSERT INTO books (
        title,
        publication_year,
        isbn,
        page_count,
        price,
        publisher_id
    )
VALUES -- Původní knihy
    (
        'Spasitel',
        2009,
        '9788076620274',
        496,
        349.90,
        1
    ),
    -- ID: 1, Argo
    (
        'Pán prstenů: Společenstvo Prstenu',
        1954,
        '9788025712152',
        432,
        429.00,
        1
    ),
    -- ID: 2, Argo
    (
        'Farma zvířat',
        1945,
        '9788025710899',
        128,
        199.50,
        1
    ),
    -- ID: 3, Argo
    (
        'Deset malých černoušků',
        1939,
        '9788024263372',
        256,
        279.00,
        4
    ),
    -- ID: 4, Euromedia
    (
        'Barva kouzel',
        1983,
        '9788071976318',
        288,
        299.00,
        5
    ),
    -- ID: 5, Paseka
    ('Duna', 1965, '9788076621110', 688, 499.00, 1),
    -- ID: 6, Argo
    (
        '2001: Vesmírná odysea',
        1968,
        '9788076620519',
        240,
        249.00,
        1
    ),
    -- ID: 7, Argo
    (
        'Stopařův průvodce po Galaxii',
        1979,
        '9788025700500',
        216,
        269.00,
        1
    ),
    -- ID: 8, Argo
    (
        'Leviatan se probouzí',
        2011,
        '9788075530060',
        560,
        399.00,
        2
    ),
    -- ID: 9, Host
    (
        'Silmarillion',
        1977,
        '9788025704807',
        416,
        389.00,
        1
    ),
    -- ID: 10, Argo
    ('Netopýr', 1997, '9788076620601', 400, 329.00, 4),
    -- ID: 11, Euromedia
    ('Mort', 1987, '9788071976080', 272, 289.00, 5),
    -- ID: 12, Paseka
    ('1984', 1949, NULL, 328, 299.00, 1),
    -- ID: 13, Argo, bez ISBN
    -- Nové knihy
    (
        'Dobrá znamení',
        1990,
        '9788071975397',
        416,
        349.00,
        5
    ),
    -- ID: 14, Paseka
    (
        'Šifra mistra Leonarda',
        2003,
        '9788025704227',
        496,
        399.00,
        1
    ),
    -- ID: 15, Argo
    (
        'Pilíře Země',
        1989,
        '9788024244821',
        992,
        599.00,
        4
    ),
    -- ID: 16, Euromedia (Knižní klub je imprint)
    (
        'Muži, kteří nenávidí ženy',
        2005,
        '9788075778625',
        560,
        449.00,
        2
    ),
    -- ID: 17, Host
    ('Nadace', 1951, '9788025700708', 240, 279.00, 1),
    -- ID: 18, Argo
    (
        'Američtí bohové',
        2001,
        '9788074329280',
        608,
        498.00,
        5
    ),
    -- ID: 19, Paseka
    (
        'Čaroprávnost',
        1987,
        '9788071976196',
        288,
        299.00,
        5
    ),
    -- ID: 20, Paseka
    (
        'Vražda v Orient-expresu',
        1934,
        '9788024250068',
        248,
        259.00,
        4
    );
-- ID: 21, Euromedia
INSERT INTO book_authors (book_id, author_id)
VALUES -- Původní vazby
    (1, 1),
    -- Spasitel - Jo Nesbø
    (2, 2),
    -- Společenstvo Prstenu - J.R.R. Tolkien
    (3, 3),
    -- Farma zvířat - George Orwell
    (4, 4),
    -- Deset malých černoušků - Agatha Christie
    (5, 5),
    -- Barva kouzel - Terry Pratchett
    (6, 6),
    -- Duna - Frank Herbert
    (7, 7),
    -- 2001: Vesmírná odysea - Arthur C. Clarke
    (8, 8),
    -- Stopařův průvodce po Galaxii - Douglas Adams
    -- Leviatan (ID 9) nemá autora v datech
    (10, 2),
    -- Silmarillion - J.R.R. Tolkien
    (11, 1),
    -- Netopýr - Jo Nesbø
    (12, 5),
    -- Mort - Terry Pratchett
    (13, 3),
    -- 1984 - George Orwell
    -- Nové vazby
    (14, 5),
    -- Dobrá znamení - Terry Pratchett
    (14, 9),
    -- Dobrá znamení - Neil Gaiman (kniha má 2 autory)
    (15, 10),
    -- Šifra mistra Leonarda - Dan Brown
    (16, 11),
    -- Pilíře Země - Ken Follett
    (17, 12),
    -- Muži, kteří nenávidí ženy - Stieg Larsson
    (18, 13),
    -- Nadace - Isaac Asimov
    (19, 9),
    -- Američtí bohové - Neil Gaiman
    (20, 5),
    -- Čaroprávnost - Terry Pratchett
    (21, 4);
-- Vražda v Orient-expresu - Agatha Christie
SELECT 'Data byla úspěšně vložena/aktualizována.' AS status;