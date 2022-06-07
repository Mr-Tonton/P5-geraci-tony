/*********************/
/* Utils */
/*********************/

// récupère le paramètre id passé dans l'url
export function getIdParam() {
    let url = new URL(window.location.href);
    let search_params = new URLSearchParams(url.search);
    if (search_params.has('id')) {
        return search_params.get('id');
    } else {
        console.log("Erreur sur l'id du produit");
    }
}

// sauvegarde le panier (cart) dans le localstorage
export function saveCart(cart) {
    return localStorage.setItem("cart", JSON.stringify(cart));
}

// affiche le message d'ajout au panier avec le nombre d'article ajouté.
export function addMsg(message, elementLocation) {
    let alerteDiv = document.createElement("div");
    let alerteMsg = document.createElement("p");
    alerteDiv.classList.add("add_article");
    alerteMsg.textContent = message;
    elementLocation.appendChild(alerteDiv);
    alerteDiv.appendChild(alerteMsg);
    alerteDiv.classList.add("add_article_alert");
    setTimeout(() => {
        alerteDiv.classList.remove("add_article_alert");
        elementLocation.removeChild(alerteDiv);
    }, 6000);
}