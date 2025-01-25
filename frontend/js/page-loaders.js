// page-loaders.js
import { APIService } from './api-service.js';
import { CubePatron } from './cube-patron.js';
import { API_ENDPOINTS, PAGE_ROUTES } from './api-config.js';

/* =================================================================================== */

export function IndexLoader() {
    const levelsContainer = document.getElementById('levels-container');
    const reloadBtn = document.getElementById('reload-btn');

    async function renderLevels() {
        try {
            const data = await APIService.getLevels();
            levelsContainer.innerHTML = '';

            data.levels.forEach(level => {
                const levelDiv = document.createElement('div');
                levelDiv.classList.add('card');

                levelDiv.innerHTML = `
                    <h2>${level.name}</h2>
                    <p><strong>Cube Size:</strong> ${level.cube_size}</p>
                    <div class="buttons">
                        <button class="edit" data-id="${level.id}">
                            <img class="icon" src="assets/editer.png" alt="Edit">
                        </button>
                        <button class="delete" data-id="${level.id}">
                            <img class="icon" src="assets/corbeille.png" alt="Delete">
                        </button>
                    </div>
                `;

                levelsContainer.appendChild(levelDiv);
            });

            // Delete button event listener
            levelsContainer.addEventListener('click', async (event) => {
                const deleteButton = event.target.closest('.delete');
                const editButton = event.target.closest('.edit');

                if (deleteButton) {
                    const levelId = deleteButton.dataset.id;
                    const levelName = deleteButton.closest('.card').querySelector('h2').textContent;

                    if (confirm(`Voulez-vous vraiment supprimer le niveau "${levelName}" ?`)) {
                        try {
                            await APIService.deleteLevel(levelId);
                            await renderLevels();
                        } catch (error) {
                            alert(`Erreur de suppression: ${error.message}`);
                        }
                    }
                }

                // Edit button navigation
                if (editButton) {
                    const levelId = editButton.dataset.id;
                    window.location.href = `update.html?id=${levelId}`;
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des niveaux:', error);
            alert(`Erreur de récupération: ${error.message}`);
        }
    }

    // Initial render
    renderLevels();

    // Reload button event listener
    reloadBtn.addEventListener('click', renderLevels);
}

/* =================================================================================== */

export function CreateLoader() {
    const cube = new CubePatron();
    const tailleSelect = document.getElementById('taille-select');
    const createButton = document.getElementById('create-button');

    tailleSelect.addEventListener('change', (event) => {
        const nouvelleTaille = parseInt(event.target.value, 10);
        cube.changerTaille(nouvelleTaille);
    });

    createButton.addEventListener('click', async () => {
        const cubeName = document.getElementById('cube-name').value || 'Default Name';
        const cubeSize = cube.taille;
        const facesData = cube.getFacesData();

        const cubeData = {
            name: cubeName,
            cube_size: cubeSize,
            faces_data: facesData
        };

        try {
            const response = await APIService.createLevel(cubeData);
            alert(`Niveau créé avec succès : ${response.message || 'OK'}`);
            window.location.href = PAGE_ROUTES.INDEX;
        } catch (error) {
            alert(`Erreur de création: ${error.message}`);
        }
    });
}

/* =================================================================================== */

export async function UpdateLoader() {
    const cube = new CubePatron();
    const updateButton = document.getElementById('update-button');
    const tailleSelect = document.getElementById('taille-select');
    const cubeNameInput = document.getElementById('cube-name');

    // Get level ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const levelId = urlParams.get('id');

    if (!levelId) {
        alert('No level ID provided');
        window.location.href = PAGE_ROUTES.INDEX;
        return;
    }

    try {
        const response = await APIService.getLevel(levelId);
        const level = response.level;

        cubeNameInput.value = level.name;

        tailleSelect.value = level.cube_size;
        cube.changerTaille(level.cube_size);

        const faceNames = ['top', 'front', 'right', 'back', 'left', 'bottom'];
        faceNames.forEach((faceName, index) => {
            const faceKey = `face_${index + 1}`;
            cube.faces[faceName] = level.faces_data[faceKey];

            const face = document.getElementById(faceName);
            const cells = face.querySelectorAll('.cube-cell img');
            cells.forEach((cell, cellIndex) => {
                const value = level.faces_data[faceKey][cellIndex];
                cell.src = cube.images[value] || 'assets/segments/blank.png';
            });
        });
        cube.updateDebugDisplay();

        updateButton.addEventListener('click', async () => {
            const cubeName = cubeNameInput.value || 'Default Name';
            const cubeSize = cube.taille;
            const facesData = cube.getFacesData();

            const cubeData = {
                name: cubeName,
                cube_size: cubeSize,
                faces_data: facesData
            };

            try {
                const updateResponse = await APIService.updateLevel(levelId, cubeData);
                alert(`Niveau mis à jour avec succès : ${updateResponse.message || 'OK'}`);
                window.location.href = PAGE_ROUTES.INDEX;
            } catch (error) {
                alert(`Erreur de mise à jour: ${error.message}`);
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du niveau:', error);
        alert(`Erreur de récupération: ${error.message}`);
        window.location.href = PAGE_ROUTES.INDEX;
    }
}

/* =================================================================================== */

// Page Router
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    switch(currentPage) {
        case PAGE_ROUTES.INDEX:
            IndexLoader();
            break;
        case PAGE_ROUTES.CREATE:
            CreateLoader();
            break;
        case PAGE_ROUTES.UPDATE:
            UpdateLoader();
            break;
    }
});
