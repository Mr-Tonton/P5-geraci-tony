/*********************/
/* Retrieve elements */
/*********************/

const retrieveElements = {
    // Cart articles
    articleTemplate: document.getElementById("article-template"),
    cartItems: document.getElementById("cart__items"),
    cartItem: document.getElementsByClassName("cart__item"),
    articleImg: document.getElementsByClassName("article-img"),
    articleName: document.getElementsByClassName("article-name"),
    articleColor: document.getElementsByClassName("article-color"),
    articlePrice: document.getElementsByClassName("article-price"),
    articleQuantity: document.getElementsByClassName("itemQuantity"),
    articleDelete: document.getElementsByClassName("deleteItem"),
    // Cart totals
    totalQuantity: document.getElementById("totalQuantity"),
    totalPrice: document.getElementById("totalPrice"),
    // Cart Form
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
}

// Variables
let totalPrice = 0;
let cartArray = [];
let filteredArray = [];
let nameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\- ]+$/;
let addressRegex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
let cityRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,'-]+$/;
let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

function formatInputEntrie(regex,inputTarget, errorBalise, validMsg, invalidMsg) {
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

// form input EVENT.

retrieveElements.firstName.addEventListener("input", function(e) {
    let input = e.target.value;
    formatInputEntrie(nameRegex, input, retrieveElements.firstNameErr,"Prénom valide", "Prénom invalide");
})

retrieveElements.lastName.addEventListener("input", function(e) {
    let input = e.target.value;
    formatInputEntrie(nameRegex, input, retrieveElements.lastNameErr,"Nom valide", "Nom invalide");
})

retrieveElements.address.addEventListener("input", function(e) {
    let input = e.target.value;
    formatInputEntrie(addressRegex, input, retrieveElements.addressErr,"Adresse valide", "Adresse invalide");
})

retrieveElements.city.addEventListener("input", function(e) {
    let input = e.target.value;
    formatInputEntrie(cityRegex, input, retrieveElements.cityErr,"Nom de ville valide", "Nom de vile invalide");
})

retrieveElements.email.addEventListener("input", function(e) {
    let input = e.target.value;
    formatInputEntrie(emailRegex, input, retrieveElements.emailErr,"Email valide", "email invalide, veuillez utiliser un format 'mailtest@test.fr'");
})

