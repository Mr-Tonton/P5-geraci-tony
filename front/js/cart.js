// on import la fonction callApiArticle du fichier apiCalls.js
import { callApiArticle, callApiArticles, sendOrder } from "./otherTools/apiCalls.js";
// on import la fonction getIdParam du fichier utils.js
import { saveCart, addMsg } from "./otherTools/utils.js";

/*********************/
/* Retrieve elements */
/*********************/

// objet regroupant l'ensemble des récupérations sur le DOM
const retrieveElements = {
    article: {
        template: document.getElementById("article-template"),
        cartItems: document.getElementById("cart__items"),
        cartItem: document.getElementsByClassName("cart__item"),
        img: document.getElementsByClassName("article-img"),
        name: document.getElementsByClassName("article-name"),
        color: document.getElementsByClassName("article-color"),
        price: document.getElementsByClassName("article-price"),
        quantity: document.getElementsByClassName("itemQuantity"),
        delete: document.getElementsByClassName("deleteItem"),
    },
    form: {
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
    },
    totalQuantity: document.getElementById("totalQuantity"),
    totalPrice: document.getElementById("totalPrice"),
}

/*********************/
/* Variables */
/*********************/

let cartArray = JSON.parse(localStorage.getItem("cart"));
// regex
let nameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\- ]+$/;
let addressRegex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
let cityRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;

/*********************/
/* Init */
/*********************/

displayCart();

/*********************/
/* Functions */
/*********************/

// génère l'affichage du panier sur la page
function displayCart() {
    getCart();

    for (let i = 0; i < cartArray.length; i++) {
        generateCartArticle();
        callApiArticle(cartArray[i].id)
            .then((articleData) => {
                setArticlesDisplay(i, articleData);
            })
            .catch((err) => {
                alert("Problème d'affichage des articles: " + err);
            })
        }
        calculateTotalArticle();
        calculateTotalPrice();        
    }

// vérifie s'il y a bien un template dans cart.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#cart__items"
function generateCartArticle() {
    if ("content" in document.createElement("template")) {
        let clone = document.importNode(retrieveElements.article.template.content, true);
        retrieveElements.article.cartItems.appendChild(clone);
    }
}

// génère l'affichage des différents articles du panier sur la page
function setArticlesDisplay(iterable, product) {
    retrieveElements.article.cartItem[iterable].setAttribute("data-id", cartArray[iterable].id);
    retrieveElements.article.cartItem[iterable].setAttribute("data-color", cartArray[iterable].color);
    retrieveElements.article.img[iterable].setAttribute("src", product.imageUrl);
    retrieveElements.article.img[iterable].setAttribute("alt", product.altTxt);
    retrieveElements.article.name[iterable].innerText = product.name;
    retrieveElements.article.color[iterable].innerText = cartArray[iterable].color;
    retrieveElements.article.price[iterable].innerText = product.price + " €";
    retrieveElements.article.quantity[iterable].setAttribute("value", cartArray[iterable].quantity);
}
// récupère le panier (cart) dans le localstorage
function getCart() {
    if (cartArray === null) {
        cartArray = [];
    }
    if (cartArray.length === 0) {
        document.getElementsByTagName("h1")[0].textContent = "Votre panier est vide";
    } else {
        document.getElementsByTagName("h1")[0].textContent = "Votre panier";
    }
    return cartArray.sort((a, b) => a.id.localeCompare(b.id));
}

// calcule le nombre total d'article
function calculateTotalArticle() {
    let totalQty = 0;
    for (let product of cartArray) {
        totalQty += product.quantity;
    }
    retrieveElements.totalQuantity.textContent = totalQty;
}

// calcule le prix total
function calculateTotalPrice() {
    callApiArticles()
    .then((jsonArticles) => {
        let totalPrice = 0;
        for (let product of cartArray) {
            let articleMatch = jsonArticles.find((p) => p._id === product.id);
            totalPrice += product.quantity * articleMatch.price;
        }
        retrieveElements.totalPrice.textContent = totalPrice;
    })
}

// formate l'affichage des messages d'erreur ou de validité
function formatInputEntrie(regex, inputTarget, errorBalise, validMsg, invalidMsg) {
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

/*********************/
/* Events */
/*********************/

// traite les cas particuliers liés à l'input (input < 1 && input > 100), calcul les totaux et sauvegarde le panier
retrieveElements.article.cartItems.addEventListener("change", (e) => {
    for (let inputQty of retrieveElements.article.quantity) {
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
            getCart();
            let targetedArticle = e.target.closest(".cart__item");
            let foundProduct = cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
            foundProduct.quantity = qty;
            calculateTotalArticle();
            calculateTotalPrice();
            saveCart(cartArray);
        }
    }
})

// traite la suppression d'un article et enregistre les modifications
retrieveElements.article.cartItems.addEventListener("click", (e) => {
    for (let deleteBtn of retrieveElements.article.delete) {
        if (e.target === deleteBtn && window.confirm("Voulez vous vraiment supprimer cet article de votre panier ?")) {
            e.preventDefault();
            cartArray = getCart();
            let targetedArticle = e.target.closest(".cart__item");
            let foundProduct = cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
            cartArray = cartArray.filter(p => p.color !== foundProduct.color || p.id !== foundProduct.id);
            retrieveElements.article.cartItems.removeChild(targetedArticle);
            calculateTotalArticle();
            calculateTotalPrice();
            saveCart(cartArray);
        }
    }
})

// traite les inputs du formulaire, et assure la validité des entrées
retrieveElements.form.container[0].addEventListener("input", function(e) {
    let input = e.target;
    let inputValue = e.target.value;
    if (input === retrieveElements.form.firstName) formatInputEntrie(nameRegex, inputValue, retrieveElements.form.firstNameErr, "Prénom valide", "Prénom invalide");
    if (input === retrieveElements.form.lastName) formatInputEntrie(nameRegex, inputValue, retrieveElements.form.lastNameErr, "Nom valide", "Nom invalide");
    if (input === retrieveElements.form.address) formatInputEntrie(addressRegex, inputValue, retrieveElements.form.addressErr, "Adresse valide", "Adresse invalide");
    if (input === retrieveElements.form.city) formatInputEntrie(cityRegex, inputValue, retrieveElements.form.cityErr, "Nom de ville valide", "Nom de ville invalide");
    if (input === retrieveElements.form.email) formatInputEntrie(emailRegex, inputValue, retrieveElements.form.emailErr, "Email valide", "email invalide, veuillez utiliser un format 'mailtest@test.fr'");
})

// traite la validation et l'envoi de la commande
retrieveElements.form.order.addEventListener("click", function(e) {
    e.preventDefault();
    if (retrieveElements.form.firstNameErr.classList.contains("valid") &&
        retrieveElements.form.lastNameErr.classList.contains("valid") &&
        retrieveElements.form.addressErr.classList.contains("valid") &&
        retrieveElements.form.cityErr.classList.contains("valid") &&
        retrieveElements.form.emailErr.classList.contains("valid") &&
        cartArray.length !== 0) {
            let contact = {
                firstName: retrieveElements.form.firstName.value,
                lastName: retrieveElements.form.lastName.value,
                address: retrieveElements.form.address.value,
                city: retrieveElements.form.city.value,
                email: retrieveElements.form.email.value
            }
            let products = cartArray.map(p => p.id);
        
            sendOrder({contact, products})
            .then(data => {
                document.location.href = "./confirmation.html?orderId=" + data.orderId;
            })
        } else {
            addMsg("Veuillez remplir correctement les champs et ne pas avoir un panier vide", document.getElementsByTagName("body")[0], "add_article--invalid");
        }
});