window.onload = setupClicker;

function setupClicker() {
  var firebaseConfig = {
    apiKey: "AIzaSyCSFoOcUMAULAn6ScMSgygfS_fZcnVTpSk",
    authDomain: "luislondono-com.firebaseapp.com",
    databaseURL: "https://luislondono-com.firebaseio.com",
    projectId: "luislondono-com",
    storageBucket: "luislondono-com.appspot.com",
    messagingSenderId: "851373763529",
    appId: "1:851373763529:web:c171fe15b7d82883"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log("Setting up clicker");
  firebase
    .firestore()
    .collection("clicker")
    .doc("click-count")
    .get()
    .then(function(doc) {
      // console.log(this)
      this.document.getElementById("click-amount").innerText = doc.data()[
        "count"
      ];
    });
}

function handleClicker() {
  console.log("Clicked!");
  const new_count =
    parseInt(document.getElementById("click-amount").innerText) + 1;
  firebase
    .firestore()
    .collection("clicker")
    .doc("click-count")
    .get()
    .then(function(doc) {
      // console.log(this)
      this.document.getElementById("click-amount").innerText = new_count;
    });
  firebase
    .firestore()
    .collection("clicker")
    .doc("click-count")
    .set({ count: new_count });
}
