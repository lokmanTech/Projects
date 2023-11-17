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

/*-----------------------------WORKSPACE MANAGER-----------------------------*/
function addWorkspaceEntry() {
    var projectInput = document.getElementById('projectInput');
    var timeInHourInput = document.getElementById('timeInHourInput');
    var timeInMinuteInput = document.getElementById('timeInMinuteInput');
    var timeInMeridiemInput = document.getElementById('timeInMeridiemInput');
    var timeOutHourInput = document.getElementById('timeOutHourInput');
    var timeOutMinuteInput = document.getElementById('timeOutMinuteInput');
    var timeOutMeridiemInput = document.getElementById('timeOutMeridiemInput');
    var statusInput = document.getElementById('statusInput');
    var workspaceList = document.getElementById('workspaceList');

    var timeIn = timeInHourInput.value + ':' + timeInMinuteInput.value + ' ' + timeInMeridiemInput.value;
    var timeOut = timeOutHourInput.value + ':' + timeOutMinuteInput.value + ' ' + timeOutMeridiemInput.value;

    if (projectInput.value.trim() !== '' && timeIn !== ' :' && timeOut !== ' :') {
        var li = document.createElement('li');
        li.innerHTML = `<strong>Project:</strong> ${projectInput.value}<br>
                        <strong>Time In:</strong> ${timeIn}<br>
                        <strong>Time Out:</strong> ${timeOut}<br>
                        <strong>Status:</strong> ${statusInput.value}`;
        workspaceList.appendChild(li);

        // Clear input fields
        projectInput.value = '';
        timeInHourInput.value = '';
        timeInMinuteInput.value = '';
        timeOutHourInput.value = '';
        timeOutMinuteInput.value = '';
        statusInput.value = '';
    }
}
/*----------------------------------DOWNLOAD--------------------------------*/
function downloadAndSaveToServer() {
    // Get ledger entries
    var workspaceList = document.getElementById('workspaceList').innerHTML;

    // Create a new instance of html2pdf
    var pdf = new html2pdf(document.body, {
        margin: 10,
        filename: 'wholeWebsite.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 2,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    });

    // Trigger the PDF generation
    pdf.toBlob(function (blob) {
        // Prepare data
        var data = new FormData();
        data.append('file', blob, 'dailyLog.pdf');
        data.append('entries', workspaceList);

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