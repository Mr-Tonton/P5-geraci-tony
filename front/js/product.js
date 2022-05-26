
/*********************/
/* Retrieve elements */
/*********************/

// article Elements
const retrieveElements = {
    articleImg: document.getElementsByClassName("item__img"),
    articleTitle: document.getElementById("title"),
    articlePrice: document.getElementById("price"),
    articleDescription: document.getElementById("description"),
    articleColors: document.getElementById("colors"),
    // button element
    confirmBtn: document.getElementById("addToCart"),
}


/*********************/
/* Variables */
/*********************/

const cartArray = [];


/*********************/
/* Fetch API */
/*********************/

function getIdParam() {

    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        return search_params.get('id');
    } else {
        console.log("Erreur sur l'id du produit");
    }
}

function getArticle() {
    fetch("http://localhost:3000/api/products/" + getIdParam())
        .then((res) => {
            return res.json();
        })
        .then((jsonArticle) => {
            displayArticle(jsonArticle.imageUrl, jsonArticle.altTxt, jsonArticle.name, jsonArticle.description, jsonArticle.price, jsonArticle.colors);
            addColorOptions(jsonArticle.colors);
        })
        .catch((err) => {
            alert("impossible de trouver l'article: " + err);
        })
}


/*********************/
/* Display article in HTML */
/*********************/

function displayArticle(img, alt, title, description, price) {
    let divImg = document.createElement("img");
    divImg.setAttribute("src", img);
    divImg.setAttribute("alt", alt);
    retrieveElements.articleImg[0].appendChild(divImg);
    retrieveElements.articleTitle.textContent = title;
    retrieveElements.articleDescription.textContent = description;
    retrieveElements.articlePrice.textContent = price;
}

function addColorOptions (colors) {
    for (let i in colors) {
        let divOption = document.createElement("option");
        divOption.setAttribute("value", colors[i]);
        divOption.textContent = colors[i];
        retrieveElements.articleColors.appendChild(divOption);
    }
}


/*********************/
/* Init article */
/*********************/

getArticle();


/*********************/
/* Add to localStorage */
/*********************/

confirmBtn.addEventListener("click", function (e) {
    e.preventDefault();
})







