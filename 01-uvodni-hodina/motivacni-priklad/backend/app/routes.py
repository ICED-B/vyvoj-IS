# Definice API endpointů (rout) pro správu knih

from flask import current_app, request, jsonify
from . import db  # Import instance 'db' z __init__.py
from .models import Book  # Import modelu Book

# Získání reference na aktuální Flask aplikaci pro registraci rout
# Použití Blueprint by bylo čistší pro větší aplikace, ale pro jednoduchost použijeme přímo app
app = current_app

# --- API Endpoints ---


@app.route("/api/books", methods=["GET"])
def get_books():
    """Endpoint pro získání seznamu všech knih."""
    try:
        books = Book.query.all()  # Získání všech záznamů z tabulky books
        # Převedení seznamu objektů Book na seznam slovníků pomocí metody to_dict()
        books_list = [book.to_dict() for book in books]
        return (
            jsonify(books_list),
            200,
        )  # Vrácení JSON odpovědi se seznamem a stavem 200 OK
    except Exception as e:
        # Základní ošetření chyb
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.route("/api/books", methods=["POST"])
def add_book():
    """Endpoint pro přidání nové knihy."""
    try:
        data = request.get_json()  # Získání JSON dat z těla požadavku

        # Jednoduchá validace vstupních dat
        if not data or not "title" in data or not "author" in data:
            return jsonify({"error": "Missing required fields: title and author"}), 400

        # Vytvoření nové instance modelu Book
        new_book = Book(
            title=data["title"],
            author=data["author"],
            isbn=data.get("isbn"),  # .get() použijeme pro nepovinná pole
            publication_year=data.get("publication_year"),
        )

        db.session.add(new_book)  # Přidání nového objektu do session SQLAlchemy
        db.session.commit()  # Uložení změn do databáze

        return (
            jsonify(new_book.to_dict()),
            201,
        )  # Vrácení nově vytvořeného objektu a stavu 201 Created
    except Exception as e:
        db.session.rollback()  # V případě chyby vrátíme změny v databázi
        return jsonify({"error": "Failed to add book", "message": str(e)}), 500


@app.route("/api/books/<int:id>", methods=["GET"])
def get_book(id):
    """Endpoint pro získání detailu konkrétní knihy podle ID."""
    try:
        # Získání knihy podle ID, .first_or_404() automaticky vrátí 404, pokud kniha není nalezena
        book = Book.query.get_or_404(id)
        return jsonify(book.to_dict()), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@app.route("/api/books/<int:id>", methods=["PUT"])
def update_book(id):
    """Endpoint pro aktualizaci existující knihy."""
    try:
        book = Book.query.get_or_404(id)  # Najdi knihu nebo vrať 404
        data = request.get_json(
            silent=True
        )  # Zkusí získat JSON, v případě chyby vrátí None

        # Kontrola, zda byla data úspěšně získána
        if data is None:
            return (
                jsonify(
                    {"error": "Invalid JSON data or incorrect Content-Type header"}
                ),
                400,
            )

        # Aktualizace atributů knihy daty z požadavku (pokud jsou přítomna)
        book.title = data.get("title", book.title)
        book.author = data.get("author", book.author)
        book.isbn = data.get("isbn", book.isbn)
        book.publication_year = data.get("publication_year", book.publication_year)

        db.session.commit()  # Uložení změn
        return jsonify(book.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update book", "message": str(e)}), 500


@app.route("/api/books/<int:id>", methods=["DELETE"])
def delete_book(id):
    """Endpoint pro smazání knihy."""
    try:
        book = Book.query.get_or_404(id)  # Najdi knihu nebo vrať 404

        db.session.delete(book)  # Označení knihy ke smazání
        db.session.commit()  # Provedení smazání

        return (
            "",
            204,
        )  # Vrácení prázdné odpovědi se stavem 204 No Content (úspěšné smazání)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete book", "message": str(e)}), 500
