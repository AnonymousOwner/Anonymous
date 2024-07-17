const { describe } = require("mocha");

const expect = require("chai").expect;

// AHAB modules
require("../js/ahab/Helpers.js");

describe("Helpers", ()=>{
  describe("# Node_RangeAndTextNodeNumber", () => {
    describe("Given an html element and a start and an end position (each html node has length one. if a node is a text that will be visible to user its length will be equal to the length of the text)", ()=>{
      let htmlElement =`<!DOCTYPE html>
      <html lang="en-US" class="js">
        <head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head>
        <body class="page-template-default page page-id-151 wp-embed-responsive gdpr">
          <header class="entry-header">
            <h3 class="entry-title">Art. 13 GDPR Information to be provided where personal data are collected from the data subject</span></h3>
          </header>
        </body>
      </html>`
      let start = 26;
      let end = 38;
      document.createRange = () => ({
        setStart: () => {},
        setEnd: () => {},
        commonAncestorContainer: {
          nodeName: 'BODY',
          ownerDocument: document,
          startOffset: 0,
          endOffset: 0
        },
      });
      let expectedRange = document.createRange();
      //expectedRange.selectNodeContents(htmlElement);
      expectedRange.startOffset = 9;
      expectedRange.endOffset = 12;
      expectedTextNodeNumber = 3
      let expectedRes=(expectedRange, expectedTextNodeNumber);
      it("should return the right range and the textNode-number", ()=> {
        let res= AHAB.Helpers.Node_RangeAndTextNodeNumber(htmlElement, start,end);
        expect(res['range'].startOffset).to.deep.eq(expectedRange.startOffset);
        expect(res['range'].endOffset).to.deep.eq(expectedRange.endOffset);
        expect(res['textNodeNumber']).to.be.eq(expectedTextNodeNumber);
      })
    })
  })
})