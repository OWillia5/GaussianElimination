// Initialize matrix history array
let matrixHistory = [];
let currentMatrixState; // Variable to store current matrix state
let originalMatrixState; // Variable to store original matrix state

function performGaussianElimination() {
    // Get the matrix input
    const matrixRows = [];
    const rows = document.querySelectorAll('#matrixInput .matrix-row');

    // Iterate over the rows and extract values
    rows.forEach(row => {
        const rowValues = [];
        const inputFields = row.querySelectorAll('.matrix-input');
        inputFields.forEach(input => {
            rowValues.push(parseFloat(input.value) || 0);
        });
        matrixRows.push(rowValues);
    });

    // Save the original matrix state if it's not already saved
    if (!originalMatrixState) {
        originalMatrixState = getMatrixStateAsString();
        matrixHistory.push(originalMatrixState);
    }

    // Perform Gaussian Elimination
    const resultMatrix = gaussianElimination(matrixRows);

    // Save the current matrix state to history
    matrixHistory.push(getMatrixStateAsString());

    // Display the result
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h3>Result:</h3>';

    // Check if the result is a string (error message) or a matrix
    if (typeof resultMatrix === 'string') {
        resultElement.innerHTML += `<p style="color: red;">${resultMatrix}</p>`;
    } else {
        const resultMatrixDiv = document.createElement('div');
        resultMatrixDiv.classList.add('result-matrix'); // Add a class for styling

        // Iterate over the rows and columns of the result matrix
        resultMatrix.forEach(rowValues => {
            rowValues.forEach(value => {
                const cell = document.createElement('div');
                cell.textContent = parseInt(value).toString(); // Convert value to integer and display as string
                resultMatrixDiv.appendChild(cell);
            });
        });

        // Append the result matrix to the resultElement
        resultElement.appendChild(resultMatrixDiv);
    }
}

function gaussianElimination(matrixRows) {
    // Check if the input is a valid 3x4 matrix
    if (matrixRows.length !== 3 || matrixRows.some(row => row.length !== 4)) {
        return 'Invalid matrix input. Please enter a 3x4 matrix.';
    }

    // Perform Gaussian elimination
    for (let i = 0; i < 3; i++) {
        // Make the diagonal element 1
        const divisor = matrixRows[i][i];
        for (let j = i; j < 4; j++) {
            matrixRows[i][j] /= divisor;
        }

        // Make the elements below and above the diagonal 0
        for (let k = 0; k < 3; k++) {
            if (k !== i) {
                const factor = matrixRows[k][i];
                for (let j = i; j < 4; j++) {
                    matrixRows[k][j] -= factor * matrixRows[i][j];
                }
            }
        }
    }

    // Return the result matrix
    return matrixRows;
}

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

// Function to perform the undo operation
function undo() {
    console.log('Undo function called'); // Log statement
    console.log('Len b4 pop:', matrixHistory.length); // Log the length before pop

    if (matrixHistory.length <= 2) {
        console.log('HYFR:'); 

        matrixHistory.pop();
        
        // Display original matrix state when undoing all the way to the beginning
        displayOriginalMatrixState();
        
        console.log('Len after Pop:', matrixHistory.length);
    }
    else if (matrixHistory.length > 2) {

        console.log('WTF:'); 
        // Remove the last matrix state from the history
        matrixHistory.pop();

        console.log('Len after Pop:', matrixHistory.length);

        // Get the previous matrix state
        const previousMatrixState = matrixHistory[matrixHistory.length - 1];

        //console.log('Previous Matrix State:', previousMatrixState); // Log the previous matrix state

        // Convert the array to string before updating the matrix
        const matrixStateString = previousMatrixState.map(row => row.join(' ')).join('\n');

        // Update the matrix with the previous state
        setMatrixStateFromString(matrixStateString);

        // Update currentMatrixState
        currentMatrixState = matrixStateString;
        
        console.log('Matrix and results cleared'); // Log the action of clearing the matrix and results
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
