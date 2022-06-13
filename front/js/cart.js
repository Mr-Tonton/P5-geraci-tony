import { ApiCalls } from "./class/ApiCalls.js";
import { Utils } from "./class/Utils.js";
import { Basket } from "./class/Basket.js";

class Cart {
    constructor() {
        this.retrieveElements();
        this.setup();
        this.basket = new Basket();
    }

    retrieveElements() {
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
        this.totalQuantity = document.getElementById("totalQuantity");
        this.totalPrice = document.getElementById("totalPrice");
    }

    setup() {
        this.cartArray = JSON.parse(localStorage.getItem("cart"));
        // regex
        this.nameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\- ]+$/;
        this.addressRegex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
        this.cityRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
        this.emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    }

    // génère l'affichage du panier sur la page
    displayCart() {
        this.cartArray = this.basket.formatCart(this.cartArray);
        this.cartArray = this.basket.sortCart(this.cartArray);

        for (let i = 0; i < this.cartArray.length; i++) {
            this.generateCartArticle();
            ApiCalls.callApiArticle(this.cartArray[i].id)
                .then((articleData) => {
                    this.setArticlesDisplay(i, articleData);
                })
                .catch((err) => {
                    alert("Problème d'affichage des articles: " + err);
                })
        }
        this.basket.calculateTotalArticle(this.cartArray, document.getElementsByTagName("h1")[0], this.totalQuantity);
        this.basket.calculateTotalPrice(this.cartArray, this.totalPrice);
    }

    // vérifie s'il y a bien un template dans cart.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#cart__items"
    generateCartArticle() {
        if ("content" in document.createElement("template")) {
            let clone = document.importNode(this.article.template.content, true);
            this.article.cartItems.appendChild(clone);
        }
    }

    // génère l'affichage des différents articles du panier sur la page
    setArticlesDisplay(iterable, product) {
        this.article.cartItem[iterable].setAttribute("data-id", this.cartArray[iterable].id);
        this.article.cartItem[iterable].setAttribute("data-color", this.cartArray[iterable].color);
        this.article.img[iterable].setAttribute("src", product.imageUrl);
        this.article.img[iterable].setAttribute("alt", product.altTxt);
        this.article.name[iterable].innerText = product.name;
        this.article.color[iterable].innerText = this.cartArray[iterable].color;
        this.article.price[iterable].innerText = product.price + " €";
        this.article.quantity[iterable].setAttribute("value", this.cartArray[iterable].quantity);
    }

    // formate l'affichage des messages d'erreur ou de validité
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

    init() {
        this.displayCart();
        this.initControls();
    }

    initControls() {
        // traite les cas particuliers liés à l'input (input < 1 && input > 100), calcul les totaux et sauvegarde le panier
        this.article.cartItems.addEventListener("change", (e) => {
            for (let inputQty of this.article.quantity) {
                if (e.target === inputQty) {
                    let qty = Number(e.target.value);
                    if (qty > 100) {
                        qty = 100;
                        inputQty.value = qty;
                    }
                    if (qty < 1) {
                        qty = 1;
                        inputQty.value = qty;
                    }
                    this.cartArray = this.basket.formatCart(this.cartArray);
                    let targetedArticle = e.target.closest(".cart__item");
                    let foundProduct = this.cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
                    foundProduct.quantity = qty;
                    this.basket.calculateTotalArticle(this.cartArray, document.getElementsByTagName("h1")[0], this.totalQuantity);
                    this.basket.calculateTotalPrice(this.cartArray, this.totalPrice);
                    this.basket.saveCart(this.cartArray);
                }
            }
        })

        // traite la suppression d'un article et enregistre les modifications
        this.article.cartItems.addEventListener("click", (e) => {
            for (let deleteBtn of this.article.delete) {
                if (e.target === deleteBtn && window.confirm("Voulez vous vraiment supprimer cet article de votre panier ?")) {
                    e.preventDefault();
                    this.basket.formatCart(this.cartArray);
                    let targetedArticle = e.target.closest(".cart__item");
                    let foundProduct = this.cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
                    this.cartArray = this.cartArray.filter(p => p.color !== foundProduct.color || p.id !== foundProduct.id);
                    this.article.cartItems.removeChild(targetedArticle);
                    this.basket.calculateTotalArticle(this.cartArray, document.getElementsByTagName("h1")[0], this.totalQuantity);
                    this.basket.calculateTotalPrice(this.cartArray, this.totalPrice);
                    this.basket.saveCart(this.cartArray);
                }
            }
        })

        // traite les inputs du formulaire, et assure la validité des entrées
        this.form.container[0].addEventListener("input", (e) => {
            let input = e.target;
            let inputValue = e.target.value;
            if (input === this.form.firstName) this.formatInputEntrie(this.nameRegex, inputValue, this.form.firstNameErr, "Prénom valide", "Prénom invalide");
            if (input === this.form.lastName) this.formatInputEntrie(this.nameRegex, inputValue, this.form.lastNameErr, "Nom valide", "Nom invalide");
            if (input === this.form.address) this.formatInputEntrie(this.addressRegex, inputValue, this.form.addressErr, "Adresse valide", "Adresse invalide");
            if (input === this.form.city) this.formatInputEntrie(this.cityRegex, inputValue, this.form.cityErr, "Nom de ville valide", "Nom de ville invalide");
            if (input === this.form.email) this.formatInputEntrie(this.emailRegex, inputValue, this.form.emailErr, "Email valide", "email invalide, veuillez utiliser un format 'mailtest@test.fr'");
        })

        // traite la validation et l'envoi de la commande
        this.form.order.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.form.firstNameErr.classList.contains("valid") &&
                this.form.lastNameErr.classList.contains("valid") &&
                this.form.addressErr.classList.contains("valid") &&
                this.form.cityErr.classList.contains("valid") &&
                this.form.emailErr.classList.contains("valid") &&
                this.cartArray.length !== 0) {
                let contact = {
                    firstName: this.form.firstName.value,
                    lastName: this.form.lastName.value,
                    address: this.form.address.value,
                    city: this.form.city.value,
                    email: this.form.email.value
                }
                let products = this.cartArray.map(p => p.id);

                ApiCalls.sendOrder({ contact, products })
                    .then(data => {
                        document.location.href = "./confirmation.html?orderId=" + data.orderId;
                    })
            } else {
                Utils.addMsg("Veuillez remplir correctement les champs et ne pas avoir un panier vide", document.getElementsByTagName("body")[0], "add_article--invalid");
            }
        });


    }
}

const cart = new Cart();
cart.init();