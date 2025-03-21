let donnees = [];
let panier = [];
const liste = document.getElementById('produitsList');
const h2 = document.querySelector('h2');  // Récupérer le <h2>
const burgersButton = document.getElementById('burgersButton');
const sidesButton = document.getElementById("sidesButton");
const drinksButton = document.getElementById("drinksButton");
const dessertsButton = document.getElementById("dessertsButton");
const menusButton = document.getElementById("menusButton");
const happymealButton = document.getElementById("happymealButton");

// Charger les données JSON
fetch('../mcdo.json')
    .then(response => response.json())
    .then(data => {
        donnees = data;
        generateProductModals(donnees);
        burgersButton.addEventListener('click', () => afficherProduits('burgers', 'Burgers'));
        sidesButton.addEventListener('click', () => afficherProduits('sides', 'Accompagnements'));
        drinksButton.addEventListener('click', () => afficherProduits('drinks', 'Boissons'));
        dessertsButton.addEventListener('click', () => afficherProduits('desserts', 'Desserts'));
        menusButton.addEventListener('click', () => afficherProduits('menus', 'Menus'));
        happymealButton.addEventListener('click', () => afficherProduits('happyMeal', 'Happy Meal'));
    })
    .catch(error => {
        console.error("Erreur lors du chargement du fichier JSON : ", error);
    });


    
// Afficher les produits d'une catégorie
function afficherProduits(type, titre) {
    liste.innerHTML = "";

    // Mettre à jour le titre <h2>
    h2.textContent = titre;

    const produits = donnees[type];

    if (produits) {
        produits.forEach(produit => {
            const produitHTML = `
                <div class="produit-card" data-id="${produit.id}">
                    <a href="#">
                        <img src="../assets/${produit.image}" alt="${produit.name}">
                    </a>
                    <div class="produit-info">
                        <h3>${produit.name}</h3>
                        <p>${produit.price} €</p>
                    </div>
                </div>
            `;

            liste.innerHTML += produitHTML;
        });

        // Click sur chaque carte pour ouvrir la modale
        const cartes = document.querySelectorAll('.produit-card');
        cartes.forEach(card => {
            card.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                ouvrirModal(id);
            });
        });
    }
}

// Générer toutes les modales de produits
function generateProductModals(data) {
    const existingModals = document.querySelectorAll('.product-modal');
    existingModals.forEach(modal => modal.remove());

    const categories = [
        ...data.burgers,
        ...data.sides,
        ...data.drinks,
        ...data.desserts,
        ...data.menus,
        ...data.happyMeal
    ];

    categories.forEach(produit => {
        const modal = document.createElement('div');
        modal.id = `productModal-${produit.id}`;
        modal.className = 'modal product-modal';

        const isMenu = produit.sideOptions || produit.drinkOptions || produit.toyOptions;

        // Si c'est un menu, récupérer les calories du plat principal
        let caloriesPrincipal = 0;
        if (produit.main) {
            const platPrincipal = findProductById(produit.main, data);
            caloriesPrincipal = platPrincipal ? platPrincipal.calories : 0;
        }

        modal.innerHTML = `
            <div class="modal-body">
                <div class="modal-header">
                    <h2>${produit.name}</h2>
                </div>
                <div class="modal-content">
                    <div class="col">	
                        <img src="../assets/${produit.image}" alt="${produit.name}" class="img-produit">
                        <p><strong>Prix :</strong> ${produit.price.toFixed(2)} €</p>
                        ${caloriesPrincipal !== 0 ? `<p><strong>Calories :</strong> ${caloriesPrincipal} kcal</p>` : ''}
                        ${caloriesPrincipal !== 0 ? '' : `<p>${produit.description}</p>`}
                        ${isMenu ? generateOptionsForm(produit, data) : ''}
                        <p id="caloriesTotal-${produit.id}"><strong>Total Calories :</strong> ${caloriesPrincipal || 0} kcal</p>
                        <button onclick="ajouterAuPanier(${produit.id})" class="primary-btn">Ajouter au panier</button>      
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    });
}

// Générer le formulaire d'options pour menus et Happy Meal
function generateOptionsForm(produit, data) {
    let html = '<form class="menu-options">';

    if (produit.sideOptions) {
        html += '<p><strong>Choisissez un accompagnement :</strong></p>';
        produit.sideOptions.forEach(id => {
            const option = findProductById(id, data);
            if (option) {
                html += `
                    <label>
                        <input type="radio" name="side-${produit.id}" value="${option.calories}" data-produitid="${produit.id}">
                        ${option.name} (${option.calories} kcal)
                    </label>
                `;
            }
        });
    }

    if (produit.drinkOptions) {
        html += '<p><strong>Choisissez une boisson :</strong></p>';
        produit.drinkOptions.forEach(id => {
            const option = findProductById(id, data);
            if (option) {
                html += `
                    <label>
                        <input type="radio" name="drink-${produit.id}" value="${option.calories}" data-produitid="${produit.id}">
                        ${option.name} (${option.calories} kcal)
                    </label>
                `;
            }
        });
    }

    if (produit.toyOptions) {
        html += '<p><strong>Choisissez un jouet :</strong></p>';
        produit.toyOptions.forEach(toy => {
            html += `
                <label>
                    <input type="radio" name="toy-${produit.id}" value="0" data-produitid="${produit.id}">
                    ${toy}
                </label>
            `;
        });
    }

    html += '</form>';
    return html;
}

// Cherche un produit dans toutes les catégories par son ID
function findProductById(id, data) {
    const allProducts = [
        ...data.burgers,
        ...data.sides,
        ...data.drinks,
        ...data.desserts,
        ...data.menus,
        ...data.happyMeal
    ];

    return allProducts.find(product => product.id == id);
}

// Ouvre une modale spécifique
function ouvrirModal(id) {
    const modal = document.getElementById(`productModal-${id}`);
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Ajouter l'event sur les radios à l'ouverture de la modale
        const radios = modal.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => calculerTotalCalories(id));
        });

        // Initialiser le total des calories
        calculerTotalCalories(id);
    }
}

// Ferme une modale spécifique
function fermerModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Calcul du total des calories (base + options)
function calculerTotalCalories(produitId) {
    const modal = document.getElementById(`productModal-${produitId}`);
    const produit = findProductById(produitId, donnees);

    let totalCalories = produit.calories || 0;

    // Si c'est un menu, ajouter les calories du plat principal
    if (produit.main) {
        const platPrincipal = findProductById(produit.main, donnees);
        totalCalories += platPrincipal ? platPrincipal.calories : 0;
    }

    const radios = modal.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        const calories = parseInt(radio.value) || 0;
        totalCalories += calories;
    });

    const caloriesDisplay = modal.querySelector(`#caloriesTotal-${produitId}`);
    caloriesDisplay.innerHTML = `<strong>Total Calories :</strong> ${totalCalories} kcal`;
}

// Ferme la modale si on clique en dehors du contenu
window.addEventListener('click', function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
});


//-------------------------------------------------//
const panierButton = document.getElementById('panierButton');
const checkPanier = document.getElementById('idcheckPanier');
const modalPanier = document.getElementById('modalPanier');


// ACTION AFFICHAGE MODAL (CSS)
panierButton.addEventListener("click", function(){
    modalPanier.style.display = "block";
});
// CLOSE MODAL EN CLIQUANT A L'EXTERIEUR (CSS)

window.onclick = function(event) {
    if (event.target == modalPanier) {
        modalPanier.style.display = "none";
    }
}


//-------------------------------------------------//

function ajouterAuPanier(produitId) {
    const produit = findProductById(produitId, donnees);

    if (!produit) {
        console.error("Produit introuvable !");
        return;
    }

    // Cherche si le produit est déjà dans le panier
    const produitDansPanier = panier.find(item => item.id === produitId);

    if (produitDansPanier) {
        produitDansPanier.quantite += 1; // Si oui, augmente la quantité
    } else {
        panier.push({ ...produit, quantite: 1 }); // Sinon, ajoute-le avec quantité = 1
    }

    afficherPanier();
}

function afficherPanier() {
    const modalContent = document.querySelector('#modalPanier .modal-content');
    const montantTotal = document.querySelector('#modalPanier .montant p:last-child');

    modalContent.innerHTML = `
        <table class="panier-table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Nom</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Supprimer</th>
                </tr>
            </thead>
            <tbody id="panier-body"></tbody>
        </table>
    `;

    const tbody = document.getElementById('panier-body');
    let totalPrix = 0;

    panier.forEach((item) => {
        const prixTotalProduit = item.price * item.quantite;
        totalPrix += prixTotalProduit;
    
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="../assets/${item.image}" alt="${item.name}" style="width: 50px;"></td>
            <td>${item.name}</td>
            <td>
                <button onclick="changerQuantite(${item.id}, -1)">-</button>
                ${item.quantite}
                <button onclick="changerQuantite(${item.id}, 1)">+</button>
            </td>
            <td>${prixTotalProduit.toFixed(2)} €</td>
            <td><button onclick="supprimerProduit(${item.id})">❌</button></td>
        `;
    
        tbody.appendChild(row);
    });

    montantTotal.textContent = `${totalPrix.toFixed(2)} €`;
}

function changerQuantite(produitId, delta) {
    const produit = panier.find(item => item.id === produitId);

    if (!produit) return;

    produit.quantite += delta;

    if (produit.quantite <= 0) {
        panier = panier.filter(item => item.id !== produitId);
    }

    afficherPanier();
}

function supprimerProduit(produitId) {
    panier = panier.filter(item => item.id !== produitId);
    afficherPanier();
}

function getTotalPrix() {
    return panier.reduce((total, item) => total + item.price * item.quantite, 0);
}

checkPanier.addEventListener("click", function() {
    const totalPrix = getTotalPrix();
    if (totalPrix > 0) {
        afficherPayement();
    } else {
        alert("Sélectionnez au moins 1 produit");
    }
});

function afficherPayement(){
    const modalContent = document.querySelector('#modalPanier .modal-content');
    const modalFooter = document.querySelector('#modalPanier .modal-footer');
    modalContent.innerHTML = "";
    modalFooter.innerHTML = "";

    modalContent.innerHTML = `
        <div class="col">
            <form id="form">			
                <div class="col">
                    <label for="table">Numéro de table</label>
                    <input type="number" name="table" id="table">
                </div>
            </form>				
            <button id="btnCarte" class="primary-btn">Carte</button>
            <button id="btnComptoir" class="primary-btn">Comptoir</button>
        </div>
    `;

    // Ajout des event listeners après l'injection HTML
    const btnCarte = document.getElementById('btnCarte');
    const btnComptoir = document.getElementById('btnComptoir');

    btnCarte.addEventListener('click', () => {
        envoyerRecap('Carte');
    });

    btnComptoir.addEventListener('click', () => {
        envoyerRecap('Comptoir');
    });
}


function envoyerRecap(moyenPaiement) {
    const numeroTable = document.getElementById('table').value;
    const totalPrix = getTotalPrix();

    // Vérif si le champ est bien rempli
    if (!numeroTable) {
        alert('Veuillez entrer le numéro de table');
        return;
    }

    // On envoie à la fonction recap (tu peux adapter à ton besoin)
    recap({
        table: numeroTable,
        paiement: moyenPaiement,
        panier: panier,
        total: totalPrix
    });
}


function recap({ table, paiement, panier, total }) {
    const modalContent = document.querySelector('#modalPanier .modal-content');
    const modalFooter = document.querySelector('#modalPanier .modal-footer');

    modalContent.innerHTML = '';
    modalFooter.innerHTML = '';

    let ticketHTML = `
        <h2>Ticket de caisse</h2>
        <p><strong>Table :</strong> ${table}</p>
        <p><strong>Moyen de paiement :</strong> ${paiement}</p>
        <table class="panier-table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                </tr>
            </thead>
            <tbody>
    `;

    panier.forEach(item => {
        ticketHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantite}</td>
                <td>${(item.price * item.quantite).toFixed(2)} €</td>
            </tr>
        `;
    });

    ticketHTML += `
            </tbody>
        </table>
        <p><strong>Total :</strong> ${total.toFixed(2)} €</p>
        <button onclick="terminerCommande()" class="primary-btn">Terminer</button>
    `;

    modalContent.innerHTML = ticketHTML;
}


function terminerCommande() {
    alert('Commande terminée ! Merci :)');
    panier = [];
    modalPanier.style.display = "none";
    window.location.href = "../index.html";
}
