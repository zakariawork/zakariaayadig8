<?php
if(isset($_POST["item1"])){
	$item1 = $_POST["item1"];
}
if(isset($_POST["item2"])){
	$item2 = $_POST["item2"];
}
if(isset($_POST["item3"])){
	$item3 = $_POST["item3"];
}
if(isset($_POST["item4"])){
	$item4 = $_POST["item4"];
}
if(isset($_POST["item5"])){
	$item5 = $_POST["item5"];
}

if(isset($_POST["qte1"])){
	$qte1 = $_POST["qte1"];
}
if(isset($_POST["qte2"])){
	$qte2 = $_POST["qte2"];
}
if(isset($_POST["qte3"])){
	$qte3 = $_POST["qte3"];
}
if(isset($_POST["qte4"])){
	$qte4 = $_POST["qte4"];
}
if(isset($_POST["qte5"])){
	$qte5 = $_POST["qte5"];
	if($qte1!=0){
		$order=$item1;
		$qte=$qte1;
	}
	if($qte2!=0){
		$order.=";".$item2;
		$qte.=";".$qte2;
	}
	if($qte3!=0){
		$order.=";".$item3;
		$qte.=";".$qte3;
	}
	if($qte4!=0){
		$order.=";".$item4;
		$qte.=";".$qte4;
	}
	if($qte5!=0){
		$order.=";".$item5;
		$qte.=";".$qte5;
	}
}

if(isset($_POST["street"])){
	$street = $_POST["street"];
}
if(isset($_POST["loc"])){
	$loc = $_POST["loc"];
}
if(isset($_POST["city"])){
	$city = $_POST["city"];
}
if(isset($_POST["code"])){
	$code = $_POST["code"];
}
if(isset($_POST["landmark"])){
	
$landmark = $_POST["landmark"];
}
if(isset($_POST["state"])){
	$state = $_POST["state"];
	$adresse =$street." ".$loc." ".$city." ".$code." ".$landmark." ".$state;
}






if(empty($adresse)){
	// Database connection
	$conn = new mysqli('localhost','root','','online_rest');
	if($conn->connect_error){
		echo "$conn->connect_error";
		die("Connection Failed : ". $conn->connect_error);
	} else {
		$stmt = $conn->prepare("insert into orders(orderId,orderp,quantity,adress) values(DEFAULT, ?, ?, null)");
		$stmt->bind_param("ss", $order, $qte);
		$execval = $stmt->execute();
		echo $execval;
		header('Location: account.html');
		$stmt->close();
		$conn->close();
	}
	header('Location: address.html');
}else {
	// Database connection
	$conn = new mysqli('localhost','root','','online_rest');
	if($conn->connect_error){
		echo "$conn->connect_error";
		die("Connection Failed : ". $conn->connect_error);
	} else {
		$stmt = $conn->prepare("update orders set adress = ? where adress is null");
		$stmt->bind_param("s", $adresse);
		$execval = $stmt->execute();
		echo $execval;
		header('Location: index.html');
		$stmt->close();
		$conn->close();
	}

}
	
?>