# Instrukce pro sestavení Docker image pro Python backend aplikaci

# Použijeme oficiální Python image jako základ
# Verze 3.10-slim je menší varianta vhodná pro produkci
FROM python:3.10-slim

# Nastavíme pracovní adresář uvnitř kontejneru
WORKDIR /app

# Zkopírujeme soubor se závislostmi do pracovního adresáře
COPY requirements.txt .

# Nainstalujeme závislosti definované v requirements.txt
# --no-cache-dir: Neukládá cache, což zmenšuje velikost image
# --upgrade pip: Zajistí aktuální verzi pipu
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Zkopírujeme zbytek kódu aplikace do pracovního adresáře
# Tečka '.' značí aktuální adresář (kde je Dockerfile) a /app je cíl v kontejneru
COPY . /app

# Vystavíme port 5000, na kterém bude aplikace naslouchat uvnitř kontejneru
# Tento port pak mapujeme v docker-compose.yml na port hostitele
EXPOSE 5000

# Příkaz, který se spustí při startu kontejneru
# Spustí Flask development server, který naslouchá na všech rozhraních (0.0.0.0)
# Pro produkční nasazení by se typicky použil Gunicorn nebo uWSGI
CMD ["flask", "run", "--host=0.0.0.0"]
