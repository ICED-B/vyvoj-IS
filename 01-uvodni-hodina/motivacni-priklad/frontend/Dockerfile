# frontend/Dockerfile
# Instrukce pro sestavení Docker image pro React frontend aplikaci (vývojové prostředí)

# Použijeme oficiální Node.js image jako základ
# Verze 18-alpine je rozumná volba (LTS verze, malá velikost)
FROM node:18-alpine

# Nastavíme pracovní adresář uvnitř kontejneru
WORKDIR /app

# Zkopírujeme package.json a package-lock.json (pokud existuje)
# Kopírujeme je zvlášť, abychom využili Docker cache - závislosti se nebudou
# znovu instalovat, pokud se tyto soubory nezmění.
COPY package*.json ./

# Nainstalujeme závislosti projektu
RUN npm install

# Zkopírujeme zbytek kódu aplikace do pracovního adresáře
COPY . .

# Vystavíme port 3000, na kterém běží React development server
EXPOSE 3000

# Příkaz, který se spustí při startu kontejneru
# Spustí React development server
CMD ["npm", "start"]

# Poznámka pro produkci:
# Pro produkční nasazení by se použil multi-stage build:
# 1. Stage: Build statických souborů (`npm run build`)
# 2. Stage: Použití lehkého web serveru (např. Nginx) pro servírování
#    těchto statických souborů z adresáře 'build'.
