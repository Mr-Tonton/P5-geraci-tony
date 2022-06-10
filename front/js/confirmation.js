// on import la fonction getIdParam du fichier utils.js
import { getUrlParam } from "./otherTools/utils.js";

const orderIdDisplay = document.getElementById("orderId");

orderIdDisplay.textContent = getUrlParam("orderId");