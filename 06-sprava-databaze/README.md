# 6. Správa databázového serveru

Mít funkční aplikaci připojenou k databázi je jen začátek. Aby náš informační systém byl spolehlivý, bezpečný a rychlý i v reálném provozu, musíme se věnovat jeho správě. Tato disciplína, často označovaná jako DBA (Database Administration), je klíčová pro dlouhodobou udržitelnost projektu.

V této sekci se zaměříme na základní, ale naprosto zásadní aspekty správy PostgreSQL serveru. Probereme, jak analyzovat a zrychlovat pomalé dotazy, jak chránit data před ztrátou pomocí záloh a jak monitorovat stav naší databáze, abychom předešli problémům dříve, než nastanou.

## Témata

1.  [**Ladění výkonu SQL**](./01-Ladení-vykonu-SQL/README.md)
    *   Proč jsou některé dotazy pomalé?
    *   Analýza prováděcího plánu dotazu pomocí `EXPLAIN`.
    *   Klíčová role indexů a jak je správně používat.
2.  [**Zálohování a obnova**](./02-Zalohovani-a-obnova/README.md)
    *   Typy záloh (fyzické vs. logické).
    *   Nástroje `pg_dump` a `pg_restore` pro tvorbu a obnovu logických záloh.
    *   Automatizace zálohování.
3.  [**Zabezpečení a ochrana dat**](./03-Zabezpeceni-a-ochrana-dat/README.md)
    *   Správa uživatelů a rolí.
    *   Přidělování oprávnění (`GRANT`, `REVOKE`).
    *   Důležitost šifrování a zabezpečení síťové komunikace.
4.  [**Monitorování a logování**](./04-Monitorovani-a-logovani/README.md)
    *   Sledování výkonu a zátěže databáze.
    *   Důležité systémové pohledy a statistiky (`pg_stat_activity`, `pg_stat_statements`).
    *   Konfigurace a analýza databázových logů pro odhalování chyb a anomálií.