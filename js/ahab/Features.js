// START JAVASCRIPT

//next function is written to be used for resizing the textareas in the attribute panel
function resizeTextarea(txtarea, minh=32)
{
  txtarea.css('height', minh + 'px');
  var s_h = txtarea.get(0).scrollHeight + 3;
  txtarea.css('height', s_h + 'px');
}

$('#notesText').on('change', (event) => resizeTextarea($('#notesText')));
$('#rgrtyText').on('change', (event) => resizeTextarea($('#rgrtyText')));
$('#notesText').on('scroll', (event) => resizeTextarea($('#notesText')));
$('#rgrtyText').on('scroll', (event) => resizeTextarea($('#rgrtyText')));

// START QUICK FIX
// Make a holder for functions if not in node. At the end of file, convert module functions to global functions. This is to preserve the application running until I look into making it an Express app.
var inBrowser = false;
if (typeof exports === "undefined") {
  window.exports = {};
  inBrowser = true;
}
// END QUICK FIX

// -=-=-=-=-=-=-=-=-=-=-=-=-=-
// View Model Functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-

  /**
   * Selects a cell by adding it to the cell array and displaying the tools.
   * @param {object} cellView - a Joint JS cell view
   */
  /*function selectCell(cellView) {
    let element = cellView.model;

    // Select the clicked element or link
    selectArray.push(element.id);

    // For elements, display the tools and info
    if (element.get("type") == "ambiguity.Element") {
      cellView.addTools(ambiguityToolsView);
      cellView.showTools();
      cellView.highlight();
      let cell = AHAB.ModelController.data.cells[element.id]
      AHAB.Helpers.displayCellInfo(cell, element.id);
      exports.setSelectionRange(document.getElementById("CapDisplay"), cell.textPosition[0], cell.textPosition[1]);
    } else if (element.get("type") == "terminal.Element") {
      cellView.addTools(otherToolsView);
      cellView.showTools();
      cellView.highlight();
    }

    exports.logItem(`Selected Entity: ${cellView.model.id}`, logTypes.INTERFACE);
  }*/
  //// TODO: Change this long function to its own object with various methods to avoid duplication and simplify the variables and organization. This is why selectCell is a function at the moment.
  //paper.on("cell:pointerdown", selectCell);
  //paper.on({
  //  "blank:pointerdown": function (evt, x, y) {
  //    var allCells = new Array();
  //    allCells = graph.getCells();
  //    paper.setInteractivity(false); // removes the interactivity block
  //    // for loop for array of cells can't be replaced with map() or forEach() easily.
  //    for (var i = 0; i < allCells.length; i++) {
  //      var cellView = paper.findViewByModel(allCells[i]); // gets all of the cells in the model.
  //      if (cellView.model.attr("info") === true) {
  //        cellView.unhighlight();
  //        cellView.remove();
  //      } else {
  //        cellView.unhighlight();
  //        cellView.hideTools();
  //      }
  //    }
  //    cellSelect = [];
  //    cellSelect.length = 0;
  //    if (cellView === undefined) {
  //      //DO NOTHING
  //    } else if (document.getElementById("editReadOnlyMode").checked) {
  //      window.getSelection().empty();
  //      selectArray = [];
  //      return;
  //    } else if (selectArray === null) {
  //      selectArray = [];
  //      window.getSelection().empty();
  //      return;
  //    } else {
  //      var perspective = AHAB.Helpers.checkRadio("perspective");
  //      if (perspective === undefined || perspective === "default") {
  //        selectArray = [];
  //        AHAB.Helpers.setRadio("perspective", "default");
  //        document.getElementById("editReadOnlyMode").checked = true;
  //        alert("In Default User -- Setting Input to Read Only\nUncheck 'Input Read Only' to exit Read Only mode");
  //        var arr1 = new Array();
  //        arr1 = paper.drawBackground();
  //        //console.log(arr1);
  //        paper.drawBackground({
  //          color: "orange",
  //        });
  //        return; // No user return out.
  //      }
  //      var arrLen = selectArray.length - 1;
  //      var cellView = paper.findViewByModel(selectArray[arrLen]);
  //      if (cellView === undefined) {
  //        return;
  //      }
  //      var cell = graph.getCell(cellView.model.id);
  //      if (cell.isLink() === true) {
  //        //var attrbs = [document.getElementById("linkWeight").value];
  //        var link = graph.getCell(cellView.model.id);
  //      } else {
  //        if (cellView.model.get("type") === "terminal.Element") {
  //          //DO NOTHING
  //        } else {
  //          //perspective = myAlertBox();
  //          if (perspective === "default") {
  //            selectArray = [];
  //            setRadio("perspective", "default");
  //            //console.log(perspective);
  //            return;
  //          }
  //          // Set the modifications to the data

  //          colorGraph();
  //          colorChange(AHAB.Helpers.checkRadio("ambiguity"));
  //        }
  //      }
  //    }
  //    AHAB.Helpers.clearPalette();
  //    var highValue = $("#highlight").val();
  //    switch (highValue) {
  //      case "0":
  //        AHAB.Highlight.unhilite(document.getElementById("CapDisplay"), "white");
  //        break;
  //      case "1":
  //        break;
  //      case "2":
  //        AHAB.Highlight.unhilite(document.getElementById("CapDisplay"), "white");
  //        break;
  //    }
  //    selectArray = [];
  //    dragging = true;
  //    lastX = x;
  //    lastY = y;
  //    evt.preventDefault();
  //    window.getSelection().empty();
  //    exports.logItem("User Selected blank area on paper", logTypes.INTERFACE);
  //  },
  //  "blank:pointermove": function (evt, x, y) {
  //    var scale = paper.scale().sx;
  //    if (dragging) {
  //      var deltaX = (x - lastX) * scale;
  //      var deltaY = (y - lastY) * scale;
  //      lastX = x;
  //      lastY = y;
  //      marginLeft += deltaX;
  //      marginTop += deltaY;
  //      paper.translate(marginLeft, marginTop);
  //    }
  //    evt.preventDefault();
  //  },
  //  "blank:pointerup": function (evt) {
  //    dragging = false;
  //    paper.setInteractivity(true);
  //  },
  //});
  //linkElement();
//}


//Re-addedAfterMerge
//builds an info box in HTML.
/*function informaticBox(perspectives, display, cellView) {
  var cloneLabel = `<tr>
      <td>${perspectives}</td>
      <td>${display.notesText}</td>
      <td>${display.ambitype}</td>
      <td>${display.severity}</td>
      <td>${display.intentionality}</td>
      <td>${display.implementability}</td>
      <td style="word-wrap: break-word; min-width: 190px; max-width: 190px">
        ${display.regulatoryText}
      </td>
      <td>${cellView.model.get('regulatoryID')}</td>
      <td>${cellView.model.get('linkedArtifactID')}</td>
    </tr>`;

  return cloneLabel;
}

$("#mergeAmbiguity").on("click", function () {
  mergeAmbiguityElement();
});

$("#split").on("click", function () {
  splitAmbiguityElement();
});

// Purpose: To deliver information on variables inside a data structure.
function cursorReturn() {
  var graph = document.getElementById("graphthinger").value;
  var paper = document.getElementById("paperBox").value;
  var dragging = false;
  var lastX, lastY;
  var marginLeft = 0;
  var marginTop = 0;

  var infoTool = new joint.elementTools.Button({
    markup: [
      {
        tagName: "circle",
        selector: "button",
        attributes: {
          r: 7,
          fill: "#001DFF",
          cursor: "pointer",
        },
      },
      {
        tagName: "path",
        selector: "icon",
        attributes: {
          d: "M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4",
          fill: "none",
          stroke: "#FFFFFF",
          "stroke-width": 2,
          "pointer-events": "none",
        },
      },
    ],
    x: "100%",
    action: function (evt) {
      //Reads the item and outputs the value into a display.
      var perspective = checkRadio("perspective");
      var cellView = this;
      if (cellView.model.get("type") === "ambiguity.Element") {
        var cloneTable = new Array();
        perspectives.forEach((perspectives, index) => {
          var display = cellView.model.get(perspectives);
          if (display !== undefined) {
            cloneTable.push(informaticBox(perspectives, display, cellView));
          }
        });
        var cloneHeading = `<table class="table table-bordered table-sm">
            <thead class="thead-dark">
              <tr>
                <th>Perspective</th>
                <th>Notes</th>
                <th>Attribute Type</th>
                <th>Severity</th>
                <th>Intentionality</th>
                <th>Implementability</th>
                <th>Regulatory Text</th>
                <th>Regulatory ID</th>
                <th>Linked Artifact ID</th>
              </tr>
            </thead>`;
        $("#dragInfo").html(
          cloneHeading + "<tbody>" + cloneTable.join("") + "</tbody></table>"
        );
        $("#draggable").show();
      } else {

        // Needed to remove any issues with trying to read a non-ambiguity.Element
        exports.logItem(`Model id: ${cellView.model.id}\n\t Element type: ${cellView.model.get("type")}`);

      }
      exports.logItem(`Info Box Pressed on model:  ${cellView.model.id}`, logTypes.INTERFACE);
    },
  });
  var removeTool = new joint.elementTools.Remove({
    rotate: true,
    action: function (evt, elementView, toolView) {
      exports.logItem(`Removed model: ${this.model.id}`);
      elementView.model.remove({ ui: true, tool: toolView.cid });
    },
  });
  var compareTool = new joint.elementTools.Button({
    rotate: false,
    markup: [
      {
        tagName: "circle",
        selector: "button",
        attributes: {
          r: 7,
          fill: "#F0F00F",
          cursor: "pointer",
        },
      },
      {
        tagName: "path",
        selector: "icon",
        attributes: {
          //'d': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
          d: "M -2 -2 H 2 V 2 H 2 2 Z",
          fill: "none",
          stroke: "#000000",
          "stroke-width": 2,
          "pointer-events": "none",
        },
      },
    ],
    x: "100%",
    offset: { x: -90, y: 90 },
    action: function (evt) {
      var perspective = checkRadio("perspective");
      var cloneTable = new Array();
      var logTable = new Array();
      var cloneHeading = `<table class="table table-bordered table-sm">
          <thead class="thead-dark">
            <tr>
              <th>Perspective</th>
              <th>Notes</th>
              <th>Attribute Type</th>
              <th>Severity</th>
              <th>Intentionality</th>
              <th>Implementability</th>
              <th>Regulatory Text</th>
              <th>Regulatory ID</th>
              <th>Linked Artifact ID</th>
            </tr>
          </thead>`;
      var compare = $("#comparable");
      selectArray.forEach((element) => {
        var cellView = paper.findViewByModel(graph.getCell(element));
        if (cellView.model.get("type") === "ambiguity.Element") {
          perspectives.forEach((perspectives, index) => {
            var display = cellView.model.get(perspectives);
            if (display !== undefined) {
              cloneTable.push(informaticBox(perspectives, display, cellView));
              logTable.push(cellView.model.id);
            }
          });
        } else {
          // Needed to remove any issues with trying to read a non-ambiguity.Element
          exports.logItem(`Model id: ${cellView.model.id}\n\t Element type: ${cellView.model.get("type")}`);
        }
      });
      var printArray = [...new Set(cloneTable)];
      var logPrintArray = [...new Set(logTable)];
      $("#comparableInfo").html(
        cloneHeading + "<tbody>" + printArray.join("") + "</tbody></table>"
      );
      compare.show();
      exports.logItem(`Compare Model Pressed on: ${this.model.id} comparing ids: ${logPrintArray}`);
    },
  });
  var boundaryTool = new joint.elementTools.Boundary({
    focusOpacity: 0.5,
  });
  var copyTool = new joint.elementTools.Button({
    rotate: false,
    markup: [
      {
        tagName: "circle",
        selector: "button",
        attributes: {
          r: 7,
          fill: "#000000",
          cursor: "pointer",
        },
      },
      {
        tagName: "circle",
        selector: "icon",
        attributes: {
          //'d': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
          r: 3,
          fill: "#000000",
          stroke: "#FFFFFF",
          "stroke-width": 2,
          "pointer-events": "none",
        },
      },
    ],
    x: "100%",
    offset: { x: 0, y: 90 },
    action: function (evt) {
      var clone = this.model.clone();

      //clone.position(50, 50);
      var orginPos = this.model.position();
      console.log(orginPos);
      var delta = {
        x: 50 + orginPos.x,
        y: 50 + orginPos.y,
      };
      console.log(delta);
      clone.set("position", delta);
      clone.addTo(graph);
      exports.logItem(`Cloned model: ${this.model.id} adding model: ${clone.id}`);
    },
  });
  var ambiguityToolsView = new joint.dia.ToolsView({
    tools: [infoTool, boundaryTool, copyTool, removeTool, compareTool],
  });
  var otherToolsView = new joint.dia.ToolsView({
    tools: [removeTool],
  });
  function toolsAddition(cellView) {
    cellView.addTools(ambiguityToolsView);
    cellView.hideTools();
  }

  paper.on("cell:pointerdown", function (cellView, evt) {
    var perspective = checkRadio("perspective");
    var display = cellView.model.get(perspective);
    var type = cellView.model.get("type");
    var cell = graph.getCell(cellView.model.id);

    if (cell.isLink() === true) {
      selectArray.push(cellView.model.id);
    } else if (type !== "ambiguity.Element") {
      selectArray.push(cellView.model.id);
      cellView.addTools(otherToolsView);
      cellView.showTools();
      cellView.highlight();
    } else {
      perspectives.forEach((perspectives, index) => {
        display = cellView.model.get(perspectives);
        if (display === undefined) {
        } else {
          displayText(
            display.ambitype,
            display.regulatoryTextXpos,
            display.regulatoryTextYpos
          );
        }
      });
      selectArray.push(cellView.model.id);
      cellView.highlight();
      toolsAddition(cellView);
      cellView.showTools();
    }

    var indexVal = selectArray.length;
    displayAmbiguity(cellView.model.id);
    exports.logItem(`Selected Entity: ${cellView.model.id}`, logTypes.INTERFACE);
  });
  paper.on({
    "blank:pointerdown": function (evt, x, y) {
      var allCells = new Array();
      allCells = graph.getCells();
      paper.setInteractivity(false); // removes the interactivity block
      // for loop for array of cells can't be replaced with map() or forEach() easily.
      for (var i = 0; i < allCells.length; i++) {
        var cellView = paper.findViewByModel(allCells[i]); // gets all of the cells in the model.
        if (cellView.model.attr("info") === true) {
          cellView.unhighlight();
          cellView.remove();
        } else {
          cellView.unhighlight();
          cellView.hideTools();
        }
      }
      cellSelect = [];
      cellSelect.length = 0;
      if (cellView === undefined) {
        //DO NOTHING
      } else if (document.getElementById("editReadOnlyMode").checked) {
        window.getSelection().empty();
        selectArray = [];
        return;
      } else if (selectArray === null) {
        selectArray = [];
        window.getSelection().empty();
        return;
      } else {
        var perspective = checkRadio("perspective");
        if (perspective === undefined || perspective === "default") {
          selectArray = [];
          setRadio("perspective", "default");
          document.getElementById("editReadOnlyMode").checked = true;
          alert("In Default User -- Setting Input to Read Only\nUncheck 'Input Read Only' to exit Read Only mode");
          var arr1 = new Array();
          arr1 = paper.drawBackground();
          //console.log(arr1);
          paper.drawBackground({
            color: "orange",
          });
          return; // No user return out.
        }
        var arrLen = selectArray.length - 1;
        var cellView = paper.findViewByModel(selectArray[arrLen]);
        if (cellView === undefined) {
          return;
        }
        var cell = graph.getCell(cellView.model.id);
        if (cell.isLink() === true) {
          //var attrbs = [document.getElementById("linkWeight").value];
          var link = graph.getCell(cellView.model.id);
        } else {
          if (cellView.model.get("type") === "terminal.Element") {
            //DO NOTHING
          } else {
            //perspective = myAlertBox();
            if (perspective === "default") {
              selectArray = [];
              setRadio("perspective", "default");
              //console.log(perspective);
              return;
            }
            var attrbs = [
              perspective,
              //checkRadio("ambiguity"),
              document.getElementById("ambiguity").value,
              checkRadio("severity"),
              checkRadio("intentionality"),
              checkRadio("implementability"),
              document.getElementById("rgrtyText").value,
              checkRadio("rgrtyTextRef"),
              document.getElementById("rgrtyTextID").value,
              document.getElementById("linkedArti").value,
              document.getElementById("notesText").value,
              startPos,
              endPos,
            ];
            var arrLen = selectArray.length - 1;
            var cellView = paper.findViewByModel(selectArray[arrLen]);
            cellView.model.attr("label/text", attrbs[8]);
            var arrayPush = {};
            arrayPush[perspective] = {
              ambitype: attrbs[1],
              severity: attrbs[2],
              intentionality: attrbs[3],
              implementability: attrbs[4],
              regulatoryText: attrbs[5],
              regulatoryTextXpos: attrbs[10],
              regulatoryTextYpos: attrbs[11],
              regulatoryTextRef: "Phrase", //attrbs[6],
              notesText: attrbs[9],
            };
            cellView.model.set(arrayPush);
            cellView.model.set("regulatoryID", attrbs[7]);
            cellView.model.set("linkedArtifactID", attrbs[8]);
            cellView.model.set("regulatoryID", attrbs[7]);
            cellView.model.set("linkedArtifactID", attrbs[8]);
            UUIDsearch();
            colorGraph();
            colorChange(attrbs[1]);
          }
        }
      }
      clearPalette();
      var highValue = $("#highlight").val();
      switch (highValue) {
        case "0":
          AHAB.Highlight.unhilite(document.getElementById("CapDisplay"), "white");
          break;
        case "1":
          break;
        case "2":
          AHAB.Highlight.unhilite(document.getElementById("CapDisplay"), "white");
          break;
      }
      selectArray = [];
      dragging = true;
      lastX = x;
      lastY = y;
      evt.preventDefault();
      window.getSelection().empty();
      exports.logItem("User Selected blank area on paper", logTypes.INTERFACE);
    },
    "blank:pointermove": function (evt, x, y) {
      var scale = paper.scale().sx;
      if (dragging) {
        var deltaX = (x - lastX) * scale;
        var deltaY = (y - lastY) * scale;
        lastX = x;
        lastY = y;
        marginLeft += deltaX;
        marginTop += deltaY;
        paper.translate(marginLeft, marginTop);
      }
      evt.preventDefault();
    },
    "blank:pointerup": function (evt) {
      dragging = false;
      paper.setInteractivity(true);
    },
  });
  linkElement();
}
*/
//EndOfAdd



// function combines all start terminals.
//combineTerminals() is NOT currently called anywhere
/*function combineTerminals() {
  var graph = AHAB.JointJSWrapper.graph;
  var paper = AHAB.JointJSWrapper.paper;
  var cellArray = graph.getElements();
  var linkArray = graph.getLinks();
  var startArray = [];
  var linkTargetArray = [];
  var combinedArray = [];
  //this gets the ids for the start bubbles.
  cellArray.forEach(function (cellArray) {
    var cellView = paper.findViewByModel(cellArray.id);
    if (
      cellView.model.get("type") === "terminal.Element" &&
      cellView.model.get("label/text") !== "Stop"
    ) {
      startArray.push(cellView.model.get("id"));
    }
  });
  // this gets all the targets for the links from the start.
  startArray.forEach(function (startArray) {
    linkArray.forEach(function (linkArray) {
      var links = graph.getCell(linkArray);
      if (links.get("source").id === startArray) {
        combinedArray.push(linkArray.get("target").id);
      }
    });
  });
  // this removes all the starts after the first item.
  startArray.forEach((item, index) => {
    if (index > 0) {
      var removeCell = graph.getCell(item);
      graph.removeCells(removeCell);
    }
  });
  // gets the initial start cell
  var startCell = graph.getCell(startArray[0]);
  combinedArray.forEach((item) => {
    var links = graph.getCell(item);
    var link = new joint.dia.Link({
      attrs: {
        ".connection": {
          stroke: "#222138",
        },
        ".marker-target": {
          fill: "#31d0c6",
          stroke: "none",
          d: "M 10 0 L 0 5 L 10 10 z",
        },
      },
    });

    link.source(startCell);
    link.target(links);
    link.addTo(graph);
  });
}*/
// Bag of Words approach for legal text.
//bagOfWords() is called by tabular Output in AHAB.html
/*function bagOfWords() {
  var graph = AHAB.JointJSWrapper.graph;
  var paper = AHAB.JointJSWrapper.paper;
  var cellArray = graph.getElements();
  var bowArray = [];

  cellArray.forEach((cellArray, index) => {
    var cellView = paper.findViewByModel(cellArray.id);
    let perspectives = AHAB.ModelController.data.perspectives;
    perspectives.forEach((perspectives) => {
      var display = AHAB.ModelController.getCellData(cellView.model.id);
      //cellView.model.get(perspectives);
      if (
        //display === undefined &&
        cellView.model.get("type") === "terminal.Element"
      ) {
        //TERMINAL DO NOTHING TO CHANGE COLOR
      } else if (display === undefined) {
        // DO NOTHING
      } else {
        var capture = display.regulatoryText;
        bowArray.push(capture);
      }
    });
  });
  const result = bowArray.flatMap((str) => str.split(" "));
  const result2 = result.flatMap((str) => str.split("\n"));

  var uniqueTerms = result2.filter((item, index) => {
    return result2.indexOf(item) === index;
  });
  var uniqueTerms2 = uniqueTerms.filter((item) => {
    return item !== null;
  });
  console.log(uniqueTerms2);
}*/


/**
 * Merge together multiple components/shapes into one singular, newly created component.
 * The newly created merged component will refer back to the highlighted text of all the individual components that have been merged together.
 * Any links attached to the individual components prior to being merged will be copied/newly created and attached to the newly created merged component.
 * The old, individual components and old links will be deleted, leaving behind only the newly created merged component and newly created links attached to the merged component.
 */
/*function mergeAmbiguityElement() {

  console.log("merge")
  var cloneTable = new Array();
  var xPositionTable = new Array();
  var yPositionTable = new Array();
  var graph = AHAB.JointJSWrapper.graph;
  var paper = AHAB.JointJSWrapper.paper;
  populateTables(cloneTable, xPositionTable, yPositionTable, paper, graph);

  var printArray = [...new Set(cloneTable)];
  var merged = new joint.shapes.ambiguity.Element();
  merged.resize(90, 90);
  merged.attr("body/fill", "#d3d3d3");
  setMergedPos(xPositionTable, yPositionTable, merged);

  var arrayPush = {};
  var idStringArray = new Array();
  var regTextStringArray = new Array();
  setMergedAttributes(printArray, idStringArray, regTextStringArray, arrayPush, merged);

  var newIDArray = [...new Set(idStringArray)];
  var newregTextArray = [...new Set(regTextStringArray)];
  var idText = newIDArray.toString();
  var regText = newregTextArray.toString();
  merged.set("regulatoryID", $("#rgrtyTextID").val());
  merged.set("linkedArtifactID", idText);
  merged.attr("root/title", regText);
  merged.attr("label/text", "Merged \n" + idText);
  graph.addCell(merged);

  var linksArray = new Array();
  cloneLinksAndAttach(linksArray, merged, paper, graph);

  deleteOldComponentsAndLinks(paper, graph);

  var removeIDs = [...new Set(idStringArray)];
  var removeIDtext = removeIDs.toString();

  // Clean up and log event
  cloneTable = [];
  selectArray = [];
  printArray = [];
  $("#comparable").hide();

  //logging items
  AHAB.Helpers.logItem(`Created element: ${merged.id}\nRemoved elements: ${removeIDtext}`);
}*/

/**
 * Populate cloneTable with attributes (ambiguity type, severity, intentionality, implementability, regulatory text, notes),
 * populate xPositionTable with x-axis coordinates of all the components/shapes that are going to be merged together,
 * and populate yPositionTable with y-axis coordinates of all the components that are going to be merged together
 * @param {array} cloneTable - we will push attributes (ambiguity type, severity, intentionality, implementability, regulatory text, notes) into this array
 * @param {array} xPositionTable - we will push x-axis positions (of all the components that are going to be merged together) into this array
 * @param {array} yPositionTable - we will push y-axis positions (of all the components that are going to be merged together) into this array
 * @param {object} paper - responsible for rendering the graph
 * @param {object} graph - reference to all components in diagram
 */
//populateTables() used to be call in mergeAmbiguity that is not used anymore.
/*exports.populateTables = function(cloneTable, xPositionTable, yPositionTable, paper, graph) {

  selectArray.forEach((element) => {
    
    var cellView = paper.findViewByModel(graph.getCell(element));
    if (cellView.model.get("type") === "ambiguity.Element") {
      let perspectives = AHAB.ModelController.data.perspectives;
      perspectives.forEach((perspectives, index) => {
        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);
        if (display !== undefined) {
          var attrbs = [
            perspectives,
            display.ambitype,
            display.severity,
            display.intentionality,
            display.implementability,
            display.regulatoryText,
            display.regulatoryTextRef,
            cellView.model.get("regulatoryID"),
            cellView.model.get("linkedArtifactID"),
            display.notesText,
            cellView.model.get("type"),
            display.regulatoryTextXpos,
            display.regulatoryTextYpos,
          ];
          cloneTable.push(attrbs);
          xPositionTable.push(cellView.model.position().x);
          yPositionTable.push(cellView.model.position().y);
        }
      });
    } else {
      // Needed to remove any issues with trying to read a non-ambiguity.Element
      AHAB.Helpers.logItem(`Model id: ${cellView.model.id}\n\t Element Type: ${cellView.model.get("type")}`);
    }
  });
}*/

/**
 * calculate x and y position for newly created merged component
 * set merged component with newly calculated (X,Y) position
 * @param {array} xPositionTable - array containing x-axis positions (of all the components that are going to be merged together)
 * @param {array} yPositionTable - array containing y-axis positions (of all the components that are going to be merged together)
 * @param {element} merged - the new component/shape resulting from merging multiple components together
 */
//setMergedPos() was used in mergeAmbiguityElement()
 /*exports.setMergedPos = function(xPositionTable, yPositionTable, merged) {
  var xSortPosition = [...new Set(xPositionTable)];
  var ySortPosition = [...new Set(yPositionTable)];
  var xSum = 0;
  var ySum = 0;

  for (var i = 0; i < xSortPosition.length; i++) {
    xSum += xSortPosition[i];
  }

  for (var i = 0; i < ySortPosition.length; i++) {
    ySum += ySortPosition[i];
  }

  var newXPos = xSum / xSortPosition.length;
  var newYPos = ySum / ySortPosition.length;

  merged.position(newXPos, newYPos);
}*/

/**
 * Sets the attributes (ambiguity type, severity, intentionality, implementability, regulatory text, notes) on the newly created, singular merged component/shape.
 * This is done by first populating the arrayPush object with attributes then passing the arrayPush object to the merged component using the .set method
 * @param {set} printArray - a set created by converting the cloneTable array into a set
 * @param {array} idStringArray - an array containing unique Artifact ID
 * @param {array} regTextStringArray - an array containing regulatory text
 * @param {object} arrayPush - we will set the attributes of this object
 * @param {element} merged - the new component/shape resulting from merging multiple components together
 */
// used to be called in mergeAmbiguityElement
/*exports.setMergedAttributes = function(printArray, idStringArray, regTextStringArray, arrayPush, merged){

  printArray.forEach((element) => {
    var name = element[0];
    arrayPush[name] = {
      user: name,
      ambitype: element[1],
      severity: element[2],
      intentionality: element[3],
      implementability: element[4],
      regulatoryText: element[5],
      regulatoryTextXpos: element[11],
      regulatoryTextYpos: element[12],
      regulatoryTextRef: "Phrase",
      notesText: element[9],
    };
    idStringArray.push(element[8]);
    regTextStringArray.push(element[5].trim());
    merged.set(arrayPush);
  });
}*/

/**
 * Clone all the links that belong to the multiple components/shapes that are going to be merged together and attach the cloned links to the newly created merged component.
 * @param {array} linksArray - array that contains the arrow links of the objects being merged
 * @param {element} merged - the newly created component resulting from merging multiple components together
 * @param {object} paper - responsible for rendering the graph
 * @param {object} graph - reference to all components in diagram
 */
/*exports.cloneLinksAndAttach = function(linksArray, merged, paper, graph){
  selectArray.forEach((element) => {
    var split = paper.findViewByModel(graph.getCell(element));
    linksArray = graph.getLinks();
    linksArray.forEach((linkElement) => {
      if (linkElement.get("source").id === split.model.id) {
        var copyLink1 = new joint.dia.Link({
          attrs: {
            ".connection": {
              stroke: "#222138",
            },
            ".marker-target": {
              fill: "#31d0c6",
              stroke: "none",
              d: "M 10 0 L 0 5 L 10 10 z",
            },
          },
          source: { id: merged.id },
          target: { id: linkElement.get("target").id },
        });
        copyLink1.addTo(graph);
      }
      if (linkElement.get("target").id === split.model.id) {
        var copyLink3 = new joint.dia.Link({
          attrs: {
            ".connection": {
              stroke: "#222138",
            },
            ".marker-target": {
              fill: "#31d0c6",
              stroke: "none",
              d: "M 10 0 L 0 5 L 10 10 z",
            },
          },
          source: { id: linkElement.get("source").id },
          target: { id: merged.id },
        });
        copyLink3.addTo(graph);
      }
      if (
        linkElement.get("target").id === split.model.id ||
        linkElement.get("source").id === split.model.id
      ) {
        linkElement.remove();
      }
    });
  });
}*/

/**
 * Delete the old components/shapes and the old links, leaving behind only the newly created merged component and newly created link(s).
 * @param {object} paper - responsible for rendering the graph
 * @param {object} graph - reference to all components in diagram
 */
//deleteOldComponentsAndLinks() used to be called in mergeAmbiguityelement
/*exports.deleteOldComponentsAndLinks = function(paper, graph){

  selectArray.forEach((element) => {
    var cellView = paper.findViewByModel(graph.getCell(element));
    graph.disconnectLinks(cellView);
    cellView.remove();
  });
}*/

/**
 * Split a singular component/shape into two separate components.
 * Each of the two split components will refer back to the highlighted text of the component prior to splitting.
 * Any links attached to the component prior to being split will be copied/newly created and attached to each of the two components.
 * The old, singular component and old links will be deleted, leaving behind only the newly created separated components and newly created links attached the separated components.
 */
/*function splitAmbiguityElement() {

  //start of old code
  var graph = AHAB.JointJSWrapper.graph;
  var cellID = selectArray[selectArray.length - 1];
  var split = graph.getCell(cellID);

  // --- Cloning the cell ---
  var clone1 = split.clone();
  var clone2 = split.clone();
  var originPos = split.position();

  exports.cloneCells(clone1, clone2, originPos, graph);

  // --- Clone the links ---
  const cloneArray = [clone1, clone2];
  exports.cloneLinks(cloneArray, split, graph);

  // logging items
  AHAB.Helpers.logItem(`Created elements: ${clone1.id} & ${clone2.id}\nRemoving element: ${cellID}`);

  // remove the old cell
  graph.disconnectLinks(split);
  split.remove();
  $("#draggable").hide();
  selectArray = [];
}*/

/**
 * Give the newly created, split components the same Unique Artifact ID as the component prior to splitting and append '.1'/'.2' at the end of the Unique Artifact ID for the split components,
 * adjust the (X,Y) position of the split components,
 * and add the split components to the graph.
 * @param {element} clone1 - one of the newly created components after splitting
 * @param {element} clone2 - one of the newly created components after splitting
 * @param {position} originPos - position of the component prior to splitting
 * @param {object} graph - reference to all components in the diagram
 */
/*exports.cloneCells = function(clone1, clone2, originPos, graph){

  clone1.set("linkedArtifactID", clone1.get("linkedArtifactID") + ".1");
  clone1.attr("label/text", clone1.get("linkedArtifactID"));

  clone2.set("linkedArtifactID", clone2.get("linkedArtifactID") + ".2");
  clone2.attr("label/text", clone2.get("linkedArtifactID"));

  var clone1Pos = {
    x: 50 + originPos.x,
    y: 50 + originPos.y,
  };
  var clone2Pos = {
    x: 75 + originPos.x,
    y: 100 + originPos.y,
  };
  clone1.set("position", clone1Pos);
  clone2.set("position", clone2Pos);
  clone1.addTo(graph);
  clone2.addTo(graph);
}*/

/**
 * Clone the links attached to the component prior to splitting and attach newly created links to each of the two separated components after splitting.
 * @param {array} clonedCells - array that contains the two separated components after splitting
 * @param {element} originalCell - the component being split
 * @param {object} graph - reference to all components in diagram
 */
/*exports.cloneLinks = function(clonedCells, originalCell, graph) {
  let links = graph.getConnectedLinks(originalCell);

  for (let link of links) {
    for (let clone of clonedCells) {

      // Create new link for each clone
      let clonedLink = new joint.dia.Link({
        attrs: {
          ".connection": {
            stroke: "#222138",
          },
          ".marker-target": {
            fill: "#31d0c6",
            stroke: "none",
            d: "M 10 0 L 0 5 L 10 10 z",
          },
        }
      });

      // Update source and target
      if (link.get("source").id === originalCell.id) {
        // outgoing links get their source to the clones and targets copied
        clonedLink.source(clone);
        clonedLink.target(link.get("target"));
      } else {
        // incoming links get their target to the clones and sources copied
        clonedLink.target(clone)
        clonedLink.source(link.get("source"));
      }

      // Add new link to graph
      clonedLink.addTo(graph);
    }
    // Remove old link
    link.remove();
  }
}*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//  Import/Export Functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//timeStamp() is called in event.js and in Helpers.logItem() and in legacy/objectRead.js and here in logfile() and downloadlog()
exports.timeStamp = function () {
  var d = new Date();
  var day = d.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  var month = d.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var year = d.getFullYear();
  var hour = d.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  var minute = d.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }
  var seconds = d.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var timestamp = `${year}${month}${day}-${hour}h${minute}m${seconds}s`;
  return timestamp;
};




/**
 * removes duplicates from an array. Can use a filter function.
 * @param {array} array - array to remove duplicates from
 * @param {function} filter - filter function that takes an item and returns what property should be used to determine uniqueness
 */
//arrayUnique() is NOT currently used anywhere.used to be called here in readFile()
/*exports.arrayUnique = function(array, filter) {
  if (filter) {
    if (typeof(filter) === "function") {
      // if an function is specified, filter by duplicate attributes
      let filteredArray = [];
      let removedItems = [];
      let uniqueItems = new Set();

      for (let item of array) {
        if (!uniqueItems.has(filter(item))) {
          filteredArray.push(item);
          uniqueItems.add(filter(item));
        } else {
          removedItems.push(item);
        }
      }

      AHAB.Helpers.logItem(`arrayUnique removed ${removedItems.join(', ')}`, logTypes.DATA);
      return filteredArray;
    } else {
      // if the second parameter isn't a function, do not proceed
      AHAB.Helpers.logItem("arrayUnique's second parameter must be a filter function.", logTypes.ERROR);
    }
  } else {
    // if no attribute is specified, filter by item
    return [...new Set(array)];
  }
};*/

/**
 * sets the height and width of the paper
 * @param {int} Nwidth - width size of the paper
 * @param {int} Nheight - height size of the paper
 */
//resizeCanvas() is only called here in redrawCanvas()
/*exports.resizeCanvas = function(Nwidth, Nheight) {
  var paper = AHAB.JointJSWrapper.paper;
  paper.setDimensions(Nwidth, Nheight);
};*/

/**
 * Placeholder that changes the canvas size based on if the model panel will open or not (small size if the panel will open). This is commented out in HTML, remove the comments around the #modelCollapsePanel button for use.
 */
//redrawCnvas() is NOT currently called anywhere. there used to be a button in AHAB.html called model panel and that used to call this.
/*function redrawCanvas() {
  if (!$("#modelCollapsePanel").is(":visible")) {
    resizeCanvas(paperWidthSmall, paperHeight);
    AHAB.Helpers.logItem("Canvas resized to small size", logTypes.INTERFACE);
  } else {
    resizeCanvas(paperWidthLarge, paperHeight);
    AHAB.Helpers.logItem("Canvas resized to large size", logTypes.INTERFACE);
  }
}*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// View-Model Graphing Functions
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-

$("#editReadOnlyMode").change(function () {
  var paper = AHAB.JointJSWrapper.paper;
  paper.drawBackground({
    color: "lightgray",
  });
  var logEvent = "Read Only Mode Changed";
  AHAB.Helpers.logItem(logEvent);
});
// Changes the canvas color.
// canvasColor() is NOT currently called anywhere. There's another function called canvasColor() defined in legacy/objectRead.js
/*function canvasColor() {
  var paper = AHAB.JointJSWrapper.paper;
  var dropDown = $("#canvasClr").val();
  if (dropDown === null) {
    alert("You must return a value!");
  } else {
    paper.drawBackground({
      color: dropDown,
    });
  }
  dropDown.selectedIndex = 0;
  var logEvent = "Canvas Color Changed";
  AHAB.Helpers.logItem(logEvent);
}*/

// Gets the paper and graph variables.
// getTarget() is NOT currently used anywhere was used in createAmbiguityShape() which is not used
/*function getTargets() {
  var targetGraph = AHAB.JointJSWrapper.graph;
  var targetPaper = AHAB.JointJSWrapper.paper;
  var paper_element = [];
  var myArray = new Array(2);
  myArray[0] = targetGraph;
  myArray[1] = targetPaper;
  return myArray;
}*/


/* // START Capture Text From Regulation Frame
function textReturn() {
  var element = document.getElementById("CapDisplay");
  element.addEventListener(
    "mouseup",
    function () {
      var element = document.getElementById("CapDisplay");
      var start = window.getSelection();
      if (start.rangeCount > 0) {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        startPos = preCaretRange.toString().length;
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        endPos = preCaretRange.toString().length;
        quote = start.toString();
        alert(quote);
      }
    },
    {
      passive: true,
    }
  );
}

// Imports the legal text!
function loadText(event) {
  let validTypes = ["txt", "html"];
  let input = event.target;
  let name;

  if (input.files && input.files[0]) {
    console.log(input.files[0].name);
    let extension = input.files[0].name.split(".").pop().toLowerCase(), //file extension from input file
      isSuccess = validTypes.indexOf(extension) > -1; //is extension in acceptable types
    name = input.files[0].name.split(".");
    if (isSuccess) {
      //yes
      let reader = new FileReader();
      reader.onload = function (e) {
        $("#CapDisplay").html(reader.result);
      };
      reader.readAsText(input.files[0]);
    } else {
      alert("Please use files of .html or .txt!");
    }
  }
  let regulationName = name[0].toLowerCase();
  document.getElementById("rgrtyTextID").value = regulationName;
  AHAB.ModelController.data.model = regulationName;
  AHAB.Helpers.logItem(`Legal text loaded: ${regulationName}`, logTypes.FILE);
}

// Text selection function.
function selectText() {
  var output = $("#rgrtyText");
  if (quote !== "") {
    output.val(quote);
    resizeTextarea(output);
  } else {
    console.log("Selection is null!");
  }
  window.getSelection().empty();
} */

// Capture the text display start and stop points.
// displayText() is NOT currently called anywhere. It used to be called in previous version of cursorReturn()
/*function displayText(ambiguityType, Xposi, Yposi) {
  var highValue = $("#highlight").val();
  setSelectionRange(document.getElementById("CapDisplay"), Xposi, Yposi);
  if (highValue === "0") {
    AHAB.Highlight.unhilite(document.getElementById("CapDisplay"), "white");
  } else {
    colorChange(ambiguityType);
  }
}*/
// Scales the paper
//scalePaper() is only called in AHAB.html for zoomin zoomout
function scalePaper(direction) {
  var graph = AHAB.JointJSWrapper.graph;
  var paper = AHAB.JointJSWrapper.paper;
  var scale = paper.scale().sx;
  if (direction === "in") {
    scale = scale + 0.25;
    paper.scale(scale);
  } else if (direction === "out") {
    scale = scale - 0.25;
    paper.scale(scale);
  } else if (direction === "reset") {
    paper.scale(1);
  } else {
  }
}

// START QUICK FIX
if (inBrowser) {
  for (let fn in exports) {
    window[fn] = exports[fn];
  }
}
//END QUICK FIX

// END OF JAVASCRIPT.
