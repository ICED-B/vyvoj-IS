# 6.4 Monitorování a logování

Máme rychlou, zálohovanou a zabezpečenou databázi. Ale jak poznáme, že je v dobré kondici? Co se stane, když se něco pokazí? Odpovědi na tyto otázky nám dává **monitorování** (sledování stavu) a **logování** (zaznamenávání událostí).

* **Monitorování** nám dává přehled o aktuálním stavu a výkonu databáze v reálném čase. Pomáhá nám identifikovat problémy s výkonem, neobvyklou zátěž nebo blížící se potíže (např. docházející místo na disku).
* **Logování** nám poskytuje historický záznam událostí, chyb a důležitých operací. Je to neocenitelný zdroj informací při zpětné analýze problémů (debugování).

## Monitorování stavu databáze

PostgreSQL nabízí velké množství systémových pohledů a funkcí, které nám umožňují sledovat, co se uvnitř databáze děje.

### Sledování aktivních připojení: `pg_stat_activity`

Tento systémový pohled je jedním z nejužitečnějších. Zobrazí vám seznam všech aktuálně otevřených připojení k databázovému serveru.

```sql
SELECT 
    pid, 
    usename, 
    client_addr, 
    state, 
    wait_event_type,
    query
FROM pg_stat_activity;
```

Z výstupu můžeme vyčíst:
* `pid`: ID procesu na serveru.
* `usename`: Jméno uživatele, který je připojen.
* `client_addr`: IP adresa klienta.
* `state`: Stav připojení (`active` - právě vykonává dotaz, `idle` - čeká na příkaz, `idle in transaction` - čeká uvnitř transakce, což může být problém!).
* `wait_event_type`: Pokud proces na něco čeká (např. na zámek), zde uvidíte na co.
* `query`: Aktuálně prováděný dotaz (pokud `state` je `active`).

Tento pohled je klíčový pro odhalení "visících" dotazů nebo dlouho běžících transakcí, které mohou blokovat ostatní.

### Sledování výkonu dotazů: `pg_stat_statements`

Tento pohled je součástí rozšíření, které musíme nejprve povolit. Agreguje statistiky o všech dotazech, které byly na serveru provedeny. Díky němu můžeme snadno najít nejpomalejší nebo nejčastěji spouštěné dotazy.

**Krok 1: Povolení rozšíření**
```sql
-- Spustí se jednou pro databázi
CREATE EXTENSION pg_stat_statements;
```

**Krok 2: Úprava konfigurace**
V konfiguračním souboru `postgresql.conf`, který najdete pomocí příkazu `SHOW config_file;`, musíme přidat `pg_stat_statements` do sdílených knihoven.
```ini
# postgresql.conf
shared_preload_libraries = 'pg_stat_statements'
```
(Tato změna vyžaduje restart databázového serveru.)

**Krok 3: Analýza dat**
Po nějaké době provozu můžeme dotázat pohled a najít například 5 nejpomalejších dotazů podle celkového času stráveného jejich vykonáváním:
```sql
SELECT 
    (total_exec_time / 1000 / 60) AS total_minutes,
    calls,
    mean_exec_time,
    query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

## Logování událostí

Databázové logy jsou textové soubory, kam PostgreSQL zapisuje důležité informace o svém běhu. Jejich správná konfigurace je zásadní pro diagnostiku problémů.

### Konfigurace logování (`postgresql.conf`)

Nejdůležitější parametry pro logování v souboru `postgresql.conf`:

* `log_destination = 'stderr'`: Kam se má logovat. `stderr` je výchozí a v kombinaci s `logging_collector` je to dobrá volba.
* `logging_collector = on`: Zapne proces, který sbírá logy a zapisuje je do souborů.
* `log_directory = 'log'`: Adresář pro logy (relativní k datovému adresáři databáze).
* `log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'`: Vzor pro název logovacího souboru.
* `log_statement = 'ddl'`: Určuje, které SQL příkazy se mají logovat.
    * `none`: Žádné.
    * `ddl`: Pouze příkazy pro změnu struktury (`CREATE`, `ALTER`, `DROP`). (Doporučeno)
    * `mod`: DDL + příkazy pro změnu dat (`INSERT`, `UPDATE`, `DELETE`).
    * `all`: Všechny příkazy. (Velmi "užvaněné", použít jen krátkodobě pro ladění).
* `log_min_duration_statement = 250ms`: Zaloguje všechny dotazy, které trvají déle než zadaná hodnota. **Extrémně užitečné pro odhalování pomalých dotazů v produkci!**

Po změně konfigurace je potřeba ji znovu načíst:
```sql
-- Tento příkaz v psql znovu načte konfiguraci bez restartu serveru
SELECT pg_reload_conf();
```

---

## Praktické úkoly

1.  **Prozkoumejte aktivitu:** Otevřete si dva terminály s `psql`. V jednom spusťte dlouhý dotaz (např. `SELECT pg_sleep(30);`). V druhém terminálu se podívejte do pohledu `pg_stat_activity` a najděte svůj spící dotaz.
2.  **Povolte logování pomalých dotazů:**
    * Najděte a upravte svůj `postgresql.conf` soubor. (Pokud používáte Docker, budete se muset připojit do kontejneru a najít ho tam, typicky v `/var/lib/postgresql/data/postgresql.conf`).
    * Nastavte `log_min_duration_statement = 0;`. Tím se zaloguje úplně každý dotaz.
    * Restartujte kontejner s databází, aby se změna projevila.
3.  **Vygenerujte logy:** Spusťte několik `SELECT` dotazů na vaši databázi `knihovna`.
4.  **Najděte logy:** Připojte se znovu do kontejneru a najděte logovací soubory v adresáři `log` (nebo `pg_log`). Prohlédněte si jejich obsah a najděte své dotazy.
5.  **(Bonus):** Nastavte `log_min_duration_statement` zpět na rozumnější hodnotu, např. `500ms`, a zkuste napsat dotaz, který bude trvat dostatečně dlouho, aby se zalogoval (můžete použít `pg_sleep` nebo složitější `JOIN`).