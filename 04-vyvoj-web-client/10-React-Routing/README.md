# 10. Routování v React aplikacích (s React Router a TypeScriptem)

Moderní webové aplikace se často chovají jako desktopové aplikace – jsou rychlé a plynulé, protože nenačítají celou novou stránku při každé interakci. Přesto ale potřebujeme zachovat základní vlastnosti webu, jako jsou unikátní URL adresy pro různé pohledy, možnost používat tlačítka "zpět" a "vpřed" v prohlížeči a mít sdílitelné odkazy. O toto všechno se stará **routování**.

## Co je to routování?

Routování je proces, který mapuje URL adresu v prohlížeči na konkrétní kód, který se má spustit, a na uživatelské rozhraní, které se má zobrazit.

* **Server-Side Routing (Tradiční přístup):**
    * Když uživatel klikne na odkaz, prohlížeč pošle požadavek na server.
    * Server zpracuje požadavek, vygeneruje kompletní HTML stránku pro danou URL a pošle ji zpět.
    * Celá stránka se v prohlížeči znovu načte.
* **Client-Side Routing (Používáno v SPA - Single Page Applications):**
    * Počáteční požadavek načte celou aplikaci (kostru HTML a JavaScript).
    * Když uživatel klikne na odkaz, JavaScript na straně klienta (v našem případě React) převezme kontrolu.
    * Místo odeslání požadavku na server JavaScript **dynamicky změní obsah stránky** (vymění komponenty) a **upraví URL v adresním řádku** pomocí History API prohlížeče, aniž by došlo k novému načtení stránky.
    * Aplikace se cítí rychlejší a plynulejší.

## Routování s `react-router-dom`

**`react-router-dom`** je standardní knihovna pro implementaci client-side routování v React aplikacích. Umožňuje definovat routy a mapovat je na React komponenty.

### Instalace a základní nastavení

1.  **Instalace knihovny:** Ve vašem React projektu (vytvořeném např. pomocí Vite) nainstalujte `react-router-dom` a typy pro TypeScript:
    ```bash
    npm install react-router-dom
    npm install -D @types/react-router-dom
    ```
2.  **Základní nastavení v `src/main.tsx`:**
    Celou aplikaci musíme "obalit" router komponentou, nejčastěji `BrowserRouter`, která využívá History API prohlížeče pro sledování změn URL.
    ```tsx
    // src/main.tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.tsx';
    import './index.css';
    import { BrowserRouter } from 'react-router-dom';

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
    ```

### Definování rout (`<Routes>` a `<Route>`)

V hlavní komponentě aplikace (typicky `App.tsx`) definujeme jednotlivé routy pomocí komponent `<Routes>` a `<Route>`.

* `<Routes>`: Kontejner, který obaluje všechny možné routy. Vykreslí pouze **první** `<Route>`, která odpovídá aktuální URL.
* `<Route>`: Definuje jednu routu.
    * `path`: Řetězec s URL cestou (např. `/`, `/o-nas`, `/produkty/:id`).
    * `element`: React element (komponenta), který se má vykreslit, když URL odpovídá dané `path`.

**Příklad definice rout v `App.tsx`:**
```tsx
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      {/* Vnořené routy s layoutem */}
      <Route path="/" element={<MainLayout />}>
        {/* 'index' routa se zobrazí, když URL odpovídá rodičovské path="/" */}
        <Route index element={<HomePage />} />
        <Route path="o-nas" element={<AboutPage />} />
        <Route path="produkty" element={<ProductsPage />} />
        
        {/* Routa pro "nenalezeno", pokud žádná jiná nevyhovuje */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
```

### Layouty a vnořené routy (`<Outlet>`)

Často chceme mít sdílené UI (např. hlavičku, patičku) pro skupinu stránek. Toho dosáhneme pomocí **layout route**.

1.  **Vytvořte layout komponentu:** Tato komponenta obsahuje sdílené UI a komponentu `<Outlet>` z `react-router-dom`, která slouží jako "placeholder", kam se bude vykreslovat obsah vnořených rout.
    ```tsx
    // src/layouts/MainLayout.tsx
    import React from 'react';
    import { Outlet } from 'react-router-dom';
    import HlavniMenu from '../components/HlavniMenu';

    const MainLayout: React.FC = () => {
      return (
        <div>
          <header>
            <h1>Moje Aplikace</h1>
            <HlavniMenu />
          </header>
          <main>
            <Outlet /> {/* Zde se vykreslí HomePage, AboutPage, atd. */}
          </main>
          <footer>
            <p>&copy; 2024</p>
          </footer>
        </div>
      );
    };

    export default MainLayout;
    ```
2.  **Vnořte routy:** V `App.tsx` (viz příklad výše) vnoříme specifické stránky (`<Route>`) dovnitř routy s layoutem.

### Navigace mezi stránkami: Komponenta `<Link>`

Pro přechod mezi routami na straně klienta (bez full-page reloadu) se používá komponenta `<Link>` z `react-router-dom`.

* Nahrazuje standardní HTML tag `<a>`.
* Atribut `href` se zde jmenuje `to`.

```tsx
// src/components/HlavniMenu.tsx
import { Link, NavLink } from 'react-router-dom';
import React from 'react';

const HlavniMenu: React.FC = () => {
  return (
    <nav>
      <ul style={{ display: 'flex', gap: '1rem' }}>
        <li>
          <Link to="/">Domů</Link>
        </li>
        <li>
          <Link to="/o-nas">O nás</Link>
        </li>
        <li>
          {/* NavLink je speciální Link, který ví, zda je aktivní */}
          <NavLink 
            to="/produkty"
            style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}
          >
            Produkty
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default HlavniMenu;
```

### Dynamické routy (`useParams`)

Pro vytváření stránek jako `produkty/1`, `produkty/2` atd., definujeme dynamický segment v `path` pomocí dvojtečky `:`.

* **Definice:** `<Route path="/produkty/:productId" element={<ProductDetailPage />} />`
* **Přístup k parametru:** V komponentě `ProductDetailPage` použijeme hook `useParams` pro získání hodnoty z URL.

```tsx
// src/pages/ProductDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  // useParams vrátí objekt s páry klíč/hodnota z URL.
  // Typujeme ho pro TypeScript.
  const { productId } = useParams<{ productId: string }>();

  return (
    <div>
      <h1>Detail produktu</h1>
      <p>Zobrazuji informace pro produkt s ID: <strong>{productId}</strong></p>
    </div>
  );
};

export default ProductDetailPage;
```

### Programatická navigace (`useNavigate`)

Pro přesměrování uživatele na základě akce (např. po odeslání formuláře) slouží hook `useNavigate`.

```tsx
// src/components/FormularHledani.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularHledani: React.FC = () => {
  const navigate = useNavigate();
  const [hledanyVyraz, setHledanyVyraz] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hledanyVyraz.trim()) return;
    
    // Programatické přesměrování na stránku s výsledky hledání
    navigate(`/hledat?dotaz=${encodeURIComponent(hledanyVyraz)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={hledanyVyraz}
        onChange={(e) => setHledanyVyraz(e.target.value)}
        placeholder="Hledat produkt..."
      />
      <button type="submit">Hledat</button>
    </form>
  );
};
```
* `navigate('/cesta')`: Přidá novou položku do historie.
* `navigate('/cesta', { replace: true })`: Nahradí aktuální položku v historii.
* `navigate(-1)`: Přejde zpět v historii.

### Čtení Query parametrů (`useSearchParams`)

Pro čtení parametrů z URL za otazníkem (query string, např. `?dotaz=kolo`) slouží hook `useSearchParams`.

```tsx
// src/pages/SearchPage.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dotaz = searchParams.get('dotaz'); // 'kolo'

  return <div>Hledáte výraz: "{dotaz}".</div>
};
```

## Shrnutí

`react-router-dom` je standardní a výkonná knihovna pro implementaci client-side routování v Reactu. Klíčové je pochopit, jak obalit aplikaci do `<BrowserRouter>`, jak definovat routy pomocí `<Routes>` a `<Route>`, jak vytvářet sdílené layouty s `<Outlet>` a jak používat komponentu `<Link>` pro navigaci. Pro pokročilejší případy slouží hooky `useParams`, `useNavigate` a `useSearchParams`.

---

### Cvičení (Samostatná práce)

1.  **Vytvořte nový React + TypeScript projekt** pomocí Vite:
    ```bash
    npm create vite@latest moje-react-router-app -- --template react-ts
    cd moje-react-router-app
    npm install
    npm install react-router-dom @types/react-router-dom
    ```

2.  **Nastavte základní routování:**
    * V `src/main.tsx` obalte komponentu `<App />` do `<BrowserRouter>`.
    * Vytvořte adresář `src/pages` a v něm komponenty pro stránky `HomePage.tsx`, `BlogPage.tsx` a `ContactPage.tsx`. Každá bude obsahovat jednoduchý nadpis a text.
    * Vytvořte adresář `src/layouts` a v něm `MainLayout.tsx`, který bude obsahovat hlavičku, patičku a `<Outlet />`. V hlavičce bude navigační menu s odkazy (`<Link>`) na tyto tři stránky.
    * V `src/App.tsx` nastavte routování pomocí `<Routes>` a `<Route>` tak, aby se všechny tři stránky renderovaly uvnitř `MainLayout`.

3.  **Vytvořte dynamickou stránku pro detail blogového příspěvku:**
    * Vytvořte soubor `src/pages/BlogPostPage.tsx`.
    * V `App.tsx` přidejte novou vnořenou routu: `<Route path="blog/:slug" element={<BlogPostPage />} />`. (`slug` je běžný název pro textový identifikátor v URL).
    * V komponentě `BlogPostPage.tsx` použijte hook `useParams` ke čtení `slug` z URL a zobrazte ho na stránce, např. "Zobrazuji příspěvek se slugem: {slug}".
    * Na stránce `BlogPage.tsx` vytvořte několik odkazů (`<Link>`), které budou směřovat na konkrétní detaily, např.:
        * `<Link to="/blog/muj-prvni-prispevek">Můj první příspěvek</Link>`
        * `<Link to="/blog/dalsi-tema">Další téma</Link>`
    * Ověřte, že po kliknutí na odkazy se správně zobrazí stránka detailu s příslušným slugem.

4.  **(Volitelně) Zpracujte parametry vyhledávání:**
    * Na stránce `BlogPage.tsx` přidejte jednoduchý formulář (HTML `<form>`) pro vyhledávání s jedním polem `<input name="q">` a tlačítkem.
    * Pomocí hooku `useNavigate` po odeslání formuláře programaticky přesměrujte uživatele na URL jako `/blog?q=hledanyVyraz`.
    * V komponentě `BlogPage.tsx` použijte hook `useSearchParams` ke čtení hodnoty parametru `q` a vypište ji na stránce, např. "Výsledky vyhledávání pro: {dotaz}".
