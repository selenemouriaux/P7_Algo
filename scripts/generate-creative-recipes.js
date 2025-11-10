/**
 * Générateur de recettes
 *
 * Usage: node scripts/generate-creative-recipes.js [500|1000|1500]
 */

import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_COUNT = parseInt(process.argv[2]) || 500;
const OUTPUT_FILE = join(__dirname, `../src/data/recipes-x-${TARGET_COUNT}.js`);

const INGREDIENTS = {
  proteines: [
    { name: "Poulet", unit: "grammes" },
    { name: "Boeuf", unit: "grammes" },
    { name: "Porc", unit: "grammes" },
    { name: "Agneau", unit: "grammes" },
    { name: "Saumon", unit: "grammes" },
    { name: "Thon", unit: "grammes" },
    { name: "Crevettes", unit: "grammes" },
    { name: "Tofu", unit: "grammes" },
    { name: "Lentilles", unit: "grammes" },
    { name: "Pois chiches", unit: "grammes" },
    { name: "Haricots rouges", unit: "grammes" },
    { name: "Canard", unit: "grammes" },
    { name: "Dinde", unit: "grammes" },
    { name: "Cabillaud", unit: "grammes" },
    { name: "Seiche", unit: "grammes" },
    { name: "Moules", unit: "grammes" },
    { name: "Oeufs", qty: [2, 4, 6, 8] },
  ],

  legumes: [
    "Tomate",
    "Oignon",
    "Ail",
    "Carotte",
    "Courgette",
    "Aubergine",
    "Poivron rouge",
    "Poivron vert",
    "Brocoli",
    "Chou-fleur",
    "Épinards",
    "Champignons",
    "Poireau",
    "Céleri",
    "Concombre",
    "Haricots verts",
    "Petit pois",
    "Courge",
    "Patate douce",
    "Pomme de terre",
    "Asperges",
    "Fenouil",
    "Radis",
    "Betterave",
  ],

  feculents: [
    { name: "Riz basmati", unit: "grammes" },
    { name: "Riz complet", unit: "grammes" },
    { name: "Pâtes", unit: "grammes" },
    { name: "Spaghetti", unit: "grammes" },
    { name: "Tagliatelles", unit: "grammes" },
    { name: "Quinoa", unit: "grammes" },
    { name: "Boulgour", unit: "grammes" },
    { name: "Couscous", unit: "grammes" },
    { name: "Polenta", unit: "grammes" },
  ],

  produits_laitiers: [
    { name: "Crème fraîche", unit: "ml" },
    { name: "Lait", unit: "ml" },
    { name: "Lait de coco", unit: "ml" },
    { name: "Parmesan", unit: "grammes" },
    { name: "Mozzarella", unit: "grammes" },
    { name: "Chèvre", unit: "grammes" },
    { name: "Gruyère", unit: "grammes" },
    { name: "Yaourt nature", unit: "grammes" },
    { name: "Beurre", unit: "grammes" },
  ],

  epices_aromates: [
    "Thym",
    "Romarin",
    "Basilic",
    "Persil",
    "Coriandre",
    "Menthe",
    "Curry",
    "Paprika",
    "Cumin",
    "Gingembre",
    "Curcuma",
    "Piment",
    "Poivre noir",
    "Sel",
    "Herbes de Provence",
    "Cannelle",
    "Muscade",
    "Laurier",
    "Origan",
    "Safran",
  ],

  liquides: [
    { name: "Bouillon de volaille", unit: "ml" },
    { name: "Bouillon de légumes", unit: "ml" },
    { name: "Vin blanc", unit: "ml" },
    { name: "Vin rouge", unit: "ml" },
    { name: "Sauce soja", unit: "ml" },
    { name: "Huile d'olive", unit: "ml" },
    { name: "Vinaigre balsamique", unit: "ml" },
    { name: "Jus de citron", unit: "ml" },
  ],

  autres: [
    { name: "Farine", unit: "grammes" },
    { name: "Sucre", unit: "grammes" },
    { name: "Miel", unit: "grammes" },
    { name: "Moutarde", unit: "cuillères à soupe" },
    { name: "Concentré de tomate", unit: "cuillères à soupe" },
    { name: "Pâte de curry", unit: "cuillères à soupe" },
    { name: "Chocolat noir", unit: "grammes" },
    { name: "Noix", unit: "grammes" },
    { name: "Amandes", unit: "grammes" },
  ],
};

const RECIPE_TYPES = [
  {
    type: "Plat mijoté",
    styles: [
      "traditionnel",
      "de grand-mère",
      "réconfortant",
      "familial",
      "rustique",
    ],
    appliances: ["Cocotte", "Casserole", "Faitout"],
    ustensils: ["cuillère en bois", "planche à découper", "couteau"],
    time: [60, 90, 120],
    servings: [4, 6, 8],
  },
  {
    type: "Poêlée",
    styles: ["express", "rapide", "léger", "simple", "coloré"],
    appliances: ["Poêle", "Wok"],
    ustensils: ["spatule", "planche à découper", "couteau"],
    time: [15, 20, 25, 30],
    servings: [2, 4],
  },
  {
    type: "Gratin",
    styles: ["fondant", "doré", "croustillant", "gourmand", "gratinant"],
    appliances: ["Four"],
    ustensils: ["plat à gratin", "râpe", "couteau"],
    time: [40, 45, 50, 60],
    servings: [4, 6],
  },
  {
    type: "Salade",
    styles: ["fraîche", "croquante", "colorée", "estivale", "complète"],
    appliances: ["Saladier"],
    ustensils: ["couteau", "économe", "fouet"],
    time: [10, 15, 20],
    servings: [2, 4],
  },
  {
    type: "Soupe",
    styles: ["veloutée", "onctueuse", "réconfortante", "chaude", "crémeuse"],
    appliances: ["Mixeur", "Casserole"],
    ustensils: ["louche", "couteau", "planche à découper"],
    time: [30, 35, 40],
    servings: [4, 6],
  },
  {
    type: "Curry",
    styles: ["épicé", "parfumé", "onctueux", "indien", "thaï"],
    appliances: ["Casserole", "Wok"],
    ustensils: ["cuillère en bois", "couteau"],
    time: [35, 40, 45],
    servings: [4, 6],
  },
  {
    type: "Risotto",
    styles: ["crémeux", "fondant", "italien", "onctueux"],
    appliances: ["Casserole"],
    ustensils: ["cuillère en bois", "louche"],
    time: [30, 35, 40],
    servings: [2, 4],
  },
  {
    type: "Tarte",
    styles: ["salée", "rustique", "feuilletée", "croustillante"],
    appliances: ["Four"],
    ustensils: ["moule à tarte", "rouleau à pâtisserie", "fouet"],
    time: [45, 50, 60],
    servings: [6, 8],
  },
  {
    type: "Wok",
    styles: ["asiatique", "sauté", "croquant", "rapide"],
    appliances: ["Wok"],
    ustensils: ["spatule", "couteau", "planche à découper"],
    time: [20, 25, 30],
    servings: [2, 4],
  },
  {
    type: "Tajine",
    styles: ["parfumé", "oriental", "épicé", "mijoté"],
    appliances: ["Tajine", "Cocotte"],
    ustensils: ["cuillère en bois", "couteau"],
    time: [90, 120],
    servings: [4, 6],
  },
];

const NAME_PREFIXES = [
  "",
  "",
  "",
  "Délicieux",
  "Savoureux",
  "Parfait",
  "Exquis",
  "Authentique",
  "Traditionnel",
  "Moderne",
  "Revisité",
  "Classique",
];

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateIngredient(ingredientData, multiplier = 1) {
  if (typeof ingredientData === "string") {
    const hasQuantity = Math.random() > 0.3;
    const ingredient = { ingredient: ingredientData };

    if (hasQuantity) {
      ingredient.quantity = randomInt(1, 4);
    }

    return ingredient;
  } else {
    const ingredient = { ingredient: ingredientData.name };

    if (ingredientData.qty) {
      ingredient.quantity = random(ingredientData.qty);
    } else {
      let baseQty;
      if (ingredientData.unit === "grammes") {
        baseQty = randomInt(100, 500);
      } else if (ingredientData.unit === "ml") {
        baseQty = randomInt(50, 400);
      } else {
        baseQty = randomInt(1, 3);
      }
      ingredient.quantity = Math.round(baseQty * multiplier);
    }

    ingredient.unit = ingredientData.unit;
    return ingredient;
  }
}

function generateRecipe(id) {
  const recipeType = random(RECIPE_TYPES);
  const protein = random(INGREDIENTS.proteines);
  const servings = random(recipeType.servings);
  const time = random(recipeType.time);
  const style = random(recipeType.styles);

  const prefix = random(NAME_PREFIXES);
  const proteinName = typeof protein === "object" ? protein.name : protein;
  let name = `${recipeType.type} de ${proteinName}`;

  if (prefix) {
    name = `${prefix} ${name}`;
  }

  if (Math.random() > 0.5) {
    name = `${name} ${style}`;
  }

  const ingredients = [];
  const multiplier = servings / 4;

  ingredients.push(generateIngredient(protein, multiplier));

  const numVeggies = randomInt(2, 5);
  const veggies = shuffle(INGREDIENTS.legumes).slice(0, numVeggies);
  veggies.forEach((v) => ingredients.push(generateIngredient(v, multiplier)));

  if (Math.random() > 0.5) {
    const starch = random(INGREDIENTS.feculents);
    ingredients.push(generateIngredient(starch, multiplier));
  }

  if (Math.random() > 0.4) {
    const dairy = random(INGREDIENTS.produits_laitiers);
    ingredients.push(generateIngredient(dairy, multiplier));
  }

  const numSpices = randomInt(1, 3);
  const spices = shuffle(INGREDIENTS.epices_aromates).slice(0, numSpices);
  spices.forEach((s) => ingredients.push({ ingredient: s }));

  if (Math.random() > 0.3) {
    const liquid = random(INGREDIENTS.liquides);
    ingredients.push(generateIngredient(liquid, multiplier));
  }

  if (Math.random() > 0.6) {
    const other = random(INGREDIENTS.autres);
    ingredients.push(generateIngredient(other, multiplier));
  }

  const imageNumber = (Math.floor(Math.random() * 50) + 1)
    .toString()
    .padStart(2, "0");
  const image = `Recette${imageNumber}.webp`;

  const descriptions = [
    `Couper les ingrédients en morceaux. Faire revenir dans ${random(
      recipeType.appliances
    ).toLowerCase()}. Assaisonner et laisser cuire ${time} minutes. Servir chaud.`,
    `Préparer tous les ingrédients. Les faire cuire ensemble pendant ${time} minutes. Ajuster l'assaisonnement. Déguster immédiatement.`,
    `Émincer les légumes. Faire dorer la viande. Ajouter les légumes et les épices. Laisser mijoter ${time} minutes. Rectifier l'assaisonnement si nécessaire.`,
    `Dans ${random(
      recipeType.appliances
    ).toLowerCase()}, faire revenir les ingrédients avec un peu d'huile. Laisser cuire ${time} minutes à feu moyen. Servir bien chaud.`,
    `Préparer la recette en suivant l'ordre des ingrédients. Cuire pendant ${time} minutes. Vérifier la cuisson et servir pour ${servings} personnes.`,
  ];

  return {
    id,
    image,
    name,
    servings,
    ingredients,
    time,
    description: random(descriptions),
    appliance: random(recipeType.appliances),
    ustensils: recipeType.ustensils,
  };
}

function formatRecipe(recipe) {
  const ingredients = recipe.ingredients
    .map((ing) => {
      const parts = [`ingredient: "${ing.ingredient}"`];
      if (ing.quantity !== undefined) parts.push(`quantity: ${ing.quantity}`);
      if (ing.unit) parts.push(`unit: "${ing.unit}"`);
      return `      { ${parts.join(", ")} }`;
    })
    .join(",\n");

  const ustensils = recipe.ustensils.map((u) => `"${u}"`).join(", ");

  return `  {
    id: ${recipe.id},
    image: "${recipe.image}",
    name: "${recipe.name}",
    servings: ${recipe.servings},
    ingredients: [
${ingredients}
    ],
    time: ${recipe.time},
    description: "${recipe.description}",
    appliance: "${recipe.appliance}",
    ustensils: [${ustensils}]
  }`;
}

function generateAllRecipes() {
  console.log(`\n🍳 Génération de ${TARGET_COUNT} recettes créatives...\n`);

  const recipes = [];

  for (const i of Array.from({ length: TARGET_COUNT }, (_, idx) => idx)) {
    recipes.push(generateRecipe(i + 1));

    if ((i + 1) % 100 === 0) {
      console.log(`✅ ${i + 1}/${TARGET_COUNT} recettes générées`);
    }
  }

  return recipes;
}

async function generateFile(recipes) {
  const content = `/**
 * ${TARGET_COUNT} recettes générées automatiquement
 * Images recyclées aléatoirement (Recette01.webp à Recette50.webp)
 *
 * Généré le: ${new Date().toLocaleString("fr-FR")}
 */

export const recipes = [
${recipes.map((r) => formatRecipe(r)).join(",\n")}
];
`;

  await writeFile(OUTPUT_FILE, content, "utf-8");
}

function displayStats(recipes) {
  const uniqueNames = new Set(recipes.map((r) => r.name)).size;
  const uniqueProteins = new Set(
    recipes.map((r) => r.ingredients[0]?.ingredient)
  ).size;

  const avgIngredientsPerRecipe =
    recipes.reduce((sum, r) => sum + r.ingredients.length, 0) / recipes.length;
}

async function main() {
  const recipes = generateAllRecipes();
  await generateFile(recipes);
  displayStats(recipes);
}

main().catch((error) => {
  console.error("❌ Erreur:", error);
  process.exit(1);
});
