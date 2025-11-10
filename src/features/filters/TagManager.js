import { escapeHtml } from "../../utils/security.js";

/**
 * Crée un gestionnaire de tags
 * @param {Object} appState - State de l'app
 * @returns {Object} API publique
 */
export const createTagManager = (appState) => {
  /**
   * Crée un tag pill HTML
   * @param {string} type - Type de tag
   * @param {string} value - Valeur du tag
   * @returns {string} HTML du tag
   */
  const createTagPill = (type, value) => {
    const safeValue = escapeHtml(value);
    const displayValue = safeValue.charAt(0).toUpperCase() + safeValue.slice(1);
    return `
    <div class="inline-flex items-center gap-2 bg-primary-yellow px-4 py-2 rounded-full">
      <span class="text-sm font-medium text-gray-900">${displayValue}</span>
      <button
        data-remove-tag="${escapeHtml(type)}"
        data-value="${safeValue}"
        class="hover:bg-yellow-500 rounded-full p-0.5 transition-colors"
        aria-label="Retirer ${displayValue}"
      >
        <svg class="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  };

  /**
   * Crée le bouton "Tout effacer"
   * @returns {string} HTML du bouton
   */
  const createClearAllButton = () => {
    return `
    <button
      data-clear-all
      class="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-colors"
      aria-label="Tout effacer"
    >
      <span class="text-sm font-medium">Tout effacer</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `;
  };

  /**
   * Affiche les tags sélectionnés
   */
  const render = () => {
    const container = document.getElementById("selected-tags");
    const tags = [];

    // Tags ingrédients
    appState.selectedTags.ingredients.forEach((ing) => {
      tags.push(createTagPill("ingredients", ing));
    });

    // Tag appareil
    if (appState.selectedTags.appliances) {
      tags.push(createTagPill("appliances", appState.selectedTags.appliances));
    }

    // Tag ustensile
    if (appState.selectedTags.ustensils) {
      tags.push(createTagPill("ustensils", appState.selectedTags.ustensils));
    }

    // Ajouter le bouton "Tout effacer" si au moins un tag est actif
    if (appState.hasActiveTags()) {
      tags.push(createClearAllButton());
    }

    container.innerHTML = tags.join("");

    // Attacher les listeners aux boutons de suppression
    container.querySelectorAll("[data-remove-tag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.removeTag;
        const { value } = btn.dataset;
        appState.removeTag(type, value);
      });
    });

    // Attacher le listener au bouton "Tout effacer"
    const clearAllBtn = container.querySelector("[data-clear-all]");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        appState.clearAllTags();
      });
    }
  };

  return { render };
};
