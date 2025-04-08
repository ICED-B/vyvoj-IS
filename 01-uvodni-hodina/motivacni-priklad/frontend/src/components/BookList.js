// Komponenta pro zobrazení seznamu knih

import React from 'react';

function BookList({ books, onDeleteBook }) { // Přijímáme seznam knih a funkci pro smazání jako props

    if (!books || books.length === 0) {
        return <p className="text-center text-gray-600">Zatím zde nejsou žádné knihy.</p>;
    }

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-6">Název</th>
                        <th scope="col" className="py-3 px-6">Autor</th>
                        <th scope="col" className="py-3 px-6">Rok vydání</th>
                        <th scope="col" className="py-3 px-6">ISBN</th>
                        <th scope="col" className="py-3 px-6">Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Mapování pole knih na řádky tabulky */}
                    {books.map((book) => (
                        <tr key={book.id} className="bg-white border-b hover:bg-gray-50">
                            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                {book.title}
                            </th>
                            <td className="py-4 px-6">
                                {book.author}
                            </td>
                            <td className="py-4 px-6">
                                {book.publication_year || '-'} {/* Zobrazíme pomlčku, pokud rok není zadán */}
                            </td>
                            <td className="py-4 px-6">
                                {book.isbn || '-'} {/* Zobrazíme pomlčku, pokud ISBN není zadáno */}
                            </td>
                            <td className="py-4 px-6">
                                {/* Tlačítko pro smazání knihy */}
                                <button
                                    onClick={() => onDeleteBook(book.id)} // Při kliknutí zavolá funkci onDeleteBook s ID knihy
                                    className="font-medium text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
                                    aria-label={`Smazat knihu ${book.title}`}
                                >
                                    Smazat
                                </button>
                                {/* Zde by mohlo být i tlačítko pro úpravu */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;
