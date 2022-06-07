// on import la fonction callApiArticle du fichier apiCalls.js
import { callApiArticle } from "./otherTools/apiCalls.js";
// on import la fonction getIdParam du fichier utils.js
import { getIdParam, saveCart, addMsg } from "./otherTools/utils.js";

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
    .then((articleData) => {
        setArticleDisplay(articleData);
        addColorOptions(articleData.colors);
    })
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
function formatCart() {
    if (cartArray === null) {
        cartArray = [];
    }
    return cartArray;
}

// gère l'ajout d'article et le sauvegarde sur le localstorage
function addArticleToCart() {
    let articleObject = {
        id: getIdParam(),
        quantity: Number(retrieveElements.article.quantity.value),
        color: retrieveElements.article.colors[colors.selectedIndex].value,
    }
    formatCart();
    let foundProduct = cartArray.find((p) => p.id === articleObject.id && p.color === articleObject.color);
    if (foundProduct !== undefined) {
        foundProduct.quantity += articleObject.quantity;
    } else {
        cartArray.push(articleObject);
    }
    saveCart(cartArray);
    addMsg("Vous avez ajouté " + articleObject.quantity + " article(s) au panier", retrieveElements.confirmBtn);
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

