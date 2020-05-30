
function changeContent(description) {
        console.log(description);
        var MyDesc = document.getElementById(description);
        document.getElementById('content').innerHTML = MyDesc.value;
}

function hover(description, description_id) {
        console.log(description);
        document.getElementById(description_id).innerHTML = description;
        console.log("Hover is being executed")
}

function passwordProtect(){
  console.log("Password form is being executed")
  var password;
  var correctpassword = "pleaseandthankyou";
  password= prompt('Please enter in the password to view this page', '');
  if (password == correctpassword)
  alert('Password is correct. Click ok to enter...');
  else {
    window.location="resume"
  }
}

function foo(){
  alert('foo is being executed');
  console.log('foo is being executed');
}
