# 5. Vývoj DB Serveru: Pokročilé funkce PostgreSQL

V předchozích kapitolách jsme se naučili základy práce s relačními databázemi a jazykem SQL. Nyní se posuneme o krok dál a prozkoumáme pokročilejší funkce, které nám databázový systém PostgreSQL nabízí přímo na serverové straně.

Často je výhodné přesunout část aplikační logiky přímo do databáze. Tím můžeme dosáhnout vyššího výkonu (odpadá síťová komunikace), lepší konzistence dat a znovupoužitelnosti kódu. Mezi klíčové nástroje pro tento účel patří **uložené procedury** a **triggery**.

V této sekci se naučíme:
*   Vytvářet a používat vlastní funkce a uložené procedury v jazyce PL/pgSQL.
*   Automatizovat akce v databázi pomocí triggerů, které reagují na změny dat (INSERT, UPDATE, DELETE).
    
## Témata

1.  [**Uložené procedury a funkce**](./01-Ulozene-procedury/README.md)
    *   Rozdíl mezi funkcí a procedurou. 
    *   Základy syntaxe jazyka PL/pgSQL (proměnné, podmínky, cykly).
    *   Tvorba a volání vlastních funkcí a procedur.
    *   Praktické příklady.
2.  [**Triggery**](./02-Triggery/README.md)
    *   Co jsou triggery a kdy je použít.
    *   Vytvoření trigger funkce.
    *   Navázání triggeru na konkrétní událost v tabulce.
    *   Příklady: logování změn, validace dat, automatický výpočet hodnot.