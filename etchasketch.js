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

addEventListener('DOMContentLoaded', function () {

    
    // Constant elements defined and stored in variables.
    const updateButton = document.querySelector('.edge-length-button');
    const updateContent = document.querySelector('.edge-length');

    const canvasTitle = document.querySelector('.canvas-block > .canvas-title');
    const canvasBlock = document.querySelector('.canvas');

    const defaultCanvasTitle = "CANVAS ";
    const defaultSize = 16;

    // Build the initial canvas. Can't attach an event listener to this,
    // because it is always re-built? Check that.
    insertCanvasGrid(buildCanvasGrid(defaultSize));

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
    })

    // Colour-change functionality added to the webpage.
    canvasBlock.addEventListener('click', function(e) {
        // I believe we need each individual div to have an indiv. id.
        let targetElement = e.target;

        // Check the element is indeed a div to be coloured.
        let targetElementClasses = targetElement.classList;
        if (targetElementClasses.contains("canvas-element")) {
            targetElement.classList.add("canvas-element-black");
        }
    })


});