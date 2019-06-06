window.onload = updateMessageBoard
let messageBoard;
let messageBoardPosts = []
const emptyMessageBoardElement = '<div class = "message-board-post"><h3> No posts have been made :( </h3></div>'



async function updateMessageBoard() {
  messageBoard = firebase.firestore().collection("anonymousMessageBoard")

  await messageBoard.orderBy("Date").get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        messageBoardPosts.push(doc.data());
      });
    }).then(function () {

      if (messageBoardPosts.length == 0) {
        document.getElementById("message-board-posts").innerHTML = emptyMessageBoardElement
      }
      else {
        messageBoardPosts.forEach(post => {
          addPostToMessageBoard(post)
        });
      }
    })
}



function addPostToMessageBoard(postObject) {
  const newpost = '<div class = "message-board-post"><div class="message-board-post-question"> Q: ' + postObject["Question"] + '</div><div class="message-board-post-answer">' + `${postObject["Answer"] == undefined ? "Unanswered..." : 'A: ' + postObject["Answer"]}` + '</div></div>'

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
    post["Date"] = new Date().toGMTString()
    post["Question"] = document.getElementById("submittor-question-field").value
    console.log("Clicked!")
    messageBoard.doc().set({ Date: post["Date"], Question: post["Question"] })

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