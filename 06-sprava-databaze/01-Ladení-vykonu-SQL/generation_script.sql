DO $$
DECLARE -- Konfigurace
    v_num_authors_to_add INT := 5000;
v_num_publishers_to_add INT := 200;
v_num_books_to_generate INT := 100000;
-- Počáteční ID (pro generování jmen, nikoliv pro výběr)
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
-- Pole pro bezpečný výběr existujících ID
arr_all_author_ids INT [];
arr_all_publisher_ids INT [];
v_num_total_authors INT;
v_num_total_publishers INT;
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
-- Načtení všech existujících ID do polí pro bezpečný náhodný výběr
SELECT array_agg(author_id) INTO arr_all_author_ids
FROM authors;
v_num_total_authors := COALESCE(array_length(arr_all_author_ids, 1), 0);
SELECT array_agg(publisher_id) INTO arr_all_publisher_ids
FROM publishers;
v_num_total_publishers := COALESCE(array_length(arr_all_publisher_ids, 1), 0);
-- 3. Generování knih a jejich propojení
RAISE NOTICE 'Generuji % knih...',
v_num_books_to_generate;
-- Kontrola, zda máme autory a vydavatele pro přiřazení
IF (
    v_num_total_authors = 0
    OR v_num_total_publishers = 0
)
AND v_num_books_to_generate > 0 THEN RAISE EXCEPTION 'Nebyly nalezeny žádní autoři nebo vydavatelé pro přiřazení ke knihám.';
END IF;
FOR i IN 1..v_num_books_to_generate LOOP -- Vytvoření náhodného názvu knihy
v_random_title := arr_adjectives [floor(random() * array_length(arr_adjectives, 1)) + 1] || ' ' || arr_nouns [floor(random() * array_length(arr_nouns, 1)) + 1] || ' ' || arr_concepts [floor(random() * array_length(arr_concepts, 1)) + 1];
-- Výběr náhodného vydavatele z pole existujících ID
v_random_publisher_id := arr_all_publisher_ids [floor(random() * v_num_total_publishers) + 1];
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
        (1000000000000 + floor(random() * 9000000000000))::BIGINT::TEXT,
        -- Fiktivní ISBN
        floor(random() * (1000 - 100 + 1) + 100)::INT,
        round((random() * (800 - 150) + 150)::NUMERIC, 2),
        v_random_publisher_id
    )
RETURNING book_id INTO v_generated_book_id;
-- Propojení knihy s 1 až 2 náhodnými autory
-- První autor
v_random_author_id := arr_all_author_ids [floor(random() * v_num_total_authors) + 1];
INSERT INTO book_authors (book_id, author_id)
VALUES (v_generated_book_id, v_random_author_id);
-- Druhý autor (s 25% pravděpodobností)
IF random() < 0.25 THEN v_random_author_id := arr_all_author_ids [floor(random() * v_num_total_authors) + 1];
-- Zajistíme, aby se nepřidal stejný autor dvakrát ke stejné knize
INSERT INTO book_authors (book_id, author_id)
VALUES (v_generated_book_id, v_random_author_id) ON CONFLICT (book_id, author_id) DO NOTHING;
END IF;
END LOOP;
RAISE NOTICE 'Generování dat dokončeno.';
END $$;