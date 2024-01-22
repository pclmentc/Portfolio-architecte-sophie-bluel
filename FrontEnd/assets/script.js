document.addEventListener('DOMContentLoaded', () => {
    const token = window.localStorage.getItem('token');
    const loginLogoutLink = document.querySelector('#login-logout');
    const modLink = document.querySelector('#mod');
    const editModeBanner = document.querySelector('#edit-mode-banner');
    const header = document.querySelector('#header');
    const filterContainer = document.querySelector('#filters');
    
    if (token) {
        // L'utilisateur est connecté
        loginLogoutLink.innerHTML = '<a href="#" id="logout">logout</a>';
        header.classList.add('connected');

        // la déconnexion
        const logoutLink = document.querySelector('#logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', () => {
                // supprimez le token du localStorage
                window.localStorage.removeItem('token');
                console.log("suppression de l'accès")
                // Redirigez l'utilisateur sur la page normal 
                window.location.href = 'index.html';
                // alert("Vous êtes déconnectés")
            });
        }
        // Afficher le bandeau en mode édition
        editModeBanner.classList.remove('hidden');
        modLink.classList.remove('hidden');
        filterContainer.style.visibility = 'hidden';
        
    } else {
        // L'utilisateur n'est pas connecté, laissez le texte du lien tel quel
        console.log("Utilisateur non connecté !");
        editModeBanner.classList.add('hidden');
        modLink.classList.add('hidden');
        header.classList.remove('connected');
    }

    const urlCategories = "http://localhost:5678/api/categories";
    const urlWorks = "http://localhost:5678/api/works";
    const gallery = document.querySelector('.gallery');
    // const filterContainer = document.getElementById('filters');

    let categories = [];
    
    // Fonction pour obtenir les catégories depuis l'API
    const getCategories = () => {
        fetch(urlCategories)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP, statut : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                createButton({ name: "Tous", id: undefined, selected: true })
                // Sauvegarder les catégories pour une utilisation ultérieure
                categories = data;
                // Ajout des boutons de filtre pour chaque catégorie
                categories.forEach(category => {
                    createButton(category)
                });
                // Appel initial pour afficher tous les projets
                getArticles();
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories :', error);
            });
    };
    // fonction pour la création de bouton pour les filtres
    const createButton = (category) => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.dataset.category = category.name;
        button.textContent = category.name;
        if (category.selected) {
            button.classList.add('selected');
        }
        button.addEventListener('click', (e) => {
            filterContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'))
            console.log(e)
            button.classList.add('selected')
            console.log('Filtre sélectionné :', category.name);
            getArticles(category.id);
        });
        filterContainer.appendChild(button);
    }

    // Fonction pour obtenir les articles depuis l'API en fonction de la catégorie
    const getArticles = (categoryId) => {
        fetch(urlWorks)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP, statut : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                // Suppression des travaux préexistants du HTML
                gallery.innerHTML = '';

                // Filtrage des projets par catégorie
                const filteredProjects = (!categoryId) ? data : data.filter(project => project.categoryId === categoryId);

                // Ajout des nouveaux projets filtrés à la galerie
                filteredProjects.forEach(project => {
                    const article = createArticleElement(project);
                    gallery.appendChild(article);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des projets :', error);
            });
    };

    // Fonction pour créer un élément représentant un projet
    const createArticleElement = (project) => {
        const article = document.createElement('article');

        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;

        article.appendChild(img);
        article.appendChild(figcaption);

        return article;
    }
    

    // Appel initial pour récupérer les catégories et afficher les projets
    getCategories();
});
