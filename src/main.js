/**
 * @fileoverview Point d'entrée principal de l'application Les Petits Plats.
 *
 * ARCHITECTURE MODULAIRE & GREEN CODE
 * ===================================
 *
 * 1. Moteurs de recherche interchangeables
 * 2. Subscribe au pattern Observer pour gestion état centralisé
 * 3. Event Delegation au lieu de centaines (DropdownManager)
 * 4. Debounce 300ms, évite les calculs inutiles et réduit la consommation CPU
 * 5. Pseudo memoization/cache, toujours plus propre et plus green que recalculer a chaque repopulate
 * 6. Lazy Loading & thumbnails
 * 7. Pagination de 12 recettes par page, pas de break et pas de charge CPU inutile
 * 8. Sécurité : escapes, sanitization & validation des entrées entrées utilisateur
 * 9. A11Y, sémantique HTML, headings sr-only, ARIA, W3C ok
 * 10. tailwind, CSS purgé
 * 11. Projet Vite optimisé (minification, tree-shaking, cache busting)
 * 12. Fonctionnalités isolées dans un manager dédié : MainSearch, FilterManager, DropdownManager, TagManager, PaginationManager, AppState
 * 13. Séparation des responsabilités (Single Responsibility - SOLID)

 * @module main
 * @requires RecipeSearchEngine - Moteur de recherche avec index inversé
 * @requires AppState - Gestionnaire d'état avec pattern Observer
 * @requires FilterManager - Logique de filtrage (recherche + tags)
 * @requires DropdownManager - Gestion des dropdowns avec event delegation
 * @requires TagManager - Affichage des tags sélectionnés
 * @requires PaginationManager - Pagination des résultats
 * @requires MainSearch - Barre de recherche avec debounce
 *
 * @see {@link ./utils/RecipeSearchEngine.js} Pour l'implémentation de l'index inversé
 * @see {@link ./state/AppState.js} Pour le pattern Observer
 *
 * @author Silvanas
 * @version 1.0.0
 */

import "./style.css";
// import { recipes } from "./data/recipes-x-50.js";
// import { recipes } from "./data/recipes-x-500.js";
// import { recipes } from "./data/recipes-x-1000.js";
import { recipes } from "./data/recipes-x-1500.js";
import { createRecipeCard } from "./components/recipeCard.js";

// ====================================================
// ALGORITHME DE RECHERCHE - Décommenter celui à tester
// ====================================================
// OPTION 1 : Boucles natives (for, while) - Algorithme impératif
// import { createRecipeSearchEngine } from "./utils/RecipeSearchEngineNative.js";

// OPTION 2 : Programmation fonctionnelle (filter, map, every) - Algorithme déclaratif
// import { createRecipeSearchEngine } from "./utils/RecipeSearchEngineFunctional.js";

// OPTION 3 : Index inversé (approche Elasticsearch) - Très performant, option soumise à l'équipe
import { createRecipeSearchEngine } from "./utils/RecipeSearchEngine.js";
// ========================================

// Modules de gestion
import { createAppState } from "./state/AppState.js";
import { createMainSearch } from "./features/search/MainSearch.js";
import { createFilterManager } from "./features/filters/FilterManager.js";
import { createTagManager } from "./features/filters/TagManager.js";
import { createDropdownManager } from "./features/dropdown/DropdownManager.js";
import { createPaginationManager } from "./features/pagination/PaginationManager.js";

// Initialisation du moteur de recherche (une seule fois)
const searchEngine = createRecipeSearchEngine(recipes);
console.log("Statistiques du moteur de recherche:", searchEngine.getStats());

// Initialisation de l'état global
const appState = createAppState(recipes);

// Initialisation des managers
const filterManager = createFilterManager(appState, searchEngine);
const tagManager = createTagManager(appState);
const dropdownManager = createDropdownManager(appState, recipes);
const paginationManager = createPaginationManager(appState);
const mainSearch = createMainSearch(appState);

/**
 * Affiche les recettes dans la grille
 */
const displayRecipes = () => {
  const grid = document.getElementById("recipes-grid");
  const noResults = document.getElementById("no-results");
  const recipeCount = document.getElementById("recipe-count");

  if (appState.filteredRecipes.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
    recipeCount.textContent = "00 recette";
  } else {
    noResults.classList.add("hidden");

    // Obtenir les recettes de la page actuelle
    const recipesForCurrentPage = paginationManager.getRecipesForCurrentPage();

    // Afficher les recettes
    grid.innerHTML = recipesForCurrentPage
      .map((recipe) => createRecipeCard(recipe))
      .join("");

    // Mettre à jour le compteur
    const totalRecipes = appState.filteredRecipes.length;
    const formattedCount = totalRecipes.toString().padStart(2, "0"); // assure un affichage 2 digits
    recipeCount.textContent = `${formattedCount} recette${
      totalRecipes > 1 ? "s" : ""
    }`;
  }

  // Mettre à jour la pagination
  paginationManager.update();
};

/**
 * Met à jour l'affichage après un changement d'état
 */
const updateDisplay = () => {
  displayRecipes();
  tagManager.render();
};

/**
 * Applique les filtres et met à jour l'affichage
 */
const applyFiltersAndUpdate = () => {
  filterManager.applyAllFilters();
  updateDisplay();
};

/**
 * Initialise l'application
 */
const init = () => {
  // Afficher toutes les recettes au chargement
  displayRecipes();

  // Configurer les fonctionnalités
  dropdownManager.setup();
  mainSearch.setup();
  paginationManager.setup();

  // S'abonner aux changements d'état qui nécessitent un filtrage
  appState.subscribe((state) => {
    // Appliquer les filtres puis mettre à jour l'affichage
    applyFiltersAndUpdate();
  });
};

// Initialiser l'application au chargement du DOM
document.addEventListener("DOMContentLoaded", init);
