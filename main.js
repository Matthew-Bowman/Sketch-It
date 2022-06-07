// Variable Initialisation
const container = document.querySelector(".container");
const pencilPicker = document.querySelector("#pencil-picker");
const backgroundPicker = document.querySelector("#background-picker");
const sizeRanger = document.querySelector(".size-picker");
const sizeLabel = document.querySelector(".size-label");
const resetButton = document.querySelector(".reset-button");
const gridCheckbox = document.querySelector(".grid-option");
const contextMenu = document.querySelector(".context-menu");

let drawColour = "rgb(0, 0, 0)";
let backgroundColour = "rgb(255, 255, 255)";
let rainbowArray = ["rgb(255, 0, 0)", "rgb(255, 127, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(75, 0, 130)", "rgb(143, 0, 255)"];
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
});

sizeRanger.addEventListener("input", () => {
    size = sizeRanger.value;
    sizeLabel.textContent = `${size}x${size}`;
});

gridCheckbox.addEventListener("change", () => {
    // Add/Remove Grid
    DrawGrid();
});

document.addEventListener("contextmenu", e => {
    e.preventDefault();

    // Position context menu
    const {clientX: mouseX, clientY: mouseY} = e;    
    contextMenu.style.left = `${mouseX}px`
    contextMenu.style.top = `${mouseY}px`

    // Show context menu
    contextMenu.classList.add(`visible`);
});

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
            div.id = `(${x - 1},${y - 1})`

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

            div.addEventListener("mousedown", e => { if (e.buttons == 1) Draw(e.target) });

            // Add div to Container
            container.appendChild(div);
        }
    }
}

function Draw(pTarget) {
    // Initialisation
    let target = pTarget;
    let original, splitRGB, HSL, RGB; // Variables for lightening/darkening process

    const drawingOption = document.querySelector("input[name='drawing-option']:checked").value;

    switch (drawingOption) {
        case 'Pencil':
            // Change div Colour
            target.setAttribute(`data-touched`, true);
            target.style.background = drawColour;
            break;
        case 'Eraser':
            // Set div colour to bg colour
            target.setAttribute(`data-touched`, false);
            target.style.background = backgroundColour;
            break;
        case 'Rainbow':
            // Cycle through array
            const shiftedColour = rainbowArray.shift();
            target.setAttribute(`data-touched`, true);
            target.style.background = shiftedColour;
            rainbowArray.push(shiftedColour);
            break;
        case 'Darker':
            // Get colour
            original = target.style.background;
            splitRGB = original.substring(4).slice(0, -1).split(`, `);

            // Get HSL and darken
            HSL = RGBtoHSL(splitRGB[0], splitRGB[1], splitRGB[2]);
            HSL.l -= 5;

            // Convert back to RGB
            RGB = HSLtoRGB(HSL.h, HSL.s, HSL.l);

            // Apply darkened colour to background
            target.style.background = `rgb(${RGB.r}, ${RGB.g}, ${RGB.b})`;
            break;
        case 'Lighter':
            // Get colour
            original = target.style.background;
            splitRGB = original.substring(4).slice(0, -1).split(`, `);

            // Get HSL and darken
            HSL = RGBtoHSL(splitRGB[0], splitRGB[1], splitRGB[2]);
            HSL.l += 5;

            // Convert back to RGB
            RGB = HSLtoRGB(HSL.h, HSL.s, HSL.l);

            // Apply darkened colour to background
            target.style.background = `rgb(${RGB.r}, ${RGB.g}, ${RGB.b})`;
            break;
    }

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

function DrawGrid() {
    const checked = gridCheckbox.checked;
    const tiles = document.querySelectorAll(`.tile`);

    if (checked)
        tiles.forEach(tile => tile.classList.add("grid"));
    else
        tiles.forEach(tile => tile.classList.remove("grid"));
}

function RGBtoHSL(pR, pG, pB) {
    // Conversion from 0-255 to 0-1
    let r = pR / 255;
    let g = pG / 255;
    let b = pB / 255;

    // Get min and max
    let min = Math.min(r, g, b);
    let max = Math.max(r, g, b);

    // Get luminance
    let l = (min + max) / 2;

    // Get saturation
    let s;
    if (min == max)
        s = 0;
    else
        if (l <= 0.5)
            s = (max - min) / (max + min);
        else
            s = (max - min) / (2.0 - max - min);

    // Get hue
    let h;

    if (s == 0)
        h = 0
    else {
        switch (max) {
            case r:
                h = (g - b) / (max - min);
                break;
            case g:
                h = 2.0 + (b - r) / (max - min);
                break;
            case b:
                h = 4.0 + (r - g) / (max - min);
                break;
        }
    }

    // Convert hue to degrees on colour circle
    h *= 60;

    // Check for negative hue
    if (h < 0)
        h += 360;

    // Return final values
    return {
        h: Number(h.toFixed(2)),
        s: Number((s * 100).toFixed(2)),
        l: Number((l * 100).toFixed(2)),
    };
}

function HSLtoRGB(pH, pS, pL) {
    // Initialisation
    const h = pH / 360;
    const s = pS / 100;
    const l = pL / 100;

    let r, g, b;
    let temp1, temp2;
    let tempR, tempG, tempB;

    // Checking for gray
    if (s == 0) {
        r = l * 255;
        g = l * 255;
        b = l * 255;
    } else {
        // Setting temporary variables
        if (l < 0.5)
            temp1 = l * (1 + s);
        else
            temp1 = l + s - l * s

        temp2 = 2 * l - temp1;

        tempR = h + 0.333;
        tempG = h;
        tempB = h - 0.333;

        // Check values are between 0-1
        if (tempR < 0)
            tempR += 1;
        else if (tempR > 1)
            tempR -= 1;

        if (tempG < 0)
            tempG += 1;
        else if (tempG > 1)
            tempG -= 1;

        if (tempB < 0)
            tempB += 1;
        else if (tempB > 1)
            tempB -= 1;

        // Perform Tests
        r = Tests(temp1, temp2, tempR) * 255;
        g = Tests(temp1, temp2, tempG) * 255;
        b = Tests(temp1, temp2, tempB) * 255;
    }

    // Return RGB
    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
    };

    // METHODS
    function Tests(temp1, temp2, temp3) {
        // Initialisation
        let val;

        // Tests
        if (6 * temp3 < 1)
            val = temp2 + (temp1 - temp2) * 6 * temp3;
        else if (2 * temp3 < 1)
            val = temp1;
        else if (3 * temp3 < 2)
            val = temp2 + (temp1 - temp2) * (0.666 - temp3) * 6
        else
            val = temp2;

        // Return value
        return val;
    }
}

function Save() {
    // Setup Canvas
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    // Get Context
    let ctx = canvas.getContext('2d');
    ctx.fill = `black`;

    // Draw
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const tile = document.getElementById(`(${x},${y})`);
            ctx.fillStyle = tile.style.background;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    // Download
    const link = document.createElement(`a`);
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
