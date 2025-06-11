# 1. Ladění výkonu SQL dotazů

Jedním z nejčastějších problémů, se kterými se setkáte v provozu, jsou "pomalé dotazy". Dotaz, který na malém množství testovacích dat funguje bleskově, může s rostoucím objemem dat v produkční databázi trvat sekundy, nebo dokonce minuty. Schopnost identifikovat, analyzovat a optimalizovat takové dotazy je základní dovedností každého vývojáře.

## Proč je dotaz pomalý?

Nejčastější příčiny pomalých dotazů jsou:
* **Chybějící indexy:** Databáze musí prohledat celou tabulku (tzv. "full table scan"), aby našla požadované řádky.
* **Špatně napsané dotazy:** Zbytečně složité `JOIN` operace, neefektivní poddotazy nebo nevhodné použití funkcí v `WHERE` klauzuli.
* **Zastaralé statistiky:** Databázový plánovač si o datech udržuje statistiky, aby mohl zvolit nejlepší strategii provedení dotazu. Pokud jsou zastaralé, může zvolit špatný plán.
* **Hardwarové limity:** Nedostatek paměti (RAM), pomalé disky nebo přetížený procesor.

## Příprava dat pro testování výkonu

Abychom mohli smysluplně měřit a porovnávat výkon dotazů, potřebujeme dostatečně velký vzorek dat. Na několika desítkách záznamů rozdíl mezi efektivním a neefektivním dotazem nepoznáme.

Spusťte si skript `generation_script.sql` ve vaší databázi (`knihovna`). Skript vygeneruje tisíce autorů a vydavatelů a statisíce knih. Generování může trvat několik minut.

## Analýza prováděcího plánu: `EXPLAIN`

Základním nástrojem pro analýzu dotazů v PostgreSQL je příkaz `EXPLAIN`. Ten neprovede samotný dotaz, ale ukáže nám, jak by ho databáze **plánovala provést**. Zobrazí tzv. **prováděcí plán** (execution plan).


```sql
EXPLAIN SELECT * FROM books WHERE title = '1984';
```
Výstup může vypadat například takto:
```
                          QUERY PLAN
----------------------------------------------------
Seq Scan on books  (cost=0.00..1.26 rows=1 width=52)
Filter: ((title)::text = '1984'::text)
```
* **Seq Scan (Sequential Scan):** Znamená, že databáze musí projít tabulku `books` řádek po řádku, protože pro sloupec `title` neexistuje index.
* **cost:** Odhad náročnosti operace. První číslo je cena startu, druhé celková cena.
* **rows:** Odhadovaný počet řádků, které operace vrátí.

### `EXPLAIN ANALYZE`

Ještě užitečnější je `EXPLAIN ANALYZE`, který dotaz **skutečně provede** a zobrazí plán spolu s reálnými časy a počty řádků.

```sql
EXPLAIN ANALYZE SELECT * FROM books WHERE title = '1984';
```
Výstup:
```
                                               QUERY PLAN
----------------------------------------------------------------------------------------------
Seq Scan on books  (cost=0.00..1.26 rows=1 width=52) (actual time=0.517..0.520 rows=1 loops=1)
Filter: ((title)::text = '1984'::text)
Rows Removed by Filter: 20
Planning Time: 0.593 ms
Execution Time: 0.556 ms
```
* **actual time:** Reálný čas v milisekundách.
* **Execution Time:** Celkový čas provedení dotazu.

## Zázračný lék: Indexy

**Index** je speciální datová struktura (nejčastěji B-strom), která umožňuje databázi extrémně rychle vyhledat řádky podle hodnot v indexovaném sloupci (nebo více sloupcích). Představte si ho jako rejstřík na konci knihy – místo listování celé knihy se podíváte do rejstříku a okamžitě víte, na které stránce se dané slovo nachází.

### Vytvoření indexu

Vytvoříme index pro sloupec `title` v tabulce `books`.
```sql
CREATE INDEX idx_books_title ON books(title);
```

Nyní se podívejme znovu na plán dotazu:
```sql
EXPLAIN ANALYZE SELECT * FROM books WHERE title = '1984';
```
Výstup se změní:
```
                                                     QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------
 Index Scan using idx_books_title on books  (cost=0.29..8.30 rows=1 width=59) (actual time=0.024..0.025 rows=1 loops=1)
   Index Cond: (title = '1984'::text)
 Planning Time: 0.150 ms
 Execution Time: 0.035 ms
```
Místo `Seq Scan` nyní databáze použila `Index Scan`, což je u velkých tabulek o několik řádů rychlejší.

### Kdy a jak indexovat?

* **Indexujte sloupce, které se často používají v `WHERE` klauzulích a pro `JOIN` operace.** To jsou typicky cizí klíče (`author_id`, `customer_id`) a sloupce používané pro filtrování.
* **Nepřehánějte to s indexy.** Každý index zabírá místo na disku a zpomaluje operace zápisu (`INSERT`, `UPDATE`, `DELETE`), protože se musí aktualizovat spolu s tabulkou.
* **Pro sloupce s nízkou kardinalitou** (málo unikátních hodnot, např. pohlaví) nemusí být index efektivní.
* **Složené indexy:** Pokud často filtrujete podle více sloupců najednou, vytvořte index přes všechny tyto sloupce. Např. `CREATE INDEX ON orders(customer_id, order_date);`

Ladění výkonu je iterativní proces. Použijte `EXPLAIN`, identifikujte úzké hrdlo, zkuste přidat index nebo přepsat dotaz a znovu měřte.

## Praktické úkoly

Po spuštění generačního skriptu máte databázi plnou dat. Nyní si vyzkoušejte optimalizovat následující dotazy. U každého úkolu:
1.  Nejprve spusťte dotaz s `EXPLAIN ANALYZE` a poznamenejte si čas provedení a typ skenování (`Seq Scan`).
2.  Vytvořte vhodný index (nebo indexy).
3.  Spusťte dotaz s `EXPLAIN ANALYZE` znovu a porovnejte čas provedení a plán dotazu (`Index Scan`).

### Úkol 1: Vyhledání knih podle ISBN

```sql
-- Použijte nějaké reálné ISBN z vaší databáze
EXPLAIN ANALYZE SELECT * FROM books WHERE isbn = '...'; 
```

### Úkol 2: Vyhledání všech knih od konkrétního vydavatele

```sql
-- Použijte ID existujícího vydavatele
EXPLAIN ANALYZE 
SELECT * FROM books b
JOIN publishers p ON b.publisher_id = p.publisher_id
WHERE p.name = 'Vydavatel 150';
```

### Úkol 3: Vyhledání autorů podle příjmení a roku narození

```sql
EXPLAIN ANALYZE 
SELECT * FROM authors
WHERE last_name = 'Příjmení42' AND birth_year > 1950;
```