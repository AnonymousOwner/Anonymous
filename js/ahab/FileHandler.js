//const { indexOf } = require("lodash");

// Functions that deal with files
const fileHandler = {
  /**
   * Prompts the user to donwload a file without first clicking a button.
   * @param {string} filename - name that the file will be called in the download
   * @param {object} data - the data that will be in the file
   */
  downloadFile(filename, data) {
    let digest = JSON.stringify(data);
    let anchor = document.createElement("a");
    anchor.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(digest)
    );
    anchor.setAttribute("download", filename);
    AHAB.Helpers.logItem(`File Exported: ${filename}`, logTypes.FILE);

    AHAB.Helpers.logItem(`JSON File: ${digest}`);

    // Check what the browser supports
    if (document.createEvent) {
      let event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      anchor.dispatchEvent(event);
    } else {
      anchor.click();
    }
  },

  /**
   * Loads a .json file and passes the data to graphController.
   * @param {file} file - file object to read data from
   */
  loadFile(file) {
    let fType = fileHandler.fileType(file);

    // Step 1: validate the file
    if (fType=="invalid") {
      // Error condition of some sort
      window.alert("Wrong file-type. It should either be 'json' or 'txt'!");
      console.error("Unable to load file.");
      return;
    }

    // Step 1b: create jsonData from uploaded file.
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      let jsonData = reader.result;
      if (fType == "txt") {
        jsonData = fileHandler.takeJsonOutOfLog(jsonData);
        if (jsonData == "Wrong Log Content") {
          alert(
            "It is either not an AHAB generated file or it doesn't contain a model!"
          );
          return;
        }
      }
      //console.log(jsonData);
      //check content of jsonData:
      if (
        jsonData.indexOf("model") == -1 ||
        jsonData.indexOf("perspectives") == -1 ||
        jsonData.indexOf("cells") == -1
      ) {
        alert("It doesn't contain a valid ambiguity model!");
        return;
      }
      // Step 2: strip out the JSON data
      let jsonParsed = fileHandler.processUploadedJSON(jsonData);

      // Step 3: pass this along to the model controller
      // clear and replace graph if "destructive" is checked
      let clearGraph = document.getElementById("destructiveImport").checked;
      AHAB.ModelController.loadFromJSON(jsonParsed, clearGraph);
      AHAB.Helpers.logItem(`Loaded file ${file.name}`, logTypes.FILE);
    };
  },
  takeJsonOutOfLog(jsonData) {
    let i = jsonData.lastIndexOf("JSON File: ");
    if (i == -1) {
      msg = "Wrong Log Content";
      console.log(msg);
      return msg;
    }
    let startIndexOfJson = i + "JSON File: ".length;
    let lengthOfJson = jsonData.lastIndexOf("}") - startIndexOfJson + 1;
    jsonData = jsonData.substr(startIndexOfJson, lengthOfJson);
    return jsonData;
  },
  /**
   * checks the type of file
   * @param {file} file
   * @returns 'json' | 'txt' | 'invalid'
   */
  fileType(file) {
    console.log(file);
    if (file["type"] == "application/json") {
      console.log("A json file is uploaded.");
      return "json";
      //return true;
    } else if (file["type"] == "text/plain") {
      console.log("A txt file is uploaded.");
      return "txt";
      //return true;
    } else {
      return "invalid";
    }
  },

  /**
   * Creates a parsed JSON object that can be passed to the ModelController
   * from the raw JSON data extracted from the uploaded file.
   *
   * @param {jsonData} json - the raw JSON data extracted from the uploaded
   * file.
   */
  processUploadedJSON(jsonData) {
    console.log("The json-data that is going to be parsed now: ",jsonData);
    let jsonParsed = JSON.parse(jsonData);
    return jsonParsed;
  },
};
module.exports = {
  fileHandler,
};
