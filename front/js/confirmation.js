import { Utils } from "./class/Utils.js";

class Confirmation {
    constructor() {
        this.orderIdDisplay = document.getElementById("orderId");
    }
    init() {
        this.orderIdDisplay.textContent = Utils.getUrlParam("orderId");
    }
}

const confirmation = new Confirmation();
confirmation.init();