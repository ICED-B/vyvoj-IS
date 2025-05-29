document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM načten, skript fetch_script.js spuštěn.");

    const nacistUzivateleBtn = document.getElementById('nacistUzivateleBtn');
    const nacistJedenTodoBtn = document.getElementById('nacistJedenTodoBtn');
    const nacistNeexistujiciTodoBtn = document.getElementById('nacistNeexistujiciTodoBtn');
    const dataKontejner = document.getElementById('dataKontejner');
    const statusGetDiv = document.getElementById('statusGet');

    const novyPrispevekForm = document.getElementById('novyPrispevekForm');
    const postKontejner = document.getElementById('postKontejner');
    const statusPostDiv = document.getElementById('statusPost');
    const odeslatPrispevekBtn = document.getElementById('odeslatPrispevekBtn');


    // --- Funkce pro zobrazení stavových zpráv ---
    function zobrazStav(element, zprava, typ = 'success') {
        element.textContent = zprava;
        element.className = `status-message ${typ}`; // Reset a nastavení třídy
        element.style.display = 'block';
    }

    function skryjStav(element) {
        element.style.display = 'none';
        element.textContent = '';
    }

    // --- Načítání dat (GET) ---

    // Funkce pro načtení a zobrazení seznamu uživatelů
    async function nactiAVypisUzivatele() {
        skryjStav(statusGetDiv);
        dataKontejner.innerHTML = '<p>Načítám uživatele...</p>';
        nacistUzivateleBtn.disabled = true;

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error(`HTTP chyba! Stav: ${response.status} - ${response.statusText}`);
            }
            const uzivatele = await response.json();

            dataKontejner.innerHTML = '<h2>Seznam uživatelů:</h2>';
            if (uzivatele.length === 0) {
                dataKontejner.innerHTML += '<p>Nenalezeni žádní uživatelé.</p>';
            } else {
                const ul = document.createElement('ul');
                uzivatele.forEach(uzivatel => {
                    const li = document.createElement('li');
                    li.className = 'user-card';
                    li.innerHTML = `
                        <h3>${uzivatel.name} (@${uzivatel.username})</h3>
                        <p><strong>Email:</strong> ${uzivatel.email}</p>
                        <p><strong>Web:</strong> <a href="http://${uzivatel.website}" target="_blank">${uzivatel.website}</a></p>
                        <p><strong>Společnost:</strong> ${uzivatel.company.name}</p>
                    `;
                    ul.appendChild(li);
                });
                dataKontejner.appendChild(ul);
            }
            zobrazStav(statusGetDiv, 'Uživatelé úspěšně načteni.', 'success');
            console.log("Načtení uživatelé:", uzivatele);

        } catch (error) {
            console.error('Chyba při načítání uživatelů:', error);
            dataKontejner.innerHTML = '<p>Chyba při načítání uživatelů.</p>';
            zobrazStav(statusGetDiv, `Chyba: ${error.message}`, 'error');
        } finally {
            nacistUzivateleBtn.disabled = false;
        }
    }

    // Funkce pro načtení jedné TODO položky
    async function nactiTodoPolozku(id) {
        skryjStav(statusGetDiv);
        dataKontejner.innerHTML = `<p>Načítám TODO položku s ID: ${id}...</p>`;
        nacistJedenTodoBtn.disabled = true;
        nacistNeexistujiciTodoBtn.disabled = true;

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
            if (!response.ok) {
                // Speciální ošetření pro 404, aby se ukázala smysluplná chyba
                if (response.status === 404) {
                    throw new Error(`Položka s ID ${id} nebyla nalezena (404).`);
                }
                throw new Error(`HTTP chyba! Stav: ${response.status} - ${response.statusText}`);
            }
            const todo = await response.json();

            dataKontejner.innerHTML = `
                <div class="user-card">
                    <h3>TODO Položka (ID: ${todo.id})</h3>
                    <p><strong>Titul:</strong> ${todo.title}</p>
                    <p><strong>Stav:</strong> ${todo.completed ? 'Dokončeno' : 'Nedokončeno'}</p>
                    <p><strong>User ID:</strong> ${todo.userId}</p>
                </div>
            `;
            zobrazStav(statusGetDiv, `TODO položka ${id} úspěšně načtena.`, 'success');
            console.log(`Načtená TODO položka ${id}:`, todo);

        } catch (error) {
            console.error(`Chyba při načítání TODO položky ${id}:`, error);
            dataKontejner.innerHTML = `<p>Chyba při načítání TODO položky ${id}.</p>`;
            zobrazStav(statusGetDiv, `Chyba: ${error.message}`, 'error');
        } finally {
            nacistJedenTodoBtn.disabled = false;
            nacistNeexistujiciTodoBtn.disabled = false;
        }
    }

    if (nacistUzivateleBtn) {
        nacistUzivateleBtn.addEventListener('click', nactiAVypisUzivatele);
    }

    if (nacistJedenTodoBtn) {
        nacistJedenTodoBtn.addEventListener('click', () => nactiTodoPolozku(5));
    }
    if (nacistNeexistujiciTodoBtn) {
        nacistNeexistujiciTodoBtn.addEventListener('click', () => nactiTodoPolozku(9999));
    }


    // --- Odesílání dat (POST) ---
    async function odesliNovyPrispevek(event) {
        event.preventDefault(); // Zabráníme výchozímu odeslání formuláře
        skryjStav(statusPostDiv);
        postKontejner.innerHTML = '<p>Odesílám nový příspěvek...</p>';
        odeslatPrispevekBtn.disabled = true;

        const formData = new FormData(novyPrispevekForm);
        const dataPrispevku = {
            title: formData.get('title'),
            body: formData.get('body'),
            userId: parseInt(formData.get('userId'), 10) // Převedeme na číslo
        };

        // Jednoduchá validace na klientovi
        if (!dataPrispevku.title || !dataPrispevku.body || isNaN(dataPrispevku.userId)) {
            postKontejner.innerHTML = '';
            zobrazStav(statusPostDiv, 'Všechna pole formuláře jsou povinná a User ID musí být číslo.', 'error');
            odeslatPrispevekBtn.disabled = false;
            return;
        }

        console.log("Odesílaná data:", dataPrispevku);

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(dataPrispevku)
            });

            // jsonplaceholder vrací 201 Created, i když reálně data neukládá persistentně
            if (!response.ok && response.status !== 201) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP chyba! Stav: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const vytvorenyPrispevek = await response.json();

            postKontejner.innerHTML = `
                <div class="post-card">
                    <h3>Nově vytvořený příspěvek (ID: ${vytvorenyPrispevek.id})</h3>
                    <p><strong>Titulek:</strong> ${vytvorenyPrispevek.title}</p>
                    <p><strong>Obsah:</strong> ${vytvorenyPrispevek.body}</p>
                    <p><strong>User ID:</strong> ${vytvorenyPrispevek.userId}</p>
                </div>
            `;
            zobrazStav(statusPostDiv, `Příspěvek úspěšně odeslán (ID: ${vytvorenyPrispevek.id}).`, 'success');
            console.log("Odpověď serveru (vytvořený příspěvek):", vytvorenyPrispevek);
            novyPrispevekForm.reset(); // Vyčistí formulář

        } catch (error) {
            console.error('Chyba při odesílání příspěvku:', error);
            postKontejner.innerHTML = '<p>Chyba při odesílání příspěvku.</p>';
            zobrazStav(statusPostDiv, `Chyba: ${error.message}`, 'error');
        } finally {
            odeslatPrispevekBtn.disabled = false;
        }
    }

    if (novyPrispevekForm) {
        novyPrispevekForm.addEventListener('submit', odesliNovyPrispevek);
    }

    // Příklad Promise.all - načtení více zdrojů najednou
    async function nactiViceZdrojuNajednou() {
        console.log("--- Promise.all ukázka ---");
        skryjStav(statusGetDiv);
        dataKontejner.innerHTML = "<p>Načítám více zdrojů najednou...</p>";

        try {
            const [uzivateleResponse, prispevkyResponse] = await Promise.all([
                fetch('https://jsonplaceholder.typicode.com/users?_limit=3'), // Načteme jen 3 uživatele
                fetch('https://jsonplaceholder.typicode.com/posts?_limit=2')  // Načteme jen 2 příspěvky
            ]);

            if (!uzivateleResponse.ok) throw new Error(`Chyba při načítání uživatelů: ${uzivateleResponse.status}`);
            if (!prispevkyResponse.ok) throw new Error(`Chyba při načítání příspěvků: ${prispevkyResponse.status}`);

            const uzivatele = await uzivateleResponse.json();
            const prispevky = await prispevkyResponse.json();

            dataKontejner.innerHTML = "<h3>První 3 uživatelé:</h3><ul>";
            uzivatele.forEach(u => { dataKontejner.innerHTML += `<li>${u.name}</li>`; });
            dataKontejner.innerHTML += "</ul><h3>První 2 příspěvky:</h3><ul>";
            prispevky.forEach(p => { dataKontejner.innerHTML += `<li>${p.title}</li>`; });
            dataKontejner.innerHTML += "</ul>";

            zobrazStav(statusGetDiv, 'Více zdrojů úspěšně načteno pomocí Promise.all.', 'success');
            console.log("Promise.all - Uživatelé:", uzivatele);
            console.log("Promise.all - Příspěvky:", prispevky);

        } catch (error) {
            console.error("Chyba v Promise.all:", error);
            dataKontejner.innerHTML = "<p>Chyba při načítání více zdrojů.</p>";
            zobrazStav(statusGetDiv, `Chyba Promise.all: ${error.message}`, 'error');
        }
    }
    // Můžete přidat tlačítko pro spuštění nactiViceZdrojuNajednou() nebo ji zavolat přímo pro demonstraci
    // nactiViceZdrojuNajednou(); // Příklad přímého volání
});
