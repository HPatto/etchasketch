/*
A Javascript file, controlling the functionality and apperance
of the etch-a-sketch webpage
*/

// Build the canvas grid
function buildCanvasGrid(sideCount) {
    // Build a div container element
    const divContainer = document.createElement('div');

    // Give it a CSS property that has flexbox defined.
    divContainer.classList.add("canvas-container");

    for (let i = 0; i < sideCount; i++) {
        let divRow = buildCanvasRow(sideCount);
        divContainer.appendChild(divRow);
    }

    return divContainer;

}

// Construct a row of the canvas grid
function buildCanvasRow(sideCount) {
    // Build a div element
    const divRow = document.createElement('div');

    // Give it a CSS property that has flexbox defined.
    divRow.classList.add("canvas-row");

    for (let i = 0; i < sideCount; i++) {
        const divElem = document.createElement('div');
        divElem.classList.add("canvas-element");
        // console.log("Hey");
        divRow.appendChild(divElem);
    }

    return divRow;

}

// Insert the canvas grid into the document
function insertCanvasGrid(newGrid) {
    const canvasAnchor = document.querySelector(".canvas");

    // Clear out the currently existing element.
    while (canvasAnchor.firstChild) {
        canvasAnchor.removeChild(canvasAnchor.firstChild);
    }

    // Append the update canvas.
    canvasAnchor.appendChild(newGrid);
}

function updateCanvasTitle(object, defaultString, edgeSize) {
    let newString = defaultString + "(" + edgeSize + " x " + edgeSize + ")";
    updateTitleContent(object, newString);
}

function updateTitleContent(object, string) {
    object.textContent = string;
}

function getRandomInt(value1, value2) {
    /*
    TAKEN FROM MY PREVIOUS PROJECT - ROCKPAPERSCISSORS
    Return a random integer between the specified integer values (inclusive).

    1) Get the random float.

    2) Scale the float over the effective range of the function.
    N.B., effective is the difference between the two arguments.

    3) Add the random delta to the bottom value.
    */

    let bottom;
    let top;

    if (value1 < value2) {
        bottom = value1;
        top = value2;
    } else {
        bottom = value2;
        top = value1;
    }

    delta = Math.abs(top - bottom) + 1; // +1 to ensure truncated vals may be the top int.
    randomExcess = Math.floor(Math.random() * delta);

    let randomInt = bottom + randomExcess;
    return randomInt;
}

function generateRandomRGBValue() {
    // Format: "rgb(rValue, gValue, Bvalue)"

    let rValue = getRandomInt(0, 255);
    let gValue = getRandomInt(0, 255);
    let bValue = getRandomInt(0, 255);

    let rgbString = `rgb(${rValue}, ${gValue}, ${bValue})`;

    return rgbString;
}

function getNewBackgroundStyleContent(rgbValue) {
    return `background-color: ${rgbValue}`;
}

addEventListener('DOMContentLoaded', function () {

    // Constant elements defined and stored in variables.
    const updateButton = document.querySelector('.edge-length-button');
    const updateContent = document.querySelector('.edge-length');

    const canvasTitle = document.querySelector('.canvas-block > .canvas-title');
    const canvasBlock = document.querySelector('.canvas');

    const rainbowButton = document.querySelector("#option2");

    const gradientButton = document.querySelector("#myCheckbox");

    const defaultCanvasTitle = "CANVAS ";
    const defaultSize = 16;

    let mouseDown = false;

    // Build the initial canvas. Can't attach an event listener to this,
    // because it is always re-built? Check that.
    insertCanvasGrid(buildCanvasGrid(defaultSize));
    updateCanvasTitle(canvasTitle, defaultCanvasTitle, defaultSize);

    // Re-size functionality added to the webpage.
    updateButton.addEventListener('click', function() {
        let inputSize = parseInt(updateContent.value);

        // If a valid fidelity, update the canvas.
        if (inputSize >= 16 && inputSize <= 100) {
            insertCanvasGrid(buildCanvasGrid(inputSize));
            updateCanvasTitle(canvasTitle, defaultCanvasTitle, inputSize);
        }
        updateContent.value = '';
        updateContent.focus();
    });

    // Switch the status of drawing boolean.
    canvasBlock.addEventListener('mousedown', function() {
        mouseDown = true;
    });

    // Switch the status of drawing boolean.
    canvasBlock.addEventListener('mouseup', function() {
        mouseDown = false;
    });

    // Switch the status of the gradient boolean.
    

    // Colour-change functionality added to the webpage.
    canvasBlock.addEventListener('mousemove', function(e) {
        if (mouseDown) {
            // Get the target element
            let targetElement = e.target;

            // Get the classes in the selected element
            let targetElementClasses = targetElement.classList;

            // Is the element a square to be coloured?
            // Once it has been coloured, it cannot be updated again.
            if (targetElementClasses.contains("canvas-element")) {
                // Clear out existing classes
                targetElement.className = '';

                // What colour scheme does the user want?
                if (rainbowButton.checked) {
                    let newRGB = generateRandomRGBValue();
                    let newStyle = getNewBackgroundStyleContent(newRGB);

                    // Add inline style to the selected element
                    targetElement.setAttribute("style", newStyle);

                    // Add basic class, to maintain flexbox rules
                    targetElement.classList.add("canvas-element-blank");
                } else {
                    targetElement.classList.add("canvas-element-black");
                }
            }
        }
    });


});