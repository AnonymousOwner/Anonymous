AHAB.Highlight={
  highlightOneNode(/*textHtml, cell_id,AddColor, start, end,*/ el){
    console.log("I'm called");
    //var range = document.createRange();
    //range.selectNodeContents(el);// gives the Range, the element, which in our case is CapDisplay (the legal text content)
    //var textNodes = AHAB.Helpers.getTextNodesIn(el);// textNodes contain all the nodes in our text; for example it has node "h1" which has a child, and in it is our header.
    var textContents = el.textContents;
    console.log(textContents);
    /*var foundStart = false;
    var charCount = 0,// stores the index of the start of the textNode that it is looking at, at each time
      endCharCount;   // stores the index of the end of the textNode that it is looking at, at each time
    //to set start and end of a range, it should be given the text nodes where the start-position and end-position are in and the index of start and end in their nodes. 
    for (var i = 0, textNode; (textNode = textNodes[i++]); ) {
      console.log(textNode.length, " , " , textNode);
      endCharCount = charCount + textNode.length;
      if (
        !foundStart &&
        start >= charCount &&
        (start < endCharCount ||
          (start == endCharCount && i <= textNodes.length))
      ) {
        
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break;
      }
      charCount = endCharCount;
    }
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);*/
  },
  highlightAll(){

  },
  // Highlight the text based on color.
  makeEditableAndHighlight(color) {
    sel = window.getSelection();
    if (sel.rangeCount && sel.getRangeAt) {
      range = sel.getRangeAt(0);
    }
    document.designMode = "on";
    if (range > 0) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (!document.execCommand("HiliteColor", false, color)) {
      document.execCommand("BackColor", true, color);
    }
    document.designMode = "off";
    window.getSelection().empty();
  },
  // remove the highlight.
  //unhilite() is called in AHAB.Tool.CursorReturn and here in displayText()
  unhilite(node, color) {
    if (node.nodeType == 1) {
      var bg = node.style.backgroundColor;
      if (bg) {
        node.style.backgroundColor = "";
      }
    }
    var child = node.firstChild;
    while (child) {
      AHAB.Highlight.unhilite(child, color);
      child = child.nextSibling;
    }
  },
  // Highlight based on color.
  // highlite() is called here in colorChange()
  highlite(color) {
    var range;
    if (window.getSelection) {
      // IE9 and non-IE
      try {
        if (!document.execCommand("BackColor", false, color)) {
          AHAB.Highlight.makeEditableAndHighlight(color);
        }
      } catch (ex) {
        AHAB.Highlight.makeEditableAndHighlight(color);
      }
    } else if (document.selection && document.selection.createRange) {
      // IE <= 8 case
      range = document.selection.createRange();
      range.execCommand("BackColor", false, color);
    }
  },
  /**
   * Calls the highlite function with a color based on ambiguity type.
   * @param {string} ambiguityType - the type (Lexical, Syntactic, etc.) to choose the color from.
   */
  //colorChange() is called in Tools.s/cursorReturn() and here in displayText()
  colorChange(ambiguityType) {
    let colors = {
      Lexical: "green",
      Syntactic: "yellow",
      Semantic: "red",
      Vagueness: "violet",
      Incompleteness: "blue",
      Referential: "teal",
      Other: "gray"
    }
    AHAB.Highlight.highlite(colors[ambiguityType]);
  },
  //This function is incompelete and hasn't been called anywhere:
  textHighlightOptionAdaption(){//right now most of the highlighting is being done by Helpers.setSelectionRange
    var highValue = $("#highlight").val();
      switch (highValue) {
        case "0":
          AHAB.Highlight.unhilite(document.getElementById("CapDisplay"), "white");
          break;
        case "1":
          AHAB.Highlight.highlightAll();
          break;
        case "2":
          break;
      }
  }
}