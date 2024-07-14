// Communicator with JointJS, does layout/UI
AHAB.JointJSWrapper = {

  // References to the graph and paper
  graph: null,
  paper: null,

  /**
   * Creates an element shape with the default project styles.
   * @param {string} id - the ID of the new element to be created
   */
  createShape(id) {
    let shape = new joint.shapes.ambiguity.Element({
      id: id,
      attrs: {
        label: {
          text: id
        }
      }
    });
    shape.resize(90, 90);
    shape.position(0, 0);
    return shape;
  },

  /**
   * Creates a terminal shape with the default project styles.
   * @param {string} id - the ID of the new terminal to be created
   * @param {string} type - Start or Stop
   */
  createTerminal(id, type) {
    // The label of terminals is either Start or Stop
    let shape = new joint.shapes.terminal.Element({
      id: id,
      attrs: {
        label: {
          text: type,
        }
      }
    });
    // Stop terminals should be white with black text
    if (type == "Stop") {
      shape.attr("body/fill", "white");
      shape.attr("label/fill", "black")
    }
    shape.resize(60, 60);
    shape.position(0, 0);
    return shape;
  },

  /**
   * Creates a link with the default project styles.
   * @param {string} source - The ID of the source (from) element
   * @param {string} target - The ID of the target (to) element
   */
  createLink(source, target) {
    return new joint.dia.Link({
      source: { id: source },
      target: { id: target },
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
  },

  /**
   * Loops an adjacency list and creates all Joint JS elements and links.
   * @param {object} adjacencyList - adjacency list for the graph
   * @returns {array} - the Joint JS elements and links
   */
  createCellsFromAdjacencyList(adjacencyList) {
    let elements = [];
    let links = [];

    for (let parentID of Object.keys(adjacencyList)) {
      let cell = adjacencyList[parentID];
      console.log("checking cell: ",cell);
      if (cell.terminal) {
        // Create terminal
        elements.push(this.createTerminal(parentID, cell.terminal));
      } else {
        // Create cell
        elements.push(this.createShape(parentID));
      }
      // Create links
      for (let childID of cell.outgoingLinks) {
        links.push(this.createLink(parentID, childID));
      };
    }

    // Add links last so source/target elements will exist during link creation
    return elements.concat(links);
  },

  /**
   * Adds a cell to the graph.
   * @param {string} id - the id of the cell to map between the graph and data
   */
  addElementToGraph(id) {
    let cell = this.createShape(id);
    this.graph.addCell(cell);
  },

  /**
   * Adds a terminal to the graph.
   * @param {string} id - the id of the terminal i.e. Harvey_Start
   * @param {string} type - Start or Stop
   */
  addTerminalToGraph(id, type) {
    let terminal = this.createTerminal(id, type);
    this.graph.addCell(terminal);
  },

  addLinkToGraph(source, target) {
    let link = this.createLink(source, target);
    link.addTo(this.graph);
  },

  /**
   * Deletes an element by id
   * @param {string} id - the element to delete from the graph.
   */
  deleteElementFromGraph(id) {
    let cell = this.graph.getCell(id);
    cell.remove();
  },

  /**
   * Adds two new cells to the graph based on the position of the first one.
   * @param {string} originalId - id of the original cell that was split
   * @param {string} id1 - id of the first cell created from the split
   * @param {string} id2 - id of the second cell created from the split
   */
  addSplitCellsToGraph(originalId, id1, id2) {
    this.addElementToGraph(id1);
    this.addElementToGraph(id2);

    // position the clones near but not on top of the original
    let originalPos = this.graph.getCell(originalId).position();
    this.graph.getCell(id1).position(originalPos.x + 50, originalPos.y + 50);
    this.graph.getCell(id2).position(originalPos.x + 75, originalPos.y + 100);
  },

  /**
   * Places an element at the average position between a list of elements.
   * @param {string} id - the element that should be placed at the average position
   * @param {array} positionIds - list of ids of the elements whose positions should be averaged
   */
  setAveragePosition(id, positionIds) {
    let sumX = 0;
    let sumY = 0;

    for (let elementId of positionIds) {
      let position = this.graph.getCell(elementId).position();
      sumX += position.x;
      sumY += position.y;
    }

    let averageX = sumX / positionIds.length;
    let averageY = sumY / positionIds.length;

    this.graph.getCell(id).position(averageX, averageY);
  },

  /**
   * Creates the Joint JS graph using the Dagre plugin to automatically lay out nodes.
   * @param {object} data - the data containing the cells from which to generate the graph
   */
  generateGraph(data) {
    console.log(data.cells);
    // Dagre layout
    let cells = this.createCellsFromAdjacencyList(data.cells);
    this.graph.resetCells(cells);
    // Options
    let layoutOptions = {
      dagre: dagre,
      graphlib: dagre.graphlib, //using dagre built in graphlib
      setVertices: true,
      ranker: "network-simplex", //network-simplex, tight-tree, longer-path
      rankDir: "TB", //TB, BT, LR, RL
      align: "UL", //UL, UR, DL, DR
      marginX: 50,
      marginY: 50,
      rankSep: 50, //separation between rank (parent-child)
      edgeSep: 50, //separation between adjacent edges in same rank
      nodeSep: 50  //separation between adjacent nodes in same rank
    }
    joint.layout.DirectedGraph.layout(this.graph, layoutOptions);
  },

}
