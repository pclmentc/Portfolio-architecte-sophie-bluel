// recuperer les entrees utilisateur (form : email et password) 
const form = document.querySelector('form');
const urlLogin = "http://localhost:5678/api/users/login";

form.addEventListener("submit",async (event) => {
    //  gerer les erreurs et empecher le changement de page natif du form
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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
            // Analyser la réponse JSON
            const data = await response.json();

            if (data.token) {
                // Enregistrez le token dans le localStorage
                localStorage.setItem('token', data.token);
                console.log("Token enregistré dans le localStorage");
                // Redirigez l'utilisateur vers une nouvelle page 
                window.location.href ="index.html";                 
            } else {
                console.error("Aucun token trouvé dans la réponse du serveur");
            }
        } else if (response.status === 401) {
            console.error("Non autorisé - Vérifiez vos identifiants");
            alert('Non autorisé - Vérifiez vos identifiants');
        } else if (response.status === 404) {
            console.error('Utilisateur non trouvé');
            alert('Utilisateur non trouvé');
        } else {
            console.error('Erreur inattendue:', response.statusText);
            alert('Erreur inattendue');
        }
    } catch (error) {
        console.error('Erreur lors de la requête au serveur:', error);
    }

} else {
    console.error('Email non valide');
    alert('Email non valide');
}
});