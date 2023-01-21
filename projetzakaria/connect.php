<?php
    $password = $_POST["password"];
    $email = $_POST["email"];
    
   
	// Database connection
	$conn = new mysqli('localhost','root','','online_rest');
	if($conn->connect_error){
		echo "$conn->connect_error";
		die("Connection Failed : ". $conn->connect_error);
	} else {
        
		$sql = "SELECT * FROM registration WHERE email = '$email' AND pass = '$password'";
        $result = $conn->query($sql);
       

if ($result->num_rows > 0) {
    // The provided email$email and password match a user in the database
    $_SESSION["logged_in"] = true;
    $_SESSION["email"] = $email;
    header('Location: order.html');
    exit;
    
} else {
    // The provided email$email and password do not match a user in the database
    $_SESSION["logged_in"] = false;
    header("Location: login.php?error=invalid_credentials");
    exit;
}

		$conn->close();
	}
    
?>

