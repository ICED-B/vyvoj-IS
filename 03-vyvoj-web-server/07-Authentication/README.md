## 7. Autentizace uživatelů (Registrace, Přihlášení, JWT)

Většina reálných informačních systémů vyžaduje, aby se uživatelé před přístupem k určitým funkcím nebo datům **autentizovali** – tedy prokázali svou identitu. V této části se zaměříme na implementaci mechanismů pro registraci nových uživatelů, jejich přihlašování a následnou správu autentizovaného stavu pomocí JSON Web Tokens (JWT).

### Proč autentizace?

* **Identifikace uživatele:** Umožňuje systému vědět, *kdo* s ním interaguje.
* **Personalizace:** Na základě identity uživatele lze přizpůsobit obsah nebo funkce.
* **Bezpečnost:** Je prvním krokem k řízení přístupu (autorizaci) – pouze ověření uživatelé mohou mít přístup k určitým zdrojům.
* **Sledovatelnost (Auditing):** Umožňuje zaznamenávat, kdo provedl jaké akce v systému.

### Klíčové koncepty a procesy

1.  **Ukládání hesel:**
    * **Nikdy neukládejte hesla v čitelné podobě (plain text)!**
    * Používejte silné **hashovací funkce s přidáním "soli" (salt)**. Hash je jednosměrná funkce – z hashe nelze snadno získat původní heslo. Sůl je náhodný řetězec přidaný k heslu před hashováním, což zabraňuje útokům pomocí tzv. duhových tabulek (rainbow tables) na běžná hesla.
    * Knihovny jako `passlib` (s algoritmy jako `bcrypt` nebo `argon2`) toto usnadňují.
2.  **Registrace uživatele:**
    * Klient pošle údaje nového uživatele (typicky uživatelské jméno/email a heslo) na registrační endpoint (např. `POST /api/v1/auth/register`).
    * Server validuje vstupní data (např. zda email již neexistuje, zda heslo splňuje minimální požadavky).
    * Server vygeneruje hash hesla (včetně soli).
    * Server uloží údaje uživatele (uživatelské jméno/email a *hash hesla*) do databáze.
3.  **Přihlášení uživatele (Login):**
    * Klient pošle přihlašovací údaje (uživatelské jméno/email a heslo) na login endpoint (např. `POST /api/v1/auth/login`).
    * Server najde uživatele v databázi podle jména/emailu.
    * Pokud uživatel existuje, server porovná hash zadaného hesla s uloženým hashem v databázi.
    * Pokud se hashe shodují, uživatel je úspěšně autentizován.
4.  **Správa autentizovaného stavu (Session vs. Tokeny):**
    * **Session-based autentizace (stavová):** Server po úspěšném přihlášení vytvoří session ID, uloží ho do cookie u klienta a udržuje si informace o session na serveru. Pro každou další žádost klient posílá session ID a server ověřuje jeho platnost.
    * **Token-based autentizace (bezstavová - stateless):** Server po úspěšném přihlášení vygeneruje **token** (např. JWT), který zašle klientovi. Klient tento token ukládá (např. v `localStorage` nebo `sessionStorage`) a přikládá ho ke každému dalšímu požadavku na zabezpečené zdroje (typicky v `Authorization` HTTP hlavičce). Server token ověří bez nutnosti ukládat session stav. Toto je preferovaný přístup pro REST API, protože podporuje bezstavovost.

### JSON Web Tokens (JWT)

JWT (vyslovuje se "džot") je otevřený standard (RFC 7519) pro bezpečné předávání informací mezi stranami jako JSON objekt. JWT jsou digitálně podepsané (pomocí tajného klíče nebo páru veřejný/privátní klíč), což zaručuje jejich integritu a autenticitu.

**Struktura JWT:**

Token se skládá ze tří částí oddělených tečkami (`.`):

1.  **Header (Hlavička):** JSON objekt obsahující typ tokenu (`typ: "JWT"`) a použitý podpisový algoritmus (`alg: "HS256"`, `alg: "RS256"` atd.). Hlavička je Base64Url enkódovaná.
2.  **Payload (Datová část):** JSON objekt obsahující tzv. "claims" – informace o uživateli (např. ID uživatele, jméno, role) a metadata tokenu (např. čas expirace `exp`, čas vydání `iat`, vydavatel `iss`). Payload je také Base64Url enkódovaný.
    * **Registrované claims:** `iss` (issuer), `exp` (expiration time), `sub` (subject - ID uživatele), `aud` (audience).
    * **Veřejné claims:** Definované uživatelem, ale měly by být registrovány nebo obecně známé, aby se předešlo kolizím.
    * **Privátní claims:** Uživatelsky definované claims pro specifické potřeby aplikace.
3.  **Signature (Podpis):** Vytvoří se podepsáním enkódované hlavičky, enkódovaného payloadu, tajného klíče (pro symetrické algoritmy jako HS256) nebo privátního klíče (pro asymetrické algoritmy jako RS256) pomocí specifikovaného algoritmu. Podpis slouží k ověření, že token nebyl po cestě změněn a že byl vydán důvěryhodnou stranou.

**Příklad JWT:** `xxxxx.yyyyy.zzzzz`

**Výhody JWT:**

* **Bezstavovost (Stateless):** Server nemusí ukládat informace o session. Všechny potřebné informace jsou v tokenu.
* **Škálovatelnost:** Díky bezstavovosti je snadnější škálovat API na více serverů.
* **Flexibilita:** Lze použít napříč různými doménami a službami.
* **Bezpečnost (při správném použití):** Digitální podpis zajišťuje integritu a autenticitu. Důležité je používat HTTPS a bezpečně ukládat tajné/privátní klíče.

### Implementace s Flask-JWT-Extended

**Flask-JWT-Extended** je populární rozšíření pro Flask, které zjednodušuje práci s JWT.

1.  **Instalace:**
    ```text
    # backend/requirements.txt
    Flask-JWT-Extended>=4.0.0
    passlib[bcrypt]>=1.7.0 # Pro hashování hesel
    ```
2.  **Konfigurace v `app/__init__.py` (nebo `config.py`):**
    ```python
    # backend/app/__init__.py (v create_app)
    # ...
    from flask_jwt_extended import JWTManager
    # ...
    def create_app():
        app = Flask(__name__)
        # ... (ostatní konfigurace) ...
        # Načtení JWT_SECRET_KEY z proměnné prostředí. V produkci MUSÍ být nastaveno!
        # Pro generování silného klíče můžete použít např. Python:
        # import secrets
        # secrets.token_hex(32)
        app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY") 
        if not app.config["JWT_SECRET_KEY"] and app.debug: # Pouze pro vývoj, pokud není klíč nastaven
            app.logger.warning("JWT_SECRET_KEY není nastaven! Používám výchozí slabý klíč pro vývoj.")
            app.config["JWT_SECRET_KEY"] = "super-secret-default-key-change-me-in-production"
        elif not app.config["JWT_SECRET_KEY"] and not app.debug:
            raise ValueError("JWT_SECRET_KEY musí být nastaven v produkčním prostředí!")
            
        app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1) # Doba expirace přístupového tokenu
        app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30) # Doba expirace refresh tokenu (delší)
        
        jwt = JWTManager(app) # Inicializace JWTManageru
        # ...
        return app
    ```
    * `JWT_SECRET_KEY`: Tajný klíč používaný k podepisování a ověřování tokenů. **Musí být bezpečný a tajný!** Načtěte ho z proměnné prostředí.

3.  **Model `User`:**
    ```python
    # backend/app/models/user.py (nebo kde máte User model)
    from app.db import db
    from passlib.hash import pbkdf2_sha256 as sha256 # Nebo bcrypt, argon2
    from sqlalchemy.sql import func

    class User(db.Model):
        __tablename__ = "users"
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), unique=True, nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password_hash = db.Column(db.String(128), nullable=False) # Ukládáme hash
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

        @property
        def password(self):
            raise AttributeError('password is not a readable attribute') # Heslo by se nemělo číst přímo

        @password.setter
        def password(self, password):
            self.password_hash = sha256.hash(password)

        def check_password(self, password):
            return sha256.verify(password, self.password_hash)

        def __repr__(self):
            return f"<User {self.username}>"
    ```

4.  **Marshmallow schémata pro uživatele a přihlášení:**
    ```python
    # backend/app/schemas/user.py
    from marshmallow import Schema, fields, validate

    class UserBaseSchema(Schema):
        username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
        email = fields.Email(required=True)

    class UserRegisterSchema(UserBaseSchema):
        password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
     # Poznámka k politikám pro hesla:
    # Pro složitější validaci hesla (např. vyžadování velkých/malých písmen, číslic, speciálních znaků)
    # můžete vytvořit vlastní validační funkci nebo použít knihovnu jako `password_strength`.


    class UserSchema(UserBaseSchema): # Pro zobrazení dat uživatele (bez hesla)
        id = fields.Int(dump_only=True)
        created_at = fields.DateTime(dump_only=True)

    class UserLoginSchema(Schema):
        username_or_email = fields.Str(required=True) # Umožní přihlášení jménem nebo emailem
        password = fields.Str(required=True, load_only=True)
    ```

5.  **Endpointy pro registraci a přihlášení (v `backend/app/api/v1/auth.py`):**
    ```python
    # backend/app/api/v1/auth.py
    from flask.views import MethodView
    from flask_smorest import Blueprint, abort
    from flask_jwt_extended import create_access_token, create_refresh_token
    from app.db import db
    from app.models import User
    from app.schemas.user import UserRegisterSchema, UserLoginSchema, UserSchema
    from sqlalchemy.exc import IntegrityError
    from sqlalchemy import or_ # Pro vyhledávání podle jména NEBO emailu

    # Vytvoření nového blueprintu pro autentizaci
    blp = Blueprint("auth", __name__, description="Autentizační operace", url_prefix="/api/v1/auth")

    @blp.route("/register")
    class UserRegister(MethodView):
        @blp.arguments(UserRegisterSchema)
        @blp.response(201, UserSchema) # Vrátíme data nového uživatele (bez hesla)
        def post(self, user_data):
            """Registruje nového uživatele."""
            if db.session.execute(db.select(User).where(User.username == user_data["username"])).scalar_one_or_none():
                abort(409, message="Uživatel s tímto jménem již existuje.")
            if db.session.execute(db.select(User).where(User.email == user_data["email"])).scalar_one_or_none():
                abort(409, message="Uživatel s tímto emailem již existuje.")
            
            user = User(
                username=user_data["username"],
                email=user_data["email"]
            )
            user.set_password(user_data["password"]) # Nastaví hash hesla
            
            try:
                db.session.add(user)
                db.session.commit()
            except IntegrityError: # Pro případ, že by unikátnost selhala na úrovni DB
                db.session.rollback()
                abort(500, message="Chyba při ukládání uživatele.")
            except Exception as e:
                db.session.rollback()
                abort(500, message=str(e))
            return user

    @blp.route("/login")
    class UserLogin(MethodView):
        @blp.arguments(UserLoginSchema)
        def post(self, user_data):
            """Přihlásí uživatele a vrátí JWT tokeny."""
            login_identifier = user_data["username_or_email"]
            password = user_data["password"]

            user = db.session.execute(
                db.select(User).where(
                    or_(User.username == login_identifier, User.email == login_identifier)
                )
            ).scalar_one_or_none()

            if user and user.check_password(password):
                # Identita pro JWT může být ID uživatele
                access_token = create_access_token(identity=user.id)
                refresh_token = create_refresh_token(identity=user.id) # Volitelný refresh token
                return jsonify(access_token=access_token, refresh_token=refresh_token), 200
            
            abort(401, message="Nesprávné uživatelské jméno/email nebo heslo.")

    @blp.route("/refresh")
    class TokenRefresh(MethodView):
        @blp.doc(description="Získá nový přístupový token pomocí platného refresh tokenu.")
        @jwt_required(refresh=True) # Vyžaduje platný refresh token v Authorization hlavičce
        def post(self):
            current_user_id = get_jwt_identity() # Získá identitu uživatele z refresh tokenu
            new_access_token = create_access_token(identity=current_user_id)
            return jsonify(access_token=new_access_token), 200
    ```
    Nezapomeňte tento nový `AuthBlueprint` zaregistrovat v `app/__init__.py`!
    ```python
    # backend/app/__init__.py (v create_app)
    # ...
    # api = Api(app) # Již existuje
    # from .api.v1 import blp as ApiV1Blueprint # Již existuje
    # api.register_blueprint(ApiV1Blueprint) # Již existuje

    from .api.v1.auth import blp as AuthV1Blueprint # Nový import
    api.register_blueprint(AuthV1Blueprint) # Registrace auth blueprintu
    # ...
    ```

6.  **Zabezpečení endpointů:**
    Použijte dekorátor `@jwt_required()` z Flask-JWT-Extended k zabezpečení endpointů, které vyžadují autentizaci.
    ```python
    # backend/app/api/v1/books.py (Příklad)
    from flask_jwt_extended import jwt_required, get_jwt_identity
    # ...
    @blp.route("/books")
    class BookList(MethodView):
        @blp.response(200, BookSchema(many=True))
        @jwt_required() # Tento endpoint nyní vyžaduje platný access token
        def get(self):
            """Získá seznam všech knih (vyžaduje autentizaci)"""
            # current_user_id = get_jwt_identity() # Získá ID přihlášeného uživatele z tokenu
            # app.logger.info(f"Uživatel {current_user_id} žádá o seznam knih.")
            return db.session.execute(db.select(Book)).scalars().all()

        @blp.arguments(BookCreateSchema)
        @blp.response(201, BookSchema)
        @jwt_required() # I POST vyžaduje autentizaci
        def post(self, book_data):
            """Vytvoří novou knihu (vyžaduje autentizaci)"""
            # ... (logika pro vytvoření knihy) ...
            return book
    ```
    Klient musí nyní posílat JWT access token v `Authorization` hlavičce ve formátu `Bearer <token>`.

### Ukládání tokenů na straně klienta

Po úspěšném přihlášení nebo obnovení tokenu server zašle token(y) klientovi. Klient je musí bezpečně uložit a přikládat k dalším požadavkům. Běžné způsoby uložení v prohlížečích:

*   **`localStorage` / `sessionStorage`**: Snadno přístupné JavaScriptem, ale náchylné na XSS (Cross-Site Scripting) útoky. Pokud útočník dokáže spustit JS na vaší stránce, může tokeny ukrást.
*   **HTTP-only Cookies**: Bezpečnější proti XSS, protože nejsou přímo přístupné JavaScriptu. Server nastaví cookie s atributem `HttpOnly`. Prohlížeč je automaticky posílá s každým požadavkem na stejnou doménu. Je třeba zvážit ochranu proti CSRF (Cross-Site Request Forgery) útokům (např. pomocí `SameSite` atributu cookie).

Volba závisí na specifických požadavcích a bezpečnostních aspektech vaší aplikace. Pro REST API, kde klient může být i mobilní aplikace, je běžné posílat token v `Authorization` hlavičce a ukládat ho v `localStorage` nebo zabezpečeném úložišti mobilní aplikace, přičemž je kladen důraz na ochranu proti XSS.

### Příklad `.env` souboru

V kořenovém adresáři vašeho projektu (např. vedle `docker-compose.yml`) byste měli mít soubor `.env` (který **není** součástí Gitu – přidejte ho do `.gitignore`!). Může obsahovat například:

```env
# backend/.env (nebo v rootu projektu, pokud sdíleno)
FLASK_APP=run.py
FLASK_DEBUG=True
DATABASE_URL=postgresql://user:password@db:5432/mydatabase # Příklad pro Docker Compose
JWT_SECRET_KEY=vygenerujte_opravdu_silny_nahodny_klic_pomoci_secrets_token_hex
```

### Shrnutí

Autentizace je klíčovou součástí většiny API. Naučili jsme se, jak bezpečně ukládat hesla, implementovat registraci a přihlášení uživatelů. Použití JWT (s knihovnou jako Flask-JWT-Extended) nám umožňuje bezstavovou autentizaci, která je vhodná pro REST API. Zabezpečení endpointů pomocí `@jwt_required()` pak zajišťuje, že k citlivým datům a operacím mají přístup pouze ověření uživatelé.

---

### Cvičení (Samostatná práce)

1.  **Implementujte model `User`:**
    * V souboru `backend/app/models/user.py` (nebo `models.py`) vytvořte SQLAlchemy model `User` podle příkladu výše (s `username`, `email`, `password_hash`, `created_at` a metodami `set_password`, `check_password`).
    * Nezapomeňte importovat `db` a `sha256` (nebo jiný hashovací algoritmus).
2.  **Vytvořte schémata pro uživatele:**
    * V `backend/app/schemas/user.py` vytvořte schémata `UserRegisterSchema`, `UserSchema` a `UserLoginSchema` podle příkladů.
3.  **Přidejte migrace pro model `User`:**
    * Spusťte `flask db migrate -m "Add User model"` (v terminálu backend kontejneru).
    * Zkontrolujte vygenerovaný migrační skript.
    * Spusťte `flask db upgrade`.
4.  **Implementujte `AuthBlueprint`:**
    * Vytvořte adresář `backend/app/api/v1/auth/` a v něm soubor `__init__.py` (pro definici `blp`) a `routes.py` (nebo vše v jednom `auth.py` v `api/v1/`).
    * Implementujte endpointy `/register` a `/login` podle příkladu výše, s použitím vašich modelů a schémat.
    * Zaregistrujte tento nový blueprint v `app/__init__.py`.
5.  **Zabezpečte endpointy:**
    * Vyberte si alespoň jeden existující CRUD endpoint pro jinou entitu (např. pro knihy nebo autory) a zabezpečte jeho `POST`, `PUT` a `DELETE` metody pomocí dekorátoru `@jwt_required()`. `GET` endpointy můžete zatím nechat veřejné nebo také zabezpečit.
6.  **Otestujte:**
    * Pomocí REST Clienta nebo Swagger UI nejprve zaregistrujte nového uživatele.
    * Poté se pomocí jeho údajů přihlaste, abyste získali `access_token`.
    * Zkuste přistoupit k zabezpečenému endpointu bez tokenu (měli byste dostat chybu `401`).
    * Zkuste přistoupit k zabezpečenému endpointu s platným `access_token` v `Authorization: Bearer <token>` hlavičce.

*(Tento úkol vás provede kompletním procesem implementace základní autentizace.)*
