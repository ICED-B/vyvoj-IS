# Motivační příklad: Správa Knihovny

Toto je motivační příklad pro předmět "Vývoj IS". Jedná se o jednoduchou webovou aplikaci pro správu záznamů o knihách v knihovně.

Cílem tohoto příkladu je demonstrovat propojení klíčových technologií a konceptů probíraných v kurzu:

* **Backend:** REST API vytvořené v Pythonu (pomocí frameworku Flask nebo FastAPI).
* **Frontend:** Interaktivní uživatelské rozhraní vytvořené pomocí knihovny React.
* **Databáze:** Relační databáze PostgreSQL pro ukládání dat o knihách.
* **Kontejnerizace:** Celá aplikace (backend, frontend, databáze) je spravována a spouštěna pomocí Dockeru a Docker Compose.

## Architektura

Aplikace se skládá ze tří hlavních částí (služeb definovaných v `docker-compose.yml`):

1.  **`db` (Databáze):**
    * Používá oficiální PostgreSQL image.
    * Ukládá data do pojmenovaného volume (`postgres_data`), aby byla perzistentní i po zastavení a odstranění kontejneru.
    * Běží na portu `5433` hostitelského stroje.
    * Obsahuje databázi `knihovna_db` s uživatelem `knihovna_user`.

2.  **`backend` (Backend API):**
    * Postaveno na Pythonu (Flask/FastAPI).
    * Poskytuje RESTful rozhraní pro operace CRUD (Create, Read, Update, Delete) nad záznamy knih.
    * Připojuje se k databázové službě `db`.
    * Běží na portu `5001` hostitelského stroje.
    * Zdrojové kódy jsou mapovány z lokálního adresáře `./backend` pro snadný vývoj.

3.  **`frontend` (Frontend Aplikace):**
    * Postaveno na Reactu.
    * Poskytuje uživatelské rozhraní pro zobrazení, přidávání, (případně úpravu a mazání) knih.
    * Komunikuje s `backend` službou přes její REST API.
    * Běží na portu `3001` hostitelského stroje (typicky React development server).
    * Zdrojové kódy jsou mapovány z lokálního adresáře `./frontend` pro snadný vývoj.

Všechny služby komunikují v rámci interní Docker sítě `knihovna_net`.

## Struktura adresářů

```bash
motivacni-priklad/
├── backend/
│   ├── app/             # Adresář s kódem aplikace (moduly, modely, views/routes)
│   │   ├── __init__.py
│   │   ├── models.py    # Definice databázových modelů (např. SQLAlchemy)
│   │   └── routes.py    # Definice API endpointů
│   ├── requirements.txt # Seznam Python závislostí
│   ├── Dockerfile       # Instrukce pro build backend image
│   └── ...              # Další konfigurační soubory (např. .env)
├── frontend/
│   ├── public/          # Statické soubory (index.html, favicon, ...)
│   ├── src/             # Zdrojové kódy React aplikace (komponenty, hooks, ...)
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json     # Seznam Node.js závislostí a skriptů
│   ├── Dockerfile       # Instrukce pro build frontend image
│   └── ...              # Další konfigurační soubory (např. .env)
├── docker-compose.yml   # Definuje a konfiguruje služby aplikace
└── README.md            # Tento soubor
```

## Spuštění aplikace
1. **Nainstalujte Docker a Docker Compose:** Ujistěte se, že máte na svém systému nainstalované tyto nástroje.
2. **Naklonujte repozitář:** (Pokud bude projekt v Gitu)
    ```bash
    git clone <URL_repozitare>
    cd 01-uvodni-hodina/motivacni-priklad-knihovna
    ```
3. **Spusťte kontejnery:** V kořenovém adresáři projektu (kde se nachází `docker-compose.yml`) spusťte příkaz:
    ```bash
    docker-compose up --build -d
    ```
*   `--build`: Vynutí sestavení Docker images (potřebné při první spuštění nebo po změnách v Dockerfile).
*   `-d`: Spustí kontejnery na pozadí (detached mode).
4. **Přístup k aplikaci:** 
*   Frontend bude dostupný v prohlížeči na adrese: `http://localhost:3000` 
*   Backend API bude dostupné na adrese: http://localhost:5000 (např. `http://localhost:5000/api/books` pro seznam knih)
*   K databázi se lze připojit nástrojem jako DBeaver nebo pgAdmin na `localhost:5050` s přihlašovacími údaji definovanými v `docker-compose.yml`.
5. **Dotazování na backend:** 
*   V souboru `API-requests.http` jsou připraveny ukázkové dotazy na bakend, které si můžete vyzkoušet.
*   Pro jejich použití budete potřebovat rozšíření pro VSCode `humao.rest-client`.
## Zastavení aplikace
Pro zastavení a odstranění kontejnerů, sítí a volumes (kromě pojmenovaného `postgres_data`) použijte příkaz:
```bash
docker-compose down
```
Pro zastavení bez odstranění:
```bash
docker-compose stop
```