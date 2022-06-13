import { Utils } from "./Utils.js";
import { ApiCalls } from "./ApiCalls.js";


export class Basket {
    constructor() {
    }

    // sauvegarde le panier (cart) dans le localstorage
    saveCart(cartArray) {
        return localStorage.setItem("cart", JSON.stringify(cartArray));
    }

    // récupère le panier (cart) dans le localstorage
    formatCart(cartArray) {
        if (cartArray === null) {
            cartArray = [];
        }
        return cartArray;
    }

    sortCart(cartArray) {
        return cartArray.sort((a, b) => a.id.localeCompare(b.id));
    }

    // gère l'ajout d'article et le sauvegarde sur le localstorage
    addArticleToCart(cartArray, quantityValue, colorsEntries, body) {
        let articleObject = {
            id: Utils.getUrlParam("id"),
            quantity: Number(quantityValue),
            color: colorsEntries[colors.selectedIndex].value,
        }
        this.formatCart();
        let foundProduct = cartArray.find((p) => p.id === articleObject.id && p.color === articleObject.color);
        if (foundProduct !== undefined) {
            foundProduct.quantity += articleObject.quantity;
        } else {
            cartArray.push(articleObject);
        }
        this.saveCart(cartArray);
        Utils.addMsg("Vous avez ajouté " + articleObject.quantity + " article(s) au panier", body, "add_article--valid");
    }

    // calcule le nombre total d'article
    calculateTotalArticle(cartArray, h1Location, totalQtyLocation) {
        let totalQty = 0;
        for (let product of cartArray) {
            totalQty += product.quantity;
        }

        if (totalQty === 0) {
            h1Location.textContent = "Votre panier est vide";
        } else {
            h1Location.textContent = "Votre panier";
        }
        totalQtyLocation.textContent = totalQty;
    }

    // calcule le prix total
    calculateTotalPrice(cartArray, totalPriceLocation) {
        ApiCalls.callApiArticles()
            .then((jsonArticles) => {
                let totalPrice = 0;
                for (let product of cartArray) {
                    let articleMatch = jsonArticles.find((p) => p._id === product.id);
                    totalPrice += product.quantity * articleMatch.price;
                }
                totalPriceLocation.textContent = totalPrice;
            })
    }
}