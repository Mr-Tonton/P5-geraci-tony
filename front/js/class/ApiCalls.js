export class ApiCalls {

    // Retourne l'url de base de l'api
    static url = () => {
        return "http://localhost:3000/api/products/";
    }

    // Requête de type "GET" via fetch pour récupérer le ou les articles
    static get = (path = "") => {
        return fetch(this.url() + path)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
    }

    // Requête de type "POST" via fetch pour envoyer les infos de la commande et retourne l'idOrder
    static post = (order, path = "") => {
        return fetch(this.url() + path ,  {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order),
        })
            .then(res => res.json())
    }
}