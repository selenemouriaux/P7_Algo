import { normalizeText } from "./security.js";

/**
 * Moteur de recherche avec PROGRAMMATION FONCTIONNELLE
 *
 * ALGORITHME : Recherche linéaire avec méthodes fonctionnelles
 * - Complexité : O(n × m) où n = nombre de recettes, m = nombre de mots par recette
 * - Parcourt TOUTES les recettes à chaque recherche
 * - Utilise UNIQUEMENT des méthodes fonctionnelles : filter(), map(), reduce(), every(), some()
 * - AUCUNE boucle native : pas de for, while, for...of
 * - Approche déclarative et composable
 */
export const createRecipeSearchEngine = (recipes) => {
  let _recipes = recipes;

  /**
   * Tokenize avec approche fonctionnelle pure
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

    // Utilisation de filter() - approche fonctionnelle
    return words.filter((word) => word.length >= 2 && !linkWords.has(word));
  };

  /**
   * Recherche avec méthodes fonctionnelles pures
   *
   * STRATÉGIE :
   * - Utilise filter() pour parcourir les recettes
   * - Utilise map() et join() pour concaténer les textes
   * - Utilise every() pour vérifier que tous les termes sont présents (AND logique)
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

    const queryTerms = tokenize(trimmedQuery);

    if (queryTerms.length === 0) {
      return _recipes;
    }

    // APPROCHE FONCTIONNELLE : filter() + every()
    return _recipes.filter((recipe) => {
      // Construire le texte complet de la recette avec map() et join()
      const ingredientsText = recipe.ingredients
        .map((ing) => ing.ingredient)
        .join(" ");

      const recipeText = [
        recipe.name,
        recipe.description,
        ingredientsText,
      ].join(" ");

      // Tokenize le texte de la recette
      const recipeTokens = tokenize(recipeText);

      // Vérifier que TOUS les termes sont présents avec every()
      return queryTerms.every((term) =>
        recipeTokens.some((token) => token.includes(term))
      );
    });
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
      algorithm: "Functional (filter, map, reduce, every)",
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
