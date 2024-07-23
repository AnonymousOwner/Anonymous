const Sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
const { fileHandler } = require("../js/ahab/FileHandler");
require("../js/ahab/ModelController");
chai.use(sinonChai);

//Is this a synchronous or asynchronous testing? (Google Answer:)
/*Synchronous events will immediately execute an associated callback like it would a direct function call
 so the end result is the same. In general, Asynchronous Code is executed separately and concurrently from the calling code.*/
/*In synchronous operations tasks are performed one at a time and only when one is completed, the following is unblocked.
 In other words, you need to wait for a task to finish to move to the next one.
 In asynchronous operations, on the other hand, you can move to another task before the previous one finishes.*/

//what are promises in JS? (geeks for geeks answer: https://www.geeksforgeeks.org/javascript-promises/)
/*Promises are used to handle asynchronous operations in JavaScript.
They are easy to manage when dealing with multiple asynchronous operations
where callbacks can create callback hell leading to unmanageable code. */
/*A Promise has four states:
fulfilled: Action related to the promise succeeded
rejected: Action related to the promise failed
pending: Promise is still pending i.e. not fulfilled or rejected yet
settled: Promise has fulfilled or rejected*/
/*var promise = new Promise(function(resolve, reject) {
const x = "geeksforgeeks";
const y = "geeksforgeeks"
if(x === y) {
	resolve();
} else {
	reject();
}
});

promise.
	then(function () {
		console.log('Success, You are a GEEK');
	}).
	catch(function () {
		console.log('Some error has occurred');
	});
*/
/*Promise Consumers
Promises can be consumed by registering functions using .then and .catch methods.

1. then()
then() is invoked when a promise is either resolved or rejected.
It may also be defined as a career which takes data from promise and further executes it successfully.
.then(function(result){
        //handle success
    }, function(error){
        //handle error
    })

2. catch()
catch() is invoked when a promise is either rejected or some error has occurred in execution.
It is used as an Error Handler whenever at any step there is a chance of getting an error.
 .catch() is just a shorthand for .then(null, errorHandler) )
 .catch(function(error){
        //handle error
    })

var promise = new Promise(function(resolve, reject) {
    reject('Promise Rejected')
})

promise
    .then(function(successMessage) {
        console.log(successMessage);
    })
    .catch(function(errorMessage) {
       //error handler function is invoked
        console.log(errorMessage);
    });
*/
//tools to use for promise: (https://www.codingame.com/playgrounds/11107/tools-for-promises-unittesting/what-are-those-tools)
/* what is mocha?
Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser,
making asynchronous testing simple and fun.*/
/*what is chai?
Chai is a BDD/TDD assertion library for node and the browser that can be paired with any javascript testing framework.*/
/*what is sinon?
SinonJs is a standalone library for test spies, stubs and mocks for JavaScript. Works with any unit testing framework.*/
/* JS syntax (https://www.w3schools.com/js/js_arrow_function.asp):
Arrow functions allow us to write shorter function syntax:

let myFunction = (a, b) => a * b;
Arrow Function With Parameters:
hello = (val) => "Hello " + val;
if you have only one parameter, you can skip the parentheses as well:
hello = val => "Hello " + val;
The handling of this is also different in arrow functions compared to regular functions.
In short, with arrow functions there are no binding of this.
In regular functions the this keyword represented the object that called the function,
which could be the window, the document, a button or whatever.
With arrow functions the this keyword always represents the object that defined the arrow function.

*/

describe("fileHandler", () => {
  describe("# loadFile", () => {
    before(() => {});
    describe("if the extension is not json or txt", () => {
      let file = { name: "" };
      it("should alert", () => {
        file.name = "p.j";
        window.alert = Sinon.spy();
        fileHandler.loadFile(file);
        expect(window.alert.calledOnce).to.be.true;
        //expect(window.alert).to.have.been.called;
      });
    });
   /* describe("if the extension is json", () => {
      before(() => {
        const dom = new JSDOM(
          `<html>
                       <body>
                        <div class="form-check" >
                            <input type="checkbox" class="form-check-input " value="" id="destructiveImport">
                            <label class="form-check-label" for="destructiveImport" style="color: white;"> Import/Clear Current Model </label>
                        </div>
                       </body>
                     </html>`
          //{ url: 'http://localhost' },
        );

        global.window = dom.window;
        global.document = dom.window.document;
        FileReader = window.FileReader;
      });
      it("should first load the file and parse the json", () => {
      });
    });*/
  });
  describe("# takeJsonOutOfLog", () => {
    describe("given a log file, containing several json file, ", () => {
      let logFile= `20220528-15h25m10s: -----------OPENING LOGFILE FOR LOGGING!---------------
      20220529-13h32m40s: Legal text loaded: VLIS_Ch52_Art59.1-574
      20220529-14h31m39s: User unselected all the selected nodes.
      20220529-14h31m39s: User Selected blank area on paper
      20220529-14h32m09s: User unselected all the selected nodes.
      20220529-14h32m09s: User Selected blank area on paper
      20220529-14h32m10s: User unselected all the selected nodes.
      20220529-14h32m10s: User Selected blank area on paper
      20220529-14h52m53s: User unselected all the selected nodes.
      20220529-14h52m53s: User Selected blank area on paper
      20220529-15h08m16s: Heatmap reset
      20220529-15h08m24s: Heatmap reset
      20220529-15h09m20s: User perspective created: Samin
      20220529-15h09m23s: Entity Created for id: Samin_0
      20220529-15h10m16s: Heatmap reset
      20220529-15h13m10s: Heatmap reset
      20220529-15h13m15s: Heatmap reset
      20220529-15h14m38s: Entity Created for id: Samin_1
      20220529-15h14m53s: Heatmap reset
      20220529-15h16m21s: Heatmap reset
      20220529-15h16m26s: Entity Created for id: Samin_2
      20220529-15h16m27s: Selected Entity: Samin_2
      20220529-15h16m28s: Added Link between Samin_2 and Samin_0
      20220529-15h16m46s: Selected Entity: Samin_2
      20220529-15h16m47s: Added Link between Samin_2 and Samin_1
      20220529-15h16m49s: Heatmap reset
      20220529-15h16m49s: User unselected all the selected nodes.
      20220529-15h16m49s: User Selected blank area on paper
      20220529-15h24m03s: Heatmap reset
      20220529-15h28m50s: Heatmap reset
      20220529-15h28m54s: Heatmap reset
      20220529-15h29m04s: Heatmap reset
      20220529-15h29m14s: Entity Created for id: Samin_3
      20220529-15h32m23s: File Exported: VLIS_Ch52_Art59.1-574_1653852743288_ahab-1.2.json
      20220529-15h32m23s: JSON File: {"model":"VLIS_Ch52_Art59.1-574","perspectives":["Samin"],"cells":{"Samin_0":{"ambitype":"Vagueness","severity":"2","intentionality":"y","implementability":"y","textPosition":[726,737],"regulatoryText":" reasonable","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"What are exactly reasonable data security practices? what is meant by reasonable?","outgoingLinks":[],"incomingLinks":["Samin_2"],"perspectives":["Samin"]},"Samin_1":{"ambitype":"Vagueness","severity":"4","intentionality":"y","implementability":"n","textPosition":[919,976],"regulatoryText":"appropriate to the volume and nature of the personal data","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"I need a table explaining what appropriate data security policy is, based on different volume and nature of the data.","outgoingLinks":[],"incomingLinks":["Samin_2"],"perspectives":["Samin"]},"Samin_2":{"ambitype":"Vagueness","severity":"1","intentionality":"y","implementability":"n","textPosition":[692,986],"regulatoryText":"Establish, implement, and maintain reasonable administrative, technical, and physical data security practices to protect the confidentiality, integrity, and accessibility of personal data. Such data security practices shall be appropriate to the volume and nature of the personal data at issue;","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"a vague paragraph, because of vague parts within.","outgoingLinks":["Samin_0","Samin_1"],"incomingLinks":[],"perspectives":["Samin"],"id":"Samin_3","ambiguityType":"Vagueness"},"Samin_3":{"ambitype":"Referential","severity":"3","intentionality":"y","implementability":"y","textPosition":[1041,1119],"regulatoryText":"state and federal laws that prohibit unlawful discrimination against consumers","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"I need to read all those laws. They might have defined unlawful discrimination differently or have different aspects of it in mind.","outgoingLinks":[],"incomingLinks":[],"perspectives":["Samin"]}},"exportTime":1653852743288}
      20220529-15h32m27s: Logfile is being exported by clicking the export button."`;
      let expectedJson=`{"model":"VLIS_Ch52_Art59.1-574","perspectives":["Samin"],"cells":{"Samin_0":{"ambitype":"Vagueness","severity":"2","intentionality":"y","implementability":"y","textPosition":[726,737],"regulatoryText":" reasonable","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"What are exactly reasonable data security practices? what is meant by reasonable?","outgoingLinks":[],"incomingLinks":["Samin_2"],"perspectives":["Samin"]},"Samin_1":{"ambitype":"Vagueness","severity":"4","intentionality":"y","implementability":"n","textPosition":[919,976],"regulatoryText":"appropriate to the volume and nature of the personal data","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"I need a table explaining what appropriate data security policy is, based on different volume and nature of the data.","outgoingLinks":[],"incomingLinks":["Samin_2"],"perspectives":["Samin"]},"Samin_2":{"ambitype":"Vagueness","severity":"1","intentionality":"y","implementability":"n","textPosition":[692,986],"regulatoryText":"Establish, implement, and maintain reasonable administrative, technical, and physical data security practices to protect the confidentiality, integrity, and accessibility of personal data. Such data security practices shall be appropriate to the volume and nature of the personal data at issue;","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"a vague paragraph, because of vague parts within.","outgoingLinks":["Samin_0","Samin_1"],"incomingLinks":[],"perspectives":["Samin"],"id":"Samin_3","ambiguityType":"Vagueness"},"Samin_3":{"ambitype":"Referential","severity":"3","intentionality":"y","implementability":"y","textPosition":[1041,1119],"regulatoryText":"state and federal laws that prohibit unlawful discrimination against consumers","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"I need to read all those laws. They might have defined unlawful discrimination differently or have different aspects of it in mind.","outgoingLinks":[],"incomingLinks":[],"perspectives":["Samin"]}},"exportTime":1653852743288}`;
      before(() => {
        });
      it("should be able to extract the last saved json correctly.", ()=>{
        let res=fileHandler.takeJsonOutOfLog(logFile);
        expect(res).to.be.eq(expectedJson);});
    });
  });
  describe("# processUploadedJSON", ()=>{
    describe("given a json data in a string format",()=>{
      let jsonData=`{"model":"US_CCPA_SEC1and2","perspectives":["mhv",",jb"],"cells":{"mhv_0":{"ambitype":"Lexical","severity":"1","intentionality":"y","implementability":"y","textPosition":[195,299],"regulatoryText":" collection of personal data to what is adequate, relevant, and reasonably necessary in relation to the ","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"Please add any notes here...","outgoingLinks":[],"incomingLinks":["mhv_Start","mhv_1"],"perspectives":["mhv"]},"mhv_Start":{"terminal":"Start","outgoingLinks":["mhv_0","mhv_1"],"incomingLinks":[],"perspectives":["mhv"]},"mhv_1":{"ambitype":"Lexical","severity":"1","intentionality":"y","implementability":"y","textPosition":[454,507],"regulatoryText":"a for purposes that are neither reasonably necessary ","regulatoryTextID":"VLIS_Ch52_Art59.1-574","notesText":"Please add any notes here...","outgoingLinks":["mhv_0",",jb_0"],"incomingLinks":["mhv_Start"],"perspectives":["mhv"]},",jb_0":{"ambitype":"Lexical","severity":"1","intentionality":"y","implementability":"y","textPosition":[72,105],"regulatoryText":"personal data are collected from ","regulatoryTextID":"EU_GDPR_Ch3_Art13","notesText":"Please add any notes here...","outgoingLinks":[],"incomingLinks":["mhv_1"],"perspectives":[",jb"],"id":",jb_1","ambiguityType":"Lexical"},"mhv_2":{"ambitype":"Lexical","severity":"1","intentionality":"y","implementability":"y","textPosition":[24,238],"regulatoryText":" Consumer Privacy Act of 2018SECTION 1. This measure shall be known and may be cited as “The California Consumer Privacy Act of 2018.”SEC. 2. The Legislature finds and declares that:(a) In 1972, California v","regulatoryTextID":"US_CCPA_SEC1and2","notesText":"Please add any notes here...","outgoingLinks":[],"incomingLinks":[],"perspectives":["mhv"]}},"exportTime":1654038520770}`;
      let res=fileHandler.processUploadedJSON(jsonData);
      it("should be able to create an Object",()=>{
        expect(typeof(res)).to.be.eq('object');
      });
      it("the result's keys should be an ahab model's valid keys.", () => {
        let a= Object.keys({'model':"", 'perspectives':"", 'cells':"", 'exportTime':""});
        expect(Object.keys(res)).deep.to.eq(a);
      });
    })
  })
});
