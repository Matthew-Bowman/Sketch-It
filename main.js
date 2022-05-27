// Variable Initialisation
const container = document.querySelector(".container");
const pencilPicker = document.querySelector("#pencil-picker");
const backgroundPicker = document.querySelector("#background-picker");
const sizeRanger = document.querySelector(".size-picker");
const sizeLabel = document.querySelector(".size-label");
const resetButton = document.querySelector(".reset-button");
const gridCheckbox = document.querySelector(".grid-option");

let drawColour = "#000000";
let backgroundColour = "#ffffff";
let size = 16;

// Page Initialisation
InitialiseGrid();

// Event Listeners
pencilPicker.addEventListener("change", () => {
    drawColour = pencilPicker.value;
});

backgroundPicker.addEventListener("change", () => {
    backgroundColour = backgroundPicker.value;
    UpdateBackground(backgroundColour);
});

sizeRanger.addEventListener("change", () => {
    InitialiseGrid();
});

resetButton.addEventListener("click", () => {
    InitialiseGrid();
})

sizeRanger.addEventListener("input", () => {
    size = sizeRanger.value;
    sizeLabel.textContent = `${size}x${size}`;
})

// FUNCTIONS
function InitialiseGrid() {
    // Clear Container Contents
    container.innerHTML = ``;

    // Set Container Grid Templates
    container.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

    // Create Square Grid with Nested Loops
    for (let x = 1; x <= size; x++) {
        for (let y = 1; y <= size; y++) {
            // Create div
            const div = document.createElement("div");

            // Give div Class
            div.classList.add("tile");

            // Give div Attributes
            div.setAttribute(`data-xpos`, x);
            div.setAttribute(`data-ypos`, y);
            div.setAttribute(`data-touched`, false);

            // Style divs
            div.style.background = backgroundColour;

            // Add Event Listeners for Drawing to div
            div.addEventListener("mouseover", e => {
                // If Mouse Button 1 Pressed
                if (e.buttons == 1)
                    Draw(e.target);
            });

            div.addEventListener("mousedown", e => Draw(e.target));

            // Add div to Container
            container.appendChild(div);
        }
    }
}

function Draw(pTarget) {
    // Initialisation
    let target = pTarget;
    target.setAttribute(`data-touched`, true);

    // Change div Colour
    target.style.background = drawColour;
}

// Function: Iterates through each tile and changes
//           background colours if necessary
function UpdateBackground(pColour) {
    // Initialisation
    const tiles = document.querySelectorAll(".tile");
    let colour = pColour;

    // Iterate Through Tiles
    tiles.forEach(tile => {
        if (tile.getAttribute(`data-touched`) == `false`)
            tile.style.background = colour;
    })
}