
// verifier les entrees user
// appeler le back avec une methode post en lui passant le payload
// recuperer le token et le sauvegarder dans le localStorage ou le sessionStorage

// recuperer les entrees utilisateur (form : email et password) 
const form = document.querySelector('form');    
    form.addEventListener("submit", (event) => {        
        event.preventDefault();        
// PS : gerer les erreurs et empecher le changement de page natif du form
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log("Email:",email);
        console.log("Mot de Passe:",password);
});


