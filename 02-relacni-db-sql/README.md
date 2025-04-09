# Relační databázové systémy a jazyk SQL - Úvod

## 1. Cíle této části předmětu

Po absolvování této části byste měli:

* Rozumět základním principům **relačního datového modelu**.
* Být schopni **navrhnout jednoduché schéma relační databáze** (tabulky, sloupce, datové typy, klíče, vztahy).
* Ovládat **jazyk SQL** pro definici dat (DDL - Data Definition Language), manipulaci s daty (DML - Data Manipulation Language) a dotazování (DQL - Data Query Language).
* Umět psát SQL příkazy pro **vytváření, čtení, aktualizaci a mazání dat** (CRUD operace).
* Zvládat **pokročilejší SQL konstrukce**, jako jsou spojování tabulek (JOIN), agregace, poddotazy a práce s transakcemi (TCL - Transaction Control Language).
* Získat praktické zkušenosti s konkrétním RDBMS – **PostgreSQL**.
* Umět používat nástroje pro správu a dotazování databáze, jako je **pgAdmin** nebo **SQLTools** (rozšíření pro VS Code).

## 2. Klíčové koncepty

V této části se budeme zabývat následujícími tématy:

* **Relační model:** Tabulky, řádky (záznamy), sloupce (atributy), datové typy.
* **Klíče:** Primární klíč, cizí klíč, kandidátní klíč, unikátní klíč.
* **Vztahy mezi tabulkami:** 1:1, 1:N, M:N.
* **Referenční integrita.**
* **(Základy) Normalizace databáze:** 1NF, 2NF, 3NF.
* **SQL Příkazy:**
    * **DDL:** `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`, `DROP INDEX`.
    * **DML:** `INSERT INTO`, `UPDATE`, `DELETE FROM`.
    * **DQL:** `SELECT` (včetně `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`).
    * **Spojování tabulek:** `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`.
    * **Agregační funkce:** `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`.
    * **Poddotazy:** V klauzulích `SELECT`, `FROM`, `WHERE`.
    * **TCL:** `BEGIN`, `COMMIT`, `ROLLBACK`.
* **Pohledy (Views):** `CREATE VIEW`.
* **Indexy:** Význam pro optimalizaci dotazů.
* **(Úvod do) Procedurálního SQL:** Uložené procedury, funkce, triggery (podrobněji v další části předmětu).

## 3. Používané nástroje

* **Databázový systém:** **PostgreSQL** (výkonný open-source RDBMS). Budeme jej provozovat v Docker kontejneru.
* **Nástroj pro správu:** **pgAdmin 4** (webové rozhraní pro správu PostgreSQL). Rovněž poběží v Docker kontejneru.
* **Docker a Docker Compose:** Pro snadné spuštění a správu PostgreSQL a pgAdminu.
* **SQL Klienti (volitelně):** Můžete použít i jiné klienty pro připojení k databázi, např. DBeaver, psql (příkazová řádka), integrované nástroje ve vašem IDE (jako zmíněné **SQLTools**).

## 4. Praktický příklad: Simulace Knihovny

Abychom si SQL vyzkoušeli na reálnějším a přitom srozumitelném scénáři, budeme pracovat s databází simulující **jednoduchou knihovnu**. Tento systém bude zahrnovat informace o:

* **Knihách** (`books`): Titul, rok vydání, ISBN, atd.
* **Autorech** (`authors`): Jméno autora.
* **Vydavatelích** (`publishers`): Název vydavatele, sídlo.
* **Žánrech** (`genres`): Název žánru (Sci-fi, Román, Detektivka...).
* **Vazbě Autor-Kniha** (`book_authors`): Protože kniha může mít více autorů a autor může napsat více knih (vztah M:N).

Navrhneme schéma této databáze (nebo použijeme předpřipravené) a naplníme ji ukázkovými daty. Na této databázi si pak budeme demonstrovat a procvičovat jednotlivé SQL příkazy od základních až po komplexnější dotazy (např. "najdi všechny knihy od autora Tolkiena", "vypiš knihy vydané nakladatelstvím Argo po roce 2000", "zobraz počet knih pro každý žánr").

## 5. Nastavení prostředí

Pro praktické ukázky budeme využívat **PostgreSQL a pgAdmin běžící v Docker kontejnerech**, které spustíme pomocí **samostatného souboru \`docker-compose.yml\` připraveného pro tuto část předmětu**.

* Ujistěte se, že máte **nainstalovaný Docker a Docker Compose**.
* Spusťte kontejnery pomocí `docker-compose up -d` (v adresáři s příslušným `docker-compose.yml`).
* Připojte se k databázi pomocí **pgAdminu** (běžícího na `http://localhost:5050`, detaily připojení budou specifikovány u daného `docker-compose.yml`) nebo jiného SQL klienta (připojení na `localhost:5433`).
* SQL skripty pro vytvoření struktury databáze a naplnění daty budou poskytnuty.

## 6. Struktura této části

1.  [Úvod do relačního modelu a PostgreSQL](./01-uvod/README.md).
2.  [Jazyk SQL: Definice dat (DDL)](./02-SQL-DDL/README.md) - `CREATE TABLE`, datové typy, omezení.
3.  [Jazyk SQL: Manipulace s daty (DML)](./03-SQL-DML/README.md) - `INSERT`, `UPDATE`, `DELETE`.
4.  [Jazyk SQL: Dotazování (DQL)](./04-SQL-DQL/README.md) - `SELECT`, `WHERE`, `ORDER BY`.
5.  [Jazyk SQL: Spojování tabulek](./05-SQL-JOIN/README.md) (`JOIN`).
6.  Jazyk SQL: Agregace (`GROUP BY`, `HAVING`, agregační funkce).
7.  Jazyk SQL: Poddotazy.
8.  Transakce, Indexy, Pohledy.

## 7. Předpoklady

* Pro praktické části: Nainstalovaný Docker a Docker Compose (viz sekce Předpoklady v úvodní hodině). Schopnost spustit připravené Docker prostředí.
