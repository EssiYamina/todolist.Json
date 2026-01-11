/***********************
 * DONNÉES JSON
 ***********************/
let priorities = [
  { idPriorite: "1", priorite: "Très importante" },
  { idPriorite: "2", priorite: "Importante" },
  { idPriorite: "3", priorite: "Moyenne" },
  { idPriorite: "4", priorite: "Peu importante" },
  { idPriorite: "5", priorite: "Optionnelle" }
];

let categories = [
  { idCategorie: "1", categorie: "Travail" },
  { idCategorie: "2", categorie: "Personnel" },
  { idCategorie: "3", categorie: "Études" },
  { idCategorie: "4", categorie: "Loisirs" }
];

let statuses = [
  { idStatut: "1", statut: "En cours" },
  { idStatut: "2", statut: "Terminée" },
  { idStatut: "3", statut: "Annulée" }
];

/************************
 * TÂCHES (globale)
 ************************/
let taskList = [];

/************************
 * LECTURE localStorage
 ************************/
function loadTasks() {
  const stored = localStorage.getItem("todoTasks");
  taskList = stored ? JSON.parse(stored) : [];
}

/************************
 * AFFICHAGE TABLEAU
 ************************/
function renderTable() {
  const tbody = document.getElementById("tasksTbody");
  const emptyMsg = document.getElementById("emptyMsg");

  tbody.innerHTML = "";

  if (taskList.length === 0) {
    emptyMsg.textContent = "Aucune tâche enregistrée.";
    return;
  }

  emptyMsg.textContent = "";

  taskList.forEach(task => {

    // 🔴 Archivage : on masque Terminée / Annulée
    if (task.idStatut === "2" || task.idStatut === "3") return;

    const pr = priorities.find(p => p.idPriorite == task.idPriorite);
    const cat = categories.find(c => c.idCategorie == task.idCategorie);

    const statusButtons = statuses.map(st => {
      const isActive = st.idStatut === task.idStatut;

      return `
        <button
          type="button"
          data-taskid="${task.idTache}"
          data-status="${st.idStatut}"
          onclick="updateStatus(this)"
          ${isActive ? "disabled class='status-active'" : ""}
        >
          ${st.statut}
        </button>
      `;
    }).join("");

    const rowHTML = `
      <tr>
        <td>${task.libelle}</td>
        <td>${pr?.priorite || ""}</td>
        <td>${cat?.categorie || ""}</td>
        <td>${task.dateCreation}</td>
        <td>${task.dateEcheance}</td>
        <td>${statusButtons}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML("beforeend", rowHTML);
  });
}

/************************
 * CHANGEMENT DE STATUT
 ************************/
function updateStatus(button) {
  const taskId = button.dataset.taskid;
  const newStatus = button.dataset.status;

  loadTasks();

  const task = taskList.find(t => t.idTache == taskId);
  if (!task) return;

  task.idStatut = newStatus;

  localStorage.setItem("todoTasks", JSON.stringify(taskList));

  renderTable();
}

/************************
 * DOCUMENT READY
 ************************/
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    loadTasks();
    renderTable();
  }
};
