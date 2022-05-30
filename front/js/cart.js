/*********************/
/* Retrieve elements */
/*********************/

const retrieveElements = {
    articleTemplate: document.getElementById("article-template"),
    cartItems: document.getElementById("cart__items"),
    cartItem: document.getElementsByClassName("cart__item"),
    articleImg: document.getElementsByClassName("article-img"),
    articleName: document.getElementsByClassName("article-name"),
    articleColor: document.getElementsByClassName("article-color"),
    articlePrice: document.getElementsByClassName("article-price"),
    articleQuantity: document.getElementsByClassName("itemQuantity"),
    articleDelete: document.getElementsByClassName("deleteItem"),

    totalQuantity: document.getElementById("totalQuantity"),
    totalPrice: document.getElementById("totalPrice"),
}

// Variables
let totalPrice = 0;
let cartArray = [];

// init
getCart();


/*********************/
/* Functions */
/*********************/

function getCart() {
    cartArray = getLocalStorageCart();
    if (cartArray !== null) {
        for (let i = 0; i < cartArray.length; i++) {
            generateCartArticle();
            calculateTotalArticle(cartArray);
            calculateTotalPrice(cartArray);

            fetch("http://localhost:3000/api/products/" + cartArray[i].id)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((articleData) => {
                    totalPrice += (articleData.price * cartArray[i].quantity);

                    retrieveElements.cartItem[i].setAttribute("data-id", cartArray[i].id);
                    retrieveElements.cartItem[i].setAttribute("data-color", cartArray[i].color);
                    retrieveElements.articleImg[i].setAttribute("src", articleData.imageUrl);
                    retrieveElements.articleImg[i].setAttribute("alt", articleData.altTxt);
                    retrieveElements.articleName[i].innerText = articleData.name;
                    retrieveElements.articleColor[i].innerText = cartArray[i].color;
                    retrieveElements.articlePrice[i].innerText = articleData.price + " €";
                    retrieveElements.articleQuantity[i].setAttribute("value", cartArray[i].quantity);
                })
                .catch((err) => {
                    alert("Problème d'affichage des articles: " + err);
                })
        }
    } 
}

function getLocalStorageCart() {
    return JSON.parse(localStorage.getItem("cart"));
}

function saveLocalStorageCart(array) {
    return localStorage.setItem("cart", JSON.stringify(array));
}

function generateCartArticle() {
    if ("content" in document.createElement("template")) {
        let clone = document.importNode(retrieveElements.articleTemplate.content, true);
        retrieveElements.cartItems.appendChild(clone);
    }
}

function calculateTotalArticle(cartArray) {
    let totalQty = 0;
    for (let article of cartArray) {
        totalQty += article.quantity;
        retrieveElements.totalQuantity.textContent = totalQty;
    }
}

function calculateTotalPrice(cartArray) {
    let totalPrice = 0;
    for(let article of cartArray) {
        totalPrice += article.price * article.quantity;
        retrieveElements.totalPrice.textContent = totalPrice;
    }
}

/*********************/
/* EVENTS */
/*********************/


// change quantity EVENT.
for (let i = 0; i < retrieveElements.articleQuantity.length; i++) {
    retrieveElements.articleQuantity[i].addEventListener("change", (e) => {
        let qty = Number(e.target.value);
        if (qty > 100) {
            qty = 100
            retrieveElements.articleQuantity[i].value = qty;
        }
        if (qty < 1) {
            qty = 1
            retrieveElements.articleQuantity[i].value = qty;
        }
        cartArray = getLocalStorageCart();
        let targetedArticle = e.target.closest(".cart__item");
        let foundProduct = cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
        foundProduct.quantity = qty;
        calculateTotalArticle(cartArray);
        calculateTotalPrice(cartArray);
        saveLocalStorageCart(cartArray);
})
}

// delete article EVENT.
for (let i = 0; i < retrieveElements.articleDelete.length; i++) {
    retrieveElements.articleDelete[i].addEventListener("click", (e) => {
        e.preventDefault();
        cartArray = getLocalStorageCart();
        let targetedArticle = e.target.closest(".cart__item");
        let filteredArray = [];
        let foundProduct = cartArray.find((p) => p.id === targetedArticle.dataset.id && p.color === targetedArticle.dataset.color);
        for (let i = 0; i < cartArray.length; i++) {
            if (cartArray[i].color !== foundProduct.color && cartArray[i].id !== foundProduct.color) {
                filteredArray.push(cartArray[i]);
            }
        }
        calculateTotalArticle(filteredArray);
        calculateTotalPrice(filteredArray);
        saveLocalStorageCart(filteredArray);
        location.reload();
})
}