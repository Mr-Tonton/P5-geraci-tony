// on import la fonction callApiArticles du fichier apiCalls.js
import { callApiArticles } from "./apiCalls.js/apiCalls.js";

/*********************/
/* Retrieve elements */
/*********************/

// objet regroupant l'ensemble des récupérations sur le DOM
const retrieveElements = {
    items: document.getElementById("items"),
    article : {
        template: document.getElementById("article-template"),
        link: document.getElementsByClassName("article-link"),
        img: document.getElementsByClassName("article-img"),
        name: document.getElementsByClassName("productName"),
        description: document.getElementsByClassName("productDescription"),
    },
}

/*********************/
/* Init */
/*********************/

displayArticles();

/*********************/
/* Functions */
/*********************/

// génère l'affichage des différents articles sur la page
function displayArticles() {
    callApiArticles()
            .then((jsonListArticle) => {
            for (let i = 0; i < jsonListArticle.length; i++) {
                generateArticle();
                setArticlesDisplay(i, jsonListArticle);
            }
        })
}

// vérifie s'il y a bien un template dans index.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#items"
function generateArticle() {
    if ("content" in document.createElement("template")) {
        let clone = document.importNode(retrieveElements.article.template.content, true);
        retrieveElements.items.appendChild(clone);
    }
}

// traite l'affichage des articles sur la page index.html
function setArticlesDisplay(iterable, listeArticle) {
    retrieveElements.article.link[iterable].setAttribute("href", "./product.html?id=" + listeArticle[iterable]._id);
    retrieveElements.article.img[iterable].setAttribute("src", listeArticle[iterable].imageUrl);
    retrieveElements.article.img[iterable].setAttribute("alt", listeArticle[iterable].altTxt);
    retrieveElements.article.name[iterable].textContent = listeArticle[iterable].name;
    retrieveElements.article.description[iterable].textContent = listeArticle[iterable].description;
}