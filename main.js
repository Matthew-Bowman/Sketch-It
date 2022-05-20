// Variable Initialisation
const container = document.querySelector(".container");
const size = 16;

// Set Container Grid Templates
container.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

// Create Square Grid with Nested Loops
for(let x = 1; x <= size; x++) {
    for(let y = 1; y<= size; y++) {
        const div = document.createElement("div");
        container.appendChild(div);
    }
}