// Tableau qui contiendra toutes les données chargées depuis le JSON
let donnees = [];

// Tableau du panier où tu stockes les produits ajoutés
let panier = [];

// Sélection des éléments du DOM (boutons et conteneurs)
const liste = document.getElementById('produitsList');
const h2 = document.querySelector('h2');  // Le titre de la section produit

// Boutons de filtre par catégorie
const burgersButton = document.getElementById('burgersButton');
const sidesButton = document.getElementById("sidesButton");
const drinksButton = document.getElementById("drinksButton");
const dessertsButton = document.getElementById("dessertsButton");
const menusButton = document.getElementById("menusButton");
const happymealButton = document.getElementById("happymealButton");

//----------------------------------- Chargement des données depuis le fichier JSON ------------------------------------
fetch('../mcdo.json')
    .then(response => response.json())  // Conversion de la réponse en JSON
    .then(data => {
        donnees = data;  // On stocke les données récupérées dans la variable globale

        // Génère les modales pour tous les produits une fois les données chargées
        generateProductModals(donnees);

        // Ajoute les listeners sur les boutons pour filtrer les catégories
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

//----------------------------------- Affiche les produits de la catégorie sélectionnée ------------------------------------ */
function afficherProduits(type, titre) {
    liste.innerHTML = "";  // On vide la liste précédente

    h2.textContent = titre;  // On met à jour le titre avec le nom de la catégorie

    const produits = donnees[type];  // On récupère les produits de la catégorie demandée

    if (produits) {
        produits.forEach(produit => {
            // On génère la carte produit HTML pour chaque produit
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

            liste.innerHTML += produitHTML;  // On ajoute la carte au DOM
        });

        // On ajoute un listener sur chaque carte produit pour ouvrir sa modale au clic
        const cartes = document.querySelectorAll('.produit-card');
        cartes.forEach(card => {
            card.addEventListener('click', function () {
                const id = this.getAttribute('data-id');  // Récupère l'id du produit
                ouvrirModal(id);  // Ouvre la modale du produit
            });
        });
    }
}

//------------------------------- Génère les modales pour tous les produits ------------------------------------
function generateProductModals(data) {
    // Supprime les modales déjà présentes si on recharge les données
    const existingModals = document.querySelectorAll('.product-modal');
    existingModals.forEach(modal => modal.remove());

    // Regroupe tous les produits de toutes les catégories en un seul tableau

    // Fusion des tableaux dans une variable
    const categories = [
        ...data.burgers,
        ...data.sides,
        ...data.drinks,
        ...data.desserts,
        ...data.menus,
        ...data.happyMeal
    ];

    categories.forEach(produit => {
        // Création de la div modale pour chaque produit
        const modal = document.createElement('div');
        modal.id = `productModal-${produit.id}`;
        modal.className = 'modal product-modal';

        // Vérifie si c'est un menu (menus et Happy Meal)
        const isMenu = produit.sideOptions || produit.drinkOptions || produit.toyOptions;

        // Si le produit est un menu avec un plat principal, on récupère ses calories
        let caloriesPrincipal = 0;
        if (produit.main) {
            const platPrincipal = findProductById(produit.main, data);
            caloriesPrincipal = platPrincipal ? platPrincipal.calories : 0;
        }

        // Génération du contenu HTML de la modale produit
        modal.innerHTML = `
            <div class="modal-body">
                <div class="modal-header">
                    <h2>${produit.name}</h2>
                </div>
                <div class="modal-content">
                    <div class="col">	
                        <img src="../assets/${produit.image}" alt="${produit.name}" class="img-produit">
                        <p><strong>Prix :</strong> ${produit.price.toFixed(2)} €</p>

                        <!-- Affiche les calories du plat principal si c'est un menu -->
                        ${caloriesPrincipal !== 0 ? `<p><strong>Calories :</strong> ${caloriesPrincipal} kcal</p>` : ''}
                        
                        <!-- Sinon, affiche la description du produit -->
                        ${caloriesPrincipal !== 0 ? '' : `<p>${produit.description}</p>`}

                        <!-- Si c'est un menu, on génère les formulaires pour les options -->
                        ${isMenu ? generateOptionsForm(produit, data) : ''}

                        <!-- Affiche le total des calories -->
                        <p id="caloriesTotal-${produit.id}"><strong>Total Calories :</strong> ${caloriesPrincipal || 0} kcal</p>

                        <!-- Bouton pour ajouter au panier -->
                        <div class="row">
                            <button onclick="ajouterAuPanier(${produit.id})" class="primary-btn">Ajouter au panier</button>  
                            <p id="quantiteProduit-${produit.id}"><strong> Panier :</strong> 0</p>
                        </div>      
                    </div>
                </div>
            </div>
        `;

        // On ajoute la modale au body
        document.body.appendChild(modal);
    });
}

//  Génère le formulaire d'options pour menus et Happy Meal
function generateOptionsForm(produit, data) {
    let html = '<form class="menu-options">';

    // Si le produit a des accompagnements à choisir (menus)
    if (produit.sideOptions) {
        html += '<p><strong>Choisissez un accompagnement :</strong></p>';
        produit.sideOptions.forEach((id, index) => {
            const option = findProductById(id, data);
            if (option) {
                html += `
                    <label>
                        <input type="radio" name="side-${produit.id}" value="${option.calories}" data-produitid="${produit.id}" ${index === 0 ? 'checked' : ''}>
                        ${option.name} (${option.calories} kcal)
                    </label>
                `;
            }
        });
    }

    // Si le produit a des boissons à choisir
    if (produit.drinkOptions) {
        html += '<p><strong>Choisissez une boisson :</strong></p>';
        produit.drinkOptions.forEach((id, index) => {
            const option = findProductById(id, data);
            if (option) {
                html += `
                    <label>
                        <input type="radio" name="drink-${produit.id}" value="${option.calories}" data-produitid="${produit.id}" ${index === 0 ? 'checked' : ''}>
                        ${option.name} (${option.calories} kcal)
                    </label>
                `;
            }
        });
    }

    // Si le produit a des jouets à choisir (Happy Meal)
    if (produit.toyOptions) {
        html += '<p><strong>Choisissez un jouet :</strong></p>';
        produit.toyOptions.forEach((toy, index) => {
            html += `
                <label>
                    <input type="radio" name="toy-${produit.id}" value="0" data-produitid="${produit.id}" ${index === 0 ? 'checked' : ''}>
                    ${toy}
                </label>
            `;
        });
    }

    html += '</form>';
    return html;  // On retourne le formulaire HTML généré
}


// ------------------------------------ Cherche un produit dans toutes les catégories par son ID ------------------------------------ 
function findProductById(id, data) {
    const allProducts = [
        ...data.burgers,
        ...data.sides,
        ...data.drinks,
        ...data.desserts,
        ...data.menus,
        ...data.happyMeal
    ];

    // Renvoie le produit dont l'id correspond à celui recherché
    return allProducts.find(product => product.id == id);
}

//----------------------------------- Ouvre une modale produit spécifique ------------------------------------
function ouvrirModal(id) {
    const modal = document.getElementById(`productModal-${id}`);

    if (modal) {
        modal.style.display = 'block';  // Affiche la modale
        document.body.classList.add('modal-open');  // Empêche de scroller en arrière-plan

        // Récupère tous les boutons radio dans la modale
        const radios = modal.querySelectorAll('input[type="radio"]');
        
        // À chaque fois qu'un radio change, on recalcule les calories
        radios.forEach(radio => {
            radio.addEventListener('change', () => calculerTotalCalories(id));
        });

        // Initialise les calories à l'ouverture
        calculerTotalCalories(id);
    }
}


// Ferme une modale spécifique
function fermerModal(modalId) {
    const modal = document.getElementById(modalId); // Récupère la modale via son ID
    if (modal) {
        modal.style.display = 'none'; // Cache la modale
        document.body.classList.remove('modal-open'); // Supprime la classe qui désactive le scroll de la page (si elle est activée)
    }
}

// Calcul du total des calories (base + options)
function calculerTotalCalories(produitId) {
    const modal = document.getElementById(`productModal-${produitId}`); // Récupère la modale liée au produit
    const produit = findProductById(produitId, donnees); // Recherche du produit dans la base de données (donnees)

    let totalCalories = produit.calories || 0; // Calories de base du produit, 0 si non défini

    // Si c'est un menu (il contient une clé "main"), on ajoute les calories du plat principal
    if (produit.main) {
        const platPrincipal = findProductById(produit.main, donnees);
        totalCalories += platPrincipal ? platPrincipal.calories : 0; // Ajout des calories du plat principal si trouvé
    }

    // Parcours toutes les options choisies (radios cochées dans la modale)
    const radios = modal.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        const calories = parseInt(radio.value) || 0; // Récupère la valeur des calories de chaque option
        totalCalories += calories; // Ajoute les calories de l'option
    });

    // Met à jour l'affichage du total des calories dans la modale
    const caloriesDisplay = modal.querySelector(`#caloriesTotal-${produitId}`);
    caloriesDisplay.innerHTML = `<strong>Total Calories :</strong> ${totalCalories} kcal`;
}

// Ferme la modale si on clique à l'extérieur de son contenu
window.addEventListener('click', function (event) {
    const modals = document.querySelectorAll('.modal'); // Récupère toutes les modales
    modals.forEach(modal => {
        if (event.target === modal) { // Si on clique sur l'arrière-plan (et pas le contenu)
            modal.style.display = 'none'; // Ferme la modale
            document.body.classList.remove('modal-open'); // Réactive le scroll de la page si besoin
        }
    });
});

// --------------------------- Gestion de la modale Panier --------------------------- //

const panierButton = document.getElementById('panierButton'); // Bouton pour ouvrir le panier
const checkPanier = document.getElementById('idcheckPanier'); // Bouton pour valider le panier
const modalPanier = document.getElementById('modalPanier'); // Élément de la modale panier

// Ouvre la modale Panier au clic sur le bouton
panierButton.addEventListener("click", function() {
    modalPanier.style.display = "block";
});

// Ferme la modale Panier si on clique à l'extérieur du contenu
window.onclick = function(event) {
    if (event.target == modalPanier) {
        modalPanier.style.display = "none";
    }
};

// --------------------------- Gestion du panier : Ajouter / Afficher / Modifier --------------------------- //

function ajouterAuPanier(produitId) {
    const produit = findProductById(produitId, donnees); // Recherche du produit par son ID

    if (!produit) {
        console.error("Produit introuvable !");
        return; // Stop si le produit n'existe pas
    }

    // Cherche si le produit est déjà dans le panier
    const produitDansPanier = panier.find(item => item.id === produitId);

    if (produitDansPanier) {
        produitDansPanier.quantite += 1; // Incrémente la quantité si le produit est déjà dans le panier
    } else {
        panier.push({ ...produit, quantite: 1 }); // Ajoute le produit avec une quantité initiale de 1
    }

    afficherPanier(); // Met à jour l'affichage du panier

    // Met à jour l'affichage de la quantité dans la modale
    const quantiteElement = document.getElementById(`quantiteProduit-${produitId}`);
    if (quantiteElement) {
        quantiteElement.textContent = `Panier : ${produitDansPanier ? produitDansPanier.quantite : 1}`;
    }
}


function afficherPanier() {
    const modalContent = document.querySelector('#modalPanier .modal-content'); // Conteneur principal du contenu de la modale
    const montantTotal = document.querySelector('#modalPanier .montant p:last-child'); // Élément qui affiche le total du panier

    // Structure du tableau affichant le contenu du panier
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

    const tbody = document.getElementById('panier-body'); // Corps du tableau
    let totalPrix = 0; // Initialise le prix total du panier

    panier.forEach((item) => {
        const prixTotalProduit = item.price * item.quantite; // Prix total du produit (prix *quantité)
        totalPrix += prixTotalProduit; // Ajoute au total général

        // Crée une ligne dans le tableau pour chaque produit
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="../assets/${item.image}" alt="${item.name}" style="width: 50px;"></td>
            <td>${item.name}</td>
            <td>
                <button class="icon-btn" onclick="changerQuantite(${item.id}, -1)">-</button>
                ${item.quantite}
                <button class="icon-btn" onclick="changerQuantite(${item.id}, 1)">+</button>
            </td>
            <td>${prixTotalProduit.toFixed(2)} €</td>
            <td><button class="icon-btn" onclick="supprimerProduit(${item.id})">❌</button></td>
        `;

        tbody.appendChild(row); // Ajoute la ligne au tableau
    });

    montantTotal.textContent = `${totalPrix.toFixed(2)} €`; // Affiche le montant total
}

// Change la quantité d'un produit dans le panier (ajouter ou retirer)
function changerQuantite(produitId, delta) {
    
    const produit = panier.find(item => item.id === produitId); // Trouve le produit

    if (!produit) return; // Si le produit n'existe pas, on arrête

    produit.quantite += delta; // Incrémente/décrémente la quantité

    if (produit.quantite <= 0) {
        panier = panier.filter(item => item.id !== produitId); // Supprime du panier si quantité <= 0
    }

    afficherPanier(); // Met à jour le panier à chaque modification
}

// Supprime complètement un produit du panier
function supprimerProduit(produitId) {
    panier = panier.filter(item => item.id !== produitId); // Supprime le produit du tableau panier
    afficherPanier(); // Met à jour l'affichage
}

// Calcule le prix total de tout le panier
function getTotalPrix() {
    return panier.reduce((total, item) => total + item.price * item.quantite, 0); // Somme des (prix * quantité)
}

// Quand on clique sur le bouton "Commander" dans le panier
checkPanier.addEventListener("click", function() {
    const totalPrix = getTotalPrix(); // Récupère le montant total
    if (totalPrix > 0) {
        afficherPayement(); // Si le panier n'est pas vide, on passe à l'étape suivante
    } else {
        alert("Sélectionnez au moins 1 produit"); // Sinon, on avertit l'utilisateur
    }
});

// Affiche le formulaire de paiement (table et mode de paiement)
function afficherPayement() {
    const modalContent = document.querySelector('#modalPanier .modal-content');
    const modalFooter = document.querySelector('#modalPanier .modal-footer');

    modalContent.innerHTML = ""; // Vide le contenu précédent
    modalFooter.innerHTML = "";

    // Formulaire pour saisir le numéro de table et choisir le mode de paiement
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

    // Ajoute des events sur les boutons de choix de paiement
    const btnCarte = document.getElementById('btnCarte');
    const btnComptoir = document.getElementById('btnComptoir');

    btnCarte.addEventListener('click', () => {
        envoyerRecap('Carte');
    });

    btnComptoir.addEventListener('click', () => {
        envoyerRecap('Comptoir');
    });
}

// Fonction appelée après choix du mode de paiement
function envoyerRecap(moyenPaiement) {

    const numeroTable = document.getElementById('table').value; // Récupère le numéro de table
    const totalPrix = getTotalPrix(); // Récupère le total du panier

    if (!numeroTable) {
        alert('Veuillez entrer le numéro de table');
        return; // Bloque si aucun numéro renseigné
    }

    // Envoie les infos à la fonction qui affiche le récap
    recap({
        table: numeroTable,
        paiement: moyenPaiement,
        panier: panier,
        total: totalPrix
    });
}

// Affiche le ticket de caisse récapitulatif de la commande
function recap({ table, paiement, panier, total }) {
    const modalContent = document.querySelector('#modalPanier .modal-content');
    const modalFooter = document.querySelector('#modalPanier .modal-footer');

    modalContent.innerHTML = '';
    modalFooter.innerHTML = '';

    // Génère le HTML du ticket avec toutes les infos nécessaires
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

    modalContent.innerHTML = ticketHTML; // Affiche le ticket dans la modale
}

// Termine la commande (réinitialisation panier + retour accueil)
function terminerCommande() {
    alert('Commande terminée ! Merci :)');
    panier = []; // Vide le panier
    modalPanier.style.display = "none"; // Ferme la modale panier
    window.location.href = "../index.html"; // Redirige vers l'accueil (ou une autre page)
}
