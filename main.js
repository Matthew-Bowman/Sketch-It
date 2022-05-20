// Variable Initialisation
const container = document.querySelector(".container");
const size = 16;

// Set Container Grid Templates
container.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;