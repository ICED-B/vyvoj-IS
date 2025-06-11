# 5.1 Uložené procedury a funkce v PostgreSQL

Zatímco standardní SQL příkazy jsou skvělé pro jednorázové dotazy, často potřebujeme zapouzdřit složitější logiku, kterou můžeme volat opakovaně. K tomu v PostgreSQL slouží **funkce** a **uložené procedury**, které se nejčastěji píší v jazyce **PL/pgSQL** (Procedural Language/PostgreSQL).

## Proč používat kód na straně databáze?

* **Výkon:** Složité operace provedené v rámci jedné procedury mohou být výrazně rychlejší než posílání mnoha jednotlivých dotazů z aplikace. Minimalizuje se síťová latence.
* **Znovupoužitelnost:** Jednou napsanou logiku může volat více různých aplikací nebo částí jedné aplikace, což snižuje duplicitu kódu.
* **Bezpečnost a konzistence:** Databáze může vynutit složitá pravidla a zajistit, že se data modifikují vždy stejným, kontrolovaným způsobem.
* **Zjednodušení aplikace:** Složitá databázová logika je skryta za jednoduchým voláním procedury, což činí kód aplikace čistším a přehlednějším.

## Funkce vs. Procedury

Od verze PostgreSQL 11 se formálně rozlišují funkce a procedury:

* **Funkce (FUNCTION):** Vždy vrací nějakou hodnotu (i kdyby to byl `void`). Jsou tradičním způsobem, jak v PostgreSQL psát kód. Mohou být volány v rámci SQL dotazů (`SELECT moje_funkce()`). Nemohou řídit transakce (nemohou obsahovat `COMMIT` nebo `ROLLBACK`).

* **Procedury (PROCEDURE):** Byly přidány pro lepší kompatibilitu s jinými DB systémy. Nevrací hodnotu. Volají se pomocí příkazu `CALL`. Jejich hlavní výhodou je, že **mohou řídit transakce** (mohou obsahovat `COMMIT` a `ROLLBACK`), což umožňuje provádět komplexní atomické operace.

V praxi se pro většinu běžných úkolů setkáte a vystačíte si s funkcemi.

## Základy jazyka PL/pgSQL

PL/pgSQL je blokově strukturovaný jazyk. Každý blok má následující strukturu:

```sql
[ <<label>> ]
[ DECLARE
    -- deklarace proměnných
]
BEGIN
    -- příkazy
END [ label ];
```

### Další procedurální jazyky

Ačkoliv je **PL/pgSQL** výchozí a nejčastěji používaný, síla PostgreSQL spočívá v jeho rozšiřitelnosti. Uložené procedury a funkce můžete psát i v jiných jazycích. Mezi nejznámější patří:

* **`PL/Python` (`plpython3u`):** Umožňuje psát funkce v jazyce Python. To je skvělé pro složitější logiku, datovou analýzu nebo integraci s Python knihovnami.
* **`PL/Perl` (`plperl`):** Pro fanoušky jazyka Perl.
* **`PL/Tcl` (`pltcl`):** Integrace s jazykem Tcl.
* **`SQL`:** Pro velmi jednoduché funkce, které se skládají pouze z jednoho SQL dotazu. Jsou často nejrychlejší.

#### Příklad v PL/Python

Pojďme si vytvořit stejnou sčítací funkci jako výše, ale tentokrát v Pythonu.

**Krok 1: Povolení jazyka v databázi**
Nejprve musíme v databázi povolit rozšíření pro daný jazyk. Toto se dělá pouze jednou pro celou databázi.
```sql
CREATE EXTENSION IF NOT EXISTS plpython3u;
```

**Krok 2: Vytvoření funkce**
```sql
CREATE OR REPLACE FUNCTION secti_python(a INTEGER, b INTEGER)
RETURNS INTEGER AS $$
    # V tomto bloku můžeme psát standardní Python kód
    return a + b
$$ LANGUAGE plpython3u;
```

**Volání funkce:**
Volání je úplně stejné jako u PL/pgSQL funkce.
```sql
SELECT secti_python(15, 20);
```
Výsledek bude `35`.

### Vytvoření jednoduché funkce v PL/pgSQL

Vytvořme funkci, která sečte dvě celá čísla.

```sql
CREATE OR REPLACE FUNCTION secti(a INTEGER, b INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN a + b;
END;
$$ LANGUAGE plpgsql;
```
* `CREATE OR REPLACE FUNCTION` – vytvoří novou funkci nebo nahradí existující se stejným názvem a argumenty.
* `RETURNS INTEGER` – specifikuje datový typ návratové hodnoty.
* `$$` – alternativní způsob ohraničení těla funkce (tzv. "dollar quoting"). Je to pohodlnější než jednoduché apostrofy, protože uvnitř nemusíte escapovat další apostrofy.
* `LANGUAGE plpgsql` – určuje, že funkce je napsána v jazyce PL/pgSQL.

**Volání funkce:**
```sql
SELECT secti(5, 10);
```
Výsledek bude `15`.

### Příklad s proměnnými

Funkce, která vypočítá celkovou cenu produktu s DPH.

```sql
CREATE OR REPLACE FUNCTION spocitej_cenu_s_dph(cena_bez_dph NUMERIC, sazba_dph NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
    cena_s_dph NUMERIC;
BEGIN
    -- Vypocet ceny s DPH
    cena_s_dph := cena_bez_dph * (1 + sazba_dph / 100);
    
    -- Zaokrouhleni na 2 desetinna mista
    RETURN round(cena_s_dph, 2);
END;
$$ LANGUAGE plpgsql;

-- Volání
SELECT spocitej_cenu_s_dph(100, 21);
```
Výsledek bude `121.00`.

### Vytvoření jednoduché procedury

Vytvořme proceduru, která vloží nový záznam do tabulky `log` (musí existovat).

```sql
CREATE TABLE log (
    id SERIAL PRIMARY KEY,
    zprava TEXT,
    cas_vytvoreni TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE PROCEDURE zapis_log(text_zpravy TEXT)
AS $$
BEGIN
    INSERT INTO log (zprava) VALUES (text_zpravy);
END;
$$ LANGUAGE plpgsql;
```

**Volání procedury:**
```sql
CALL zapis_log('Testovací zpráva z procedury.');

-- Kontrola obsahu tabulky
x;  
```

---

## Praktické úkoly

Pro vyřešení následujících úkolů použijte databázové prostředí z **kapitoly 2**, které obsahuje tabulky jako `authors`, `books`, `customers`, `orders` a `order_items`. Spusťte si `docker-compose.yml` z dané sekce a připojte se k databázi např. pomocí pgAdmin.

### Úkol 1: Funkce pro celé jméno autora

Vytvořte funkci `cele_jmeno_autora`, která přijme ID autora jako vstupní parametr (`author_id`) a vrátí jeho celé jméno jako jeden textový řetězec ve formátu "Jméno Příjmení".

* **Název funkce:** `cele_jmeno_autora(INTEGER)`
* **Vstup:** ID autora.
* **Výstup:** `TEXT` (např. "Karel Čapek").
* **Nápověda:** Budete muset dotázat tabulku `authors` a spojit sloupce `first_name` a `last_name` (nezapomeňte na mezeru mezi nimi).

### Úkol 2: Procedura pro vložení nové knihy

Vytvořte proceduru `pridej_knihu`, která zjednoduší vkládání nové knihy a jejího autora. Procedura přijme jméno a příjmení autora a název knihy. Logika by měla být následující:
1.  Zjistit, zda autor s daným jménem a příjmením již existuje v tabulce `authors`.
2.  Pokud autor **neexistuje**, vložit ho do tabulky `authors`.
3.  Získat ID autora (buď existujícího, nebo nově vloženého).
4.  Vložit novou knihu do tabulky `books` s příslušným `author_id`.

* **Název procedury:** `pridej_knihu(TEXT, TEXT, TEXT)`
* **Vstupy:** Jméno autora, příjmení autora, název knihy.
* **Výstup:** Žádný.
* **Nápověda:** V PL/pgSQL můžete použít `IF EXISTS (SELECT 1 FROM ...)` nebo podobnou konstrukci pro kontrolu existence záznamu. Pro získání ID nově vloženého autora můžete použít klauzuli `RETURNING id INTO promenna`.

---

V další kapitole se podíváme na triggery, které nám umožní tyto funkce a procedury volat automaticky v reakci na události v databázi.
