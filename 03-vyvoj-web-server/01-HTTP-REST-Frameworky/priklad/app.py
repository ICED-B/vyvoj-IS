from flask import Flask, request, jsonify, abort

# Inicializace Flask aplikace
app = Flask(__name__)

# Jednoduchá "databáze" v paměti (seznam slovníků)
items = [
    {"id": 1, "name": "Položka 1", "description": "Popis první položky"},
    {"id": 2, "name": "Položka 2", "description": "Popis druhé položky"},
]
# Počítadlo pro generování dalšího ID
next_id = 3

# --- Definice RESTful endpointů ---


# GET /items - Získání seznamu všech položek
@app.route("/items", methods=["GET"])
def get_items():
    """Vrací seznam všech položek."""
    app.logger.info("GET /items request received")  # Přidání logování
    return jsonify(items), 200  # Vrátí JSON seznam a stavový kód 200 OK


# GET /items/<int:item_id> - Získání detailu konkrétní položky
@app.route("/items/<int:item_id>", methods=["GET"])
def get_item(item_id):
    """Vrací detail položky podle jejího ID."""
    app.logger.info(f"GET /items/{item_id} request received")
    # Najdeme položku se shodným ID
    item = next((item for item in items if item["id"] == item_id), None)
    if item:
        return jsonify(item), 200
    else:
        # Pokud položka není nalezena, vrátíme 404 Not Found
        app.logger.warning(f"Item with ID {item_id} not found")
        abort(404, description=f"Položka s ID {item_id} nebyla nalezena.")


# POST /items - Vytvoření nové položky
@app.route("/items", methods=["POST"])
def create_item():
    """Vytvoří novou položku."""
    global next_id
    # Zkontrolujeme, zda požadavek obsahuje JSON data
    if not request.json or not "name" in request.json:
        app.logger.error("POST /items failed: Missing 'name' in JSON payload")
        abort(
            400, description="Požadavek musí obsahovat JSON s klíčem 'name'."
        )  # 400 Bad Request

    # Vytvoříme novou položku
    new_item = {
        "id": next_id,
        "name": request.json["name"],
        "description": request.json.get("description", ""),  # Popis je volitelný
    }
    items.append(new_item)
    next_id += 1
    app.logger.info(f"POST /items successful: Created item with ID {new_item['id']}")
    # Vrátíme nově vytvořenou položku a stavový kód 201 Created
    return jsonify(new_item), 201


# PUT /items/<int:item_id> - Aktualizace (nahrazení) existující položky
@app.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    """Aktualizuje (nahradí) existující položku."""
    item = next((item for item in items if item["id"] == item_id), None)
    if not item:
        app.logger.warning(f"PUT /items/{item_id} failed: Item not found")
        abort(404, description=f"Položka s ID {item_id} nebyla nalezena.")
    if not request.json or not "name" in request.json:
        app.logger.error(f"PUT /items/{item_id} failed: Missing 'name' in JSON payload")
        abort(400, description="Požadavek musí obsahovat JSON s klíčem 'name'.")

    # Aktualizujeme data položky (nahradíme celý slovník kromě ID)
    item["name"] = request.json["name"]
    item["description"] = request.json.get(
        "description", item.get("description", "")
    )  # Zachováme popis, pokud není v requestu
    app.logger.info(f"PUT /items/{item_id} successful")
    return jsonify(item), 200


# DELETE /items/<int:item_id> - Smazání položky
@app.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    """Smaže položku podle jejího ID."""
    global items  # Potřebujeme modifikovat globální seznam
    item_to_delete = next((item for item in items if item["id"] == item_id), None)
    if not item_to_delete:
        app.logger.warning(f"DELETE /items/{item_id} failed: Item not found")
        abort(404, description=f"Položka s ID {item_id} nebyla nalezena.")

    # Odstraníme položku ze seznamu
    items = [item for item in items if item["id"] != item_id]
    app.logger.info(f"DELETE /items/{item_id} successful")
    # Vrátíme prázdnou odpověď se stavovým kódem 204 No Content
    return "", 204


# Spuštění aplikace (pokud je skript spuštěn přímo)
if __name__ == "__main__":
    # Zapnutí debug módu pro vývoj (automatický reload, podrobnější chyby)
    # V Dockeru se typicky spouští přes 'flask run' nebo gunicorn/uvicorn
    app.run(host="0.0.0.0", port=5000, debug=True)
