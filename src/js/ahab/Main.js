// START JAVASCRIPT
// -=-=-=-=-=-=-=-=-=-=-=-=-
//        GLOBALS
// -=-=-=-=-=-=-=-=-=-=-=-=-
let selectArray = [];
let allSelectedIncludingTerminals= [];
let lastSelectedAmbiNodeIndex=-1;// index of last selected Ambiguity node in selectArray
let lastSelectedIndex=-1; //index of last selected element in allSelectedIncludingTerminals
let heatmapCount = 0;
let perspectives = ['default'];
let startPos = 0;
let endPos = 0;
const ahab = {};
let AHAB = {}; // Container for all AHAB related "Modules" (Objects as of now)
let regulationName = 'name_me';
let paperWidthLarge = 1500;
let paperWidthSmall = 500
let paperHeight = 700;

// logging
const logTypes = {
  ERROR: "error",
  FILE: "file",
  INTERFACE: "interface",
  DATA: "data"
}
Object.freeze(logTypes);
const logTypesEnabled = new Set([
  "error",
  "file",
  //"interface",
  "data"
]);

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//    What dependencies are being used
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function checkVersions() {
  console.info("Lodash version: ", _.VERSION);
  console.info("Backbone version: ", Backbone.VERSION);
  // Backbone.LocalStorage exports a class but no version number.
  console.info("Backbone.localstorage exists: ", 'Backbone.LocalStorage' in window);
  // Bootstrap has each plugin store version
  console.info("Bootstrap exists: ", 'bootstrap' in window);
  // Popper does not include version info until 2.x; bootstrap is still on 1.x
  console.info("Popper exists: ", 'Popper' in window);
  console.info("Graphlib version: ", graphlib.version);
  console.info("Dagre version: ", dagre.version);
  // html2canvas and downloadjs do not include version info, only a function
  console.info("Html2Canvas exists: ", 'html2canvas' in window);
  console.info("Download.js exists: ", 'download' in window);
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//    Main Function
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function main(Nwidth, Nheight) {
  checkVersions();
  // begin joint.js required code
  // creating the graph
  const graph = new joint.dia.Graph();
  // drawing the paper for the models (canvas)
  const paper = new joint.dia.Paper({
    el: $('#paper-multiple-papers'),
    width: Nwidth,
    height: Nheight,
    model: graph,
    gridSize: 5,
    drawGrid: true,
  });
  paper.showTools();
  paper.drawBackground({ color: 'lightgray' });
  // the mini map in the preview_panel on the bottom left.
  const paperSmall = new joint.dia.Paper({
    el: document.getElementById('paper-multiple-papers-small'),
    model: graph,
    width: (Nwidth / 2),
    height: (Nheight / 4),
    gridSize: 5,
    interactive: false,
  });
  paperSmall.scale(0.25);
  paperSmall.drawGrid();
  paperSmall.drawBackground({ color: 'lightgray' });
  // save a reference to the graph and paper in the UI object.
  AHAB.JointJSWrapper.graph = graph;
  AHAB.JointJSWrapper.paper = paper;
  // Modeling Shapes/Model Panel from where shapes can be created
 /* const stencilGraph = new joint.dia.Graph();
  const stencilAmbiguity = new joint.dia.Paper({
    el: document.getElementById('paper-stencil-panel'),
    model: stencilGraph,
    width: 235,
    height: 125,
    gridSize: 1,
    interactive: false,
  });

  stencilAmbiguity.drawGrid();
  stencilAmbiguity.drawBackground({ color: 'white' }); // end joint.js required code.


  document.getElementById('graph_stencil_panel').value = stencilGraph;
  document.getElementById('paper-stencil-panel').value = stencilAmbiguity;
 
  generateShapes();
  */

  // cursorReturn is used for highlighting and getting information from the objects
  cursorReturn();
  AHAB.Helpers.clearPalette();
  AHAB.Log.logfile();
}
// END MAIN CODE.
