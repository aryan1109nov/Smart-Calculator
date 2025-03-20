
// Auto-refresh after 2 minutes (120,000 milliseconds)
let inactivityTimer;
let countdownTimer;
let timeLeft = 120; // 2 minutes in seconds

// Function to update the countdown timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to reset the inactivity timer and countdown
function resetInactivityTimer() {
    clearTimeout(inactivityTimer); // Clear the existing timer
    clearInterval(countdownTimer); // Clear the countdown timer
    timeLeft = 120; // Reset time left to 2 minutes
    updateTimer(); // Update the timer display

    // Start the countdown timer
    countdownTimer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(countdownTimer); // Stop the countdown
            window.location.reload(); // Refresh the page
        }
    }, 1000); // Update every second

    // Start the inactivity timer
    inactivityTimer = setTimeout(() => {
        window.location.reload(); // Refresh the page
    }, 120000); // 2 minutes = 120,000 milliseconds
}

// Reset the timer on user activity (e.g., mouse movement, clicks, or keypresses)
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);

// Start the timer when the page loads
resetInactivityTimer();

// Manual refresh button
document.getElementById("refresh-button").addEventListener("click", function () {
    window.location.reload(); // Refresh the page
});





function calculateDiscount() {
    const total = parseFloat(document.getElementById("total").value);
    const discountPercent = parseFloat(document.getElementById("discount").value);

    if (isNaN(total) || isNaN(discountPercent)) {
        alert("Please enter valid numbers for total and discount percentage.");
        return;
    }

    const discountedTotal = total * (1 - discountPercent / 100);
    document.getElementById("result").innerText = `Discounted Total: ${discountedTotal.toFixed(2)}`;

    // Generate QR code for the discounted total
    fetch("/generate_qr", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ total_amount: discountedTotal }),
    })
        .then((response) => response.blob())
        .then((blob) => {
            const qrCodeContainer = document.getElementById("qr-code-container");
            const qrCodeImg = document.getElementById("qr-code");
            qrCodeImg.src = URL.createObjectURL(blob);
            qrCodeContainer.style.display = "block";
        })
        
    qrCodeImgForPDF.onerror = function () {
        console.error("Failed to load QR code image!");
    };
};






document.getElementById("operation").addEventListener("change", function () {
    const operation = this.value;
    const inputsDiv = document.querySelector(".inputs");
    inputsDiv.innerHTML = "";

    if (operation === "total") {
        // Existing code for total calculation
    } else if (operation === "discount") {
        inputsDiv.innerHTML = `
            <label for="total">Total Amount:</label>
            <input type="number" id="total" placeholder="e.g., 100">
            <label for="discount">Discount Percentage:</label>
            <input type="number" id="discount" placeholder="e.g., 10">
            <button id="calculate-discount">Apply Discount</button>
        `;

        // Add event listener for discount calculation
        document.getElementById("calculate-discount").addEventListener("click", calculateDiscount);
    } else if (operation === "tax") {
        // Existing code for tax calculation
    } else if (operation === "profit") {
        // Existing code for profit calculation
    } else if (operation === "split") {
        // Existing code for split calculation
    }
});







function switchToDiscountTab() {
    // Set the operation dropdown to "Apply Discount"
    document.getElementById("operation").value = "discount";

    // Trigger the change event to update the input fields
    const event = new Event("change");
    document.getElementById("operation").dispatchEvent(event);

    // Auto-fill the total amount in the discount input
    const totalAmount = parseFloat(document.getElementById("result").innerText.replace("Total: ", ""));
    document.getElementById("total").value = totalAmount.toFixed(2);

    // Focus on the discount percentage input
    document.getElementById("discount").focus();
}



// Add this at the top of the file to initialize the table
document.addEventListener("DOMContentLoaded", function () {
    const inputsDiv = document.querySelector(".inputs");
    inputsDiv.innerHTML = `
        <table id="product-table">
            <thead>
                <tr>
                    <th>Sl No</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td><input type="text" class="product-name" placeholder="Product Name"></td>
                    <td><input type="number" class="price" placeholder="Price"></td>
                    <td><button class="add-row">+</button></td>
                </tr>
            </tbody>
        </table>
        <button id="calculate-total">Calculate Total</button>
    `;

    // Add event listener for adding new rows
    document.querySelector(".add-row").addEventListener("click", addRow);

    // Add event listener for calculating the total
    document.getElementById("calculate-total").addEventListener("click", calculateTotal);
});

// Function to add a new row to the table
function addRow() {
    const table = document.querySelector("#product-table tbody");
    const rowCount = table.rows.length;
    const newRow = table.insertRow();

    // Add Sl No cell
    const slNoCell = newRow.insertCell();
    slNoCell.textContent = rowCount + 1;

    // Add Product Name cell
    const productNameCell = newRow.insertCell();
    productNameCell.innerHTML = `<input type="text" class="product-name" placeholder="Product Name">`;

    // Add Price cell
    const priceCell = newRow.insertCell();
    priceCell.innerHTML = `<input type="number" class="price" placeholder="Price">`;

    // Add Action cell
    const actionCell = newRow.insertCell();
    actionCell.innerHTML = `<button class="remove-row">-</button>`;

    // Add event listener for removing the row
    actionCell.querySelector(".remove-row").addEventListener("click", function () {
        table.deleteRow(newRow.rowIndex - 1);
        updateSlNo();
    });
}

// Function to update serial numbers after row removal
function updateSlNo() {
    const table = document.querySelector("#product-table tbody");
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].textContent = i + 1;
    }
}



// Function to calculate the total price
function calculateTotal() {
    const prices = document.querySelectorAll(".price");
    let total = 0;
    prices.forEach((priceInput) => {
        const price = parseFloat(priceInput.value);
        if (!isNaN(price)) {
            total += price;
        }
    });




    // Display the total
    document.getElementById("result").innerText = `Total: ${total.toFixed(2)}`;


    // Switch to the "Apply Discount" tab
    switchToDiscountTab();
}

// Generate QR code for the total
fetch("/generate_qr", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ total_amount: total }),
})
    .then((response) => response.blob())
    .then((blob) => {
        const qrCodeContainer = document.getElementById("qr-code-container");
        const qrCodeImg = document.getElementById("qr-code");
        qrCodeImg.src = URL.createObjectURL(blob);
        qrCodeContainer.style.display = "block";

        
   // Add PDF generation code here
   document.getElementById("pdf-button").addEventListener("click", function () {
    console.log("PDF button clicked!"); // Debugging line
    downloadPDF(total, qrCodeImg); // Call the downloadPDF function
});
})
.catch((error) => {
console.error("Error generating QR code:", error);
});


// Initialize the calculator
calculateTotal();




     
     
     
           document.getElementById("operation").addEventListener("change", function () {
    const operation = this.value;
    const inputsDiv = document.querySelector(".inputs");
    inputsDiv.innerHTML = "";

    if (operation === "total") {
        inputsDiv.innerHTML = `
            <label for="prices">Enter Prices (comma-separated):</label>
            <input type="text" id="prices" placeholder="e.g., 10, 20, 30">
        `;
    } else if (operation === "discount") {
        inputsDiv.innerHTML = `
            <label for="total">Total Amount:</label>
            <input type="number" id="total" placeholder="e.g., 100">
            <label for="discount">Discount Percentage:</label>
            <input type="number" id="discount" placeholder="e.g., 10">
        `;
    } else if (operation === "tax") {
        inputsDiv.innerHTML = `
            <label for="total">Total Amount:</label>
            <input type="number" id="total" placeholder="e.g., 100">
            <label for="tax">Tax Percentage:</label>
            <input type="number" id="tax" placeholder="e.g., 5">
        `;
    } else if (operation === "profit") {
        inputsDiv.innerHTML = `
            <label for="cost">Cost Price:</label>
            <input type="number" id="cost" placeholder="e.g., 50">
            <label for="profit">Profit Percentage:</label>
            <input type="number" id="profit" placeholder="e.g., 20">
        `;
    } else if (operation === "split") {
        inputsDiv.innerHTML = `
            <label for="total">Total Bill:</label>
            <input type="number" id="total" placeholder="e.g., 200">
            <label for="people">Number of People:</label>
            <input type="number" id="people" placeholder="e.g., 4">
        `;
    }
});








