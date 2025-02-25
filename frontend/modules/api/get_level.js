import { apiUrl } from '../config.js';

export function get_level(id) {
    // Construit l'url pour récupérer un niveau par l'ID
    const getLevelUrl = `${apiUrl}get_level/${id}`;

    fetch(getLevelUrl, {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du niveau');
        }
        return response.json();
    })
    .then(data => {
        console.log('Niveau chargé:', data);

        if (data && data.level) {
            const level = data.level;

            // Mettre à jour le nom du niveau
            const nameInput = document.getElementById('textInput');
            if (nameInput) {
                nameInput.value = level.name;
            }

            // Mettre à jour la taille du cube
            const sizeDropdown = document.getElementById('dropdown');
            if (sizeDropdown) {
                sizeDropdown.value = level.cube_size.toString();

                if (typeof window.createFaces === 'function') {
                    window.createFaces(level.cube_size, level.faces_data);
                } else {
                    console.error('La fonction createFaces n\'est pas disponible');
                }
            } else {
                console.error('Format de données invalide:', data);
                alert('Erreur: Données du niveau invalide');
            }
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du niveau');
    });
}
