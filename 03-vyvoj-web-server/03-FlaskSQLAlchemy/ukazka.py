# priklady/03-standalone-sqlalchemy-demo/standalone_orm_demo.py
import os
from os.path import join, dirname, realpath
from sqlalchemy import create_engine, Column, Integer, String, Text, Numeric, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base

# --- 1. Nastavení připojení k databázi ---
# Použijeme lokální SQLite databázi uloženou v souboru 'library_orm.db'
# Pokud soubor neexistuje, SQLAlchemy ho vytvoří.
DATABASE_FILE = join(dirname(realpath(__file__)), "library_orm.db")
DATABASE_URL = f"sqlite:///{DATABASE_FILE}"

# Vytvoření "engine", což je vstupní bod pro komunikaci s databází
# echo=True způsobí vypisování generovaných SQL příkazů do konzole (užitečné pro ladění)
engine = create_engine(DATABASE_URL, echo=False)  # Nastavte echo=True pro zobrazení SQL

# --- 2. Definice základní třídy pro modely (Declarative Base) ---
# Všechny naše modely budou dědit z této základní třídy
Base = declarative_base()

# --- 3. Definice databázových modelů ---
# Modely jsou Python třídy mapované na databázové tabulky


class Publisher(Base):
    __tablename__ = "publishers"  # Název tabulky

    # Definice sloupců
    publisher_id = Column(
        Integer, primary_key=True
    )  # PK, auto-increment je výchozí pro Integer PK v SQLite
    name = Column(String(100), unique=True, nullable=False)
    headquarters = Column(Text, nullable=True)

    # Definice vztahu 1:N (jeden vydavatel má mnoho knih)
    # 'books' je název atributu pro přístup ke knihám daného vydavatele
    # back_populates='publisher' propojí tento vztah s atributem 'publisher' v modelu Book
    books = relationship(
        "Book", back_populates="publisher", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Publisher(publisher_id={self.publisher_id}, name='{self.name}')>"


class Book(Base):
    __tablename__ = "books"

    book_id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    publication_year = Column(Integer, nullable=True)
    page_count = Column(Integer, nullable=True)
    price = Column(
        Numeric(8, 2), nullable=True
    )  # Numeric se v SQLite mapuje na DECIMAL

    # Cizí klíč na vydavatele
    publisher_id = Column(Integer, ForeignKey("publishers.publisher_id"), nullable=True)

    # Vztah N:1 (kniha patří jednomu vydavateli)
    # back_populates='books' propojí tento vztah s atributem 'books' v modelu Publisher
    publisher = relationship("Publisher", back_populates="books")

    def __repr__(self):
        return f"<Book(book_id={self.book_id}, title='{self.title}')>"


# --- 4. Vytvoření tabulek v databázi ---
# Tato funkce vezme všechny modely dědící z Base a vytvoří odpovídající tabulky,
# pokud ještě neexistují.
print(">>> Vytváření tabulek (pokud neexistují)...")
Base.metadata.create_all(engine)
print(">>> Tabulky vytvořeny/zkontrolovány.")

# --- 5. Práce se Session ---
# Session je "pracovní prostor" pro interakci s databází pomocí ORM.
# Všechny změny (přidání, úpravy, mazání objektů) se nejprve registrují v session
# a teprve po zavolání commit() se reálně zapíší do databáze.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Funkce pro získání session (podobně jako v FastAPI s dependency injection)
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- 6. Ukázkové operace ---

print("\n>>> Ukázka operací s ORM:")

# Použití kontextového manažeru pro session je doporučený způsob
with SessionLocal() as session:
    # --- Vložení dat (INSERT) ---
    print("\n--- Vkládání dat ---")
    # Vytvoření nových objektů (Publisher a Book)
    publisher_argo = Publisher(name="Argo", headquarters="Praha")
    publisher_host = Publisher(name="Host", headquarters="Brno")

    book1 = Book(title="Duna", publication_year=1965, page_count=688, price=499.00)
    book2 = Book(title="Nadace", publication_year=1951, page_count=240, price=279.00)
    book3 = Book(
        title="Leviatan se probouzí",
        publication_year=2011,
        page_count=560,
        price=399.00,
    )

    # Přiřazení vydavatele ke knihám (nastavení vztahu)
    book1.publisher = publisher_argo  # Duna -> Argo
    book2.publisher = publisher_argo  # Nadace -> Argo
    book3.publisher = publisher_host  # Leviatan -> Host

    # Přidání objektů do session (zatím nejsou v DB)
    print("Přidávání objektů do session...")
    session.add(publisher_argo)
    session.add(publisher_host)
    # Knihy se přidají automaticky díky 'cascade' ve vztahu Publisher.books,
    # ale můžeme je přidat i explicitně:
    # session.add(book1)
    # session.add(book2)
    # session.add(book3)
    # Alternativně: session.add_all([publisher_argo, publisher_host, book1, book2, book3])

    # Zápis změn do databáze
    print("Commit změn do databáze...")
    session.commit()
    print("Data vložena.")

    # Po commitu mají objekty přiřazené ID z databáze
    print(f"ID pro Argo: {publisher_argo.publisher_id}")
    print(f"ID pro Dunu: {book1.book_id}")
    print(f"Vydavatel Duny (přes objekt): {book1.publisher.name}")

    # --- Načítání dat (SELECT) ---
    print("\n--- Načítání dat ---")
    # Načtení všech vydavatelů
    print("Všichni vydavatelé:")
    all_publishers = session.query(Publisher).all()  # Starší syntaxe SQLAlchemy 1.x
    # all_publishers = session.execute(select(Publisher)).scalars().all() # Novější syntaxe SQLAlchemy 2.x
    for pub in all_publishers:
        print(pub)

    # Načtení konkrétního vydavatele podle ID
    print("\nVydavatel s ID 1:")
    argo = session.get(Publisher, 1)  # Efektivní načtení podle PK
    if argo:
        print(argo)
        # Přístup k souvisejícím knihám (díky relationship a lazy loading)
        print("  Knihy od Arga:")
        for book in argo.books:
            print(f"  - {book.title}")
    else:
        print("Vydavatel s ID 1 nenalezen.")

    # Načtení knih s filtrem
    print("\nKnihy vydané po roce 1960:")
    modern_books = session.query(Book).filter(Book.publication_year > 1960).all()
    # modern_books = session.execute(select(Book).where(Book.publication_year > 1960)).scalars().all()
    for book in modern_books:
        print(f"- {book.title} ({book.publication_year})")

    # --- Aktualizace dat (UPDATE) ---
    print("\n--- Aktualizace dat ---")
    # Najdeme knihu Duna a změníme její cenu
    duna_book = session.query(Book).filter(Book.title == "Duna").first()
    # duna_book = session.execute(select(Book).where(Book.title == "Duna")).scalar_one_or_none()
    if duna_book:
        print(f"Původní cena Duny: {duna_book.price}")
        duna_book.price = 515.50
        print(f"Nová cena Duny (v session): {duna_book.price}")
        # Změna je zatím jen v session
        session.commit()  # Uložení změny do DB
        print("Změna ceny uložena.")
    else:
        print("Kniha Duna nenalezena pro aktualizaci.")

    # --- Mazání dat (DELETE) ---
    print("\n--- Mazání dat ---")
    # Smažeme vydavatele Host (ID 2)
    # Díky cascade="all, delete-orphan" ve vztahu Publisher.books by se měly smazat i knihy od Hosta
    host_publisher = session.get(Publisher, 2)
    if host_publisher:
        print(f"Mažu vydavatele: {host_publisher.name}")
        session.delete(host_publisher)
        session.commit()
        print("Vydavatel (a jeho knihy) smazán.")

        # Ověření smazání knihy
        leviatan_book = (
            session.query(Book).filter(Book.title == "Leviatan se probouzí").first()
        )
        if not leviatan_book:
            print("Kniha 'Leviatan se probouzí' byla také smazána (cascade).")
    else:
        print("Vydavatel Host (ID 2) nenalezen pro smazání.")


print("\n>>> Ukázka dokončena.")

# --- Čištění (volitelné) ---
# Pokud chcete smazat vytvořený soubor databáze po skončení skriptu
# try:
#     os.remove(DATABASE_FILE)
#     print(f"\n>>> Soubor databáze '{DATABASE_FILE}' byl smazán.")
# except OSError as e:
#     print(f"\n>>> Chyba při mazání souboru databáze: {e}")
