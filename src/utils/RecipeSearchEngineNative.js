/* eslint-disable no-restricted-syntax */
import { normalizeText } from "./security.js";

/**
 * Moteur de recherche avec BOUCLES NATIVES (for, while)
 *
 * ALGORITHME : Recherche linéaire pure
 * - Complexité : O(n × m) où n = nombre de recettes, m = nombre de mots par recette
 * - Parcourt TOUTES les recettes à chaque recherche
 * - Utilise UNIQUEMENT des boucles natives : for, while, for ... of
 * - AUCUNE méthode de tableau : pas de filter(), map(), reduce(), etc.
 */
export const createRecipeSearchEngine = (recipes) => {
  let _recipes = recipes;

  /**
   * Tokenize avec boucles natives pures
   */
  const tokenize = (text) => {
    const linkWords = new Set([
      "le",
      "la",
      "les",
      "un",
      "une",
      "des",
      "de",
      "du",
      "au",
      "aux",
      "a",
      "et",
      "ou",
      "dans",
      "sur",
      "pour",
      "avec",
      "sans",
      "par",
    ]);

    const normalized = normalizeText(text);
    const words = normalized.match(/[a-z]+/g) || [];

    // Boucle FOR pure (pas de filter)
    const filtered = [];
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.length >= 2 && !linkWords.has(word)) {
        filtered.push(word);
      }
    }

    return filtered;
  };

  /**
   * Recherche avec boucles FOR pures - Approche NATIVE
   *
   * STRATÉGIE :
   * - Parcourt TOUTES les recettes avec une boucle for classique
   * - Pour chaque recette, vérifie si elle contient TOUS les termes cherchés
   * - Construit le tableau de résultats avec push()
   *
   * COMPLEXITÉ : O(n × m × t) où :
   * - n = nombre de recettes
   * - m = nombre de mots par recette
   * - t = nombre de termes recherchés
   */
  const search = (query) => {
    const trimmedQuery = normalizeText(query).trim();

    if (trimmedQuery.length === 0) {
      return _recipes;
    }

    // Split manuel avec une boucle (on pourrait faire sans split mais c'est ok)
    const queryTerms = trimmedQuery.split(/\s+/);

    if (queryTerms.length === 0) {
      return _recipes;
    }

    const results = [];

    // BOUCLE FOR classique sur les recettes
    for (let i = 0; i < _recipes.length; i++) {
      const recipe = _recipes[i];

      // Concaténer tous les textes de la recette
      let recipeText = recipe.name + " " + recipe.description;

      // Ajouter les ingrédients avec une boucle FOR
      for (let j = 0; j < recipe.ingredients.length; j++) {
        recipeText += " " + recipe.ingredients[j].ingredient;
      }

      // Normaliser le texte complet de la recette
      const normalizedRecipeText = normalizeText(recipeText);

      // Vérifier si TOUS les termes sont présents (AND logique)
      let allTermsMatch = true;

      // BOUCLE FOR sur les termes
      for (let k = 0; k < queryTerms.length; k++) {
        const term = queryTerms[k];

        // Vérifier si ce terme est dans le texte de la recette
        if (!normalizedRecipeText.includes(term)) {
          allTermsMatch = false;
          break; // Early exit si un terme ne match pas
        }
      }

      // Si tous les termes matchent, ajouter la recette aux résultats
      if (allTermsMatch) {
        results.push(recipe);
      }
    }

    return results;
  };

  /**
   * Rebuild (pour compatibilité API)
   */
  const rebuild = (newRecipes) => {
    _recipes = newRecipes;
  };

  /**
   * Stats (pour compatibilité API)
   */
  const getStats = () => {
    return {
      totalRecipes: _recipes.length,
      algorithm: "Native Loops (for, while)",
      complexity: "O(n × m × t)",
    };
  };

  // API publique
  return {
    search,
    rebuild,
    getStats,
  };
};
