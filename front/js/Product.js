import { ApiCalls } from "./class/ApiCalls.js";
import { Utils } from "./class/Utils.js";
import { Basket } from "./class/Basket.js";


class Product {
    constructor() {
        this.basket = Basket.get();
        this.retrieveElements();
        this.displayArticle();
        this.initControls();
    }

    // Récupère les différents éléments sur le DOM
    retrieveElements() {
        this.confirmBtn = document.getElementById("addToCart");

        this.article = {
            img: document.getElementsByClassName("item__img"),
            title: document.getElementById("title"),
            price: document.getElementById("price"),
            description: document.getElementById("description"),
            colors: document.getElementById("colors"),
            quantity: document.getElementById("quantity"),
            alert: document.getElementById("add_article_message"),
            numberDisplay: document.getElementById("numberOfArticle"),
        }
    }

    // Génère l'affichage de l'article sur la page
    displayArticle() {
        ApiCalls.get(Utils.getUrlParam("id"))
            .then((articleData) => {
                this.setArticleDisplay(articleData);
                this.addColorOptions(articleData.colors);
            })
            .catch((err) => {
                alert("Il y a un problème pour afficher l'article sélectionné : " + err);
            })
    }

    // Traite l'affichage sur la page product.html de l'article
    setArticleDisplay(article) {
        let divImg = document.createElement("img");
        divImg.setAttribute("src", article.imageUrl);
        divImg.setAttribute("alt", article.altTxt);
        this.article.img[0].appendChild(divImg);
        this.article.title.textContent = article.name;
        this.article.description.textContent = article.description;
        this.article.price.textContent = article.price;
        // on initialise l'input a 1
        this.article.quantity.value = 1;
    }

    // Traite le cas particulier de la couleur (tableau de couleurs) et affiche les différents choix de couleurs
    addColorOptions(colors) {
        for (let i in colors) {
            let divOption = document.createElement("option");
            divOption.setAttribute("value", colors[i]);
            divOption.textContent = colors[i];
            this.article.colors.appendChild(divOption);
        }
    }

    
    // Gère les Events
    initControls() {

        // traite les cas particuliers liés à l'input (input < 1 && input > 100)
        this.article.quantity.addEventListener("change", (e) => {
            let inputValue = Math.round(e.target.value);
            this.article.quantity.value = inputValue;
            if (inputValue > 100) {
                this.article.quantity.value = 100;
            }
            if (inputValue < 1) {
                this.article.quantity.value = 1;
            }
        })

        // Traite le cas particulier d'une couleur non sélectionnée. Si valide, envoie l'article dans le panier sur le localstorage
        this.confirmBtn.addEventListener("click", () => {
            if (this.article.colors[colors.selectedIndex].value === "") {
                return alert("veuillez selectionner une couleur");
            }
            let foundProduct = this.basket.cartArray.find((p) => p.id === Utils.getUrlParam("id") && p.color === this.article.colors[colors.selectedIndex].value);
            if (foundProduct === undefined) {
                foundProduct = {
                    quantity: this.article.quantity.value,
                    color: this.article.colors[colors.selectedIndex].value,
                }
            }
            this.basket.addArticleToCart(Utils.getUrlParam("id"), this.article.quantity.value, this.article.colors[colors.selectedIndex].value);
            Utils.addMsg("Votre panier contient " + foundProduct.quantity + " " + this.article.title.innerText + " de couleur " + foundProduct.color, "add_article--valid");
        })
    }
}

new Product();

