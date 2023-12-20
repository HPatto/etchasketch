/*
A Javascript file, controlling the functionality and apperance
of the etch-a-sketch webpage
*/

/*##### CANVAS FUNCTIONS ##### */

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

// Dynamic updates to the canvas title
function updateCanvasTitle(object, defaultString, edgeSize) {
    let newString = defaultString + "(" + edgeSize + " x " + edgeSize + ")";
    object.textContent = newString;
}

/*##### RGB FUNCTIONS ##### */

// Generate a random int in a given range.
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

// Return specific RGB values
function getSpecificRGBValues(colour) {
    // Not sure about best practice. Colour strings are mapped to RGB arrays.

    // black RGB values.
    if (colour === 'black') {
        return [255, 255, 255];
    }

    return false;
}

// Return an array of RGB values.
function generateRandomRGBValue(colour=false) {
    // Format: "rgb(rValue, gValue, Bvalue)"

    // If specific colour is passed in, get the RGB values and return them.
    if (colour) {
        let values = specificRGBValues(colour);
        if (!values) {
            return values;
        }
    }
    
    // Ensure full black values are not permitted. Should be generalized.
    // Define each RGB value.
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

    // let rgbString = `rgb(${rValue}, ${gValue}, ${bValue})`;
    let rgbArray = [rValue, gValue, bValue];
    return rgbArray;
}

// Return the updated gradient value.
function setGradientvalue(currentGradient, gradient=false) {
    if (gradient) {
        if (currentGradient === 0) {
            return 0.1;
        } else {
            return currentGradient + 0.1;
        }
    }
    return 1.0;
}

// Return the current gradient value.
function getCurrentGradient(styleString) {

}

// Construct style attribute string
// Change this to "buildNew..."
function getNewBackgroundStyleContent(rgbValue) {
    return `background-color: ${rgbValue}`;
}

function getStyleAttribute(object) {
    // Format: "background-color: rgb(int1, int2, int3, float)"
    let styleAttribute = object.getAttribute('style');
}

addEventListener('DOMContentLoaded', function () {

    // Constant elements defined and stored in variables.
    const updateButton = document.querySelector('.edge-length-button');
    const updateContent = document.querySelector('.edge-length');

    const canvasTitle = document.querySelector('.canvas-block > .canvas-title');
    const canvasBlock = document.querySelector('.canvas');

    // UI inputs for sketching.
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
    /*
    There are an array of conditions to check in order to paint to the viewport.
    Some design decisions are made along the way.

    ### Keyboard Inputs
    1. Is the mouse down AND moving?

    ### UI Inputs
    2. What colour in-fill is selected?
    3. What gradient style is selected?

    ### Canvas Inputs
    4. Does the square have an assigned colour?
    5. Does the user-input colour in-fill match the square's colour?
    6. Is the gradient less than 1?

    These conditions, evaluated in this order, offer up certain rules for filling in colour.
    As a result:

    - Once a colour is assigned to a square, it's assigned for the "life" of the sketch.
    - A gradient of 100% will fully colour in a square with the given colour.
    - All colour will be applied through style tags.
    - Any colour specifically available (e.g., black), will not be available in rainbow.
    */
    canvasBlock.addEventListener('mousemove', function(e) {
        // Are the keyboard inputs sufficient?
        if (mouseDown) {
            
            // Get the target element
            let targetElement = e.target;

            // What is the element's style attribute value?
            let styleAttribute = getStyleAttribute(targetElement);

            if(styleAttribute === "") {
                // No colour has been set. Proceed with basic colour painting.
                // Possible to compress all of that into a larger function?
            } else {
                // What are the RGB values? Do they match the UI choice?
                
                // What is the current gradient value? Is it less than 1?
            
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
                    let newRGBArray = generateRandomRGBValue();
                    // let newStyle = getNewBackgroundStyleContent(newRGB);

                    // Add inline style to the selected element
                    // targetElement.setAttribute("style", newStyle);

                    // Add basic class, to maintain flexbox rules
                    // targetElement.classList.add("canvas-element-blank");
                } else {
                    let newRGBArray = generateRandomRGBValue('black');
                    targetElement.classList.add("canvas-element-black");
                }
            }
        }
    });


});