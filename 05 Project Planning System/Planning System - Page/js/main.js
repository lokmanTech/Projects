/*-------------------------CURRENT DATE & TIME-------------------------------*/
function updateDateTime() {
    var currentDate = new Date();
    var dateElement = document.getElementById('currentDate');
    var timeElement = document.getElementById('currentTime');

    dateElement.textContent = currentDate.toDateString();
    timeElement.textContent = currentDate.toLocaleTimeString();
}

/*------------------UPDATE DATE & TIME EVERY SECOND-------------------------*/
setInterval(updateDateTime, 1000);

/*---------------------------------LEDGER-----------------------------------*/
var balance = 0;

function submitTransaction() {
    // Get form values
    var transactionType = document.getElementById('transactionType').value;
    var description = document.getElementById('description').value;
    var amount = parseFloat(document.getElementById('amount').value);

    // Validate amount
    if (isNaN(amount)) {
        alert('Please enter a valid amount.');
        return;
    }

    // Update balance
    if (transactionType === 'income') {
        balance += amount;
    } else {
        balance -= amount;
    }

    // Create ledger entry
    var entry = document.createElement('li');
    entry.className = 'ledger-entry';
    entry.textContent = `${transactionType.toUpperCase()} - ${description} - RM ${amount.toFixed(2)}`;

    // Add delete button
    var deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '🚮';
    deleteButton.onclick = function () {
        deleteTransaction(entry, amount, transactionType);
    };

    entry.appendChild(deleteButton);

    // Append entry to ledger
    document.getElementById('ledgerEntries').appendChild(entry);

    // Update balance display
    document.getElementById('balanceAmount').textContent = `RM ${balance.toFixed(2)}`;

    // Clear form
    document.getElementById('ledgerForm').reset();
}

function deleteTransaction(entry, amount, transactionType) {
    // Update balance
    if (transactionType === 'income') {
        balance -= amount;
    } else {
        balance += amount;
    }

    // Remove entry from ledger
    entry.remove();

    // Update balance display
    document.getElementById('balanceAmount').textContent = `RM ${balance.toFixed(2)}`;
}

/*------------------------------TASK & GOALS---------------------------------*/
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskList = document.getElementById("taskList");

    if (taskInput.value.trim() !== "") {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(taskInput.value));
        taskList.appendChild(li);

        // Add a delete button to each task
        var deleteButton = document.createElement("delete-button");
        deleteButton.appendChild(document.createTextNode(" 🚮"));
        deleteButton.onclick = function () {
            taskList.removeChild(li);
        };
        li.appendChild(deleteButton);

        // Clear the input field
        taskInput.value = "";
    }
}


/*----------------------------------DOWNLOAD--------------------------------*/
function downloadAndSaveToServer() {
    // Get ledger entries
    var ledgerEntries = document.getElementById('ledgerEntries').innerHTML;

    // Create a new instance of html2pdf
    var pdf = new html2pdf(document.body, {
        margin: 10,
        filename: 'ledger.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });

    // Trigger the PDF generation
    pdf.toBlob(function (blob) {
        // Prepare data
        var data = new FormData();
        data.append('file', blob, 'ledger.pdf');
        data.append('entries', ledgerEntries);

        // Send data to server using fetch API
        fetch('save_to_server.php', {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}