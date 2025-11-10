import {
  escapeHtml,
  sanitizeSearchInput,
  sanitizeTagValue,
  normalizeText,
} from "../../utils/security.js";
import {
  getUniqueIngredients,
  getUniqueAppliances,
  getUniqueUstensils,
} from "../../utils/dataExtractors.js";

/**
 * Crée un gestionnaire de dropdowns
 * @param {Object} appState - State de l'app
 * @param {Array} recipes - Recettes
 * @returns {Object} API publique
 */
export const createDropdownManager = (appState, recipes) => {
  // Calculer les listes une seule fois à l'initialisation (memoization)
  const cachedData = {
    ingredients: getUniqueIngredients(recipes),
    appliances: getUniqueAppliances(recipes),
    ustensils: getUniqueUstensils(recipes),
  };

  const dropdownConfigs = [
    {
      btn: "ingredients-dropdown-btn",
      menu: "ingredients-dropdown",
      chevron: "ingredients-chevron",
      search: "ingredients-search",
      list: "ingredients-list",
      type: "ingredients",
    },
    {
      btn: "appliances-dropdown-btn",
      menu: "appliances-dropdown",
      chevron: "appliances-chevron",
      search: "appliances-search",
      list: "appliances-list",
      type: "appliances",
    },
    {
      btn: "ustensils-dropdown-btn",
      menu: "ustensils-dropdown",
      chevron: "ustensils-chevron",
      search: "ustensils-search",
      list: "ustensils-list",
      type: "ustensils",
    },
  ];

  /**
   * Remplit un dropdown avec des options
   * @param {string} listId - ID de la liste
   * @param {Array} items - Items à afficher
   */
  const populateDropdown = (listId, items) => {
    const list = document.getElementById(listId);
    list.innerHTML = items
      .map((item) => {
        const safeItem = escapeHtml(item);
        const displayItem =
          safeItem.charAt(0).toUpperCase() + safeItem.slice(1);
        return `
        <li>
          <button
            class="dropdown-item"
            data-value="${safeItem}"
          >
            ${displayItem}
          </button>
        </li>
      `;
      })
      .join("");
  };

  /**
   * Ajuste le padding des tags pour éviter la superposition avec les dropdowns ouverts
   * @param {string} openDropdownBtnId - ID du bouton du dropdown ouvert (null si tous fermés)
   */
  const adjustTagsForDropdown = (openDropdownBtnId) => {
    const tagsContainer = document.getElementById("selected-tags");

    if (!openDropdownBtnId) {
      tagsContainer.style.paddingLeft = "0";
      return;
    }

    const dropdownButton = document.getElementById(openDropdownBtnId);
    if (!dropdownButton) return;

    const rect = dropdownButton.getBoundingClientRect();
    const containerRect = tagsContainer.parentElement.getBoundingClientRect();

    // Calculer le padding nécessaire (position relative + largeur du dropdown + gap)
    const paddingNeeded = rect.left - containerRect.left + rect.width + 32;

    tagsContainer.style.paddingLeft = `${paddingNeeded}px`;
  };

  /**
   * Ferme tous les dropdowns
   */
  const closeAllDropdowns = () => {
    dropdownConfigs.forEach(({ menu, chevron }) => {
      document.getElementById(menu).classList.add("hidden");
      document.getElementById(chevron).classList.remove("rotate-180");
    });
    adjustTagsForDropdown(null);
  };

  /**
   * Réinitialise les champs de recherche des dropdowns et repeuple les listes complètes
   */
  const resetDropdownSearches = () => {
    dropdownConfigs.forEach(({ search, list, type }) => {
      document.getElementById(search).value = "";
      // Repeupler avec la liste complète depuis le cache
      populateDropdown(list, cachedData[type]);
    });
  };

  /**
   * Attache les listeners aux items des dropdowns en event delegation, pour palier au risque de grand nombre d'ingrédients
   * Un seul listener par dropdown !
   */
  const attachDropdownItemListeners = () => {
    dropdownConfigs.forEach(({ list, type }) => {
      const listElement = document.getElementById(list);

      // UN SEUL listener sur le parent <ul> via event delegation
      listElement.addEventListener("click", (e) => {
        // Trouver le bouton cliqué : bubble
        const btn = e.target.closest("button.dropdown-item");

        if (btn) {
          const { value } = btn.dataset;
          const sanitizedValue = sanitizeTagValue(value);
          if (sanitizedValue) {
            appState.addTag(type, sanitizedValue);
            resetDropdownSearches();
            closeAllDropdowns();
          }
        }
      });
    });
  };

  /**
   * Configure la recherche dans les dropdowns
   */
  const setupDropdownSearch = () => {
    dropdownConfigs.forEach(({ search, list, type }) => {
      const input = document.getElementById(search);
      input.addEventListener("input", (e) => {
        // Sécuriser et normaliser l'entrée utilisateur
        const query = normalizeText(sanitizeSearchInput(e.target.value, 50));
        // Utiliser le cache au lieu de recalculer
        const allItems = cachedData[type];
        const filtered = allItems.filter((item) =>
          normalizeText(item).includes(query)
        );
        populateDropdown(list, filtered);
        // pas de listener à gérer grâce à l'event delegation
      });
    });
  };

  /**
   * Configure l'ouverture/fermeture des dropdowns
   */
  const setupDropdownToggle = () => {
    dropdownConfigs.forEach(({ btn, menu, chevron }) => {
      const button = document.getElementById(btn);
      const menuEl = document.getElementById(menu);
      const chevronEl = document.getElementById(chevron);

      button.addEventListener("click", (e) => {
        e.stopPropagation();

        const isCurrentlyOpen = !menuEl.classList.contains("hidden");

        // Fermer les autres dropdowns indépendamment de leur statut
        dropdownConfigs
          .filter((other) => other.menu !== menu)
          .forEach(({ menu: otherMenu, chevron: otherChevron }) => {
            document.getElementById(otherMenu).classList.add("hidden");
            document
              .getElementById(otherChevron)
              .classList.remove("rotate-180");
          });

        // Toggle le dropdown actuel
        if (isCurrentlyOpen) {
          menuEl.classList.add("hidden");
          chevronEl.classList.remove("rotate-180");
          adjustTagsForDropdown(null);
        } else {
          menuEl.classList.remove("hidden");
          chevronEl.classList.add("rotate-180");

          // Autofocus sur l'input de recherche
          const searchInputId = menu.replace("-dropdown", "-search");
          const searchInput = document.getElementById(searchInputId);
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 50);
          }

          // Ajuster les tags pour éviter la superposition
          adjustTagsForDropdown(btn);
        }
      });
    });

    // Fermer les dropdowns au clic extérieur
    document.addEventListener("click", () => {
      closeAllDropdowns();
    });

    // Empêcher la fermeture au clic dans le dropdown
    dropdownConfigs.forEach(({ menu }) => {
      document.getElementById(menu).addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
  };

  /**
   * Initialise les dropdowns
   */
  const setup = () => {
    // Peupler les dropdowns initialement avec les données en cache
    dropdownConfigs.forEach(({ list, type }) => {
      populateDropdown(list, cachedData[type]);
    });

    setupDropdownToggle();
    setupDropdownSearch();
    attachDropdownItemListeners();
  };

  return { setup };
};
