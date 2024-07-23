// Functions that deal with built in JS things such as filters and DOM operations
AHAB.Helpers = {
  /**
   * Sets a radio button to a value.  Updates the classes of the buttons in
   * the container with the same name, to show new selection.
   *
   * @param {string} name - The name of the radio group to set.  This must
   *   also be the name of the container the buttons are in.
   * @param {string} value - The button that will be checked.
   */
  setRadio(name, value) {
    $(`input[name="${name}"][value="${value}"]`).prop("checked", true);
    let container = document.getElementById(name);
    let labels = container.getElementsByClassName("btn btn-dark");
    $.each(labels, function (index, el) {
      let _this = $(el);
      if (_this.children().val() === value) {
        _this.attr("class", "btn btn-dark active");
      } else {
        _this.attr("class", "btn btn-dark");
      }
    });
  },

  /**
   * Gets which radio button in a group is checked.
   *
   * @param {string} name - The name of the radio group.
   * @returns {string} The value of the checked button.
   */
  checkRadio(name) {
    let el = document.querySelector(`input[name=${name}]:checked`);
    if (el) {
      return el.value;
    }
  },

  /**
   * Sets the model text (name of the regulatory text that was loaded).
   *
   * @param {string} model - regulatory text name
   */
  setModel(model) {
    document.getElementById("rgrtyTextID").value = model;
  },

  /**
   * Updates the perspective choice buttons to match the list passed in.
   * @param {array} perspectives - list of perspectives that can be chosen
   */
  updatePerspectiveButtons(perspectives) {
    let container = document.getElementById("perspective");
    let nodes = perspectives.map((perspective, index) => {
      // Set status of button
      let active = "", checked = "";
      if (index == 0) {
        active = "active";
        checked = "checked";
      }

      // Create label and button inside label
      let label = document.createElement("Label");
      label.className = `btn btn-dark ${active}`;
      label.innerHTML = `<input type="radio" name="perspective" value=${perspective} ${checked}> ${perspective}`;

      return label;
    });
    container.replaceChildren(...nodes);
  },

  /**
   * Writes the data of the cell associated with the id passed in to the info panel.
   * @param {object} cell - the cell to display the info of
   * @param {string} id - the id of the cell which will also be displayed
   */
  displayCellInfo(cell, id) {
    //this.setRadio("ambiguity", cell.ambitype);
    document.getElementById("ambiguity").value=cell.ambitype;
    this.setRadio("severity", cell.severity);
    this.setRadio("intentionality", cell.intentionality);
    this.setRadio("implementability", cell.implementability);
    startPos = cell.textPosition[0];
    endPos = cell.textPosition[1];
    document.getElementById("rgrtyText").value = cell.regulatoryText;
    resizeTextarea($('#rgrtyText'));
    document.getElementById("rgrtyTextID").value = cell.regulatoryTextID;
    document.getElementById("linkedArti").value = id;
    document.getElementById("notesText").value = cell.notesText;
    resizeTextarea($('#notesText'));
  },

  /**
   * Gets the data from the info panel.
   *
   * @return {object} - an object containing ambiguityType, severity, etc.
   */
  getCellInfo() {
    let perspective = this.checkRadio("perspective");
    return {
      id: AHAB.ModelController.nextID(perspective),
      perspective: perspective,
      ambitype: document.getElementById("ambiguity").value,
      //this.checkRadio("ambiguity"),
      severity: this.checkRadio("severity"),
      intentionality: this.checkRadio("intentionality"),
      implementability: this.checkRadio("implementability"),
      textPosition: [startPos, endPos],
      regulatoryText: document.getElementById("rgrtyText").value,
      regulatoryTextID: document.getElementById("rgrtyTextID").value,
      notesText: document.getElementById("notesText").value,
    }
  },

  /**
   * Clears the information panel to the default state, and the UUID to the next available id.
   */
  clearPalette() {
    //this.setRadio("ambiguity", "Lexical");
    document.getElementById("ambiguity").value="Lexical";
    this.setRadio("severity", "1");
    this.setRadio("intentionality", "y");
    this.setRadio("implementability", "y");
    document.getElementById("rgrtyText").value =
      "Please add regulatory text here...";
    resizeTextarea($("#rgrtyText"));
    if (AHAB.ModelController.data.model!="")
    {
      document.getElementById("rgrtyTextID").value =AHAB.ModelController.data.model;
    }
    else
    {
      document.getElementById("rgrtyTextID").value = "Please add legal reference here ...";
    }
    document.getElementById("notesText").value = "Please add any notes here...";
    resizeTextarea($("#notesText"));
    document.getElementById("linkedArti").value = AHAB.ModelController.nextID(this.checkRadio("perspective"));
  },
  /** Get all text nodes within an element for copying.
 * @param {HTMLElement} node - Element to get text nodes of.
 * @return {Array} textNodes - List of all text nodes.
 */
getTextNodesIn(node) {
  var textNodes = [];
  // if it's text, add it to the array, otherwise, look at its children
  if (node.nodeType == window.Node.TEXT_NODE) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, AHAB.Helpers.getTextNodesIn(children[i]));
    }
  }
  return textNodes;
},
  /**
   * returns a tuple containing a range (where the start and end position falls in the given legal text based on the given start and end postions (that were saved in the cell) and the textNodeNumber)
   * @param {HTMLElement} el
   * @param {Number} start
   * @param {Number} end
   */
  Node_RangeAndTextNodeNumber(el, start, end){
    console.log(el);
    console.log(start,end);
    var textNodeNumber=0;
    var range = document.createRange();
    range.selectNodeContents(el);// gives the Range, the element, which in our case is CapDisplay (the legal text content)
    var textNodes = AHAB.Helpers.getTextNodesIn(el);// textNodes contain all the nodes in our text; for example it has node "h1" which has a child, and in it is our header.
    var foundStart = false;
    var charCount = 0,// stores the index of the start of the textNode that it is looking at, at each time
      endCharCount;   // stores the index of the end of the textNode that it is looking at, at each time
    //to set start and end of a range, it should be given the text nodes where the start-position and end-position are in and the index of start and end in their nodes. 
    for (var i = 0, textNode; (textNode = textNodes[i++]); ) {
      //console.log(`TEXTNODE.LEN= ${textNode.length} , textnode= ${textNode}, textNode.type= ${typeof textNode}, textNode.data=`);
      //console.log(textNode.data)
      endCharCount = charCount + textNode.length;
      //console.log(`charcount: ${charCount}, encharcount: ${endCharCount}`);
      if (
        !foundStart &&
        start >= charCount &&
        (start < endCharCount ||
          (start == endCharCount && i <= textNodes.length))
      ) {
        //console.log(AHAB.LegalTextPanel.dict1[AHAB.ModelController.data.model]);
        range.setStart(textNode, start - charCount);
        console.log("start text node: ", textNode);
        foundStart = true;
        textNodeNumber = i;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        console.log("end text node: ", textNode);
        break;
      }
      charCount = endCharCount;
    }
    let a= {'range': range, 'textNodeNumber' : textNodeNumber};
    return a;
  },
  /** Set the selection variable range to highlight the text. NOTE: this function has not been unit tested or edited from its original form.
   * @param {HTMLElement} el
   * @param {Number} start
   * @param {Number} end
   */
  setSelectionRange(el, start, end) {
    //note: start position is calculated like this: each html tag is counted as 1 and each character, including space, inside an html character is also counted as 1. for example: <html data=".." ...> =>this is counted as one.  <html> hi mom </html> =>the start position for "mom" is 5 (one for tag and 4 for " hi ") 
    if (document.createRange && window.getSelection) {
      let cellTextPosInfo= AHAB.Helpers.Node_RangeAndTextNodeNumber(el, start, end);
      console.log(cellTextPosInfo);
      let range= cellTextPosInfo['range']
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range)
      //$("::selection").css( "background-color" );
    } else if (document.selection && document.body.createTextRange) {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(true);
      textRange.moveEnd("character", end);
      textRange.moveStart("character", start);
      textRange.select();
    }
  },

  /**
   * Returns HTML for a header for a table displaying cell info.
   * If this project ends up using a framework that handles reusable HTML, it would be better suited that this code be handled by the framework.
   */
  createInfoTableHeader() {
    return `
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
  },

  /**
   * Returns HTML for a row for a table displaying cell info.
   * @param {string} id - id of the cell that will be displayed
   * @param {object} cell - data of the cell that will be displayed
   */
  createInfoTableRow(id, cell) {
    return `
    <tr>
      <td>${cell.perspectives}</td>
      <td>${cell.notesText}</td>
      <td>${cell.ambitype}</td>
      <td>${cell.severity}</td>
      <td>${cell.intentionality}</td>
      <td>${cell.implementability}</td>
      <td style="word-wrap: break-word; min-width: 190px; max-width: 190px">
        ${cell.regulatoryText}
      </td>
      <td>${cell.regulatoryTextID}</td>
      <td>${id}</td>
    </tr>`;
  },

  /**
   * Adds logEvent to the 'logfile.txt' in sessionStorage, and to the console if the type is enabled, or if there is no type given.
   * @param {string} logEvent - the item to add to the log
   * @param {string} logType - the type of the item to determine if it should be logged to console. Types now include FILE, INTERFACE, and DATA
   */
  logItem(logEvent, logType) {
    var digest = sessionStorage.getItem("logfile.txt");
    var str = `${exports.timeStamp()}: ${logEvent}`;
    sessionStorage.setItem("logfile.txt", digest + "\n" + str);
    // If no type is given, or the type is enabled, log to console
    if (!logType) {
      console.log(logEvent);
    } else if (logTypesEnabled.has(logType)) {
      // print an error instead of log if the type is set to error
      if (logType === logTypes.ERROR) {
        console.error(logEvent);
      } else {
        console.log(`(${logType}) ${logEvent}`);
      }
    }
  }
}
