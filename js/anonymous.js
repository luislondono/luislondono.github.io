window.onload = updateMessageBoard
let messageBoard;
let messageBoardPosts = []
let clientInfo;
let numQuestionsToday = 0;
const emptyMessageBoardElement = '<div class = "message-board-post"><h3> No posts have been made :( </h3></div>'



async function updateMessageBoard() {
  // getClientInfo()
  messageBoard = firebase.firestore().collection("anonymousMessageBoard")

  await messageBoard.orderBy("date").get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        messageBoardPosts.push(doc.data());
      });
    }).then(getClientInfo()).then(function () {
      console.log("Line 20:")
      console.log(clientInfo)

      if (messageBoardPosts.length == 0) {
        document.getElementById("message-board-posts").innerHTML = emptyMessageBoardElement
      }
      else {
        messageBoardPosts.forEach(post => {
          addPostToMessageBoard(post)
          if(post["ip"] == clientInfo["ip"] && sameDay(Date.parse(post["date"]).toGMTString(), Date()) ) {
            numQuestionsToday += 1;
          }
        });
      }


    })
}



function addPostToMessageBoard(postObject) {
  const newpost = '<div class = "message-board-post"><div class="message-board-post-question"> Q: ' + postObject["question"] + '</div><div class="message-board-post-answer">' + `${postObject["answer"] == "" ? "Unanswered..." : 'A: ' + postObject["answer"]}` + '</div></div>'

  if (messageBoardPosts.length == 0) {
    document.getElementById("message-board-posts").innerHTML = newpost;
    messageBoardPosts.push(newpost)
  }
  else {
    document.getElementById("message-board-posts").innerHTML += newpost
  }

}



function handleSubmit() {
  questionField = document.getElementById("submittor-question-field").value

  if (questionField.trim() == "") {
    return
  }
  else {

    let post = {}
    post["date"] = new Date().toGMTString()
    post["question"] = document.getElementById("submittor-question-field").value
    console.log("Clicked!")
    messageBoard.doc().set({ date: post["date"], question: post["question"] ,ip: clientInfo["ip"], answer: ""})

    addPostToMessageBoard(post)
  }
}


async function DeleteAllPosts() {
  await messageBoard.get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        messageBoard.doc(doc.id).delete()
      });
    }).then(function () {
      messageBoardPosts = [];
      updateMessageBoard()
    })
}

function getClientInfo(){
  console.log("Getting clientInfo...")

  url = 'https://json.geoiplookup.io/'

  httpGetAsync(url, resp => {
    clientInfo = JSON.parse(resp)
  })
}

function httpGetAsync(theUrl, callback){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


function sameDay(d1, d2){
  console.log("d1: ", d1, "\nd2: ",d2)
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}