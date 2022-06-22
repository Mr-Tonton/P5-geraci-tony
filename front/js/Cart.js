import { ApiCalls } from "./class/ApiCalls.js";
import { Utils } from "./class/Utils.js";
import { Basket } from "./class/Basket.js";


class Cart {
    constructor() {
        this.basket = Basket.get();
        this.retrieveElements();
        this.setup();
        this.displayCart();
        this.initControls();
    }

    // Récupère les différents éléments sur le DOM
    retrieveElements() {
        this.totalQuantity = document.getElementById("totalQuantity");
        this.totalPrice = document.getElementById("totalPrice");

        this.article = {
            template: document.getElementById("article-template"),
            cartItems: document.getElementById("cart__items"),
            cartItem: document.getElementsByClassName("cart__item"),
            img: document.getElementsByClassName("article-img"),
            name: document.getElementsByClassName("article-name"),
            color: document.getElementsByClassName("article-color"),
            price: document.getElementsByClassName("article-price"),
            quantity: document.getElementsByClassName("itemQuantity"),
            delete: document.getElementsByClassName("deleteItem"),
        };

        this.form = {
            container: document.getElementsByClassName("cart__order__form"),
            firstName: document.getElementById("firstName"),
            firstNameErr: document.getElementById("firstNameErrorMsg"),
            lastName: document.getElementById("lastName"),
            lastNameErr: document.getElementById("lastNameErrorMsg"),
            address: document.getElementById("address"),
            addressErr: document.getElementById("addressErrorMsg"),
            city: document.getElementById("city"),
            cityErr: document.getElementById("cityErrorMsg"),
            email: document.getElementById("email"),
            emailErr: document.getElementById("emailErrorMsg"),
            order: document.getElementById("order"),
        };
    }

    // Centralise les différentes regex utilisées
    setup() {
        this.nameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\- ]+$/;
        this.addressRegex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
        this.cityRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
        this.emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    }

    // Génère l'affichage du panier sur la page
    displayCart() {
        this.basket.sortCart();
        this.basket.saveCart();
        for (let i = 0; i < this.basket.cartArray.length; i++) {
            this.generateCartArticle();
            ApiCalls.get(this.basket.cartArray[i].id)
                .then((articleData) => {
                    this.setArticlesDisplay(i, articleData);
                })
                .catch((err) => {
                    Utils.addMsg("Problème d'affichage des articles: " + err + " ", "add_article--invalid");
                })
        }
        this.basket.calculateTotalArticle(this.totalQuantity);
        this.basket.calculateTotalPrice(this.totalPrice);
        this.displayEmptyCartMsg();
    }

    // Vérifie s'il y a bien un template dans cart.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#cart__items"
    generateCartArticle() {
        if ("content" in document.createElement("template")) {
            let clone = document.importNode(this.article.template.content, true);
            this.article.cartItems.appendChild(clone);
        }
    }

    // Génère l'affichage des différents articles du panier sur la page
    setArticlesDisplay(iterable, product) {
        this.article.cartItem[iterable].setAttribute("data-id", this.basket.cartArray[iterable].id);
        this.article.cartItem[iterable].setAttribute("data-color", this.basket.cartArray[iterable].color);
        this.article.img[iterable].setAttribute("src", product.imageUrl);
        this.article.img[iterable].setAttribute("alt", product.altTxt);
        this.article.name[iterable].innerText = product.name;
        this.article.color[iterable].innerText = this.basket.cartArray[iterable].color;
        this.article.price[iterable].innerText = product.price + " €";
        this.article.quantity[iterable].setAttribute("value", this.basket.cartArray[iterable].quantity);
    }

    // Formate l'affichage des messages d'erreur ou de validité
    formatInputEntrie(regex, inputTarget, errorBalise, validMsg, invalidMsg) {
        if (inputTarget === "") {
            errorBalise.textContent = "";
            errorBalise.classList.remove("valid");
        } else if (regex.test(inputTarget)) {
            errorBalise.style.color = "rgb(0, 220, 0)";
            errorBalise.textContent = validMsg;
            errorBalise.classList.add("valid");
        } else {
            errorBalise.style.color = "rgb(220, 0, 0)";
            errorBalise.textContent = invalidMsg;
            errorBalise.classList.remove("valid");
        }
    }

    // Change le titre h1 en fonction du panier (vide)
    displayEmptyCartMsg() {
        if (this.basket.cartArray.length !== 0) {
            document.getElementsByTagName("h1")[0].innerText = "Votre panier";
        } else {
            document.getElementsByTagName("h1")[0].innerText = "Votre Panier est vide";
        }
    }


    // Gère les Events
    initControls() {

        // Traite les cas particuliers liés à l'input (input < 1 && input > 100), calcul les totaux et sauvegarde le panier
        this.article.cartItems.addEventListener("change", (e) => {
            for (let inputQty of this.article.quantity) {
                if (e.target === inputQty) {
                    let qty = Math.round(e.target.value);
                    inputQty.value = qty;
                    qty = Math.round(qty);
                    if (qty > 100) {
                        qty = 100;
                        inputQty.value = 100;
                    }

                    if (qty < 1) {
                        qty = 1;
                        inputQty.value = qty;
                    }
                    let targetedArticle = e.target.closest(".cart__item");
                    let foundProduct = this.basket.cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
                    foundProduct.quantity = qty;
                    this.basket.calculateTotalArticle(this.totalQuantity);
                    this.basket.calculateTotalPrice(this.totalPrice);
                    this.displayEmptyCartMsg();
                    this.basket.saveCart();
                }
            }
        });

        // Traite la suppression d'un article et enregistre les modifications
        this.article.cartItems.addEventListener("click", (e) => {
            for (let deleteBtn of this.article.delete) {
                if (e.target === deleteBtn && window.confirm("Voulez vous vraiment supprimer cet article de votre panier ?")) {
                    e.preventDefault();
                    let targetedArticle = e.target.closest(".cart__item");
                    let foundProduct = this.basket.cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
                    this.basket.cartArray = this.basket.cartArray.filter(p => p.color !== foundProduct.color || p.id !== foundProduct.id);
                    this.article.cartItems.removeChild(targetedArticle);
                    this.basket.calculateTotalArticle(this.totalQuantity);
                    this.basket.calculateTotalPrice(this.totalPrice);
                    this.displayEmptyCartMsg();
                    this.basket.saveCart();
                    Utils.addMsg("Vous avez supprimé cet article de votre panier", "add_article--valid");
                }
            }
        });

        // Traite les inputs du formulaire, et assure la validité des entrées
        this.form.container[0].addEventListener("input", (e) => {
            let input = e.target;
            let inputValue = e.target.value;
            if (input === this.form.firstName) this.formatInputEntrie(this.nameRegex, inputValue, this.form.firstNameErr, "Prénom valide", "Prénom invalide");
            if (input === this.form.lastName) this.formatInputEntrie(this.nameRegex, inputValue, this.form.lastNameErr, "Nom valide", "Nom invalide");
            if (input === this.form.address) this.formatInputEntrie(this.addressRegex, inputValue, this.form.addressErr, "Adresse valide", "Adresse invalide");
            if (input === this.form.city) this.formatInputEntrie(this.cityRegex, inputValue, this.form.cityErr, "Nom de ville valide", "Nom de ville invalide");
            if (input === this.form.email) this.formatInputEntrie(this.emailRegex, inputValue, this.form.emailErr, "Email valide", "email invalide, veuillez utiliser un format 'mailtest@test.fr'");
        });

        // Traite la validation et l'envoi de la commande
        this.form.order.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.form.firstNameErr.classList.contains("valid") &&
                this.form.lastNameErr.classList.contains("valid") &&
                this.form.addressErr.classList.contains("valid") &&
                this.form.cityErr.classList.contains("valid") &&
                this.form.emailErr.classList.contains("valid") &&
                this.basket.cartArray.length !== 0) {
                let contact = {
                    firstName: this.form.firstName.value,
                    lastName: this.form.lastName.value,
                    address: this.form.address.value,
                    city: this.form.city.value,
                    email: this.form.email.value
                }
                let products = this.basket.cartArray.map(p => p.id);

                ApiCalls.post({ contact, products }, "order")
                    .then(data => {
                        this.basket.clearCart();
                        document.location.href = "./confirmation.html?orderId=" + data.orderId;
                    })
            } else {
                Utils.addMsg("Veuillez remplir correctement les champs et ne pas avoir un panier vide", "add_article--invalid");
            }
        });
    }
}

new Cart();