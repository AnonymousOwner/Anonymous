// START JAVASCRIPT

var selectArray = [];

// Creating the UCM terminals (start/stop) bar {This is a black bar with the word "Start" or "Stop" in white lettering in 100 x 20 size}.
// Inputs: X and Y coordinates
// Output: rectangle object.
function terminal(nameIt, xpos, ypos, graph, textColor, fillColor) {
   // This creates the new Joint.js rectangle for the paper.
   var term = new joint.shapes.standard.Circle();
   term.resize(100, 50);
   term.position(xpos, ypos);
   term.attr('root/title', 'URN Terminal');
   term.attr('label/text', nameIt);
   term.attr('label/fill', textColor);
   term.attr('body/fill', fillColor);
   term.addTo(graph);

   // This line adds the graph object to the paper.
   //graph.addCells(term);
   // We now create a return function called shape to return the id for linking.
   // We could just return 'term', but this is done for consistency in the shapes.
   return term;
}


// Ambiguity Function (Official Entity)
// Inputs: Type, Severity, Intentionality, Implementability, X position and Y position on paper.
// Outputs: Shape (octogon object), Type, Severity, Intentionality, and Implementability.
function ambiguity(type, severity, intent, implement, rgltyText, rgltyTextRef, rgltyID, linkedArti, xPos, yPos, graph) {
   var octagon = new joint.shapes.standard.Polygon();
   octagon.resize(90, 90);
   octagon.position(xPos, yPos);
   octagon.attr('root/title', rgltyID);
   octagon.attr('label/text', type);
   octagon.attr('body/refPoints', '0,5 0,10 7,15 13,15 20,10 20,5 13,0 7,0');
   octagon.attr('body/fill', 'lightgray');
   octagon.set('ambitype', type);
   octagon.set('severity', severity);
   octagon.set('intentionality', intent);
   octagon.set('implementability', implement);
   octagon.set('regulatoryText', rgltyText);
   octagon.set('regulatoryTextRef', rgltyTextRef);
   octagon.set('regulatoryID', rgltyID);
   octagon.set('linkedArtifactID', linkedArti);
   octagon.addTo(graph);
   return {
      shape: function () {
         return octagon;
      },
      attrs: function () {
         var attr = [octagon.get('ambitype'), octagon.get('severity'), octagon.get('intentionality'), octagon.get('implementability')];
         return attr;
      }
   };

}
// The main function
function main(Nwidth, Nheight) {
   // begin joint.js required code
   // creating the graph
   var graph = new joint.dia.Graph();

   // drawing the paper for the models
   var paper = new joint.dia.Paper({
      el: $('#canvasthinger'),
      width: Nwidth,
      height: Nheight,
      model: graph,
      gridSize: 10,
   });
   paper.drawGrid();
   paper.drawBackground({color: 'lightgray'});

   // end joint.js required code.

   // captures the UUID for the graph and paper.
   document.getElementById("graphthinger").value = graph;
   document.getElementById("canvasthinger").value = paper;

   // cursorReturn is used for highlighting and getting information from the objects
   cursorReturn();
   mouseOverTxt();
   dragRemoveAmbiguity();
}
// END OF JAVASCRIPT.
