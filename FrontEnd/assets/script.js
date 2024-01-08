const apiCategories = 'http://localhost:5678/api/categories';
const apiContenu = 'http://localhost:5678/api/works';

fetch(apiCategories)
    .then(response => {
        // Vérification de la réussite de la requête (status 200 OK)
        if (!response.ok) {
            throw new Error(`Erreur HTTP, statut : ${response.status}`);
        }
        // Conversion de la réponse en JSON
        return response.json();
    })
    .then(data => {
        // Affichage du résultat dans la console
        console.log('Réponse de l\'API :', data);

        // Vous pouvez également effectuer d'autres opérations avec les données ici
    })
    .catch(error => {
        // Gestion des erreurs
        console.error('Erreur lors de la requête :', error);
    });

fetch(apiContenu)
    .then(response => {
        // Vérification de la réussite de la requête (status 200 OK)
        if (!response.ok) {
            throw new Error(`Erreur HTTP, statut : ${response.status}`);
        }
        // Conversion de la réponse en JSON
        return response.json();
    })
    .then(data => {
        // Affichage du résultat dans la console
        console.log('Réponse de l\'API :', data);

        // Vous pouvez également effectuer d'autres opérations avec les données ici
    })
    .catch(error => {
        // Gestion des erreurs
        console.error('Erreur lors de la requête :', error);
    });