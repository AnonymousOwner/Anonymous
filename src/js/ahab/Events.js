// HTML EVENTS
document.getElementById("importGraph").onchange = (event) => {
  // check if we got a file and call the file handler
  let input = event.target;
  if (input.files && input.files[0]) {
    console.log(input.files);
    let file = input.files[0];
    fileHandler.loadFile(file);
  }
};

document.getElementById("exportGraph").onclick = (event) => {
  AHAB.ModelController.saveToJSON(document.getElementById("rgrtyTextID").value);
  //AHAB.Log.exportingLog();
};

document.getElementById("exportLog").onclick = (event) => {
  AHAB.Log.exportingLog();
};

document.getElementById("addPerspective").onclick = (event) => {
   //prompt the user to enter a new perspective
   let perspective = prompt("Please enter your name:", "default");

   // if the user leaves the input blank, set the perspective to "default"
   if (perspective == null || perspective == "") {
     perspective = "default";
   }

   // add new perspective
   AHAB.ModelController.addPerspective(perspective);

   // update the UI
   AHAB.Helpers.updatePerspectiveButtons(AHAB.ModelController.data.perspectives);

   // make the current user the newest user.
   AHAB.Helpers.setRadio("perspective", perspective);

   AHAB.Helpers.logItem(`User perspective created: ${perspective}`, logTypes.DATA);
}

document.getElementById("mergeAmbiguity").onclick = () => {
  AHAB.ModelController.mergeCell();
};
document.getElementById("split").onclick = () => {
  AHAB.ModelController.splitCell();
};

//saves the logfile on window close
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
  let digest = sessionStorage.getItem("logfile.txt");
  let str = `${timeStamp()}: -----------AHAB CLOSING - LOGFILE END!---------------"`;
  sessionStorage.setItem("logfile.txt", digest + "\n" + str);
  AHAB.Log.downloadLog("logfile.txt");
});
