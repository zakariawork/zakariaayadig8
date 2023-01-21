<?php
$u_id = $_POST["id"];
$username = $_POST["username"];
$password = $_POST["password"];
$email = $_POST["email"];
$phone = $_POST["phone"];

	// Database connection
	$conn = new mysqli('localhost','root','','online_rest');
	if($conn->connect_error){
		echo "$conn->connect_error";
		die("Connection Failed : ". $conn->connect_error);
	} else {
		$stmt = $conn->prepare("insert into registration(id, username,pass, email, phone) values(?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $u_id, $username, $password, $email, $phone);
		$execval = $stmt->execute();
		echo $execval;
		header('Location: account.html');
		$stmt->close();
		$conn->close();
	}
?>
