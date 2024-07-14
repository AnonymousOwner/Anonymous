// Model Controller handles the data
AHAB.ModelController = {

  // all data which will be saved
  data: {
    model: "",  // title of legal text
    perspectives: [],  // an array of all the valid perspectives
    cells: {} // the ambiguity graph, where each cell refers to a node, a link, or a terminal
  },

  // functions
  /**
   * Sets any attributes (export time and file name) for exporting and calls the fileHandler download function.
   * @param {string} model - The name of the model being worked on
   */
  saveToJSON(model) {
    let time = Date.now();
    let filename = `${model}_${time}_ahab-1.2.json`;

    this.data.exportTime = time;

    fileHandler.downloadFile(filename, this.data);
  },

  /**
   * Edits the graphController's data based on the data loaded in, and calls
   * to regenerate the graph.
   *
   * @param {object} data - the new data to either be replacing the current
   *   data or be added to it
   * @param {boolean} clearGraph - true if the data should be replaced, false
   *   if the new data should be added to the current
   */
  loadFromJSON(data, clearGraph) {
    // if clearGraph, then we want to completely remove anything in the
    // current graph priot to adding the new data
    if (clearGraph) {
      this.data = data;
      AHAB.Helpers.setModel(this.data.model);
    } else {
      // otherwise add new perspectives and cells
      data.perspectives.forEach(newPerspective => {
        if(this.data.perspectives.length==0 || this.data.perspectives.indexOf(newPerspective)== -1){
          this.data.perspectives = this.data.perspectives.concat(data.perspectives);
        }
      });

      this.data.cells = {...this.data.cells, ...data.cells};
    }
    AHAB.Helpers.updatePerspectiveButtons(this.data.perspectives);
    AHAB.JointJSWrapper.generateGraph(this.data);
    AHAB.Heatmap.colorGraph();
  },

  /**
   * Adds new perspective if it's not already in the data.
   * @param {string} perspective - the perspective (name) to be added
   */
  addPerspective(perspective) {
    if (!this.data.perspectives.includes(perspective)) {
      this.data.perspectives.push(perspective);
    }
  },

  /**
   * Adds a new component to the data and graph.
   * @param {object} info
   * @param {string} info.id - the id of the new component
   * @param {string} info.perspective - whose perspective the cell is created for
   * @param {string} info.ambitype - one of the types Lexical, Syntactic etc.
   * @param {string} info.severity - severity from 1-5
   * @param {string} info.intentionality - yes/no
   * @param {string} info.implementability - yes/no
   * @param {Array} info.textPosition - array containing start and end position of the snippet in the regulatory text
   * @param {string} info.regulatoryText - the text the cell refers to
   * @param {string} info.regulatoryTextID - the regulatory text reference the cell refers to
   * @param {string} info.notesText - any notes to go in the cell notesText field
   */
  addCell({id, perspective, ambitype, severity, intentionality, implementability, textPosition, regulatoryText, regulatoryTextID, notesText}) {
    // set the new component's properties and add it to the data keyed by its id
    this.data.cells[id] = {
      "ambitype": ambitype,
      "severity": severity,
      "intentionality": intentionality,
      "implementability": implementability,
      "textPosition": textPosition,
      "regulatoryText": regulatoryText,
      "regulatoryTextID": regulatoryTextID,
      "notesText": notesText,
      "outgoingLinks": [],
      "incomingLinks": [],
      "perspectives": [perspective]
    }
    // call the function to create the shape on the graph
    AHAB.JointJSWrapper.addElementToGraph(id);
  },

  /**
   * Adds a Start or Stop to the data.
   */
  addTerminal({id, perspective, terminalType}) {
    // set the new terminals's properties and add it to the data keyed by its id
    this.data.cells[id] = {
      terminal: terminalType,
      outgoingLinks: [],
      incomingLinks: [],
      perspectives: [perspective]
    }
    // call the function to create the terminal on the graph
    AHAB.JointJSWrapper.addTerminalToGraph(id, terminalType);
  },

  /**
   * Gets the next highest ID for a perspective.
   * @param {string} perspective - the perspective to search for the next ID for.
   */
  nextID(perspective) {
    // fetch all non-terminal cells with the correct perspective
    let cell_ids = Object.keys(this.data.cells).filter((cell) => {
      let info = this.data.cells[cell];
      return info.perspectives[0] == perspective && !info.terminal;
    });

    // if there are no cells, return 0
    if (!cell_ids.length) {
      return `${perspective}_0`;
    }

    cell_ids = cell_ids.map((cell) => {
      // split off the perspective and just return the number
      cell_parts = cell.split("_");
      return parseInt(cell_parts[cell_parts.length - 1], 10);
    })
    // return the next highest value for this perspective
    return `${perspective}_${Math.max(...cell_ids) + 1}`;
  },

  /**
   * Getter function to return cell data.
   * @param {string} id - the id of the cell to find the data of
   */
  getCellData(id) {
    return this.data.cells[id];
  },

  /**
   * Function to set properties of a cell.
   * @param {string} id - the id of the cell the update
   * @param {object} attributes - Key-value pairs of the attribute to update
   */
  updateCellData(id, attributes) {
    let cell = this.getCellData(id);
    let acceptableKeys=[
      "id",
      "ambitype",
      "severity",
      "intentionality",
      "implementability",
      "textPosition",
      "regulatoryText",
      "regulatoryTextID",
      "notesText",
      "outgoingLinks",
      "incomingLinks",
      "perspectives"
    ];
    for (let key in attributes) {
      if(acceptableKeys.indexOf(key)!= -1)
      {
        cell[key] = attributes[key];
      }else{
        console.log("There's an attribute that wasn't defined before for the cell. ");
      }
    }
    return cell;
  },

  /**
   * Deletes a cell and all links attached to it from the data and calls a function to delete them from the graph.
   * @param {string} id - the id of the cell to delete
   */
  deleteCell(id) {
    let cell = this.getCellData(id);
    // delete links to other cells
    for (let link of cell.outgoingLinks) {
      let toCell = this.getCellData(link);
      console.log("outgoing link: ",link,", tocell: ",toCell);
      let index = toCell.incomingLinks.indexOf(id);
      toCell.incomingLinks.splice(index, 1)
    }
    // delete links from other cells to this one
    for (let link of cell.incomingLinks) {
      let toCell = this.getCellData(link);

      console.log("incoming link: ",link,", tocell: ",toCell);
      let index = toCell.outgoingLinks.indexOf(id);
      toCell.outgoingLinks.splice(index, 1)
    }
    // delete cell in the data
    delete this.data.cells[id];
    AHAB.ModelController.unselectAllTheSelectedCells(false);

    // delete cell from the graph
    AHAB.JointJSWrapper.deleteElementFromGraph(id);
  },

  // TODO: Option type instead of returning different types
  /**
   * Check if the components we want to merge are valid to be merged.
   * We will check to see if they have similar properties (ambitype, severity, intentionality, implementability, links)
   * If the components we want to merge have different perspectives but every other property is similar, they are still valid to be merged.
   * @return {bool/string} - true if merge is valid, error string otherwise.
   */
  isValidToMerge() {

    //get the name of the first component we want to merge
    let nameOfFirstComponent = selectArray[0];

    //this will create a deep copy of the data in the first component we want to merge
    //we will compare all the components we want to merge to this object to check if they all have similar properties
    let compareToObject = JSON.parse(JSON.stringify( this.data.cells[nameOfFirstComponent] ));

    selectArray.forEach((nameOfComponent) => {
      let currentComponent = this.data.cells[nameOfComponent];

      //this is the first check to see if they have similar properties
      if (currentComponent["ambitype"] !== compareToObject["ambitype"]){
        return "ambitype is not similar for these components";
      }

      else if (currentComponent["severity"] !== compareToObject["severity"]){
        return "severity is not similar for these components";
      }

      else if (currentComponent["intentionality"] !== compareToObject["intentionality"]){
        return "intentionality is not similar for these components";
      }

      else if (currentComponent["implementability"] !== compareToObject["implementability"]){
        return "implementability is not similar for these components";
      }

      else if (currentComponent["regulatoryTextID"] !== compareToObject["RegulatoryTextID"]){
        return "The referenced regulatory text is not similar for these components";
      }

      currentComponent.outgoingLinks.forEach(link => {
        if (compareToObject.outgoingLinks.indexOf(link) !== -1){
          return "outgoing links are not similar for these components";
        }
      });

      // untested: checks incoming links
      for (let link in currentComponent.incomingLinks) {
        if (!compareToObject.incomingLinks.includes(link)) {
          return "incoming links are not similar for these components";
        }
      }
    });

    //if all the selected components have similar properties, they are allowed to be merged together
    return true;
  },

  /**
   * Merge identical cells to create a cell with both perspectives.
   * The newly created merged object will have the same properties as the first object we want to merge as it's only valid to merge two cells that are exactly the same. Merge does NOT delete the two cells.
   */
  mergeCell() {

    if (this.isValidToMerge() === true) {

      //get the name of the first component we want to merge
      let id1 = selectArray[0];

      //get the name of the second component we want to merge
      let id2 = selectArray[1];

      //set the properties of the newly created merged object to have all the same properties as the first component we want to merge
      //JSON.parse(JSON.stringify(object)) will make a deep copy
      let mergedId = `Merged\n${id1},\n${id2}`;
      this.data.cells[mergedId] = JSON.parse(JSON.stringify(this.data.cells[id1]));
      let merged = this.getCellData(mergedId);

      // the new cell should have all the perspectives from the merged cells
      let mergedPerspectives = this.data.cells[id1].perspectives.concat(this.data.cells[id2].perspectives);
      this.updateCellData(mergedId, { perspectives: mergedPerspectives });

      // add the cell to the graph
      AHAB.JointJSWrapper.addElementToGraph(mergedId);
      AHAB.JointJSWrapper.setAveragePosition(mergedId, selectArray.slice(0, 2));

      // add the links from and to merged
      for (let target of merged.outgoingLinks) {
        this.data.cells[target].incomingLinks.push(mergedId);
        AHAB.JointJSWrapper.addLinkToGraph(mergedId, target);
      }
      for (let source of merged.incomingLinks) {
        this.data.cells[source].outgoingLinks.push(mergedId);
        AHAB.JointJSWrapper.addLinkToGraph(source, mergedId);
      }

      this.dataAndGraphAgree();

    } else {

      let errorMessage = this.isValidToMerge();

      //if the components do not have similar properties, they are not allowed to be merged
      alert(`You cannot merge these components, ${errorMessage}`);
    }
  },

  /**
   * Create two new key-value pairs in the cells object that represent the
   * data of the two newly created split components
   *
   * NOTE: Splits the first cell in the selectArray.
   */
  splitCell() {

    //the component we want to split is the one we have currently selected
    let splitComponentId = selectArray[0];
    let clone1 = `${splitComponentId}.1`;
    let clone2 = `${splitComponentId}.2`;

    let original = this.getCellData(splitComponentId);

    //set the name of the two newly created split objects to have the same name as the object prior to splitting + .1/.2
    //set the properties of the two newly created split objects to have all the same properties as the object prior to splitting
    //JSON.parse(JSON.stringify(object)) will make a deep copy
    this.data.cells[clone1] = JSON.parse(JSON.stringify(original));
    this.data.cells[clone2] = JSON.parse(JSON.stringify(original));

    //create the new graph elements
    AHAB.JointJSWrapper.addSplitCellsToGraph(splitComponentId, clone1, clone2);

    // update target cells' incoming links
    for (let target of original.outgoingLinks) {
      this.data.cells[target].incomingLinks.push(clone1, clone2);
      AHAB.JointJSWrapper.addLinkToGraph(clone1, target);
      AHAB.JointJSWrapper.addLinkToGraph(clone2, target);
    }

    // update source cells' outgoing links
    for (let source of original.incomingLinks) {
      this.data.cells[source].outgoingLinks.push(clone1, clone2);
      AHAB.JointJSWrapper.addLinkToGraph(source, clone1);
      AHAB.JointJSWrapper.addLinkToGraph(source, clone2);
    }

  },

  /**
   * Function to unselect all the selected cells and update the last selected one if set to.
   * @param {Boolean} updateLastSelectedNode - while unselecting everything Do you want to update the last selected node?
   */
  unselectAllTheSelectedCells(updateLastSelectedNode){
    let graph = AHAB.JointJSWrapper.graph;
    let paper = AHAB.JointJSWrapper.paper;
    let allCells = new Array();
    allCells = graph.getCells();
    for (var i = 0; i < allCells.length; i++) {//unhighlight all the selected cells
      var cellView = paper.findViewByModel(allCells[i]); // gets all of the cells in the model.
      if (cellView.model.attr("info") === true) {
        cellView.unhighlight();
        cellView.remove();
      } else {
        cellView.unhighlight();
        cellView.hideTools();
      }
    }

    if (cellView === undefined) {
      //DO NOTHING
    }
    else if (document.getElementById("editReadOnlyMode").checked) {
      window.getSelection().empty();
      selectArray = [];
      allSelectedIncludingTerminals = [];
      return;
    }
    else if (selectArray === null) {
      selectArray = [];
      allSelectedIncludingTerminals = [];
      window.getSelection().empty();
      return;
    }
    else
    {
      var perspective = AHAB.Helpers.checkRadio("perspective");
      if (perspective === undefined || perspective === "default") {//background=orange + return
        selectArray = [];
        allSelectedIncludingTerminals = [];
        AHAB.Helpers.setRadio("perspective", "default");
        document.getElementById("editReadOnlyMode").checked = true;
        alert("In Default User -- Setting Input to Read Only");
        paper.drawBackground({
          color: "orange",
        });
        return; // No user return out.
      }
      //var arrLen = selectArray.length - 1; //you r assumming the selected node that is being updated is the last one that was added to the srlectArray which can't be true if you have selected multiple nodes and the node which u selected last, was one of the nodes u had selected before
      //the index of last selected node is now stored in lastSelectedIndex
      var cellView = paper.findViewByModel(allSelectedIncludingTerminals[lastSelectedIndex]);
      if (cellView === undefined) {return;}
      var cell = graph.getCell(cellView.model.id);
     /* if (cell.isLink() === true) {//when a link gets selected in selectcell function, cell is undefined and you never added it to selectArray or allselectedIncludingTermnals, in the first place, so there's no way this cell could be a link
        //var attrbs = [document.getElementById("linkWeight").value];
        var link = graph.getCell(cellView.model.id);
      }
      else*/ if (cellView.model.get("type") === "terminal.Element") {
        //DO NOTHING
      }
      else if(updateLastSelectedNode){//updating a nodes info
        // Set the modifications to the data
        let info = AHAB.Helpers.getCellInfo();

        // Since the cell could be from a merge and have multiple perspectives, copying the perspective is not only unnecessary but would lead to issues.
        delete info.perspective;
        AHAB.ModelController.updateCellData(cellView.model.id, info);
        AHAB.Heatmap.colorGraph();
        AHAB.Highlight.colorChange(document.getElementById("ambiguity").value);
          //AHAB.Helpers.checkRadio("ambiguity"));
      }
    }
    AHAB.Helpers.clearPalette();
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
    allSelectedIncludingTerminals = [];
    lastSelectedAmbiNodeIndex=-1;
    lastSelectedIndex=-1;
    window.getSelection().empty();
    AHAB.Helpers.logItem("User unselected all the selected nodes.", logTypes.INTERFACE);
  },
  /**
   * Checks whether the data and the graph are the same, i.e. all elements and links present on one are present on the other.
   * @return {bool} - true if everything is present on both, false otherwise.
   */
  dataAndGraphAgree() {
    let valid = true; // validity flag to be returned
    let graph = AHAB.JointJSWrapper.graph;

    // Check that all the data is on the graph
    for (let id in this.data.cells) {
      let cell = graph.getCell(id);
      if (cell) {

        // Get the links to and from the cell on the graph
        let outgoing = graph.getConnectedLinks(cell, { outbound: true })
          .map(link => link.getTargetCell().id);
        let incoming = graph.getConnectedLinks(cell, { inbound: true })
          .map(link => link.getSourceCell().id);

        // Compare them with the links in the data
        for (let link of this.data.cells[id].outgoingLinks) {
          if (!outgoing.includes(link)) {
            valid = false;
            AHAB.Helpers.logItem(`A link from ${id} does not exist on the graph`, logTypes.ERROR);
            console.log(link, outgoing, incoming)
          }
        }
        for (let link of this.data.cells[id].incomingLinks) {
          if (!incoming.includes(link)) {
            valid = false;
            AHAB.Helpers.logItem(`A link to ${id} does not exist on the graph`, logTypes.ERROR);
          }
        }

      } else {
        // If the cell doesn't exist, the data isn't all on the graph
        valid = false;
        AHAB.Helpers.logItem(`Cell ${id} does not exist on the graph.`, logTypes.ERROR);
      }
    }

    // Check that all the graph is present in the data
    for (let cell of graph.getElements()) {
      if (!this.data.cells[cell.id]) {
        // If the cell doesn't exist in the data, it's not valid
        valid = false;
        AHAB.Helpers.logItem(`Cell ${cell.id} does not exist in the data.`, logTypes.ERROR)
      }
    }
    // Check that the graph links are present in the data
    for (let link of graph.getLinks()) {
      let source = link.getSourceCell();
      let target = link.getTargetCell();
      // For every link that is fully connected
      if (source && target) {
        if (!this.data.cells[source.id].outgoingLinks.includes(target.id) ||
            !this.data.cells[target.id].incomingLinks.includes(source.id)) {
          valid = false;
          AHAB.Helpers.logItem(`Link from ${source.id} to ${target.id} is different/nonexistent in the data.`, logTypes.ERROR);
        }
      }
    }

    return valid;
  },

  // Link the elements by drag and drop
// This function has been quick-fixed to add to the data in the current model. It is likely to need other changes.
  linkElement() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    paper.on({
      "element:pointerdown": function (elementView, evt) {
        evt.data = elementView.model.position();
      },
      "element:pointerup": function (elementView, evt, x, y) {
        var coordinates = new g.Point(x, y);
        var elementAbove = elementView.model;
        var elementBelow = this.model
          .findModelsFromPoint(coordinates)
          .find(function (el) {
            return el.id !== elementAbove.id;
          });
        if (elementAbove.attr("info") === true) {
          return;
        }
        // If the two elements are connected already, don't
        // connect them again (this is application-specific though).
        if (
          elementBelow &&
          graph.getNeighbors(elementBelow).indexOf(elementAbove) === -1
        ) {
          // Move the element to the position before dragging.
          elementAbove.position(evt.data.x, evt.data.y);
          // Create a connection between elements.
          let source = elementAbove.id;
          let target = elementBelow.id;
          console.log(source,target);
          AHAB.JointJSWrapper.addLinkToGraph(source, target);
          // Add to the data
          let sourceCell = AHAB.ModelController.getCellData(source);
          let targetCell = AHAB.ModelController.getCellData(target);
          sourceCell.outgoingLinks.push(target);
          targetCell.incomingLinks.push(source);

          AHAB.Helpers.logItem(`Added Link between ${source} and ${target}`, logTypes.DATA);
        }
      },
    });
  }
}
