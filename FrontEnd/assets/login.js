// recuperer les entrees utilisateur (form : email et password) 
const form = document.querySelector('form');
const urlLogin = "http://localhost:5678/api/users/login";

// Récupérer le token au chargement de la page, si déjà authentifié
const token = window.localStorage.getItem('token');

form.addEventListener("submit", async (event) => {
    //  gerer les erreurs et empecher le changement de page natif 
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // verifier les entrees user
    let regex = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]{4,}\\.[a-z0-9._-]{3,}")
    let resultat = regex.test(email);

    if (resultat) {
        console.log("Email valide :", email);
        console.log("Mot de Passe:", password);

        // appeler le back avec une methode post en lui passant le payload
        try {
            const response = await fetch(urlLogin, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Réponse du serveur:", data);

                if (data.token) {
                    // Enregistrez le token dans le localStorage
                    window.localStorage.setItem('token', data.token);
                    console.log("Token enregistré dans le localStorage");

                    // Redirigez l'utilisateur vers une nouvelle page
                    // alert('Vous êtes connectés.');
                    window.location.href = "index.html";


                } else {
                    console.error("Aucun token trouvé dans la réponse du serveur");
                }
            } else {
                // Gérer les erreurs
                handleError(response.status);
            }

        } catch (error) {
            console.error('Erreur lors de la requête au serveur:', error);
        }

    } else {
        console.error('Email ou mot de passe non valide');
        // alert('Email ou mot de passe non valide');
    }
});

// Fonction pour gérer les erreurs
function handleError(status) {
    switch (status) {
        case 401:
            console.error("Non autorisé");
            // alert('Non autorisé - Vérifiez vos identifiants');
            break;
        case 404:
            console.error('Utilisateur non trouvé');
            // alert('Utilisateur non trouvé');
            break;
        default:
            console.error('Erreur inattendue:', status);
            // alert('Erreur inattendue');
            break;
    }
}