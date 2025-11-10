import { sanitizeSearchInput } from "../../utils/security.js";

/**
 * Gestion de la barre de recherche principale, solution retenue : index inversé
 * Ce fichier peut être facilement remplacé entre les branches pour tester différentes implémentations
 */

/**
 * Crée un gestionnaire de recherche principale
 * @param {Object} appState - State de l'app
 * @returns {Object} API publique
 */
export const createMainSearch = (appState) => {
  let debounceTimer = null;

  /**
   * Set la recherche principale
   * @param {string} query - Terme de recherche
   */
  const performSearch = (query) => {
    // Sécuriser l'entrée utilisateur
    const sanitizedQuery = sanitizeSearchInput(query);
    appState.setSearchQuery(sanitizedQuery);
  };

  /**
   * Configure la barre de recherche principale
   */
  const setup = () => {
    const searchInput = document.getElementById("main-search");
    const searchButton = document.getElementById("search-button");
    const clearButton = document.getElementById("clear-search");

    searchInput.addEventListener("input", (e) => {
      const { value } = e.target;

      // Afficher/masquer le bouton clear
      clearButton.classList.toggle("hidden", value.length === 0);

      // Recherche automatique si >= 3 caractères
      if (value.length >= 3) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          performSearch(value);
        }, 300);
      } else if (value.length === 0) {
        // Réafficher toutes les recettes si vide
        appState.setSearchQuery("");
      }
    });

    // Recherche au clic sur le bouton (même si < 3 caractères)
    searchButton.addEventListener("click", () => {
      const { value } = searchInput;
      if (value.length > 0) {
        performSearch(value);
      }
    });

    // Effacer la recherche
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      clearButton.classList.add("hidden");
      appState.setSearchQuery("");
    });

    // Recherche à la touche Entrée
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const { value } = searchInput;
        if (value.length > 0) {
          performSearch(value);
        }
      }
    });
  };

  return { setup };
};
