<?php
include("Connection_08.php");
$path = $_POST["path"];
// echo $path;


$sql = 
"SELECT p.ProductName, p.ProductPrice, p.ProductText, p.Location, p.ProductSecondType, i.ProductImgPath,i.ProductID
FROM Product p
join ProductImg i 
on p.ProductID =  i.ProductID
where p.ProductStatus = 1 and p.ProductType = ? ";




$statement =  getcon()->prepare($sql);

if($path == "/Weeee/dist/productlist_new_travel.html"){
    $statement->bindValue(1, "sightseeing");
}
else
if($path == "/Weeee/dist/productlist_new_ticket.html"){
    $statement->bindValue(1, "transticket");
}
else
if($path == "/Weeee/dist/productlist_new_exp.html"){
    $statement->bindValue(1, "experience");
 }
elseif($path == "/Weeee/dist/productlist_new_ss_ticket.html"){
    $statement->bindValue(1, "viewpointticket");
}


$statement->execute();
$data = $statement->fetchAll();

//回傳json

echo json_encode($data);


?>