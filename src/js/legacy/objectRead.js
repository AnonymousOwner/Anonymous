// START JAVASCRIPT

// Purpose: To deliver information on variables inside a data structure.
function cursorReturn() {
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   paper.on('cell:pointerdown', function (cellView) {

      var attrbs = [cellView.model.get('ambitype'), cellView.model.get('severity'), cellView.model.get('intentionality'), cellView.model.get('implementability'), cellView.model.get('regulatoryText'), cellView.model.get('regulatoryTextRef'), cellView.model.get('regulatoryID'), cellView.model.get('linkedArtifactID')];
      if (attrbs[0] === undefined) {
         document.getElementById("ambiguityInfo").innerHTML = "<b>You must select an Ambiguity</b>";
         selectArray.push(cellView.model.id);
      } else {
         selectArray.push(cellView.model.id);
         //		 console.log('Cell: ' + selectArray[0]);
         returnAmbiValue(attrbs);
      };
      cellView.highlight();
      console.log("Select Array: " + selectArray);
      copyAmbiguity();


   });
   paper.on('blank:pointerdown', function (evt, x, y) {
      document.getElementById("ambiguityInfo").innerHTML = "Please Click on an Ambiguity";
      var allCells = new Array();
      allCells = graph.getCells();
      for (var i = 0; i < allCells.length; i++) {
         var cellView = paper.findViewByModel(allCells[i]);
         cellView.unhighlight();
      };
      //alert(allCells);
      //cell.unhighlight();
      cellSelect = [];
      cellSelect.length = 0;
      console.log('Cell: ' + cellSelect[0]);
      clearPalette();
      selectArray = [];
   });

}

//needed to display the current ambiguity information.
function returnAmbiValue(attrbs){

   document.getElementById("ambiguityInfo").innerHTML = '<table><tr><th>Item</th><th>Information</th></tr><tr><td>Ambiguity type:</td><td>' + attrbs[0] + '</td></tr><tr><td>Severity:</td><td>' + attrbs[1] + '</td></tr><tr><td>Intentionality: </td><td>' + attrbs[2] + '</td></tr><tr><td>Implementability: </td><td>' + attrbs[3] + '</td></tr><tr><td>Regulatory Text: </td><td>' + attrbs[4] + '</td></tr><tr><td>Regulatory Text Reference: </td><td>' + attrbs[5] + '</td></tr><tr><td>Regulatory Text ID:</td><td>' + attrbs[6] + '</td></tr><tr><td>Linked Artifact ID: </td><td>' + attrbs[7] + '</td></tr></table>';

}
// needed to clear the palette
function clearPalette (){
   var dropDown = document.getElementById("ambigtype");
   dropDown.selectedIndex = 0;

   var dropDown = document.getElementById("severit");
   dropDown.selectedIndex = 0;

   var dropDown = document.getElementById("intentional");
   dropDown.selectedIndex = 0;

   var dropDown = document.getElementById("implementab");
   dropDown.selectedIndex = 0;

   var textbox = document.getElementById("rgrtyText");
   textbox.value = "Please add regulatory text here...";

   var textbox = document.getElementById("rgrtyTextRef");
   textbox.value = "Please add a regulatory text reference...";

   var textbox = document.getElementById("rgrtyTextID");
   textbox.value = "Please add the legal reference ID...";

   var textbox = document.getElementById("linkedArti");
   textbox.value = "Please add the legal reference ID...";
}


// Reserved for mouse over event
function mouseOverTxt() {
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;
   //console.log("Mousover Alive");

   paper.on('cell:mouseover', function (cellView, evt) {
      var attrbs = [cellView.model.get('ambitype'), cellView.model.get('severity'), cellView.model.get('intentionality'), cellView.model.get('implementability'), cellView.model.get('regulatoryText'), cellView.model.get('regulatoryTextRef'), cellView.model.get('regulatoryID'), cellView.model.get('linkedArtifactID')];
      //console.log("Yes.");
      if (attrbs[0] === undefined) {
         document.getElementById("ambiguityInfo").innerHTML = "<b>You must select an Ambiguity</b>";
      } else {
         console.log('Cell: ' + cellView.model.id);
         document.getElementById("ambiguityInfo").innerHTML = '<table><tr><th>Item</th><th>Information</th></tr><tr><td>Ambiguity type:</td><td>' + attrbs[0] + '</td></tr><tr><td>Severity:</td><td>' + attrbs[1] + '</td></tr><tr><td>Intentionality: </td><td>' + attrbs[2] + '</td></tr><tr><td>Implementability: </td><td>' + attrbs[3] + '</td></tr><tr><td>Regulatory Text: </td><td>' + attrbs[4] + '</td></tr><tr><td>Regulatory Text Reference: </td><td>' + attrbs[5] + '</td></tr><tr><td>Regulatory Text ID:</td><td>' + attrbs[6] + '</td></tr><tr><td>Linked Artifact ID: </td><td>' + attrbs[7] + '</td></tr></table>';
      };
      cellView.highlight();
   });
   paper.on('blank:pointerdown', function (evt, x, y) {
      document.getElementById("ambiguityInfo").innerHTML = "Please Click on an Ambiguity";
      var allCells = new Array();
      allCells = graph.getCells();
      for (var i = 0; i < allCells.length; i++) {
         var cellView = paper.findViewByModel(allCells[i]);
         cellView.unhighlight();
      };
      //alert(allCells);
      //cell.unhighlight();
   });
}

// Create ambiguities function. (Official)
function createAmbiguity() {
   //initialize these variables for model creation
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;
   paper.on('blank:contextmenu', function (evt, x, y) {
      if (document.getElementById("rightClick").value === "add") {
         // Variables needed for value capture
         var value = document.getElementById("ambigtype").value;
         if (value === "") {
            document.getElementById("warnings").innerHTML = "<h3>Warnings</h3><b>You must add an ambiguity value</b>";
         } else {
            var attrbs = [document.getElementById("ambigtype").value, document.getElementById("severit").value, document.getElementById("intentional").value, document.getElementById("implementab").value, document.getElementById("rgrtyText").value, document.getElementById("rgrtyTextRef").value, document.getElementById("rgrtyTextID").value, document.getElementById("linkedArti").value];
            //alert(attrbs[5] + " " + attrbs[6]);
            var inputAmbi = ambiguity(attrbs[0], attrbs[1], attrbs[2], attrbs[3], attrbs[4], attrbs[5], attrbs[6], attrbs[7], x, y, graph);

            clearPalette();
            //console.log(textbox.value);
            //console.log(attrbs[7]);
         }
      } else {
         alert("Please select the add button!");
      }
   });
}

// copying an ambiguity's information into the palette.
function copyAmbiguity(){
   //initialize these variables for model creation
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;
   // cellSelect
   var arrLen = selectArray.length-1;
   //console.log("Cell Select Last: " + selectArray[arrLen]);
   var cellView = paper.findViewByModel(selectArray[arrLen]);
   //console.log(cellView);
   var attrbs = [cellView.model.get('ambitype'), cellView.model.get('severity'), cellView.model.get('intentionality'), cellView.model.get('implementability'), cellView.model.get('regulatoryText'), cellView.model.get('regulatoryTextRef'), cellView.model.get('regulatoryID'), cellView.model.get('linkedArtifactID')];
   //console.log("Yes.");
   if (attrbs[0] === undefined) {
      document.getElementById("ambiguityInfo").innerHTML = "<b>You must select an Ambiguity</b>";
   } else {
      //console.log('Cell: ' + attrbs[0] + " " + attrbs[1] + " "+ attrbs[2] + " "+ attrbs[3] + " "+ attrbs[4] + " " + attrbs[5] + " ");
      document.getElementById("ambigtype").value = attrbs[0];
      document.getElementById("severit").value = attrbs[1];
      document.getElementById("intentional").value = attrbs[2];
      document.getElementById("implementab").value = attrbs[3];
      document.getElementById("rgrtyText").value = attrbs[4];
      document.getElementById("rgrtyTextRef").value = attrbs[5];
      document.getElementById("rgrtyTextID").value = attrbs[6];
      document.getElementById("linkedArti").value = attrbs[7];

   };

}

// used when the edit button is hit
function editAmbiguity() {
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;
   var value = document.getElementById("ambigtype").value;
   var value1 = document.getElementById("severit").value;
   var value2 = document.getElementById("intentional").value;
   var value3 = document.getElementById("implementab").value;
   if (value === "" && value1 === "" && value2 === "" && value3 === "") {
      document.getElementById("warnings").innerHTML = "<h3>Warnings</h3><b>You must add an ambiguity value</b>";
   } else {
      var attrbs = [document.getElementById("ambigtype").value, document.getElementById("severit").value, document.getElementById("intentional").value, document.getElementById("implementab").value, document.getElementById("rgrtyText").value, document.getElementById("rgrtyTextRef").value, document.getElementById("rgrtyTextID").value, document.getElementById("linkedArti").value];
      var arrLen = selectArray.length-1;
      var cellView = paper.findViewByModel(selectArray[arrLen]);
      cellView.model.attr('label/text', attrbs[0]);
      cellView.model.set('ambitype', attrbs[0]);
      cellView.model.set('severity', attrbs[1]);
      cellView.model.set('intentionality', attrbs[2]);
      cellView.model.set('implementability', attrbs[3]);
      cellView.model.set('regulatoryText', attrbs[4]);
      cellView.model.set('regulatoryTextRef', attrbs[5]);
      cellView.model.set('regulatoryID', attrbs[6]);
      cellView.model.set('linkedArtifactID', attrbs[7]);
      returnAmbiValue(attrbs);
      //console.log("I work");
   }

}
// links the ambiguities using the proper joint.js element.
function linkAmbiguity() {
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   var arrLen = selectArray.length-1;

   var cell1 = selectArray[arrLen-1];
   var cell2 = selectArray[arrLen];

   if (cell1 === undefined) {
      alert("Please select two (2) ambiguities!");
   } else if (cell2 === undefined) {
      alert("Please select one (1) more ambiguity!");
   } else if(selectArray.length > 2) {
      alert("Please select only two (<2) ambiguities!");

   } else {
      var link = new joint.dia.Link({
         attrs: {
            '.connection': { stroke: '#222138' },
            //'.marker-source': { fill: '#31d0c6', stroke: 'none', d: 'M 10 0 L 0 5 L 10 10 z' },
            '.marker-target': { fill: '#31d0c6', stroke: 'none', d: 'M 10 0 L 0 5 L 10 10 z' }
         },
         source: {
            id: cell1
         },
         target: {
            id: cell2
         }
      });
      graph.addCell(link);
      cell1 = null;
      cell2 = null;
   }
}


// Removes an ambiguity by using the delete button.
function removeAmbiguity() {
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   var indexVal = selectArray.length;

   for(var index = indexVal; index === 0; index--){
      console.log(index + " " + selectArray[index]);
   }
   if (document.getElementById("rightClick").value === "delete") {
      if (selectArray.length === 0) {
         alert("Please select an element!");
      } else {
         for(var index = 0; index < indexVal; index++){
            var cell = graph.getCell(selectArray[index]);
            console.log("Delete Cell: " + selectArray[index]);
            graph.removeLinks(cell);
            graph.removeCells(cell);
         }
         document.getElementById("ambiguityInfo").innerHTML = "Please Click on an Ambiguity";
         selectArray = [];
      }
   } else {
      alert("Please select the delete function!");
   }
}

// Still under construction
function dragRemoveAmbiguity(){
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   paper.on('blank:pointerdown', function (evt, x, y) {
      //document.getElementById("ambiguityInfo").innerHTML = "Please Click on an Ambiguity";
      // var allCells = new Array();
      //  allCells = graph.getCells();
      var bbox = graph.getBBox(graph.getElements());
      /*for (var i = 0; i < allCells.length; i++) {
         var cellView = paper.findViewByModel(allCells[i]);
      //cellView.unhighlight();*/
   });
   //console.log(bbox);
}

// https://codepen.io/fxaeberard/pen/reGvjm

// This is for the HTML display to show which function is selected in the add, delete, and link buttons.
function changeValue(id, newValue) {
   var el = document.getElementById(id);
   el.value = newValue; // change the value passed to the next page
   document.getElementById("rightClickWarn").innerHTML = "Function Selected: <b>" + el.value + "</b>"; // change the displayed text on the screen
   //alert(el.value);
   return false;
}

// This function is used to create a localstorage object from the graph.
function initTheGraph(graph) {
   var jsonData = JSON.stringify(graph);

   sessionStorage.setItem('exported.json', jsonData);
   //console.log("success");
   //console.log(sessionStorage.getItem('exported.json'));

}

// exports the graph to local storage.
function exprtGraph() {
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   var jsonData = JSON.stringify(graph);

   sessionStorage.setItem('exported.json', jsonData);
   console.log(sessionStorage.getItem('exported.json'));

};

// reads a file for import.
function rdfile(event){
   var graph = new joint.dia.Graph();

   var paper = new joint.dia.Paper({
      el: $('#canvasthinger'),
      width: 700,
      height: 900,
      model: graph,
      gridSize: 10
   });

   var input = event.target;
   var jsonData;
   var jsonParsed;
   var reader = new FileReader();
   reader.onload = function(){
      jsonData = reader.result;
      //console.log(jsonData);
      sessionStorage.setItem('exported.json', jsonData);
      //console.log(sessionStorage.length);
      //console.log(sessionStorage.getItem('exported.json'));
      paper.drawGrid();
      jsonParsed = JSON.parse(jsonData);
      graph.fromJSON(jsonParsed);
   };

   // No clue why sessionStorage isn't captured here... Seems to work though
   //console.log(sessionStorage.length);

   reader.readAsText(input.files[0]);

   document.getElementById("graphthinger").value = graph;
   document.getElementById("canvasthinger").value = paper;
   cursorReturn();

}

// creates the exported json.
function download() {

   var digest = sessionStorage.getItem('exported.json');
   var d = new Date();
   var day = d.getDay();
   if(day <10){
      day = "0" + day;
   }
   var month = d.getMonth() + 1;
   if( month <10 ){
      month = "0" + month;
   }
   var year = d.getFullYear();
   var hour = d.getHours();
   if( hour <10 ){
      hour = "0" + hour;
   }
   var minute = d.getMinutes();
   if(minute <10){
      minute = "0"+ minute;
   }
   var seconds = d.getSeconds();
   if(seconds<10){
      seconds = "0" + seconds;
   }

   var timestamp = year + "" +  month + day + "-" + hour +  minute + seconds ;
   console.log(timestamp);
   var filename = "AmbiguityModel_"+ timestamp + "_version-0.3.json";

   var pom = document.createElement('a');
   pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(digest));
   pom.setAttribute('download', filename);

   if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
   } else {
      pom.click();
   }
}

function CreateTerminal(){
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   // The position of the start and stop are based on the width and height
   // of the paper in the canvas.
   var termXposition = paper.options.width/2;
   var termYpositionInit = paper.options.height/8;
   var termYpositionFinal = paper.options.height * 7/8;

   // There could be away to add some logic in this function, to determine
   // if there is already terminals.  As it is you can just create the terminals
   // and delete any excess terminals (you could also spam the console).

   terminal("Start", termXposition, termYpositionInit, graph, "white", "black");
   terminal("Stop", termXposition, termYpositionFinal, graph, "black", "white");
}

function canvasColor(){
   var graph = document.getElementById("graphthinger").value;
   var paper = document.getElementById("canvasthinger").value;

   var dropDown = document.getElementById("canvasClr");
   if(dropDown.value == null){
      alert("You must return a value!");
   }else{
      paper.drawBackground({color: dropDown.value});
   }
   dropDown.selectedIndex = 0;
}
// END OF JAVASCRIPT.
