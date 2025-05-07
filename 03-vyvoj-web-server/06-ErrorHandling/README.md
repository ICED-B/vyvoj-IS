## 6. Zpracování chyb a pokročilá validace vstupů

V předchozí kapitole jsme vytvořili základní API endpointy pomocí Flask-Smorest, Marshmallow a Blueprints. Robustní API se však pozná nejen podle toho, jak dobře funguje, když je vše v pořádku, ale také podle toho, jak elegantně a srozumitelně zvládá chybové stavy a nevalidní vstupy od klienta. V této části se zaměříme na strategie pro pokročilou validaci vstupních dat a konzistentní zpracování chyb.

### Proč je validace a zpracování chyb důležité?

* **Bezpečnost:** Validace vstupů je první linií obrany proti mnoha typům útoků. Zajišťuje, že do systému vstupují pouze očekávaná a bezpečná data.
* **Integrita dat:** Zabraňuje uložení nekonzistentních nebo nesmyslných dat do databáze.
* **Stabilita aplikace:** Správné ošetření chyb zabraňuje pádům aplikace a neočekávanému chování.
* **Uživatelská přívětivost (pro vývojáře API):** Jasné a konzistentní chybové zprávy usnadňují klientům (např. frontendovým vývojářům) pochopit, co se stalo špatně a jak problém opravit.
* **Ladění:** Dobré chybové hlášky a logování usnadňují vývojářům backendu identifikaci a opravu problémů.

### Typy chyb v API

Můžeme rozlišit několik kategorií chyb:

1.  **Chyby na straně klienta (Client-Side Errors - 4xx):**
    * **Nevalidní vstup:** Klient poslal data, která nesplňují očekávaný formát nebo omezení (např. chybějící povinné pole, nesprávný datový typ, hodnota mimo rozsah).
    * **Neoprávněný přístup (Unauthorized):** Klient není autentizován.
    * **Zakázaný přístup (Forbidden):** Klient je autentizován, ale nemá oprávnění.
    * **Nenalezený zdroj (Not Found):** Požadovaný zdroj na serveru neexistuje.
    * **Konflikt (Conflict):** Požadavek nemohl být dokončen kvůli konfliktu s aktuálním stavem zdroje (např. pokus o vytvoření záznamu s unikátním atributem, který již existuje).
2.  **Chyby na straně serveru (Server-Side Errors - 5xx):**
    * **Interní chyba serveru:** Neočekávaná chyba v logice aplikace, chyba připojení k databázi atd.
    * **Služba nedostupná:** Server je dočasně přetížen nebo v údržbě.

### Standardní HTTP stavové kódy pro chyby

HTTP stavové kódy jsou klíčové pro komunikaci výsledku požadavku. Pro chyby používáme především kódy `4xx` a `5xx`:

* **`400 Bad Request`**: Obecná chyba klienta (např. chybná syntaxe požadavku).
* **`401 Unauthorized`**: Klient musí být autentizován.
* **`403 Forbidden`**: Klient nemá přístupová práva.
* **`404 Not Found`**: Server nemůže najít požadovaný zdroj.
* **`409 Conflict`**: Konflikt s aktuálním stavem zdroje.
* **`422 Unprocessable Entity`**: Server rozumí požadavku, ale nemohl zpracovat obsažené instrukce (často pro sémantické chyby ve vstupních datech, např. když validace Marshmallow schématu selže). Flask-Smorest automaticky vrací tento kód při selhání validace `@blp.arguments`.
* **`500 Internal Server Error`**: Neočekávaná chyba na serveru.
* **`503 Service Unavailable`**: Server není připraven zpracovat požadavek.

### Pokročilá validace vstupů pomocí Marshmallow

Jak jsme viděli, Flask-Smorest používá Marshmallow schémata pro automatickou validaci vstupních dat (`@blp.arguments`). Pokud data neodpovídají schématu (chybějící `required` pole, nesprávné typy, selhání vestavěných validátorů), Flask-Smorest automaticky vrátí `422 Unprocessable Entity`.

Tělo této chybové odpovědi bude typicky JSON objekt obsahující detaily o validačních chybách, např.:
```json
{
  "errors": {
    "json": {
      "fieldName": ["Error message for this field."]
    }
  },
  "message": "Validation error.",
  "code": 422, // Flask-Smorest často přidává i kód do těla
  "status": "Unprocessable Entity" // a status
}
```

**Příklad rozšířené validace v Marshmallow schématu:**

Představme si, že chceme pro naši "Knihu" přidat pole pro email kontaktní osoby a hodnocení.

```python
# backend/app/schemas/book.py (doplnění existujícího nebo nového schématu)
from marshmallow import Schema, fields, validate

class BookReviewSchema(Schema): # Příklad nového schématu pro recenzi
    reviewer_email = fields.Email(required=True) # Validace emailového formátu
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5, error="Hodnocení musí být mezi 1 a 5."))
    comment = fields.Str(validate=validate.Length(max=1000))

# V existujícím BookCreateSchema nebo BookUpdateSchema můžeme přidat pole s validátory:
class BookCreateSchema(Schema): # Upraveno pro příklad
    title = fields.Str(
        required=True, 
        validate=[
            validate.Length(min=3, error="Název musí mít alespoň 3 znaky."),
            validate.Length(max=100, error="Název může mít maximálně 100 znaků.")
        ]
    )
    publication_year = fields.Int(
        allow_none=True, 
        validate=validate.Range(min=1500, max=2025, error="Rok vydání musí být mezi 1500 a 2025.")
    )
    isbn = fields.Str(
        validate=validate.Regexp(
            r"^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$",
            error="Neplatný formát ISBN."
        ),
        allow_none=True
    )
    # ... další pole ...
```
* `fields.Email()` automaticky validuje formát emailové adresy.
* `validate.Range(min, max, error="...")` kontroluje číselný rozsah a umožňuje vlastní chybovou zprávu.
* `validate.Length(min, max, error="...")` kontroluje délku řetězce. Lze zadat `min`, `max` nebo obojí.
* `validate.Regexp(regex_pattern, error="...")` umožňuje validaci pomocí regulárního výrazu.
* Marshmallow nabízí mnoho dalších vestavěných validátorů (např. `validate.OneOf` pro výběr z povolených hodnot).

### Vlastní validační logika a specifické chyby v endpointech

Někdy automatická validace nestačí a potřebujeme složitější logiku přímo v našich view funkcích (např. kontrola unikátnosti záznamu v databázi). Pro tyto případy použijeme funkci `abort()` z `flask_smorest`.

**Příklad: Kontrola unikátnosti názvu knihy při vytváření**

Upravíme `POST` metodu v `BookList` (z `backend/app/api/v1/books_routes.py`):

```python
# backend/app/api/v1/books_routes.py
# ... (importy jako dříve) ...
from sqlalchemy import func # Pro case-insensitive porovnání

@blp.route("/books")
class BookList(MethodView):
    # ... (metoda get zůstává) ...

    @blp.arguments(BookCreateSchema)
    @blp.response(201, BookSchema)
    def post(self, book_data):
        """Vytvoří novou knihu s kontrolou unikátnosti názvu."""
        
        # Kontrola unikátnosti názvu knihy (case-insensitive)
        # Předpokládáme, že 'title' je v book_data díky BookCreateSchema
        existing_book = db.session.execute(
            db.select(Book).filter(func.lower(Book.title) == func.lower(book_data["title"]))
        ).scalar_one_or_none()

        if existing_book:
            # Pokud kniha s tímto názvem již existuje, vrátíme 409 Conflict.
            # 'message' se objeví v těle JSON odpovědi.
            abort(409, message=f"Kniha s názvem '{book_data['title']}' již existuje.")

        publisher_id = book_data.pop('publisher_id', None)
        new_book = Book(**book_data)

        if publisher_id:
            publisher = db.session.get(Publisher, publisher_id)
            if not publisher:
                # Pro konzistenci můžeme použít abort i zde, i když get_or_404 by také fungovalo
                # pro získání vydavatele předem.
                abort(404, message=f"Vydavatel s ID {publisher_id} nenalezen.")
            new_book.publisher = publisher
        
        try:
            db.session.add(new_book)
            db.session.commit()
        except Exception: # Obecné zachycení, viz globální handlery níže
            db.session.rollback()
            # Místo přímého abort(500) zde, necháme to na globální error handler
            # pro konzistentní formátování a logování.
            # V tomto bodě by se měla vyvolat původní výjimka,
            # nebo specifická aplikační výjimka.
            raise # Znovu vyvoláme výjimku, aby ji mohl zachytit globální handler
            
        return new_book
```
* `db.get_or_404(Model, id)`: Jak jsme viděli v předchozí kapitole, toto je pohodlný způsob, jak získat objekt nebo automaticky vyvolat chybu 404, kterou Flask-Smorest správně zpracuje.
* `abort(http_status_code, message="...", errors={...})`: Ukončí požadavek a vrátí JSON odpověď s daným stavovým kódem a zprávou. Volitelně lze přidat i slovník `errors` pro detailnější informace.

### Globální Error Handlery pro konzistentní odpovědi

Pro zachytávání obecných výjimek (jako `SQLAlchemyError` nebo jiné neočekávané chyby) a pro zajištění konzistentního formátu všech chybových odpovědí můžeme definovat globální error handlery. Ty se typicky definují v `create_app` funkci.

```python
# backend/app/__init__.py (v create_app)
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException # Základní třída pro HTTP výjimky (včetně těch z abort())
from sqlalchemy.exc import SQLAlchemyError # Pro chyby databáze
import logging # Pro logování

def create_app():
    app = Flask(__name__)
    # ... (konfigurace, db.init_app, api.init_app, registrace blueprintů) ...

    # Nastavení základního logování, pokud ještě není konfigurováno jinde
    if not app.debug: # V produkci logovat do souboru nebo externí služby
        logging.basicConfig(level=logging.INFO) # Nebo ERROR

    # --- Globální Error Handlers ---
    @app.errorhandler(HTTPException) # Zachytí všechny HTTP výjimky (např. z abort() nebo get_or_404)
    def handle_http_exception(e):
        """Vrátí JSON odpověď pro HTTP výjimky."""
        # Flask-Smorest se již stará o formátování chyb z abort() a validačních chyb
        # do JSON podoby. Tento handler může sloužit jako fallback nebo pro
        # sjednocení formátu, pokud výjimka přichází z jiné části Flasku.
        # Pro chyby generované Flask-Smorest (včetně abort) je toto často již pokryto.
        # Můžeme zde ale zajistit, že i jiné HTTP výjimky budou mít podobný formát.
        response = e.get_response()
        response.data = jsonify({
            "error": {
                "code": e.code,
                "name": e.name,
                "message": e.description, # 'description' je standardní zpráva z HTTPException
            }
        })
        response.content_type = "application/json"
        return response

    @app.errorhandler(SQLAlchemyError) # Zachytí chyby z SQLAlchemy
    def handle_sqlalchemy_error(e):
        """Vrátí JSON odpověď pro SQLAlchemy chyby a provede rollback."""
        # Logujeme celou chybu pro interní diagnostiku
        app.logger.error(f"SQLAlchemy Error: {str(e)}", exc_info=True)
        # Důležité: vrátit (rollback) databázovou session do čistého stavu
        db.session.rollback()
        
        return jsonify({
            "error": {
                "code": 500, # Obecná chyba serveru
                "name": "DatabaseError",
                "message": "Nastala chyba při komunikaci s databází. Zkuste to prosím později.",
                # V produkci nikdy neposílejte detaily chyby `str(e)` klientovi
            }
        }), 500

    @app.errorhandler(Exception) # Zachytí všechny ostatní neočekávané Python výjimky
    def handle_generic_exception(e):
        """Vrátí JSON odpověď pro obecné neočekávané chyby."""
        # Logujeme celou chybu pro interní diagnostiku
        app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        
        # Pro neočekávané chyby je vždy bezpečnější vrátit obecnou 500
        return jsonify({
            "error": {
                "code": 500,
                "name": "InternalServerError",
                "message": "Na serveru nastala neočekávaná chyba. Zkuste to prosím později.",
            }
        }), 500
    
    return app
```
* **Pořadí:** Specifičtější handlery (`SQLAlchemyError`) by měly být definovány před obecnějšími (`Exception`). `HTTPException` je obvykle dostatečně specifický.
* **Logování:** Vždy logujte detaily serverových chyb (`app.logger.error(..., exc_info=True)` pro stack trace). Nikdy neposílejte citlivé detaily klientovi v produkčním prostředí.
* **`db.session.rollback()`:** Při chybách souvisejících s databází je klíčové vrátit zpět aktuální databázovou session.
* Flask-Smorest má vlastní mechanismy pro formátování chyb (zejména těch z `abort()` a validačních chyb z `@blp.arguments`). Cílem globálních handlerů je pokrýt případy, které Flask-Smorest nepokrývá (např. přímé `SQLAlchemyError`) a zajistit konzistentní strukturu i pro ně.

### Konzistentní formát chybových odpovědí

Je dobrým zvykem vracet všechny chybové odpovědi v konzistentním JSON formátu. Příklad, který jsme použili v globálních handlerech:

```json
{
  "error": {
    "code": 404, // HTTP status kód
    "name": "NotFound", // Typ chyby (může být název HTTP chyby nebo vlastní)
    "message": "Položka s ID 123 nebyla nalezena." // Popis pro uživatele/vývojáře
    // "details": { ... } // Volitelně další detaily, např. validační chyby pro 422
  }
}
```
Flask-Smorest se o toto částečně stará pro validační chyby (kde `errors` obsahuje detaily) a chyby z `abort()` (kde `message` je hlavní popis). Globální error handlery pomáhají tuto konzistenci rozšířit.

### Shrnutí

Efektivní zpracování chyb a validace vstupů jsou klíčové pro tvorbu spolehlivých a bezpečných API. Flask-Smorest a Marshmallow poskytují silné nástroje pro automatickou validaci a standardizované chybové odpovědi. Pro vlastní validační logiku můžeme použít `abort()`. Globální error handlery nám pomáhají zachytit neočekávané chyby, logovat je a vracet klientovi konzistentní a bezpečné chybové zprávy.

---

### Samostatná práce 

Následující úkoly aplikujte na **váš informační systém** a endpointy, které jste implementovali v předchozí části.

1.  **Rozšiřte validaci ve schématech:**
    * Projděte vaše Marshmallow schémata (zejména `...CreateSchema` a `...UpdateSchema`).
    * Přidejte vhodné validátory (`validate=...`) od Marshmallow pro co nejvíce polí (např. `validate.Length` pro řetězce, `validate.Range` pro čísla, `validate.Email` pokud máte emaily, `validate.OneOf` pro pole s omezeným výběrem hodnot). Přidejte vlastní chybové zprávy k validátorům (`error="Moje zpráva"`).
    * Otestujte, že API správně vrací `422 Unprocessable Entity` s vašimi definovanými chybovými zprávami a detaily chyb, pokud pošlete nevalidní data.
2.  **Implementujte kontrolu unikátnosti (pokud relevantní):**
    * Ve vašich `POST` (vytváření) endpointech přidejte logiku, která zkontroluje, zda záznam s určitým unikátním atributem (např. email uživatele, ISBN knihy, název kategorie) již neexistuje v databázi. Můžete použít `func.lower()` pro case-insensitive kontrolu, pokud je to vhodné.
    * Pokud existuje, použijte `abort(409, message="Záznam s tímto [atributem] již existuje.")`.
3.  **Implementujte a otestujte globální error handlery:**
    * V `backend/app/__init__.py` (v `create_app`) přidejte (nebo ověřte existenci) error handlery pro:
        * `SQLAlchemyError` (zajistěte logování, `db.session.rollback()` a vrácení JSON odpovědi s kódem `500`).
        * `Exception` (obecný fallback handler, zajistěte logování a vrácení JSON odpovědi s kódem `500`).
    * Pro otestování `SQLAlchemyError` můžete dočasně simulovat chybu (např. pokus o uložení dat, která porušují databázové omezení, které není pokryto Marshmallow validací, nebo dočasným přerušením spojení s DB, pokud to vaše testovací prostředí umožňuje).
    * Pro otestování obecné `Exception` můžete dočasně vložit `raise Exception("Testovací neočekávaná chyba")` do některé z vašich view funkcí.
4.  **Ověřte `404 Not Found`:**
    * Ujistěte se, že vaše `GET /zdroje/<id>`, `PUT /zdroje/<id>` a `DELETE /zdroje/<id>` endpointy správně vrací `404 Not Found` (pomocí `db.get_or_404()` nebo explicitního `abort(404, ...)`), pokud zdroj s daným ID neexistuje. Formát odpovědi by měl odpovídat vašim globálním handlerům nebo standardu Flask-Smorest.

*(Tyto úkoly vám pomohou vytvořit robustnější API, které lépe komunikuje chybové stavy a je odolnější vůči nevalidním vstupům a neočekávaným problémům.)*
