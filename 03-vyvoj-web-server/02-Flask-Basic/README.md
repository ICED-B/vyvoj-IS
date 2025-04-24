## 2. Základní Flask aplikace, routování, request/response

V této části se zaměříme na základy práce s webovým frameworkem Flask. Naučíme se vytvořit jednoduchou aplikaci, definovat cesty (routy), kterými bude aplikace reagovat na různé URL adresy a HTTP metody, a jak zpracovávat příchozí požadavky a odesílat odpovědi.

### Minimální Flask aplikace

Vytvoření základní Flask aplikace je velmi jednoduché. Typicky stačí následující kód (např. v souboru `app.py` nebo `main.py`):

```python
# Import třídy Flask z knihovny flask
from flask import Flask

# Vytvoření instance aplikace Flask
# __name__ je speciální proměnná v Pythonu, která zde pomáhá Flasku
# určit kořenový adresář aplikace pro hledání šablon a statických souborů.
app = Flask(__name__)

# Definice první routy (viz níže)
@app.route('/') # Dekorátor pro registraci view funkce pro URL '/'
def hello_world():
    """Jednoduchá view funkce, která vrátí text."""
    return 'Hello, World!'

# Podmínka, která zajistí, že vývojový server se spustí,
# jen pokud je tento skript spuštěn přímo (ne při importu).
# V Dockeru se aplikace typicky spouští jinak (např. přes 'flask run' nebo gunicorn/uvicorn).
if __name__ == '__main__':
    app.run(debug=True) # Spustí vestavěný vývojový server Flasku v debug módu
```

* **`app = Flask(__name__)`**: Vytvoří instanci Flask aplikace.
* **`@app.route('/')`**: Toto je **dekorátor**, který říká Flasku, že funkce definovaná pod ním (`hello_world`) má zpracovávat požadavky na kořenovou URL adresu (`/`) webu.
* **`hello_world()`**: Toto je tzv. **view funkce** (nebo handler). Je to běžná Python funkce, která přijímá požadavek a vrací odpověď, která se má odeslat klientovi. V tomto případě vrací jednoduchý textový řetězec.

### Routování (Routing)

Routování je proces mapování URL adres a HTTP metod na konkrétní view funkce ve vaší aplikaci. Flask používá pro definici rout dekorátor `@app.route()`.

**Základní syntaxe dekorátoru:**

```python
@app.route('/cesta/k/zdroji', methods=['GET', 'POST', ...])
def nazev_view_funkce():
    # Kód pro zpracování požadavku
    return 'Odpověď'
```

* **První argument (`/cesta/k/zdroji`)**: Definuje URL cestu, na kterou bude view funkce reagovat.
* **Argument `methods` (volitelný)**: Seznam HTTP metod, které tato routa podporuje. Pokud není uveden, výchozí je pouze `GET`. Pro zpracování `POST` požadavků (např. z formulářů) je nutné explicitně uvést `methods=['POST']` nebo `methods=['GET', 'POST']`.

**Příklady rout:**

```python
# Reaguje na GET požadavky na /about
@app.route('/about')
def about_page():
    return '<h1>O aplikaci</h1>' # Může vracet i HTML

# Reaguje na GET i POST požadavky na /contact
@app.route('/contact', methods=['GET', 'POST'])
def contact_page():
    if request.method == 'POST':
        # Zpracování odeslaných dat formuláře (viz dále)
        return 'Formulář odeslán!'
    else:
        # Zobrazení formuláře (pro GET požadavek)
        return '<form method="post"><input type="submit" value="Odeslat"></form>'
```

**Routy s proměnnými částmi (URL Converters):**

Často potřebujeme, aby část URL byla proměnná (např. ID uživatele, název produktu). K tomu slouží URL konvertory uzavřené do lomených závorek `<>`.

```python
@app.route('/users/<int:user_id>') # Očekává celé číslo v URL
def show_user_profile(user_id):
    # user_id je nyní proměnná obsahující hodnotu z URL
    return f'Profil uživatele s ID: {user_id}'

@app.route('/post/<string:post_slug>') # Očekává textový řetězec
def show_post(post_slug):
    return f'Zobrazuji příspěvek: {post_slug}'

# Další konvertory: string (výchozí), int, float, path (jako string, ale akceptuje lomítka), uuid
```
Hodnota z proměnné části URL je automaticky předána jako argument do view funkce.

### Objekt `request`

Flask poskytuje globální objekt `request`, který obsahuje všechny informace o **aktuálním příchozím HTTP požadavku**. Tento objekt je dostupný pouze **během zpracování požadavku** uvnitř view funkce (je tzv. kontextově lokální).

**Nejdůležitější atributy objektu `request`:**

* **`request.method`**: Řetězec obsahující HTTP metodu požadavku (`'GET'`, `'POST'`, atd.).
* **`request.args`**: Slovník (přesněji `MultiDict`) obsahující parametry z URL query stringu (část za otazníkem, např. `/search?query=flask&page=2`). Hodnoty jsou vždy řetězce.
    ```python
    from flask import request

    @app.route('/search')
    def search():
        query = request.args.get('query', '') # Získá hodnotu parametru 'query', výchozí je ''
        page = request.args.get('page', 1, type=int) # Získá 'page', výchozí 1, převede na int
        return f'Hledám: "{query}" na stránce {page}'
    ```
* **`request.form`**: Slovník (`MultiDict`) obsahující data odeslaná z HTML formuláře metodou `POST` (s `Content-Type: application/x-www-form-urlencoded` nebo `multipart/form-data`).
    ```python
    @app.route('/login', methods=['POST'])
    def login():
        username = request.form.get('username')
        password = request.form.get('password')
        # ... zpracování přihlášení ...
        return f'Pokus o přihlášení uživatele: {username}'
    ```
* **`request.json`**: Pokud požadavek obsahuje JSON data v těle (s `Content-Type: application/json`), tento atribut obsahuje naparsovaná data jako Python slovník nebo seznam. Pokud data nejsou validní JSON nebo chybí hlavička, může vyvolat chybu (nebo vrátit `None`, pokud použijeme `request.get_json(silent=True)`).
    ```python
    @app.route('/api/items', methods=['POST'])
    def api_create_item():
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({"error": "Chybí data nebo jméno"}), 400 # Bad Request
        # ... vytvoření položky ...
        return jsonify(data), 201 # Created
    ```
* **`request.headers`**: Slovník (`EnvironHeaders`) obsahující HTTP hlavičky požadavku.
* **`request.files`**: Slovník (`MultiDict`) obsahující nahrané soubory (pokud formulář používal `enctype="multipart/form-data"`).
* **`request.remote_addr`**: IP adresa klienta.

### Vytváření odpovědí (Response)

View funkce musí vrátit odpověď, kterou Flask odešle klientovi. Flask je v tomto flexibilní:

* **Vracení řetězce:** Pokud vrátíte řetězec, Flask ho automaticky převede na HTTP odpověď s tělem obsahujícím tento řetězec, stavovým kódem `200 OK` a `Content-Type: text/html; charset=utf-8`.
    ```python
    @app.route('/simple')
    def simple_response():
        return 'Toto je jednoduchá textová odpověď.'
    ```
* **Vracení HTML:** Můžete vracet přímo HTML kód jako řetězec. Pro složitější HTML se používají šablony (např. Jinja2), které probereme později, pokud budeme tvořit i HTML rozhraní přímo ve Flasku.
* **Vracení N-tice (tuple):** Můžete vrátit n-tici pro specifikaci více částí odpovědi:
    * `(telo_odpovedi, stavovy_kod)`: Např. `return 'Not Found', 404`
    * `(telo_odpovedi, stavovy_kod, hlavicky)`: Např. `return 'Data', 201, {'Location': '/api/items/5'}` (hlavičky musí být slovník nebo seznam dvojic).
* **Použití `jsonify()`:** Pro vracení JSON odpovědí (což je typické pro REST API) použijte funkci `jsonify()`. Ta převede Python slovník nebo seznam na JSON řetězec a nastaví správnou `Content-Type: application/json` hlavičku.
    ```python
    from flask import jsonify

    @app.route('/api/data')
    def get_data():
        data = {"id": 1, "name": "Ukázka"}
        return jsonify(data) # Vrátí JSON: {"id": 1, "name": "Ukázka"}
    ```
* **Vytvoření objektu `Response`:** Pro plnou kontrolu můžete vytvořit instanci třídy `Response`.
    ```python
    from flask import Response

    @app.route('/custom')
    def custom_response():
        return Response('Vlastní odpověď', status=201, mimetype='text/plain')
    ```
* **Použití `abort()`:** Pro okamžité ukončení zpracování požadavku a vrácení chybové HTTP odpovědi.
    ```python
    from flask import abort

    @app.route('/admin')
    def admin_only():
        if not user_is_admin(): # Hypotetická funkce
             abort(403) # Forbidden - přístup odepřen
        return 'Vítejte, admine!'
    ```

### Funkce `url_for()`

Místo pevného kódování URL cest v šablonách nebo přesměrováních je lepší používat funkci `url_for()`. Ta generuje URL pro zadanou view funkci (podle jejího názvu) a případné argumenty.

```python
from flask import url_for, redirect

@app.route('/user/<username>')
def profile(username):
    return f'Profil uživatele {username}'

@app.route('/go-to-profile/<name>')
def go_to_profile(name):
    # Přesměruje na URL vygenerovanou pro view funkci 'profile' s argumentem 'username'
    return redirect(url_for('profile', username=name))
```
Výhoda: Pokud změníte URL v `@app.route()`, `url_for()` bude stále generovat správnou adresu, aniž byste museli měnit kód jinde.

### Shrnutí

V této části jsme probrali úplné základy Flasku: vytvoření instance aplikace, definování cest (rout) pomocí dekorátoru `@app.route()`, zpracování různých HTTP metod, práci s příchozím požadavkem pomocí objektu `request` (získávání query parametrů, formulářových dat, JSON dat) a vytváření různých typů odpovědí (text, HTML, JSON, vlastní stavové kódy). Tyto znalosti tvoří základ pro budování složitějších backendových aplikací a API.
