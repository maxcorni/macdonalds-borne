let donnees = [];
const liste = document.getElementById('produitsList');
const h1 = document.querySelector('h1');  // Récupérer le <h1>
const burgersButton = document.getElementById('burgersButton');
const sidesButton = document.getElementById("sidesButton");
const drinksButton = document.getElementById("drinksButton");
const dessertsButton = document.getElementById("dessertsButton");
const menusButton = document.getElementById("menusButton");
const happymealButton = document.getElementById("happymealButton");

// Charger les données JSON
fetch('../mcdo.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        donnees = data;
        burgersButton.addEventListener('click', () => afficherProduits('burgers', 'Burgers'));
        sidesButton.addEventListener('click', () => afficherProduits('sides', 'Accompagnements'));
        drinksButton.addEventListener('click', () => afficherProduits('drinks', 'Boissons'));
        dessertsButton.addEventListener('click', () => afficherProduits('desserts', 'Desserts'));
        menusButton.addEventListener('click', () => afficherProduits('menus', 'Menus'));
        happymealButton.addEventListener('click', () => afficherProduits('happyMeal', 'Happy Meal'));
    })
    .catch(function(error) {
        console.error("Erreur lors du chargement du fichier JSON : ", error);
    });

// Fonction générique pour afficher les produits
function afficherProduits(type, titre) {
    // Vider la liste des produits précédemment affichés
    liste.innerHTML = "";

    // Mettre à jour le titre <h1>
    h1.textContent = titre;

    // Obtenir les produits à partir de l'objet 'donnees' en fonction du type
    const produits = donnees[type];

    // Vérifier si des produits existent pour le type donné
    if (produits) {
        produits.forEach(function(produit) {
            const produitHTML = `
                <div class="produit-card">
                    <a href="#">
                        <img src="../assets/${produit.image}" alt="${produit.name}">
                    </a>
                    <div class="produit-info">
                        <h2>${produit.name}</h2>
                        <p>${produit.price} €</p>
                    </div>
                </div>
            `;

            // Ajouter le HTML généré à la liste
            liste.innerHTML += produitHTML;
        });
    }
}

// Générer toutes les modales de détail produit
function generateProductModals() {
    const existingModals = document.querySelectorAll('.product-modal');
    existingModals.forEach(modal => modal.remove());

    donnees.forEach(produit => {
        let modal = document.createElement('div');
        modal.id = `productModal-${produit.reference}`;
        modal.className = 'modal product-modal';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Détail du produit</h2>
                    <button class="secondary-btn close-btn" data-ref="${produit.reference}">
                        <img src="assets/images/icons/back-arrow.png" alt="back icon">Retour
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">	
                            <img src="imagesProduits/${produit.photo}" alt="${produit.libelle}" class="img-produit">
                        </div>	
                        <div class="col">
                            <div class="row">
                                <p><strong>${produit.libelle}</strong></p>
                                <img src="assets/images/icons/${produit.stock > 0 ? 'green-circle.png' : 'red-circle.png'}" alt="Stock icon">
                            </div>
                            <div class="row">
                                <p><strong>Référence :</strong> ${produit.reference}</p>
                                <p><strong>${produit.prix} €</strong></p>
                            </div>
                            <p>${produit.categorie}</p>
                            <p>${produit.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    });
}
