// on import la fonction getIdParam du fichier utils.js
import { getIdParam } from "./otherTools/utils.js";

const orderIdDisplay = document.getElementById("orderId");

orderIdDisplay.textContent = getIdParam();