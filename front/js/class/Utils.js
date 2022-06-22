export class Utils {

    // Récupère le paramètre sélectionné de l'URL
    static getUrlParam(param) {
        let searchParams = new URLSearchParams(new URL(window.location.href).search);
        if (searchParams.has(param)) {
            return searchParams.get(param);
        } else {
            console.log("Erreur sur le paramètre du produit");
        }
    }

    // Affiche un message pop-up personnalisé.
    static addMsg(message, statusMsg) {
        let alerteDiv = document.createElement("div");
        alerteDiv.classList.add("add_article");
        alerteDiv.classList.add(statusMsg);
        alerteDiv.textContent = message;
        document.getElementsByTagName("body")[0].appendChild(alerteDiv);
        alerteDiv.classList.add("add_article_alert");
        setTimeout(() => {
            alerteDiv.classList.remove("add_article_alert");
            document.getElementsByTagName("body")[0].removeChild(alerteDiv);
        }, 6000);
    }
}