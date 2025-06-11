# 3. Zabezpečení a ochrana dat

Mít rychlou a zálohovanou databázi je skvělé, ale musíme také zajistit, aby k datům přistupovali pouze oprávnění uživatelé a mohli provádět jen ty operace, které skutečně potřebují. Správné nastavení přístupových práv je základním kamenem bezpečnosti každého informačního systému.

## Princip minimálních oprávnění (Principle of Least Privilege)

Základní bezpečnostní pravidlo zní: **Každý uživatel nebo proces by měl mít pouze ta oprávnění, která jsou nezbytně nutná k vykonání jeho úkolů.**

To znamená, že běžný uživatel aplikace by neměl mít právo mazat tabulky. Webová aplikace, která data pouze čte, by neměla mít právo je měnit. Tímto přístupem minimalizujeme škody, které může způsobit chyba v aplikaci, bezpečnostní útok nebo lidské selhání.

## Uživatelé a Role v PostgreSQL

PostgreSQL má velmi flexibilní systém správy oprávnění založený na **rolích**. V podstatě je všechno role. I uživatel je jen role s atributem `LOGIN`, který jí umožňuje přihlásit se.

* **Role:** Lze si ji představit jako skupinu oprávnění (např. "čtenář", "editor", "administrátor"). Rolím se přidělují práva k databázovým objektům.
* **Uživatel:** Je role, která se může přihlásit. Uživatelům se typicky nepřidělují práva přímo, ale stanou se členy jedné nebo více rolí a tím "zdědí" jejich oprávnění.

Tento koncept zjednodušuje správu: místo nastavování práv pro desítky uživatelů jednotlivě stačí nastavit práva pro několik rolí a uživatele do těchto rolí přiřazovat.

### Vytváření rolí a uživatelů

**Vytvoření role (skupiny oprávnění):**
```sql
-- Role pro uživatele, kteří mohou pouze číst data z tabulek
CREATE ROLE ctenari;

-- Role pro aplikaci, která bude moci číst i zapisovat
CREATE ROLE aplikace_editor;
```

**Vytvoření uživatele (role s právem přihlášení):**
```sql
-- Uživatel pro naši webovou aplikaci
CREATE USER web_app WITH PASSWORD 'super_tajne_heslo';

-- Uživatel pro analytika, který bude data jen číst
CREATE USER analytik WITH PASSWORD 'dalsi_heslo123';
```

**Přiřazení uživatele do role:**
```sql
-- Naše aplikace bude mít práva editora
GRANT aplikace_editor TO web_app;

-- Analytik bude mít práva čtenáře
GRANT ctenari TO analytik;
```

## Správa oprávnění: `GRANT` a `REVOKE`

Příkazem `GRANT` práva přidělujeme a příkazem `REVOKE` je odebíráme. Práva lze definovat na různých úrovních: pro celou databázi, pro schéma, pro jednotlivé tabulky, pohledy, funkce a dokonce i pro jednotlivé sloupce.

### Základní oprávnění pro tabulky:
* `SELECT`: Právo číst data (používat `SELECT`).
* `INSERT`: Právo vkládat nové řádky (`INSERT`).
* `UPDATE`: Právo měnit existující řádky (`UPDATE`).
* `DELETE`: Právo mazat řádky (`DELETE`).
* `TRUNCATE`: Právo rychle smazat všechny řádky z tabulky (`TRUNCATE`).
* `USAGE`: Pro sekvence a schémata - právo je používat.
* `ALL PRIVILEGES`: Všechna výše uvedená práva.

### Příklady použití `GRANT`

Pojďme nastavit práva pro naše role:

```sql
-- Role "ctenari" může číst ze VŠECH tabulek ve schématu public
GRANT USAGE ON SCHEMA public TO ctenari;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ctenari;

-- Role "aplikace_editor" může všechno kromě mazání
GRANT USAGE ON SCHEMA public TO aplikace_editor;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO aplikace_editor;
-- Musíme také přidělit právo na používání sekvencí pro generování ID
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO aplikace_editor;
```
**Důležitá poznámka:** `GRANT ... ON ALL TABLES` nastaví práva pouze pro **aktuálně existující** tabulky. Pro tabulky vytvořené v budoucnu je potřeba použít `ALTER DEFAULT PRIVILEGES`.

### Příklad použití `REVOKE`

Pokud zjistíme, že analytik už nemá mít přístup ke všem tabulkám:
```sql
-- Odebereme právo číst z tabulky `orders`
REVOKE SELECT ON TABLE orders FROM ctenari;
```
Tímto krokem všichni uživatelé v roli `ctenari` (včetně našeho `analytik`) ztratí přístup k tabulce `orders`, ale ostatní tabulky mohou stále číst.

---

## Praktické úkoly

1.  **Vytvořte dvě role:**
    * `report_user`: Role určená pro generování reportů. Bude potřebovat pouze číst data.
    * `data_entry_user`: Role pro uživatele, kteří vkládají data. Budou potřebovat vkládat a upravovat data, ale ne mazat.
2.  **Vytvořte uživatele:** Vytvořte nového uživatele `brigadnik` s heslem a přiřaďte mu roli `data_entry_user`.
3.  **Nastavte oprávnění pro `report_user`:**
    * Přidělte roli `report_user` právo `SELECT` na tabulky `books` a `authors`.
4.  **Nastavte oprávnění pro `data_entry_user`:**
    * Přidělte roli `data_entry_user` práva `INSERT` a `UPDATE` na tabulku `book` a `authors`.
    * Dále jí přidělte právo `SELECT` na tabulku `books` a `authors`, aby uživatel viděl, co vkládá/upravuje.
5.  **(Bonus):** Zkuste se připojit k databázi jako uživatel `brigadnik` a ověřte, že můžete vložit nový záznam do tabulky `authors` a upravit existující záznam v tabulce `books`, ale nemůžete například smazat záznam nebo číst z tabulky `publishers`.
