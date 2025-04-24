# Použijeme oficiální Python image
FROM python:3.10-slim

# Nastavíme pracovní adresář
WORKDIR /app

# Zkopírujeme soubor se závislostmi
COPY requirements.txt .

# Nainstalujeme závislosti
RUN pip install --no-cache-dir -r requirements.txt

# Zkopírujeme kód aplikace
COPY app.py .

# Vystavíme port 5000, na kterém Flask běží
EXPOSE 5000

# Nastavíme proměnnou prostředí pro Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
# ENV FLASK_DEBUG=1 # Pro zapnutí debug módu v produkci (nedoporučeno)

# Výchozí příkaz pro spuštění aplikace pomocí Flask development serveru
CMD ["flask", "run"]