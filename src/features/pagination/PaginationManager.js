/**
 * Crée un gestionnaire de pagination
 * @param {Object} appState - State de l'app
 * @param {number} recipesPerPage - Nombre de recettes par page
 * @returns {Object} API publique
 */
export const createPaginationManager = (appState, recipesPerPage = 12) => {
  /**
   * Calcule le nombre total de pages
   * @returns {number}
   */
  const getTotalPages = () => {
    return Math.ceil(appState.filteredRecipes.length / recipesPerPage);
  };

  /**
   * Navigue vers une page spécifique
   * @param {number} page - Numéro de la page
   */
  const goToPage = (page) => {
    appState.setPage(page);

    // Scroll vers le début de la section main
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /**
   * Génère les numéros de page avec ellipses si nécessaire
   * @param {number} totalPages - Nombre total de pages
   */
  const renderPageNumbers = (totalPages) => {
    const pageNumbersContainer = document.getElementById("page-numbers");
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pageNumbers.push(1);

      if (appState.currentPage <= 3) {
        pageNumbers.push(
          ...Array.from({ length: maxVisible - 1 }, (_, i) => i + 2)
        );
        pageNumbers.push("...", totalPages);
      } else if (appState.currentPage >= totalPages - 2) {
        pageNumbers.push("...");
        pageNumbers.push(
          ...Array.from(
            { length: maxVisible },
            (_, i) => totalPages - (maxVisible - 1) + i
          )
        );
      } else {
        pageNumbers.push(
          "...",
          appState.currentPage - 1,
          appState.currentPage,
          appState.currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    // Générer le HTML
    pageNumbersContainer.innerHTML = pageNumbers
      .map((num) => {
        if (num === "...") {
          return '<span class="px-3 py-2 text-gray-400">...</span>';
        }

        const isActive = num === appState.currentPage;
        const btnClass = isActive
          ? "px-4 py-2 rounded-lg bg-primary-yellow text-gray-900 font-semibold"
          : "px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors";

        return `
        <button
          class="${btnClass}"
          data-page="${num}"
          aria-label="Page ${num}"
          ${isActive ? 'aria-current="page"' : ""}
        >
          ${num}
        </button>
      `;
      })
      .join("");

    // Attacher les événements aux boutons de numéro de page
    pageNumbersContainer.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        goToPage(page);
      });
    });
  };

  /**
   * Maj pagination
   */
  const update = () => {
    const totalRecipes = appState.filteredRecipes.length;
    const pagination = document.getElementById("pagination");

    if (totalRecipes > recipesPerPage) {
      pagination.classList.remove("hidden");

      const totalPages = getTotalPages();

      // S'assurer que currentPage est valide
      if (appState.currentPage > totalPages) {
        appState.currentPage = 1;
      }

      const startIndex = (appState.currentPage - 1) * recipesPerPage + 1;
      const endIndex = Math.min(
        appState.currentPage * recipesPerPage,
        totalRecipes
      );

      // Mettre à jour les infos d'affichage
      document.getElementById("showing-start").textContent = startIndex;
      document.getElementById("showing-end").textContent = endIndex;
      document.getElementById("total-recipes").textContent = totalRecipes;

      // Mettre à jour les boutons précédent/suivant
      const prevBtn = document.getElementById("prev-page");
      const nextBtn = document.getElementById("next-page");

      prevBtn.disabled = appState.currentPage === 1;
      nextBtn.disabled = appState.currentPage === totalPages;

      // Générer les numéros de page
      renderPageNumbers(totalPages);
    } else {
      pagination.classList.add("hidden");
    }
  };

  /**
   * Configure les contrôles de pagination
   */
  const setup = () => {
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    prevBtn.addEventListener("click", () => {
      if (appState.currentPage > 1) {
        goToPage(appState.currentPage - 1);
      }
    });

    nextBtn.addEventListener("click", () => {
      const totalPages = getTotalPages();
      if (appState.currentPage < totalPages) {
        goToPage(appState.currentPage + 1);
      }
    });
  };

  /**
   * Retourne les recettes pour la page actuelle
   * @returns {Array} Recettes de la page actuelle
   */
  const getRecipesForCurrentPage = () => {
    const startIndex = (appState.currentPage - 1) * recipesPerPage;
    const endIndex = Math.min(
      startIndex + recipesPerPage,
      appState.filteredRecipes.length
    );
    return appState.filteredRecipes.slice(startIndex, endIndex);
  };

  return { setup, update, getRecipesForCurrentPage };
};
