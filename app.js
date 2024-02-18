// Initialize matrix history array
let matrixHistory = [];

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

    // Save the initial matrix state to history
    matrixHistory.push(getMatrixStateAsString());

    // Perform Gaussian Elimination
    const resultMatrix = gaussianElimination(matrixRows);

    // Save the final matrix state to history
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
                cell.textContent = value.toFixed(2);
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

// Add event listener for the row selection dropdown
document.getElementById('selectRow').addEventListener('change', function() {
    // Example: Get the selected row index
    const selectedRowIndex = this.value;
    console.log('Selected Row:', selectedRowIndex);

    // You can use the selectedRowIndex as needed in your application
});

// Populate the "Multiply By" dropdown with options from -9 to 9
const multiplyByDropdown = document.getElementById('multiplyBy');

for (let i = -9; i <= 9; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    multiplyByDropdown.appendChild(option);
}

// Add event listener for the multiplication dropdown
multiplyByDropdown.addEventListener('change', function() {
    // Get the selected multiplication value
    const multiplyValue = parseInt(this.value);

    // Log the selected multiplication value
    console.log('Selected Multiply By Value:', multiplyValue);

    // You can use the multiplyValue as needed in your application
});

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
        matrixHistory.push(matrixRows.map(row => [...row]));

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
    }
}

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

function undo() {
    console.log('Undo function called'); // Log statement
    console.log('Matrix History Length Before Pop:', matrixHistory.length); // Log the length before pop

    if (matrixHistory.length > 0) {
        // Clear the matrix history to reset to the initial state
        matrixHistory = [];

        // Clear the matrix input fields
        const rows = document.querySelectorAll('#matrixInput .matrix-row');
        rows.forEach(row => {
            const inputs = row.querySelectorAll('.matrix-input');
            inputs.forEach(input => {
                input.value = ''; // Clear each input field
            });
        });

        // Clear the result display area
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = ''; // Clear the results
        
        console.log('Matrix and results cleared'); // Log the action of clearing the matrix and results
    }
}

