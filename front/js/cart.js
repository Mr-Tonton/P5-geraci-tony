// on import la fonction callApiArticle du fichier apiCalls.js
import { callApiArticle } from "./apiCalls.js/apiCalls.js";

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
let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
    calculateTotalArticle(cartArray);
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
    return cartArray.sort((a, b) => a.id.localeCompare(b.id));
}

// sauvegarde le panier (cart) dans le localstorage
function saveCart() {
    return localStorage.setItem("cart", JSON.stringify(cartArray));
}

// calcule le nombre total d'article
function calculateTotalArticle() {
    let totalQty = 0;
    for (let product of cartArray) {
        totalQty += product.quantity;
    }
    retrieveElements.totalQuantity.textContent = totalQty;
}

// formate l'affichage des messages d'erreur ou de validité
function formatInputEntrie(regex, inputTarget, errorBalise, validMsg, invalidMsg) {
    if (inputTarget === "") {
        errorBalise.textContent = "";
    } else if (regex.test(inputTarget)) {
        errorBalise.style.color = "rgb(0, 220, 0)";
        errorBalise.textContent = validMsg;
    } else {
        errorBalise.style.color = "rgb(220, 0, 0)";
        errorBalise.textContent = invalidMsg;
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
            saveCart();
        }
    }
})

// traite la suppression d'un article et enregistre les modifications
retrieveElements.article.cartItems.addEventListener("click", (e) => {
    for (let deleteBtn of retrieveElements.article.delete) {
        if (e.target === deleteBtn) {
            e.preventDefault();
            cartArray = getCart();
            let targetedArticle = e.target.closest(".cart__item");
            let foundProduct = cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
            cartArray = cartArray.filter(p => p.color !== foundProduct.color || p.id !== foundProduct.id);
            calculateTotalArticle();
            saveCart();
            location.reload();
        }
    }
})

// traite les inputs du formulaire, et assure la validité des entrées
retrieveElements.form.firstName.addEventListener("input", function (e) {
    let input = e.target.value;
    formatInputEntrie(nameRegex, input, retrieveElements.form.firstNameErr, "Prénom valide", "Prénom invalide");
})

retrieveElements.form.lastName.addEventListener("input", function (e) {
    let input = e.target.value;
    formatInputEntrie(nameRegex, input, retrieveElements.form.lastNameErr, "Nom valide", "Nom invalide");
})

retrieveElements.form.address.addEventListener("input", function (e) {
    let input = e.target.value;
    formatInputEntrie(addressRegex, input, retrieveElements.form.addressErr, "Adresse valide", "Adresse invalide");
})

retrieveElements.form.city.addEventListener("input", function (e) {
    let input = e.target.value;
    formatInputEntrie(cityRegex, input, retrieveElements.form.cityErr, "Nom de ville valide", "Nom de vile invalide");
})

retrieveElements.form.email.addEventListener("input", function (e) {
    let input = e.target.value;
    formatInputEntrie(emailRegex, input, retrieveElements.form.emailErr, "Email valide", "email invalide, veuillez utiliser un format 'mailtest@test.fr'");
})