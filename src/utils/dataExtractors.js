/**
 * Extrait tous les ingrédients uniques des recettes
 * @param {Array} recipes - Tableau de recettes
 * @returns {Array} Tableau d'ingrédients triés
 */
export const getUniqueIngredients = (recipes) => {
  const uniqueIngredients = new Set();

  for (const recipe of recipes) {
    for (const { ingredient } of recipe.ingredients) {
      uniqueIngredients.add(ingredient.toLowerCase());
    }
  }

  return [...uniqueIngredients].sort();
};

/**
 * Extrait tous les appareils uniques des recettes
 * @param {Array} recipes - Tableau de recettes
 * @returns {Array} Tableau d'appareils triés
 */
export const getUniqueAppliances = (recipes) => {
  const uniqueAppliances = new Set();

  for (const { appliance } of recipes) {
    if (appliance) {
      uniqueAppliances.add(appliance.toLowerCase());
    }
  }

  return [...uniqueAppliances].sort();
};

/**
 * Extrait tous les ustensiles uniques des recettes
 * @param {Array} recipes - Tableau de recettes
 * @returns {Array} Tableau d'ustensiles triés
 */
export const getUniqueUstensils = (recipes) => {
  const uniqueUstensils = new Set();

  for (const { ustensils } of recipes) {
    if (ustensils) {
      for (const ustensil of ustensils) {
        uniqueUstensils.add(ustensil.toLowerCase());
      }
    }
  }

  return [...uniqueUstensils].sort();
};
