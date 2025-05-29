# Příklad: Vývojové prostředí pro React s TypeScriptem a Vite pomocí Dev Containeru

Tento adresář obsahuje konfiguraci pro vytvoření izolovaného vývojového prostředí pomocí VS Code Dev Containers a Dockeru. Toto prostředí je připraveno tak, abyste si v něm mohli snadno vytvořit a spravovat nový React projekt s TypeScriptem pomocí nástroje Vite.

Cílem je poskytnout konzistentní a předkonfigurované prostředí pro všechny studenty, kde si mohou prakticky vyzkoušet tvorbu React aplikací.

## Struktura tohoto příkladu

* `.devcontainer/devcontainer.json`: Konfigurační soubor pro VS Code Remote - Containers. Definuje, jak se má vývojový kontejner sestavit a spustit.
* `docker-compose.yml`: Definuje Docker službu pro naše vývojové prostředí. Používá se ve spojení s `devcontainer.json`.
* `Dockerfile`: Instrukce pro sestavení Docker image, který obsahuje Node.js a npm, potřebné pro práci s Vite a Reactem.
* `README.md`: Tento soubor s instrukcemi.

**Poznámka:** Tento příklad *neobsahuje* hotovou React aplikaci. Poskytuje prostředí, ve kterém si ji sami vytvoříte.

## Předpoklady

* Nainstalovaný **Docker Desktop** (nebo Docker Engine a Docker Compose na Linuxu).
* Nainstalovaný **Visual Studio Code**.
* Nainstalované rozšíření **"Dev Containers"** (identifikátor: `ms-vscode-remote.remote-containers`) ve VS Code.

## Kroky pro zprovoznění a vytvoření React aplikace

1.  **Otevřete tento adresář ve VS Code:**
    * Otevřete Visual Studio Code.
    * Zvolte `File > Open Folder...` (nebo `Soubor > Otevřít složku...`) a vyberte tento adresář (např. `priklad-vite-devcontainer`).

2.  **Otevřete projekt v Dev Containeru:**
    * VS Code by měl automaticky detekovat přítomnost `.devcontainer` konfigurace a v pravém dolním rohu zobrazit notifikaci s dotazem, zda chcete projekt znovu otevřít v kontejneru ("Reopen in Container"). Klikněte na toto tlačítko.
    * Pokud se notifikace nezobrazí, otevřete paletu příkazů (`Ctrl+Shift+P` nebo `Cmd+Shift+P` na macOS) a napište `Dev Containers: Reopen in Container` a vyberte tuto možnost.
    * VS Code nyní sestaví Docker image (pokud je to poprvé) a spustí kontejner. To může chvíli trvat. Po dokončení bude vaše VS Code okno připojeno k tomuto kontejneru. V levém dolním rohu uvidíte název kontejneru (např. "Dev Container: React TS Vite Dev Environment").

3.  **Otevřete terminál uvnitř Dev Containeru:**
    * Ve VS Code otevřete nový terminál (`Terminal > New Terminal` nebo `Terminál > Nový terminál`). Tento terminál již běží *uvnitř* Docker kontejneru.

4.  **Vytvořte nový React + TypeScript projekt pomocí Vite:**
    * V terminálu kontejneru zadejte následující příkaz:
        ```bash
        npm create vite@latest
        ```
    * Vite se vás zeptá na několik věcí:
        * **Project name?** Zadejte název vašeho projektu, např. `moje-react-aplikace` (nebo stiskněte Enter pro výchozí název jako `vite-project`). Můžete také zadat `.` pro vytvoření projektu v aktuálním adresáři (tj. `/workspaces/app`). Pro tento příklad doporučujeme vytvořit projekt v podadresáři, např. `moje-aplikace`.
            ```
            ✔ Project name: … moje-aplikace
            ```
        * **Select a framework:** Pomocí šipek vyberte `React` a potvrďte Enterem.
            ```
            ✔ Select a framework: › React
            ```
        * **Select a variant:** Pomocí šipek vyberte `TypeScript` (nebo `TypeScript + SWC`) a potvrďte Enterem.
            ```
            ✔ Select a variant: › TypeScript
            ```
    * Po dokončení Vite vypíše instrukce. Přejděte do nově vytvořeného adresáře projektu:
        ```bash
        cd moje-aplikace 
        # (nebo název, který jste zvolili)
        ```
    * Nainstalujte závislosti projektu:
        ```bash
        npm install
        ```

5.  **Spusťte vývojový server React aplikace:**
    * Stále v adresáři vašeho nového React projektu (`moje-aplikace`) spusťte:
        ```bash
        npm run dev
        ```
    * Vite spustí vývojový server. V terminálu uvidíte adresu, na které aplikace běží (typicky `http://localhost:5173`).
    * VS Code by měl automaticky nabídnout přesměrování tohoto portu z kontejneru na váš lokální počítač. Pokud ano, můžete na odkaz kliknout přímo v terminálu (s `Ctrl+Click` nebo `Cmd+Click`).
    * Otevřete tuto adresu ve vašem webovém prohlížeči na hostitelském počítači. Měli byste vidět výchozí stránku Vite + React.

6.  **Proveďte první úpravy:**
    * Ve VS Code (které je stále připojeno k Dev Containeru) otevřete soubor `src/App.tsx` uvnitř vašeho nově vytvořeného projektu (např. `moje-aplikace/src/App.tsx`).
    * Zkuste změnit nějaký text, například uvnitř `<h1>` tagu.
    * Uložte soubor. Díky Hot Module Replacement (HMR) by se změna měla okamžitě projevit v prohlížeči bez nutnosti manuálního obnovení stránky.

7.  **Zastavení vývojového serveru:**
    * V terminálu, kde běží `npm run dev`, stiskněte `Ctrl+C`.

8.  **Ukončení práce s Dev Containerem:**
    * Zavřete VS Code okno, nebo použijte `File > Close Remote Connection`.
    * Pro úplné zastavení a odstranění kontejneru můžete v terminálu *mimo* VS Code (v adresáři s `docker-compose.yml` tohoto příkladu) spustit `docker-compose down`.

## Možné problémy a řešení

### Nelze se připojit k `localhost:5173` z prohlížeče

Pokud jste spustili `npm run dev` a v terminálu vidíte, že server běží, ale v prohlížeči se stránka nenačte (např. "Connection refused"), je velmi pravděpodobné, že Vite server uvnitř kontejneru nenaslouchá na správném síťovém rozhraní.

**Řešení:** Upravte konfigurační soubor `vite.config.ts` ve vašem nově vytvořeném React projektu (`moje-aplikace/vite.config.ts`). Pokud soubor neexistuje, vytvořte ho.

Přidejte nebo upravte sekci `server` takto:

```typescript
// moje-aplikace/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <-- Toto říká Vite, aby naslouchal na všech rozhraních kontejneru.
    port: 5173,      // <-- Ujistěte se, že port odpovídá tomu, co máte v docker-compose.yml a devcontainer.json.
  }
})
```

## Co dál?

Nyní máte připravené plnohodnotné vývojové prostředí pro React s TypeScriptem. Můžete začít procházet soubory vygenerované Vitem, experimentovat s tvorbou komponent, props, state a dalšími koncepty Reactu, jak je popsáno v hlavní dokumentaci k této sekci (04-08 Úvod do Reactu s TypeScriptem).
