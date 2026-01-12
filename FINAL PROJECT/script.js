
function populateSelect(selectId, items, valueKey, labelKey) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // reset + placeholder
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Sélectionner --";
  select.appendChild(placeholder);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item[valueKey];
    option.textContent = item[labelKey];
    select.appendChild(option);
  });
}

function hydrateSelects() {
  // Ces variables doivent exister dans le <head> de index.html
  populateSelect("priorite", listePriorites, "idPriorite", "priorite");
  populateSelect("statut", listeStatuts, "idStatut", "statut");
  populateSelect("categorie", listeCategories, "idCategorie", "categorie");
}


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

function getNextId(tasks) {
  if (tasks.length === 0) return "1";

  // +1 par rapport au dernier id enregistré
  const last = tasks[tasks.length - 1];
  const lastId = parseInt(last?.idTache, 10);
  if (Number.isFinite(lastId)) return String(lastId + 1);

  // fallback si idTache non valide : max + 1
  const maxId = tasks.reduce((max, t) => {
    const n = parseInt(t.idTache, 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return String(maxId + 1);
}

// Charger une tâche pour édition
function loadTaskForEditing() {
  const editId = localStorage.getItem("editTaskId");
  if (!editId) return; // Pas en mode édition

  const tasks = readTasks();
  const taskToEdit = tasks.find(t => t.idTache === editId);
  if (!taskToEdit) {
    console.warn("Tâche à modifier introuvable");
    localStorage.removeItem("editTaskId");
    return;
  }

  // Pré-remplir les champs
  document.getElementById("libelle").value = taskToEdit.libelle || "";
  document.getElementById("description").value = taskToEdit.description || "";
  document.getElementById("dateCreation").value = taskToEdit.dateCreation || "";
  document.getElementById("dateEcheance").value = taskToEdit.dateEcheance || "";
  document.getElementById("priorite").value = taskToEdit.idPriorite || "";
  document.getElementById("statut").value = taskToEdit.idStatut || "";
  document.getElementById("categorie").value = taskToEdit.idCategorie || "";
  document.getElementById("commentaires").value = taskToEdit.commentaires || "";

  // Changer le texte du bouton d'enregistrement
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.textContent = "Mettre à jour";
    submitBtn.onclick = updateTask; // Utiliser updateTask au lieu de saveTask
  }

  // Ajouter un bouton "Annuler l'édition"
  const actionsDiv = document.querySelector(".actions");
  if (actionsDiv && !document.getElementById("cancelEditBtn")) {
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.id = "cancelEditBtn";
    cancelBtn.textContent = "Annuler l'édition";
    cancelBtn.onclick = cancelEdit;
    actionsDiv.appendChild(cancelBtn);
  }

  console.log("Mode édition activé pour la tâche :", taskToEdit);
}

function saveTask() {
  const form = document.getElementById("taskForm");
  if (!form) return;

  // Validation HTML5
  const ok = form.reportValidity ? form.reportValidity() : form.checkValidity?.();
  if (ok === false) return;

  // Lecture des champs
  const libelle = document.getElementById("libelle").value.trim();
  const description = document.getElementById("description").value.trim();
  const dateCreation = document.getElementById("dateCreation").value;
  const dateEcheance = document.getElementById("dateEcheance").value;
  const idPriorite = document.getElementById("priorite").value;
  const idStatut = document.getElementById("statut").value;
  const idCategorie = document.getElementById("categorie").value;
  const commentaires = document.getElementById("commentaires").value.trim();

  // Lire l’existant
  const tasks = readTasks();

  // Construire la tâche JSON
  const newTask = {
    idTache: getNextId(tasks),
    libelle,
    description,
    dateCreation,
    dateEcheance,
    idPriorite,
    idStatut,
    idCategorie,
  };

  if (commentaires) newTask.commentaires = commentaires;

  // Ajouter + réenregistrer
  tasks.push(newTask);
  localStorage.setItem("todoTasks", JSON.stringify(tasks));

  console.log("Nouvelle tâche ajoutée :", newTask);
  console.log("Toutes les tâches :", tasks);

  form.reset();
}


document.addEventListener("DOMContentLoaded", () => {
  hydrateSelects();
  loadTaskForEditing();
});

// Mettre à jour une tâche existante
function updateTask() {
  const editId = localStorage.getItem("editTaskId");
  if (!editId) {
    console.error("Aucun ID de tâche à modifier");
    return;
  }

  // Validation
  const form = document.getElementById("taskForm");
  if (!form.reportValidity()) return;

  // Lecture des champs
  const libelle = document.getElementById("libelle").value.trim();
  const description = document.getElementById("description").value.trim();
  const dateCreation = document.getElementById("dateCreation").value;
  const dateEcheance = document.getElementById("dateEcheance").value;
  const idPriorite = document.getElementById("priorite").value;
  const idStatut = document.getElementById("statut").value;
  const idCategorie = document.getElementById("categorie").value;
  const commentaires = document.getElementById("commentaires").value.trim();

  // Charger toutes les tâches
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.idTache === editId);

  if (taskIndex === -1) {
    alert("Tâche introuvable");
    localStorage.removeItem("editTaskId");
    return;
  }

  // Mettre à jour la tâche
  tasks[taskIndex] = {
    ...tasks[taskIndex], // Garder les propriétés existantes
    libelle,
    description,
    dateCreation,
    dateEcheance,
    idPriorite,
    idStatut,
    idCategorie,
    commentaires: commentaires || undefined
  };

  // Sauvegarder
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
  localStorage.removeItem("editTaskId"); // Supprimer l'ID d'édition

  alert("Tâche mise à jour avec succès !");

  // Réinitialiser le formulaire
  form.reset();
  
  // Remettre le bouton à "Enregistrer"
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.textContent = "Enregistrer la tâche";
  submitBtn.onclick = saveTask;

  // Supprimer le bouton Annuler
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) cancelBtn.remove();

  console.log("Tâche mise à jour :", tasks[taskIndex]);
}

// Annuler l'édition
function cancelEdit() {
  localStorage.removeItem("editTaskId");
  
  // Réinitialiser le formulaire
  const form = document.getElementById("taskForm");
  form.reset();
  
  // Remettre le bouton à "Enregistrer"
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.textContent = "Enregistrer la tâche";
  submitBtn.onclick = saveTask;
  
  // Supprimer le bouton Annuler
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) cancelBtn.remove();
  
  console.log("Mode édition annulé");
}
