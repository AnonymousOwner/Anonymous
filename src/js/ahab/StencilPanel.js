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

// Modeling Shapes/Model Panel from where shapes can be created. They use a Graph and Paper so they can use the existing shape styles.

AHAB.StencilPanel = {
  // Graph and paper used for drag and drop
  draggableGraph: null,
  draggablePaper: null,

  // Graph and paper used to display what types of shapes you can create.
  panelGraph: null,
  panelPaper: null,

  setup() {
    // Initialize the canvas for the draggable HTML element
    this.draggableGraph = new joint.dia.Graph();
    this.draggablePaper = new joint.dia.Paper({
      el: document.getElementById('draggableCanvas'),
      model: this.draggableGraph,
      width: 150,
      height: 150,
      interactive: false,
      background: {
        opacity: 0.1,
      },
    });
    // Initialize the panel
    this.panelGraph = new joint.dia.Graph();
    this.panelPaper = new joint.dia.Paper({
      el: document.getElementById('paper-stencil-panel'),
      model: this.panelGraph,
      width: 235,
      height: 125,
      interactive: false,
      drawGrid: false,
      gridSize: 16
    });
    // Create basic ambiguity shape icon
    let octagon = new joint.shapes.ambiguity.Element();
    octagon.resize(90, 90);
    octagon.position(5, 25);
    octagon.attr("label/text", "Ambiguity");

    // Create start terminal icon
    let startTerminal = new joint.shapes.terminal.Element();
    startTerminal.position(105, 25);
    startTerminal.resize(100, 100);

    // Create stop terminal icon
    let stopTerminal = new joint.shapes.terminal.Element();
    stopTerminal.position(170, 25);
    stopTerminal.resize(100, 100);
    stopTerminal.attr("label/text", "Stop");
    stopTerminal.attr("label/fill", "black");
    stopTerminal.attr("body/fill", "white");

    // Add the icons to the panel
    this.panelGraph.addCells(octagon, startTerminal, stopTerminal);
    // Add click event. Creates an arrow function to preserve the "this"
    this.panelPaper.on("cell:pointerdown", (stencil, event) => {
      //console.log(stencil);
      this.dragAmbiguityShape(stencil, event);
    });
  },

  /**
   * dragging ambiguity shape from ambiguity panel on the canvas
   * @param {object} stencil - Joint JS element
   * @param {MouseEvent} event - information passed by click event
   */
  dragAmbiguityShape(stencil, event) {
    // Perspective must be set
    if (AHAB.Helpers.checkRadio("perspective") == "default") {
      alert("You must set a perspective first!");
      return;
    }
    // Legal text must be loaded
    if (!AHAB.ModelController.data.model) {
      alert("You must load a legal text first!");
      return;
    }
    // For ambiguity elements, text must be highlighted and captured
    if (stencil.model.get("type") == "ambiguity.Element") {
      let noTextSelected = startPos === 0 && endPos === 0;
      let noTextCaptured = document.getElementById("rgrtyText").value === "Please add regulatory text here...";
      if (noTextSelected || noTextCaptured) {
        alert("You must capture an ambiguity in the text first!");
        return;
      }
    }

    // For terminal elements. there can only be one for each perspective
    if (stencil.model.get("type") == "terminal.Element") {
      let terminalType = stencil.model.attr("label/text");
      let id = `${AHAB.Helpers.checkRadio("perspective")}_${terminalType}`;
      if (AHAB.ModelController.getCellData(id)) {
        alert(`There is already a ${terminalType} for this perspective.`);
        return;
      }
    }
    // Copy the shape from the template to the draggable canvas so it will appear it was dragged
    let shape = stencil.model.clone();
    shape.position(0, 0);
    let offset = shape.get("size").width / 2;
    this.draggableGraph.addCell(shape);
    // Display draggable at the mouse position
    document.getElementById("draggableCanvas").style.display = "block";
    $("#draggableCanvas").offset({
      left: event.pageX - offset,
      top: event.pageY - offset
    });

    // Set draggable canvas size to match the element
    this.draggablePaper.fitToContent();

    // Add drag events that continually set the canvas's position so the shape will appear at the mouse
    $("body").on("mousemove.fly", (event) => {
      //console.log("StencilPanel.dragAmbiguityShape: mousemove happening!");
      $("#draggableCanvas").offset({
        left: event.pageX - offset,
        top: event.pageY - offset
      });
    });

    // When the shape is dropped, add the new element to the main canvas
    $("body").on("mouseup.fly", (event) => {
      let x = event.pageX;
      let y = event.pageY;
      let paper = AHAB.JointJSWrapper.paper.$el;
      let target = paper.offset();
      // If the shape is dropped over the paper
      if (
        x > target.left &&
        x < target.left + paper.width() &&
        y > target.top &&
        y < target.top + paper.height()
      ) {

        let id;
        if (stencil.model.get("type") === "ambiguity.Element") {
          // For elements, get the info from the info panel and add to the graph
          let info = AHAB.Helpers.getCellInfo();
          id = info.id;
          AHAB.ModelController.addCell(info);

          AHAB.Helpers.clearPalette();//clear the attribute panel(model panel)
          window.getSelection().empty();// unselect any selected legal text
        } else {
          // For terminals, create the id from the perspective and type
          let perspective = AHAB.Helpers.checkRadio("perspective");
          let terminalType = stencil.model.attr("label/text");
          id = `${perspective}_${terminalType}`;

          AHAB.ModelController.addTerminal({ id, perspective, terminalType });
        }

        // Change the position of the new cell to where it was dropped
        let newCell = AHAB.JointJSWrapper.graph.getCell(id);
        newCell.position(x - target.left - offset, y - target.top - offset);
        AHAB.Helpers.logItem(`Entity Created for id: ${id}`, logTypes.DATA);
      }

      // Remove drag events, clear dragged shape and hide draggable canvas
      $("body").off("mousemove.fly").off("mouseup.fly");
      shape.remove();
      document.getElementById("draggableCanvas").style.display = "none"
    });

  }

}

AHAB.StencilPanel.setup();
