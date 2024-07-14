const expect = require("chai").expect;
const Sinon = require("sinon");

// AHAB modules
global.AHAB = {};
require("../js/ahab/ModelController.js");
let test = {};

// Object holding the loaded functions since we'll want to overwrite "AHAB" to mock functions.
loadedFunctions = global.AHAB.ModelController;
global.AHAB = {};

// Tests
describe("AHAB.ModelController",function(){
  describe("# saveToJSON", function () {
    var hasBeenExported, test;
    before(function () {
      //this variable will indicate if the file has been successfully saved/exported
      hasBeenExported = false;

      fileHandler = {
        downloadFile(filename, data) {
          //we will set 'hasBeenExported' to true if we successfully export the file
          hasBeenExported = true;
        }
      },

      test = {
        save: loadedFunctions.saveToJSON,
        //transitionCopyJointData() is an empty function to avoid an error message of 'undefined function'
        transitionCopyJointData() {
        },

        data: {
          exportTime: 0
        }
      }
    });

    it("Ensures that the file gets saved/exported to JSON format", function () {
      test.save("modelXYZ");

      //if the file has been successfully saved/exported then the 'hasBeenExported' variable should be set to true
      expect(hasBeenExported).to.equal(true);
    });

    after(function () {
      //after the unit test, set the test variable back to an empty object
      test = {};
      fileHandler = {};
    });
  });
  describe("# updateCellData", function(){
    let test,attributes;/*, componentName, perspective, ambiguityType, severity, intentionality, implementability, textPosition, notesText, currentPerspectives, currentCells;*/
    beforeEach(function () {
      test = {
        updateCellData: loadedFunctions.updateCellData,
        getCellData: loadedFunctions.getCellData,
        data: {
          cells: {"Samin_0":{"ambitype": "Incompleteness",
          "severity": 1,
          "intentionality": "y",
          "implementability": "y",
          "textPosition": [12,12],
          "regulatoryText": "something",
          "regulatoryTextID": "something else",
          "notesText": "...",
          "outgoingLinks": ["Samin_1","Samin_2"],
          "incomingLinks": ["Samin_3"],
          "perspectives":"Samin"}
          }
        }
      };

      AHAB = {
        JointJSWrapper: {
          addElementToGraph(id){return true;}
        }
      }
      attributes={
      "severity": 2,
      "intentionality": "n",
      "implementability": "n",
      "textPosition": [0,0],
      "regulatoryText": "s",
      "regulatoryTextID": "else",
      "notesText": "new",
      "outgoingLinks": ["Samin_4"],
      "incomingLinks": ["Samin_5","Azin_6"],
      "perspectives":"Samin"
      };
    });
    it("should update the cell with the same attributes, if the keys are valid for an AHAB.cell",function(){
      attributes["ambitype"]= "Semantic";
      expect(test.updateCellData("Samin_0",attributes)).to.deep.eq(attributes);
    });
    console.log = Sinon.spy();
    it("should send error , if there's a new key that wasn't defined before for a cell", function(){
      attributes["ambiguityType"]= "Semantic";
      let expectedCell=test.data.cells["Samin_0"];
      expect(test.updateCellData("Samin_0",attributes)).to.deep.eq(expectedCell);
      expect(console.log).to.have.been.called;
      //expect(console.log).to.have.been.calledOnce;
    })
  });
  describe("# loadFromJSON if-statement", function () {
    var isModelSet, isPerspectivesUpdated, isGraphGenerated, passInData, test;
    beforeEach(function () {

      //isModelSet checks if the model was successfully set
      isModelSet = false;

      //isPerspectivesUpdated checks if the perspectives were successfully updated
      isPerspectivesUpdated = false;

      //isGraphGenerated checks if the graph was successfully created
      isGraphGenerated = false;

      //passInData is an object containing all the data we want to pass in to our loadFromJSON() function
      passInData = {
        model: "ModelXYZ",
        perspectives: ["Harvey"],
        cells: ["Harvey_0", "Harvey_1"]
      },

        //test is an object that will contain the function 'load()' which will be equivalent to the 'loadFromJSON()' function
        test = {
          data: {
            model: "",
            perspectives: ["Suzanne"],
            cells: []
          },
          load: loadedFunctions.loadFromJSON
        }

      AHAB = {
        JointJSWrapper: {
          generateGraph(data) {
            isGraphGenerated = true;
          }
        },
        Heatmap:{
          colorGraph(){}
        },
        Helpers: {
          updatePerspectiveButtons(perspectivesData) {
            isPerspectivesUpdated = true;
          },
          setModel(){isModelSet = true;}
        }
      }
    });


    it("Completely replaces the data on the graph with new data", function () {

      //clearGraph is set to true, meaning we want to completely replace the current data on the graph with new data
      clearGraph = true;
      test.load(passInData, clearGraph);

      //newData is the new data on the graph that replaced the old data
      newData = test.data;

      //if the current data was successfully replaced with new data, the data on our graph should equal the data we passed in
      expect(newData).to.equal(passInData);

      //if the model was successfully replaced, isModelSet should be set to true
      expect(isModelSet).to.equal(true);

      //if the perspectives were successfully replaced, isPerspectivesUpdated should be set to true
      expect(isPerspectivesUpdated).to.equal(true);

      //if the graph was successfully replaced, isGraphGenerated should be set to true
      expect(isGraphGenerated).to.equal(true);
    });

    it("Keep the current data on the graph, add new perspectives and new cells", function () {

      //clearGraph is set to false, meaning we want to keep the current data on the graph and add new perspectives and new cells
      clearGraph = false;
      test.load(passInData, clearGraph);

      //isModelSet should be false because we are not replacing the current model
      expect(isModelSet).to.equal(false);

      //if the perspectives were successfully replaced, isPerspectivesUpdated should be set to true
      expect(isPerspectivesUpdated).to.equal(true);

      //if the graph was successfully replaced, isGraphGenerated should be set to true
      expect(isGraphGenerated).to.equal(true);

      //we will keep the current perspective 'suzanne' and add the new perspective 'harvey'
      const expectedPerspectives = ["Suzanne", "Harvey"];
      const graphPerspectives = test.data.perspectives;
      expect(graphPerspectives).to.deep.equal(expectedPerspectives);


      //we will add the new cells to our current cells
      const expectedCells = { 0: "Harvey_0", 1: "Harvey_1" };
      const graphCells = test.data.cells;
      expect(graphCells).to.deep.equal(expectedCells);
    });

    after(function () {
      //after the unit test, set our global variables to empty objects
      test = {};
      AHAB = {};
    });
  });

  describe("# addCell", function () {
    let test, componentName, perspective, ambiguityType, severity, intentionality, implementability, textPosition, notesText, currentPerspectives, currentCells;
    beforeEach(function () {

      //we will pass these variables as arguments into the function we are testing
      componentName = 'Jason_0';
      perspective = 'Jason';
      ambitype = 'Lexical';
      severity = 2;
      intentionality = 'Y';
      implementability = 'Y';
      textPosition = 0;
      notesText = 'text';
      regulatoryText = "hello this is jason";
      regulatoryTextID=undefined;

      test = {
        addCell: loadedFunctions.addCell,
        data: {

          //the cells object will start off empty and we will push new key value pairs into the object
          cells: {
          }
        }
      };

      AHAB = {
        JointJSWrapper: {
          addElementToGraph(id){return true;}
        }
      }
    });

    it("add new perspectives for the new data model", function () {
      test.addCell({id:componentName, perspective, ambitype, severity, intentionality, implementability, textPosition, regulatoryText, regulatoryTextID, notesText});
                 /*{id:componentName, perspective, ambiguityType, severity, intentionality, implementability, textPosition, notesText}*/

      expectedPerspectives = ['Jason'];
      currentPerspectives = test.data.cells['Jason_0'].perspectives;

      //if the test is successful, the 'Jason' perspective should be added to the perspectives array
      expect(currentPerspectives).to.deep.equal(expectedPerspectives);
    });

    it("add new components for the new data model", function () {
      test.addCell({id:componentName, perspective, ambitype, severity, intentionality, implementability, textPosition, notesText, regulatoryText});


      expectedCells = {
        "Jason_0": {
          "ambitype": ambitype,
          "severity": severity,
          "intentionality": intentionality,
          "implementability": implementability,
          "textPosition": textPosition,
          "notesText": notesText,
          "outgoingLinks": [],
          "incomingLinks": [],
          "perspectives": [perspective],
          "regulatoryText": "hello this is jason",
          "regulatoryTextID": undefined
        }
      };

      currentCells = test.data.cells;

      //if the test is successful, the 'Jason_0' key and its corresponding object should be added to the cells object
      expect(currentCells).to.deep.equal(expectedCells);
    });

    after(function () {
      //set global variables to undefined after the unit test
      test = {};
      AHAB = {};
    });
  });

  describe("#dataAndGraphAgree", function () {
    let testController;
    beforeEach(function() {

      // The object to mimic the modelController
      testController = {
        data: {
          cells: {
            cell1: {outgoingLinks: [],
                    incomingLinks: []
                    },
            cell2: {outgoingLinks: [],
                    incomingLinks: []
                    }
          }
        },
        dataAndGraphAgree: loadedFunctions.dataAndGraphAgree
      }
      // Mock JointJSWrapper graph where there are cells that can be fetched by id
      AHAB = {
        JointJSWrapper: {
          graph: {
            cells: {
              cell1: { id: "cell1"},
              cell2: { id: "cell2"}
            },
            getCell(id) {
              return this.cells[id];
            },
            getElements() {
              return Object.values(this.cells);
            },
            getConnectedLinks(){return []},
            getLinks(){return []}
          }
        },
        Helpers: {
          logItem() {}
        }
      }
      logTypes = {}
    });
    it("returns false if the graph does not contain all the data", function() {
      // if the graph is missing cell(s) it returns false
      AHAB.JointJSWrapper.graph.cells = {
        cell1: { id: "cell1" }
      }
      expect(testController.dataAndGraphAgree()).to.be.false;
    });
    it("returns false if the data does not contain everything on the graph", function() {
      // if the data is missing cell(s) it returns false
      testController.data.cells = {}
      expect(testController.dataAndGraphAgree()).to.be.false;
    });
    it("returns true if the graph and data match", function() {
      expect(testController.dataAndGraphAgree()).to.be.true;
    });
    after(function() {
      // clean up anything global
      AHAB = {};
    })
  });

  describe("# isValidToMerge", function () {
    let test, returnedValue;
    beforeEach(function () {

      test = {
        isValidToMerge: loadedFunctions.isValidToMerge,

        data: {
          cells: {
            "Harvey_0": {
              "ambitype": "Incompleteness",
              "severity": "1",
              "intentionality": "y",
              "implementability": "y",
              "textPosition": [0, 10],
              "notesText": "Harvey sample notes text",
              "incominglLinks": [],
              "outgoingLinks": ["Suzanne_0"],
              "perspectives": ["Harvey"],
            },

            "Harvey_1": {
              "ambitype": "Incompleteness",
              "severity": "1",
              "intentionality": "y",
              "implementability": "y",
              "textPosition": [0, 10],
              "notesText": "Harvey sample notes text",
              "incominglLinks": [],
              "outgoingLinks": ["Suzanne_0"],
              "perspectives": ["Harvey"],

            },

            "Suzanne_0": {
              "ambitype": "Lexical",
              "severity": "2",
              "intentionality": "n",
              "implementability": "n",
              "textPosition": [50, 50],
              "notesText": "Susanne sample notes text",
              "incominglLinks": [],
              "outgoingLinks": [],
              "perspectives": ["Susanne"],

            }
          }
        }
      };



    });

    it("Compared two similar components that we want to merge", function () {

      //this array contains the components that we want to merge
      selectArray = ["Harvey_0", "Harvey_1"];

      //call the function we are testing and store the returned value
      returnedValue = test.isValidToMerge();

      //we should expect a value of true because we are comparing two objects that are similar in properties
      //which means we should be able to merge them together
      expect(returnedValue).to.equal(true);

    });

    after(function () {

      //set the global variables to undefined after the unit test
      test = {};
      currentComponent = undefined;
      selectArray = undefined;
    });
  });

  describe("# splitCell", function () {
  let test, returnedMessage1, returnedMessage2;
  beforeEach(function () {


    test = {
      splitCell: loadedFunctions.splitCell,
      data: {
        cells: {
          "Jason_0": {
            "ambitype": "Lexical",
            "severity": 2,
            "intentionality": "Y",
            "implementability": "Y",
            "textPosition": "X,Y pos",
            "notesText": "notes here",
            "outgoingLinks": [],
            "incomingLinks": [],
            "perspectives": ["Jason"],
            "regulatoryText": "hello this is jason"
          }
        }
      },
      getCellData(splitComponentId) {
        return this.data.cells[splitComponentId];
      }
    };

    AHAB = {
      JointJSWrapper: {
        addSplitCellsToGraph(splitComponentId,clone1,clone2) {
          returnedMessage1 = `SUCCESSFULLY added ${clone1} & ${clone2} components to graph`;
        },
        addLinkToGraph(source,target) {
          returnedMessage2 = "SUCCESSFULLY added new links to graph";
        },
      }
    }


    selectArray = ["Jason_0"];

  });

  it("tests the existence of the split cells in the new data model", function () {
    test.splitCell();
    let splitComponent1 = test.data.cells["Jason_0.1"];
    let splitComponent2 = test.data.cells["Jason_0.2"];
    expect(splitComponent1).to.exist;
    expect(splitComponent2).to.exist;
  });

  it ("tests the equality between the split component's data and the original component's data", function () {
    test.splitCell();
    let splitComponent1 = test.data.cells["Jason_0.1"];
    let splitComponent2 = test.data.cells["Jason_0.2"];
    let originalComponent = test.data.cells["Jason_0"]
    expect(splitComponent1).to.deep.equal(originalComponent);
    expect(splitComponent2).to.deep.equal(originalComponent);

  });

  it("checks if the new split components were successfully added to the graph UI", function () {
    test.splitCell();
    expectedReturnMessage = "SUCCESSFULLY added Jason_0.1 & Jason_0.2 components to graph";
    expect(returnedMessage1).to.equal(expectedReturnMessage);

  });

  after(function () {
    test = {};

  });
  });
});
