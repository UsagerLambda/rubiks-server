import { apiUrl } from '../config.js';

export function create_level(data) {
    const createApiUrl = `${apiUrl}create_level/`;

    console.log("Création du niveau:", data);

    // Envoie de la requête de type POST avec le body
    fetch(createApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la création du niveau');
        }
        return response.json();
    })
    .then(data => {
        console.log('Niveau créé avec succès:', data);
        alert('Niveau créé avec succès!');
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la création du niveau');
    });
}
