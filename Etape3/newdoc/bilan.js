/***********************
 * DONNÉES JSON (let)
 ***********************/
let priorities = [
  { idPriorite: "1", priorite: "Très importante" },
  { idPriorite: "2", priorite: "Importante" },
  { idPriorite: "3", priorite: "Moyenne" },
  { idPriorite: "4", priorite: "Peu importante" },
  { idPriorite: "5", priorite: "Optionnelle" }
];

let statuses = [
  { idStatut: "1", statut: "En cours" },
  { idStatut: "2", statut: "Terminée" },
  { idStatut: "3", statut: "Annulée" }
];

let categories = [
  { idCategorie: "1", categorie: "Travail" },
  { idCategorie: "2", categorie: "Personnel" },
  { idCategorie: "3", categorie: "Études" },
  { idCategorie: "4", categorie: "Loisirs" }
];

/********************************
 * LISTE TÂCHES (portée globale)
 ********************************/
let taskList = [];

/********************************
 * LECTURE localStorage (getItem)
 ********************************/
const stored = localStorage.getItem("todoTasks");
if (stored) {
  try {
    taskList = JSON.parse(stored);
    if (!Array.isArray(taskList)) taskList = [];
  } catch (e) {
    console.warn("Erreur JSON.parse :", e);
    taskList = [];
  }
}

console.log("Tâches récupérées :", taskList);

/*******************************************
 * Attendre que le document soit chargé
 * (onreadystatechange + readyState complete)
 *******************************************/
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    renderTable();
  }
};

/**********************
 * Générer le tableau
 **********************/
function renderTable() {
  const tbody = document.getElementById("tasksTbody");
  const emptyMsg = document.getElementById("emptyMsg");

  tbody.innerHTML = "";

  if (taskList.length === 0) {
    emptyMsg.textContent = "Aucune tâche enregistrée pour le moment.";
    return;
  }

  emptyMsg.textContent = "";

  // forEach() sur les tâches
  taskList.forEach((task) => {

    // find() pour retrouver les libellés à partir des identifiants
    const pr = priorities.find(p => p.idPriorite == task.idPriorite);
    const st = statuses.find(s => s.idStatut == task.idStatut);
    const cat = categories.find(c => c.idCategorie == task.idCategorie);

    const priorityLabel = pr ? pr.priorite : "(inconnue)";
    const statusLabel = st ? st.statut : "(inconnu)";
    const categoryLabel = cat ? cat.categorie : "(inconnue)";

    // Template literal + interpolation
    const rowHtml = `
      <tr>
        <td>${escapeHtml(task.libelle || "")}</td>
        <td>${escapeHtml(priorityLabel)}</td>
        <td>${escapeHtml(statusLabel)}</td>
        <td>${escapeHtml(categoryLabel)}</td>
        <td>${escapeHtml(task.dateCreation || "")}</td>
        <td>${escapeHtml(task.dateEcheance || "")}</td>
      </tr>
    `;

    // insertAdjacentHTML("beforeend")
    tbody.insertAdjacentHTML("beforeend", rowHtml);
  });
}

/**********************
 * Petit helper anti-bug HTML
 **********************/
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
