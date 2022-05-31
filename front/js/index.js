/*********************/
/* Retrieve elements */
/*********************/

// objet regroupant l'ensemble des récupérations sur le DOM
const retrieveElements = {
    items: document.getElementById("items"),
    articleTemplate: document.getElementById("article-template"),
    articleLink: document.getElementsByClassName("article-link"),
    articleImg: document.getElementsByClassName("article-img"),
    productName: document.getElementsByClassName("productName"),
    productDescription: document.getElementsByClassName("productDescription"),
}

/*********************/
/* Fetch API function */
/*********************/

// récupère l'ensemble des articles de l'api via fetch, et les affiche sur la page
function getArticles() {
    fetch("http://localhost:3000/api/products")
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((jsonListArticle) => {
            for (let i = 0; i < jsonListArticle.length; i++) {
                generateArticle();
                retrieveElements.articleLink[i].setAttribute("href", "./product.html?id=" + jsonListArticle[i]._id);
                retrieveElements.articleImg[i].setAttribute("src", jsonListArticle[i].imageUrl);
                retrieveElements.articleImg[i].setAttribute("alt", jsonListArticle[i].altTxt);
                retrieveElements.productName[i].textContent = jsonListArticle[i].name;
                retrieveElements.productDescription[i].textContent = jsonListArticle[i].description;
            }
        })
        .catch((error) => {
            alert("Désolé, nous n'arrivons pas à accéder à la liste d'articles : " + error);
        })
}


/*********************/
/* Display in html */
/*********************/

// vérifie s'il y a bien un template dans index.html. S'il est présent crée un clone de ce template et l'insère dans la div parent "#items"
function generateArticle() {
    if ("content" in document.createElement("template")) {
        let clone = document.importNode(retrieveElements.articleTemplate.content, true);
        retrieveElements.items.appendChild(clone);
    }
}

/*********************/
/* Initialize API call */
/*********************/

getArticles();