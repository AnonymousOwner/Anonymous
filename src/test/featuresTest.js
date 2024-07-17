const expect = require("chai").expect;

// AHAB modules
const features = require("../js/ahab/Features.js");

// // Tests

describe("Radio Button Functions", function () {
  // Create div with the correct id, with 2 radio buttons
  before(function () {
    document.body.innerHTML = `
      <div id="radiobutton">
        <input type="radio" name="radiobutton" value="value1" checked>
        <input type="radio" name="radiobutton" value="value2" id="button2">
      </div>
    `;
  });

  // Check that the value returned matches the value of the actual radio
  describe("# checkRadio", function () {
    it("gets radio button value by name", function () {
      expect(features.checkRadio("radiobutton")).to.equal("value1");
    });
    it("returns undefined if the button does not exist", function () {
      expect(features.checkRadio("undefinedbutton")).to.be.undefined;
    });
  });

  // Check that the button that's checked is the one we tried to set
  describe("# setRadio", function () {
    it("sets radio button value in container with name as id", function () {
      features.setRadio("radiobutton", "value2");
      expect(document.getElementById("button2").checked).to.be.true;
    });
  });
});

describe("Other retrieval of data from page", function () {
  describe("# getTextNodesIn", function () {
    // Create div with text nodes (no spaces as we can't get those by id)
    before(function () {
      document.body.innerHTML = `
        <div id="texts"><p id="Text1">Text1</p><p id="Text2">Text2</p></div>
      `;
    });
    it("returns an array of all the text nodes", function () {
      // get element and run function
      const el = document.getElementById("texts");
      let textNodes = features.getTextNodesIn(el);
      // match it to the expected, Text1 node and Text2 node
      let expectedTextNodes = [
        document.getElementById("Text1").childNodes[0],
        document.getElementById("Text2").childNodes[0]
      ];
      expect(textNodes).to.deep.equal(expectedTextNodes);
    });
  });
});

describe("Utility", function () {
  describe("# arrayUnique", function () {
    let logTypeReceived = "";
    before(function () {

      function mockStorage() {
        var storage = {};
        return {
            setItem: function(key, value) {
                storage[key] = value || '';
            },
            getItem: function(key) {
                return storage[key];
            },
            removeItem: function(key) {
                delete storage[key];
            },
            get length () {
                return Object.keys(storage).length;
            },
            key: function(i) {
                var keys = Object.keys(storage);
                return keys[i] || null;
            }
        };
    };

    global['sessionStorage'] = mockStorage();

    // create global logTypes that existed in the project
      global.logTypes = { ERROR: "error" }

    });
    it("removes duplicate items in an array", function () {
      // check that it returned an array with no duplicates
      let arrayWithDupes = [1, 1, 2, 3, 1, 4, 4, 5, 5];
      let arrayWithoutDupes = features.arrayUnique(arrayWithDupes);
      expect(arrayWithoutDupes).to.deep.equal([1, 2, 3, 4, 5]);

    });
    it("removes duplicate items using a filter function if provided", function () {
      // filter by a unique property being even/oddness
      let arrayWithDupes = [1, 1, 2, 3, 1, 4, 4, 5, 5];
      let arrayWithoutDupes = features.arrayUnique(arrayWithDupes, (x) => x % 2);
      expect(arrayWithoutDupes).to.deep.equal([1, 2]);

    });
    it("errors if the second argument is not a function", function () {
      // mock logItem function to instead set a variable to the log
      features.logItem = function(message, logType) {
        logTypeReceived = logType;
      }
      features.arrayUnique([], "not a function");
      expect(logTypeReceived).to.equal("error");

    })
    // remove the global logTypes
    after(function() {
      delete global.logTypes;

    })
  });
});

describe("UUID", function () {
  describe("# UUIDsearch", function () {
    // Set up a "graphthinger" and "paperBox" with values to mimic jointjs
    before(function () {
      document.body.innerHTML = `
        <div id="graphthinger"></div>
        <div id="paperBox"></div>
      `;
      // The graphthinger's value is an object with a method to return the elements of the graph. In this case, each element is just a string since the function only checks one attribute of the elements.
      document.getElementById("graphthinger").value = {
        length: 3,
        getElements() {
          return [
            "ambiguity.Element",
            "not ambiguity.Element",
            "ambiguity.Element"
          ];
        }
      };
      // paperBox's value is an object with a method to check the properties of an element passed to it.
      document.getElementById("paperBox").value = {
        findViewByModel(cell) {
          return {
            model: {
              get() {
                return cell;
              }
            }
          };
        }
      };
    });

    // Check after remaking the list to have only non-ambiguity.Elements
    it("returns 0 if there are no shapes", function () {
      document.getElementById("graphthinger").value = {
        length: 0,
        getElements() {
          return ["not ambiguity.Element"];
        }
      };
      expect(features.UUIDsearch("Harvey")).to.equal(0);
    });
  });
});

describe("# clearPalette", function () {
  // Create a mock palette with Ambiguity, Severity, Intentionality, and Implementability radio buttons, and the 3 text fields, all set to non-default values.
  beforeEach(function () {
    perspective = "Harvey";

    document.body.innerHTML = `
      <div id="ambiguity">
        <input type="radio" name="ambiguity" value="Failure" checked>
        <input type="radio" name="ambiguity" value="Lexical">
      </div>
      <div id="severity">
        <input type="radio" name="severity" value="Failure" checked>
        <input type="radio" name="severity" value="1">
      </div>
      <div id="intentionality">
        <input type="radio" name="intentionality" value="Failure" checked>
        <input type="radio" name="intentionality" value="y">
      </div>
      <div id="implementability">
        <input type="radio" name="implementability" value="Failure" checked>
        <input type="radio" name="implementability" value="y">
      </div>
      <input type="text" id="rgrtyText" value="Failure">
      <input type="text" id="notesText" value="Failure">
      <input type="text" id="linkedArti" value="Failure">
    `;
  });


  it("sets Unique Artifact ID field to next highest UUID#", function() {
    features.UUIDsearch = function() {
      return 3;
    };
    features.clearPalette();

    // next UUID
    expect(document.getElementById("linkedArti").value).to.equal("UUID3");

  });

  it("resets Regulatory-Text text field", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

    // Text fields default text
    expect(document.getElementById("rgrtyText").value).to.equal(
      "Please add regulatory text here..."
    );

  });

  it("resets Regulatory-Text ID text field", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

  });

  it("resets Ambiguity radio button", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

    // Ambiguity: Lexical
    expect(
      document.querySelector("input[name=ambiguity]:checked").value
    ).to.equal("Lexical");

  });

  it("resets Notes radio button", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

    // Notes field default text
    expect(document.getElementById("notesText").value).to.equal(
      "Please add any notes here..."
    );

  });

  it("resets Severity radio button", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

    // Severity: 1
    expect(
      document.querySelector("input[name=severity]:checked").value
    ).to.equal("1");

  });

  it("resets Intentionality radio button", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

    // Intentionality: y
    expect(
      document.querySelector("input[name=intentionality]:checked").value
    ).to.equal("y");

  });

  it("resets Implementability radio button", function() {
    features.UUIDsearch = function () {
      return 3;
    };
    features.clearPalette();

    // Implementability: y

    expect(
      document.querySelector("input[name=implementability]:checked").value
    ).to.equal("y");

  });
  after(function () {
    //set global variables to undefined after the unit test
    perspective = undefined;
  });
});

describe("# resizeCanvas", function () {
  before(function () {
    document.body.innerHTML = `<div id="paperBox"></div>`;

    document.getElementById("paperBox").value = {
      width: 100,
      height: 100,
      setDimensions(width, height) {
        this.width = width;
        this.height = height;
      }
    };
  });

  //set canvas size to width = 3 and height = 4 and check
  it("sets the size of the paper", function () {
    features.resizeCanvas(3, 4);
    var width = document.getElementById("paperBox").value.width;
    var height = document.getElementById("paperBox").value.height;

    expect(width).to.equal(3);
    expect(height).to.equal(4);
  });
});

describe("# setMergedPos", function () {
  var xPositionTable, yPositionTable, merged;
  before(function () {
    xPositionTable = [1,2,3];
    yPositionTable = [3,4,5];

    merged = {
      xPos: 0,
      yPos: 0,
      position(newXPos,newYPos){
        this.xPos = newXPos;
        this.yPos = newYPos;
      }
    }
  });

  it("calculate and set (X,Y) position for newly created merged component", function () {
    features.setMergedPos(xPositionTable, yPositionTable, merged);

    var mergedXPos = merged.xPos;
    var mergedYPos = merged.yPos;

    //We take the sum of every element in xPositionTable and divide by the size of the xPositionTable array
    //(1+2+3) ÷ 3 = 2
    var expectedXPos = 2;

    //We take the sum of every element in yPositionTable and divide by the size of the yPositionTable array
    //(3+4+5) ÷ 3 = 4
    var expectedYPos = 4;
    
    expect(mergedXPos).to.equal(expectedXPos);
    expect(mergedYPos).to.equal(expectedYPos);
  });
});

describe("# setMergedAttributes", function () {
  var printArray, idStringArray, regTextStringArray, arrayPush, result, merged;
  beforeEach(function () {
    //the '5' in the second subarray is a string because the setMergedAttributes() function applies 
    //the trim() function to the 5th index of each subarray and the trim() function only works on strings 
    printArray = [["John",'a','b','c','d','e','f','g','h','i','j','k','l'],["Alex",1,2,3,4,'5',6,7,8,9,10,11,12]];
    idStringArray = [];
    regTextStringArray = [];
    arrayPush = {};
    //result is an object that will contain sub-objects with the keys "John" and "Alex"
    result = {};

    merged = {
      set(obj){
        result = obj;
      }
    }
  });

  it("populate idStringArray with the 8th index value of each subarray in printArray", function () {
    features.setMergedAttributes(printArray, idStringArray, regTextStringArray, arrayPush, merged);

    //If the test is successful, the idStringArray should be populated with the 8th index value in each subarray of printArray
    var expectedidStringArray = ['h',8];
    expect(idStringArray).to.deep.equal(expectedidStringArray);

  });

  it("populate regTextStringArray with the 5th index value of each subarray in printArray", function () {
    features.setMergedAttributes(printArray, idStringArray, regTextStringArray, arrayPush, merged);

    //If the test is successful, regTextStringArray should be populated with the 5th index value in each subarray of printArray
    var expectedRegTextStringArray = ['e','5'];
    expect(regTextStringArray).to.deep.equal(expectedRegTextStringArray);

  });


  it("sets the attributes (ambiguity type, severity, intentionality, implementability, regulatory text, notes) on the merged component", function () {
    features.setMergedAttributes(printArray, idStringArray, regTextStringArray, arrayPush, merged);

    //this object contains the expected property values for the sub-object with the key "John" in the result object
    var expectedJohnObj = {
      user: "John",
      ambitype: 'a',
      severity: 'b',
      intentionality: 'c',
      implementability: 'd',
      regulatoryText: 'e',
      regulatoryTextXpos: 'k',
      regulatoryTextYpos: 'l',
      regulatoryTextRef: "Phrase",
      notesText: 'i',
    };
  
    //this object contains the expected property values for the sub-object with the key "Alex" in the result object
    var expectedAlexObj = {
      user: "Alex",
      ambitype: 1,
      severity: 2,
      intentionality: 3,
      implementability: 4,
      regulatoryText: '5',
      regulatoryTextXpos: 11,
      regulatoryTextYpos: 12,
      regulatoryTextRef: "Phrase",
      notesText: 9,
    };

    //We use '.to.deep.equal()' to check for equality between two objects, to check if their property values are the same
    //If the test is successful, the sub-object with the key "John" in the result object will match our expected property values
    expect(result["John"]).to.deep.equal(expectedJohnObj);

    //If the test is successful, the sub-object with the key "Alex" in the result object will match our expected property values
    expect(result["Alex"]).to.deep.equal(expectedAlexObj);  

    });
});

describe("# cloneCells", function () {
  var graph, addToArray, originPos, clone1, clone2;
  beforeEach(function () {

    graph = {};

    //the addToArray will contain 'SUCCESS' messages in the 0th and 1st index if we successfully added the cloned components to the graph
    addToArray = [];
    
    //originPos is an object with (x & y) property values that will be used in a formula to determine the new (x & y) positions of the cloned cells
    originPos = {
      x: 10,
      y: 10
    }

    clone1 = {
      linkedArtifactID: "clone1LinkedArtifactID",
      "label/text": "null",
      position: {},

      get(property){
        return this[property];
      },

      set(property, value){
        this[property] = value;
      },

      //the attr() function performs the same action as the set() function
      attr(property, value){
        this[property] = value;
      },
      
      //to test if we successfully added the clone1 component to the graph, we will add a 'SUCCESS' message to the 0th index of the addToArray
      addTo(graph){
        addToArray[0] = "SUCCESSFULLY added clone1 to graph";
      }
    }

    clone2 = {
      linkedArtifactID: "clone2LinkedArtifactID",
      "label/text": "null",
      position: {},

      get(property){
        return this[property];
      },

      set(property, value){
        this[property] = value;
      },

      //the attr() function performs the same action as the set() function
      attr(property, value){
        this[property] = value;
      },

      //to test if we successfully added the clone2 component to the graph, we will add a 'SUCCESS' message to the 1th index of the addToArray
      addTo(graph){
        addToArray[1] = "SUCCESSFULLY added clone2 to graph";
      }
    }
  });

  it("Give the split components the same Unique Artifact ID as the component prior to splitting and append '.1'/'.2' at the end of the Unique Artifact ID for the split components", function () {
    features.cloneCells(clone1, clone2, originPos, graph);

    var clone1LinkedArtifactId = clone1.linkedArtifactID;
    var clone2LinkedArtifactId = clone2.linkedArtifactID;

    //If the test is successful, '.1' should be appended at the end of the clone1LinkedArtifactId string
    var expectedClone1LinkedArtifactId = "clone1LinkedArtifactID.1";
    expect(clone1LinkedArtifactId).to.equal(expectedClone1LinkedArtifactId);

    //If the test is successful, '.2' should be appended at the end of the  clone2LinkedArtifactId string
    var expectedClone2LinkedArtifactId = "clone2LinkedArtifactID.2";
    expect(clone2LinkedArtifactId).to.equal(expectedClone2LinkedArtifactId);

  });

  it("Set the split component's label/text property", function() {
    features.cloneCells(clone1, clone2, originPos, graph);

    //clone1&2LabelText should contain the new linkedArtifactId, with .1/.2 appended at the end of the string
    var clone1LabelText = clone1["label/text"];
    var clone2LabelText = clone2["label/text"];

    //If the test is successful, clone1LabelText should be set to the new linkedArtifactId, with .1 appended at the end of the string
    var expectedClone1LabelText = "clone1LinkedArtifactID.1";
    expect(clone1LabelText).to.equal(expectedClone1LabelText);

    //If the test is successful, clone2LabelText should be set to the new linkedArtifactId, with .2 appended at the end of the string
    var expectedClone2LabelText = "clone2LinkedArtifactID.2";
    expect(clone2LabelText).to.equal(expectedClone2LabelText);

  });

  it("Adjust the (X,Y) position for the split components", function() {
    features.cloneCells(clone1, clone2, originPos, graph);

    var clone1Position = clone1.position;
    var clone2Position = clone2.position;

    //x = 50 + original position of x (10) = 60
    //y = 50 + original position of y (10) = 60
    var expectedClone1Position = {
      x: 60,
      y: 60
    };

    //x = 75 + original position of x (10) = 85
    //y = 100 + original position of y (10) = 110
    var expectedClone2Position = {
      x: 85,
      y: 110
    };

    //If the test is successful, the 'clone1Position' object property values should match our expected values
    //We use '.to.deep.equal()' to check for equality between two objects, to check if their (x & y) property values are the same
    expect(clone1Position).to.deep.equal(expectedClone1Position);

    //If the test is successful, the 'clone2Position' object property values should match our expected values
    expect(clone2Position).to.deep.equal(expectedClone2Position);

  });

  it("Add the split components to the graph", function() {
    features.cloneCells(clone1, clone2, originPos, graph);

    //If the test is successful, there should be a 'SUCCESS' message at the 0th index
    var addClone1ToGraph = addToArray[0];
    expect(addClone1ToGraph).to.equal("SUCCESSFULLY added clone1 to graph");

    //If the test is successful, there should be a 'SUCCSESS' message at the 1st index
    var addClone2ToGraph = addToArray[1];
    expect(addClone2ToGraph).to.equal("SUCCESSFULLY added clone2 to graph");
    
  });
});

//the populateTables() function contains an outer if-else statement
//we are testing the if-statement in this unit test to ensure every action performed in the if-statement works as expected
//if (cellView.model.get("type") === "ambiguity.Element")
describe("# populateTables", function (){
  var cloneTable, xPositionTable, yPositionTable, johnsPerspective, adamsPerspective, paper, graph;
  beforeEach(function () {

    //cloneTable will become a 2d array where each subarray will contain attribute values for ambiguity type, severity, intentionality, implementability, regulatory text, and notes
    cloneTable = [];
    xPositionTable = [];
    yPositionTable = [];
    selectArray = [1];

    johnsPerspective = {
      ambitype: 'a',
      severity: 'b',
      intentionality: 'c',
      implementability: 'd',
      regulatoryText: 'e',
      regulatoryTextRef: 'f',
      notesText: 'g',
      regulatoryTextXpos: 'h',
      regulatoryTextYpos: 'i'
    }

    adamsPerspective = {
      ambitype: 1,
      severity: 2,
      intentionality: 3,
      implementability: 4,
      regulatoryText: 5,
      regulatoryTextRef: 6,
      notesText: 7,
      regulatoryTextXpos: 8,
      regulatoryTextYpos: 9
    }

    //The perspectives array contains objects with attributes (perspective, ambitype, severity, intentionality, implementability, regulatoryText, regulatoryTextRef, etc.)
    perspectives = [johnsPerspective, adamsPerspective];

    paper = {
      //the findViewByModel() function returns an object with the data property, a sub-object named model, and position() function
      findViewByModel(element){
        return {
          data: element,

          model: {
            //when "type" is passed in as an argument into the get() function, "ambiguity.Element" is returned in order to access the outer if-statement in the function we are testing
            get(property) {
              if (property === "type"){
                return "ambiguity.Element";
              }
              return property;
            },

            //the position() function returns an object with x & y properties
            position() {
              return {
                x: 50,
                y: 75
              }
            }
          }
        };
      }
    },

    graph = {
      getCell(element){
        return element;
      }
    }
  });

  it("populate cloneTable with attributes (ambiguity type, severity, intentionality, implementability, regulatory text, notes)", function () {
    features.populateTables(cloneTable, xPositionTable, yPositionTable, paper, graph);

    //expectedJohnAttrbs is an array that contains our expected John attribute values for perspective, ambitype, severity, intentionality, implementability, regulatoryText, regulatoryTextRef, etc.
    expectedJohnAttrbs = [
      johnsPerspective,
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      "regulatoryID",
      "linkedArtifactID",
      'g',
      "ambiguity.Element",
      'h',
      'i',
    ];

    //expectedAdamAttrbs is an array that contains our expected Adam attribute values for perspective, ambitype, severity, intentionality, implementability, regulatoryText, regulatoryTextRef, etc.
    expectedAdamAttrbs = [
      adamsPerspective,
      1,
      2,
      3,
      4,
      5,
      6,
      "regulatoryID",
      "linkedArtifactID",
      7,
      "ambiguity.Element",
      8,
      9,
    ];

    //If the test is successful, cloneTable's 0th index should contain a subarray that has our expected John attribute values
    //We use '.to.deep.equal()' to check the equality between two arrays, to check if the values at each index are the same
    var johnsAttrbs = cloneTable[0];
    expect(johnsAttrbs).to.deep.equal(expectedJohnAttrbs);

    //If the test is successful, cloneTable's 1st index should contain a subarray that has our expected Adam attrbute values
    var adamsAttrbs = cloneTable[1];
    expect(adamsAttrbs).to.deep.equal(expectedAdamAttrbs);
  });

  it("populate xPositionTable with x-axis coordinates of all the components/shapes that are going to be merged together", function () {
    features.populateTables(cloneTable, xPositionTable, yPositionTable, paper, graph);

    var xPosition1 = xPositionTable[0];
    var xPosition2 = xPositionTable[1];

    //If the test is successful, the values at the 0th and 1st index in xPositionTable should be set with our x-position value in our beforeEach() function, which is 50
    //We should expect 2 indexes to be populated (0th and 1st index) since we push the x-position value into the xPositionTable array for each persepctive and we have two perspectives (John & Adam)
    var expectedXPosition1 = 50;
    var expectedXPosition2 = 50;
    expect(xPosition1).to.equal(expectedXPosition1);
    expect(xPosition2).to.equal(expectedXPosition2);

  });

  it("populate yPositionTable with y-axis coordinates of all the components that are going to be merged together", function () {
    features.populateTables(cloneTable, xPositionTable, yPositionTable, paper, graph);

    var yPosition1 = yPositionTable[0];
    var yPosition2 = yPositionTable[1];

    //If the test is successful, the values at the 0th and 1st index in yPositionTable should be set with our y-position value in our beforeEach() function, which is 75
    //We should expect 2 indexes to be populated (0th and 1st index) since we push the y-position value into the yPositionTable array for each persepctive and we have two perspectives (John & Adam)
    var expectedYPosition1 = 75;
    var expectedYPosition2 = 75;
    expect(yPosition1).to.equal(expectedYPosition1);
    expect(yPosition2).to.equal(expectedYPosition2);

  });

  after(function() {

    //we set our global variables to undefined after the unit test is finished
    selectArray = undefined;
    perspectives = undefined;

  });
});

//the populateTables() function contains an outer if-else statement
//we are testing the else-statement in this unit test to ensure the action performed in the else-statement works as expected
//the only action performed in the else-statement is logging an error message in the console
describe("# populateTables error checking", function () {
  var cloneTable, xPositionTable, yPositionTable, paper, graph, errorMessage;
  before(function () {

    //we will not be using these variables
    //we only needed to create these variables in order to pass them into the function we are testing
    cloneTable = [];
    xPositionTable = [];
    yPositionTable = [];
    selectArray = [1];

    //we will store our console.log() error message in this string variable
    errorMessage = "";

    paper = {
      //the findViewByModel() function returns an object with the data property and a sub-object named model
      findViewByModel(element){
        return {
          data: element,

          model: {
            id: "modelXYZ",

            //when "type" is passed in as an argument into the get() function, "non-ambiguity.Element" is returned in order to access the else-statement in the function we are testing
            get(property) {
              if (property === "type"){
                return "non-ambiguity.Element";
              }
            }
          }
        };
      }
    }

    graph = {
      getCell(element){
        return element;
      }
    }
  });

  it ("catches and logs when trying to read a non-ambiguity.Element", function () {
    //we mock the logItem() function in order to store the console.log() message into a local variable named 'errorMessage'
    features.logItem = function(logMessage) {
      errorMessage = logMessage;
    }

    features.populateTables(cloneTable, xPositionTable, yPositionTable, paper, graph);

    //If the test is successful, the local string variable 'errorMessage' should contain the expected error message
    expectedErrorMessage = "Model id: modelXYZ\n\t Element Type: non-ambiguity.Element";
    expect(errorMessage).to.equal(expectedErrorMessage);
  });

  after(function() {
    //we set the global variable to undefined after the unit test is finished
    selectArray = undefined;
  });
});

describe("# deleteOldComponentsAndLinks", function () {
  var paper, graph, disconnectLinksArray, removeCellsArray;
  beforeEach(function (){
    paper = {};
    graph = {};
    disconnectLinksArray = [];
    removeCellsArray = [];
    selectArray = [1];

    paper = {
      //the findViewByModel() function will return an object with the data property and remove() function
      findViewByModel(element){
        return {
          data: element,

          //the remove() function will add a 'SUCCESS' message to the 0th index of the removeCellsArray
          remove(){
            removeCellsArray[0] = "SUCCESSFULLY removed old components";
          }
        };
      }
    },

    graph = {
      getCell(element){
        return element;
      },
      
      //the disconnectLinks() function will add a 'SUCCESS' message to the 0th index of disconnectLinksArray
      disconnectLinks(cellView){
        disconnectLinksArray[0] = "SUCCESSFULLY disconnected old links";
      }
    }
  });


  it("Delete the old components/shapes, leaving behind only the newly created merged component.", function () {
    features.deleteOldComponentsAndLinks(paper, graph);

    //We use '.to.deep.equal()' to check the equality between two arrays, to check if the values at each index are the same
    //If the test is successful, the removeCellsArray should have a 'SUCCESS' message at the 0th index
    expectedRemoveCellsArray = ["SUCCESSFULLY removed old components"];
    expect(removeCellsArray).to.deep.equal(expectedRemoveCellsArray);

  });

  it("Delete the old links, leaving behind only the newly created link(s).", function () {
    features.deleteOldComponentsAndLinks(paper, graph);

    //If the test is successful, the disconnectLinksArraay should have a 'SUCCESS' message at the 0th index
    expectedDisconnectLinksArray = ["SUCCESSFULLY disconnected old links"];
    expect(disconnectLinksArray).to.deep.equal(expectedDisconnectLinksArray);

  });

  //We will set our global variable, 'selectArray', to undefined after the unit test is finished 
  after(function() {
    selectArray = undefined;

  });
});

//the cloneLinks() function contains an if-else statement
//we are testing the if-statement in this unit test to ensure every action performed in the if-statement works as expected
//if (link.get("source").id === originalCell.id)
describe("# cloneLinks, if-statement", function () {
  var clonedCells, clonedLinkSourceArray, clonedLinkTargetArray, addClonedLinksToGraph, removeOldLinks, connectedLinksArrayObject, connectedLinksArray, originalCell, graph;
  beforeEach(function () {

    //splitClone1 and splitClone2 represent the two split components resulting from using the split feature
    clonedCells = ["splitClone1", "splitClone2"];

    //cloneLinksSourceArray will contain a success message if we successfully set the source of the new cloned links
    clonedLinkSourceArray = [];

    //clonedLinkTargetArray will contain a success message if we successfully set the target of the new cloned links
    clonedLinkTargetArray = [];

    //addClonedLinksToGraph will contain a success message if we successfully added the new cloned links to the graph
    addClonedLinksToGraph = [];

    //removeOldLinks will contain a success message if we successfully remove the old links from the graph
    removeOldLinks = [];
  
    joint = {
      dia: {
        Link: function(attrbs){          
          this.source = function(clone){
            //to indicate that we set the source of the new cloned links, we will push a success message into this array
            clonedLinkSourceArray.push("SUCCESSFULLY set source of new link");
          },

          this.target = function(getTargetOrSource){
            //to indicate that we set the target of the new cloned links, we will push a success message into this array
            if (getTargetOrSource === "target"){
              clonedLinkTargetArray.push("SUCCESSFULLY set target of new link");
            }
          },

          this.addTo = function(graph){
            //to indicate that we added the new cloned links to the graph, we will push a success message into this array
            addClonedLinksToGraph.push("SUCCESSFULLY added cloned links to graph");
          }
        }
      }
    },

    connectedLinksArrayObject = {

      //get("source").id value ("outgoing link") needs to match 'originalCellView.model.id' value
      //in order to enter the if-statement of the function we are testing
      get(sourceOrTarget){
        if (sourceOrTarget === "source"){
          return {
          //"outgoing link" means that the source of the link is the component we are splitting and the target is the component we are not splitting
          id: "outgoing link"
          }
        }
        else if (sourceOrTarget === "target"){
          return "target";
        }
      },

      remove(){
        //if we successfully remove the old links, we will push a success message into the 0th index
        removeOldLinks[0] = "SUCCESSFULLY removed old links";
      }
    },

    //connectedLinksArray contains an object at each index and each object represents an old link on the graph
    connectedLinksArray = [connectedLinksArrayObject];

    //'originalCell.id' value ("outgoing link") needs to match 'connectedLinksArrayObject.get("source").id' value
    //in order to enter the if-statement of the function we are testing
    originalCell = {
      //"outgoing link" means that the source of the link is the component we are splitting and the target is the component we are not splitting
      id: "outgoing link"
    },

    graph = {
      //getConnectedLinks() will return an array that contains an object at each index and each object represents an old link on the graph
      getConnectedLinks(originalCell){
        return connectedLinksArray;
      }
    }
  });

  it("sets the source of each new cloned link to the component we are splitting", function() {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th and 1st index of the clonedLinkSourceArray array will contain a success message
    //there will be 2 success messages because we will create two new cloned links and
    //we need to set the source property for both of those new links
    var addSplitClone1LinkSource = clonedLinkSourceArray[0];
    var addSplitClone2LinkSource = clonedLinkSourceArray[1];
    expect(addSplitClone1LinkSource).to.equal("SUCCESSFULLY set source of new link");
    expect(addSplitClone2LinkSource).to.equal("SUCCESSFULLY set source of new link");

  });

  it("sets the target of each new cloned link to the component we are not splitting", function() {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th and 1st index of the clonedLinkTargetArray array will contain a success message
    //there will be 2 success messages because we will create two new cloned links and
    //we need to set the target property for both of those new links
    var addSplitClone1LinkTarget = clonedLinkTargetArray[0];
    var addSplitClone2LinkTarget = clonedLinkTargetArray[1];
    expect(addSplitClone1LinkTarget).to.equal("SUCCESSFULLY set target of new link");
    expect(addSplitClone2LinkTarget).to.equal("SUCCESSFULLY set target of new link");

  });

  it("adds the new cloned links to the graph", function () {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th and 1st index of the addClonedLinksToGraph array will contain a success message
    //there will be 2 success messages because we will create two new cloned links and
    //we need to add both of the new links to the graph
    var splitClone1Link = addClonedLinksToGraph[0];
    var splitClone2Link = addClonedLinksToGraph[1];
    expect(splitClone1Link).to.equal("SUCCESSFULLY added cloned links to graph");
    expect(splitClone2Link).to.equal("SUCCESSFULLY added cloned links to graph");
    
  });

  it("removes the old link(s) from the graph", function() {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th index of the removeOldLink array will contain a success message
    //there will only be 1 success message because we only had one old link on the graph to remove
    //which was represented by the connectedLinksArray being populated with only one object and that object represented an old link on the graph
    var removeOldLink = removeOldLinks[0];
    expect(removeOldLink).to.equal("SUCCESSFULLY removed old links");

  });

  after(function() {
    //we set the global variable to undefined after the unit test is finished
    joint = undefined;

  });
});

//the cloneLinks() function contains an if-else statement
//we are testing the else-statement in this unit test to ensure every action performed in the else-statement works as expected
describe("# cloneLinks, else-statement", function () {
  var clonedCells, clonedLinkSourceArray, clonedLinkTargetArray, addClonedLinksToGraph, removeOldLinks, connectedLinksArrayObject, connectedLinksArray, originalCell, graph;
  beforeEach(function () {

    //splitClone1 and splitClone2 represent the two split components resulting from using the split feature
    clonedCells = ["splitClone1", "splitClone2"];

    //cloneLinksSourceArray will contain a success message if we successfully set the source of the new cloned links
    clonedLinkSourceArray = [];

    //clonedLinkTargetArray will contain a success message if we successfully set the target of the new cloned links
    clonedLinkTargetArray = [];

    //addClonedLinksToGraph will contain a success message if we successfully added the new cloned links to the graph
    addClonedLinksToGraph = [];

    //removeOldLinks will contain a success message if we successfully remove the old links from the graph
    removeOldLinks = [];

    joint = {
      dia: {
        Link: function(attrbs){          
          this.source = function(getSourceOrTarget){
            //to indicate that we set the source of the new cloned links, we will push a success message into this array
            if (getSourceOrTarget.id === "incoming link1"){
              clonedLinkSourceArray.push("SUCCESSFULLY set source of new link");
            }
          },

          this.target = function(clone){
            //to indicate that we set the target of the new cloned links, we will push a success message into this array
            if (clone === "splitClone1" || clone === "splitClone2"){
              clonedLinkTargetArray.push("SUCCESSFULLY set target of new link");
            }
          },

          this.addTo = function(graph){
            //to indicate that we added the new cloned links to the graph, we will push a success message into this array
            addClonedLinksToGraph.push("SUCCESSFULLY added cloned links to graph");
          }
        }
      }
    },

    connectedLinksArrayObject = {

      //get("source").id value ("incoming link1") should not match 'originalCell.id' value (incoming link2)
      //in order to enter the else-statement of the function we are testing
      get(sourceOrTarget){
        if (sourceOrTarget === "source"){
          return {
          //"incoming link" means that the target of the link is the component we are splitting
          id: "incoming link1"
          }
        }
      },

      remove(){
        //if we successfully remove the old links, we will push a success message into the 0th index
        removeOldLinks[0] = "SUCCESSFULLY removed old links";
      }
    }

    //connectedLinksArray contains an object at each index and each object represents an old link on the graph
    connectedLinksArray = [connectedLinksArrayObject];

    //'originalCell.id' value (incoming link2) should not match get("source").id value ("incoming link1")
    //in order to enter the else-statement of the function we are testing
    originalCell = {
        //"incoming link" means that the target of the link is the component we are splitting
        id: "incoming link2"
    },

    graph = {
      //getConnectedLinks() will return an array that contains an object at each index and each object represents an old link on the graph
      getConnectedLinks(originalCell){
        return connectedLinksArray;
      }
    }
  });

  it("sets the source of each new cloned link to the component we are not splitting", function () {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th and 1st index of the clonedLinkSourceArray array will contain a success message
    //there will be 2 success messages because we will create two new cloned links and
    //we need to set the source property for both of those new links
    var addSplitClone1LinkSource = clonedLinkSourceArray[0];
    var addSplitClone2LinkSource = clonedLinkSourceArray[1];
    expect(addSplitClone1LinkSource).to.equal("SUCCESSFULLY set source of new link");
    expect(addSplitClone2LinkSource).to.equal("SUCCESSFULLY set source of new link");

  });

  it("sets the target of each new cloned link to the component we are splitting", function() {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th and 1st index of the clonedLinkTargetArray array will contain a success message
    //there will be 2 success messages because we will create two new cloned links and
    //we need to set the target property for both of those new links
    var addSplitClone1LinkTarget = clonedLinkTargetArray[0];
    var addSplitClone2LinkTarget = clonedLinkTargetArray[1];
    expect(addSplitClone1LinkTarget).to.equal("SUCCESSFULLY set target of new link");
    expect(addSplitClone2LinkTarget).to.equal("SUCCESSFULLY set target of new link");

  });

  it("adds the new cloned links to the graph", function() {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th and 1st index of the addClonedLinksToGraph array will contain a success message
    //there will be 2 success messages because we will create two new cloned links and
    //we need to add both of the new links to the graph
    var splitClone1Link = addClonedLinksToGraph[0];
    var splitClone2Link = addClonedLinksToGraph[1];
    expect(splitClone1Link).to.equal("SUCCESSFULLY added cloned links to graph");
    expect(splitClone2Link).to.equal("SUCCESSFULLY added cloned links to graph");

  });

  it("removes the old link(s) from the graph", function() {
    features.cloneLinks(clonedCells, originalCell, graph);

    //if the test is successful, the 0th index of the removeOldLink array will contain a success message
    //there will only be 1 success message because we only had one old link on the graph to remove
    //which was represented by the connectedLinksArray being populated with only one object and that object represented an old link on the graph
    var removeOldLink = removeOldLinks[0];
    expect(removeOldLink).to.equal("SUCCESSFULLY removed old links");

  });

  after(function () {
    //we set the global variable to undefined after the unit test is finished
    joint = undefined;

  });
});

describe("# cloneLinksAndAttach", function () {
  var addToGraphArray, removeOldLinks, sourceArray, targetArray, merged, paper, linkElement, linksArray, graph
  beforeEach(function () {

    selectArray = [1];

    //addToGraphArray will contain a success message if we successfully added the new cloned links to the graph
    addToGraphArray = [];

    //removeOldLinks will contain a success message if we successfully remove the old links from the graph
    removeOldLinks = [];

    //sourceArray will contain a success message if we successfully set the source of the new cloned links
    sourceArray = [];

    //targetArray will contain a success message if we successfully set the target of the new cloned links
    targetArray = [];

    merged = {
      id: "mergedID"
    }

    joint = {
      dia: {
        Link: function(attrbs){
          //to indicate that we successfully set the source of the link, we will push the passed in source value into the sourceArray
          sourceArray.push(attrbs.source.id),

          //to indicate that we successfully set the target of the link, we will push the passed in target value into the targetArray
          targetArray.push(attrbs.target.id),

          this.addTo = function(graph){
            //to indicate that we added the new cloned links to the graph, we will push a success message into this array
            addToGraphArray.push("SUCCESSFULLY added cloned links to graph");
          }

        }
      }
    }

    paper = {
      findViewByModel(element){
        return {
          model: {
            //paper.findViewByModel().model.id value needs to match linkElement.get("source") and linkElement.get("target")
            //in order to enter the first and second if-statements in the function we are testing
            id: "matching ID"
          }
        }
      }
    }

    //linkElement is an object that represents an old link on the graph
    linkElement = {

      get(sourceOrTarget){
        if (sourceOrTarget === "source"){
          return {
          //get("source").id value needs to match paper.findViewByModel().model.id value
          //in order to enter the first if-statement in the function we are testing
          id: "matching ID"
          }
        }
        else if (sourceOrTarget === "target"){
          return {
            //get("target").id value needs to match paper.findViewByModel().model.id value
            //in order to enter the second if-statement in the function we are testing
            id: "matching ID"
          }
        }
      },

      remove(){
        //if we successfully remove the old links, we will push a success message into the 0th index
        removeOldLinks[0] = "SUCCESSFULLY removed old links";
      }
    },

    //linksArray contains an object at each index and each object represents an old link on the graph
    linksArray = [linkElement];

    graph = {
      getCell(element){
        return element;
      },

      //getLinks() will return an array that contains an object at each index and each object represents an old link on the graph
      getLinks(){
        return linksArray;
      }
    }

  });

  it("sets the source of the new cloned links", function() {
    features.cloneLinksAndAttach(linksArray, merged, paper, graph);

    //if the test is successful, the 0th index of sourceArray will contain the merged component's ID and
    //the 1st index of sourceArray will contain linkElement.get("target").id (matching ID)
    var sourceLink1 = sourceArray[0];
    var sourceLink2 = sourceArray[1];
    expect(sourceLink1).to.equal("mergedID");
    expect(sourceLink2).to.equal("matching ID");
  
  });

  it("sets the target of the new cloned links", function() {
    features.cloneLinksAndAttach(linksArray, merged, paper, graph);

    //if the test is successful, the 0th index of targetArray will contain linkElement.get("source").id (matching ID) and
    //the 1st index of targetArray will contain the merged component's ID
    var targetLink1 = targetArray[0];
    var targetLink2 = targetArray[1];
    expect(targetLink1).to.equal("matching ID");
    expect(targetLink2).to.equal("mergedID");
    
  });

  it("adds the new cloned links to the graph", function() {
    features.cloneLinksAndAttach(linksArray, merged, paper, graph);

    //if the test is successful, the 0th index of the addToGraphArray array will contain a success message
    //there is only one success message because we only need to clone one link
    var addCloneLinkToGraph = addToGraphArray[0];
    expect(addCloneLinkToGraph).to.equal("SUCCESSFULLY added cloned links to graph");

  });

  it("removes the old links from the graph", function () {
    features.cloneLinksAndAttach(linksArray, merged, paper, graph);

    //if the test is successful, the 0th index of removeOldLinks array will contain a success message
    //there will only be one success message because there is only one old link needed to be removed from the graph
    var removeOldLink = removeOldLinks[0];
    expect(removeOldLink).to.equal("SUCCESSFULLY removed old links");

  });

  after(function (){
    //we set the global variable to undefined after the unit test is finished
    selectArray = undefined;
    joint = undefined;
  });
});
