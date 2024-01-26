document.addEventListener("DOMContentLoaded", () => {
  const token = window.localStorage.getItem("token");
  const loginLogoutLink = document.querySelector("#login-logout");
  const modLink = document.querySelector("#mod");
  const editModeBanner = document.querySelector("#edit-mode-banner");
  const header = document.querySelector("#header");
  const filterContainer = document.querySelector("#filters");

  if (token) {
    // L'utilisateur est connecté
    loginLogoutLink.innerHTML = '<a href="#" id="logout">logout</a>';
    header.classList.add("connected");

    // la déconnexion
    const logoutLink = document.querySelector("#logout");
    if (logoutLink) {
      logoutLink.addEventListener("click", () => {
        // supprimez le token du localStorage
        window.localStorage.removeItem("token");
        console.log("suppression de l'accès");
        // Redirigez l'utilisateur sur la page normal
        window.location.href = "index.html";
        // alert("Vous êtes déconnectés")
      });
    }

    // Afficher le bandeau en mode édition
    editModeBanner.classList.remove("hidden");
    modLink.classList.remove("hidden");
    filterContainer.style.visibility = "hidden";
  } else {
    // L'utilisateur n'est pas connecté, rien changer.
    console.log("Utilisateur non connecté !");
    editModeBanner.classList.add("hidden");
    modLink.classList.add("hidden");
    header.classList.remove("connected");
  }

  const urlCategories = "http://localhost:5678/api/categories";
  const urlWorks = "http://localhost:5678/api/works";
  const gallery = document.querySelector(".gallery");

  let categories = [];

  // Fonction pour obtenir les catégories depuis l'API
  const getCategories = () => {
    fetch(urlCategories)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP, statut : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        createButton({ name: "Tous", id: undefined, selected: true });
        // Sauvegarder les catégories pour une utilisation ultérieure
        categories = data;
        // Ajout des boutons de filtre pour chaque catégorie
        categories.forEach((category) => {createButton(category);
           });
        // Appel initial pour afficher tous les projets
        getArticles();
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
      });
  };
  // fonction pour la création de bouton pour les filtres
  const createButton = (category) => {
    const button = document.createElement("button");
    button.classList.add("filter-btn");
    button.dataset.category = category.name;
    button.textContent = category.name;
    if (category.selected) {
      button.classList.add("selected");
    }
    button.addEventListener("click", (e) => {
      filterContainer
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.remove("selected"));
      console.log(e);
      button.classList.add("selected");
      console.log("Filtre sélectionné :", category.name);
      getArticles(category.id);
    });
    filterContainer.appendChild(button);
  };

  // Fonction pour obtenir les articles depuis l'API en fonction de la catégorie
  const getArticles = (categoryId) => {
    fetch(urlWorks)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP, statut : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Suppression des travaux préexistants du HTML
        gallery.innerHTML = "";

        // Filtrage des projets par catégorie
        const filteredProjects = !categoryId
          ? data
          : data.filter((project) => project.categoryId === categoryId);

        // Ajout des nouveaux projets filtrés à la galerie
        filteredProjects.forEach((project) => {
          const article = createArticleElement(project);
          gallery.appendChild(article);
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des projets :", error);
      });
  };

  // Fonction pour créer un élément représentant un projet
  const createArticleElement = (project) => {
    const article = document.createElement("article");

    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;

    article.appendChild(img);
    article.appendChild(figcaption);

    return article;
  };

  // Appel initial pour récupérer les catégories et afficher les projets
  getCategories();

  // Modale------------------------------------------------------------------------------------ //

  const btn = document.querySelector("#mod");
  let modalStep = 0;
  const categoryMap = { Objets: 1, Appartements: 2, Hotels_Restaurants: 3 };

  btn.addEventListener("click", () => {
    UpdateModal();
  });

  function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  }

  function UpdateModal() {
    if (document.querySelector(".modal"))
      document.querySelector(".modal").remove();
    const modal = createElement("div", "modal");
    const modalContent = createElement("div", "modal-content");    

    const modalBtn = createElement("button", modalStep === 0 ? "next-btn" : "previous-btn");
    if (modalStep === 0) {
      modalBtn.textContent = "Ajouter une photo";       
          

    } else {
      const iconNext = createElement("i", "fas",null);
      iconNext.classList.add("fa-arrow-left");
      modalBtn.appendChild(iconNext);
    }      
    
modalBtn.addEventListener("click", () => {
  modalStep += modalStep === 0 ? 1 : -1;
  UpdateModal();
});

const modalClose = createElement("button", "close-btn", null);
const iconClose = createElement("i", "fas", null);
iconClose.classList.add("fa-close");
modalClose.appendChild(iconClose);
modalClose.addEventListener("click", () => {
  document.querySelector(".modal").remove();
  modalStep = 0;
});

switch (modalStep) {
  case 0:
    modalContent.appendChild(
      createElement("h1", "modal-title", "Galerie photo")
    );

    // Ajouter ici la section pour afficher tous les img
    const allImages = document.createElement("div");
    allImages.classList.add("all-images");

    // Appeler la fonction pour obtenir tous les img
    getAllImages(allImages);

    modalContent.appendChild(allImages);
    modalContent.appendChild(createElement("hr", "modal-text", ""));
    break;

  case 1:
    modalContent.appendChild(createElement("h1", "modal-title", "Ajout photo")); 
    // Ajouter une image par défaut
    const defaultImage = createElement("img", "default-image");
    defaultImage.src = "./assets/icons/fichier_emplacement.svg";    

    modalContent.appendChild(defaultImage);   
    modalContent.appendChild(createElement("input", "modal-input", null)).type = "file";
    modalContent.appendChild(createElement("h1", "file-title", "Titre"));
    modalContent.appendChild(createElement("input", "modal-input", null)).placeholder = "";
    modalContent.appendChild(createElement("h1", "file-title", "Catégorie"));
    const modalSelectCategory = createElement("select", "modal-input");

    // Ajouter la première option par défaut avec le titre "Catégorie"
    const defaultOption = createElement("option");
    defaultOption.value = "";
    defaultOption.text = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    modalSelectCategory.appendChild(defaultOption);

    for (const category in categoryMap) {
      const option = createElement("option");
      option.value = categoryMap[category];
      option.textContent = category;
      modalSelectCategory.appendChild(option);
    }
    modalContent.appendChild(modalSelectCategory);
    modalContent.appendChild(createElement("hr", "modal-text", ""));
    modalContent.appendChild(createElement("button", "modalValid","Valider"));        
    break;

  default:
    document.querySelector(".modal").remove();
    modalStep = 0;
    break;
}

modalContent.appendChild(modalBtn);
modalContent.appendChild(modalClose);
modal.appendChild(modalContent);
document.body.appendChild(modal);
}

const validateButton = createElement("button", "modalValid", "Valider");

// Fonction pour obtenir toutes les images
const getAllImages = (container) => {
  fetch(urlWorks)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP, statut : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Ajout des nouvelles images à la section
      data.forEach((project) => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        imgContainer.appendChild(img);

        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-trash-can");

        icon.addEventListener("click", () => {
          console.log("ID du projet sélectionné pour suppression :",project.id);
          // Message de confirmation
          const confirmation = window.confirm(
            "Êtes-vous sûr de vouloir supprimer cet article?"
          );
          if (confirmation) {
            console.log("ID du projet sélectionné pour suppression :",project.id);
            // Appel de la fonction pour supprimer l'article en utilisant l'ID du projet
            deleteArticle(project.id);
          }
        });

        imgContainer.appendChild(icon);
        container.appendChild(imgContainer);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
    });
};
// Fonction pour supprimer un article en utilisant son ID
const deleteArticle = (articleId) => {  
  // Vérifier si le token est valide
  const token = window.localStorage.getItem("token");

  if (!token) {
    console.error("Token non valide. L'utilisateur n'est pas authentifié.");
    return;
  }
  console.log("Suppression de l'article avec l'ID :", articleId);

  const deleteUrl = `http://localhost:5678/api/works/${articleId}`;

  fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP, statut : ${response.status}`);
      }
      // Actualisez la galerie après la suppression si nécessaire
      getArticles();
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'article :", error);
    });
};
});
