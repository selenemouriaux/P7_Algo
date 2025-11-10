/**
 * Normalise le texte : supprime les accents et convertit en minuscules
 * Permet une recherche insensible aux accents et à la casse
 *
 * @param {string} text - Texte à normaliser
 * @returns {string} Texte normalisé sans accents et en minuscules
 */
export const normalizeText = (text) => {
  return String(text)
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués (é en e + ´)
    .replace(/[\u0300-\u036f]/g, ""); // Supprime les accents
};

/**
 * Echappe les caractères HTML - bloque les injections comme les balises <script />
 * @param {string} text - Texte à cleaner
 * @returns {string} Texte secure
 */
export const escapeHtml = (text) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "/": "&#x2F;",
  };
  return String(text).replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Sanitize une entrée utilisateur
 * @param {string} input - Entrée utilisateur
 * @param {number} maxLength - Longueur maximale (défaut: 100)
 * @returns {string} Entrée sanitized
 */
export const sanitizeSearchInput = (input, maxLength = 100) => {
  if (typeof input !== "string") return "";

  // Limite la longueur pour limiter l'impact d'attaques
  let sanitized = input.slice(0, maxLength);

  // Supprime les caractères de contrôle
  // On pourrait rajouter une gestion de la ponctuation ici
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  // Réduit les espaces multiples à un seul
  sanitized = sanitized.replace(/\s+/g, " ");

  // Trim
  sanitized = sanitized.trim();

  return sanitized;
};

/**
 * Valide et nettoie une valeur de tag
 * @param {string} value - Valeur du tag
 * @returns {string|null} Valeur nettoyée ou null si invalide
 */
export const sanitizeTagValue = (value) => {
  if (typeof value !== "string" || value.length === 0) return null;

  // Limite à 50 caractères
  const sanitized = sanitizeSearchInput(value, 50);

  if (sanitized.length === 0) return null;

  return sanitized.toLowerCase();
};
