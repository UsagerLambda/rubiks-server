import { apiUrl } from '../config.js';

export function update_level(id, data) {
    // La fonction prend l'id du niveau (dans l'url de la page) et data (body pour la requête PUT)
    // Construction de l'url pour l'UPDATE
    const updateApiUrl = `${apiUrl}update_level/${id}`;

    fetch(updateApiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du niveau');
        }
        return response.json();
    })
    .then(data => {
        console.log('Niveau mis à jour:', data);
        alert('Niveau mis à jour avec succès!');
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la mise à jour du niveau');
    });
}
