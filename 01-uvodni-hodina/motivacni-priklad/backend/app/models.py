# Definice databázových modelů pomocí SQLAlchemy

from . import db  # Import instance 'db' z __init__.py


class Book(db.Model):
    """
    Model reprezentující knihu v databázi.
    """

    # Název tabulky v databázi (pokud není uveden, odvodí se z názvu třídy)
    __tablename__ = "books"

    # Definice sloupců tabulky
    id = db.Column(db.Integer, primary_key=True)  # Primární klíč, auto-increment
    title = db.Column(
        db.String(150), nullable=False
    )  # Název knihy, povinný, max 150 znaků
    author = db.Column(
        db.String(100), nullable=False
    )  # Autor knihy, povinný, max 100 znaků
    isbn = db.Column(
        db.String(13), unique=True, nullable=True
    )  # ISBN, unikátní, nepovinný
    publication_year = db.Column(db.Integer, nullable=True)  # Rok vydání, nepovinný

    def __repr__(self):
        """Textová reprezentace objektu knihy (pro debugování)."""
        return f"<Book {self.title} by {self.author}>"

    def to_dict(self):
        """
        Metoda pro snadnou serializaci objektu knihy do slovníku (pro JSON odpovědi).
        """
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "isbn": self.isbn,
            "publication_year": self.publication_year,
        }
