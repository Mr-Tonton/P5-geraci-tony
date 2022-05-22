
/*********************/
/* Retrieve elements */
/*********************/

// article Elements
const articleImg = document.getElementsByClassName("item__img");
const articleTitle = document.getElementById("title");
const articlePrice = document.getElementById("price");
const articleDescription = document.getElementById("description");
const articleColors = document.getElementById("colors");

// button element
const confirmBtn = document.getElementById("addToCart");


/*********************/
    /* Variables */
/*********************/

const panierArray = [];


/*********************/
    /* Fetch API */
/*********************/

const getIdParam = () => {

    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        return search_params.get('id');
    } else {
        console.log("Erreur sur l'id du produit");
    }
}

const getArticle = () => {
    fetch("http://localhost:3000/api/products/" + getIdParam())
        .then((res) => {
            return res.json();
        })
        .then((jsonArticle) => {
            addImage(jsonArticle.imageUrl, jsonArticle.altTxt);
            addTitle(jsonArticle.name);
            addDescription(jsonArticle.description);
            addPrice(jsonArticle.price);
            addColorOptions(jsonArticle.colors);
        })
        .catch((err) => {
            console.log("impossible de trouver l'article: " + err);
        })
}


/*********************/
/* Display article in HTML */
/*********************/

const addImage = (img, alt) => {
    let divImg = document.createElement("img");
    divImg.setAttribute("src", img);
    divImg.setAttribute("alt", alt);
    articleImg[0].appendChild(divImg);
}

const addTitle = (title) => {
    articleTitle.textContent = title;
}

const addDescription = (description) => {
    articleDescription.textContent = description;
}


const addPrice = (price) => {
    articlePrice.textContent = price;
}

const addColorOptions = (colors) => {
    for (let i in colors) {
        let divOption = document.createElement("option");
        divOption.setAttribute("value", colors[i]);
        divOption.textContent = colors[i];
        articleColors.appendChild(divOption);
    }
}


/*********************/
/* Init article */
/*********************/

getArticle();



/*********************/
/* Add to localStorage */
/*********************/

confirmBtn.addEventListener("click", function(e) {
    e.preventDefault();
})







