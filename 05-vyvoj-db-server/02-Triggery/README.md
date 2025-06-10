# 5.2 Triggery v PostgreSQL

Zatímco uložené procedury musíme volat explicitně, **triggery** (spouštěče) nám umožňují spouštět kód **automaticky** v reakci na určité události v databázi. Jsou mocným nástrojem pro automatizaci, validaci a auditování změn dat.

## Co je to Trigger?

Trigger je specifikace, která říká databázi, aby automaticky spustila určitou funkci (tzv. **trigger funkci**) vždy, když dojde k definované datové operaci (`INSERT`, `UPDATE`, `DELETE`) na konkrétní tabulce.

Proces vytvoření triggeru má dva kroky:
1.  **Vytvoření trigger funkce:** Jedná se o speciální typ funkce, která nebere žádné argumenty a vrací datový typ `TRIGGER`.
2.  **Vytvoření (definice) triggeru:** Tímto příkazem propojíme trigger funkci s konkrétní tabulkou, událostí (`INSERT`, `UPDATE`, ...), a určíme, kdy se má spustit (`BEFORE` nebo `AFTER` události).

## Kdy použít triggery?

* **Auditování a logování změn:** Automaticky zaznamenávat, kdo, kdy a jak změnil data v citlivých tabulkách.
* **Složitá validace dat:** Vynucení komplexních pravidel, která nelze definovat pomocí standardních `CHECK` omezení (např. pravidla závislá na stavu jiných tabulek).
* **Udržování denormalizovaných dat:** Automatická aktualizace souhrnných hodnot v jiných tabulkách (např. přepočítání celkového počtu produktů v kategorii po vložení nového produktu).
* **Zabránění neplatným operacím:** Například zakázání smazání záznamu, pokud na něj existují reference jinde.

## 1. Vytvoření Trigger Funkce

Trigger funkce je podobná běžné funkci v PL/pgSQL, ale má několik specifik:
* Nevstupují do ní žádné argumenty.
* Vždy musí vracet datový typ `TRIGGER` (nebo `NULL` pro přerušení operace).
* Má přístup ke speciálním proměnným, které obsahují kontext události:
    * `NEW`: Záznam obsahující nové hodnoty (dostupný pro `INSERT` a `UPDATE`).
    * `OLD`: Záznam obsahující staré hodnoty před změnou (dostupný pro `UPDATE` a `DELETE`).
    * `TG_OP`: Textová proměnná s názvem operace, která trigger spustila (`'INSERT'`, `'UPDATE'`, `'DELETE'`).
    * `TG_TABLE_NAME`: Název tabulky, na které se trigger spustil.

**Příklad kostry trigger funkce:**
```sql
CREATE OR REPLACE FUNCTION moje_trigger_funkce()
RETURNS TRIGGER AS $$
BEGIN
    -- Zde bude logika triggeru
    -- Můžeme pracovat s proměnnými NEW a OLD
    
    -- Pokud trigger běží PŘED operací (BEFORE), můžeme modifikovat řádek NEW.
    -- Např. NEW.last_updated := NOW();
    
    -- Na konci vrátíme buď NEW (pro INSERT/UPDATE) nebo OLD (pro DELETE)
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;
```

## 2. Vytvoření (definice) Triggeru

Po vytvoření funkce ji musíme "pověsit" na tabulku.

```sql
CREATE TRIGGER nazev_triggeru
{ BEFORE | AFTER } { INSERT | UPDATE | DELETE }
ON nazev_tabulky
FOR EACH ROW
EXECUTE FUNCTION moje_trigger_funkce();
```

* `BEFORE` / `AFTER`: Určuje, zda se má funkce spustit před provedením operace, nebo až po ní.
    * `BEFORE` triggery jsou ideální pro validaci a modifikaci dat před uložením.
    * `AFTER` triggery se hodí pro logování nebo akce, které závisí na úspěšném dokončení operace.
* `FOR EACH ROW`: Specifikuje, že se má funkce spustit pro každý jednotlivý řádek ovlivněný operací. Existuje i `FOR EACH STATEMENT`, který se spustí jen jednou pro celý příkaz, ale je méně častý.

### Kompletní příklad: Logování změn ceny knihy

Chceme zaznamenat každou změnu ceny v tabulce `books` do samostatné tabulky `price_history`.

**Krok A: Vytvoření logovací tabulky**
```sql
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id),
    old_price NUMERIC(10, 2),
    new_price NUMERIC(10, 2),
    changed_on TIMESTAMPTZ DEFAULT NOW()
);
```

**Krok B: Vytvoření trigger funkce**
```sql
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Spustí se jen při UPDATE a jen pokud se cena opravdu změnila
    IF TG_OP = 'UPDATE' AND NEW.price <> OLD.price THEN
        INSERT INTO price_history(book_id, old_price, new_price)
        VALUES(OLD.book_id, OLD.price, NEW.price);
    END IF;

    -- Vrátíme nový řádek, aby operace UPDATE mohla pokračovat
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Krok C: Vytvoření triggeru**
```sql
CREATE TRIGGER books_price_update_trigger
AFTER UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION log_price_change();
```

**Testování:**
```sql
-- Zkusíme změnit cenu knihy s ID 1
UPDATE books SET price = 25.99 WHERE book_id = 1;

-- Zkontrolujeme logovací tabulku
SELECT * FROM price_history;
```

---

## Praktické úkoly

Opět použijte databázové prostředí z **kapitoly 2**.

### Úkol 1: Trigger pro kontrolu záporné ceny

Vytvořte trigger, který se spustí **před** operací `INSERT` nebo `UPDATE` na tabulce `books`. Pokud je nová cena (`NEW.price`) záporná, trigger by měl vyvolat chybu a zabránit uložení záznamu.

* **Trigger funkce:** `check_non_negative_price()`
* **Trigger:** `books_price_check_trigger` na tabulce `books`.
* **Nápověda:** V PL/pgSQL můžete vyvolat chybu pomocí `RAISE EXCEPTION 'Zpráva o chybě';`. Tím se celá transakce automaticky přeruší.

### Úkol 2: Trigger pro automatické nastavení data poslední změny

1.  Do tabulky `books` přidejte nový sloupec `last_updated` typu `TIMESTAMPTZ`.
    ```sql
    ALTER TABLE books ADD COLUMN last_updated TIMESTAMPTZ;
    ```
2.  Vytvořte trigger, který při každé operaci `UPDATE` na řádku v tabulce `books` automaticky nastaví hodnotu sloupce `last_updated` na aktuální čas a datum.

* **Trigger funkce:** `update_last_updated_column()`
* **Trigger:** `books_last_updated_trigger` na tabulce `books`, spouštěný `BEFORE UPDATE`.
* **Nápověda:** V těle funkce stačí přiřadit `NEW.last_updated := NOW();`.

### Úkol 3: Trigger bránící smazání autora s knihami

Vytvořte trigger, který zabrání smazání autora z tabulky `authors`, pokud má tento autor stále přiřazeny nějaké knihy v tabulce `books`.

* **Trigger funkce:** `check_author_books_before_delete()`
* **Trigger:** `authors_delete_protection_trigger` na tabulce `authors`, spouštěný `BEFORE DELETE`.
* **Nápověda:** V trigger funkci musíte zkontrolovat, zda existují nějaké záznamy v tabulce `books`, kde `author_id` odpovídá `OLD.author_id` (ID autora, kterého se snažíte smazat). Pokud ano, vyvolejte výjimku.
