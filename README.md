# 🍔 Projet Borne de Commande McDonald's

## 📌 Description du projet
Ce projet est une **borne de commande interactive** pour un restaurant McDonald's, développée en **HTML, CSS et JavaScript**. Elle permet aux utilisateurs de passer une commande en autonomie : sélectionner des menus, des Happy Meals, des produits à la carte, et finaliser la commande.

Le projet a été réalisé à deux dans le cadre de notre formation **Webecom 2025**.

---

## 👥 Équipe projet
- **Maxime Cornillon**
- **Sebastien Chatel**

---

## 🛠️ Technologies utilisées
- **HTML5** : Structure des pages
- **CSS3** : Mise en forme et design de l’interface
- **JavaScript** : Dynamique de l’interface (calcul des calories, gestion des sélections, interactions)
---

## 🎯 Objectifs
- Créer une interface simple et intuitive, ressemblant à une vraie borne de commande McDonald's.
- Permettre à l’utilisateur de :
  - Choisir des menus ou des produits à la carte.
  - Sélectionner les options des menus (boisson, accompagnement, jouet pour Happy Meal, etc.).
  - Voir un récapitulatif de sa commande et le total des calories.
  - Valider la commande.

---

## ✅ Fonctionnalités principales
- **Affichage des menus** : produits, Happy Meals, boissons, desserts, etc.
- **Choix des options via des boutons radio ou des listes déroulantes** (exemple : sélectionner une boisson pour le menu).
- **Calcul automatique du total de calories** en fonction des produits sélectionnés.
- **Récapitulatif de commande** avec les produits choisis.
- **Bouton de validation** simulant la fin de commande.
---

## 🗂️ Structure du projet
---

├── [Dossier] .git
│
├── [Dossier] assets
│   ├── [Dossier] abstracts
│   │   ├── [Fichier] _colors.scss
│   │   ├── [Fichier] _functions.scss
│   │   ├── [Fichier] _index.scss
│   │   ├── [Fichier] _mixins.scss
│   │   ├── [Fichier] _placeholders.scss
│   │   ├── [Fichier] _typography.scss
│   │   ├── [Fichier] _variables.scss
│   ├── [Dossier] base
│   │   ├── [Fichier] _global.scss
│   │   ├── [Fichier] _reset-typography.scss
│   │   ├── [Fichier] _reset.scss
│   ├── [Dossier] components
│   │   ├── [Dossier] buttons
│   │   │   ├── [Fichier] _icon.scss
│   │   │   ├── [Fichier] _primary.scss
│   │   │   ├── [Fichier] _secondary.scss
│   │   ├── [Dossier] cards
│   │   │   ├── [Fichier] _produit-card.scss
│   │   ├── [Dossier] modals
│   │   │   ├── [Fichier] _modal.scss
│   ├── [Dossier] images
│   │   ├── [Dossier] drapeaux
│   │   ├── [Fichier] menu.png
│   ├── [Dossier] layout
│   │   ├── [Fichier] _header.scss
│   ├── [Dossier] pages
│   │   ├── [Fichier] _home.scss
│   │   ├── [Fichier] _selection.scss
│   ├── [Fichier] main.scss
├── [Dossier] css
│   ├── [Fichier] styles.css
│   ├── [Fichier] styles.css.map
├── [Dossier] fonts
│   ├── [Fichier] Speedee-Bold.ttf
│   ├── [Fichier] styles.css
├─── [Dossier] pages
│   ├── [Fichier] selection.html
├── [Fichier] favicon.png
├── [Fichier] index.html
├── [Fichier] mcdo.json
├── [Fichier] package-lock.json
├── [Fichier] package.json
├── [Fichier] README.md
├── [Fichier] robots.txt
├── [Fichier] .gitignore
├── [Fichier] script.js

---

## 🚀 Lancer le projet
1. **Télécharger ou cloner le projet** :
   ```bash
   git clone https://github.com/[ton-repo]/mcdo-borne.git
   ```
2. **Compiler le main.scss en styles.css** :
   ```bash
   sass assets/main.scss:css/styles.css
   ```
3. **Ouvrir `index.html` dans un navigateur** :
   - Double-clique sur le fichier `index.html`
   - Ou ouvre-le avec un éditeur de code et lance une **Live Preview**.

---

## 📅 Étapes de réalisation
1. **Conception du wireframe** de l’interface utilisateur.
2. **Création de la structure HTML** :
   - Sections : Accueil, Produits, Récapitulatif de commande.
3. **Stylisation CSS** pour une interface claire, moderne, et inspirée de McDonald’s.
4. **Ajout des fonctionnalités JavaScript** :
   - Sélections, calcul des calories, affichage dynamique de la commande.
5. **Tests et améliorations UX/UI**.

---

## 🔧 Améliorations possibles
- Gestion multi-langues (FR/EN)
- Connexion à une base de données pour stocker les commandes
- Animation et transitions CSS
- Responsive pour mobile et tablette
- Accessibilité (navigation clavier, lecteurs d'écran)

---

## 📄 Licence
Projet réalisé dans le cadre pédagogique de **Webecom 2025**. Non destiné à un usage commercial.

---
