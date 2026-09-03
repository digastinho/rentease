"use strict";

const filtersForm = document.getElementById("filtersForm");
const cityFilter = document.getElementById("cityFilter");
const minPriceFilter = document.getElementById("minPriceFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const minAreaFilter = document.getElementById("minAreaFilter");
const maxAreaFilter = document.getElementById("maxAreaFilter");
const sortBy = document.getElementById("sortBy");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const resultsCount = document.getElementById("resultsCount");
const flatsFeedback = document.getElementById("flatsFeedback");
const flatList = document.getElementById("flatList");

function showFlatsFeedback(message, type = "success") {
  flatsFeedback.hidden = message === "";
  flatsFeedback.textContent = message;
  flatsFeedback.dataset.type = type;
}

function readOptionalNumber(input) {
  const value = input.value.trim();
  return value === "" ? null : Number(value);
}

function getProcessedFlats() {
  const allFlats = loadFlats();
  const city = cityFilter.value.trim().toLowerCase();
  const minPrice = readOptionalNumber(minPriceFilter);
  const maxPrice = readOptionalNumber(maxPriceFilter);
  const minArea = readOptionalNumber(minAreaFilter);
  const maxArea = readOptionalNumber(maxAreaFilter);

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return {
      flats: [],
      error: "O preço mínimo não pode ser superior ao preço máximo.",
    };
  }

  if (minArea !== null && maxArea !== null && minArea > maxArea) {
    return {
      flats: [],
      error: "A área mínima não pode ser superior à área máxima.",
    };
  }

  const filteredFlats = allFlats.filter((flat) => {
    const matchesCity = city === "" || flat.city.toLowerCase().includes(city);
    const matchesMinPrice = minPrice === null || flat.rentPrice >= minPrice;
    const matchesMaxPrice = maxPrice === null || flat.rentPrice <= maxPrice;
    const matchesMinArea = minArea === null || flat.areaSize >= minArea;
    const matchesMaxArea = maxArea === null || flat.areaSize <= maxArea;

    return (
      matchesCity &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinArea &&
      matchesMaxArea
    );
  });

  const sortedFlats = [...filteredFlats];

  switch (sortBy.value) {
    case "city":
      sortedFlats.sort((a, b) => a.city.localeCompare(b.city));
      break;
    case "price":
      sortedFlats.sort((a, b) => a.rentPrice - b.rentPrice);
      break;
    case "area":
      sortedFlats.sort((a, b) => a.areaSize - b.areaSize);
      break;
  }

  return { flats: sortedFlats, error: "" };
}

function createFact(label, value) {
  const fact = document.createElement("div");
  fact.className = "property-card__fact";

  const factLabel = document.createElement("p");
  factLabel.className = "property-card__fact-label";
  factLabel.textContent = label;

  const factValue = document.createElement("p");
  factValue.className = "property-card__fact-value";
  factValue.textContent = value;

  fact.appendChild(factLabel);
  fact.appendChild(factValue);
  return fact;
}

function createFlatCard(flat) {
  const card = document.createElement("article");
  card.className = "property-card";

  const header = document.createElement("div");
  header.className = "property-card__header";

  const headingGroup = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = flat.city;

  const address = document.createElement("p");
  address.className = "property-card__address";
  address.textContent = `${flat.streetName}, ${flat.streetNumber}`;

  headingGroup.appendChild(title);
  headingGroup.appendChild(address);
  header.appendChild(headingGroup);

  if (flat.isFavourite) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Favorito";
    header.appendChild(badge);
  }

  const facts = document.createElement("div");
  facts.className = "property-card__facts";
  facts.appendChild(createFact("Renda", formatCurrency(flat.rentPrice)));
  facts.appendChild(createFact("Área", `${flat.areaSize} m²`));
  facts.appendChild(createFact("Ano", String(flat.yearBuilt)));
  facts.appendChild(createFact("Ar condicionado", flat.hasAC ? "Sim" : "Não"));
  facts.appendChild(createFact("Disponível", formatDate(flat.dateAvailable)));

  const actions = document.createElement("div");
  actions.className = "property-card__actions";

  const favouriteButton = document.createElement("button");
  favouriteButton.className = "button button--secondary button--small";
  favouriteButton.type = "button";
  favouriteButton.textContent = flat.isFavourite
    ? "Remover dos favoritos"
    : "Marcar como favorito";
  favouriteButton.addEventListener("click", () => toggleFavourite(flat.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "button button--danger button--small";
  deleteButton.type = "button";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => deleteFlat(flat.id));

  actions.appendChild(favouriteButton);
  actions.appendChild(deleteButton);
  card.appendChild(header);
  card.appendChild(facts);
  card.appendChild(actions);
  return card;
}

function renderFlats(actionMessage = "", actionType = "success") {
  const processed = getProcessedFlats();
  flatList.replaceChildren();
  resultsCount.textContent = `${processed.flats.length} resultado${processed.flats.length === 1 ? "" : "s"}`;

  if (processed.error) {
    showFlatsFeedback(processed.error, "error");
    return;
  }

  const message = actionMessage || getStorageMessage();

  if (message) {
    showFlatsFeedback(message, actionMessage ? actionType : "warning");
  } else if (processed.flats.length === 0) {
    showFlatsFeedback("Não existem apartamentos para apresentar.", "warning");
  } else {
    showFlatsFeedback("");
  }

  for (const flat of processed.flats) {
    flatList.appendChild(createFlatCard(flat));
  }
}

function toggleFavourite(flatId) {
  const flats = loadFlats();

  const updatedFlats = flats.map((flat) => {
    if (flat.id === flatId) {
      return { ...flat, isFavourite: !flat.isFavourite };
    }
    return flat;
  });

  const saved = saveFlats(updatedFlats);

  if (saved) {
    renderFlats("Favorito atualizado com sucesso.");
  } else {
    showFlatsFeedback(
      getStorageMessage() || "Não foi possível atualizar o favorito.",
      "error",
    );
  }
}

function deleteFlat(flatId) {
  const confirmed = confirm(
    "Tens a certeza que queres eliminar este apartamento?",
  );

  if (!confirmed) {
    return;
  }

  const flats = loadFlats();
  const updatedFlats = flats.filter((flat) => flat.id !== flatId);

  const saved = saveFlats(updatedFlats);

  if (saved) {
    renderFlats("Apartamento eliminado com sucesso.");
  } else {
    showFlatsFeedback(
      getStorageMessage() || "Não foi possível eliminar o apartamento.",
      "error",
    );
  }
}

filtersForm.addEventListener("input", () => renderFlats());
filtersForm.addEventListener("change", () => renderFlats());

clearFiltersButton.addEventListener("click", (event) => {
  event.preventDefault();
  filtersForm.reset();
  renderFlats();
});

renderFlats();
