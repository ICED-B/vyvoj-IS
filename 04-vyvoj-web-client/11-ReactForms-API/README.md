# 11. Vytváření formulářů a komunikace s API v Reactu (s TypeScriptem)

Vytváření formulářů a komunikace s backendovým API jsou dvě klíčové činnosti při vývoji téměř každé interaktivní webové aplikace. V této kapitole si ukážeme, jak efektivně spravovat formulářová data v Reactu a jak komunikovat s naším backendem, přičemž se zaměříme na populární knihovnu `axios` a řešení problémů s CORS pomocí proxy serveru ve Vite.

## 1. Zpracování formulářů v Reactu: Kontrolované komponenty

V Reactu existují dva hlavní přístupy ke zpracování formulářů: kontrolované (controlled) a nekontrolované (uncontrolled) komponenty. **Kontrolované komponenty** jsou doporučeným a nejčastěji používaným přístupem.

Princip kontrolované komponenty spočívá v tom, že **React stav (`state`) je jediným zdrojem pravdy (single source of truth)** pro hodnotu formulářového pole.

1.  Pro každé vstupní pole (`<input>`, `<textarea>`, `<select>`) vytvoříme stavovou proměnnou pomocí `useState`.
2.  Hodnotu vstupního pole navážeme na tuto stavovou proměnnou pomocí atributu `value`.
3.  Při každé změně hodnoty v poli (událost `onChange`) zavoláme funkci, která aktualizuje příslušný stav.

Tímto způsobem React "kontroluje" hodnotu pole a jakákoli změna se okamžitě projeví ve stavu komponenty.

**Příklad jednoduchého formuláře s TypeScriptem:**

```tsx
// src/components/JednoduchyFormular.tsx
"use client"; // Pokud používáme v Next.js App Routeru

import React, { useState } from 'react';

const JednoduchyFormular: React.FC = () => {
  const [jmeno, setJmeno] = useState<string>('');
  const [poznamka, setPoznamka] = useState<string>('');

  const handleJmenoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJmeno(event.target.value);
  };

  const handlePoznamkaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPoznamka(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Zabráníme reloadu stránky
    if (!jmeno.trim()) {
      alert("Jméno je povinné!");
      return;
    }
    console.log("Odesílaná data:", { jmeno, poznamka });
    alert(`Formulář odeslán! Jméno: ${jmeno}, Poznámka: ${poznamka}`);
    // Zde by následovalo volání API pro odeslání dat
    setJmeno(''); // Vyčištění formuláře po odeslání
    setPoznamka('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="jmeno">Jméno:</label>
        <input
          type="text"
          id="jmeno"
          value={jmeno}
          onChange={handleJmenoChange}
        />
      </div>
      <div>
        <label htmlFor="poznamka">Poznámka:</label>
        <textarea
          id="poznamka"
          value={poznamka}
          onChange={handlePoznamkaChange}
        />
      </div>
      <button type="submit">Odeslat</button>
    </form>
  );
};

export default JednoduchyFormular;
```
* Používáme typy událostí z Reactu, např. `React.ChangeEvent<HTMLInputElement>`, pro silnou typovou kontrolu v `onChange` handlerech.

### 2. Nekontrolované komponenty (Uncontrolled Components)

Oproti kontrolovaným komponentám, u nekontrolovaných komponent **drží stav samotný DOM**, nikoli React stav. Místo `useState` pro každé pole používáme hook `useRef` k získání přímého odkazu na DOM element. Hodnotu získáme až v momentě, kdy ji potřebujeme (typicky při odeslání formuláře).

**Princip nekontrolované komponenty:**
1.  Vytvoříme ref pro každé vstupní pole pomocí hooku `useRef`.
2.  Připojíme ref k DOM elementu pomocí atributu `ref`.
3.  V handleru pro odeslání formuláře přistoupíme k hodnotě pole přes `ref.current.value`.

**Příklad nekontrolovaného formuláře:**

```tsx
// src/components/NekontrolovanyFormular.tsx
"use client";

import React, { useRef } from 'react';

const NekontrolovanyFormular: React.FC = () => {
  // Vytvoření ref objektů pro přístup k DOM elementům
  const jmenoInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Přístup k hodnotám přímo z DOMu přes .current
    const zadaneJmeno = jmenoInputRef.current?.value;
    const zadanyEmail = emailInputRef.current?.value;

    if (!zadaneJmeno?.trim()) {
        alert("Jméno je povinné!");
        return;
    }

    console.log("Odesílaná data:", { jmeno: zadaneJmeno, email: zadanyEmail });
    alert(`Formulář odeslán! Jméno: ${zadaneJmeno}, Email: ${zadanyEmail}`);
    
    // Reset formuláře
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="jmeno-nekontrolovane">Jméno:</label>
        <input
          type="text"
          id="jmeno-nekontrolovane"
          ref={jmenoInputRef} // Připojení ref
          // Lze použít defaultValue pro počáteční hodnotu
          defaultValue="Výchozí Jméno"
        />
      </div>
      <div>
        <label htmlFor="email-nekontrolovane">Email:</label>
        <input
          type="email"
          id="email-nekontrolovane"
          ref={emailInputRef}
        />
      </div>
      <button type="submit">Odeslat</button>
    </form>
  );
};

export default NekontrolovanyFormular;
```

**Kdy použít nekontrolované komponenty?**
* U velmi jednoduchých formulářů, kde nepotřebujete okamžitou validaci nebo reakci na každou změnu.
* Při integraci s non-React knihovnami, které si spravují DOM samy.
* Při práci s `<input type="file">`, jehož hodnota je vždy jen pro čtení a spravuje ji uživatel/prohlížeč.

Většinou je však preferován **kontrolovaný přístup** pro jeho předvídatelnost a snadnou integraci s React ekosystémem.

## Komunikace s API: `fetch` vs. `axios`

Zatímco vestavěné `fetch` API je schopný nástroj, mnoho vývojářů preferuje knihovnu **`axios`** pro její pohodlnější API a další funkce.

| Funkce                        | `fetch` API                               | `axios`                                                       |
| ----------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| **Základní použití** | Nativní součást prohlížeče, není třeba instalovat. | Je třeba nainstalovat: `npm install axios`                   |
| **Zpracování JSON** | Dvoukrokový proces: `response.json()` vrací Promise. | Automaticky parsuje JSON odpověď. Data jsou v `response.data`. |
| **Zpracování chyb** | Promise selže jen u síťových chyb. HTTP chyby (4xx, 5xx) je nutné kontrolovat ručně (`response.ok`). | Promise selže i u HTTP chybových stavů (4xx, 5xx), což zjednodušuje `catch` blok. |
| **Konfigurace** | Objekt s nastavením jako druhý argument.  | Přehlednější objekt s konfigurací.                          |
| **Vytváření instancí** | Není vestavěné.                           | Umožňuje vytvořit instance s přednastavenou konfigurací (např. base URL, hlavičky). |
| **Interceptors (zachytávače)**| Není vestavěné.                           | Umožňuje globálně zachytávat a upravovat požadavky a odpovědi (např. pro vkládání tokenů, logování). |
| **Ochrana proti XSRF** | Nutno implementovat ručně.                | Vestavěná podpora.                                            |

**Instalace axiosu:**
```bash
npm install axios
```

## Problém CORS a řešení pomocí Vite Proxy

Při lokálním vývoji se často setkáte s **CORS (Cross-Origin Resource Sharing)** chybou. Váš frontend (běžící např. na `http://localhost:5173`) a backend (běžící např. na `http://localhost:5000`) jsou z pohledu prohlížeče na různých "origošech" (liší se portem). Z bezpečnostních důvodů prohlížeč standardně blokuje HTTP požadavky mezi různými origošy.

Místo složité konfigurace CORS hlaviček na backendu pro vývojové prostředí můžeme využít **proxy server**, který je součástí Vite.

**Jak to funguje:**
1.  React aplikace pošle požadavek na API na **stejný origo**, na kterém běží (např. na `/api/users`).
2.  Vite dev server tento požadavek zachytí.
3.  Podle konfigurace v `vite.config.ts` Vite tento požadavek **přesměruje (proxyuje)** na skutečnou adresu backendu (např. `http://backend:5000/api/users`).
4.  Z pohledu prohlížeče se jedná o komunikaci v rámci stejného origošu, takže CORS chyba nevznikne.

**Nastavení proxy ve `vite.config.ts`:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Důležité pro Docker
    port: 5173,
    proxy: {
      // Všechny požadavky začínající /api budou přesměrovány
      '/api': {
        // Cíl: Adresa a port vašeho backendu
        // Pokud backend běží v Dockeru se službou 'backend' na portu 5000:
        target: 'http://localhost:5000', // Pokud backend běží lokálně na portu 5000
        // target: 'http://backend:5000', // Pokud se Vite kontejner odkazuje na jiný kontejner v síti
        changeOrigin: true, // Potřebné pro virtuální hostování
        // secure: false,      // Pokud backend běží na HTTPS s self-signed certifikátem
        // Volitelné přepsání cesty - odstraní /api z požadavku na backend
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      }
    }
  }
})
```
* V našem React kódu nyní budeme volat API na relativní cestě, např. `axios.get('/api/books')`.

## Vytvoření API služby (Service Layer)

Je dobrým zvykem oddělit logiku pro komunikaci s API od UI komponent. Vytvoříme si tzv. **servisní vrstvu**, která bude obsahovat funkce pro jednotlivé API volání. Často se vytváří i sdílená instance `axios`.

**Příklad `apiClient.ts`:**
```typescript
// src/services/apiClient.ts
import axios from 'axios';

// Vytvoření instance axiosu s přednastavenou bázovou URL
// Díky proxy ve Vite můžeme použít relativní cestu.
const apiClient = axios.create({
  baseURL: '/api', // Všechny požadavky budou mít tento prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// Zde můžeme přidat interceptory pro globální zpracování požadavků/odpovědí
// Příklad: Přidání autorizačního tokenu do každého požadavku
/*
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/

export default apiClient;
```

**Příklad `bookService.ts`:**
```typescript
// src/services/bookService.ts
import apiClient from './apiClient';

// Typy pro data, ideálně sdílené s backendem
export interface Book {
  id: number;
  title: string;
  author: string;
  publication_year?: number;
}

// Typ pro data při vytváření nové knihy (bez id)
export type NewBookData = Omit<Book, 'id'>;

// Funkce pro načtení všech knih
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>('/v1/books'); // Cesta je /api/v1/books
  return response.data;
};

// Funkce pro vytvoření nové knihy
export const createBook = async (bookData: NewBookData): Promise<Book> => {
  const response = await apiClient.post<Book>('/v1/books', bookData);
  return response.data;
};
```

## Kompletní příklad: Komponenta pro správu knih

Tato komponenta bude zobrazovat seznam knih načtených z API a obsahovat formulář pro přidání nové knihy.

```tsx
// src/components/BookManager.tsx
import React, { useState, useEffect } from 'react';
import { Book, getAllBooks, createBook, NewBookData } from '../services/bookService';

const BookManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Načtení dat při prvním renderu komponenty
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllBooks();
        setBooks(data);
      } catch (err) {
        setError('Nepodařilo se načíst knihy.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Handler pro odeslání formuláře
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      alert('Vyplňte prosím název i autora.');
      return;
    }
    const newBookData: NewBookData = { title, author };
    try {
      const createdBook = await createBook(newBookData);
      setBooks(prevBooks => [...prevBooks, createdBook]); // Přidání nové knihy do seznamu
      setTitle(''); // Vyčištění formuláře
      setAuthor('');
    } catch (err) {
      alert('Nepodařilo se vytvořit knihu.');
      console.error(err);
    }
  };

  if (isLoading) return <p>Načítám knihy...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <section>
        <h2>Přidat novou knihu</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Název:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="author">Autor:</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </div>
          <button type="submit">Uložit knihu</button>
        </form>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Seznam knih</h2>
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> od {book.author}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default BookManager;
```

## Shrnutí

Správa formulářů pomocí kontrolovaných komponent v Reactu nám dává plnou kontrolu nad daty. Pro komunikaci s API je `axios` pohodlnou a robustní volbou. Nastavení proxy ve Vite je klíčové pro vyřešení CORS problémů během lokálního vývoje. Strukturování API volání do samostatné servisní vrstvy zlepšuje organizaci a znovupoužitelnost kódu.

---

### Cvičení (Samostatná práce)

1.  **Připravte si projekt:** Použijte váš React/Vite projekt. Nainstalujte `axios`: `npm install axios`.
2.  **Nastavte Vite proxy:** V souboru `vite.config.ts` nastavte proxy tak, aby požadavky na `/api` směřovaly na váš běžící backend (např. `http://localhost:5000`).
3.  **Vytvořte API službu:** Vytvořte soubory `src/services/apiClient.ts` a např. `src/services/productService.ts` (nebo pro jinou entitu z vašeho projektu). Implementujte funkce pro:
    * `getAllProducts(): Promise<Product[]>`
    * `createProduct(data: NewProductData): Promise<Product>`
    * `deleteProduct(id: number): Promise<void>`
    * Nezapomeňte si definovat typy (`Product`, `NewProductData`).
4.  **Vytvořte komponentu pro správu entity:**
    * Vytvořte komponentu `ProductManager.tsx`.
    * Pomocí `useEffect` a vaší API služby načtěte a zobrazte seznam produktů.
    * Vytvořte formulář pro přidání nového produktu. Po úspěšném odeslání (pomocí vaší API služby) aktualizujte seznam produktů na stránce.
    * Ke každému produktu v seznamu přidejte tlačítko "Smazat". Po kliknutí zavolejte příslušnou funkci z vaší API služby a po úspěšném smazání produkt odstraňte ze seznamu v UI.
5.  **Zpracujte stavy:** Ujistěte se, že vaše komponenta správně zobrazuje stavy načítání (loading) a případné chyby z API volání.
