/*********************/
/* Fetch API function */
/*********************/

// récupère l'ensemble des articles de l'api via fetch
export function callApiArticles() {
    return fetch("http://localhost:3000/api/products")
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .catch((error) => {
            alert("Désolé, nous n'arrivons pas à accéder à la liste d'articles : " + error);
        })
}

// récupère les infos de l'article sélectionné via l'api
export function callApiArticle(id) {
    return fetch("http://localhost:3000/api/products/" + id)
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            alert("impossible de trouver l'article: " + err);
        })
}

