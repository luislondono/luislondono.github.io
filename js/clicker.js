window.onload = setupClicker

function setupClicker(){
  console.log("Setting up clicker")
  firebase.firestore().collection("clicker").doc("click-count").get().then(function(doc) {
    // console.log(this)
    this.document.getElementById('click-amount').innerText = doc.data()["count"]
  })
}

function handleClicker(){
  console.log("Clicked!")
  const new_count = parseInt(document.getElementById('click-amount').innerText) + 1
  firebase.firestore().collection("clicker").doc("click-count").get().then(function(doc) {
    // console.log(this)
    this.document.getElementById('click-amount').innerText = new_count
  })
  firebase.firestore().collection("clicker").doc("click-count").set({count: new_count})
}