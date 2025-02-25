import { update_level } from './api/update_level.js';
import { get_level } from './api/get_level.js';

// même fonctionnement que pour create.js {
window.facesValues = {
    "face_1": [],
    "face_2": [],
    "face_3": [],
    "face_4": [],
    "face_5": [],
    "face_6": []
};

window.images = {
    1: 'Assets/segments/blank.png',
    2: 'Assets/segments/crossroad_path.png',
    3: 'Assets/segments/straight_horizontal.png',
    4: 'Assets/segments/straight_vertical.png',
    5: 'Assets/segments/t_bottom.png',
    6: 'Assets/segments/t_left.png',
    7: 'Assets/segments/t_right.png',
    8: 'Assets/segments/t_top.png',
    9: 'Assets/segments/turn_bottom_left.png',
    10: 'Assets/segments/turn_bottom_right.png',
    11: 'Assets/segments/turn_top_left.png',
    12: 'Assets/segments/turn_top_right.png',
    13: 'Assets/segments/start.png',
    14: 'Assets/segments/end.png'
};

function createFaces(gridSize, configuration = null) {
    document.querySelectorAll(".face").forEach(face => {
        face.innerHTML = "";
        face.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        face.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        const faceId = `face_${Array.from(document.querySelectorAll('.face')).indexOf(face) + 1}`;

        window.facesValues[faceId] = [];

        for (let i = 0; i < gridSize * gridSize; i++) {
            let initialValue = 1;
            if (configuration && configuration[faceId] && i < configuration[faceId].length) {
                initialValue = configuration[faceId][i];
            }

            let cell = document.createElement("div");
            cell.classList.add("cell");

            let img = document.createElement("img");
            img.src = window.images[initialValue];
            img.alt = `Image ${initialValue}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';

            cell.appendChild(img);

            window.facesValues[faceId][i] = initialValue;

            cell.addEventListener("click", function() {
                const cellIndex = Array.from(face.children).indexOf(this);
                let currentValue = window.facesValues[faceId][cellIndex];
                currentValue = (currentValue % 14) + 1;

                img.src = window.images[currentValue];
                img.alt = `Image ${currentValue}`;

                window.facesValues[faceId][cellIndex] = currentValue;
                console.log(`Face ${faceId}, valeurs:`, window.facesValues[faceId]);
            });

            face.appendChild(cell);
        }
    });
}
// }

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

document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('dropdown');
    if (!dropdown) return;

    // Expose la fonction createFaces
    window.createFaces = createFaces;

    // Récupérer l'ID du niveau depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const levelId = urlParams.get('id');

    if (levelId) {
        console.log("Chargement du niveau", levelId);
        get_level(levelId);
    } else {
        const initialSize = parseInt(dropdown.value);
        createFaces(initialSize);
    }

    // Écoute l'élément dropdown
    dropdown.addEventListener('change', function() {
        const newSize = parseInt(this.value);
        if (newSize >= 2 && newSize <= 6) {
            createFaces(newSize);
        }
    });

    // Gestionnaire pour le bouton Update
    const updateButton = document.getElementById('Update');
    if (updateButton && levelId) {
        updateButton.addEventListener('click', function() {
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

            update_level(levelId, data);
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
