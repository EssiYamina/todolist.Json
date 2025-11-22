const fallbackData = {
  priorities: [
    { idPriorite: "1", priorite: "Très importante" },
    { idPriorite: "2", priorite: "Importante" },
    { idPriorite: "3", priorite: "Moyenne" },
    { idPriorite: "4", priorite: "Peu importante" },
    { idPriorite: "5", priorite: "Optionnelle" },
  ],
  statuses: [
    { idStatut: "1", statut: "En cours" },
    { idStatut: "2", statut: "Terminée" },
    { idStatut: "3", statut: "Annulée" },
  ],
  categories: [
    { idCategorie: "1", categorie: "Travail" },
    { idCategorie: "2", categorie: "Personnel" },
    { idCategorie: "3", categorie: "Études" },
    { idCategorie: "4", categorie: "Loisirs" },
  ],
};

async function fetchJsonOrNull(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Impossible de charger ${url} :`, error);
    return null;
  }
}

async function fetchStatusesAndCategories(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rawText = (await response.text()).trim();
    const arrays = rawText.match(/\[.*?\]/gs) || [];
    const parsed = arrays.map((block) => JSON.parse(block));
    return {
      statuses: parsed[0] || [],
      categories: parsed[1] || [],
    };
  } catch (error) {
    console.warn(`Impossible de charger ${url} :`, error);
    return null;
  }
}

function populateSelect(selectId, items, valueKey, labelKey) {
  const select = document.getElementById(selectId);
  if (!select) return;

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

async function hydrateSelects() {
  const priorities =
    (await fetchJsonOrNull("../../Step1/1B.json")) || fallbackData.priorities;
  const statusAndCategories =
    (await fetchStatusesAndCategories("../../Step1/1C.json")) || fallbackData;

  populateSelect("priorite", priorities, "idPriorite", "priorite");
  populateSelect(
    "statut",
    statusAndCategories.statuses,
    "idStatut",
    "statut"
  );
  populateSelect(
    "categorie",
    statusAndCategories.categories,
    "idCategorie",
    "categorie"
  );
}

function saveTask() {
  const form = document.getElementById("taskForm");
  if (!form) return;

  const isValid = form.reportValidity ? form.reportValidity() : form.checkValidity?.();
  if (isValid === false) return;

  const libelle = document.getElementById("libelle")?.value.trim() || "";
  const description = document.getElementById("description")?.value.trim() || "";
  const dateCreation = document.getElementById("dateCreation")?.value || "";
  const dateEcheance = document.getElementById("dateEcheance")?.value || "";
  const idPriorite = document.getElementById("priorite")?.value || "";
  const idStatut = document.getElementById("statut")?.value || "";
  const idCategorie = document.getElementById("categorie")?.value || "";
  const commentaires = document.getElementById("commentaires")?.value.trim();

  let tasks = [];
  const storedTasks = localStorage.getItem("todoTasks");
  if (storedTasks) {
    try {
      tasks = JSON.parse(storedTasks);
      if (!Array.isArray(tasks)) tasks = [];
    } catch (error) {
      console.warn("Impossible de parser les tâches existantes :", error);
      tasks = [];
    }
  }

  const nextId = (tasks.length + 1).toString();
  const newTask = {
    idTache: nextId,
    libelle,
    description,
    dateCreation,
    dateEcheance,
    idPriorite,
    idStatut,
    idCategorie,
  };

  if (commentaires) {
    newTask.commentaires = commentaires;
  }

  tasks.push(newTask);
  localStorage.setItem("todoTasks", JSON.stringify(tasks));

  console.log("Tâches enregistrées :", tasks);
  console.log("Nouvelle tâche ajoutée :", newTask);

  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateSelects();
});
