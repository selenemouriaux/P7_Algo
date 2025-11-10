/**
 * Crée un gestionnaire d'état pour l'application avec observer pattern
 * @param {Array} initialRecipes - Recettes initiales
 * @returns {Object} API publique du gestionnaire d'état
 */
export const createAppState = (initialRecipes) => {
  // État privé (closures)
  const recipes = initialRecipes;
  let filteredRecipes = [...initialRecipes];
  const selectedTags = {
    ingredients: [],
    appliances: null,
    ustensils: null,
  };
  let currentSearchQuery = "";
  let currentPage = 1;
  const listeners = [];

  /**
   * Met à jour les recettes filtrées
   * @param {Array} newRecipes - Nouvelles recettes filtrées
   */
  const setFilteredRecipes = (newRecipes) => {
    filteredRecipes = newRecipes;
  };

  /**
   * Met à jour la requête de recherche
   * @param {string} query - Nouvelle requête
   */
  const setSearchQuery = (query) => {
    currentSearchQuery = query;
    currentPage = 1; // Reset page on new search
    notifyListeners();
  };

  /**
   * Ajoute un tag sélectionné
   * @param {string} type - Type de tag (ingredients, appliances, ustensils)
   * @param {string} value - Valeur du tag
   */
  const addTag = (type, value) => {
    if (type === "ingredients") {
      if (!selectedTags.ingredients.includes(value)) {
        selectedTags.ingredients.push(value);
      }
    } else if (type === "appliances") {
      selectedTags.appliances = value;
    } else if (type === "ustensils") {
      selectedTags.ustensils = value;
    }
    currentPage = 1; // Reset page on tag change
    notifyListeners();
  };

  /**
   * Retire un tag sélectionné
   * @param {string} type - Type de tag
   * @param {string} value - Valeur du tag (optionnel pour appliances/ustensils)
   */
  const removeTag = (type, value = null) => {
    if (type === "ingredients") {
      selectedTags.ingredients = selectedTags.ingredients.filter(
        (ing) => ing !== value
      );
    } else if (type === "appliances") {
      selectedTags.appliances = null;
    } else if (type === "ustensils") {
      selectedTags.ustensils = null;
    }
    currentPage = 1; // Reset page on tag removal
    notifyListeners();
  };

  /**
   * Efface tous les tags
   */
  const clearAllTags = () => {
    selectedTags.ingredients = [];
    selectedTags.appliances = null;
    selectedTags.ustensils = null;
    currentPage = 1;
    notifyListeners();
  };

  /**
   * Vérifie si des tags sont actifs
   * @returns {boolean}
   */
  const hasActiveTags = () => {
    return (
      selectedTags.ingredients.length > 0 ||
      selectedTags.appliances !== null ||
      selectedTags.ustensils !== null
    );
  };

  /**
   * Change de page
   * @param {number} page - Numéro de la page
   */
  const setPage = (page) => {
    currentPage = page;
    notifyListeners();
  };

  /**
   * Abonne un listener aux changements d'état
   * @param {Function} callback - Fonction appelée lors des changements
   */
  const subscribe = (callback) => {
    listeners.push(callback);
  };

  /**
   * Notifie tous les listeners
   */
  const notifyListeners = () => {
    listeners.forEach((callback) =>
      callback({
        recipes,
        filteredRecipes,
        selectedTags,
        currentSearchQuery,
        currentPage,
      })
    );
  };

  // API publique
  return {
    get recipes() {
      return recipes;
    },
    get filteredRecipes() {
      return filteredRecipes;
    },
    get selectedTags() {
      return selectedTags;
    },
    get currentSearchQuery() {
      return currentSearchQuery;
    },
    get currentPage() {
      return currentPage;
    },
    setFilteredRecipes,
    setSearchQuery,
    addTag,
    removeTag,
    clearAllTags,
    hasActiveTags,
    setPage,
    subscribe,
  };
};
