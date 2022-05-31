/*********************/
/* Retrieve elements */
/*********************/

// objet regroupant l'ensemble des récupérations sur le DOM
const retrieveElements = {
    // article elements
    articleImg: document.getElementsByClassName("item__img"),
    articleTitle: document.getElementById("title"),
    articlePrice: document.getElementById("price"),
    articleDescription: document.getElementById("description"),
    articleColors: document.getElementById("colors"),
    articleQuantity: document.getElementById("quantity"),
    // button element
    confirmBtn: document.getElementById("addToCart"),
}

/*********************/
/* Variables */
/*********************/

let cartArray = [];
let articleObject = {};


/*********************/
/* Initialize API call */
/*********************/

getArticle();


/*********************/
/* Fetch API function */
/*********************/


// récupère les infos relatives à l'article ciblé (via id) et affiche l'objet
function getArticle() {
    fetch("http://localhost:3000/api/products/" + getIdParam())
        .then((res) => {
            return res.json();
        })
        .then((jsonArticle) => {
            // init quantity to 1
            retrieveElements.confirmBtn.setAttribute("href", "./index.html");
            retrieveElements.articleQuantity.value = 1;

            displayArticle(jsonArticle.imageUrl, jsonArticle.altTxt, jsonArticle.name, jsonArticle.description, jsonArticle.price, jsonArticle.colors);
            addColorOptions(jsonArticle.colors);

        })
        .catch((err) => {
            alert("impossible de trouver l'article: " + err);
        })
}


/*********************/
/* Functions */
/*********************/

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
function displayArticle(img, alt, title, description, price) {
    let divImg = document.createElement("img");
    divImg.setAttribute("src", img);
    divImg.setAttribute("alt", alt);
    retrieveElements.articleImg[0].appendChild(divImg);
    retrieveElements.articleTitle.textContent = title;
    retrieveElements.articleDescription.textContent = description;
    retrieveElements.articlePrice.textContent = price;
}

// traite le cas particulier de la couleur (tableau de couleurs) et affiche les différents choix de couleurs
function addColorOptions(colors) {
    for (let i in colors) {
        let divOption = document.createElement("option");
        divOption.setAttribute("value", colors[i]);
        divOption.textContent = colors[i];
        retrieveElements.articleColors.appendChild(divOption);
    }
}

// gère le formatage de l'objet panier et le sauvegarde sur le localstorage
function setCartForLocalStorage() {
    articleObject = {
        id: getIdParam(),
        quantity: Number(retrieveElements.articleQuantity.value),
        color: retrieveElements.articleColors[colors.selectedIndex].value,
    }
    
    if (localStorage.getItem("cart") === null) {
        cartArray.push(articleObject);
        saveLocalStorageCart();
    } else {
        let cartFromStorage = localStorage.getItem("cart");
        cartArray = JSON.parse(cartFromStorage);
        localStorage.removeItem("cart");
        let foundProduct = cartArray.find((p) => p.id === articleObject.id && p.color === articleObject.color);
        if (foundProduct !== undefined) {
            foundProduct.quantity += articleObject.quantity;
        } else {
            cartArray.push(articleObject);
        }
        cartArray.sort((a, b) => a.id.localeCompare(b.id));
        saveLocalStorageCart();
    }
}

// sauvegarde le panier (cart) dans le localstorage
function saveLocalStorageCart() {
    return localStorage.setItem("cart", JSON.stringify(cartArray));
}


/*********************/
/* Events */
/*********************/

// traite les cas particuliers liés à l'input (input < 1 && input > 100)
retrieveElements.articleQuantity.addEventListener("input", function (e) {
    let inputValue = e.target.value;
    if (inputValue > 100) {
        retrieveElements.articleQuantity.value = 100;
    }
    if (inputValue < 1) {
        retrieveElements.articleQuantity.value = 1;
    }
})

// traite le cas particulier d'une couleur non sélectionnée. Si valide, envoie l'objet cart sur le localstorage et retourne à la page d'accueil
retrieveElements.confirmBtn.addEventListener("click", function () {
    if (retrieveElements.articleQuantity.value === "0" ||
        retrieveElements.articleColors[colors.selectedIndex].value === "") {
        return alert("veuillez selectionner une couleur");
    }
    setCartForLocalStorage();
    window.location.replace("./index.html");
})

