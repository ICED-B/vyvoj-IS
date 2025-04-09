## 1. Úvod do relačního modelu a PostgreSQL

V této úvodní části se seznámíme se základními pojmy ze světa databází, zaměříme se na principy relačního datového modelu a představíme si databázový systém PostgreSQL, který budeme v kurzu používat.

### Co je to databáze a DBMS?

* **Databáze (Database):** Představte si ji jako organizovanou sbírku dat uloženou elektronicky. Jejím účelem je efektivní ukládání, správa a zpřístupňování informací. Může obsahovat data nejrůznějšího charakteru – od seznamu zákazníků přes informace o produktech až po vědecká data.
* **Systém Řízení Báze Dat (SŘBD) / Database Management System (DBMS):** Je to software, který slouží jako rozhraní mezi uživatelem (nebo aplikací) a samotnou databází. DBMS umožňuje data definovat (strukturu), manipulovat s nimi (vkládat, měnit, mazat) a dotazovat se na ně. Zajišťuje také bezpečnost, integritu dat, souběžný přístup více uživatelů a obnovu po selhání.
    * Příklady DBMS: PostgreSQL, MySQL, Oracle Database, Microsoft SQL Server, SQLite, MariaDB.
* **Relační DBMS (RDBMS):** Speciální typ DBMS založený na relačním modelu (viz níže). PostgreSQL je příkladem RDBMS (konkrétně objektově-relačního ORDBMS).

### Relační datový model

Relační model, poprvé formálně popsán Edgarem F. Coddem v roce 1970, je nejpoužívanějším modelem pro strukturování dat v databázích. Jeho hlavní myšlenkou je organizace dat do **tabulek**.

* **Tabulka (Table / Relation):** Základní stavební kámen. Reprezentuje určitý typ entity (např. Studenti, Knihy, Objednávky). Skládá se z řádků a sloupců.
    * *[Obrázek jednoduché tabulky Knihy]*
* **Řádek (Row / Tuple / Record):** Reprezentuje jeden konkrétní záznam nebo instanci entity v tabulce (např. jedna konkrétní kniha, jeden student).
* **Sloupec (Column / Attribute):** Reprezentuje určitou vlastnost nebo atribut entity (např. Název knihy, Jméno studenta, Cena produktu). Každý sloupec má definovaný **datový typ**.
* **Datový typ (Data Type):** Určuje, jaký druh dat může sloupec obsahovat a jaké operace s nimi lze provádět. Mezi běžné typy patří:
    * `INTEGER` nebo `INT`: Celá čísla.
    * `VARCHAR(n)`: Textový řetězec s proměnnou délkou (maximálně `n` znaků).
    * `TEXT`: Dlouhý textový řetězec bez pevného omezení délky.
    * `DATE`: Datum (rok, měsíc, den).
    * `TIMESTAMP`: Datum a čas.
    * `BOOLEAN`: Logická hodnota (pravda/nepravda, `TRUE`/`FALSE`).
    * `NUMERIC(p, s)` nebo `DECIMAL(p, s)`: Číslo s pevnou desetinnou čárkou (přesnost `p`, počet desetinných míst `s`).
    * `FLOAT`, `REAL`: Čísla s plovoucí desetinnou čárkou.
* **Hodnota NULL:** Speciální hodnota, která značí, že data ve sloupci pro daný řádek chybí nebo nejsou známa/použitelná. Není to totéž co nula nebo prázdný řetězec.

### Klíče a Vztahy

Klíče jsou zásadní pro zajištění integrity a propojení dat v relační databázi.

* **Primární klíč (Primary Key - PK):** Jeden nebo více sloupců, jejichž hodnota **jednoznačně identifikuje každý řádek** v tabulce. Hodnoty v PK sloupci(ích) musí být unikátní a nesmí být `NULL`. Každá tabulka by měla mít právě jeden primární klíč. Často se jako PK používá uměle vytvořený celočíselný sloupec (např. `id`) s automatickým navyšováním (auto-increment).
* **Cizí klíč (Foreign Key - FK):** Jeden nebo více sloupců v jedné tabulce, které odkazují na primární klíč v jiné (nebo téže) tabulce. Cizí klíče vytvářejí **vztahy (relationships)** mezi tabulkami a zajišťují **referenční integritu** – databáze hlídá, aby FK odkazoval na existující řádek v referencované tabulce (např. nelze vložit výpůjčku knihy, která neexistuje v tabulce knih).
* **Vztahy:** Pomocí cizích klíčů modelujeme vztahy mezi entitami:
    * **1:N (One-to-Many):** Jeden záznam v jedné tabulce může souviset s více záznamy v druhé tabulce (např. jeden vydavatel vydá mnoho knih). Realizuje se přidáním FK do tabulky na straně "N" (v tabulce `books` bude sloupec `publisher_id` odkazující na PK v tabulce `publishers`).
    * **M:N (Many-to-Many):** Jeden záznam v první tabulce může souviset s více záznamy ve druhé a naopak (např. jedna kniha může mít více autorů a jeden autor může napsat více knih). Realizuje se pomocí **asociační (vazební) tabulky**, která obsahuje cizí klíče na obě propojované tabulky (např. tabulka `book_authors` s `book_id` a `author_id`).
    * **1:1 (One-to-One):** Jeden záznam v jedné tabulce souvisí právě s jedním záznamem v druhé (méně časté, např. oddělení volitelných detailů o uživateli do samostatné tabulky). Lze realizovat unikátním FK.

### Představení PostgreSQL

**PostgreSQL** (často zkracováno jako "Postgres") je vysoce výkonný, stabilní a rozšiřitelný **objektově-relační databázový systém (ORDBMS)** s otevřeným zdrojovým kódem. Patří mezi nejpokročilejší open-source databáze a těší se velké popularitě.

**Klíčové vlastnosti PostgreSQL:**

* **ACID Kompliance:** Zaručuje spolehlivost transakcí (Atomicity, Consistency, Isolation, Durability).
* **MVCC (Multi-Version Concurrency Control):** Efektivní správa souběžného přístupu více uživatelů k datům bez nutnosti zamykání celých tabulek.
* **Rozšiřitelnost:** Umožňuje definovat vlastní datové typy, funkce, operátory, indexovací metody.
* **Široká škála datových typů:** Podporuje nejen standardní SQL typy, ale i pokročilé jako JSON/JSONB, pole (arrays), geometrické typy (díky rozšíření PostGIS), UUID a další.
* **Pokročilé funkce SQL:** Podpora pro оконní funkce (window functions), CTE (Common Table Expressions), rekurzivní dotazy.
* **Procedurální jazyky:** Možnost psát uložené procedury a funkce v různých jazycích (PL/pgSQL, PL/Python, PL/Perl, atd.).
* **Robustnost a spolehlivost:** Vhodný pro kritické aplikace a velké objemy dat.
* **Aktivní komunita a vývoj.**

V tomto kurzu budeme PostgreSQL používat jako platformu pro všechny naše praktické SQL ukázky.

### Připojení k PostgreSQL

Jak je uvedeno v sekci "Nastavení prostředí", budeme používat PostgreSQL běžící v Docker kontejneru. Pro připojení k této databázi můžeme použít:

* **pgAdmin:** Webový nástroj běžící v samostatném Docker kontejneru (dostupný na `http://localhost:5051`). Po přihlášení do pgAdminu je třeba nakonfigurovat připojení k databázovému serveru `db` (název služby v Dockeru) na portu `5432` s použitím přihlašovacích údajů definovaných v `docker-compose.yml`.
* **Jiní SQL klienti (DBeaver, SQLTools ve VS Code, psql):** Tyto nástroje se připojují přímo na port mapovaný na vašem hostitelském počítači (typicky `localhost:5433`) s použitím stejných přihlašovacích údajů.

V následujících částech začneme používat jazyk SQL pro práci s naší databází knihovny v PostgreSQL.
