// Récupérer les données depuis localStorage
function readTasks() {
  const stored = localStorage.getItem("todoTasks");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Erreur JSON.parse(todoTasks) :", e);
    return [];
  }
}

// Sauvegarder les tâches dans localStorage
function saveTasks(tasks) {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Supprimer une tâche par son ID
function deleteTask(idTache) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
    const tasks = readTasks();
    const updatedTasks = tasks.filter(task => task.idTache !== idTache);
    saveTasks(updatedTasks);
    loadTasks(); // Recharger le tableau
  }
}

function editTask(idTache) {
  // Stocker l'ID de la tâche à modifier
  localStorage.setItem("editTaskId", idTache);
  
  // Rediriger vers le formulaire
  window.location.href = "index.html";
}

// Trouver le libellé d'une priorité par son ID
function getPrioriteLabel(idPriorite) {
  const priorite = listePriorites.find(p => p.idPriorite === idPriorite);
  return priorite ? priorite.priorite : "Inconnue";
}

// Trouver le libellé d'un statut par son ID
function getStatutLabel(idStatut) {
  const statut = listeStatuts.find(s => s.idStatut === idStatut);
  return statut ? statut.statut : "Inconnu";
}

// Trouver le libellé d'une catégorie par son ID
function getCategorieLabel(idCategorie) {
  const categorie = listeCategories.find(c => c.idCategorie === idCategorie);
  return categorie ? categorie.categorie : "Inconnue";
}

// Changer le statut d'une tâche
function changeStatus(idTache, newIdStatut) {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.idTache === idTache);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].idStatut = newIdStatut;
    saveTasks(tasks);
    loadTasks(); // Recharger le tableau
  }
}

// Charger et afficher les tâches dans le tableau
function loadTasks() {
  const tasks = readTasks();
  const tbody = document.getElementById("tasksTbody");
  const emptyMsg = document.getElementById("emptyMsg");

  if (!tbody) return;

  // Vider le tableau
  tbody.innerHTML = "";

  if (tasks.length === 0) {
    emptyMsg.textContent = "Aucune tâche enregistrée pour le moment.";
    emptyMsg.style.color = "#666";
    return;
  }

  emptyMsg.textContent = "";

  // Créer une ligne pour chaque tâche
  tasks.forEach(task => {
    const row = document.createElement("tr");

    // Colonne Titre
    const tdTitle = document.createElement("td");
    tdTitle.textContent = task.libelle;
    row.appendChild(tdTitle);

    // Colonne Priorité
    const tdPriorite = document.createElement("td");
    tdPriorite.textContent = getPrioriteLabel(task.idPriorite);
    row.appendChild(tdPriorite);

    // Colonne Catégorie
    const tdCategorie = document.createElement("td");
    tdCategorie.textContent = getCategorieLabel(task.idCategorie);
    row.appendChild(tdCategorie);

    // Colonne Date création
    const tdDateCreation = document.createElement("td");
    tdDateCreation.textContent = task.dateCreation;
    row.appendChild(tdDateCreation);

    // Colonne Date échéance
    const tdDateEcheance = document.createElement("td");
    tdDateEcheance.textContent = task.dateEcheance;
    row.appendChild(tdDateEcheance);

    // Colonne Statut
    const tdStatut = document.createElement("td");
    
    // Créer un bouton pour chaque statut
    listeStatuts.forEach(statut => {
      const btn = document.createElement("button");
      btn.textContent = statut.statut;
      
      // Si c'est le statut actuel, le griser
      if (task.idStatut === statut.idStatut) {
        btn.classList.add("status-active");
        btn.disabled = true;
      } else {
        btn.onclick = () => changeStatus(task.idTache, statut.idStatut);
      }
      
      tdStatut.appendChild(btn);
    });

    row.appendChild(tdStatut);

    // Colonne Actions (MODIFIER + SUPPRIMER)
    const tdActions = document.createElement("td");
    tdActions.classList.add("actions-column");
    
    // Bouton Modifier
    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifier";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => editTask(task.idTache);
    
    // Bouton Supprimer
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteTask(task.idTache);
    
    // Ajouter les boutons dans un conteneur
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    
    tdActions.appendChild(btnContainer);
    row.appendChild(tdActions);

    tbody.appendChild(row);
  });

}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

// Fonction de tri
function sortTasks() {
  const sortSelect = document.getElementById("sortSelect");
  if (!sortSelect) return;
  
  const sortValue = sortSelect.value;
  let tasks = readTasks();
  
  if (sortValue === "all") {
    loadSortedTasks(tasks); // Afficher toutes les tâches
    return;
  }
  
  if (sortValue.startsWith("status-")) {
    const statusId = sortValue.split("-")[1]; // Récupérer "1", "2" ou "3"
    const filteredTasks = tasks.filter(task => task.idStatut === statusId);
    loadSortedTasks(filteredTasks);
    return;
  }
  
  if (sortValue === "priority") {
    // Trier par priorité (1 = très urgente → 5 = optionnelle)
    const sortedTasks = [...tasks].sort((a, b) => {
      return parseInt(a.idPriorite) - parseInt(b.idPriorite);
    });
    loadSortedTasks(sortedTasks);
    return;
  }
  
  if (sortValue === "date") {
    // Trier par date d'échéance (plus proche en premier)
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.dateEcheance || '9999-12-31');
      const dateB = new Date(b.dateEcheance || '9999-12-31');
      return dateA - dateB;
    });
    loadSortedTasks(sortedTasks);
    return;
  }
}

// Charger les tâches triées (version modifiée de loadTasks)
function loadSortedTasks(tasks) {
  const tbody = document.getElementById("tasksTbody");
  const emptyMsg = document.getElementById("emptyMsg");

  if (!tbody) return;

  // Vider le tableau
  tbody.innerHTML = "";

  if (tasks.length === 0) {
    emptyMsg.textContent = "Aucune tâche correspondante.";
    emptyMsg.style.color = "#666";
    return;
  }

  emptyMsg.textContent = "";

  // Créer une ligne pour chaque tâche
  tasks.forEach(task => {
    const row = document.createElement("tr");

    // Colonne Titre
    const tdTitle = document.createElement("td");
    tdTitle.textContent = task.libelle;
    row.appendChild(tdTitle);

    // Colonne Priorité
    const tdPriorite = document.createElement("td");
    tdPriorite.textContent = getPrioriteLabel(task.idPriorite);
    row.appendChild(tdPriorite);

    // Colonne Catégorie
    const tdCategorie = document.createElement("td");
    tdCategorie.textContent = getCategorieLabel(task.idCategorie);
    row.appendChild(tdCategorie);

    // Colonne Date création
    const tdDateCreation = document.createElement("td");
    tdDateCreation.textContent = task.dateCreation;
    row.appendChild(tdDateCreation);

    // Colonne Date échéance
    const tdDateEcheance = document.createElement("td");
    tdDateEcheance.textContent = task.dateEcheance;
    row.appendChild(tdDateEcheance);

    // Colonne Statut
    const tdStatut = document.createElement("td");
    
    // Créer un bouton pour chaque statut
    listeStatuts.forEach(statut => {
      const btn = document.createElement("button");
      btn.textContent = statut.statut;
      
      // Si c'est le statut actuel, le griser
      if (task.idStatut === statut.idStatut) {
        btn.classList.add("status-active");
        btn.disabled = true;
      } else {
        btn.onclick = () => changeStatus(task.idTache, statut.idStatut);
      }
      
      tdStatut.appendChild(btn);
    });

    row.appendChild(tdStatut);

    // Colonne Actions
    const tdActions = document.createElement("td");
    tdActions.classList.add("actions-column");
    
    // Bouton Modifier
    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifier";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => editTask(task.idTache);
    
    // Bouton Supprimer
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteTask(task.idTache);
    
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    
    tdActions.appendChild(btnContainer);
    row.appendChild(tdActions);

    tbody.appendChild(row);
  });
}

// Modifier la fonction loadTasks pour utiliser loadSortedTasks
function loadTasks() {
  const tasks = readTasks();
  loadSortedTasks(tasks);
}