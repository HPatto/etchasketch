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
    // Ensure full black values are not permitted.

    let rValue;
    let gValue;
    let bValue;

    let maxValue = 255; // RGb value representing "maximum" colour.

    while (true) {
        rValue = getRandomInt(0, maxValue);
        gValue = getRandomInt(0, maxValue);
        bValue = getRandomInt(0, maxValue);

        // Check the found value is not RGB black.
        if (!(rValue === maxValue &&
            gValue === maxValue &&
            bValue === maxValue)) {
                break;
            }
    }

    let rgbString = `rgb(${rValue}, ${gValue}, ${bValue})`;
    return rgbString;
}

function getNewBackgroundStyleContent(rgbValue) {
    return `background-color: ${rgbValue}`;
}

function getStyleAttribute(object) {
    let styleAttribute = object.getAttribute('style');
}

function squareMatchesInfillChoice(object, button) {
    // The button either forces RGB black, or not.
    // The object either has RGB black, or not.
    // N.B. Rainbow cannot produce RGB black values.

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

    // Colour-change functionality.
    canvasBlock.addEventListener('mousemove', function(e) {
        // If keyboard inputs are suitable.
        if (mouseDown) {
            
            // Get the target element
            let targetElement = e.target;

            /*
            There are an array of conditions to check in order to paint to the viewport.
            Some design decisions are made along the way.

            1) Does the square have an assigned colour?
            2) Does the user colour match the current infill colour choice (i.e., black or not)?
            3) What is the current gradient strength of the square?
            4) What is the gradient boolean?

            These conditions, evaluated in this order, offer up certain rules for filling in colour.
            As a result:

            - Once a colour is assigned to a square, it's assigned for the "life" of the design.
            - A gradient of 100% will fully colour in a square with the given colour.
            - All colour will be applied thorugh style tags.

            */

            // What is the element's style attribute value?
            let styleAttribute = getStyleAttribute(targetElement);

            if(styleAttribute === "") {
                // No colour has been set. Proceed with basic colour painting.
            } else {
                // Colour value already set in style tag.
                // Compare rgb value to the user-infill style
                
                let matches = squareMatchesInfillChoice(targetElement, rainbowButton);



            }




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