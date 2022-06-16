import { Utils } from "./Utils.js";
import { ApiCalls } from "./ApiCalls.js";


export class Basket {
    constructor() {
        if (self.instance) {
            throw new Error();
        }

        this.cartArray = JSON.parse(localStorage.getItem("cart"));
    }

    // Sauvegarde le panier (cart) dans le localstorage
    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.cartArray));
    }

    // Récupère le panier (cart) dans le localstorage
    formatCart() {
        if (this.cartArray === null) {
            this.cartArray = [];
        }
    }

    // Tri le panier (cart) par ID
    sortCart() {
        this.cartArray = this.cartArray.sort((a, b) => a.id.localeCompare(b.id));
    }

    // Gère l'ajout d'article et le sauvegarde dans le localstorage
    addArticleToCart(quantityValue, colorsEntries) {
        this.formatCart();
        let articleObject = {
            id: Utils.getUrlParam("id"),
            quantity: Number(quantityValue),
            color: colorsEntries[colors.selectedIndex].value,
        }
        let foundProduct = this.cartArray.find((p) => p.id === articleObject.id && p.color === articleObject.color);
        if (foundProduct !== undefined) {
            foundProduct.quantity += articleObject.quantity;
        } else {
            this.cartArray.push(articleObject);
        }
        this.saveCart();
    }

    // Calcule le nombre total d'article et l'affiche
    calculateTotalArticle(totalQtyLocation) {
        let totalQty = 0;
        for (let product of this.cartArray) {
            totalQty += product.quantity;
        }
        totalQtyLocation.textContent = totalQty;
    }

    // Calcule le prix total et l'affiche
    calculateTotalPrice(totalPriceLocation) {
        ApiCalls.get()
            .then((jsonArticles) => {
                let totalPrice = 0;
                for (let product of this.cartArray) {
                    let articleMatch = jsonArticles.find((p) => p._id === product.id);
                    totalPrice += product.quantity * articleMatch.price;
                }
                totalPriceLocation.textContent = totalPrice;
            })
    }

    // Permet de respecter le design pattern "Singleton", instanciation de la classe une seule fois
    static get() {
        if (!self.instance) {
            self.instance = new Basket();
        }

        return self.instance;
    }
}