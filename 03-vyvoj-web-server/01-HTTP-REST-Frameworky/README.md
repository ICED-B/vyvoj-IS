## 1. Úvod do HTTP, REST API a webových frameworků (Flask jako příklad)

V této úvodní části se seznámíme se základními stavebními kameny moderního webového backendu: protokolem HTTP, architektonickým stylem REST pro tvorbu API a rolí webových frameworků, přičemž jako konkrétní příklad si představíme framework Flask.

### Architektura Klient-Server a Protokol HTTP

Většina webových aplikací funguje na principu **klient-server**.

* **Klient (Client):** Typicky webový prohlížeč (Chrome, Firefox, ...) nebo mobilní aplikace, ale může to být i jiný program nebo služba. Klient je ten, kdo **žádá** o data nebo služby.
* **Server:** Počítač (nebo skupina počítačů), který **poskytuje** data nebo služby na základě požadavků od klientů. Na serveru běží naše backendová aplikace.

Komunikace mezi klientem a serverem na webu probíhá primárně pomocí protokolu **HTTP (HyperText Transfer Protocol)** nebo jeho zabezpečené varianty **HTTPS**.

**Základní princip HTTP komunikace (Request-Response cyklus):**

1.  **Požadavek (Request):** Klient odešle HTTP požadavek na server. Tento požadavek obsahuje:
    * **Metodu (Method):** Určuje typ akce, kterou klient požaduje (např. `GET`, `POST`, `PUT`, `DELETE`).
    * **URL (Uniform Resource Locator):** Adresa zdroje na serveru, se kterým chce klient pracovat (např. `/api/books`, `/users/123`).
    * **Verzi HTTP:** (např. HTTP/1.1, HTTP/2).
    * **Hlavičky (Headers):** Doplňující informace o požadavku (např. typ obsahu, který klient očekává - `Accept: application/json`, informace o autentizaci - `Authorization: Bearer ...`).
    * **Tělo (Body):** (Volitelné, typicky u `POST`, `PUT`) Obsahuje data odesílaná na server (např. data z formuláře, JSON objekt).
2.  **Odpověď (Response):** Server zpracuje požadavek a odešle zpět HTTP odpověď. Odpověď obsahuje:
    * **Verzi HTTP:**
    * **Stavový kód (Status Code):** Třímístné číslo indikující výsledek zpracování požadavku (např. `200 OK`, `404 Not Found`, `500 Internal Server Error`).
    * **Stavovou zprávu (Reason Phrase):** Krátký textový popis stavového kódu (např. "OK", "Not Found").
    * **Hlavičky (Headers):** Doplňující informace o odpovědi (např. typ obsahu odpovědi - `Content-Type: application/json`, informace o cachování).
    * **Tělo (Body):** (Volitelné) Obsahuje data vracená klientovi (např. HTML stránka, JSON data, obrázek).

**Běžné HTTP Metody:**

* `GET`: Žádost o získání dat z určeného zdroje (např. načtení seznamu knih). Neměla by mít vedlejší efekty na serveru.
* `POST`: Odeslání dat na server za účelem vytvoření nového zdroje (např. přidání nové knihy). Může mít vedlejší efekty.
* `PUT`: Odeslání dat na server za účelem aktualizace *celého* existujícího zdroje nebo jeho vytvoření, pokud neexistuje (např. nahrazení informací o knize novými). Je idempotentní (opakované volání se stejnými daty má stejný výsledek).
* `PATCH`: Odeslání dat na server za účelem částečné aktualizace existujícího zdroje (např. změna pouze ceny knihy). Není nutně idempotentní.
* `DELETE`: Žádost o smazání určeného zdroje (např. smazání knihy). Je idempotentní.
* `HEAD`: Podobné jako `GET`, ale server vrací pouze hlavičky, bez těla odpovědi (pro zjištění metadat).
* `OPTIONS`: Zjištění komunikačních možností pro cílový zdroj (často používáno u CORS).

**Běžné HTTP Stavové kódy:**

* **1xx (Informační):** Požadavek přijat, pokračuje se ve zpracování.
* **2xx (Úspěch):** Požadavek byl úspěšně přijat, pochopen a zpracován.
    * `200 OK`: Standardní odpověď pro úspěšné `GET`, `PUT`, `PATCH`.
    * `201 Created`: Požadavek byl úspěšný a jako výsledek byl vytvořen nový zdroj (typicky po `POST`).
    * `204 No Content`: Požadavek byl úspěšný, ale není potřeba vracet žádné tělo odpovědi (typicky po `DELETE`).
* **3xx (Přesměrování):** Klient musí provést další akci k dokončení požadavku.
* **4xx (Chyba klienta):** Požadavek obsahuje chybnou syntaxi nebo nemůže být splněn.
    * `400 Bad Request`: Server nemohl porozumět požadavku kvůli chybné syntaxi.
    * `401 Unauthorized`: Požadavek vyžaduje autentizaci (klient není přihlášen).
    * `403 Forbidden`: Server rozuměl požadavku, ale odmítá ho autorizovat (klient nemá oprávnění).
    * `404 Not Found`: Server nemohl najít požadovaný zdroj.
* **5xx (Chyba serveru):** Server selhal při plnění zjevně platného požadavku.
    * `500 Internal Server Error`: Obecná chyba serveru.
    * `503 Service Unavailable`: Server není momentálně dostupný (přetížení, údržba).

### API a REST Architektura

* **API (Application Programming Interface):** Je to sada definovaných pravidel, protokolů a nástrojů, která umožňuje různým softwarovým komponentám (např. našemu backendu a frontendu) spolu komunikovat. Webové API typicky využívá HTTP pro komunikaci.
* **REST (Representational State Transfer):** Není to protokol ani standard, ale **architektonický styl** pro návrh síťových aplikací (zejména webových API). REST definuje sadu principů a omezení, jejichž dodržování vede k vytvoření škálovatelných, robustních a snadno použitelných API.

**Klíčové principy REST:**

1.  **Klient-Server:** Jasné oddělení zodpovědností mezi klientem (UI) a serverem (data, logika).
2.  **Statelessness (Bezstavovost):** Každý požadavek od klienta na server musí obsahovat **všechny informace** potřebné k jeho pochopení a zpracování. Server si **neukládá žádný kontext** o klientovi mezi jednotlivými požadavky. Pokud je potřeba stav (např. přihlášený uživatel), musí být součástí každého požadavku (např. v `Authorization` hlavičce).
3.  **Cacheability (Možnost cachování):** Odpovědi serveru by měly (pokud je to vhodné) explicitně deklarovat, zda mohou být cachovány klientem nebo proxy servery, aby se snížila latence a zátěž serveru.
4.  **Layered System (Vrstvený systém):** Klient nemusí vědět, zda komunikuje přímo s koncovým serverem, nebo s nějakou mezivrstvou (proxy, load balancer).
5.  **Uniform Interface (Jednotné rozhraní):** Toto je klíčový princip, který zjednodušuje a odděluje architekturu. Skládá se z několika omezení:
    * **Identifikace zdrojů (Resources):** Vše je považováno za *zdroj* (např. kniha, autor, seznam knih), který je identifikován unikátním URI (např. `/api/v1/books`, `/api/v1/authors/5`).
    * **Manipulace se zdroji skrze reprezentace:** Klient nepracuje přímo se zdrojem na serveru, ale s jeho *reprezentací* (např. JSON nebo XML dokumentem popisujícím knihu). Klient může poslat upravenou reprezentaci serveru s požadavkem na změnu zdroje.
    * **Samopopisné zprávy (Self-descriptive messages):** Každá zpráva (požadavek/odpověď) obsahuje dostatek informací, aby ji druhá strana pochopila (např. `Content-Type` hlavička říká, jak interpretovat tělo, stavový kód říká výsledek).
    * **HATEOAS (Hypermedia as the Engine of Application State):** (Volitelný, ale doporučený princip) Odpovědi serveru by měly obsahovat odkazy (hypermedia) na další možné akce nebo související zdroje, což umožňuje klientovi dynamicky navigovat API.

**RESTful API:** API, které dodržuje principy REST. Typicky mapuje HTTP metody na CRUD operace se zdroji:

* `GET /items`: Získání seznamu položek.
* `GET /items/123`: Získání detailu položky s ID 123.
* `POST /items`: Vytvoření nové položky (data v těle požadavku).
* `PUT /items/123`: Aktualizace (nahrazení) položky s ID 123 (data v těle).
* `DELETE /items/123`: Smazání položky s ID 123.

### Webové Frameworky

Vytvářet backendovou aplikaci od nuly, která by zpracovávala HTTP požadavky, routovala je na správnou logiku, pracovala s databází, generovala odpovědi atd., by bylo velmi pracné a opakovalo by se mnoho kódu. Proto existují **webové frameworky**.

* **Webový Framework:** Knihovna nebo sada nástrojů, která poskytuje **strukturu a abstrakce** pro zjednodušení vývoje webových aplikací. Stará se o nízkoúrovňové detaily (jako parsování HTTP požadavků) a nabízí nástroje pro běžné úkoly (routování, zpracování požadavků/odpovědí, práce s DB atd.).

**Příklady frameworků (Python):**

* **Flask:** Mikroframework. Poskytuje základní jádro (routování, request/response) a nechává vývojáři velkou volnost ve výběru dalších knihoven (ORM, formuláře, autentizace). Je flexibilní a vhodný pro menší až středně velké aplikace a API. **(Náš příklad pro výuku)**.
* **Django:** "Batteries-included" framework. Obsahuje mnoho vestavěných komponent (ORM, admin rozhraní, autentizace, šablonovací systém). Je robustní, vhodný pro komplexní aplikace, ale může být méně flexibilní než Flask.
* **FastAPI:** Moderní framework zaměřený na rychlost a snadnou tvorbu API. Využívá standardní Python type hinty pro validaci dat (přes Pydantic) a automatické generování OpenAPI dokumentace.

**Proč Flask jako příklad v tomto kurzu?**

Flask je skvělý pro výuku, protože:

* Je **jednoduchý na pochopení** a má minimální "magii". To znamená, že nedělá příliš mnoho věcí automaticky "na pozadí" bez explicitního pokynu vývojáře. Základní koncepty jako vytvoření aplikace, definování routy pomocí dekorátoru (`@app.route`) a vrácení odpovědi jsou přímočaré a snadno sledovatelné v kódu. Nemusíte se učit složité konvence nebo struktury, abyste mohli začít.
* Umožňuje **postupně přidávat** další komponenty (jako SQLAlchemy, Migrate, Smorest), což dobře ilustruje jednotlivé koncepty. Začnete s jednoduchým API a postupně přidáváte práci s databází, migrace, validaci atd., jak roste komplexita.
* Nutí vývojáře více přemýšlet o struktuře aplikace a výběru nástrojů. Protože Flask neobsahuje vše vestavěné, musíte si aktivně vybrat a integrovat knihovny pro specifické úkoly (např. ORM), což vede k lepšímu pochopení celkové architektury.
* Je stále velmi populární a široce používaný pro tvorbu API a menších webových aplikací.

---

### Praktická ukázka: Jednoduché Flask API

Abychom si teorii hned vyzkoušeli, připravil jsem jednoduchou ukázkovou Flask aplikaci, která demonstruje základní HTTP metody (`GET`, `POST`, `PUT`, `DELETE`) a principy REST na jednoduchém zdroji "položek" (`/items`) uložených v paměti.

* **Kód aplikace:** Najdete v adresáři `03-vyvoj-web-server/01-HTTP-REST-Frameworky/priklad/app.py`. Prostudujte si, jak jsou definovány jednotlivé routy (`@app.route(...)`) a jak pracují s objektem `request` a vrací odpovědi pomocí `jsonify`.
* **Spuštění:** Aplikaci můžete spustit lokálně pomocí Dockeru. V adresáři `03-vyvoj-web-server/01-HTTP-REST-Frameworky/priklad` spusťte příkaz:
  ```bash
  docker-compose up --build -d
  ```
  Aplikace bude běžet na `http://localhost:5000`.
* **Testování:** Pro otestování jednotlivých endpointů a HTTP metod použijte soubor `priklady/01-flask-http-rest-demo/requests.http` s rozšířením **REST Client** ve VS Code. Otevřete tento soubor a klikněte na "Send Request" nad jednotlivými požadavky, abyste viděli, jak server odpovídá. Můžete experimentovat se změnou dat v `POST` a `PUT` požadavcích.
* **Zastavení:** Aplikaci zastavíte příkazem `docker-compose down` ve stejném adresáři.

Tato jednoduchá ukázka slouží jako základ, na kterém budeme v dalších částech stavět – přidáme databázi, ORM, validaci a další funkce potřebné pro reálný informační systém.

---

V následujících částech si ukážeme, jak vytvořit základní Flask aplikaci v rámci naší projektové šablony a postupně přidávat další funkce pro náš backend.