

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

function getPrioriteLabel(idPriorite) {
  const p = listePriorites.find(x => x.idPriorite == idPriorite);
  return p ? p.priorite : "Inconnue";
}

function getStatutLabel(idStatut) {
  const s = listeStatuts.find(x => x.idStatut == idStatut);
  return s ? s.statut : "Inconnu";
}

function getCategorieLabel(idCategorie) {
  const c = listeCategories.find(x => x.idCategorie == idCategorie);
  return c ? c.categorie : "Inconnue";
}


function changeStatus(idTache, newIdStatut) {
  const tasks = readTasks();
  const task = tasks.find(t => t.idTache == idTache);

  if (!task) return;

  task.idStatut = newIdStatut;
  localStorage.setItem("todoTasks", JSON.stringify(tasks));

  loadTasks(); // refresh tableau
}

/*******************************
 * Affichage tableau
 * + Archivage (masquage)
 *******************************/
function loadTasks() {
  const tasks = readTasks();
  const tbody = document.getElementById("tasksTbody");
  const emptyMsg = document.getElementById("emptyMsg");

  if (!tbody) return;

  tbody.innerHTML = "";

  // Archivage: on masque Terminée (2) et Annulée (3)
  const visibleTasks = tasks.filter(t => t.idStatut !== "2" && t.idStatut !== "3");

  if (visibleTasks.length === 0) {
    emptyMsg.textContent = "Aucune tâche à afficher (terminées/annulées archivées).";
    emptyMsg.style.color = "#666";
    return;
  }

  emptyMsg.textContent = "";

  visibleTasks.forEach(task => {
    const tr = document.createElement("tr");

    // Titre
    const tdTitle = document.createElement("td");
    tdTitle.textContent = task.libelle || "";
    tr.appendChild(tdTitle);

    // Priorité
    const tdPrio = document.createElement("td");
    tdPrio.textContent = getPrioriteLabel(task.idPriorite);
    tr.appendChild(tdPrio);

    // Statut (libellé)
    const tdStatut = document.createElement("td");
    tdStatut.textContent = getStatutLabel(task.idStatut);
    tr.appendChild(tdStatut);

    // Catégorie
    const tdCat = document.createElement("td");
    tdCat.textContent = getCategorieLabel(task.idCategorie);
    tr.appendChild(tdCat);

    // Date création
    const tdCre = document.createElement("td");
    tdCre.textContent = task.dateCreation || "";
    tr.appendChild(tdCre);

    // Date échéance
    const tdEch = document.createElement("td");
    tdEch.textContent = task.dateEcheance || "";
    tr.appendChild(tdEch);

    // Actions (boutons statut)
    const tdActions = document.createElement("td");

    listeStatuts.forEach(st => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = st.statut;

      const isActive = (task.idStatut == st.idStatut);
      if (isActive) {
        btn.classList.add("status-active");
        btn.disabled = true;
      } else {
        btn.onclick = () => changeStatus(task.idTache, st.idStatut);
      }

      tdActions.appendChild(btn);
    });

    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}


document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    loadTasks();
  }
};
