## 8. Autorizace a zabezpečení endpointů

V předchozí části jsme implementovali autentizaci, která nám umožňuje ověřit identitu uživatele. Nyní se posuneme o krok dál k **autorizaci**. Autorizace je proces, který určuje, zda má autentizovaný uživatel **oprávnění** provést určitou akci nebo přistoupit k určitému zdroji.

### Autentizace vs. Autorizace

Je důležité rozlišovat mezi těmito dvěma pojmy:

* **Autentizace (Authentication - Kdo jsi?):** Proces ověření identity uživatele. Dokazuje, že uživatel je skutečně tím, za koho se vydává (např. pomocí jména a hesla, tokenu). Výsledkem je typicky informace o identitě uživatele (např. user ID).
* **Autorizace (Authorization - Co smíš dělat?):** Proces určení, zda má již autentizovaný uživatel povolení provést požadovanou operaci nebo přistoupit k datům. Probíhá *po* úspěšné autentizaci.

Například: Uživatel se přihlásí (autentizace). Poté se pokusí smazat knihu. Systém musí zkontrolovat, zda má tento konkrétní uživatel oprávnění mazat knihy (autorizace).

### Běžné autorizační vzory

1.  **Řízení přístupu na základě rolí (Role-Based Access Control - RBAC):**
    * Uživatelům jsou přiřazeny **role** (např. "běžný uživatel", "editor", "administrátor").
    * Oprávnění jsou definována pro jednotlivé role (např. "editor" smí vytvářet a upravovat knihy, "administrátor" smí mazat uživatele).
    * Při požadavku se ověří role uživatele a zda tato role má potřebné oprávnění.
    * Toto je velmi častý a relativně jednoduchý model.

2.  **Řízení přístupu na základě atributů (Attribute-Based Access Control - ABAC):**
    * Oprávnění se udělují na základě atributů uživatele, atributů zdroje, ke kterému se přistupuje, a kontextu prostředí (např. čas, lokalita).
    * Pravidla jsou komplexnější (např. "uživatel z oddělení X smí upravovat dokumenty typu Y v pracovní době").
    * Flexibilnější, ale složitější na implementaci a správu.

3.  **Řízení přístupu na základě seznamů řízení přístupu (Access Control Lists - ACL):**
    * Pro každý zdroj je definován seznam uživatelů (nebo skupin/rolí) a jejich konkrétních oprávnění k tomuto zdroji.
    * Velmi granulární, ale může být náročné na správu u velkého počtu zdrojů a uživatelů.

V našem příkladu se zaměříme na jednoduché **RBAC**.

### Implementace RBAC s Flask-JWT-Extended

Abychom mohli implementovat RBAC, potřebujeme:

1.  **Uložit roli uživatele:** Přidáme sloupec `role` do našeho modelu `User`.
2.  **Zahrnout roli do JWT:** Při vytváření access tokenu přidáme roli uživatele do "claims" (datové části) tokenu.
3.  **Vytvořit dekorátory pro kontrolu rolí:** Nebo použít vestavěné mechanismy Flask-JWT-Extended pro ověření claims.

#### 1. Úprava modelu `User`

```python
# backend/app/models/user.py (nebo kde máte User model)
from app.db import db
from passlib.hash import pbkdf2_sha256 as sha256
from sqlalchemy.sql import func
import enum # Pro definici výčtového typu rolí

# Definice rolí pomocí Enumu (lepší než prosté řetězce)
class UserRole(enum.Enum):
    USER = "user" # Běžný uživatel
    EDITOR = "editor" # Uživatel s právy editace
    ADMIN = "admin" # Administrátor

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Nový sloupec pro roli uživatele
    # Použijeme db.Enum pro zajištění platných hodnot v databázi
    # default=UserRole.USER zajistí, že noví uživatelé budou mít roli 'user'
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.USER)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute') # Heslo by se nemělo číst přímo

    @password.setter
    def password(self, password):
        self.password_hash = sha256.hash(password)

    def check_password(self, password):
        return sha256.verify(password, self.password_hash)
    def __repr__(self):
        return f"<User {self.username} (Role: {self.role.value})>"
```
*Nezapomeňte po této změně modelu **vygenerovat a aplikovat databázovou migraci**!*
  ```bash
  # V terminálu backend kontejneru:
  flask db migrate -m "Add role to User model"
  flask db upgrade
  ```

#### 2. Úprava Marshmallow schémat (volitelné, pro zobrazení role)

Pokud chcete roli zobrazovat v API odpovědích nebo ji nastavovat při registraci (což by mělo být omezeno), upravte schémata.

```python
# backend/app/schemas/user.py
from marshmallow import Schema, fields, validate
# from app.models.user import UserRole # Import enumu, pokud ho chceme použít ve schématu

class UserBaseSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)

class UserRegisterSchema(UserBaseSchema):
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    # Roli bychom typicky nenastavovali při registraci běžným uživatelem,
    # ale administrátorem, nebo by měla výchozí hodnotu.
    # role = fields.Enum(UserRole, by_value=True, load_default=UserRole.USER) 

class UserSchema(UserBaseSchema): # Pro zobrazení dat uživatele
    id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    role = fields.Str(dump_only=True) # Nebo fields.Enum(UserRole, by_value=True, dump_only=True)
                                     # by_value=True zajistí, že se serializuje hodnota enum (např. "user")
                                     # místo názvu členu enum (např. "UserRole.USER")

class UserLoginSchema(Schema):
    username_or_email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
```

#### 3. Zahrnutí role do JWT

Flask-JWT-Extended umožňuje přidat vlastní informace (claims) do JWT.

```python
# backend/app/__init__.py (v create_app, kde inicializujete JWTManager)
# ...
from flask_jwt_extended import JWTManager
from app.models import User # Import modelu User
# ...

def create_app():
    app = Flask(__name__)
    # ... (konfigurace) ...
    jwt = JWTManager(app)

    # Callback funkce pro přidání vlastních claims do access tokenu
    @jwt.user_claims_loader
    def add_claims_to_access_token(identity):
        # 'identity' je to, co jsme předali funkci create_access_token (typicky user.id)
        user = db.session.get(User, identity) # Načteme uživatele z DB
        if user:
            return {"role": user.role.value} # Přidáme roli jako claim
        return {} # Pokud uživatel neexistuje, vrátíme prázdné claims

    # Můžete také definovat user_lookup_loader pro automatické načítání objektu User
    # @jwt.user_lookup_loader
    # def user_lookup_callback(_jwt_header, jwt_data):
    #     identity = jwt_data["sub"] # 'sub' je standardní claim pro subject (user ID)
    #     return db.session.get(User, identity)
    # ...
    return app
```
Nyní bude každý nově vytvořený access token obsahovat claim `role` s hodnotou role daného uživatele (např. `"user"`, `"admin"`).

#### 4. Vytvoření dekorátoru pro kontrolu rolí

Můžeme vytvořit vlastní dekorátor, který ověří, zda má uživatel požadovanou roli.

```python
# backend/app/utils/decorators.py (Nový soubor)
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask_smorest import abort

def roles_required(required_roles):
    """
    Dekorátor pro ochranu endpointů na základě uživatelských rolí.
    Vyžaduje, aby byl uživatel autentizován pomocí JWT.
    :param required_roles: Seznam nebo n-tice názvů rolí (string),
                           které mají přístup k endpointu.
    """
    if not isinstance(required_roles, (list, tuple)):
        required_roles = [required_roles] # Převedeme na seznam, pokud je jen jedna role

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request() # Ověří, že platný JWT je přítomen
            claims = get_jwt() # Získá všechny claims z JWT
            user_role = claims.get("role")

            if user_role not in required_roles:
                abort(403, message=f"Přístup odepřen. Vyžadována jedna z rolí: {', '.join(required_roles)}.")
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Příklad použití:
# from app.utils.decorators import roles_required
# from app.models.user import UserRole # Import enum UserRole
#
# @blp.route("/admin/resource")
# class AdminResource(MethodView):
#     @jwt_required() # Nejprve ověříme, že je token platný
#     @roles_required(UserRole.ADMIN.value) # Pak ověříme roli (použijeme .value pro string)
#     def get(self):
#         return {"message": "Toto je zdroj pouze pro administrátory."}
#
# @blp.route("/editor/resource")
# class EditorResource(MethodView):
#     @jwt_required()
#     @roles_required([UserRole.ADMIN.value, UserRole.EDITOR.value]) # Přístup pro admina NEBO editora
#     def post(self, data):
#         return {"message": "Toto mohou vytvářet editoři a administrátoři."}

```
* **`verify_jwt_in_request()`**: Zajistí, že požadavek obsahuje platný JWT. Pokud ne, vyvolá chybu (kterou zachytí error handler Flask-JWT-Extended a vrátí typicky `401 Unauthorized`).
* **`get_jwt()`**: Získá dekódovaný payload (claims) z JWT.
* **`claims.get("role")`**: Získá hodnotu našeho vlastního claimu `role`.
* **`abort(403, ...)`**: Pokud uživatel nemá požadovanou roli, vrátíme `403 Forbidden`.

**Alternativa s `current_user` (pokud používáte `user_lookup_loader`):**

Pokud jste v konfiguraci JWTManageru nastavili `@jwt.user_lookup_loader`, Flask-JWT-Extended automaticky načte objekt uživatele a zpřístupní ho přes `current_user`. Pak můžete role kontrolovat přímo z tohoto objektu.

```python
# from flask_jwt_extended import current_user, jwt_required
#
# @blp.route("/admin/resource")
# class AdminResource(MethodView):
#     @jwt_required()
#     def get(self):
#         if current_user.role != UserRole.ADMIN:
#             abort(403, message="Přístup odepřen. Pouze pro administrátory.")
#         return {"message": "Toto je zdroj pouze pro administrátory."}
```

### Zabezpečení endpointů na základě rolí

Nyní můžeme použít náš dekorátor `@roles_required()` (nebo přístup s `current_user`) k zabezpečení konkrétních metod v našich API endpointech.

**Příklad: Zabezpečení mazání knih pouze pro administrátory**

```python
# backend/app/api/v1/books.py
from flask.views import MethodView
from flask_smorest import abort
from flask_jwt_extended import jwt_required # Import jwt_required
from app.db import db
from app.models import Book, Publisher, Author
from app.schemas.book import BookSchema, BookCreateSchema, BookUpdateSchema
from app.utils.decorators import roles_required # Import našeho dekorátoru
from app.models.user import UserRole # Import enum UserRole
from . import blp

# ... (GET a POST pro BookList mohou být veřejné nebo vyžadovat jen @jwt_required()) ...

@blp.route("/books/<int:book_id>")
class BookResource(MethodView):
    @blp.response(200, BookSchema)
    def get(self, book_id):
        """Získá detail knihy podle ID"""
        return db.get_or_404(Book, book_id)

    @blp.arguments(BookUpdateSchema)
    @blp.response(200, BookSchema)
    @jwt_required() # Vyžaduje přihlášení
    @roles_required([UserRole.ADMIN.value, UserRole.EDITOR.value]) # Povoleno pro adminy a editory
    def put(self, book_data, book_id):
        """Aktualizuje existující knihu."""
        # ... (logika aktualizace) ...
        book = db.get_or_404(Book, book_id)
        for key, value in book_data.items():
            if hasattr(book, key) and key not in ['publisher_id', 'author_ids']:
                setattr(book, key, value)
        # ... (zpracování publisher_id a author_ids) ...
        db.session.commit()
        return book

    @blp.response(204)
    @jwt_required() # Vyžaduje přihlášení
    @roles_required(UserRole.ADMIN.value) # Pouze administrátor může mazat
    def delete(self, book_id):
        """Smaže knihu (pouze pro administrátory)."""
        book = db.get_or_404(Book, book_id)
        db.session.delete(book)
        db.session.commit()
        return ""
```

### Další aspekty zabezpečení

* **HTTPS:** V produkčním prostředí **vždy** používejte HTTPS pro veškerou komunikaci s API, aby se zabránilo odposlechu tokenů a dat.
* **Silné `JWT_SECRET_KEY`:** Udržujte tento klíč v tajnosti a dostatečně silný.
* **Krátká životnost Access Tokenů:** Nastavte rozumnou dobu expirace pro access tokeny (např. 15 minut až 1 hodina) a používejte refresh tokeny pro získání nových access tokenů bez nutnosti opětovného zadávání hesla.
* **Revokace tokenů (Token Revocation):** Pro případy, kdy potřebujete token zneplatnit před jeho expirací (např. při odhlášení, změně hesla, kompromitaci), Flask-JWT-Extended nabízí mechanismy pro "blacklistování" tokenů (vyžaduje další úložiště, např. Redis).
* **Omezení počtu pokusů o přihlášení (Rate Limiting):** Pro ochranu proti brute-force útokům na hesla.
* **Validace vstupů:** Důsledná validace všech vstupů od klienta (již probráno).
* **Ochrana proti běžným webovým zranitelnostem:** XSS, CSRF (méně relevantní pro čistě bezstavová API, ale důležité u webových aplikací obecně).

### Shrnutí

Autorizace určuje, co autentizovaný uživatel smí dělat. Implementace RBAC pomocí rolí v uživatelském modelu, zahrnutí těchto rolí do JWT claims a následná kontrola pomocí vlastních dekorátorů nebo funkcí Flask-JWT-Extended nám umožňuje efektivně zabezpečit jednotlivé endpointy API. Vždy pamatujte na další aspekty bezpečnosti, jako je HTTPS a správa životnosti tokenů.

---

### Cvičení (Samostatná práce)

1.  **Přidejte roli do modelu `User`:**
    * Upravte váš model `User` (v `backend/app/models/user.py` nebo `models.py`) tak, aby obsahoval sloupec `role` typu `db.Enum(UserRole)` s výchozí hodnotou `UserRole.USER`, jak bylo ukázáno v příkladu. Definujte enum `UserRole` (např. `USER`, `ADMIN`).
    * Vygenerujte a aplikujte databázovou migraci pro tuto změnu.
2.  **Upravte registraci a JWT:**
    * Při registraci (`POST /api/v1/auth/register`) zajistěte, aby noví uživatelé měli automaticky přiřazenou roli `USER`.
    * Upravte konfiguraci Flask-JWT-Extended (`@jwt.user_claims_loader`) tak, aby role uživatele byla zahrnuta do access tokenu.
3.  **Vytvořte administrátorský účet (manuálně):**
    * Po aplikaci migrace se připojte k databázi (např. přes pgAdmin nebo `flask shell`) a manuálně změňte roli jednoho z vašich testovacích uživatelů na `ADMIN`.
    * Příklad SQL: `UPDATE users SET role = 'admin' WHERE username = 'vas_admin_username';`
4.  **Implementujte dekorátor `@roles_required`:**
    * Vytvořte soubor `backend/app/utils/decorators.py` (nebo podobný) a implementujte dekorátor `@roles_required` podle příkladu.
5.  **Zabezpečte endpointy na základě rolí:**
    * Vyberte si endpointy pro vytváření (`POST`), aktualizaci (`PUT`) a mazání (`DELETE`) pro alespoň **dva různé zdroje** ve vašem API (např. knihy a vydavatele).
    * Zabezpečte tyto operace tak, aby je mohl provádět pouze uživatel s rolí `ADMIN`. Použijte `@jwt_required()` a váš nový dekorátor `@roles_required(UserRole.ADMIN.value)`.
    * `GET` endpointy (pro čtení seznamu a detailu) mohou zůstat dostupné pro všechny přihlášené uživatele (stačí `@jwt_required()`) nebo i pro nepřihlášené (bez dekorátoru).
6.  **Otestujte autorizaci:**
    * Přihlaste se jako běžný uživatel (s rolí `USER`) a zkuste provést operaci vyhrazenou pro administrátora (např. smazat knihu). Měli byste dostat chybu `403 Forbidden`.
    * Přihlaste se jako administrátor a ověřte, že máte k těmto operacím přístup.

*(Tento úkol vás provede implementací základní autorizace na základě rolí.)*
