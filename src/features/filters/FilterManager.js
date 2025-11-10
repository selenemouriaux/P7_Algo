/**
 * Crée un gestionnaire de filtres
 * @param {Object} appState - State de l'app
 * @param {Object} searchEngine - Moteur de recherche
 * @returns {Object} API publique
 */
export const createFilterManager = (appState, searchEngine) => {
  /**
   * Applique tous les filtres (recherche + tags)
   */
  const applyAllFilters = () => {
    // FILTRE 1 : Recherche textuelle
    const results =
      appState.currentSearchQuery.length > 0
        ? searchEngine.search(appState.currentSearchQuery)
        : [...appState.recipes];

    // FILTRES 2-4 : Appliquer les filtres de tags sur les résultats
    const filteredResults = results.filter((recipe) => {
      // FILTRE 2 : Ingrédients sélectionnés (tous doivent être présents)
      const matchesIngredients =
        appState.selectedTags.ingredients.length === 0 ||
        appState.selectedTags.ingredients.every((selectedIng) =>
          recipe.ingredients.some(
            ({ ingredient }) =>
              ingredient.toLowerCase() === selectedIng.toLowerCase()
          )
        );

      // FILTRE 3 : Appareil sélectionné
      const matchesAppliance =
        !appState.selectedTags.appliances ||
        recipe.appliance?.toLowerCase() ===
          appState.selectedTags.appliances.toLowerCase();

      // FILTRE 4 : Ustensile sélectionné
      const matchesUstensil =
        !appState.selectedTags.ustensils ||
        recipe.ustensils?.some(
          (ustensil) =>
            ustensil.toLowerCase() ===
            appState.selectedTags.ustensils.toLowerCase()
        );

      return matchesIngredients && matchesAppliance && matchesUstensil;
    });

    appState.setFilteredRecipes(filteredResults);
  };

  return { applyAllFilters };
};
