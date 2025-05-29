// Čekáme, až bude celý HTML dokument načten a DOM připraven
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM plně načten a parsován.");

    // --- 1. Výběr a změna elementů ---
    const hlavniNadpis = document.getElementById('hlavniNadpis');
    if (hlavniNadpis) {
        hlavniNadpis.textContent += " - Dynamicky"; // Přidání textu
    }

    const textProZmenu = document.getElementById('textProZmenu');
    const zmenTextBtn = document.getElementById('zmenTextBtn');
    const zmenStylBtn = document.getElementById('zmenStylBtn');
    const pridejTriduBtn = document.getElementById('pridejTriduBtn');
    const odeberTriduBtn = document.getElementById('odeberTriduBtn');
    const toggleTriduBtn = document.getElementById('toggleTriduBtn');

    if (zmenTextBtn && textProZmenu) {
        zmenTextBtn.addEventListener('click', function () {
            textProZmenu.textContent = "Text byl úspěšně změněn pomocí JavaScriptu!";
            console.log("Text odstavce změněn.");
        });
    }

    if (zmenStylBtn && textProZmenu) {
        zmenStylBtn.addEventListener('click', function () {
            textProZmenu.style.color = 'green';
            textProZmenu.style.fontWeight = 'bold';
            textProZmenu.style.fontSize = '1.2em';
            console.log("Styl odstavce změněn.");
        });
    }

    if (pridejTriduBtn && textProZmenu) {
        pridejTriduBtn.addEventListener('click', function () {
            textProZmenu.classList.add('highlight');
            console.log("Třída 'highlight' přidána.");
        });
    }
    if (odeberTriduBtn && textProZmenu) {
        odeberTriduBtn.addEventListener('click', function () {
            textProZmenu.classList.remove('highlight');
            console.log("Třída 'highlight' odebrána.");
        });
    }
    if (toggleTriduBtn && textProZmenu) {
        toggleTriduBtn.addEventListener('click', function () {
            textProZmenu.classList.toggle('highlight');
            console.log("Třída 'highlight' přepnuta.");
        });
    }


    // --- 2. Atributy ---
    const mujOdkaz = document.getElementById('mujOdkaz');
    const obrazekUkazka = document.getElementById('obrazekUkazka');
    const zmenOdkazBtn = document.getElementById('zmenOdkazBtn');

    if (zmenOdkazBtn && mujOdkaz && obrazekUkazka) {
        zmenOdkazBtn.addEventListener('click', function () {
            mujOdkaz.href = 'https://www.seznam.cz';
            mujOdkaz.textContent = 'Nový odkaz (seznam.cz)';
            mujOdkaz.target = '_blank'; // Otevře v nové záložce

            obrazekUkazka.src = 'https://placehold.co/200x150/e74c3c/ffffff?text=Obrázek+2';
            obrazekUkazka.alt = 'Druhý ukázkový obrázek';
            console.log("Odkaz a obrázek změněny.");
        });
    }

    // --- 3. Vytváření a vkládání elementů ---
    const pridejElementBtn = document.getElementById('pridejElementBtn');
    const odeberPosledniBtn = document.getElementById('odeberPosledniBtn');
    const dynamickyObsahDiv = document.getElementById('dynamickyObsah');
    let pocetPridanychElementu = 0;

    if (pridejElementBtn && dynamickyObsahDiv) {
        pridejElementBtn.addEventListener('click', function () {
            pocetPridanychElementu++;
            const novyDiv = document.createElement('div');
            novyDiv.textContent = `Toto je dynamicky přidaný prvek č. ${pocetPridanychElementu}.`;
            // Přidání třídy pro případné stylování
            novyDiv.classList.add('dynamicky-prvek');
            // Můžeme přidat i ID, pokud je potřeba
            novyDiv.id = `prvek-${pocetPridanychElementu}`;

            dynamickyObsahDiv.appendChild(novyDiv);
            console.log(`Přidán nový prvek: div#prvek-${pocetPridanychElementu}`);
        });
    }
    if (odeberPosledniBtn && dynamickyObsahDiv) {
        odeberPosledniBtn.addEventListener('click', function () {
            if (dynamickyObsahDiv.lastElementChild && dynamickyObsahDiv.children.length > 1) { // Nechceme smazat původní odstavec
                const odebrany = dynamickyObsahDiv.removeChild(dynamickyObsahDiv.lastElementChild);
                console.log("Odebrán poslední prvek:", odebrany.id);
                // pocetPridanychElementu--; // Pokud bychom chtěli udržovat přesné počítadlo
            } else {
                console.log("Není co odebírat (kromě výchozího odstavce).");
            }
        });
    }

    // --- 4. Události ---
    const klikaciTlacitko = document.getElementById('klikaciTlacitko');
    if (klikaciTlacitko) {
        klikaciTlacitko.addEventListener('click', function (event) {
            alert('Tlačítko bylo stisknuto!');
            console.log('Událost kliknutí:', event);
            console.log('Cíl události (event.target):', event.target);
        });
    }

    const oblastMysi = document.getElementById('oblastMysi');
    const poziceXSpan = document.getElementById('poziceX');
    const poziceYSpan = document.getElementById('poziceY');

    if (oblastMysi && poziceXSpan && poziceYSpan) {
        oblastMysi.addEventListener('mouseover', function () {
            this.textContent = 'Myš je zde!';
            this.style.backgroundColor = 'lightgreen';
        });
        oblastMysi.addEventListener('mouseout', function () {
            this.textContent = 'Najedu myší sem';
            this.style.backgroundColor = 'lightcoral';
        });
        // Celý dokument poslouchá pohyb myši pro zobrazení souřadnic
        document.addEventListener('mousemove', function (event) {
            poziceXSpan.textContent = event.clientX;
            poziceYSpan.textContent = event.clientY;
        });
    }

    // Formulářové události
    const mujFormular = document.getElementById('mujFormular');
    const jmenoInput = document.getElementById('jmenoInput');
    const vystupJmeno = document.getElementById('vystupJmeno');
    const poznamkyInput = document.getElementById('poznamkyInput');
    const validacePoznamky = document.getElementById('validacePoznamky');

    if (jmenoInput && vystupJmeno) {
        // Událost 'input' reaguje na každou změnu
        jmenoInput.addEventListener('input', function (event) {
            vystupJmeno.textContent = event.target.value;
        });
    }

    if (poznamkyInput && validacePoznamky) {
        // Událost 'change' reaguje až po ztrátě fokusu, pokud se hodnota změnila
        poznamkyInput.addEventListener('change', function (event) {
            console.log("Poznámky 'change' event:", event.target.value);
        });
        // Jednoduchá validace při 'blur' (ztráta fokusu)
        poznamkyInput.addEventListener('blur', function (event) {
            if (event.target.value.length < 5 && event.target.value.length > 0) {
                validacePoznamky.textContent = "Poznámka musí mít alespoň 5 znaků.";
            } else {
                validacePoznamky.textContent = "";
            }
        });
    }

    if (mujFormular) {
        mujFormular.addEventListener('submit', function (event) {
            event.preventDefault(); // Zabráníme výchozímu odeslání formuláře (reload stránky)
            const jmeno = jmenoInput.value;
            const poznamky = poznamkyInput.value;
            console.log('Formulář odeslán (zabráněno výchozí akci).');
            alert(`Formulář odeslán!\nJméno: ${jmeno}\nPoznámky: ${poznamky}`);
            // Zde by typicky následovalo odeslání dat na server pomocí fetch API
            // mujFormular.reset(); // Vyčistí formulář
        });
    }

    // --- 5. Event Bubbling a Capturing ---
    const rodicDiv = document.getElementById('rodicDiv');
    const diteDiv = document.getElementById('diteDiv');
    const vnitrniTlacitko = document.getElementById('vnitrniTlacitko');

    if (rodicDiv && diteDiv && vnitrniTlacitko) {
        // Capturing phase (zachytávání) - od rodiče k dítěti
        rodicDiv.addEventListener('click', function (event) {
            console.log('CAPTURING: Kliknuto na Rodičovský DIV');
            // event.stopPropagation(); // Zastaví další šíření (i k dítěti a do bubbling fáze)
        }, true); // Třetí argument 'true' zapíná capturing

        diteDiv.addEventListener('click', function (event) {
            console.log('CAPTURING: Kliknuto na Dceřiný DIV');
        }, true);

        vnitrniTlacitko.addEventListener('click', function (event) {
            console.log('CAPTURING (nebo TARGET): Kliknuto na Vnitřní Tlačítko');
        }, true);


        // Bubbling phase (bublání) - od dítěte k rodiči (výchozí)
        rodicDiv.addEventListener('click', function (event) {
            console.log('BUBBLING: Kliknuto na Rodičovský DIV');
            console.log('event.target (původní cíl):', event.target.id);
            console.log('event.currentTarget (aktuální handler):', event.currentTarget.id);
        });

        diteDiv.addEventListener('click', function (event) {
            console.log('BUBBLING: Kliknuto na Dceřiný DIV');
            // event.stopPropagation(); // Pokud odkomentujeme, událost se nedostane k rodicDiv v bubbling fázi
        });

        vnitrniTlacitko.addEventListener('click', function (event) {
            console.log('BUBBLING (nebo TARGET): Kliknuto na Vnitřní Tlačítko');
        });
    }
});

window.addEventListener('resize', function () {
    console.log(`Velikost okna změněna: ${window.innerWidth}x${window.innerHeight}`);
});

window.addEventListener('scroll', function () {
    console.log(`Posunuto na Y: ${window.scrollY}`);
});
