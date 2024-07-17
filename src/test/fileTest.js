const expect = require("chai").expect;

// AHAB modules
const features = require("../js/ahab/Features.js");

// Tests

describe("File functions", function () {

  let passedFile = "";
  let destructiveImport = false;
  let error = "";

  // Set up mock HTML and functions
  before(function() {
    document.body.innerHTML = `
      <input type="checkbox" id="destructiveImport" checked>
    `;

    window.alert = function(message) {
      error = message;
    }
    features.readFile = function(file, clearGraph) {
      passedFile = file;
      destructiveImport = clearGraph;
    }
  });

  describe("# loadFile", function() {
    // Pass an event with an empty file array, see if readFile runs
    it("does nothing if there is no file passed", function() {
      let event = {
        target: {
          files: []
        }
      }
      features.loadFile(event);
      expect(passedFile).to.equal("");
      expect(error).to.be.empty;
    })

    // Pass an event with a file with .txt extension instead of .json, see if readFile runs
    it("alerts if a file does not have the JSON extension", function() {
      let event = {
        target: {
          files: [{ name:"file.txt" }]
        }
      }
      features.loadFile(event);
      // expect readFile to have not been called and there is an error string
      expect(passedFile).to.equal("");
      expect(error).to.not.be.empty;
    });

    // Pass a .json file with the destructiveImport flag checked
    it("passes a JSON extension file to readFile with destructiveImport flag", function() {
      let event = {
        target: {
          files: [{ name:"file.json" }]
        }
      }
      features.loadFile(event);
      expect(passedFile.name).to.equal("file.json");
      expect(destructiveImport).to.be.true;
    });
  });

});
