export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        performance: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Set: "readonly",
        Map: "readonly",
        Array: "readonly",
      },
    },
    rules: {
      // Préférer const/let au lieu de var
      "no-var": "error",

      // Préférer const quand la variable n'est pas réassignée
      "prefer-const": "warn",

      // Préférer arrow functions
      "prefer-arrow-callback": "warn",

      // Préférer template literals
      "prefer-template": "warn",

      // Préférer destructuring
      "prefer-destructuring": ["warn", {
        "array": false,
        "object": true
      }],

      // Préférer spread operator
      "prefer-spread": "warn",

      // Préférer for-of au lieu de for classique
      "no-restricted-syntax": [
        "warn",
        {
          "selector": "ForStatement",
          "message": "Préférer for...of ou des méthodes de tableau modernes"
        }
      ],

      // Éviter les fonctions anonymes
      "func-names": ["warn", "as-needed"],

      // Semi-colons optionnels
      "semi": ["warn", "always"],

      // Quotes uniformes
      "quotes": ["warn", "double", { "avoidEscape": true }],

      // Pas de console en production (warning seulement)
      "no-console": "off", // Désactivé pour le dev

      // Trailing comma
      "comma-dangle": ["warn", "only-multiline"],
    },
  },
  {
    // Configuration spécifique pour les fichiers "natif" (benchmarks)
    files: ["**/benchmark-*.js", "**/performance-tests.js"],
    rules: {
      // Autoriser les for classiques dans les benchmarks
      "no-restricted-syntax": "off",
      "prefer-arrow-callback": "off",
    },
  },
];
