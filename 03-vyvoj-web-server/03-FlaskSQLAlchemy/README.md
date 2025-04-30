## 3. Nastavení Flask-SQLAlchemy, definice databázových modelů

V předchozích částech jsme se naučili komunikovat s databází pomocí čistého SQL. V reálných aplikacích je však často efektivnější pracovat s daty pomocí **Object-Relational Mapper (ORM)**. ORM nám umožňuje mapovat databázové tabulky na Python objekty a pracovat s daty objektově, aniž bychom museli psát většinu SQL dotazů ručně.

Pro Flask existuje populární rozšíření **Flask-SQLAlchemy**, které integruje výkonnou ORM knihovnu **SQLAlchemy** do Flasku.

### Co je ORM a proč ho používat?

* **Object-Relational Mapping (ORM):** Je to technika programování, která vytváří "most" mezi objektově orientovaným programovacím jazykem (jako Python) a relační databází. Umožňuje vývojářům pracovat s databázovými tabulkami a řádky jako s běžnými Python třídami a objekty.
* **Výhody ORM:**
    * **Abstrakce od SQL:** Nemusíte psát (většinu) SQL dotazů ručně. ORM je generuje za vás na základě operací s objekty.
    * **Produktivita:** Rychlejší vývoj, méně opakujícího se kódu pro CRUD operace.
    * **Přenositelnost:** Teoreticky usnadňuje přechod mezi různými typy SQL databází (i když rozdíly stále existují).
    * **Bezpečnost:** Pomáhá předcházet SQL injection útokům, protože typicky používá parametrizované dotazy.
    * **Objektově orientovaný přístup:** Lépe zapadá do objektově orientovaného návrhu aplikace.
* **Nevýhody ORM:**
    * **Abstrakce může být "děravá":** Někdy je potřeba rozumět generovanému SQL pro optimalizaci nebo řešení složitějších dotazů.
    * **Výkon:** Neoptimálně napsané ORM dotazy mohou být méně výkonné než ručně psané SQL.
    * **Složitost:** Naučit se efektivně používat ORM vyžaduje čas.

Pro většinu webových aplikací výhody ORM převažují nad nevýhodami.

### Nastavení Flask-SQLAlchemy

Integrace Flask-SQLAlchemy do naší aplikace (v rámci projektové šablony) zahrnuje několik kroků:

1.  **Instalace:** Knihovna by již měla být uvedena v `backend/requirements.txt` a nainstalována v našem Docker/Dev Container prostředí.
    ```text
    Flask-SQLAlchemy>=3.1.1
    SQLAlchemy>=2.0.0
    psycopg2-binary>=2.9.0 # Nebo jiný DBAPI ovladač
    ```
2.  **Konfigurace v `.env`:** V souboru `backend/.env` musíme mít definovanou připojovací URL k databázi v proměnné `DATABASE_URL`. Flask-SQLAlchemy ji automaticky použije.
    ```ini
    # backend/.env
    DATABASE_URL=postgresql://template_user:template_password@db:5432/template_db
    ```
3.  **Inicializace v aplikaci:** Vytvoříme instanci `SQLAlchemy` a propojíme ji s naší Flask aplikací. Toto se typicky dělá v souboru, kde inicializujeme rozšíření (např. `backend/app/extensions.py` nebo přímo v `backend/app/__init__.py`, pokud je aplikace menší). V naší šabloně to můžeme udělat takto:

    ```python
    # backend/app/db.py (Nový soubor pro inicializaci DB)
    from flask_sqlalchemy import SQLAlchemy

    # Vytvoření instance SQLAlchemy bez vazby na aplikaci
    # Aplikace bude přiřazena později pomocí init_app() v tovární funkci
    db = SQLAlchemy()
    ```python
    # backend/app/__init__.py (Nebo v tovární funkci create_app)
    import os
    from flask import Flask
    from .db import db # Import instance db
    from dotenv import load_dotenv

    load_dotenv() # Načtení .env

    def create_app():
        app = Flask(__name__)

        # Načtení konfigurace (včetně DATABASE_URL z .env)
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
        # Vypnutí sledování modifikací - doporučeno pro výkon
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        # Další konfigurace...
        # app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

        # Inicializace rozšíření SQLAlchemy s aplikací
        db.init_app(app)

        # Zde budeme později registrovat Blueprints (routy) a další

        return app
    ```
    Tento přístup (vytvoření `db` instance mimo tovární funkci a pak volání `db.init_app(app)`) umožňuje snadno importovat `db` objekt do jiných modulů (např. modelů) bez cyklických závislostí.

### Definice databázových modelů

Databázové modely jsou Python třídy, které reprezentují tabulky v naší databázi. Každá třída modelu dědí z `db.Model` (kde `db` je naše instance `SQLAlchemy`) a atributy třídy mapují na sloupce tabulky pomocí `db.Column`.

Vytvoříme modely pro naši knihovnu v souboru `backend/app/models.py` (nebo v dedikovaném adresáři `models/`).

```python
# backend/app/models.py (Příklad)
from app.db import db # Importujeme instanci db z našeho db.py

# Asociační tabulka pro vztah M:N mezi Books a Authors
# V SQLAlchemy se často definuje pomocí db.Table mimo třídy modelů
book_authors_table = db.Table('book_authors',
    db.Column('book_id', db.Integer, db.ForeignKey('books.book_id'), primary_key=True),
    db.Column('author_id', db.Integer, db.ForeignKey('authors.author_id'), primary_key=True)
)

class Publisher(db.Model):
    __tablename__ = 'publishers' # Explicitní název tabulky

    # Definice sloupců - mapování na atributy třídy
    publisher_id = db.Column(db.Integer, primary_key=True) # SERIAL se řeší automaticky pro Integer PK
    name = db.Column(db.String(100), unique=True, nullable=False)
    headquarters = db.Column(db.Text, nullable=True)

    # Definice vztahu 1:N (jeden vydavatel má mnoho knih)
    # 'books' je název atributu pro přístup ke knihám daného vydavatele
    # backref='publisher' vytvoří virtuální atribut 'publisher' na modelu Book
    # lazy=True znamená, že knihy se načtou až při prvním přístupu k atributu publisher.books
    books = db.relationship('Book', backref='publisher', lazy=True)

    def __repr__(self):
        # Textová reprezentace objektu (pro debugování)
        return f'<Publisher {self.publisher_id}: {self.name}>'

class Author(db.Model):
    __tablename__ = 'authors'

    author_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    birth_year = db.Column(db.Integer, nullable=True) # CHECK constraint se definuje v migraci nebo přímo v DB

    # Vztah M:N s knihami definovaný pomocí asociační tabulky 'book_authors_table'
    # 'books' je název atributu pro přístup ke knihám daného autora
    # secondary=book_authors_table říká SQLAlchemy, kterou tabulku použít pro spojení
    # backref='authors' vytvoří virtuální atribut 'authors' na modelu Book
    books = db.relationship('Book', secondary=book_authors_table, lazy='subquery',
                            backref=db.backref('authors', lazy=True))
    # lazy='subquery' načte autory/knihy pomocí samostatného SELECTu (často efektivnější než výchozí 'select')

    def __repr__(self):
        return f'<Author {self.author_id}: {self.first_name} {self.last_name}>'

class Book(db.Model):
    __tablename__ = 'books'

    book_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    publication_year = db.Column(db.Integer, nullable=True)
    isbn = db.Column(db.String(13), unique=True, nullable=True)
    page_count = db.Column(db.Integer, nullable=True) # CHECK constraint v migraci/DB
    price = db.Column(db.Numeric(8, 2), nullable=True) # CHECK constraint v migraci/DB

    # Cizí klíč na vydavatele
    publisher_id = db.Column(db.Integer, db.ForeignKey('publishers.publisher_id'), nullable=True)
    # Vztah k autorům je definován přes backref 'authors' z modelu Author

    def __repr__(self):
        return f'<Book {self.book_id}: {self.title}>'

```

**Vysvětlení:**

* **`db.Model`**: Základní třída pro všechny SQLAlchemy modely spravované přes Flask-SQLAlchemy.
* **`__tablename__`**: Explicitně definuje název tabulky v databázi. Pokud není uveden, odvodí se z názvu třídy.
* **`db.Column(...)`**: Definuje sloupec tabulky. Jako argumenty se předávají:
    * Datový typ (např. `db.Integer`, `db.String(100)`, `db.Text`, `db.Numeric(8, 2)`). Tyto typy se mapují na odpovídající typy v PostgreSQL.
    * Omezení jako klíčové argumenty: `primary_key=True`, `unique=True`, `nullable=False` (výchozí je `True`, tedy `NULL` povolen), `index=True` (vytvoří index).
    * `db.ForeignKey('nazev_tabulky.nazev_sloupce')`: Definuje cizí klíč.
* **`db.Table(...)`**: Používá se pro definici asociační tabulky pro M:N vztahy, pokud tato tabulka neobsahuje žádné další informace kromě cizích klíčů.
* **`db.relationship(...)`**: Definuje vztah mezi modely. Neodpovídá přímo sloupci v databázi, ale umožňuje snadnou navigaci mezi propojenými objekty v Pythonu (např. `autor.books` vrátí seznam knih daného autora, `kniha.publisher` vrátí objekt vydavatele dané knihy).
    * `backref`: Vytvoří zpětný odkaz na druhém konci vztahu.
    * `lazy`: Určuje, jak se načítají související objekty (např. `True`/'select' - načtou se až při přístupu, `'subquery'` - načtou se pomocí samostatného dotazu, `'joined'` - načtou se pomocí `JOIN`u v původním dotazu).
    * `secondary`: Určuje asociační tabulku pro M:N vztah.

**Mapování na DDL:**

Tyto modely odpovídají struktuře tabulek, kterou jsme definovali pomocí `CREATE TABLE` v předchozí sekci (SQL DDL). ORM nám umožňuje tuto strukturu reprezentovat a pracovat s ní pomocí Python tříd. Nástroje jako Flask-Migrate pak dokážou porovnat tyto modely s aktuálním stavem databáze a vygenerovat SQL příkazy (`ALTER TABLE` atd.) potřebné k jejich synchronizaci.

### Shrnutí

Nastavení Flask-SQLAlchemy zahrnuje instalaci, konfiguraci připojovacího řetězce a inicializaci rozšíření v rámci Flask aplikace. Definice modelů pak spočívá ve vytvoření Python tříd dědících z `db.Model`, kde atributy třídy s `db.Column` mapují na databázové sloupce a `db.relationship` definuje vztahy mezi modely. Toto ORM mapování nám umožní v dalších krocích pracovat s databází objektově.

---

### Samostatná práce

1.  **Vytvořte vlastní modely:**
    * Vezměte **specifikaci informačního systému**, kterou jste obdrželi pro váš semestrální projekt.
    * Na základě této specifikace **navrhněte a implementujte SQLAlchemy modely** (třídy dědící z `db.Model`) pro všechny potřebné entity vašeho systému.
    * Umístěte tyto modely do souboru `backend/app/models.py` ve vaší kopii **projektové šablony IS**.
    * Pro každý model definujte:
        * Odpovídající sloupce (`db.Column`) se správnými datovými typy (např. `db.Integer`, `db.String`, `db.Text`, `db.Boolean`, `db.DateTime`, `db.Numeric`).
        * Primární klíče (`primary_key=True`), obvykle pro sloupec `id`.
        * Potřebná omezení (`nullable=False`, `unique=True`).
        * Cizí klíče (`db.ForeignKey`) pro definování vztahů mezi tabulkami.
        * Vztahy (`db.relationship`) pro snadnou navigaci mezi propojenými objekty (včetně `back_populates` pro obousměrné vztahy a `secondary` pro M:N vztahy).
    * Nezapomeňte na začátek souboru importovat `db` z `app.db`.
    * *Cílem tohoto cvičení je pouze definovat modely v Pythonu. Vytvoření odpovídajících tabulek v databázi provedeme v další části pomocí migrací.*

*(Tento úkol je přípravou na další kroky vývoje vašeho projektu. Konzultujte svůj návrh modelů s vyučujícím.)*
