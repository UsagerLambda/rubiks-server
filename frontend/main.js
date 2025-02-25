import { get_all_levels } from './modules/api/get_all_levels.js';
import { get_level } from './modules/api/get_level.js';

function initializePageHandlers() {
    const path = window.location.pathname.split("/").pop() || 'index.html';

    switch(path) {
        case '':
        case 'index.html':
            get_all_levels();

            const refreshButton = document.getElementById("Refresh");
            if (refreshButton) {
                refreshButton.addEventListener("click", get_all_levels);
            }
            break;

        case 'update.html':
            const levelId = new URLSearchParams(window.location.search).get('id');

            if (levelId) {
                get_level(levelId);
            } else {
                alert("ID de niveau non spécifié. Redirection vers la page d'accueil.");
                window.location.href = "index.html";
            }
            break;
    }
}

document.addEventListener('DOMContentLoaded', initializePageHandlers);
