import { Utils } from "./class/Utils.js";

class Confirmation {
    constructor() {
        this.orderIdDisplay = document.getElementById("orderId");
        this.displayOrder();
    }
    
    // Affiche la commande avec son numéro associé
    displayOrder() {
        this.orderIdDisplay.textContent = Utils.getUrlParam("orderId");
    }
}

new Confirmation();