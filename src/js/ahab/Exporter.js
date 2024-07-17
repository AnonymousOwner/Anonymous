AHAB.Exporter={
// create a tabular view from all the nodes in the graph
//tabularview() is called by tabular Output in AHAB.html
tabularView() {
  var graph = AHAB.JointJSWrapper.graph;
  var paper = AHAB.JointJSWrapper.paper;
  var cellArray = graph.getCells();
  const output1 = [];
  var win = window.open("", "_blank");
  win.document.write(`<title>AHAB Graph Output</title>
    <h1>AHAB Graph Output</h1><p>
    <div>
    <table class='table table-hover'>
    <thead class='thead-dark'>
      <tr>
        <th scope='col'>Element Type</th>
        <th scope='col'>ID</th>
        <th scope='col'>NAME</th>
        <th scope='col'>USER</th>
        <th scope='col'>Ambiguity Type</th>
        <th scope='col'>Severity</th>
        <th scope='col'>Intentionality</th>
        <th scope='col'>Implementability</th>
        <th scope='col'>Regulatory Text</th>
        <th scope='col'>Regulatory Text ID</th>
        <th scope='col'>Notes</th>
      </tr>
    </thead>
    <tbody>`);
  cellArray.forEach(function (cellArray) {
    var cellView = paper.findViewByModel(cellArray.id);

    if (cellView.model.get("type") === "terminal.Element") {
      if (cellView.model.get("label/text") === "Stop") {
        output1.push(
          "<tr><td>Terminal Element</td><td>" +
            cellArray.id +
            "</td><td>Stop</td></tr>"
        );
      } else {
        output1.push(
          "<tr><td>Terminal Element</td><td>" +
            cellArray.id +
            "</td><td>Start</td></tr>"
        );
      }
    } else if (cellView.model.get("type") === "link") {
      output1.push(`<tr><td>Link</td><td>${cellArray.id}</td></tr>`);
    } else if (cellView.model.get("type") === "ambiguity.Element") {
      let perspectives = AHAB.ModelController.data.perspectives;
      //perspectives.forEach(function (perspectives) {
        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);
        console.log(display);
        if (display !== undefined || display.type!="terminal.Element") {
          var tabularDisplay = `<tr>
              <td>Ambiguity Element</td>
              <td>${cellArray.id}</td>
              <td>${cellView.model.attr("label/text")}</td>
              <td>${display.perspectives}</td>
              <td>${display.ambitype}</td>
              <td>${display.severity}</td>
              <td>${display.intentionality}</td>
              <td>${display.implementability}</td>
              <td>${display.regulatoryText}</td>
              <td>${display.regulatoryTextID}</td>
              <td>${display.notesText}</td>
            </tr>`;
          output1.push(tabularDisplay);
        }
      //});
    } else {
      // ERROR CONDITION
      AHAB.Helpers.logItem(`Error: ${idMe}`);
    }
  });

  output1.forEach((element) => {
    win.document.write(element);
  });
  win.document.write("</tbody></table></div>");
  win.document.write("<style>table, th, td {border: 1px solid black;}</style>");
  win.document.write("<link rel='stylesheet' href='css/bootstrap.css'/>");
  var logEvent = "Graph Exported to Table";
  AHAB.Helpers.logItem(logEvent);
},
// Functionality broken supposed to save an PNG file.
//this is only called in AHAB.html
savePicture() {
  var graph = AHAB.JointJSWrapper.graph;
  var paper = $("#paperBox").first();
  var win = window.open("", "_blank");
  html2canvas(document.querySelector("#paperBox")).then((canvas) => {
    if (canvas === null) {
    } else {
      win.document.body.appendChild(canvas);
    }
  });
  var logEvent = "Picture Exported";
  AHAB.Helpers.logItem(logEvent);
},
sendDataToAnotherJsFile(){
  console.log(`sending the data: ${{ahabModelData:AHAB.ModelController.data, texts: AHAB.LegalTextPanel.dict1}}`);
  let ch = new BroadcastChannel("ahabData");
  console.log("broadcast channel is opened.")
  ch.onmessage= function(e){
    if(e.data == "ready"){
      ch.postMessage({ahabModelData:AHAB.ModelController.data, texts: AHAB.LegalTextPanel.dict1});
    }
    if(e.data == "Got Message"){
      ch.close();
      console.log("broadcast channel is closed.")
    }
  }
}
}