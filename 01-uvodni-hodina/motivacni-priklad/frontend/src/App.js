// Hlavní komponenta aplikace

import React, { useState, useEffect, useCallback } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';

function App() {
    // Stav pro uchování seznamu knih
    const [books, setBooks] = useState([]);
    // Stav pro indikaci načítání dat
    const [loading, setLoading] = useState(true);
    // Stav pro uchování případných chyb při komunikaci s API
    const [error, setError] = useState(null);

    // URL našeho backend API (z proměnné prostředí nebo napevno)
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Funkce pro načtení knih z API
    // useCallback zajistí, že se funkce nevytváří znovu při každém renderu, pokud se nezmění apiUrl
    const fetchBooks = useCallback(async () => {
        setLoading(true); // Začínáme načítat
        setError(null); // Resetujeme případné předchozí chyby
        try {
            const response = await fetch(`${apiUrl}/books`);
            if (!response.ok) {
                // Pokud odpověď není OK (např. 404, 500), vyhodíme chybu
                throw new Error(`Chyba ${response.status}: ${response.statusText || 'Nepodařilo se načíst knihy'}`);
            }
            const data = await response.json();
            setBooks(data); // Uložíme načtená data do stavu
        } catch (err) {
            console.error("Chyba při načítání knih:", err);
            setError(err.message); // Uložíme chybovou zprávu do stavu
        } finally {
            setLoading(false); // Skončili jsme načítání (ať už úspěšně nebo ne)
        }
    }, [apiUrl]); // Závislost na apiUrl - pokud se změní, funkce se vytvoří znovu

    // useEffect hook pro načtení dat při prvním renderu komponenty
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]); // Spustí se, když se komponenta připojí a když se změní funkce fetchBooks

    // Funkce pro přidání nové knihy
    const handleAddBook = async (bookData) => {
        try {
            const response = await fetch(`${apiUrl}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData), // Převedeme data z formuláře na JSON
            });
            if (!response.ok) {
                throw new Error(`Chyba ${response.status}: Nepodařilo se přidat knihu`);
            }
            // const newBook = await response.json(); // Získáme přidanou knihu z odpovědi
            // Místo parsování odpovědi můžeme znovu načíst celý seznam pro jednoduchost
            fetchBooks(); // Znovu načteme seznam knih, aby se zobrazila i nová
        } catch (err) {
            console.error("Chyba při přidávání knihy:", err);
            setError(err.message); // Zobrazíme chybu uživateli
        }
    };

    // Funkce pro smazání knihy
    const handleDeleteBook = async (id) => {
        // Zeptáme se uživatele na potvrzení
        if (!window.confirm(`Opravdu chcete smazat knihu s ID ${id}?`)) {
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/books/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                // Chyba 204 No Content je v pořádku pro DELETE
                if (response.status !== 204) {
                    throw new Error(`Chyba ${response.status}: Nepodařilo se smazat knihu`);
                }
            }
            // Aktualizujeme stav odstraněním knihy z pole (efektivnější než fetchBooks)
            setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
        } catch (err) {
            console.error("Chyba při mazání knihy:", err);
            setError(err.message);
        }
    };

    // Vykreslení komponenty
    return (
        <div className="container mx-auto p-6 font-sans">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Správa Knihovny</h1>

            {/* Zobrazení chybové zprávy */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Chyba!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* Formulář pro přidání knihy */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Přidat novou knihu</h2>
                <AddBookForm onAddBook={handleAddBook} />
            </div>

            {/* Seznam knih */}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seznam knih</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Načítám knihy...</p>
                ) : (
                    <BookList books={books} onDeleteBook={handleDeleteBook} />
                )}
            </div>

            <footer className="text-center text-gray-500 mt-8 text-sm">
                Motivační příklad pro předmět Vývoj IS.
            </footer>
        </div>
    );
}

export default App;
