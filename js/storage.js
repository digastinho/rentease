"use strict";

const STORAGE_KEY = "renteaseFlats";
let storageMessage = "";

function loadFlats() {
  storageMessage = "";

  try {
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (rawData === null) {
      return [];
    }

    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      storageMessage = "Os dados guardados estão num formato inesperado.";
      return [];
    }

    return parsedData;
  } catch (error) {
    storageMessage = "Não foi possível ler os apartamentos guardados.";
    return [];
  }
}

function saveFlats(flats) {
  try {
    const dataToSave = JSON.stringify(flats);
    localStorage.setItem(STORAGE_KEY, dataToSave);
    return true;
  } catch (error) {
    storageMessage = "Não foi possível guardar os apartamentos.";
    return false;
  }

  storageMessage = "Completa saveFlats() para guardar o array no browser.";
  return false;
}

function getStorageMessage() {
  return storageMessage;
}

function formatCurrency(value) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function formatDate(dateText) {
  const dateParts = dateText.split("-");

  if (dateParts.length !== 3) {
    return "Data inválida";
  }

  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}
