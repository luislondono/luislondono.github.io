
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
