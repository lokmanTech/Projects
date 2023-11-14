<?php

// Check if file and entries are received
if (isset($_FILES['file']['tmp_name']) && isset($_POST['entries'])) {
    // Move uploaded file to desired location
    move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $_FILES['file']['name']);

    // Save entries to a file (you might want to use a database in a real scenario)
    $filename = 'ledger_data.txt';
    $content = "Entries:\n" . $_POST['entries'] . "\n\n";

    file_put_contents($filename, $content);

    // Respond with a success message
    $response = ['message' => 'Data saved successfully.'];
    echo json_encode($response);
} else {
    // Respond with an error message
    $response = ['message' => 'Error: No data received.'];
    echo json_encode($response);
}

?>
