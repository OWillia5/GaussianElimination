// Initialize matrix history array
let matrixHistory = [];
let currentMatrixState; // Variable to store current matrix state
let originalMatrixState; // Variable to store original matrix state
let undoneMatrixHistory = []; // Initialize the undone matrix history array


// Function to perform operations on the matrix
function performOperations() {
    // Get the selected values from dropdowns and input field
    const selectedRowIndex = parseInt(document.getElementById('selectRow').value);
    const multiplyByValue = parseFloat(document.getElementById('multiplyBy').value);
    const addToRowIndex = parseInt(document.getElementById('addToRow').value);

    // Check if valid rows are selected and valid multiplication factor is entered
    if (isNaN(selectedRowIndex) || isNaN(multiplyByValue)) {
        alert('Please select a valid row and multiplication factor.');
        return;
    }

    // Perform operations on the matrix
    const rows = document.querySelectorAll('#matrixInput .matrix-row');
    const selectedRowValues = [];

    // Extract values from the selected row
    rows[selectedRowIndex].querySelectorAll('.matrix-input').forEach(input => {
        selectedRowValues.push(parseFloat(input.value) || 0);
    });

    // Save the original matrix state if it's not already saved
    if (!originalMatrixState) {
        originalMatrixState = getMatrixStateAsString();
        matrixHistory.push(originalMatrixState);
    }

    // If Add to Row is selected, add the results to the specified row
    if (!isNaN(addToRowIndex)) {
        const addToRowValues = [];

        // Extract values from the row to add to
        rows[addToRowIndex].querySelectorAll('.matrix-input').forEach(input => {
            addToRowValues.push(parseFloat(input.value) || 0);
        });

        // Perform operations
        for (let i = 0; i < selectedRowValues.length; i++) {
            selectedRowValues[i] *= multiplyByValue;
            addToRowValues[i] += selectedRowValues[i];
        }

        // Update the matrix with the result (show only whole numbers)
        rows[addToRowIndex].querySelectorAll('.matrix-input').forEach((input, index) => {
            input.value = Math.round(addToRowValues[index]); // Use Math.round() to round to the nearest whole number
        });

        // Save the current matrix state to history
        matrixHistory.push(Array.from(rows).map(row =>
            Array.from(row.querySelectorAll('.matrix-input')).map(input =>
                parseFloat(input.value) || 0
            )
        ));

        // Update currentMatrixState
        currentMatrixState = getMatrixStateAsString();

    } else {
        // If Add to Row is not selected, just display the results on the selected row
        for (let i = 0; i < selectedRowValues.length; i++) {
            selectedRowValues[i] *= multiplyByValue;
        }

        // Update the matrix with the result (show only whole numbers)
        rows[selectedRowIndex].querySelectorAll('.matrix-input').forEach((input, index) => {
            input.value = Math.round(selectedRowValues[index]); // Use Math.round() to round to the nearest whole number
        });

        // Save the current matrix state to history
        matrixHistory.push(Array.from(rows).map(row =>
            Array.from(row.querySelectorAll('.matrix-input')).map(input =>
                parseFloat(input.value) || 0
            )
        ));

        // Update currentMatrixState
        currentMatrixState = getMatrixStateAsString();
    }
}

// Modified undo function to support redo functionality
function undo() {
    console.log('Undo function called');
    console.log('Len before pop:', matrixHistory.length);

    if (matrixHistory.length > 1) {
        // Before popping, save the last state for redo functionality
        const lastState = matrixHistory.pop();
        undoneMatrixHistory.push(lastState);

        // Handle edge case for original matrix state
        if (matrixHistory.length === 1) {
            displayOriginalMatrixState();
            console.log('Displayed original matrix state');
        } else {
            // Update the matrix with the previous state
            const previousMatrixState = matrixHistory[matrixHistory.length - 1];
            setMatrixStateFromString(matrixStateArrayToString(previousMatrixState));
            currentMatrixState = matrixStateArrayToString(previousMatrixState);
        }
    } else {
        console.log('No more states to undo');
    }

    console.log('Len after pop:', matrixHistory.length);
}

// New function to convert matrix state array to string
function matrixStateArrayToString(matrixStateArray) {
    return matrixStateArray.map(row => row.join(' ')).join('\n');
}

// Redo function to revert the undo operation
function redo() {
    console.log('Redo function called');

    if (undoneMatrixHistory.length > 0) {
        const nextState = undoneMatrixHistory.pop();
        matrixHistory.push(nextState);

        // Update the matrix with the redone state
        setMatrixStateFromString(matrixStateArrayToString(nextState));
        currentMatrixState = matrixStateArrayToString(nextState);
        console.log('Matrix state redone');
    } else {
        console.log('No more states to redo');
    }
}


// Function to display the original state of the matrix
function displayOriginalMatrixState() {
    // Check if originalMatrixState exists
    if (originalMatrixState) {
        setMatrixStateFromString(originalMatrixState);
    }
}

// Helper function to get matrix state as string
function getMatrixStateAsString() {
    // Get the matrix state as a string
    const rows = document.querySelectorAll('#matrixInput .matrix-row');
    const matrixState = Array.from(rows).map(row =>
        Array.from(row.querySelectorAll('.matrix-input')).map(input =>
            parseFloat(input.value) || 0
        ).join(' ')
    ).join('\n');

    return matrixState;
}

// Helper function to set matrix state from string
function setMatrixStateFromString(matrixState) {
    // Set the matrix state from the string
    const rows = document.querySelectorAll('#matrixInput .matrix-row');
    const matrixValues = matrixState.split('\n').map(row => row.split(' '));

    rows.forEach((row, i) => {
        const inputs = row.querySelectorAll('.matrix-input');
        inputs.forEach((input, j) => {
            input.value = matrixValues[i][j];
        });
    });
}
