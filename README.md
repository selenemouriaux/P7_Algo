# Les Ptits Plats

Projet algorithmique dont le but est de faire et documenter des recherches sur la performance de plusieurs approches algorithmiques en ce qui concerne l'aspect 'recherche' dans un site de recettes.

## Algos

### Algo natif

Utilisant une approche et des instructions JS natives impératives

### Algo fonctionnel

Utilisant une approche et des instructions conséquemment plus déclaratives et fonctionnelles, plus lisible.

### Algo suggéré 

J'ai opté pour un choix en dehors des propositions de base après avoir lu les cours et la doc n'étant pas bien sûre que les approches de base répondent vraiment aux attentes.   
fortement inspirée des méthodes plébiscitées par elasticsearch et google pour la gestion de nombreuses data avec l'index inversé.

## Performance

Notion de Big O qui permet de définir l'évolution du temps d'éxécution d'un processus/algo, noté avec O() du pire au meilleur :   
* Quadratique
* linéaire
* logarithmique
* constant
   
Les algos natifs et fonctionnels sont tous deux de complexité linéaire, ce qui n'est pas particulièrement performant mais ok en contexte avec nos sets de data, en revanche l'algo proposé ne fait qu'une passe linéaire au début pour ensuite passer sur du constant à l'utilisation, c'est, à l'inverse, très performant !

## Front end

Le choix a été porté sur Tailwind car on n'est pas dans une approche mobile, et quand bien même, j'avais envie de découvrir tailwind qui s'est démocratisé et semble nettement plus tourné vers l'avenir que bootstrap.

Par ailleurs Tailwind se défait de tout ce qu'il n'utilise pas, ce qui le rend beaucoup plus léger que son pendant (green code)

## Green code

Le projet a été développé sur la base de la dernière version de Vite, et utilise une architecture modulaire et un bon nombre de pratiques dites de green code :
* Moteurs de recherche interchangeables
* Subscribe au pattern Observer pour gestion état centralisé
* Event Delegation au lieu de centaines (DropdownManager)
* Debounce 300ms, évite les calculs inutiles et réduit la consommation CPU
* Pseudo memoization/cache, toujours plus propre et plus green que recalculer a chaque repopulate
* Lazy Loading & thumbnails
* Pagination de 12 recettes par page, pas de break et pas de charge CPU inutile
* Sécurité : escapes, sanitization & validation des entrées entrées utilisateur
* A11Y, sémantique HTML, headings sr-only, ARIA, W3C ok
* tailwind, CSS purgé
* Projet Vite optimisé (minification, tree-shaking, cache busting)
* Fonctionnalités isolées dans un manager dédié : MainSearch, FilterManager, DropdownManager, TagManager, PaginationManager, AppState
* Séparation des responsabilités (Single Responsibility - SOLID)
   
## Benching & Algorigrammes

Fournis dans les pièces jointes aka la fiche d'investigation en pdf.
