// Assurer que le html soit chargé avant que le script soit lancé
document.addEventListener('DOMContentLoaded', function() {
    const url = "http://localhost:5678/api/works";
    const gallery = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');

    const getArticles = () => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP, statut : ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);                

                // Ajout des nouveaux projets à la galerie
                data.forEach(project => {
                    const article = createArticleElement(project);
                    gallery.appendChild(article);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des projets :', error);
            });
    }

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

    getArticles();
});