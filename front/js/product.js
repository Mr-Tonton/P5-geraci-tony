import { ApiCalls } from "./class/ApiCalls.js";
import { Utils } from "./class/Utils.js";
import { Basket } from "./class/Basket.js";

class Product {
    constructor() {
        this.retrieveElements();
        this.cartArray = JSON.parse(localStorage.getItem("cart"));
        this.basket = new Basket(this.cartArray);
    }

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

    // génère l'affichage de l'article sur la page
    displayArticle() {
        ApiCalls.callApiArticle(Utils.getUrlParam("id"))
            .then((articleData) => {
                this.setArticleDisplay(articleData);
                this.addColorOptions(articleData.colors);
            })
    }

    // traite l'affichage sur la page product.html de l'article
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

    // traite le cas particulier de la couleur (tableau de couleurs) et affiche les différents choix de couleurs
    addColorOptions(colors) {
        for (let i in colors) {
            let divOption = document.createElement("option");
            divOption.setAttribute("value", colors[i]);
            divOption.textContent = colors[i];
            this.article.colors.appendChild(divOption);
        }
    }

    init() {
        this.displayArticle()
        this.initControls();
    }

    initControls() {

        // traite les cas particuliers liés à l'input (input < 1 && input > 100)
        this.article.quantity.addEventListener("input", (e) => {
            let inputValue = e.target.value;
            if (inputValue > 100) {
                this.article.quantity.value = 100;
            }
            if (inputValue < 1) {
                this.article.quantity.value = 1;
            }
        })

        // traite le cas particulier d'une couleur non sélectionnée. Si valide, envoie le panier sur le localstorage
        this.confirmBtn.addEventListener("click", () => {
            if (this.article.colors[colors.selectedIndex].value === "") {
                return alert("veuillez selectionner une couleur");
            }
            this.basket.addArticleToCart(this.cartArray, this.article.quantity.value, this.article.colors, document.getElementsByTagName("body")[0]);
        })
    }
}

const product = new Product();
product.init();
