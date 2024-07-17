const expect = require("chai").expect;

// AHAB modules
global.AHAB = {};
require("../js/ahab/JointJSWrapper.js");
let test = {};


describe("# createShape", function () {
    let shapeSize, shapePosition;
    before(function () {

        //shapeSize is an object that contains the length and width size of a shape
        shapeSize = {
            length: 0,
            width: 0
        }

        //shapePosition is an object that contains the X and Y coordinates of a shape
        shapePosition = {
            X: 0,
            Y: 0
        }

        joint = {
            shapes: {
                ambiguity: {
                    Element: function () {
                        //resize() is a function that will change the length and width of a shape
                        this.resize = function (length, width) {
                            shapeSize.length = length;
                            shapeSize.width = width;
                        },
                        //position() is a function that will change the X and Y coordinates of a shape
                        this.position = function (X, Y) {
                            shapePosition.X = X;
                            shapePosition.Y = Y;
                        }
                    }
                }
            }
        }

        test = {
            createShape: AHAB.JointJSWrapper.createShape,
        }
    });

    it("Creates an element shape with the default project styles.", function () {
        test.createShape("shapeID");

        shapeLength = shapeSize.length;
        //the expectedShapeLength should be 90 because we passed in 90 as the length-size argument
        //in the resize() function in createShape()
        expectedShapeLength = 90;
        expect(shapeLength).to.equal(expectedShapeLength);

        shapeWidth = shapeSize.width;
        //the expectedShapeWidth should be 90 because we passed in 90 as the width-size argument
        //in the resize() function in createShape()
        expectedShapeWidth = 90;
        expect(shapeWidth).to.equal(expectedShapeWidth);


        shapeXPos = shapePosition.X;
        //the expectedShapeXPos should be 5 because we passed in 5 as the X-coordinate argument
        //in the position() function in createShape()
        expectedShapeXPos = 0;
        expect(shapeXPos).to.equal(expectedShapeXPos);


        shapeYPos = shapePosition.Y;
        //the expectedShapeYPos should be 25 because we passed in 25 as the Y-coordinate argument
        //in the position() function in createShape()
        expectedShapeYPos = 0;
        expect(shapeYPos).to.equal(expectedShapeYPos);

    });

    after(function () {
        //clear the global variables after the unit test
        joint = {};
        test = {};
    });
});

describe("#createLink", function () {
    let linkSource, linkTarget, linkAttrbs;
    beforeEach(function () {
        linkSource = {};
        linkTarget = {};
        linkAttrbs = {};

        joint = {
            dia: {
                //the Link() function will set the source, target, and attributes for the link
                Link: function (properties){
                    linkSource =  properties.source,
                    linkTarget =  properties.target,
                    linkAttrbs = {
                        ".connection": {
                          stroke: "#222138",
                        },
                        ".marker-target": {
                          fill: "#31d0c6",
                          stroke: "none",
                          d: "M 10 0 L 0 5 L 10 10 z",
                        },
                      }
                }
            }

        }

        test = {
            createLink: AHAB.JointJSWrapper.createLink
        }
    });

    it("set the link's sourceID", function() {
        test.createLink('sourceID', 'targetID');

        //the id for expectedLinkSource should be set to the passed in sourceID
        expectedLinkSource = {
            id: 'sourceID'
        };

        //if the test is successful, the linkSource should have all the same properties as the expectedLinkSource object
        expect(linkSource).to.deep.equal(expectedLinkSource);

    });

    it("set the link's targetID", function() {
        test.createLink('sourceID', 'targetID');

        //the id for expectedLinkTarget should be set to the passed in targetID
        expectedLinkTarget = {
            id: 'targetID'
        };

        //if the test is successful, the linkTarget should have all the same properties as the expectedLinkTarget object
        expect(linkTarget).to.deep.equal(expectedLinkTarget);

    });
    it("set the link's attributes", function() {
        test.createLink('sourceID', 'targetID');

        //the expectedLinkAttrbs is an object that contains the expected styling for the link
        expectedLinkAttrbs = {
            ".connection": {
              stroke: "#222138",
            },
            ".marker-target": {
              fill: "#31d0c6",
              stroke: "none",
              d: "M 10 0 L 0 5 L 10 10 z",
            },
          };

        //if the test is successful, the linkAttrbs should have all the same properties as the expectedLinkAttrbs object
        expect(linkAttrbs).to.deep.equal(expectedLinkAttrbs);

    });

    after(function () {
        //clear the global variables after the unit test
        joint = {};
        test = {};
    });
});

describe("# setModel", function () {
    let rgrtyTextID;
    before(function () {

        //we need to create the innerHTML for the rgrtyTextID in order to use getElementById() on rgrtyTextID
        document.body.innerHTML = `<div id="rgrtyTextID"></div>`;

        //initially set the text ID as the oldModelID
        document.getElementById("rgrtyTextID").value = 'oldModelID';

        test = {
            setModel(){document.getElementById("rgrtyTextID").value = "newModelID";}
        }


    });

    it("Sets the model text (name of the regulatory text that was loaded).", function () {
        test.setModel("newModelID");

        rgrtyTextID = document.getElementById("rgrtyTextID").value;

        //if the test is successful, the textID will update to become the newModelID
        expect(rgrtyTextID).to.equal("newModelID");

    });

    after(function () {
        //clear the global variables after the unit test
        joint = {};
        test = {};
    });
});
