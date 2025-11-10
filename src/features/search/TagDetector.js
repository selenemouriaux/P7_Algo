import { normalizeText } from "../../utils/security.js";

export const detectMatchingTags = (query, recipes) => {
  const normalized = normalizeText(query).trim();

  if (normalized.length < 2) return [];

  const words = normalized.split(/\s+/);

  if (words.length === 0) return [];

  // Créer des Maps pour garder les valeurs originales
  const ingredientsMap = new Map();
  const appliancesMap = new Map();
  const ustensilsMap = new Map();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const normalized = normalizeText(ing.ingredient);
      if (!ingredientsMap.has(normalized)) {
        ingredientsMap.set(normalized, ing.ingredient);
      }
    });

    if (recipe.appliance) {
      const normalized = normalizeText(recipe.appliance);
      if (!appliancesMap.has(normalized)) {
        appliancesMap.set(normalized, recipe.appliance);
      }
    }

    if (recipe.ustensils) {
      recipe.ustensils.forEach((ust) => {
        const normalized = normalizeText(ust);
        if (!ustensilsMap.has(normalized)) {
          ustensilsMap.set(normalized, ust);
        }
      });
    }
  });

  // Helper pour vérifier une combinaison de mots (approche fonctionnelle)
  const checkMatch = (phrase, maps) => {
    return (
      Object.entries(maps)
        .map(([type, map]) =>
          map.has(phrase) ? { type, value: map.get(phrase) } : null
        )
        .find((match) => match !== null) || null
    );
  };

  const maps = {
    ingredients: ingredientsMap,
    appliances: appliancesMap,
    ustensils: ustensilsMap,
  };

  // Helper pour créer les n-grams
  const createNGrams = (words, n) => {
    return Array.from({ length: words.length - n + 1 }, (_, i) => ({
      index: i,
      phrase: words.slice(i, i + n).join(" "),
      positions: Array.from({ length: n }, (_, j) => i + j),
    }));
  };

  // Helper pour ajouter un tag si trouvé
  const alreadyAdded = new Set();
  const usedPositions = new Set();

  const tryAddTag = (ngramData) => {
    const { index, phrase, positions } = ngramData;

    // Skip si position déjà utilisée
    if (positions.some((pos) => usedPositions.has(pos))) {
      return null;
    }

    const match = checkMatch(phrase, maps);
    if (!match) return null;

    const key = `${match.type}:${normalizeText(match.value)}`;
    if (alreadyAdded.has(key)) return null;

    // Marquer comme utilisé
    alreadyAdded.add(key);
    positions.forEach((pos) => usedPositions.add(pos));

    return match;
  };

  // 1. Trigrams (3 mots consécutifs)
  const trigramTags = createNGrams(words, 3)
    .map(tryAddTag)
    .filter((tag) => tag !== null);

  // 2. Bigrams (2 mots consécutifs)
  const bigramTags = createNGrams(words, 2)
    .map(tryAddTag)
    .filter((tag) => tag !== null);

  // 3. Unigrams (mots individuels, min 2 caractères)
  const unigramTags = words
    .map((word, index) => ({
      index,
      phrase: word,
      positions: [index],
    }))
    .filter((data) => data.phrase.length >= 2)
    .map(tryAddTag)
    .filter((tag) => tag !== null);

  return [...trigramTags, ...bigramTags, ...unigramTags];
};
