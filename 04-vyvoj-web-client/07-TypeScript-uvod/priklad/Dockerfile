# Krok 1: Základní image s Node.js (vyberte vhodnou verzi)
FROM node:24-slim AS builder

# Nastavení pracovního adresáře v kontejneru
WORKDIR /usr/src/app

# Zkopírování package.json a package-lock.json (pokud existuje)
# Toto je odděleno, aby se využilo cachování vrstev Dockeru,
# pokud se mění pouze kód a ne závislosti.
COPY package*.json ./

# Instalace projektových závislostí (včetně devDependencies pro TypeScript)
RUN npm install

# Zkopírování konfiguračního souboru TypeScriptu
COPY tsconfig.json ./

# Zkopírování zdrojových kódů (adresář src)
COPY src ./src

# Kompilace TypeScript kódu do JavaScriptu
# Výstup bude v adresáři ./dist (podle tsconfig.json)
RUN npm run build
# Alternativně, pokud by `npm run build` nebylo definováno:
# RUN npx tsc

# Krok 2: Produkční image (menší, obsahuje jen nutné pro běh)
FROM node:23-slim

WORKDIR /usr/src/app

# Zkopírování package.json a package-lock.json pro instalaci pouze produkčních závislostí
# (V tomto příkladu nemáme produkční závislosti oddělené, ale je to dobrá praxe)
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts
# Pokud nemáte žádné produkční závislosti kromě Node.js, tento krok lze zjednodušit
# nebo vynechat a kopírovat jen zkompilovaný kód.

# Zkopírování zkompilovaných souborů z builder fáze
COPY --from=builder /usr/src/app/dist ./dist

# Nastavení výchozího příkazu, který se spustí při startu kontejneru
# CMD [ "node", "dist/index.js" ]
# # Alternativně, pokud máte start skript v package.json:
CMD [ "npm", "start" ]