DO $$
DECLARE -- Konfigurace počtu záznamů k vygenerování
    v_num_authors_to_add INT := 5000;
v_num_publishers_to_add INT := 200;
v_num_books_to_generate INT := 100000;
-- Počáteční ID (autoincrement) pro nové záznamy
v_author_start_id INT;
v_publisher_start_id INT;
v_book_start_id INT;
-- Pole pro generování náhodných názvů
arr_adjectives TEXT [] := ARRAY ['Prastarý', 'Ztracený', 'Zapomenutý', 'Temný', 'Zářící', 'Tichý', 'Nekonečný', 'Poslední', 'Rudý', 'Ledový'];
arr_nouns TEXT [] := ARRAY ['Meč', 'Stín', 'Drak', 'Chrám', 'Poutník', 'Král', 'Královna', 'Les', 'Řeka', 'Hora'];
arr_concepts TEXT [] := ARRAY ['Osudu', 'Naděje', 'Zkázy', 'Snů', 'Věčnosti', 'Noci', 'Světla', 'Tajemství', 'Zrady', 'Magie'];
-- Pomocné proměnné
v_random_title TEXT;
v_random_author_id INT;
v_random_publisher_id INT;
v_generated_book_id INT;
v_max_author_id INT;
v_max_publisher_id INT;
BEGIN -- Získání aktuálních nejvyšších ID
SELECT COALESCE(MAX(author_id), 0) INTO v_author_start_id
FROM authors;
SELECT COALESCE(MAX(publisher_id), 0) INTO v_publisher_start_id
FROM publishers;
SELECT COALESCE(MAX(book_id), 0) INTO v_book_start_id
FROM books;
-- 1. Generování vydavatelů
RAISE NOTICE 'Generuji % vydavatelů...',
v_num_publishers_to_add;
FOR i IN 1..v_num_publishers_to_add LOOP
INSERT INTO publishers (name, headquarters)
VALUES (
        'Vydavatel ' || (v_publisher_start_id + i),
        'Město ' || (floor(random() * 100) + 1)
    );
END LOOP;
v_max_publisher_id := v_publisher_start_id + v_num_publishers_to_add;
-- 2. Generování autorů
RAISE NOTICE 'Generuji % autorů...',
v_num_authors_to_add;
FOR i IN 1..v_num_authors_to_add LOOP
INSERT INTO authors (first_name, last_name, birth_year)
VALUES (
        'Jméno' || (v_author_start_id + i),
        'Příjmení' || (v_author_start_id + i),
        floor(random() * (2005 - 1850 + 1) + 1850)::int
    );
END LOOP;
v_max_author_id := v_author_start_id + v_num_authors_to_add;
-- 3. Generování knih a jejich propojení s autory
RAISE NOTICE 'Generuji % knih...',
v_num_books_to_generate;
FOR i IN 1..v_num_books_to_generate LOOP -- Vytvoření náhodného názvu knihy
v_random_title := arr_adjectives [floor(random() * array_length(arr_adjectives, 1)) + 1] || ' ' || arr_nouns [floor(random() * array_length(arr_nouns, 1)) + 1] || ' ' || arr_concepts [floor(random() * array_length(arr_concepts, 1)) + 1];
-- Výběr náhodného vydavatele
v_random_publisher_id := floor(random() * v_max_publisher_id + 1)::INT;
-- Vložení knihy
INSERT INTO books (
        title,
        publication_year,
        isbn,
        page_count,
        price,
        publisher_id
    )
VALUES (
        v_random_title,
        floor(random() * (2024 - 1950 + 1) + 1950)::INT,
        -- Rok vydání
        (1000000000000 + floor(random() * 9000000000000))::BIGINT::TEXT,
        -- Fiktivní ISBN
        floor(random() * (1000 - 100 + 1) + 100)::INT,
        -- Počet stran
        round((random() * (800 - 150) + 150)::NUMERIC, 2),
        -- Cena
        v_random_publisher_id
    )
RETURNING book_id INTO v_generated_book_id;
-- Propojení knihy s 1 až 2 náhodnými autory
-- První autor
v_random_author_id := floor(random() * v_max_author_id + 1)::INT;
INSERT INTO book_authors (book_id, author_id)
VALUES (v_generated_book_id, v_random_author_id);
-- Druhý autor (s 25% pravděpodobností)
IF random() < 0.25 THEN v_random_author_id := floor(random() * v_max_author_id + 1)::INT;
-- Zajistíme, aby se nepřidal stejný autor dvakrát ke stejné knize
INSERT INTO book_authors (book_id, author_id)
VALUES (v_generated_book_id, v_random_author_id) ON CONFLICT (book_id, author_id) DO NOTHING;
END IF;
END LOOP;
RAISE NOTICE 'Generování dat dokončeno.';
END $$;