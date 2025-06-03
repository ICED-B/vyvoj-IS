# 9. React Hooks a správa stavu: useEffect, useContext, useReducer

V předchozí kapitole jsme se seznámili se základním hookem `useState` pro správu lokálního stavu komponenty. React nabízí další vestavěné hooky, které nám umožňují využívat více funkcí Reactu ve funkcionálních komponentách, jako je práce s vedlejšími efekty, sdílení stavu napříč komponentami nebo správa složitějších stavových logik.

## Co jsou Hooks?

Hooks jsou funkce, které vám umožní využívat stav a životní cyklus Reactu z funkcionálních komponent. Díky nim můžeme psát komponenty pouze pomocí funkcí, aniž bychom potřebovali třídní komponenty.

**Pravidla Hooks:**
1.  **Volat pouze na nejvyšší úrovni:** Nevolejte hooky uvnitř cyklů, podmínek nebo vnořených funkcí. Vždy je volejte na nejvyšší úrovni vaší React funkce.
2.  **Volat pouze z React funkcí:** Volejte hooky pouze z React funkcionálních komponent nebo z vlastních hooků (custom hooks). Nevolejte je z běžných JavaScriptových funkcí.

## `useEffect`: Práce s vedlejšími efekty

Hook `useEffect` slouží k provádění **vedlejších efektů (side effects)** ve funkcionálních komponentách. Vedlejší efekty jsou operace, které se dějí mimo běžný tok renderování komponenty, jako například:

* Načítání dat z API (`fetch`).
* Manuální změny DOMu (i když by se to mělo minimalizovat).
* Nastavování a rušení odběrů (subscriptions, např. k WebSockets).
* Nastavování a rušení časovačů (`setTimeout`, `setInterval`).
* Aktualizace titulku dokumentu (`document.title`).

**Syntaxe:**
```typescript
import React, { useState, useEffect } from 'react';

useEffect(() => {
  // Kód vedlejšího efektu, který se spustí po každém renderu (pokud nejsou specifikovány závislosti)
  // Například:
  // document.title = `Kliknuto ${pocet} krát`;

  // Volitelná "cleanup" funkce (úklidová funkce)
  return () => {
    // Tento kód se spustí před odmontováním komponenty (unmount)
    // nebo před dalším spuštěním efektu (pokud se změní závislosti).
    // Užitečné pro rušení odběrů, časovačů atd.
    // console.log("Komponenta se odmontovává nebo efekt se znovu spouští...");
  };
}, [/* poleZavislosti */]); // Volitelné pole závislostí
```

**Pole závislostí (`dependencies array`):**
Druhý argument `useEffect` je pole hodnot, na kterých efekt závisí.
* **Pokud pole závislostí chybí (`useEffect(() => { ... });`):** Efekt se spustí po **každém** renderu komponenty. To může být neefektivní a vést k nekonečným smyčkám, pokud efekt sám způsobuje re-render.
* **Pokud je pole závislostí prázdné (`useEffect(() => { ... }, []);`):** Efekt se spustí **pouze jednou**, po prvním renderu komponenty (ekvivalent `componentDidMount` u třídních komponent). Cleanup funkce se pak spustí, když se komponenta přestane používat.
* **Pokud pole závislostí obsahuje proměnné/props (`useEffect(() => { ... }, [prop1, stav1]);`):** Efekt se spustí po prvním renderu a poté **vždy, když se změní hodnota některé ze závislostí** v poli. Cleanup funkce se spustí před každým novým spuštěním efektu (kvůli změně závislosti) a při odmontování.

**Příklad: Načítání dat z API**
```typescript
// src/components/SeznamUkolu.tsx
import React, { useState, useEffect } from 'react';

interface Ukol {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

const SeznamUkolu: React.FC = () => {
  const [ukoly, setUkoly] = useState<Ukol[]>([]);
  const [nacitam, setNacitam] = useState<boolean>(true);
  const [chyba, setChyba] = useState<string | null>(null);

  useEffect(() => {
    const nactiUkoly = async () => {
      setNacitam(true);
      setChyba(null);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        if (!response.ok) {
          throw new Error(`HTTP chyba! Stav: ${response.status}`);
        }
        const data: Ukol[] = await response.json();
        setUkoly(data);
      } catch (err: any) {
        setChyba(err.message || 'Nepodařilo se načíst úkoly.');
      } finally {
        setNacitam(false);
      }
    };

    nactiUkoly();

    // Cleanup funkce zde není nutná, protože fetch se provede jen jednou.
  }, []); // Prázdné pole závislostí -> efekt se spustí jen jednou po prvním renderu

  if (nacitam) return <p>Načítám úkoly...</p>;
  if (chyba) return <p style={{ color: 'red' }}>Chyba: {chyba}</p>;

  return (
    <div>
      <h2>Seznam úkolů (načteno z API)</h2>
      <ul>
        {ukoly.map(ukol => (
          <li key={ukol.id} style={{ textDecoration: ukol.completed ? 'line-through' : 'none' }}>
            {ukol.title} (ID uživatele: {ukol.userId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeznamUkolu;
```

**Příklad: Efekt závislý na prop/stavu**
```typescript
// src/components/DokumentTitulek.tsx
import React, { useState, useEffect } from 'react';

const DokumentTitulek: React.FC = () => {
  const [pocet, setPocet] = useState<number>(0);

  // Tento efekt se spustí vždy, když se změní hodnota 'pocet'
  useEffect(() => {
    document.title = `Kliknuto ${pocet} krát`;
    console.log(`Titulek dokumentu aktualizován na: Kliknuto ${pocet} krát`);

    // Příklad cleanup funkce (zde spíše pro demonstraci)
    return () => {
      console.log(`Cleanup efektu pro počet: ${pocet}`);
    };
  }, [pocet]); // Závislost na stavu 'pocet'

  return (
    <div>
      <p>Aktuální počet pro titulek: {pocet}</p>
      <button onClick={() => setPocet(p => p + 1)}>Zvyš počet pro titulek</button>
    </div>
  );
};
export default DokumentTitulek;
```

## `useContext`: Sdílení stavu napříč komponentami

Někdy potřebujeme sdílet data (stav) mezi mnoha komponentami, které nejsou přímými rodiči/potomky, aniž bychom museli použivat prop drilling přes mnoho úrovní. K tomu slouží **React Context API** a hook `useContext`.

**Kroky pro použití Contextu:**

1.  **Vytvoření Contextu (`React.createContext`)**:
    * Vytvoří objekt Contextu. Můžete mu dát výchozí hodnotu.
    ```typescript
    // src/contexts/AuthContext.tsx
    import React, { createContext, useState, useContext, ReactNode } from 'react';

    interface AuthContextType {
      uzivatel: string | null;
      prihlasit: (jmeno: string) => void;
      odhlasit: () => void;
    }

    // Vytvoření kontextu s výchozí hodnotou (může být i undefined, pokud provider vždy existuje)
    // Zde definujeme typ a výchozí hodnoty, které by měl provider poskytnout.
    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    // Provider komponenta, která bude obalovat část aplikace mající přístup k tomuto kontextu
    export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
      const [uzivatel, setUzivatel] = useState<string | null>(null);

      const prihlasit = (jmeno: string) => setUzivatel(jmeno);
      const odhlasit = () => setUzivatel(null);

      return (
        <AuthContext.Provider value={{ uzivatel, prihlasit, odhlasit }}>
          {children}
        </AuthContext.Provider>
      );
    };

    // Vlastní hook pro snadnější použití kontextu
    export const useAuth = (): AuthContextType => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth musí být použit uvnitř AuthProvidera');
      }
      return context;
    };
    ```

2.  **Poskytnutí Contextu (`<MyContext.Provider value={...}>`)**:
    * Komponenta Provider obalí část stromu komponent, které mají mít přístup k hodnotě contextu.
    * Atribut `value` providera obsahuje data, která budou sdílena.
    ```typescript
    // src/main.tsx nebo src/App.tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App';
    import { AuthProvider } from './contexts/AuthContext'; // Import providera

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <AuthProvider> {/* Obalení aplikace providerem */}
          <App />
        </AuthProvider>
      </React.StrictMode>,
    );
    ```

3.  **Použití Contextu (`useContext`)**:
    * V jakékoli dceřiné komponentě (uvnitř Providera) můžeme přistoupit k hodnotě contextu pomocí hooku `useContext`.
    ```typescript
    // src/components/ProfilUzivatele.tsx
    import React from 'react';
    import { useAuth } from '../contexts/AuthContext'; // Import vlastního hooku

    const ProfilUzivatele: React.FC = () => {
      const { uzivatel, prihlasit, odhlasit } = useAuth(); // Použití kontextu

      if (!uzivatel) {
        return (
          <div>
            <p>Nejste přihlášeni.</p>
            <button onClick={() => prihlasit("Testovací Uživatel")}>Přihlásit</button>
          </div>
        );
      }

      return (
        <div>
          <p>Přihlášen jako: {uzivatel}</p>
          <button onClick={odhlasit}>Odhlásit</button>
        </div>
      );
    };
    export default ProfilUzivatele;
    ```
    V `App.tsx` pak můžete použít `ProfilUzivatele`.

Context API je vhodné pro sdílení "globálních" dat, jako jsou informace o přihlášeném uživateli, téma vzhledu, jazykové preference atd. Pro velmi komplexní správu stavu celé aplikace se často používají specializované knihovny jako Redux, Zustand nebo Recoil.

## `useReducer`: Správa složitějších stavů

Pro komponenty se složitější logikou aktualizace stavu, kde nový stav závisí na více faktorech nebo předchozím stavu komplexním způsobem, může být `useState` méně přehledný. V takových případech je alternativou hook `useReducer`.

`useReducer` je inspirován reducery z Reduxu. Přijímá **reducer funkci** a **počáteční stav**.

* **Reducer funkce:** `(stav, akce) => novyStav`
    * Přijímá aktuální stav a objekt "akce" (action).
    * Na základě typu akce a jejích dat (payload) vrací nový stav.
    * **Musí být čistá funkce** (pure function) – pro stejný vstup (stav, akce) vždy vrátí stejný výstup a nemá vedlejší efekty.
* **Počáteční stav:** Výchozí hodnota stavu.
* **`dispatch` funkce:** Funkce vrácená `useReducer`, kterou voláme pro odeslání (dispatch) akce do reduceru.

**Syntaxe:**
```typescript
const [stav, dispatch] = useReducer(reducer, pocatecniStav, [initFunkce]);
```
* `initFunkce` (volitelné): Funkce pro línou inicializaci stavu.

**Příklad: Složitější počítadlo s `useReducer`**
```typescript
// src/components/ReducerPocitadlo.tsx
import React, { useReducer } from 'react';

// Typy pro stav a akce
interface StavPocitadla {
  pocet: number;
  pocetKroku: number;
}

type AkcePocitadla =
  | { type: 'INKREMENT' }
  | { type: 'DEKREMENT' }
  | { type: 'NASTAV_KROK'; krok: number }
  | { type: 'RESET' };

// Počáteční stav
const pocatecniStavPocitadla: StavPocitadla = {
  pocet: 0,
  pocetKroku: 1,
};

// Reducer funkce
function reducerPocitadla(stav: StavPocitadla, akce: AkcePocitadla): StavPocitadla {
  switch (akce.type) {
    case 'INKREMENT':
      return { ...stav, pocet: stav.pocet + stav.pocetKroku };
    case 'DEKREMENT':
      return { ...stav, pocet: stav.pocet - stav.pocetKroku };
    case 'NASTAV_KROK':
      return { ...stav, pocetKroku: akce.krok };
    case 'RESET':
      return pocatecniStavPocitadla;
    default:
      // Pro neznámé akce je dobré vyhodit chybu nebo vrátit původní stav
      // V TypeScriptu by neznámá akce měla být odchycena typovým systémem,
      // pokud je `AkcePocitadla` dobře definována.
      // Pro jistotu můžeme přidat:
      // const _nepokrytaAkce: never = akce; // Toto způsobí chybu při kompilaci, pokud nejsou všechny akce pokryty
      return stav;
  }
}

const ReducerPocitadlo: React.FC = () => {
  const [stav, dispatch] = useReducer(reducerPocitadla, pocatecniStavPocitadla);

  return (
    <div>
      <h2>Počítadlo s useReducer</h2>
      <p>Aktuální počet: {stav.pocet}</p>
      <p>Krok: {stav.pocetKroku}</p>
      
      <input 
        type="number" 
        value={stav.pocetKroku} 
        onChange={(e) => dispatch({ type: 'NASTAV_KROK', krok: parseInt(e.target.value, 10) || 1 })}
        placeholder="Nastav krok"
      />
      <br />
      <button onClick={() => dispatch({ type: 'INKREMENT' })}>Přidat (o krok)</button>
      <button onClick={() => dispatch({ type: 'DEKREMENT' })}>Ubrat (o krok)</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
};

export default ReducerPocitadlo;
```
**Výhody `useReducer`:**
* Odděluje logiku aktualizace stavu od komponenty (do reducer funkce).
* Usnadňuje testování logiky stavu (reducer je čistá funkce).
* Vhodnější pro složitější stavy a přechody mezi nimi.
* Optimalizace výkonu pomocí `dispatch` (React zaručuje, že `dispatch` funkce je stabilní a nemění se mezi rendery).

## Další vestavěné Hooky (Stručný přehled)

* **`useCallback`**: Vrací memoizovanou verzi callback funkce. Změní se pouze tehdy, pokud se změní některá z jejích závislostí. Užitečné pro optimalizaci, když předáváte callbacky do optimalizovaných dceřiných komponent (např. těch, které používají `React.memo`).
* **`useMemo`**: Vrací memoizovanou hodnotu. Přepočítá hodnotu pouze tehdy, pokud se změní některá z jejích závislostí. Užitečné pro optimalizaci náročných výpočtů.
* **`useRef`**: Vrací mutabilní ref objekt, jehož `.current` vlastnost je inicializována předaným argumentem. Ref objekt přetrvává po celou dobu životnosti komponenty. Používá se pro:
    * Přímý přístup k DOM elementům (např. pro fokus, měření velikosti).
    * Uchovávání mutabilních hodnot, které nezpůsobují re-render při změně (podobně jako instanční proměnné u tříd).
* **`useLayoutEffect`**: Podobný `useEffect`, ale spouští se synchronně po všech DOM mutacích. Používá se zřídka, typicky pro měření layoutu předtím, než prohlížeč vykreslí změny.
* **`useImperativeHandle`**: Přizpůsobuje instanci, která je vystavena rodičovským komponentám při použití `ref` (používá se s `forwardRef`).
* **`useDebugValue`**: Zobrazuje label pro vlastní hooky v React Developer Tools.

## Vlastní Hooky (Custom Hooks)

Umožňují extrahovat logiku komponent do znovupoužitelných funkcí. Vlastní hook je JavaScriptová/TypeScriptová funkce, jejíž název začíná slovem `use` a která může volat jiné hooky.

**Příklad: Vlastní hook pro práci s input polem**
```typescript
// src/hooks/useInput.ts
import { useState, ChangeEvent } from 'react';

interface InputHook {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  reset: () => void;
}

function useInput(pocatecniHodnota: string = ""): InputHook {
  const [value, setValue] = useState<string>(pocatecniHodnota);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const resetValue = () => {
    setValue(pocatecniHodnota);
  };

  return {
    value,
    onChange: handleChange,
    reset: resetValue,
  };
}

export default useInput;

// Použití v komponentě:
// import useInput from '../hooks/useInput';
// const jmenoInput = useInput('');
// <input type="text" value={jmenoInput.value} onChange={jmenoInput.onChange} />
// <button onClick={jmenoInput.reset}>Vymazat jméno</button>
```

## Shrnutí

React Hooks poskytují mocný a flexibilní způsob, jak spravovat stav, vedlejší efekty a další aspekty Reactu ve funkcionálních komponentách. `useEffect` je klíčový pro interakci s vnějším světem (API, DOM mimo React), `useContext` pro sdílení globálního stavu a `useReducer` pro zvládání složitějších stavových logik. Vlastní hooky pak umožňují vytvářet znovupoužitelné abstrakce. Použití TypeScriptu s hooky dále zvyšuje robustnost a čitelnost kódu díky typové kontrole.

---

### Cvičení (Samostatná práce)

1.  **Komponenta s `useEffect` pro načítání dat:**
    * Vytvořte komponentu `PrispevekDetail.tsx`, která přijímá `id` příspěvku jako prop.
    * Pomocí `useEffect` a `fetch` načtěte detail jednoho příspěvku z `https://jsonplaceholder.typicode.com/posts/{id}`.
    * Zobrazte titulek a tělo příspěvku.
    * Zpracujte stavy načítání (loading) a chyby.
    * V `App.tsx` zobrazte tuto komponentu, např. pro `id={1}`.
2.  **Použití `useContext` pro jednoduché téma:**
    * Vytvořte jednoduchý `ThemeContext` (např. v `src/contexts/ThemeContext.tsx`), který bude poskytovat aktuální téma (`'light'` nebo `'dark'`) a funkci pro jeho přepnutí.
    * Vytvořte `ThemeProvider` komponentu.
    * Obalte vaši `App` komponentu (nebo její část) `ThemeProviderem`.
    * Vytvořte komponentu `PrepinacTematu.tsx`, která pomocí `useContext` získá aktuální téma a funkci pro přepnutí, a zobrazí tlačítko pro přepínání tématu.
    * Vytvořte další komponentu (např. `ObsahSTematem.tsx`), která také použije `useContext` k získání tématu a podle něj změní svou barvu pozadí nebo textu.
3.  **(Volitelně) Refaktorujte `ReducerPocitadlo.tsx` (z příkladu výše) nebo si vytvořte vlastní komponentu s `useReducer`:**
    * Zkuste přidat další akce do reduceru (např. násobení, dělení, nastavení konkrétní hodnoty).
    * Přidejte tlačítka pro tyto nové akce.
4.  **(Volitelně) Vytvořte jednoduchý vlastní hook:**
    * Například `useDocumentTitle(titulek: string)`, který pomocí `useEffect` nastaví titulek dokumentu a aktualizuje ho, pokud se `titulek` změní. Použijte ho v některé vaší komponentě.

*(Tato cvičení vám pomohou prohloubit znalosti nejdůležitějších React Hooků a jejich praktického využití s TypeScriptem.)*
