let donnees = [];
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
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${produit.name}</h2>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">	
                            <img src="../assets/${produit.image}" alt="${produit.name}" class="img-produit">
                        </div>	
                        <div class="col">
                            <p><strong>Prix :</strong> ${produit.price.toFixed(2)} €</p>
                            ${caloriesPrincipal !== 0 ? `<p><strong>Calories :</strong> ${caloriesPrincipal} kcal</p>` : ''}
                            ${caloriesPrincipal !== 0 ? '' : `<p>${produit.description}</p>`}
                            ${isMenu ? generateOptionsForm(produit, data) : ''}
                            
                            <p id="caloriesTotal-${produit.id}"><strong>Total Calories :</strong> ${caloriesPrincipal || 0} kcal</p>
                        </div>
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
                    </label><br>
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
                    </label><br>
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
                </label><br>
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
