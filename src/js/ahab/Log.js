AHAB.Log={
// creates a logfile for all activity
//logfile() is only called in main.js
logfile() {
  var str =
    timeStamp() + ": -----------OPENING LOGFILE FOR LOGGING!---------------";
  sessionStorage.setItem("logfile.txt", str);
  var logfileKey = "logfile.txt";
  //downloadLog(logfileKey);
},
exportingLog(){
  let digest = sessionStorage.getItem("logfile.txt");
  let str = `${timeStamp()}: Logfile is being exported by clicking the export button."`;
  sessionStorage.setItem("logfile.txt", digest + "\n" + str);
  AHAB.Log.downloadLog("logfile.txt");
},
//downloadLog is called in event.js
downloadLog(logfileKey) {
  let d = JSON.stringify(AHAB.ModelController.data);
  AHAB.Helpers.logItem(`JSON File: ${d}`);
  var digest = sessionStorage.getItem(logfileKey);
  var time = timeStamp();
  var pom = document.createElement("a");
  pom.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(digest)
  );
  pom.setAttribute("download", time + "_AHAB_logfile.txt");
  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}
}
