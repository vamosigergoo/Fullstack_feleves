document.addEventListener('DOMContentLoaded', () => {
    
    const BOMB_IMAGE_URL = "https://images.pond5.com/glitch-bomb-icon-black-background-footage-170322450_iconl.jpeg";
    
    
    const jatekterTextArea = document.getElementById('jatekter');
    const lepesekInput = document.getElementById('lepesek');
    const ellenorzesGomb = document.getElementById('ellenorzesGomb');
    const jatekterTablaDiv = document.getElementById('jatekterTabla');
    const coinSzamParagraph = document.getElementById('coinSzam');
    const bombaOverlay = document.getElementById('bombaOverlay');
    const closeBomba = document.getElementById('closeBomba');
    const ujraJatszokGomb = document.getElementById('ujraJatszokGomb');
    const bombaImage = document.querySelector('.bomba-image');
    
    
    bombaImage.src = BOMB_IMAGE_URL;

    //bomba bezárás
    closeBomba.addEventListener('click', () => {
        bombaOverlay.style.display = 'none';
    });

    
    ujraJatszokGomb.addEventListener('click', () => {
        bombaOverlay.style.display = 'none';
        
        jatekterTextArea.value = `- - - - - - - -
- - - - X - - -
- - - - ¤ ¤ - -
- - - C - ¤ - -
- - - ¤ - ¤ - -
- - ¤ ¤ - - - -
- ¤ ¤ ¤ ¤ ¤ ¤ -
- ¤ ¤ ¤ - - - -
- - - - - - - -`;
        lepesekInput.value = 'F,J,F,J';
        jatekterTablaDiv.innerHTML = '';
        coinSzamParagraph.textContent = '';
    });

    ellenorzesGomb.addEventListener('click', async () => {
        const jatekterSzoveg = jatekterTextArea.value;
        const lepesekSzoveg = lepesekInput.value;

        const requestData = {
            jatekter: jatekterSzoveg,
            lepesek: lepesekSzoveg.split(',')
        };

        try {
            const response = await fetch('http://localhost:5206/api/Jatek/ellenorzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (response.ok) {
                
                if (data.hiba === 'bomba') {
                    
                    bombaOverlay.style.display = 'flex';
                    
                    megjelenitJatekTer(data.ujJatekTer);
                    coinSzamParagraph.textContent = `Felvett coin: ${data.felvettCoin} db (BOMBA!)`;
                } else {
                    
                    bombaOverlay.style.display = 'none';
                    jatekterTablaDiv.innerHTML = '';
                    coinSzamParagraph.textContent = `Felvett coin: ${data.felvettCoin} db`;
                    megjelenitJatekTer(data.ujJatekTer);
                }
            } else {
                
                bombaOverlay.style.display = 'none';
                alert(`Hiba történt: ${data.uzenet || 'Ismeretlen hiba'}`);
                if (data.ujJatekTer) {
                    megjelenitJatekTer(data.ujJatekTer);
                }
            }
        } catch (error) {
            console.error('Hiba a kérés küldésekor:', error);
            alert('Hiba történt a szerverrel való kommunikáció során.');
        }
    });

    function megjelenitJatekTer(jatekTer) {
        jatekterTablaDiv.innerHTML = '';
        const tabla = document.createElement('table');
        tabla.style.borderCollapse = 'collapse';

        jatekTer.forEach(sor => {
            const sorElem = document.createElement('tr');
            sor.forEach(mezo => {
                const mezoElem = document.createElement('td');
                mezoElem.style.padding = '10px';
                mezoElem.style.textAlign = 'center';
                mezoElem.style.minWidth = '30px';

                switch (mezo) {
                    case '-':
                        mezoElem.className = 'mezo-ures';
                        mezoElem.textContent = '-';
                        break;
                    case 'C':
                        mezoElem.className = 'mezo-coin';
                        mezoElem.textContent = 'C';
                        break;
                    case '¤':
                        mezoElem.className = 'mezo-akadaly';
                        mezoElem.textContent = '¤';
                        break;
                    case 'X':
                        mezoElem.className = 'mezo-karakter';
                        mezoElem.textContent = 'X';
                        break;
                    case '.':
                        mezoElem.className = 'mezo-ures';
                        mezoElem.textContent = '.';
                        break;
                    default:
                        mezoElem.textContent = mezo;
                        break;
                }
                sorElem.appendChild(mezoElem);
            });
            tabla.appendChild(sorElem);
        });
        jatekterTablaDiv.appendChild(tabla);
    }
});