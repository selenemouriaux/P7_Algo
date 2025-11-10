import { escapeHtml } from "../utils/security.js";

/**
 * Crée une carte de recette
 * @param {Object} recipe - Objet recette
 * @returns {string} HTML de la carte
 */
export const createRecipeCard = (recipe) => {
  const ingredientsList = recipe.ingredients
    .map((ing) => {
      // Afficher les qttés si données et protection XSS sur l'affichage
      const quantity = ing.quantity ? escapeHtml(String(ing.quantity)) : "";
      const unit = ing.unit ? escapeHtml(ing.unit) : "";
      const ingredient = escapeHtml(ing.ingredient);
      //Construire l'élément HTML en litéral de gabarit avec les données computées
      return `
        <div class="flex flex-col text-sm mb-2">
          <span class="text-gray-700 font-medium">${ingredient}</span>
          <span class="text-gray-500">${quantity} ${unit}</span>
        </div>
      `;
    })
    // Mettre bout à bout les ingrédients créés
    .join("");

  // Sécuriser et tronquer la description à 200 caractères, la maquette laissait voir la troncature mais pas les "..."
  const description = escapeHtml(recipe.description);
  const shortDescription =
    description.length > 200
      ? description.substring(0, 200) + "..."
      : description;

  const recipeName = escapeHtml(recipe.name);
  const recipeImage = escapeHtml(recipe.image);
  const recipeTime = escapeHtml(String(recipe.time));

  // Construire l'architecture HTML de la carte avec tailwind en utilisant les thumbnails & lazy loading
  return `
    <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <!-- Image -->
      <div class="relative h-64 bg-gray-200">
        <img
          src="/images/thumbnails/${recipeImage}"
          alt="${recipeName}"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <span class="absolute top-4 right-4 bg-primary-yellow text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
          ${recipeTime}min
        </span>
      </div>

      <!-- Content -->
      <div class="p-6">
        <h3 class="text-xl font-sans font-bold mb-4">${recipeName}</h3>

        <!-- Recette section -->
        <div class="mb-4">
          <h4 class="text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">Recette</h4>
          <p class="text-sm text-gray-700 leading-relaxed">${shortDescription}</p>
        </div>

        <!-- Ingrédients section -->
        <div>
          <h4 class="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wider">Ingrédients</h4>
          <div class="grid grid-cols-2 gap-x-4">
            ${ingredientsList}
          </div>
        </div>
      </div>
    </article>
  `;
};
