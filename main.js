// Variable Initialisation
const container = document.querySelector(".container");
const size = 16;

let drawColour = "#000000";
let backgroundColour = "#ffffff"

// Set Container Grid Templates
container.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

// Create Square Grid with Nested Loops
for(let x = 1; x <= size; x++) {
    for(let y = 1; y<= size; y++) {
        // Create div
        const div = document.createElement("div");

        // Give div Class
        div.classList.add("tile");

        // Give div Attributes
        div.setAttribute(`data-xpos`, x);
        div.setAttribute(`data-ypos`, y);
        div.setAttribute(`data-touched`, false);

        // Add Event Listeners for Drawing to div
        div.addEventListener("mouseover", e => {
            // If Mouse Button 1 Pressed
            if(e.buttons == 1) 
                Draw(e.target);
        });

        div.addEventListener("mousedown", e => Draw(e.target));

        // Add div to Container
        container.appendChild(div);
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
        if(tile.getAttribute(`data-touched`) == `false`)
            tile.style.background = colour;
    })
}