# Inicializace Flask aplikace, konfigurace databáze a CORS

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# Načtení proměnných prostředí ze souboru .env (pokud existuje)
# To je užitečné hlavně pro lokální vývoj mimo Docker
load_dotenv()

# Inicializace SQLAlchemy extension - zatím bez přiřazení k aplikaci
db = SQLAlchemy()


def create_app():
    """Vytváří a konfiguruje instanci Flask aplikace."""
    app = Flask(__name__)

    # Povolení CORS pro všechny domény a cesty (pro jednoduchost příkladu)
    # V produkci by se mělo omezit na konkrétní doménu frontendu
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Konfigurace databáze
    # Bere URL z proměnné prostředí DATABASE_URL
    # Pokud proměnná není nastavena, použije SQLite v paměti (pro jednoduché testování)
    database_url = os.environ.get("DATABASE_URL", "sqlite:///:memory:")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    # Vypnutí sledování modifikací objektů SQLAlchemy, šetří zdroje
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Propojení SQLAlchemy s Flask aplikací
    db.init_app(app)

    # Import a registrace rout (API endpointů) až po inicializaci aplikace a db
    # Tím se zabrání cyklickým importům
    with app.app_context():
        from . import routes  # Import modul s routami

        # Vytvoření databázových tabulek podle modelů, pokud ještě neexistují
        # db.create_all() se spustí v kontextu aplikace
        db.create_all()

    return app
