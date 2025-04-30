## 4. Databázové migrace s Flask-Migrate

Jak se naše aplikace vyvíjí, často potřebujeme měnit strukturu databáze – přidávat nové tabulky, sloupce, měnit datové typy nebo odstraňovat nepoužívané části. Provádět tyto změny ručně (např. pomocí `ALTER TABLE` přímo v SQL klientovi) je problematické, zejména v týmovém prostředí nebo při nasazování na různé instance (vývojová, testovací, produkční).

* **Problémy s ručními změnami:**
    * **Nekonzistence:** Různá prostředí mohou mít mírně odlišnou strukturu databáze.
    * **Chybovost:** Ruční úpravy jsou náchylné k chybám.
    * **Neschopnost vrátit změny:** Obtížné vrátit databázi do předchozího stavu.
    * **Špatná sledovatelnost:** Není jasné, jaké změny byly kdy provedeny.
    * **Komplikované nasazení:** Jak zajistit, aby produkční databáze měla stejnou strukturu jako vývojová?

Řešením těchto problémů jsou **databázové migrace**.

### Co jsou databázové migrace?

Databázové migrace jsou způsob, jak **verzovat a spravovat změny schématu databáze pomocí kódu**. Místo přímých SQL příkazů definujeme změny v programovacím jazyce (nebo speciálním formátu) a nástroj pro migrace se postará o:

1.  **Sledování historie změn:** Každá změna schématu je reprezentována jako samostatný "migrační skript".
2.  **Generování SQL:** Nástroj porovná aktuální stav vašich modelů (v Pythonu) s aktuálním stavem databáze a vygeneruje potřebné SQL příkazy (`ALTER TABLE`, `CREATE TABLE` atd.) pro jejich synchronizaci.
3.  **Aplikování změn (Upgrade):** Spuštění migračních skriptů pro aktualizaci databáze na novější verzi schématu.
4.  **Vracení změn (Downgrade):** Možnost vrátit databázi na předchozí verzi schématu spuštěním "opačných" operací.

### Alembic a Flask-Migrate

* **Alembic:** Je výkonná a flexibilní knihovna pro databázové migrace napsaná autorem SQLAlchemy. Je to de facto standard pro migrace v ekosystému SQLAlchemy.
* **Flask-Migrate:** Je rozšíření pro Flask, které **integruje Alembic** do Flask aplikace. Poskytuje pohodlné příkazy přes Flask CLI (`flask db ...`) pro správu migrací, čímž zjednodušuje práci s Alembicem v kontextu Flasku. Pod kapotou stále používá Alembic.

### Nastavení Flask-Migrate v projektové šabloně

Předpokládáme, že Flask-Migrate je již v `backend/requirements.txt`:

```text
Flask-Migrate>=4.0.0
alembic>=1.9.0 # Závislost Flask-Migrate
```

Inicializace rozšíření v tovární funkci aplikace (`backend/app/__init__.py` nebo `create_app`):

```python
# backend/app/__init__.py (nebo v create_app)
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy # Přidáno pro typové hinty
from flask_migrate import Migrate     # Import Migrate
from .db import db                    # Import instance db
from dotenv import load_dotenv

load_dotenv()

# Instance Migrate - zatím bez vazby na app a db
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # Další konfigurace...

    db.init_app(app)
    # Inicializace Flask-Migrate s aplikací a instancí SQLAlchemy
    migrate.init_app(app, db)

    # Registrace Blueprints atd.

    return app
```

Flask-Migrate potřebuje znát vaši instanci `Flask` aplikace a instanci `Flask-SQLAlchemy` (`db`).

### Pracovní postup s migracemi (`flask db ...`)

Práce s migracemi pomocí Flask-Migrate obvykle zahrnuje následující kroky (spouštěné v terminálu v adresáři `backend/` nebo uvnitř backend kontejneru):

1.  **Inicializace (pouze jednou pro celý projekt):**
    ```bash
    flask db init
    ```
    * Tento příkaz vytvoří adresář `migrations/` a konfigurační soubor `alembic.ini` (pokud již neexistují v naší šabloně). Uloží si také aktuální revizi databáze (pokud již nějaká existuje a je prázdná). V naší šabloně by tyto soubory již měly být připraveny.

2.  **Vytvoření nebo úprava SQLAlchemy modelů:**
    * Upravíte své modely v `backend/app/models.py` (přidáte sloupec, změníte typ, přidáte tabulku...).

3.  **Vygenerování migračního skriptu:**
    ```bash
    flask db migrate -m "Stručný popis změny modelů"
    ```
    * Tento příkaz **porovná** vaše aktuální SQLAlchemy modely se **stavem schématu uloženým v databázi** (podle poslední aplikované migrace).
    * Pokud zjistí rozdíly, **vygeneruje nový migrační skript** v adresáři `migrations/versions/`. Tento skript obsahuje Python kód (používající Alembic API), který definuje operace pro upgrade (aplikování změn) a downgrade (vrácení změn).
    * `-m "..."` přidá popisnou zprávu k migraci.

4.  **Kontrola vygenerovaného skriptu:**
    * **Vždy** otevřete nově vygenerovaný soubor v `migrations/versions/` a **zkontrolujte**, zda vygenerovaný kód odpovídá vašim očekáváním. Alembic se snaží detekovat změny automaticky (`--autogenerate` je použito implicitně přes `flask db migrate`), ale nemusí vždy zachytit vše správně (např. přejmenování tabulky/sloupce, složitější změny `CHECK` omezení). Někdy je potřeba skript ručně upravit.

5.  **Aplikování migrace na databázi (Upgrade):**
    ```bash
    flask db upgrade
    ```
    * Tento příkaz spustí všechny migrační skripty, které ještě nebyly aplikovány na databázi (od poslední zaznamenané verze až po nejnovější - `head`). Tím se reálně změní struktura vaší databáze.

6.  **Vrácení migrace (Downgrade - volitelné):**
    ```bash
    flask db downgrade
    ```
    * Tento příkaz vrátí databázi o jednu verzi zpět spuštěním `downgrade()` funkce z poslední aplikované migrace. Používá se méně často, hlavně při vývoji nebo pokud se zjistí chyba v migraci.

**Další užitečné příkazy:**

* `flask db current`: Zobrazí aktuální revizi (poslední aplikovanou migraci) databáze.
* `flask db history`: Zobrazí historii všech migrací.
* `flask db stamp head`: Označí databázi jako aktuální (na poslední revizi) bez spouštění migrací (užitečné při prvotním nastavování existující databáze).

### Příklad migrace: Přidání sloupce `summary` do tabulky `books`

1.  **Upravíme model `backend/app/models.py`:**
    ```python
    # backend/app/models.py
    # ... (ostatní modely) ...

    class Book(db.Model):
        __tablename__ = 'books'
        # ... (stávající sloupce) ...
        price = db.Column(db.Numeric(8, 2), nullable=True)
        publisher_id = db.Column(db.Integer, db.ForeignKey('publishers.publisher_id'), nullable=True)

        # <<< NOVÝ SLOUPEC >>>
        summary = db.Column(db.Text, nullable=True) # Přidáme sloupec pro shrnutí/popis knihy

        def __repr__(self):
            return f'<Book {self.book_id}: {self.title}>'
    ```

2.  **Vygenerujeme migraci** (v terminálu backend kontejneru):
    ```bash
    flask db migrate -m "Add summary column to books table"
    ```
    * V adresáři `migrations/versions/` se vytvoří nový soubor, např. `migrations/versions/xxxxxxxxxxxx_add_summary_column_to_books_table.py`.

3.  **Zkontrolujeme skript** (`xxxxxxxxxxxx_add_summary_column_to_books_table.py`):
    ```python
    """Add summary column to books table

    Revision ID: xxxxxxxxxxxx
    Revises: yyyyyyyyyyyy # ID předchozí migrace
    Create Date: 2025-04-30 12:00:00.000000

    """
    from alembic import op
    import sqlalchemy as sa

    # revision identifiers, used by Alembic.
    revision = 'xxxxxxxxxxxx'
    down_revision = 'yyyyyyyyyyyy'
    branch_labels = None
    depends_on = None

    def upgrade():
        # ### commands auto generated by Alembic - please adjust! ###
        # Zkontrolujeme, zda je příkaz správný
        with op.batch_alter_table('books', schema=None) as batch_op:
            batch_op.add_column(sa.Column('summary', sa.Text(), nullable=True))
        # ### end Alembic commands ###

    def downgrade():
        # ### commands auto generated by Alembic - please adjust! ###
        # Zkontrolujeme, zda je příkaz správný
        with op.batch_alter_table('books', schema=None) as batch_op:
            batch_op.drop_column('summary')
        # ### end Alembic commands ###
    ```
    * V tomto případě Alembic správně detekoval přidání sloupce a vygeneroval odpovídající `add_column` pro `upgrade` a `drop_column` pro `downgrade`.

4.  **Aplikujeme migraci:**
    ```bash
    flask db upgrade
    ```
    * Tím se v databázi reálně přidá sloupec `summary` do tabulky `books`.

### Shrnutí

Databázové migrace pomocí Flask-Migrate (Alembic) jsou zásadním nástrojem pro správu vývoje databázového schématu v čase. Umožňují verzovat změny, automaticky generovat SQL a konzistentně aplikovat úpravy schématu napříč různými prostředími. Klíčem k úspěchu je pečlivá kontrola automaticky generovaných migračních skriptů.

---

### Samostatná práce

1.  **Aplikujte vlastní modely:**
    * Ujistěte se, že máte **definované vlastní SQLAlchemy modely** v souboru `backend/app/models.py` podle zadání vašeho semestrálního projektu (viz cvičení v předchozí sekci).
    * Pokud jste tak ještě neučinili, **inicializujte migrační prostředí** (pokud nebylo součástí šablony):
      ```bash
      flask db init
      ```
    * **Vygenerujte první migraci** pro vaše modely:
      ```bash
      flask db migrate -m "Initial database schema for project"
      ```
    * **Pečlivě zkontrolujte** vygenerovaný migrační skript v `migrations/versions/`. Ověřte, že obsahuje `op.create_table()` pro všechny vaše modely se správnými sloupci, typy, klíči a omezeními. Případně skript ručně upravte.
    * **Aplikujte migraci** pro vytvoření tabulek v databázi:
      ```bash
      flask db upgrade
      ```
    * Ověřte si vytvoření tabulek v databázi pomocí pgAdminu nebo jiného nástroje.

*(Tento úkol převede vaše Python modely na reálnou strukturu v databázi a je základem pro další vývoj API.)*
