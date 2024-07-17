// Tools that appear when a user clicks a cell.
AHAB.Tools = {
  // List of tools that will be defined in the setup function
  boundary: null, // the boundary shown around an element
  info: null,     // button to display cell data table
  remove: null,   // button to delete cell
  compare: null,  // button to compare all selected cells in a table
  copy: null,     // button to clone cell

  // Tool groups
  ambiguityTools: null,
  generalTools: null,

  // Button styles for the tools. It would be great to have these as part of Models.js, I just couldn't find a way to define a new elementTools type.
  styles: {
    info: [
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
    compare: [
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
    copy: [
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
    ]
  },

  /**
   * Creates a window on the page that displays perspectives, notes, etc. in a table format, for the cell this function was called from.
   */
  createInfoTable() {
    //Reads the item and outputs the value into a display.
    let id = this.model.id;
    let cell = AHAB.ModelController.getCellData(id);

    let htmlTable = `
    <table class="table table-bordered table-sm">
      ${AHAB.Helpers.createInfoTableHeader()}
      <tbody>${AHAB.Helpers.createInfoTableRow(id, cell)}</tbody>
    </table>`;
    document.getElementById("dragInfo").innerHTML = htmlTable;
    document.getElementById("draggable").style.display = "block";

    AHAB.Helpers.logItem(`Used the info tool for ${id}`, logTypes.INTERFACE);
  },

  /**
   * Removes the cell this function is called from and checks to confirm the graph and data still agree.
   */
  removeCurrentCell() {
    AHAB.ModelController.deleteCell(this.model.id);
    AHAB.Helpers.logItem(`Used the remove tool for ${this.model.id}`, logTypes.DATA);

    // check if the graph is still valid
    if (!AHAB.ModelController.dataAndGraphAgree()) {
      alert("There was an error in syncing the data and graph; please check the console for more information");
    }
  },

  /**
   * Creates a window on the page that displays perspective, notes, etc. in a table for the cell every cell that is selected
   */
  createCompareTable() {
    let table = AHAB.Helpers.createInfoTableHeader();
    if(selectArray.length >1)
    {
      $("#mergeAmbiguity").show();
    }
    // get the data of each selected cell
    for (let id of selectArray) {
      let cell = AHAB.ModelController.getCellData(id);
      if (!cell.terminal) {
        table += AHAB.Helpers.createInfoTableRow(id, cell);
      }
    }
  
    // construct and show the table
    let html = `
    <table class="table table-bordered table-sm">
      ${table}
    </table>`;
    document.getElementById("comparableInfo").innerHTML = html;
    document.getElementById("comparable").style.display = "block";

    AHAB.Helpers.logItem(`Used the compare tool for ${selectArray.join()}`);
  },

  /**
   * Splits the current cell and checks to confirm the data and graph still agree.
   */
  copyCell() {
    AHAB.ModelController.splitCell(this.model.id);
    AHAB.Helpers.logItem(`Used the split tool for ${this.model.id}`, logTypes.DATA);

    // check if the graph is still valid
    if (!AHAB.ModelController.dataAndGraphAgree()) {
      alert("There was an error in syncing the data and graph; please check the console for more information");
    }
  },

  /**
   * Adds and shows the tools for a cell.
   * @param {object} cellView - the Joint JS cell view to add tools to.
   * @param {array} tools - the tools for the cell.
   */
  addTools(cellView, tools) {
    cellView.addTools(tools),
    cellView.showTools();
    cellView.highlight();
  },

  /**
   * Selects a cell by adding it to the cell array and displaying the tools.
   * @param {object} cellView - a Joint JS cell view
   */
  selectCell(cellView) {
    let id = cellView.model.id;
    let cell = AHAB.ModelController.getCellData(id);
    console.log("tools.selectCell: cell=" , cell);
    // Select the clicked element or link
    /*if(selectArray.indexOf(id)==-1){
      allSelectedIncludingTerminals.push(id);
      if(cell!="undefined" || !cell.terminal)
      {
        selectArray.push(id);
      }
    }*/
    if(cell===undefined)
    {
      console.log("selectCell: undefined is selected");
    }
    else if(cell.terminal) {
      lastSelectedIndex=allSelectedIncludingTerminals.indexOf(id);
      if(lastSelectedIndex==-1)
      {
        lastSelectedIndex=allSelectedIncludingTerminals.length;
        allSelectedIncludingTerminals.push(id);
      }
      // For terminals, just add the general tools
      this.addTools(cellView, this.generalTools);
    }
    else {
      lastSelectedIndex=allSelectedIncludingTerminals.indexOf(id);
      lastSelectedAmbiNodeIndex=selectArray.indexOf(id);
      if(lastSelectedAmbiNodeIndex==-1)
      {
        lastSelectedAmbiNodeIndex= selectArray.length;
        lastSelectedIndex=allSelectedIncludingTerminals.length;
        allSelectedIncludingTerminals.push(id);
        selectArray.push(id);
      }
      // For elements, add the full set of ambiguity tools
      this.addTools(cellView, this.ambiguityTools);
      AHAB.Helpers.displayCellInfo(cell, id);

      // Highlight the text in the regulatory text panel
      AHAB.Helpers.setSelectionRange(document.getElementById("CapDisplay"), cell.textPosition[0], cell.textPosition[1]);
    }
    AHAB.Helpers.logItem(`Selected Entity: ${id}`, logTypes.INTERFACE);
  },

  /**
   * Function to set up the various tools that can be used. It's set up this way so the methods from this object can be easily attached to the tools.
   */
  setup() {
    // Create tools
    this.boundary = new joint.elementTools.Boundary({
      focusOpacity: 0.5,
    });

    this.info = new joint.elementTools.Button({
      markup: this.styles.info,
      offset: { x: 90 },
      action: this.createInfoTable
    });

    this.remove = new joint.elementTools.Remove({
      action: this.removeCurrentCell
    });

    this.compare = new joint.elementTools.Button({
      markup: this.styles.compare,
      offset: { y: 90 },
      action: this.createCompareTable
    });

    this.copy = new joint.elementTools.Button({
      markup: this.styles.copy,
      offset: { x: 90, y: 90 },
      action: this.copyCell
    });

    // Create tool groups
    this.ambiguityTools = new joint.dia.ToolsView({
      tools: [this.boundary, this.info, this.remove, this.compare, this.copy],
    });
    this.generalTools = new joint.dia.ToolsView({
      tools: [this.boundary, this.remove],
    });
  }

}

AHAB.Tools.setup();
// THE FOLLOWING CODE IS IN A SIMILAR STATE TO FEATURES.JS. IT WOULD BE GOOD TO BE FIT INTO THE ABOVE STRUCTURE.
/**
 * A function being transitioned over. It attaches functions to events on the paper/cells.
 */
function cursorReturn() {
  var graph = AHAB.JointJSWrapper.graph;
  var paper = AHAB.JointJSWrapper.paper;
  var dragging = false;
  var lastX, lastY;
  var marginLeft = 0;
  var marginTop = 0;

  /*//if you want to get all the events happening on graph uncomment this:
    AHAB.JointJSWrapper.graph.on('all', function(eventName, cell) {
      console.log(arguments);
    });*/
    AHAB.JointJSWrapper.graph.on('remove', function(eventName, cell) {
      if(arguments[0].attributes['type']=="link")
      {
        let s=arguments[0].attributes['source']['id'];
        let t = arguments[0].attributes['target']['id'];
        let targetCell=AHAB.ModelController.data.cells[t];
        let sourceCell= AHAB.ModelController.data.cells[s];
        if(targetCell!= undefined){
          let tInIndexOfS= targetCell.incomingLinks.indexOf(s);
          if(tInIndexOfS!= -1)
          {
            targetCell.incomingLinks.splice(tInIndexOfS,1);
          }
        }
        if(sourceCell!= undefined){
          let sOutIndexOfT= sourceCell.outgoingLinks.indexOf(t);
          if(sOutIndexOfT != -1)
          {
            sourceCell.outgoingLinks.splice(sOutIndexOfT,1);
          }
        }
      };
    });
  // TODO: Move more of this long function into the object. Ideally all that should be happening here is assigning existing functions as events. At that point, it could even be moved into Mina.
  paper.on("cell:pointerdown", (cellView) => {AHAB.Tools.selectCell(cellView)});
  paper.on({
    "blank:pointerdown": function (evt, x, y) {
      paper.setInteractivity(false); // removes the interactivity block
      AHAB.ModelController.unselectAllTheSelectedCells(true);
      dragging = true;
      lastX = x;
      lastY = y;
      evt.preventDefault();
      AHAB.Helpers.logItem("User Selected blank area on paper", logTypes.INTERFACE);
    },
    "blank:pointermove": function (evt, x, y) {
      console.log("tools.cursorReturn: blank:pointermove happening!");
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
      console.log("tools.cursorReturn: blank:pointerup happening!");
      dragging = false;
      paper.setInteractivity(true);
    },
  });
  AHAB.ModelController.linkElement();
}