/*********************/
/* Retrieve elements */
/*********************/

const retrieveElements = {
    items : document.getElementById("items"),
    articleTemplate : document.getElementById("article-template"),
    articleLink : document.getElementsByClassName("article-link"),
    articleImg : document.getElementsByClassName("article-img"),
    productName : document.getElementsByClassName("productName"),
    productDescription : document.getElementsByClassName("productDescription"),
}

/*********************/
/* Fetch API */
/*********************/


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