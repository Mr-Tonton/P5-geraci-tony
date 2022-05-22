/*********************/
/* Retrieve elements */
/*********************/

const items = document.getElementById("items");


/*********************/
/* Fetch API */
/*********************/


const getArticles = () => {
    fetch("http://localhost:3000/api/products")
    .then((res) => {
        return res.json();
    })
    .then((jsonListArticle) => {
        for (let article of jsonListArticle) {
            displayArticles(items, article._id, article.imageUrl, article.altText, article.name, article.description);
        }
    })
    .catch((error) => {
        console.log("Désolé, nous n'arrivons pas à accéder à la liste d'articles : " + error);
    })
}


/*********************/
/* Display in html */
/*********************/


const displayArticles = (items, id, image, alt, name, description) => {
    items.innerHTML += `<a href="./product.html?id=${id}">
    <article>
      <img src="${image}" alt="${alt}">
      <h3 class="productName">Kanap ${name}</h3>
      <p class="productDescription">${description}</p>
    </article>
  </a>`
}

getArticles();