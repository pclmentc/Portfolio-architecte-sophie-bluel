document.addEventListener('DOMContentLoaded', (e) => {
    const urlCategories = "http://localhost:5678/api/categories";
    const urlWorks = "http://localhost:5678/api/works";
    const gallery = document.querySelector('.gallery');
    const filterContainer = document.getElementById('filters');

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
                createButton({name: "Tous", id : undefined})
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

    const createButton = (category) => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.dataset.category = category.name;
        button.textContent = category.name;
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
    function createArticleElement(project) {
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
