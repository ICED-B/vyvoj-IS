// Komponenta s formulářem pro přidání nové knihy

import React, { useState } from 'react';

function AddBookForm({ onAddBook }) { // Přijímáme funkci pro přidání jako prop
    // Stavy pro jednotlivá pole formuláře
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publicationYear, setPublicationYear] = useState('');

    // Handler pro odeslání formuláře
    const handleSubmit = (event) => {
        event.preventDefault(); // Zabráníme výchozímu chování formuláře (reload stránky)

        // Jednoduchá validace (alespoň titul a autor)
        if (!title.trim() || !author.trim()) {
            alert('Prosím vyplňte alespoň název a autora knihy.');
            return;
        }

        // Vytvoření objektu s daty nové knihy
        const newBookData = {
            title: title.trim(),
            author: author.trim(),
            // Předáme null, pokud pole nejsou vyplněna nebo jsou prázdná
            isbn: isbn.trim() || null,
            // Převedeme rok na číslo, nebo null, pokud není zadán nebo není číslo
            publication_year: publicationYear.trim() ? parseInt(publicationYear.trim(), 10) || null : null,
        };

        // Zavoláme funkci z prop onAddBook s daty nové knihy
        onAddBook(newBookData);

        // Vyčistíme formulář po odeslání
        setTitle('');
        setAuthor('');
        setIsbn('');
        setPublicationYear('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pole pro Název */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Název knihy <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // Aktualizace stavu při změně
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Např. Pán prstenů"
                />
            </div>

            {/* Pole pro Autora */}
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Autor <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Např. J. R. R. Tolkien"
                />
            </div>

            {/* Pole pro Rok vydání */}
            <div>
                <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Rok vydání
                </label>
                <input
                    type="number" // Typ number pro lepší validaci a UX na mobilu
                    id="publicationYear"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Např. 1954"
                    min="0" // Můžeme přidat omezení
                />
            </div>

            {/* Pole pro ISBN */}
            <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN
                </label>
                <input
                    type="text"
                    id="isbn"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Např. 978-80-7203-123-4"
                    maxLength="13" // Omezení délky pro ISBN-13
                />
            </div>

            {/* Odesílací tlačítko */}
            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Přidat knihu
                </button>
            </div>
        </form>
    );
}

export default AddBookForm;
