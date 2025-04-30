# Vývoj webových aplikací - Serverová část (Backend)

## 1. Cíle této části předmětu

Po absolvování této části byste měli:

* Rozumět principům **HTTP protokolu** a architektury **klient-server**.
* Chápat koncepty **RESTful API** a umět navrhovat a implementovat API endpointy.
* Ovládat základy webového frameworku **Flask** v Pythonu (jako příkladu moderního backend frameworku).
* Používat **Object-Relational Mapper (ORM)**, konkrétně **Flask-SQLAlchemy** (jako příklad ORM), pro efektivní práci s PostgreSQL databází z Pythonu.
* Spravovat změny databázového schématu pomocí migračních nástrojů (**Flask-Migrate** / Alembic jako příklad).
* Vytvářet **samodokumentující se API** pomocí **Flask-Smorest** (jako příklad nástroje pro OpenAPI) a specifikace OpenAPI (Swagger).
* Rozumět základům serializace a validace dat mezi API a databází (pomocí Marshmallow, jako příkladu validační knihovny).
* Získat povědomí o základních principech autentizace a autorizace v API.
* Být schopni vytvořit a spustit jednoduchý backend v kontejnerizovaném prostředí (Docker).

## 2. Klíčové koncepty

V této části se budeme zabývat následujícími tématy:

* **HTTP Protokol:** Metody (GET, POST, PUT, DELETE...), Stavové kódy (2xx, 4xx, 5xx), Hlavičky, Tělo požadavku/odpovědi.
* **REST Architektura:** Principy (Statelessness, Resources, Representations...), Návrh API endpointů.
* **Webové Frameworky:** Účel, MVC/MVP/MVVM a API-first přístupy. Zaměření na **Flask** jako konkrétní ukázku.
* **Flask:** Routování, Request/Response objekty, Blueprints (pro strukturování), Konfigurace.
* **ORM (Object-Relational Mapping):** Mapování objektů Pythonu na relační databázové tabulky. Použití **Flask-SQLAlchemy** (založené na SQLAlchemy) jako příkladu.
    * Definice modelů.
    * Vytváření session a dotazování databáze pomocí ORM.
    * Vztahy mezi modely v ORM.
* **Databázové Migrace:** Sledování a aplikace změn schématu databáze pomocí **Flask-Migrate** (nadstavba nad Alembic) jako příkladu.
* **Serializace a Validace:** Převod dat mezi Python objekty a formáty pro API (JSON). Použití **Marshmallow** (integrované ve Flask-Smorest) jako příkladu pro definici schémat a validaci.
* **API Dokumentace:** Automatické generování interaktivní dokumentace (Swagger UI/ReDoc) pomocí **Flask-Smorest** a OpenAPI specifikace jako příkladu.
* **Základy API Bezpečnosti:** (Úvod do) Autentizace (ověření identity) a Autorizace (ověření oprávnění).
* **Struktura projektu:** Organizace kódu backendové aplikace.

## 3. Používané nástroje (Příklady pro výuku)

Pro praktické ukázky a vysvětlení teoretických konceptů budeme v tomto kurzu používat následující technologie. Je důležité si uvědomit, že pro každý z těchto nástrojů existuje **značné množství alternativ** a výběr v reálném projektu závisí na specifických požadavcích.

* **Programovací jazyk:** **Python** (verze 3.12+). Alternativy: Java, C#, Node.js (JavaScript/TypeScript), Go, Ruby, PHP atd.
* **Webový Framework:** Jako příklad použijeme **Flask**. Alternativy v Pythonu: Django, FastAPI, Sanic. V jiných jazycích: Spring Boot (Java), ASP.NET Core (C#), Express/NestJS (Node.js), Gin (Go), Ruby on Rails, Laravel/Symfony (PHP).
* **API Framework/Dokumentace:** Jako příklad použijeme **Flask-Smorest** (který využívá OpenAPI/Swagger). Alternativy: FastAPI (má integrovanou podporu), různé knihovny pro generování Swagger/OpenAPI pro jiné frameworky.
* **ORM:** Jako příklad použijeme **Flask-SQLAlchemy** (založené na SQLAlchemy). Alternativy v Pythonu: Django ORM, Peewee, Pony ORM. V jiných jazycích: Hibernate/JPA (Java), Entity Framework Core (C#), Sequelize/TypeORM/Prisma (Node.js), GORM (Go), ActiveRecord (Ruby), Eloquent/Doctrine (PHP).
* **Migrace:** Jako příklad použijeme **Flask-Migrate** (založené na Alembic). Alternativy: Django Migrations, přímé použití Alembicu, nástroje specifické pro jiné ORM (např. TypeORM migrations, Prisma Migrate).
* **Serializace/Validace:** Jako příklad použijeme **Marshmallow** (integrované ve Flask-Smorest). Alternativy v Pythonu: Pydantic (používá např. FastAPI), Cerberus. V jiných jazycích: Jackson/Gson (Java), System.Text.Json/Newtonsoft.Json (C#), Zod/Joi (Node.js).
* **Databáze:** Jako příklad použijeme **PostgreSQL**. Alternativy: MySQL, MariaDB, SQLite, Oracle Database, Microsoft SQL Server.
* **Kontejnerizace:** **Docker** a **Docker Compose**. Alternativy: Podman, Kubernetes (pro orchestraci).
* **Vývojové prostředí:** **VS Code** s rozšířením **Dev Containers** (doporučeno) nebo manuální spuštění přes Docker Compose. Alternativy: PyCharm, IntelliJ IDEA, Eclipse, lokální instalace Pythonu a závislostí.
* **Verzování:** **Git**. Alternativy: Mercurial, SVN (méně časté pro nové projekty).
* **Testování API:** Nástroje jako **REST Client (VS Code)**, **Postman**, **Insomnia** nebo přímo Swagger UI generované frameworkem.

Budeme vycházet a rozšiřovat **šablonu projektu IS**, která je k dispozici v [repozitáři](https://github.com/TomasRacil/vyvoj-IS-sablona) , specificky její backendovou část postavenou na výše uvedených *příkladových* technologiích (Flask, Flask-SQLAlchemy atd.).

## 4. Praktický příklad: Backend pro IS Knihovny

V této sekci budeme implementovat **backendovou logiku a REST API** pro informační systém knihovny, jehož databázové schéma jsme navrhli v předchozí části o SQL. Konkrétně vytvoříme s použitím našich *příkladových* nástrojů (Flask-SQLAlchemy, Flask-Smorest):

* SQLAlchemy modely pro tabulky (`publishers`, `authors`, `books`, `book_authors` a přidáme model pro `users` pro autentizaci).
* Marshmallow schémata pro validaci a serializaci dat pro API, včetně schémat pro uživatele a přihlášení.
* API endpointy pomocí Flask-Smorest pro CRUD operace (Create, Read, Update, Delete) nad knihami, autory a vydavateli.
* Endpointy pro **registraci a přihlášení uživatelů**.
* Implementaci **autentizace pomocí JWT (JSON Web Tokens)** pro zabezpečení určitých endpointů.
* Základní **autorizaci** (např. rozlišení rolí uživatelů, pokud bude potřeba).
* Nastavíme databázové migrace pomocí Flask-Migrate pro správu změn schématu (včetně tabulky uživatelů).
* Využijeme automaticky generovanou Swagger dokumentaci, včetně popisu zabezpečení API.
* Nastavíme konzistentní **zpracování chyb**.

## 5. Nastavení prostředí

Budeme pracovat s **projektovou šablonou IS**, kterou jste si připravili. Pro vývoj backendu použijte jednu z následujících metod:

1.  **VS Code Dev Container (Doporučeno):**
    * Otevřete kořenový adresář šablony ve VS Code.
    * Použijte příkaz `Dev Containers: Reopen in Container...` a vyberte konfiguraci pro **backend**.
    * VS Code se připojí k běžícímu `backend` kontejneru se všemi potřebnými nástroji a rozšířeními. Terminál a debugování budou probíhat uvnitř kontejneru.
    * Ujistěte se, že máte vytvořený soubor `backend/.env` s konfigurací databáze.
    * Před prvním spuštěním spusťte: `flask db init` a `flask db upgrade`. Po změně modelů spusťte vždy migrace v terminálu kontejneru: `flask db upgrade` (nebo `alembic upgrade head`, pokud používáte přímo Alembic).
2.  **Manuální spuštění:**
    * Ujistěte se, že máte vytvořený soubor `backend/.env`.
    * Spusťte všechny služby pomocí `docker-compose up --build -d` v kořenovém adresáři šablony.
    * Pro spuštění migrací se připojte do backend kontejneru: `docker-compose exec backend bash` a poté spusťte `flask db upgrade`.

Backend bude typicky dostupný na `http://localhost:5000` a jeho API dokumentace na `http://localhost:5000/openapi`.

## 6. Struktura této části

1.  [Úvod do HTTP, REST API a webových frameworků (Flask jako příklad)](./01-HTTP-REST-Frameworky/README.md).
2.  [Základní Flask aplikace, routování, request/response](./02-Flask-Basics/README.md).
3.  [Nastavení Flask-SQLAlchemy, definice databázových modelů](./03-FlaskSQLAlchemy/README.md).
4.  [Databázové migrace s Flask-Migrate](./04-Migrations/README.md).
5.  Úvod do Flask-Smorest, Marshmallow schémata, Blueprints.
6.  Implementace CRUD endpointů pro jednu entitu (např. Vydavatelé).
7.  Implementace CRUD endpointů pro entity se vztahy (např. Knihy a Autoři).
8.  Zpracování chyb a validace vstupů.
9.  Autentizace uživatelů (Registrace, Přihlášení, JWT).
10. Autorizace a zabezpečení endpointů.


## 7. Předpoklady

* Základní znalost **Pythonu**.
* Znalost základů **SQL** a relačních databází (z předchozí sekce).
* Znalost základů **Gitu** a **Dockeru** (viz sekce `00-predpoklady`).
* Schopnost spustit a pracovat s poskytnutou šablonou projektu (včetně Dev Containers nebo manuálního spuštění).
