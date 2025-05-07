## 5. Úvod do Flask-Smorest, Marshmallow schémat a Blueprints

V předchozích částech jsme vytvořili základní Flask aplikaci a propojili ji s databází pomocí Flask-SQLAlchemy. Nyní se zaměříme na nástroje, které nám pomohou vytvářet robustní, dobře zdokumentovaná a strukturovaná REST API.

* **Flask-Smorest:** Rozšíření pro Flask, které usnadňuje tvorbu REST API. Integruje knihovny Marshmallow a webargs pro validaci a serializaci dat a automaticky generuje OpenAPI (dříve Swagger) specifikaci a dokumentaci pro vaše API.
* **Marshmallow:** Knihovna pro serializaci/deserializaci a validaci komplexních datových struktur (jako jsou naše ORM modely) do/z nativních Python datových typů (např. slovníků, které lze snadno převést na JSON).
* **Flask Blueprints:** Mechanismus ve Flasku pro organizaci aplikace. V kontextu API je často používáme pro **verzování API** (např. vytvoření blueprintu pro `/api/v1`, dalšího pro `/api/v2`), spíše než pro striktní rozdělení podle jednotlivých zdrojů.

### Proč tyto nástroje?

* **Automatická dokumentace API:** Flask-Smorest generuje interaktivní dokumentaci (Swagger UI / ReDoc) přímo z vašeho kódu. To usnadňuje pochopení a používání API jak pro frontend vývojáře, tak pro ostatní konzumenty.
* **Validace vstupních dat:** Automaticky ověřuje data přicházející v HTTP požadavcích (query parametry, JSON tělo) podle definovaných schémat (Marshmallow). Odpadá nutnost psát manuální validační kód.
* **Serializace výstupních dat:** Snadno definuje, jak mají být Python objekty (např. SQLAlchemy modely) převedeny na JSON formát pro odpověď API, včetně možnosti skrýt citlivá data nebo upravit strukturu.
* **Struktura a modularita (Verzování):** Blueprints pomáhají oddělit různé verze API, což usnadňuje údržbu a zpětnou kompatibilitu.

### Nastavení Flask-Smorest

1.  **Instalace:** Knihovna by již měla být v `backend/requirements.txt`:
    ```text
    flask-smorest>=0.42.0 # Nebo novější verze
    marshmallow>=3.0.0 # Závislost Flask-Smorest
    ```
2.  **Inicializace:** Flask-Smorest se typicky inicializuje spolu s Flask aplikací.
    ```python
    # backend/app/__init__.py (v create_app)
    import os
    from flask import Flask
    from flask_smorest import Api # Import Api z flask_smorest
    from .db import db
    # Předpokládáme existenci konfiguračního souboru nebo objektu
    # from .config import Config 
    # ... další importy ...

    def create_app():
        app = Flask(__name__)
        # Načtení konfigurace
        # app.config.from_object(Config) # Načte konfiguraci pro API (viz níže)
        # --- Příklad základní konfigurace přímo zde ---
        app.config["API_TITLE"] = "Knihovna API"
        app.config["API_VERSION"] = "v1" # Verze API
        app.config["OPENAPI_VERSION"] = "3.0.2"
        app.config["OPENAPI_URL_PREFIX"] = "/"
        app.config["OPENAPI_SWAGGER_UI_PATH"] = "/openapi" # Cesta pro Swagger UI
        app.config["OPENAPI_SWAGGER_UI_URL"] = "[https://cdn.jsdelivr.net/npm/swagger-ui-dist/](https://cdn.jsdelivr.net/npm/swagger-ui-dist/)"
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data.db') # Výchozí hodnota pro lokální vývoj
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        # -----------------------------------------

        db.init_app(app)
        # migrate.init_app(app, db) # Předpokládáme inicializaci Migrate jinde nebo zde

        # Inicializace Flask-Smorest Api
        api = Api(app)

        # Zde budeme registrovat Blueprints pro různé verze API
        from .api.v1 import blp as ApiV1Blueprint # Příklad blueprintu pro verzi v1
        api.register_blueprint(ApiV1Blueprint)

        # Případně další verze:
        # from .api.v2 import blp as ApiV2Blueprint
        # api.register_blueprint(ApiV2Blueprint)

        return app
    ```
    * Důležitá jsou nastavení `API_TITLE`, `API_VERSION`, `OPENAPI_VERSION` atd., která konfigurují generovanou dokumentaci. `API_VERSION` zde může označovat výchozí verzi.

### Marshmallow schémata: Definice datových struktur

Marshmallow schémata definují strukturu dat, která očekáváme na vstupu API (deserializace, validace) a která posíláme na výstupu (serializace). Jsou to Python třídy dědící z `marshmallow.Schema`.

**Základní principy:**

* Třídy dědí z `marshmallow.Schema`.
* Pole jsou definována pomocí `marshmallow.fields` (např. `fields.Str()`, `fields.Int()`).
* Běžné atributy polí:
    * `dump_only=True`: Pole je pouze ve výstupu (serializace), např. pro ID generovaná databází.
    * `load_only=True`: Pole je pouze na vstupu (deserializace), např. pro ID cizích klíčů při vytváření/aktualizaci vazeb nebo pro pole jako hesla.
    * `required=True`: Pole musí být na vstupu přítomno.
    * `allow_none=True`: Povolí hodnotu `null` (JSON `null`, Python `None`).
    * `validate`: Umožňuje přidat jednoduché validátory (např. `validate.Length(min=1)`). Detailnějšímu zpracování validačních chyb se budeme věnovat v další kapitole.
* **Vztahy mezi entitami (jednoduchý příklad):**
    * `fields.Nested(JineSchema, dump_only=True)`: Pro zobrazení vnořených dat související entity ve výstupu.
    * `fields.Int(load_only=True)`: Pro přijetí ID související entity na vstupu při vytváření/aktualizaci.

**Příklad: Schémata pro zdroj "Kniha" a související "Vydavatel"**

Zaměříme se na jeden hlavní zdroj, například "Knihu", která může mít vazbu na "Vydavatele".

```python
# backend/app/schemas/publisher.py (Nový soubor pro schémata vydavatelů)
from marshmallow import Schema, fields, validate

class PublisherBaseSchema(Schema):
    """Základní schéma pro vydavatele, používá se pro vnoření a jednoduchý výpis."""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    headquarters = fields.Str(allow_none=True)

class PublisherSchema(PublisherBaseSchema):
    """Schéma pro výstup vydavatele, včetně jeho ID."""
    publisher_id = fields.Int(dump_only=True) # Jen pro serializaci (výstup)

# backend/app/schemas/book.py (Nový soubor pro schémata knih)
from marshmallow import Schema, fields, validate
from .publisher import PublisherSchema # Import pro vnoření

class BookBaseSchema(Schema):
    """Základní schéma pro data knihy (společná pro vytváření a částečně pro výstup)."""
    title = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    publication_year = fields.Int(allow_none=True, validate=validate.Range(min=1000, max=2100))
    # Další pole jako isbn, page_count, price mohou být přidána zde...

class BookSchema(BookBaseSchema):
    """Kompletní schéma pro serializaci (výstup) knihy."""
    book_id = fields.Int(dump_only=True) # ID knihy, generované databází, pouze pro výstup
    
    # Příklad vnořeného schématu pro vydavatele (pouze pro čtení/výstup)
    # Zobrazí detaily vydavatele, pokud jsou načteny s knihou.
    publisher = fields.Nested(PublisherSchema(), dump_only=True, allow_none=True)

class BookCreateSchema(BookBaseSchema):
    """Schéma pro deserializaci (vstup) při vytváření nové knihy."""
    # Při vytváření knihy očekáváme ID existujícího vydavatele.
    # Toto pole bude použito pro načtení a přiřazení vydavatele k nové knize.
    publisher_id = fields.Int(load_only=True, allow_none=True) 
    # `load_only=True` znamená, že toto pole je očekáváno na vstupu,
    # ale nebude součástí výstupu, pokud použijeme toto schéma pro serializaci.

class BookUpdateSchema(Schema):
    """Schéma pro deserializaci (vstup) při aktualizaci existující knihy."""
    # Při aktualizaci nejsou žádná pole povinná. Klient pošle jen ta, která chce změnit.
    title = fields.Str(validate=validate.Length(min=1, max=255))
    publication_year = fields.Int(allow_none=True, validate=validate.Range(min=1000, max=2100))
    # Umožňuje aktualizovat i vydavatele knihy.
    publisher_id = fields.Int(load_only=True, allow_none=True)
```
* `BookSchema` se použije pro zobrazení detailů knihy, včetně vnořených informací o vydavateli.
* `BookCreateSchema` se použije při vytváření nové knihy. Očekává `title` a volitelně `publication_year` a `publisher_id`.
* `BookUpdateSchema` se použije pro aktualizaci. Žádné pole není povinné.

### Flask Blueprints pro verzování API

V našem případě budeme Blueprints používat primárně pro **oddělení verzí API**. Všechny endpointy pro verzi `v1` budou definovány v rámci jednoho blueprintu.

**Vytvoření Blueprintu pro verzi API:**

```python
# backend/app/api/v1/__init__.py (Soubor pro definici V1 API)
from flask_smorest import Blueprint

# Vytvoření instance Blueprint pro verzi v1
# První argument: název blueprintu (interní, např. 'api_v1')
# Druhý argument: __name__ (standardní Flask konvence)
# url_prefix: Nastaví prefix pro všechny routy v tomto blueprintu (např. /api/v1)
# description: Popis pro OpenAPI dokumentaci této verze API
blp = Blueprint(
    "api_v1_books", # Název specifický pro zdroje, aby se předešlo konfliktům, pokud máte více blueprintů
    __name__, 
    description="Operace s knihami pro API verze 1", 
    url_prefix="/api/v1"
)

# Importujeme soubory s routami (resources), které patří do této verze API a tohoto zdroje.
# Tyto soubory budou obsahovat definice tříd s metodami GET, POST atd.
# a budou používat @blp.route(...) dekorátor.
from . import books_routes # Předpokládá existenci souboru books_routes.py ve stejném adresáři (backend/app/api/v1/)

# Podobně byste mohli mít blueprinty pro další zdroje nebo verze:
# blp_authors = Blueprint("api_v1_authors", __name__, description="Autoři API v1", url_prefix="/api/v1")
# from . import authors_routes
```
* Každý blueprint může seskupovat endpointy pro specifický zdroj (např. `books_routes.py` pro knihy) nebo pro celou verzi API. Zde ukazujeme přístup, kde `blp` je pro `/api/v1` a pak importujeme specifické routy.

### Implementace CRUD endpointů pro zdroj "Kniha"

Flask-Smorest zjednodušuje definici endpointů pomocí dekorátorů. Následující příklad ukazuje CRUD operace pro náš zdroj "Kniha".

**Příklad souboru `backend/app/api/v1/books_routes.py`:**

```python
# backend/app/api/v1/books_routes.py
from flask.views import MethodView
from flask_smorest import abort # Pro vyvolání HTTP chyb
from app.db import db
from app.models import Book, Publisher # Předpokládáme existenci modelů Book a Publisher
from app.schemas.book import BookSchema, BookCreateSchema, BookUpdateSchema
from . import blp # Import blueprintu definovaného v backend/app/api/v1/__init__.py

@blp.route("/books") # Cesta pro seznam knih a vytváření nové knihy
class BookList(MethodView):
    @blp.response(200, BookSchema(many=True)) # Odpověď pro GET: seznam knih
    def get(self):
        """Získá seznam všech knih."""
        # Načte všechny knihy z databáze.
        # Pro produkční API by zde měla být paginace.
        return db.session.execute(db.select(Book).order_by(Book.title)).scalars().all()

    @blp.arguments(BookCreateSchema) # Vstup pro POST: data pro novou knihu
    @blp.response(201, BookSchema)   # Odpověď pro POST: nově vytvořená kniha
    def post(self, book_data):
        """Vytvoří novou knihu."""
        # book_data je slovník s validovanými daty z BookCreateSchema
        
        publisher_id = book_data.pop('publisher_id', None) # Získáme ID vydavatele, pokud bylo poskytnuto
        
        new_book = Book(**book_data) # Vytvoříme instanci modelu Kniha

        if publisher_id:
            publisher = db.session.get(Publisher, publisher_id)
            if not publisher:
                # Pokud vydavatel s daným ID neexistuje, přerušíme operaci s chybou 404.
                # Detailnějšímu zpracování chyb se věnuje další kapitola.
                abort(404, message=f"Vydavatel s ID {publisher_id} nenalezen.")
            new_book.publisher = publisher # Přiřadíme vydavatele ke knize
        
        try:
            db.session.add(new_book)
            db.session.commit()
        except Exception as e: # Velmi obecné zachycení chyby
            db.session.rollback()
            # V produkci bychom zde logovali chybu `e`
            # a vrátili obecnější chybovou zprávu.
            abort(500, message="Chyba při ukládání knihy do databáze.")
            
        return new_book

@blp.route("/books/<int:book_id>") # Cesta pro operace s konkrétní knihou
class BookResource(MethodView):
    @blp.response(200, BookSchema) # Odpověď pro GET: detail knihy
    def get(self, book_id):
        """Získá detail knihy podle jejího ID."""
        # Načte knihu nebo vrátí 404, pokud neexistuje.
        book = db.get_or_404(Book, book_id, description="Kniha nebyla nalezena.")
        return book

    @blp.arguments(BookUpdateSchema) # Vstup pro PUT: data pro aktualizaci knihy
    @blp.response(200, BookSchema)   # Odpověď pro PUT: aktualizovaná kniha
    def put(self, book_data, book_id):
        """Aktualizuje existující knihu."""
        book = db.get_or_404(Book, book_id, description="Kniha k aktualizaci nebyla nalezena.")
        
        publisher_id = book_data.pop('publisher_id', None) # Zpracování ID vydavatele

        # Aktualizujeme atributy knihy na základě poskytnutých dat
        for key, value in book_data.items():
            setattr(book, key, value)

        if publisher_id is not None: # Pokud je publisher_id explicitně poslán (i jako null)
            if publisher_id: # Pokud je to platné ID
                publisher = db.session.get(Publisher, publisher_id)
                if not publisher:
                    abort(404, message=f"Vydavatel s ID {publisher_id} pro aktualizaci nenalezen.")
                book.publisher = publisher
            else: # Pokud je publisher_id poslán jako null/None, odstraníme vazbu
                book.publisher = None
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message="Chyba při aktualizaci knihy.")
            
        return book

    @blp.response(204) # Odpověď pro DELETE: žádný obsah (úspěšné smazání)
    def delete(self, book_id):
        """Smaže knihu podle jejího ID."""
        book = db.get_or_404(Book, book_id, description="Kniha ke smazání nebyla nalezena.")
        
        try:
            db.session.delete(book)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, message="Chyba při mazání knihy.")
            
        return "" # Pro status 204 se nevrací žádné tělo odpovědi
```
* **`@blp.route(...)`**: Definuje cestu v rámci blueprintu.
* **`@blp.arguments(VstupniSchema)`**: Deserializuje a validuje tělo požadavku (nebo query parametry) pomocí Marshmallow schématu. Validovaná data jsou předána jako argument do view funkce. Pokud validace selže, Flask-Smorest automaticky vrátí chybu (typicky `422 Unprocessable Entity` - více o tom v další kapitole).
* **`@blp.response(status_kod, VystupniSchema)`**: Serializuje návratovou hodnotu view funkce pomocí Marshmallow schématu a nastaví HTTP stavový kód.
* Použití `db.get_or_404()` je jednoduchý způsob, jak získat objekt nebo automaticky vyvolat chybu 404, pokud není nalezen.
* Základní ošetření chyb při práci s databází je zde naznačeno, ale detailnější a robustnější strategie budou probrány v kapitole o zpracování chyb.

### Registrace verzovaného Blueprintu

Jak bylo ukázáno v sekci o inicializaci Flask-Smorest, tento `ApiV1Blueprint` (nebo `blp` z `books_routes` v našem příkladu, pokud by byl `blp` definován v `__init__.py` a importován do `books_routes.py` a následně registrován) zaregistrujeme v `create_app()`:

```python
# backend/app/__init__.py (část funkce create_app)
# ...
    api = Api(app)
    # Importujeme blueprint z našeho souboru definujícího API v1 pro knihy
    from .api.v1 import blp as ApiV1BooksBlueprint 
    api.register_blueprint(ApiV1BooksBlueprint)
    
    # Pokud byste měli další blueprinty pro v1 (např. pro autory)
    # from .api.v1 import blp_authors as ApiV1AuthorsBlueprint
    # api.register_blueprint(ApiV1AuthorsBlueprint)
# ...
```

### Shrnutí

Použitím Flask-Smorest, Marshmallow a Blueprints (pro verzování) můžeme vytvářet čistá, dobře strukturovaná, validovaná a automaticky zdokumentovaná REST API. Marshmallow definuje datové kontrakty (schémata), Blueprints organizují API podle verzí a zdrojů, a Flask-Smorest to vše spojuje pomocí dekorátorů a generuje OpenAPI dokumentaci. Tento dokument se zaměřil na základní nastavení a implementaci CRUD operací pro jeden zdroj.

---

### Samostatná práce

Následující úkoly aplikujte na **váš informační systém** definovaný v semestrálním projektu, s využitím **vašich SQLAlchemy modelů**, které jste vytvořili v předchozích cvičeních.

1.  **Vytvořte Marshmallow Schémata pro jeden klíčový model:**
    * Vyberte si **jeden hlavní model** z vašeho projektu (např. `Produkt`, `Uzivatel`, `Objednavka`).
    * V adresáři `backend/app/schemas/` vytvořte Python soubor (např. `product_schemas.py`) pro tento model, nebo rozšiřte soubor `backend/app/schemas.py`.
    * Definujte následující schémata pro váš model, podobně jako v příkladu s `BookSchema`:
        * **Základní schéma (`...Schema`)**: Pro serializaci (zobrazení) objektu. Použijte `dump_only=True` pro ID a případná další generovaná pole. Pokud má váš model jednoduchou vazbu na jiný model (např. Produkt má Kategorii), můžete zde ukázat `fields.Nested` pro zobrazení souvisejících dat (pro kategorii byste potřebovali jednoduché `CategorySchema`).
        * **Schéma pro vytváření (`...CreateSchema`)**: Pro deserializaci (vstup) při vytváření. Definujte `required=True` pro povinná pole. Pokud vytváříte vazbu na existující entitu (např. přiřazení produktu ke kategorii), použijte `fields.TYP_ID(load_only=True)`.
        * **Schéma pro aktualizaci (`...UpdateSchema`)**: Pro deserializaci (vstup) při aktualizaci. Zde obvykle žádné pole není `required=True`.
    * Zaměřte se na jeden dobře okomentovaný příklad schémat pro tento vybraný model.
2.  **Vytvořte soubor pro Routy vašeho modelu v API v1:**
    * V adresáři `backend/app/api/` vytvořte Python soubor pro váš zdroj (např. `products_routes.py`), nebo rozšiřte soubor `backend/app/api/routes.py`.
    * V tomto souboru importujte potřebné moduly: `MethodView`, `Blueprint` (nebo `blp` z `backend/app/api/__init__.py`), `abort`, `db`, váš model a vaše nově vytvořená schémata.
3.  **Implementujte CRUD Endpointy pro váš vybraný zdroj:**
    * V souboru s routami definujte třídy `...List` a `...Resource` dědící z `MethodView`.
    * Implementujte metody pro **všechny CRUD operace** pro váš zdroj, podobně jako v příkladu s `BookList` a `BookResource`:
        * `GET` (seznam) a `POST` (vytvoření) ve třídě `...List`.
        * `GET` (detail), `PUT` (aktualizace) a `DELETE` (smazání) ve třídě `...Resource`.
    * Použijte dekorátory `@blp.arguments` a `@blp.response` s vašimi vytvořenými schématy.
    * Pro interakci s databází použijte `db.session` a vaše SQLAlchemy modely. Použijte `db.get_or_404()`. Základní `try-except` bloky pro operace s `db.session` jsou dostačující pro tuto fázi.
4.  **Zaregistrujte Routy:**
    * Ujistěte se, že váš nový soubor s routami je importován v `backend/app/api/__init__.py` (pokud definujete `blp` přímo v souboru s routami a pak tento `blp` registrujete v `app/__init__.py`, tak tento krok odpadá pro `__init__.py` v `api/`).
    * Zajistěte, že hlavní blueprint pro API v1 (nebo specifický blueprint pro váš zdroj) je registrován v `app/__init__.py` u `Api` instance.
5.  **Otestujte:** Spusťte aplikaci a důkladně otestujte všechny CRUD operace pro váš implementovaný zdroj pomocí Swagger UI (`/openapi`) nebo REST Clienta. Ověřte, že data jsou správně vytvářena, čtena, aktualizována a mazána, a že schémata správně serializují a deserializují data.

*(Tento úkol vás provede implementací základního API pro jeden zdroj vašeho projektu s využitím všech probíraných nástrojů, se zaměřením na strukturu a základní funkčnost.)*
