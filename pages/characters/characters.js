let currentPageUrl = 'https://swapi.dev/api/people/';

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards!');
    }

    const nextButton = document.getElementById('next-btn');
    const backButton = document.getElementById('back-btn');

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = ''; //Limpar os resultados anteriores

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
            card.className = 'cards';

            const characterNameBg = document.createElement("div");
            characterNameBg.className = 'character-name-bg';

            const characterName = document.createElement('span');
            characterName.className = 'character-name';
            characterName.innerText = `${character.name}`;

            characterNameBg.appendChild(characterName);
            card.appendChild(characterNameBg);

            card.onclick = () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = 'visible';

                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = '';

                const characterImage = document.createElement('div');
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = 'character-img';

                const name = document.createElement('span');
                name.className = 'character-details';
                name.innerText = `Name: ${character.name}`;

                const characterHeight = document.createElement('span');
                characterHeight.className = 'character-details';
                characterHeight.innerText = `Height: ${convertHeight(character.height)} m`;

                const mass = document.createElement('span');
                mass.className = 'character-details';
                mass.innerText = `Mass: ${character.mass} kg`;

                const eyeColor = document.createElement('span');
                eyeColor.className = 'character-details';
                eyeColor.innerText = `Eye color: ${character.eye_color}`;

                const birthYear = document.createElement('span');
                birthYear.className = 'character-details';
                birthYear.innerText = `Birth: ${character.birth_year}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(characterHeight);
                modalContent.appendChild(mass);
                modalContent.appendChild(eyeColor);
                modalContent.appendChild(birthYear);
            }

            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-btn');
        const backButton = document.getElementById('back-btn');

        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        backButton.style.visibility = responseJson.previous ? 'visible' : 'hidden';

        currentPageUrl = url;

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar os personagens')
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página!');
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior!');
    }
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = 'hidden';
}

function convertHeight(height) {
    if (height === 'unknown') {
        return 'unknown';
    }

    return (height/100).toFixed(2);
}