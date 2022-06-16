import { ApiCalls } from "./class/ApiCalls.js";


class Index {
    constructor() {
        this.retrieveElements();
        this.displayArticles();
    }

    // Récupère les différents éléments sur le DOM
    retrieveElements() {
        this.items = document.getElementById("items");
        
        this.article = {
            template: document.getElementById("article-template"),
            link: document.getElementsByClassName("article-link"),
            img: document.getElementsByClassName("article-img"),
            name: document.getElementsByClassName("productName"),
            description: document.getElementsByClassName("productDescription"),
        }
    }

    // Génère l'affichage des différents articles sur la page
    displayArticles() {
        ApiCalls.get()
            .then((jsonListArticle) => {
                for (let i = 0; i < jsonListArticle.length; i++) {
                    this.generateArticle();
                    this.setArticlesDisplay(i, jsonListArticle[i]);
                }
            })
            .catch((err) => {
                alert("Il y a un problème pour afficher l'ensemble des articles : " + err);
            })
    }

    // Vérifie s'il y a bien un template dans index.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#items"
    generateArticle() {
        if ("content" in document.createElement("template")) {
            let clone = document.importNode(this.article.template.content, true);
            this.items.appendChild(clone);
        }
    }

    // Traite l'affichage des articles sur la page index.html
    setArticlesDisplay(iterable, listeArticle) {
        this.article.link[iterable].setAttribute("href", "./product.html?id=" + listeArticle._id);
        this.article.img[iterable].setAttribute("src", listeArticle.imageUrl);
        this.article.img[iterable].setAttribute("alt", listeArticle.altTxt);
        this.article.name[iterable].textContent = listeArticle.name;
        this.article.description[iterable].textContent = listeArticle.description;
    }
}

new Index();
