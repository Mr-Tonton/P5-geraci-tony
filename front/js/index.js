import { ApiCalls } from "./class/ApiCalls.js";

class Index {
    constructor() {
        this.retrieveElements();
    }

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

    // génère l'affichage des différents articles sur la page
    displayArticles() {
        ApiCalls.callApiArticles()
            .then((jsonListArticle) => {
                for (let i = 0; i < jsonListArticle.length; i++) {
                    this.generateArticle();
                    this.setArticlesDisplay(i, jsonListArticle);
                }
            })
    }

    // vérifie s'il y a bien un template dans index.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#items"
    generateArticle() {
        if ("content" in document.createElement("template")) {
            let clone = document.importNode(this.article.template.content, true);
            this.items.appendChild(clone);
        }
    }

    // traite l'affichage des articles sur la page index.html
    setArticlesDisplay(iterable, listeArticle) {
        this.article.link[iterable].setAttribute("href", "./product.html?id=" + listeArticle[iterable]._id);
        this.article.img[iterable].setAttribute("src", listeArticle[iterable].imageUrl);
        this.article.img[iterable].setAttribute("alt", listeArticle[iterable].altTxt);
        this.article.name[iterable].textContent = listeArticle[iterable].name;
        this.article.description[iterable].textContent = listeArticle[iterable].description;
    }

    init() {
        this.displayArticles();
    }
}

const index = new Index();
index.init();