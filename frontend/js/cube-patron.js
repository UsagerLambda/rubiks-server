import { IndexLoader, CreateLoader, UpdateLoader } from './page-loaders.js';

export class CubePatron {
    constructor(taille = 3) {
        this.taille = taille;
        this.faces = {
            top: [], front: [], right: [],
            back: [], left: [], bottom: []
        };
        this.couleurs = [
            '#FFFF00', '#FF0000', '#0000FF',
            '#FFFFFF', '#00FF00', '#FFA500'
        ];
        this.images = this.initImages(); // Associez des valeurs à des images
        this.debugContainer = null;
        this.initPatron();
        this.createDebugDisplay();
    }

    getFacesData() {
        return {
            face_1: this.faces.top,
            face_2: this.faces.front,
            face_3: this.faces.right,
            face_4: this.faces.back,
            face_5: this.faces.left,
            face_6: this.faces.bottom
        };
    }

    initImages() {
        return {
            1: 'assets/segments/blank.png',
            2: 'assets/segments/crossroad_path.png',
            3: 'assets/segments/straight_horizontal.png',
            4: 'assets/segments/straight_vertical.png',
            5: 'assets/segments/t_bottom.png',
            6: 'assets/segments/t_left.png',
            7: 'assets/segments/t_right.png',
            8: 'assets/segments/t_top.png',
            9: 'assets/segments/turn_bottom_left.png',
            10: 'assets/segments/turn_bottom_right.png',
            11: 'assets/segments/turn_top_left.png',
            12: 'assets/segments/turn_top_right.png',
            13: 'assets/segments/start.png',
            14: 'assets/segments/end.png'
        };
    }

    initPatron() {
        const faceElements = ['top', 'front', 'right', 'back', 'left', 'bottom'];

        faceElements.forEach((faceName, index) => {
            const face = document.getElementById(faceName);
            face.innerHTML = '';

            this.faces[faceName] = Array.from(
                { length: this.taille * this.taille },
                (_, i) => 1 // Initialisez toutes les cellules à 1
            );

            this.faces[faceName].forEach((valeur, cellIndex) => {
                const cell = document.createElement('div');
                cell.classList.add('cube-cell');
                cell.style.backgroundColor = this.couleurs[index];

                // Créez une image pour la cellule
                const img = document.createElement('img');
                img.src = this.images[valeur] || 'path/to/default.png'; // Définit une image par défaut
                img.alt = `Image ${valeur}`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain'; // Garde l'image proportionnée dans la cellule

                // Ajoutez un gestionnaire d'événement pour modifier la valeur
                img.addEventListener('click', () => this.modifierCellule(faceName, cellIndex));

                cell.appendChild(img);
                face.appendChild(cell);
            });
        });

        this.updateGridLayout();
        this.updateDebugDisplay();
    }

    modifierCellule(faceName, index) {
        // Récupère la valeur actuelle de la cellule
        let valeurActuelle = this.faces[faceName][index];

        // Incrémente la valeur (si 12, retourne à 1)
        valeurActuelle = valeurActuelle === 14 ? 1 : valeurActuelle + 1;

        // Met à jour la valeur dans le tableau des faces
        this.faces[faceName][index] = valeurActuelle;

        // Récupère la cellule correspondante dans le DOM
        const cell = document.querySelector(`#${faceName} .cube-cell:nth-child(${index + 1}) img`);

        // Met à jour l'image de la cellule en fonction de la nouvelle valeur
        cell.src = this.images[valeurActuelle] || 'path/to/default.png'; // Définit une image par défaut
        this.updateDebugDisplay();
    }

    createDebugDisplay() {
        this.debugContainer = document.createElement('div');
        this.debugContainer.id = 'debug-container';
        this.debugContainer.style.position = 'fixed';
        this.debugContainer.style.top = '10px';
        this.debugContainer.style.right = '10px';
        this.debugContainer.style.backgroundColor = 'rgba(255,255,255,0.8)';
        this.debugContainer.style.padding = '10px';
        this.debugContainer.style.border = '1px solid black';
        this.debugContainer.style.zIndex = '1000';
        this.debugContainer.style.maxHeight = '300px';
        this.debugContainer.style.overflowY = 'auto';

        document.body.appendChild(this.debugContainer);
    }

    updateDebugDisplay() {
        if (!this.debugContainer) return;

        let debugHTML = `
            <h3>Cube Details:</h3>
            <p><strong>Taille:</strong> ${this.taille}</p>
            <h4>Faces Contents:</h4>
        `;

        Object.entries(this.faces).forEach(([faceName, values]) => {
            debugHTML += `
                <div>
                    <strong>${faceName}:</strong>
                    <ul>
                        <li>Longueur: ${values.length}</li>
                        <li>Type: ${typeof values[0]}</li>
                        <li>Valeurs: ${JSON.stringify(values)}</li>
                    </ul>
                </div>
            `;
        });

        this.debugContainer.innerHTML = debugHTML;
    }

    updateGridLayout() {
        const faces = document.querySelectorAll('.cube-face');
        faces.forEach(face => {
            face.style.gridTemplateColumns = `repeat(${this.taille}, 1fr)`;
            face.style.gridTemplateRows = `repeat(${this.taille}, 1fr)`;
        });
    }

    changerTaille(nouvelleTaille) {
        this.taille = nouvelleTaille;
        this.initPatron();
    }
}
