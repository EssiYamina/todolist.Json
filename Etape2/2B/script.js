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
    (await fetchJsonOrNull("../Step1/1B.json")) || fallbackData.priorities;
  const statusAndCategories =
    (await fetchStatusesAndCategories("../Step1/1C.json")) || fallbackData;

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

document.addEventListener("DOMContentLoaded", () => {
  hydrateSelects();

  const submitButton = document.getElementById("submitBtn");
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      alert("Le formulaire sera traité en JavaScript dans l'étape suivante.");
    });
  }
});
