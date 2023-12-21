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

// A prototype object to hold all the specific colours permitted.
function specificRGBDefinitions() {
    let colours = new Map();
    let values = new Set();

    function setRGBValues(array) {
        // Array format is [string, int, int, int]
        let arrayColour = array[0];
        let arrayValues = array.slice(1);

        colours.set(arrayColour, arrayValues);
        values.add(arrayValues);
    }

    function hasRGBArray(array) {
        return values.has(array);
    }

    function getRGBValues(colour) {
        // JS would return undefined as a default. We can handle the error at the call.
        return colours.get(colour);
    }

    function getAllColourNames() {
        return Array.from(colours.keys());
    }

    return {
        setRGBValues,
        getRGBValues,
        getAllColourNames,
        hasRGBArray
    };
}

// Initialize the specific RGB definitions for use.
function initializeRGBDefintions(sessionColours) {
    let definitions = [
        ["black", 0, 0, 0]
        // Add more colours here, if desired.
    ]

    definitions.forEach((element) => {
        sessionColours.setRGBValues(element);
    })    
}

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
function getSpecificRGBValues(colourName, colourObject) {
    // Return RGB values for given string.
    // If not in the session object, return undefined.
    let rgbValues = colourObject.getRGBValues(colourName);
    return rgbValues;
}

// Return an array of RGB values.
function generateRandomRGBValue(sessionColours, colour=false) {
    /*
    Return an array of RGB values.
    If a colour is provided, return those RGB values.

    If a colour is not provided, generate random values.
    The random values must not match any array of RGB values in the session colours.
    Basic check can be a loop, although that is slow. Small # of colours, okay for now.
    */

    // If specific colour is passed in, get the RGB values and return them.
    if ((colour !== false)) {
        // N.B. No error-checking for an undefined condition!.
        return getSpecificRGBValues(colour, sessionColours);
    }
    
    // Define each RGB value.
    let rValue;
    let gValue;
    let bValue;

    // RGB value representing "maximum" colour.
    let maxValue = 255;

    // Get all RGB arrays defined in the session.
    // let allRGBValues = sessionColours.getAllRGBArrays();

    // Array to hold the random values.
    let rgbArray = [];

    while (true) {
        // Get new values
        rValue = getRandomInt(0, maxValue);
        gValue = getRandomInt(0, maxValue);
        bValue = getRandomInt(0, maxValue);

        // Add to the array
        rgbArray.push(rValue);
        rgbArray.push(gValue);
        rgbArray.push(bValue);

        // Check the found value is specifically defined.
        if (!(sessionColours.hasRGBArray(rgbArray))) {
            break;
        }
    }
    return rgbArray;
}

function getElementRGBValues(styleString) {
    // A function to return the array of ints defining an objects RGB.
    // Format: "background-color: rgb(int1, int2, int3, float)"

    // Strings used to divide the style.
    let firstDelimiter = "(";
    let secondDelimiter = ", ";
    
    // Format: "int1, int2, int3, float)"
    let firstSplitString = styleString.split(firstDelimiter);

    // Format: ["int1", "int2", "int3"]
    let secondSplitString = firstSplitString[1].split(secondDelimiter);

    let rValue = parseInt(secondSplitString[0]);
    let gValue = parseInt(secondSplitString[1]);
    let bValue = parseInt(secondSplitString[2]);

    let elementRGBValues = [rValue, gValue, bValue];
    return elementRGBValues;
}

/*##### GRADIENT FUNCTIONS #####*/

// Set the gradient value, and return it.
function setGradientValue(gradientOn=false, object=false) {
    /*
    The gradient value depends on a number of factors.
    1. Is the gradient style choice selected?
    Pass in an optional argument, default false.

    2. Is this a new gradient object, or an update?
    Pass in an optional object, default false.
    ----------
    A: Gradient is off, there is no object
    => New object, return 1.0

    B: Gradient is off, there is an object
    => Object exists, return 1.0 (check for 1.0 ignored so far).

    C: Gradient is on, there is no object
    => New object, return 0.1

    D: Gradient is on, there is an object
    => Access current gradient, increment by 0.1 (iff. poss.), return it.
    ----------
    Sufficient check would be to see if a gradient value was !> 0.9.
    */

    let initialValue = 0.1;
    let incrementValue = 0.1;
    let maxValue = 1.0;

    if (gradientOn && (object !== false)) {
        // Option D.
        let currentGradient = getElementGradientValue(getStyleAttribute(object));
        if (currentGradient < (maxValue - incrementValue)) {
            return currentGradient + incrementValue;
        } else {
            return maxValue;
        }
    } else if (gradientOn && !(object)) {
        // Option C.
        return initialValue;
    } else if (!(gradientOn) && (object !== false)) {
        // Option B.
        return maxValue;
    } else {
        // Option A.
        return maxValue;
    }
}

function getElementGradientValue(styleString) {
    // A function to return the float value of an object's gradient.

    // String used to divide the style.
    let delimiter = ", ";
    
    // Format: "grad)"
    let splitString = styleString.split(delimiter);
    let gradString = splitString[splitString.length - 1].slice(0, -1);

    return parseFloat(gradString);
}

/*##### CLASS / ATTRIBUTE FUNCTIONS #####*/

function getStyleAttribute(object) {
    // Format: "background-color: rgb(int1, int2, int3, float)"
    let styleAttribute = object.getAttribute('style');
    // console.log(styleAttribute);
    return styleAttribute;
}

// A function to combine RGB and gradient values.
function buildStyleAttributeString(rgbArray, gradient) {
    let rValue = rgbArray[0];
    let gValue = rgbArray[1];
    let bValue = rgbArray[2];

    let attributeString = `background-color: rgb(
        ${rValue}, ${gValue}, ${bValue}, ${gradient})`;

    return attributeString;
}

// A function to update the CSS value applied to the element.
function setUpdatedClassValue(object) {

    let objectClasses = object.classList;

    // Has the element been updated previously?
    if (objectClasses.contains("canvas-element")) {
        // Clear out existing classes
        object.className = '';
        // Add basic class, to maintain flexbox rules
        object.classList.add("canvas-element-blank");
    }
}

// A function to apply the updated styling rules to a given element.
function setUpdatedStyleAttribute(object, styleString) {
    object.setAttribute('style', styleString);
}

/*##### TOP-LEVEL FUNCTIONS ###*/

// Build a fresh element
function constructFreshElement(object, rgbArray, isGradientSelected) {
    let newGradient = setGradientValue(gradientOn=isGradientSelected);
    let newStyle = buildStyleAttributeString(rgbArray, newGradient);
    setUpdatedStyleAttribute(object, newStyle);
    setUpdatedClassValue(object);
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

    // Build the initial canvas.
    const defaultCanvasTitle = "CANVAS ";
    const defaultSize = 16;

    insertCanvasGrid(buildCanvasGrid(defaultSize));
    updateCanvasTitle(canvasTitle, defaultCanvasTitle, defaultSize);

    // Initial mouse status set.
    let mouseDown = false;

    // Build and initialize the colour definition for the session.
    let sessionColours = specificRGBDefinitions();
    initializeRGBDefintions(sessionColours);

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

            // Is the desired colour rainbow?
            let isRainbowInfill = (rainbowButton.checked === true);
            let isGradientSelected = (gradientButton.checked == true);
            let freshElement = (styleAttribute === null);

            if (freshElement) {
                if (!(isRainbowInfill)) {
                    let newRGBArray = generateRandomRGBValue(sessionColours, 'black');
                    constructFreshElement(targetElement, newRGBArray, isGradientSelected);
                } else {
                    let newRGBArray = generateRandomRGBValue(sessionColours);
                    constructFreshElement(targetElement, newRGBArray, isGradientSelected);
                }
                // The following block is for a black infill, 0 gradient. SUCCESS*
                // let newRGBArray = generateRandomRGBValue(sessionColours, 'black');
                //constructFreshElement(object, rgbArray, isGradientSelected)
                //
                // let newGradient = setGradientValue(gradientOn=isGradientSelected);
                // let newStyle = buildStyleAttributeString(newRGBArray, newGradient);
                // setUpdatedStyleAttribute(targetElement, newStyle);
                // setUpdatedClassValue(targetElement);

                // The following block is for a rainbow infill, 0 gradient. SUCCESS with caveat.
                // let newRGBArray = generateRandomRGBValue(sessionColours);
                // let newGradient = setGradientValue(gradientOn=isGradientSelected);
                // let newStyle = buildStyleAttributeString(newRGBArray, newGradient);
                // setUpdatedStyleAttribute(targetElement, newStyle);
                // setUpdatedClassValue(targetElement);

                // The following block is for a black infill, gradient ON. SUCCESS*
                // let newRGBArray = generateRandomRGBValue(sessionColours, 'black');
                // let newGradient = setGradientValue(gradientOn=true);
                // let newStyle = buildStyleAttributeString(newRGBArray, newGradient);
                // setUpdatedStyleAttribute(targetElement, newStyle);
                // setUpdatedClassValue(targetElement);

                // The following block is for a rainbow infill, gradient ON. SUCCESS with caveat.
                // let newRGBArray = generateRandomRGBValue(sessionColours);
                // let newGradient = setGradientValue(gradientOn=isGradientSelected);
                // let newStyle = buildStyleAttributeString(newRGBArray, newGradient);
                // setUpdatedStyleAttribute(targetElement, newStyle);
                // setUpdatedClassValue(targetElement);
            } else {
                let newRGBArray = getElementRGBValues(styleAttribute);
                let newGradient = setGradientValue(gradientOn=isGradientSelected, targetElement);
                let newStyle = buildStyleAttributeString(newRGBArray, newGradient);
                setUpdatedStyleAttribute(targetElement, newStyle);
                setUpdatedClassValue(targetElement);
            }
        }
    });
});