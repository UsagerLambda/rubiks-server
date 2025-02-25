import { apiUrl } from '../config.js';
import { get_all_levels } from './get_all_levels.js';

export function delete_level(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce niveau?')) {
        return;
    }

    // Assemble l'url pour faire la requête DELETE
    const deleteApiUrl = `${apiUrl}delete_level/${id}`;

    fetch(deleteApiUrl, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du niveau');
        }
        return response.json();
    })
    .then(data => {
        console.log('Niveau supprimé:', data);
        // Recharger la liste des niveaux
        get_all_levels();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du niveau');
    });
}
