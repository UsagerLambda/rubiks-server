import { create_level } from './api/create_level.js';

window.facesValues = {
    "face_1": [], // top
    "face_2": [], // left
    "face_3": [], // front
    "face_4": [], // right
    "face_5": [], // back
    "face_6": []  // bottom
};

// Tableau d'images
window.images = {
    1: 'assets/segments/blank.png',
    2: 'assets/segments/crossroad_path.png',
    3: 'assets/segments/straight_horizontal.png',
    4: 'assets/segments/straight_vertical.png',
    5: 'assets/segments/t_bottom.png',
    6: 'assets/segments/t_right.png',
    7: 'assets/segments/t_left.png',
    8: 'assets/segments/t_top.png',
    9: 'assets/segments/turn_bottom_left.png',
    10: 'assets/segments/turn_bottom_right.png',
    11: 'assets/segments/turn_top_left.png',
    12: 'assets/segments/turn_top_right.png',
    13: 'assets/segments/start.png',
    14: 'assets/segments/end.png'
};

function createFaces(gridSize) {
    // Pour chaque face dans html (6 faces au total)
    document.querySelectorAll(".face").forEach(face => {
        // réinitialise le contenu de la face
        face.innerHTML = "";
        face.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        face.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        // Récupère l'identifiant de la face actuelle
        const faceId = `face_${Array.from(document.querySelectorAll('.face')).indexOf(face) + 1}`;

        // Réinitialise le tableau de valeurs pour cette face
        window.facesValues[faceId] = [];

        // Crée les cellules dans la face
        for (let i = 0; i < gridSize * gridSize; i++) {
            // crée une div pour la cellule
            let cell = document.createElement("div");
            cell.classList.add("cell");

            // Crée l'image à l'intérieur de la cellule
            let img = document.createElement("img");
            img.src = window.images[1];
            img.alt = `Image 1`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';

            // Ajoute l'image à la cellule
            cell.appendChild(img);

            // Initialise à la valeur 1
            window.facesValues[faceId][i] = 1;

            // Ajoute un gestionnaire d'événements pour le clic sur la cellule
            cell.addEventListener("click", function() {
                const cellIndex = Array.from(face.children).indexOf(this);
                let currentValue = window.facesValues[faceId][cellIndex];
                // Incrémentation modulo entre 1 et 14
                currentValue = (currentValue % 14) + 1;

                img.src = window.images[currentValue];
                img.alt = `Image ${currentValue}`;

                window.facesValues[faceId][cellIndex] = currentValue;
                console.log(`Face ${faceId}, valeurs:`, window.facesValues[faceId]);
            });

            // Ajoute la cellule dans la face
            face.appendChild(cell);
        }
    });
}

// Ajouter les styles
const style = document.createElement('style');
style.textContent = `
.cell {
    border: 1px solid #333;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
}
.cell:hover {
    background-color: rgba(240, 240, 240, 0.5);
}
`;
document.head.appendChild(style);

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Récupère l'élément dropdown dans le HTML
    const dropdown = document.getElementById('dropdown');
    if (!dropdown) return;

    // Initialise la taille du rubiks cube avec la valeur par défaut
    const initialSize = parseInt(dropdown.value);
    createFaces(initialSize);

    // Écoute l'élément dropdown
    dropdown.addEventListener('change', function() {
        const newSize = parseInt(this.value);
        if (newSize >= 2 && newSize <= 6) {
            createFaces(newSize);
        }
    });

    // Gestionnaire pour le bouton Create
    const createButton = document.getElementById('Create');
    if (createButton) {
        createButton.addEventListener('click', function() {
            const textInput = document.getElementById('textInput');
            if (!textInput || !textInput.value.trim()) {
                alert('Veuillez entrer un nom pour le niveau');
                return;
            }

            // Créer les données dans le format attendu par l'API
            const data = {
                name: textInput.value,
                cube_size: parseInt(dropdown.value),
                faces_data: window.facesValues
            };

            // Appel de la fonction create_level avec data
            create_level(data);
        });
    }

    // Gestionnaire pour le bouton Return
    const returnButton = document.getElementById('Return');
    if (returnButton) {
        returnButton.addEventListener('click', function() {
            if (confirm('Quitter sans sauvegarder?')) {
                window.location.href = 'index.html';
            }
        });
    }
});
