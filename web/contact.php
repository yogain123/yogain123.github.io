<?php
if(isset($_POST["submit"])){
$hostname='localhost';
$username='root';
$password='';



 /*$email = $_POST["email"];
  //$headers= "From: help_poor@bloomingbeacon.org";
  $ph = $_POST["phno"];
  $msg = $_POST["comment"]."   ".$ph."    ".$_POST["name"]."      ".$email;
  $yogi = "bloomingbeacon.official@gmail.com";
  
  $headers = "From: help_poor@bloomingbeacon.org";
  $headers .= "\r\nReply-To: help_poor@bloomingbeacon.org";
  $headers .= "\r\nX-Mailer: PHP/".phpversion();   */
  






try {
$dbh = new PDO("mysql:host=$hostname;dbname=yogendra","root","");

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // <== add this line
$sql = "INSERT INTO details (name, email, phno , comment)
VALUES ('".$_POST["name"]."','".$_POST["email"]."','".$_POST["phno"]."' , '".$_POST["comment"]."')";
if ($dbh->query($sql))
 {
    //mail($yogi,"Blooming Beacon", $msg, $headers,"-f help_poor@bloomingbeacon.org");
    echo "<script type= 'text/javascript'>


<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Modal title</h4>
      </div>
      <div class="modal-body">
        <p>One fine body&hellip;</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->



    </script>";
}
else
{
    echo "<script type= 'text/javascript'>alert('Message Sent Failed');</script>";
}

$dbh = null;
}
catch(PDOException $e)
{
echo $e->getMessage();
}

}
?>