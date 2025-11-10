import { normalizeText } from "./security.js";

/**
 * Moteur de recherche avec index inversé type Elasticsearch
 *
 * ALGORITHME : Index inversé
 * - Création d'un index au démarrage (pré-traitement) : O(n × m) 1 fois où n = nombre de recettes, m = nombre de mots par recette
 * - Complexité de recherche exacte : O(1) pour trouver l'ID + O(r) pour mapper les matchs où r = résultats trouvés (liste d'index de recettes valides)
 * - Complexité de recherche partielle le cas échéant : O(m) où m = nombre de mots dans l'index, toujours beaucoup plus faible que l'ensemble des recettes
 * - Intersection des résultats pour multi-mots : O(k1 + k2) où k = nombre de résultats, k sont petits
 */
export const createRecipeSearchEngine = (recipes) => {
  // État privé (closures)
  let _recipes = recipes;
  const _index = new Map(); // mot > Set<recipeId>
  const _recipeMap = new Map(); // id > recipe (pour accès rapide)

  /**
   * Tokenize une chaine en mots
   * Retire les mots de liaison pour optimiser l'index
   * Normalise le texte : suppression des accents et harmonisation de la casse
   * @param {string} text - Texte à tokenize
   * @returns {Array<string>} Tableau de mots normalisés sans accents ni chiffres
   */
  const tokenize = (text) => {
    // Discriminer les tokens des choses à ignorer comme les prépositions, articles etc. et les retourner
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

    // Extraire les mots et exclure les chiffres
    const words = normalized.match(/[a-z]+/g) || [];

    // Filtrer les mots de liaison et lettres orphelines (garder Os par exemple, 2chars+)
    const filtered = [];
    for (const word of words) {
      if (word.length >= 2 && !linkWords.has(word)) {
        filtered.push(word);
      }
    }

    return filtered;
  };

  /**
   * Extrait tous les mots significatifs d'une recette dans une liste exhaustive
   * @param {Object} recipe - Recette
   * @returns {Array<string>} Tableau de mots en minuscules
   */
  const extractWords = (recipe) => {
    const words = [];

    // Ajouter les mots du nom de la recette à la liste des mots
    const nameWords = tokenize(recipe.name);
    for (const word of nameWords) {
      words.push(word);
    }

    // Ajouter aussi les mots des ingrédients
    for (const ingredient of recipe.ingredients) {
      const ingredientWords = tokenize(ingredient.ingredient);
      for (const word of ingredientWords) {
        words.push(word);
      }
    }

    // Ajouter aussi les mots de la description
    const descWords = tokenize(recipe.description);
    for (const word of descWords) {
      words.push(word);
    }

    return words;
  };

  const buildIndex = () => {
    console.time("🔨 Construction de l'index");

    for (const recipe of _recipes) {
      // Ajouter au recipeMap pour retour rapide des recettes trouvées
      _recipeMap.set(recipe.id, recipe);

      // Extraire tous les mots de la recette
      const words = extractWords(recipe);

      // Indexer chaque mot et ajouter l'ID de la recette dont il est issu
      for (const word of words) {
        if (!_index.has(word)) {
          _index.set(word, new Set());
        }

        _index.get(word).add(recipe.id);
      }
    }

    console.timeEnd("🔨 Construction de l'index");
    console.log(`📊 Index créé : ${_index.size} mots uniques`);
  };

  /**
   * Recherche hybride optimisée : exact (O(1)) + partiel (O(m)) par mot
   *
   * STRATÉGIE :
   * - Pour chaque mot de la recherche :
   *   1. Essaie recherche exacte (O(1)) - ultra rapide
   *   2. Si échec, fallback sur recherche partielle (O(m)) pour ce mot
   * - Fait une INTERSECTION (AND) entre tous les résultats
   *
   * PERFORMANCES :
   * - "poulet citron" (mots complets) > O(1) + O(1) = <1ms ⚡⚡⚡
   * - "poulet cit" (mixte) > O(1) + O(m) = ~5ms ⚡
   * - "poul cit" (partiels) > O(m) + O(m) = ~10ms
   *
   * @param {string} query - Terme de recherche
   * @returns {Array} Recettes correspondantes
   */
  const search = (query) => {
    // Trim sur le normalize pour clean
    const trimmedQuery = normalizeText(query).trim();

    if (trimmedQuery.length === 0) {
      return _recipes;
    }

    // Séparer la requête en mots individuels
    const queryTerms = trimmedQuery
      // On pourrait ajouter ici des caractères de ponctuation éventuellement
      .split(/\s+/);

    if (queryTerms.length === 0) {
      return _recipes;
    }

    // Pour chaque terme, récupérer les IDs (exact OU partiel)
    let matchingIds = null;

    for (const term of queryTerms) {
      let termIds = new Set();

      const exactIds = _index.get(term);

      if (exactIds && exactIds.size > 0) {
        // Perfect match, O(1) ultra efficient ^^
        termIds = new Set(exactIds);
      } else {
        // Fallback : Recherche partielle (O(m))
        // Trouver tous les mots de l'index qui contiennent ce terme
        for (const [word, wordIds] of _index) {
          if (word.includes(term)) {
            for (const id of wordIds) {
              termIds.add(id);
            }
          }
        }
      }

      // early return si aucun résultat pour ce terme
      if (termIds.size === 0) {
        return [];
      }

      // Intersection des résultats, O(k1 + k2 + ...)
      if (matchingIds === null) {
        // Premier terme : initialiser
        matchingIds = termIds;
      } else {
        // Termes suivants : intersection
        const intersection = new Set();

        for (const id of matchingIds) {
          if (termIds.has(id)) {
            intersection.add(id);
          }
        }

        matchingIds = intersection;

        // Si plus aucun résultat on arrête
        if (matchingIds.size === 0) {
          return [];
        }
      }
    }

    // Convertir les IDs en recettes
    const results = [];

    for (const id of matchingIds) {
      const recipe = _recipeMap.get(id);
      if (recipe) {
        results.push(recipe);
      }
    }

    return results;
  };

  /**
   * Reconstruit l'index (à appeler si les recettes changent)
   */
  const rebuild = (newRecipes) => {
    console.log("🔄 Reconstruction de l'index...");
    _recipes = newRecipes;
    _index.clear();
    _recipeMap.clear();
    buildIndex();
  };

  /**
   * Statistiques de l'index (pour debug)
   */
  const getStats = () => {
    return {
      totalRecipes: _recipes.length,
      uniqueWords: _index.size,
      avgWordsPerRecipe: (_recipes.length > 0
        ? Array.from(_index.values()).reduce((sum, set) => sum + set.size, 0) /
          _recipes.length
        : 0
      ).toFixed(2),
      indexSize: `${(JSON.stringify([..._index]).length / 1024).toFixed(2)} KB`,
    };
  };

  // Construction de l'index au démarrage
  buildIndex();

  // API publique
  return {
    search,
    rebuild,
    getStats,
  };
};
