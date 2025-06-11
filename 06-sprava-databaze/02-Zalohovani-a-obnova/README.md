# 2. Zálohování a obnova dat

Optimalizace dotazů je důležitá, ale naprosto k ničemu, pokud o svá data přijdete. Data jsou často to nejcennější, co informační systém obsahuje. Hardware selhává, software obsahuje chyby a lidé dělají chyby. Pravidelné a ověřené zálohy jsou jedinou pojistkou proti katastrofě.

## Proč jsou zálohy životně důležité?

Ztráta dat může nastat z mnoha důvodů:
* **Selhání hardwaru:** Porucha pevného disku je jen otázkou času.
* **Chyba v softwaru:** Chyba v aplikaci nebo v samotné databázi může poškodit data.
* **Lidská chyba:** Neopatrný `DELETE` nebo `UPDATE` bez klauzule `WHERE` může smazat celou tabulku.
* **Bezpečnostní incident:** Útok hackera nebo ransomware může data zničit nebo zašifrovat.

Bez zálohy je obnova v těchto případech nemožná nebo extrémně nákladná.

## Typy záloh v PostgreSQL

Existují dva základní přístupy k zálohování:

#### 1. Logické zálohy
Logická záloha nepředstavuje fyzickou kopii datových souborů, ale **sadu SQL příkazů**, které po spuštění znovu vytvoří databázové objekty (tabulky, pohledy, funkce) a naplní je daty (`INSERT` příkazy).

* **Nástroje:** `pg_dump`, `pg_dumpall`
* **Výhody:**
    * **Flexibilita:** Zálohu lze obnovit na jiné hardwarové architektuře a často i na novější verzi PostgreSQL.
    * **Selektivní obnova:** Z některých formátů lze obnovit jen konkrétní tabulku nebo objekt.
    * **Čitelnost:** Záloha v textovém formátu je lidsky čitelná a lze ji upravovat.
* **Nevýhody:**
    * Může být pomalejší pro velmi velké databáze (řádově stovky GB a více).

#### 2. Fyzické zálohy
Fyzická záloha je binární kopie datových souborů PostgreSQL na disku. Je to jako zkopírovat celou složku s daty databáze.

* **Nástroje:** `pg_basebackup`, souborové nástroje (rsync, tar)
* **Výhody:**
    * **Rychlost:** Záloha i obnova jsou obvykle velmi rychlé.
* **Nevýhody:**
    * **Méně flexibilní:** Vyžaduje stejnou hlavní verzi PostgreSQL, stejnou architekturu a často i stejné rozložení souborů.
    * **Větší velikost:** Záloha obsahuje i indexy a další dočasné soubory, takže je větší než logická.

Pro většinu běžných aplikací jsou **logické zálohy pomocí `pg_dump` nejlepší a nejjednodušší volbou.**

## Praktické použití: `pg_dump` a `pg_restore`

Následující příkazy se spouštějí z příkazové řádky vašeho operačního systému, nikoliv uvnitř `psql`.

### Vytvoření logické zálohy (`pg_dump`)

Nástroj `pg_dump` se připojí k databázi a vygeneruje soubor se zálohou.

**1. Plain-text formát (.sql)**
Toto je výchozí formát. Vytvoří jeden velký `.sql` soubor.

```bash
# pg_dump -U <uživatel> -h <host> <název_db> > <název_souboru>.sql
pg_dump -U sql_user -h localhost sql_knihovna_db > sql_knihovna_db_backup.sql
```
* Tento příkaz vytvoří soubor `sql_knihovna_db_backup.sql`, který obsahuje všechny SQL příkazy pro obnovu databáze `sql_knihovna_db`.

**2. Custom formát (.dump)**
Tento formát je komprimovaný a je doporučený pro větší databáze. Umožňuje flexibilnější obnovu.

```bash
# pg_dump -U <uživatel> -h <host> -F c -f <název_souboru>.dump <název_db>
pg_dump -U sql_user -h localhost -F c -f sql_knihovna_db_backup.dump sql_knihovna_db
```
* `-F c` specifikuje "custom" formát.
* `-f` určuje výstupní soubor (místo přesměrování `>`).

### Obnova databáze ze zálohy

**1. Obnova z plain-text formátu (.sql)**
Obnova se provádí pomocí nástroje `psql`. Nejprve je potřeba vytvořit novou, prázdnou databázi.

```bash
# Vytvoření nové databáze
createdb -U sql_user -h localhost sql_knihovna_db_nova

# Nahrání zálohy do nové databáze
psql -U sql_user -h localhost -d sql_knihovna_db_nova < sql_knihovna_db_backup.sql
```

**2. Obnova z custom formátu (.dump) pomocí `pg_restore`**
Pro tento formát se používá nástroj `pg_restore`, který nabízí více možností (např. paralelní obnovu pro zrychlení).

```bash
# Vytvoření nové databáze
createdb -U sql_user -h localhost sql_knihovna_db_nova_z_dumpu

# Obnova pomocí pg_restore
pg_restore -U sql_user -h localhost -d sql_knihovna_db_nova_z_dumpu sql_knihovna_db_backup.dump
```
* `-d` specifikuje cílovou databázi.

## Pokročilé zálohování: Inkrementální zálohy a PITR

Nástroj `pg_dump` vytváří vždy plnou zálohu. U velmi velkých databází by to bylo neefektivní. Pro tyto případy nabízí PostgreSQL pokročilou techniku **Point-in-Time Recovery (PITR)**, která umožňuje zálohovat pouze změny.

Princip je založen na **archivaci transakčních logů (Write-Ahead Logs - WAL)**:
1.  Jednou za čas (např. jednou týdně) se vytvoří **plná záloha** (tzv. base backup).
2.  Průběžně se **archivují WAL soubory**, což jsou malé soubory popisující každou změnu v databázi. Toto je v podstatě **zálohování změn (inkrementální záloha)**.
3.  Při obnově se nejprve nahraje poslední plná záloha a poté se na ni aplikují všechny archivované WAL soubory.

Hlavní výhodou je možnost obnovit databázi do **jakéhokoliv bodu v čase**, který pokrývají naše archivované logy, s přesností na sekundy. Nastavení PITR je složitější a pro jeho správu se často používají nástroje jako `pgBackRest` nebo `Barman`.


## Automatizace záloh

Ruční zálohování je nespolehlivé. V reálném provozu se zálohy automatizují. Na systémech Linux se k tomu často používá `cron`, který umí spouštět příkazy v pravidelných intervalech.

Příklad `cron` úlohy, která provede zálohu každý den ve 2:00 ráno:
```cron
0 2 * * * pg_dump -U sql_user sql_knihovna_db > /var/backups/sql_knihovna_db_$(date +\%Y-\%m-\%d).sql
```

---

## Praktické úkoly

1.  **Vytvořte zálohu:** Pomocí `pg_dump` vytvořte zálohu vaší databáze `sql_knihovna_db` ve formátu plain-text (`.sql`).
2.  **Vytvořte druhou zálohu:** Vytvořte druhou zálohu stejné databáze, ale tentokrát v custom formátu (`.dump`).
3.  **Simulujte katastrofu:** Připojte se k databázi `sql_knihovna_db` a schválně smažte nějakou tabulku, např. `DROP TABLE authors;`. Ověřte, že data jsou pryč.
4.  **Vytvořte novou databázi:** Pomocí `createdb` vytvořte novou prázdnou databázi s názvem `sql_knihovna_db_obnova`.
5.  **Obnovte data:** Pomocí `psql` a vaší `.sql` zálohy obnovte data do databáze `sql_knihovna_db_obnova`. Připojte se a ověřte, že tabulka `authors` a její data jsou zpět.
6.  **Obnovte data 2. způsob:** Zkuste obnovit databázi i z vaší druhé, `.dump` zálohy pomocí `pg_restore`.
