const expect = require("chai").expect;

// AHAB modules
const features = require("../js/ahab/Features.js");

// Tests

describe("Color functions", function () {
  // mock highlite function to set color variable
  let highlightColor;
  before(function () {
    features.highlite = function (color) {
      highlightColor = color;
    };
  });

  // Check that the new log has been added to the old log
  describe("# colorChange", function () {
    it("passes the corresponding color to the highlite function", function () {
      const pairs = {
        Lexical: "green",
        Syntactic: "yellow",
        Semantic: "red",
        Vagueness: "violet",
        Incompleteness: "blue",
        Referential: "teal",
        Other: "gray"
      };
      for (pair of Object.keys(pairs)) {
        features.colorChange(pair);
        expect(highlightColor).to.equal(pairs[pair]);
      }
    });
  });
});
