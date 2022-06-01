// on import la fonction callApiArticle du fichier apiCalls.js
import { callApiArticle } from "./apiCalls.js/apiCalls.js";

/*********************/
/* Retrieve elements */
/*********************/

// objet regroupant l'ensemble des récupérations sur le DOM
const retrieveElements = {
    confirmBtn: document.getElementById("addToCart"),
    article: {
        img: document.getElementsByClassName("item__img"),
        title: document.getElementById("title"),
        price: document.getElementById("price"),
        description: document.getElementById("description"),
        colors: document.getElementById("colors"),
        quantity: document.getElementById("quantity"),
        alert: document.getElementById("add_article_message"),
        numberDisplay: document.getElementById("numberOfArticle"),

    },
}

/*********************/
/* Variables */
/*********************/

let cartArray = JSON.parse(localStorage.getItem("cart"));
let msgDelay = 6000;

/*********************/
/* Init */
/*********************/

displayArticle();

/*********************/
/* Functions */
/*********************/

// génère l'affichage de l'article sur la page
function displayArticle() {
    callApiArticle(getIdParam())
    .then((jsonArticle) => {
        setArticleDisplay(jsonArticle);
        addColorOptions(jsonArticle.colors);
    })
}

// récupère l'id de l'article via les paramètres de l'URL
function getIdParam() {
    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        return search_params.get('id');
    } else {
        console.log("Erreur sur l'id du produit");
    }
}

// traite l'affichage sur la page product.html de l'article
function setArticleDisplay(article) {
    let divImg = document.createElement("img");
    divImg.setAttribute("src", article.imageUrl);
    divImg.setAttribute("alt", article.altTxt);
    retrieveElements.article.img[0].appendChild(divImg);
    retrieveElements.article.title.textContent = article.name;
    retrieveElements.article.description.textContent = article.description;
    retrieveElements.article.price.textContent = article.price;
    // on initialise l'input a 1
    retrieveElements.article.quantity.value = 1;
}

// traite le cas particulier de la couleur (tableau de couleurs) et affiche les différents choix de couleurs
function addColorOptions(colors) {
    for (let i in colors) {
        let divOption = document.createElement("option");
        divOption.setAttribute("value", colors[i]);
        divOption.textContent = colors[i];
        retrieveElements.article.colors.appendChild(divOption);
    }
}

// récupère le panier (cart) dans le localstorage
function getCart() {
    if (cartArray === null) {
        cartArray = [];
    }
    return cartArray;
}

// sauvegarde le panier (cart) dans le localstorage
function saveCart() {
    return localStorage.setItem("cart", JSON.stringify(cartArray));
}

// gère l'ajout d'article et le sauvegarde sur le localstorage
function addArticleToCart() {
    let articleObject = {
        id: getIdParam(),
        quantity: Number(retrieveElements.article.quantity.value),
        color: retrieveElements.article.colors[colors.selectedIndex].value,
    }
    getCart();
    let foundProduct = cartArray.find((p) => p.id === articleObject.id && p.color === articleObject.color);
    if (foundProduct !== undefined) {
        foundProduct.quantity += articleObject.quantity;
    } else {
        cartArray.push(articleObject);
    }
    saveCart();
    addArticleMsg(articleObject);
}

// affiche le message d'ajout au panier avec le nombre d'article ajouté.
function addArticleMsg(article) {
    retrieveElements.article.numberDisplay.textContent = article.quantity;
    retrieveElements.article.alert.classList.add("add_article_alert");
    setTimeout(() => {
        retrieveElements.article.alert.classList.remove("add_article_alert");
    }, msgDelay);
    
}

/*********************/
/* Events */
/*********************/

// traite les cas particuliers liés à l'input (input < 1 && input > 100)
retrieveElements.article.quantity.addEventListener("input", function (e) {
    let inputValue = e.target.value;
    if (inputValue > 100) {
        retrieveElements.article.quantity.value = 100;
    }
    if (inputValue < 1) {
        retrieveElements.article.quantity.value = 1;
    }
})

// traite le cas particulier d'une couleur non sélectionnée. Si valide, envoie le panier sur le localstorage
retrieveElements.confirmBtn.addEventListener("click", function () {
    if (retrieveElements.article.colors[colors.selectedIndex].value === "") {
        return alert("veuillez selectionner une couleur");
    }
    addArticleToCart();
})

