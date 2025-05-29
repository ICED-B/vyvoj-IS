# Praktické příklady CSS
Tento adresář obsahuje sadu praktických HTML a CSS stránek demonstrujících různé koncepty a techniky CSS.

## Struktura
* `index.html`: Hlavní vstupní stránka, která slouží jako rozcestník k jednotlivým ukázkám CSS.
* `pages/`: Podadresář obsahující jednotlivé HTML soubory a případné CSS soubory zaměřené na specifické aspekty CSS:
    * `basic/`: Základní CSS vlastnosti. TODO
        * `colors.html`: Ukázka práce s barvami. TODO
        * `text.html`: Stylování textu. TODO
    * `layout.html`: Obecná stránka demonstrující různé layoutovací techniky.
    * `layouts/`: Specifické layoutovací techniky.
        * `flex.html`: Příklad použití Flexboxu.
        * `float.html`: Příklad použití vlastnosti float.
        * `grid.html`: Příklad použití CSS Gridu.
    * `margins.html`: Demonstrace vnějších okrajů (margins) a jejich chování.
    * `penguin.html` a `penguin.css`: Komplexnější příklad stylizovaného tučňáka pomocí CSS.

## Jak spustit
Otevřete soubor `index.html` ve vašem webovém prohlížeči. Odtud by měly vést odkazy na všechny dílčí příklady.

Pro pohodlnější vývoj a automatické obnovování stránky při změnách doporučujeme použít rozšíření **Live Server** ve Visual Studio Code:
* Klikněte pravým tlačítkem na soubor `index.html` (nebo jakýkoli jiný `.html` soubor z příkladů) ve VS Code.
* Vyberte "Open with Live Server".

Prohlížením jednotlivých `.html` souborů a jejich přidružených stylů (buď interních v `<style>` tagu, nebo v externích `.css` souborech jako `penguin.css`) můžete studovat konkrétní implementace CSS pravidel.