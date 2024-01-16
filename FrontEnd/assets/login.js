
// appeler le back avec une methode post en lui passant le payload
// recuperer le token et le sauvegarder dans le localStorage ou le sessionStorage



// recuperer les entrees utilisateur (form : email et password) 
const form = document.querySelector('form');

form.addEventListener("submit", (event) => {
// PS : gerer les erreurs et empecher le changement de page natif du form
    event.preventDefault();    
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

// verifier les entrees user
    let regex = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]{3,}")
    let resultat = regex.test(email);

    if (resultat) {
        console.log("Email valide :", email);
        console.log("Mot de Passe:", password);
    }        
    else {        
        console.log("Email non valide :", email);
}
});    





