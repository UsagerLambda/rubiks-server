import { apiUrl } from '../config.js';
import { delete_level } from './delete_level.js';

function renderLevels(data) {
    const levelCardsContainer = document.getElementById("level-cards");

    // Vide le conteneur
    if (levelCardsContainer) {
        levelCardsContainer.innerHTML = '';

        // Gestion des cas ou pas de niveaux récupérés
        if (!data.levels || data.levels.length === 0) {
            levelCardsContainer.innerHTML = '<p>Aucun niveau disponible.</p>';
            return;
        }

        data.levels.forEach(level => {
            const card = document.createElement('div');
            card.className = 'level-card';

            card.innerHTML = `
                <div class="level-info">
                    <span class="level-name">${level.name}</span>
                    <span class="cube-size">${level.cube_size}</span>
                </div>
                <div class="level-actions">
                    <button class="icon-btn edit-btn" data-id="${level.id}">
                        <img src="Assets/editer.png" alt="Modifier">
                    </button>
                    <button class="icon-btn delete-btn" data-id="${level.id}">
                        <img src="Assets/corbeille.png" alt="Supprimer">
                    </button>
                </div>
            `;

            // Ajoute la card
            levelCardsContainer.appendChild(card);

            // Ajoute des gestionnaires d'événements {
            const editBtn = card.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                window.location.href = `update.html?id=${level.id}`;
            });

            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                delete_level(level.id);
            // }
            });
        });
    } else {
        console.error("Conteneur 'level-cards' non trouvé!");
    }
}

export function get_all_levels() {
    const getAllLevelsUrl = `${apiUrl}get_all_levels/`;

    // Afficher un message de chargement
    const levelCardsContainer = document.getElementById("level-cards");
    if (levelCardsContainer) {
        levelCardsContainer.innerHTML = '<p>Chargement des niveaux...</p>';
    }

    fetch(getAllLevelsUrl, {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des niveaux');
        }
        return response.json();
    })
    .then(data => {
        console.log('Niveaux chargés:', data);
        renderLevels(data); // <--- Affiche les niveaux récupérés par get_all_levels
    })
    .catch(error => {
        console.error('Erreur:', error);
        if (levelCardsContainer) {
            levelCardsContainer.innerHTML = '<p>Erreur lors du chargement des niveaux.</p>';
        }
    });
}
