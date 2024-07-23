/*main function in this object is colorGraph() that is only called once in Tools.js. 
the rest of the functions here are called only by colorGraph()*/ 
AHAB.Heatmap={
  // Changes all ambiguities to default gray.
  resetHeatmap() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();

    cellArray.forEach(function (cellArray) {
      var cellView = paper.findViewByModel(cellArray.id);
      if (cellView.model.get("type") === "ambiguity.Element") {
        cellView.model.attr("body/fill", "lightgray");
      }
    });

    var legend = document.getElementById("heatmap_legend");
    var floatingLegend = document.getElementById("floatingLegend");
    legend.style = "border:0px solid #d3d3d3;";
    legend.style.display = "none";
    floatingLegend.style.display = "none";
    AHAB.Helpers.logItem("Heatmap reset", logTypes.INTERFACE);
  },
  /**
   * 
   * @param {Int} totalNumberOfTextNodes 
   */
  textPosColorProduce(totalNumberOfTextNodes){
    function ColorToHex(color) {
      var hexadecimal = color.toString(16);
      return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    }
    function RGBtoHex(red, green, blue) {
      return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
    }
    textpositionColors=[];
    if(totalNumberOfTextNodes>600){
      console.log("this legal texthas too many text nodes for me to color code"); 
      return;
    }
    let step=Math.floor(180/(Math.floor(totalNumberOfTextNodes/3)+1))
    console.log("totalNumberOfTextNodes: ",totalNumberOfTextNodes,", step: ", step);
    for( i=0; i<= 180 ; i+= step){
      textpositionColors.push(RGBtoHex(200, i, i));
    }
    for( i=0; i<= 180 ; i+= step){
      textpositionColors.push(RGBtoHex(i, 200, i));
    }
    for( i=0; i<= 180 ; i+= step){
      textpositionColors.push(RGBtoHex(i, i, 200));
    }
    return textpositionColors;
  },
  // This function determines if elements are from the same part of the legal text.
  graphElementAgreement() {
    let totalNumberOfTextNodes= AHAB.Helpers.getTextNodesIn(document.getElementById("CapDisplay")).length;
    let textpositionColors= AHAB.Heatmap.textPosColorProduce(totalNumberOfTextNodes);
    console.log(textpositionColors);
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();
    /*var colorArray = [];
    var textArray = [];
    function truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) : str;
    }*/
    cellArray.forEach(function (cellArray) {
      let perspectives = AHAB.ModelController.data.perspectives;
      perspectives.forEach(function (perspectives) {
        var cellView = paper.findViewByModel(cellArray.id);

        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);
        if (
          //display === undefined &&
          cellView.model.get("type") === "terminal.Element"
        ) {
          //TERMINAL DO NOTHING TO CHANGE COLOR
        } else if (display === undefined) {
          // DO NOTHING
        } else {
          console.log(display.textPosition);
          if (display.textPosition[0] > 0 && display.textPosition[1] > 0) {

            /*var hexStringX = (Math.floor((display.textPosition[0])/2)).toString(16);
            //regulatoryTextXpos.toString(16);
           var hexStringY = display.textPosition[1].toString(16);
            //regulatoryTextYpos.toString(16);
            if (display.textPosition[1] > 255) {
              //regulatoryTextYpos > 255) {
              hexStringY =
                Math.floor((hexStringY / 10) % 10) * 10 +
                Math.floor(hexStringY % 10);
              if (isNaN(hexStringY)) {
                hexStringY = "00";
              }
            }
            if (display.textPosition[0] > 255) {
             //regulatoryTextXpos > 255) {
              hexStringX =
                Math.floor((hexStringX / 10) % 10) * 10 +
                Math.floor(hexStringX % 10);
              if (isNaN(hexStringX)) {
                hexStringX = "00";
              }
            }
            var colorString = "#f" + hexStringX + "f" + hexStringY;
            colorArray.push(colorString);
            var returnText = truncate(display.regulatoryText, 20);
            textArray.push(display.regulatoryText);
            console.log("Return Text: "+ returnText+ " ,String X: " +hexStringX+ " ,textPosition[0]: "+display.textPosition[0]+ ", textPosition[1]:"+display.textPosition[1]+",color:"+colorString);
            */
            
            let textPositionInfo = AHAB.Helpers.Node_RangeAndTextNodeNumber(document.getElementById("CapDisplay"), display.textPosition[0], display.textPosition[1]);
            console.log(textPositionInfo);
            var colorString = textpositionColors[textPositionInfo['textNodeNumber']];
            console.log(colorString);
            cellView.model.attr("body/fill", colorString); // color based on user/
          }
        }
      });
    });

   /* var indexOfMaxValue = colorArray.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0
    );
    //console.log(indexOfMaxValue);
    document.getElementById("floatingLegend").style.display = "block";
    document.getElementById("floatingLegendheader").style.display = "block";
    document.getElementById("floatingLegend").width = "100";
    document.getElementById("heatmap_legend").width = "100";
    document.getElementById("floatingLegend").height =
      100 * (indexOfMaxValue + 1);
    document.getElementById("heatmap_legend").height =
      100 * (indexOfMaxValue + 1);
    document.getElementById("heatmap_legend").style = "border:1px solid #d3d3d3;";
    document.getElementById("heatmap_legend").style.display = "block";

    var c = document.getElementById("heatmap_legend");
    var ctx = c.getContext("2d");
    //legend text
    ctx.strokeText("Legal Text Collision", 5, 10);
    var filteredColorArray = colorArray.filter((item, index) => {
      return colorArray.indexOf(item) >= index;
    });

    filteredColorArray.forEach((colorArray, index) => {
      var space = index * 70;
      ctx.beginPath();
      ctx.rect(10, space + 30, 50, 50);
      ctx.fillStyle = colorArray;
      ctx.strokeText(textArray[index], 10, space + 25);
      ctx.fill();
    });*/
  },
  // Graph the heatmap for various user perspectives.
  graphHeatmapPerspective() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();
    let colorsArr = [
      "#129c92",
      "#c0d602",
      "#0583b1",
      "#6ddeef",
      "#c261df",
      "#1e38e0",
      "#cc174d",
      "#fd94aa",
      "#4fb8bf",
      "#735e0f",
      "#2f5b26",
      "#61b425",
      "#6246df",
      "#faab14",
      "#faff9b",
      "#a5250c",
    ];

    cellArray.forEach(function (cellArray) {
      console.log(cellArray);
      let cellView = paper.findViewByModel(cellArray.id);
      let perspectives = AHAB.ModelController.data.perspectives;
      
      
      let celldata = AHAB.ModelController.getCellData(cellView.model.id);
       if (cellArray.attributes.type === "terminal.Element") {
        //TERMINAL DO NOTHING TO CHANGE COLOR
      } 
      else {
        cellView.model.attr("body/fill", colorsArr[perspectives.indexOf(celldata["perspectives"][0])]); // color based on user/
      } 

      /*perspectives.forEach((perspective, index) => {
        let display = AHAB.ModelController.getCellData(cellView.model.id);
        let changed = cellView.model.get("changed");
        if (
          //display === undefined &&
          cellView.model.get("type") === "terminal.Element"
        ) {
          //TERMINAL DO NOTHING TO CHANGE COLOR
        } else if (display === undefined) {
          // DO NOTHING
          //console.log("Error Check: " + display + " Perspective " + perspectives);
        } 
        else if (changed === "y") {
          cellView.model.attr("body/fill", colorsArr[perspective.length]); // multi-value color
        } 
        else {
          cellView.model.attr("body/fill", colorsArr[index]); // color based on user/
          cellView.model.set("changed", "y");
        }
      });*/
    });

    document.getElementById("floatingLegend").style.display = "block";
    document.getElementById("floatingLegendheader").style.display = "block";
    document.getElementById("floatingLegend").width = "100";
    document.getElementById("heatmap_legend").width = "100";
    document.getElementById("floatingLegend").height = "520";
    document.getElementById("heatmap_legend").height = "520";
    document.getElementById("heatmap_legend").style = "border:1px solid #d3d3d3;";
    document.getElementById("heatmap_legend").style.display = "block";

    var c = document.getElementById("heatmap_legend");
    var ctx = c.getContext("2d");
    //legend text
    ctx.strokeText("Perspective", 5, 10);
    // Variables for the legend
    let colorArray = [
      "#1bfc92",
      "#c0d602",
      "#0583b1",
      "#6ddeef",
      "#c261df",
      "#1e38e0",
      "#cc174d",
    ];

    let perspectives = AHAB.ModelController.data.perspectives;
    perspectives.forEach((perspectives, index) => {
      var space = index * 70;
      ctx.beginPath();
      ctx.rect(10, space + 30, 50, 50);
      ctx.fillStyle = colorArray[index];
      ctx.strokeText(perspectives, 10, space + 25);
      ctx.fill();
    });
    if (perspectives.length >= 2) {
      var finalSpace = perspectives.length * 70;
      ctx.beginPath();
      ctx.rect(10, finalSpace + 30, 50, 50);
      ctx.fillStyle = colorArray[perspectives.length];
      ctx.strokeText("Multi-User", 10, finalSpace + 25);
      ctx.fill();
    }
    heatmapCount = heatmapCount + 1;
    // Need this to remove the changed counting variables.
    cellArray.forEach(function (cellArray) {
      var cellView = paper.findViewByModel(cellArray.id);
      var display = AHAB.ModelController.getCellData(cellView.model.id);
      //cellView.model.get(perspectives);
      var changed = cellView.model.get("changed");

      if (
        //display === undefined &&
        cellView.model.get("type") === "terminal.Element"
      ) {
        //TERMINAL DO NOTHING TO CHANGE COLOR
      } else if (changed === undefined) {
        // DO NOTHING
      } else if (changed === "y") {
        cellView.model.set("changed");
      }
    });
  },
  // Change the color of graph of the ambiguities to match ambiguity color.
  graphAmbiguityType() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();

    cellArray.forEach(function (cellArray) {
      let perspectives = AHAB.ModelController.data.perspectives;
      console.log("graphAmbiguityTType()->perspectives:", perspectives);
      perspectives.forEach(function (perspectives) {
        
      console.log("graphAmbiguityTType()->perspectives.foreach(perspectives):", perspectives);
        var cellView = paper.findViewByModel(cellArray.id);
        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);
        console.log("graphAmbiguityType()->display:",display,"cellview.model:",cellView.model);
        if (
          //display === undefined &&
          cellView.model.get("type") === "terminal.Element"
        ) {
          //TERMINAL DO NOTHING TO CHANGE COLOR
        } else if (display === undefined) {
          // OTHER URN DO NOTHING TO CHANGE COLOR
          //console.log("Missing Element Error: " + cellView.model.attr("label/text"));
        } else if (display.ambitype === "Lexical") {
          cellView.model.attr("body/fill", "#00ff00"); // green color
        } else if (display.ambitype === "Syntactic") {
          cellView.model.attr("body/fill", "#ffff00"); // yellow color
        } else if (display.ambitype === "Semantic") {
          cellView.model.attr("body/fill", "#ff0000"); // red color
        } else if (display.ambitype === "Vagueness") {
          cellView.model.attr("body/fill", "#ff00ff"); // violet color
        } else if (display.ambitype === "Incompleteness") {
          cellView.model.attr("body/fill", "#0000ff"); // blue color
        } else if (display.ambitype === "Referential") {
          cellView.model.attr("body/fill", "#008b8b"); // teal color
        } else if (display.ambitype === "Other") {
          cellView.model.attr("body/fill", "#5e5e5e"); // grayish color
        } else {
          console.log("Error");
        }
      });
    });

    document.getElementById("floatingLegend").style.display = "block";
    document.getElementById("floatingLegendheader").style.display = "block";
    document.getElementById("floatingLegend").width = "100";
    document.getElementById("heatmap_legend").width = "100";
    document.getElementById("floatingLegend").height = "520";
    document.getElementById("heatmap_legend").height = "520";
    document.getElementById("heatmap_legend").style = "border:1px solid #d3d3d3;";
    document.getElementById("heatmap_legend").style.display = "block";

    // Heatmap legend.
    var c = document.getElementById("heatmap_legend");
    var ctx = c.getContext("2d");
    //legend text
    ctx.strokeText("Ambiguity Type", 5, 10);
    // Variables for the legend
    var ambiguityArray = [
      "Lexical",
      "Syntactic",
      "Semantic",
      "Vagueness",
      "Incompleteness",
      "Referential",
      "Other",
    ];
    var colorArray = [
      "#00ff00",
      "#ffff00",
      "#ff0000",
      "#ff00ff",
      "#0000ff",
      "#008b8b",
      "#5e5e5e",
    ];
    // loop for the legend.
    for (var i = 0; i < ambiguityArray.length; i++) {
      var space = i * 70;
      ctx.beginPath();
      ctx.rect(10, space + 30, 50, 50);
      ctx.fillStyle = colorArray[i];
      ctx.strokeText(ambiguityArray[i], 10, space + 25);
      ctx.fill();
    }
    heatmapCount = heatmapCount + 1;
  },
  // Change ambiguity color based on severity.
  graphSeverityType() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();

    cellArray.forEach(function (cellArray) {
      let perspectives = AHAB.ModelController.data.perspectives;
      perspectives.forEach(function (perspectives) {
        var cellView = paper.findViewByModel(cellArray.id);
        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);

        if (
          //display === undefined &&
          cellView.model.get("type") === "terminal.Element"
        ) {
          //TERMINAL DO NOTHING TO CHANGE COLOR
          //console.log("Terminal Error: "+cellView.model.attr("label/text"));
        } else if (display === undefined) {
          // OTHER URN DO NOTHING TO CHANGE COLOR
          //console.log("Missing Element Error: " + cellView.model.attr("label/text"));
        } else if (display.severity === "1") {
          cellView.model.attr("body/fill", "#fffb00"); // green color
        } else if (display.severity === "2") {
          cellView.model.attr("body/fill", "#ffd900"); // yellow color
        } else if (display.severity === "3") {
          cellView.model.attr("body/fill", "#ffaa00"); // red color
        } else if (display.severity === "4") {
          cellView.model.attr("body/fill", "#ff6f00"); // violet color
        } else if (display.severity === "5") {
          cellView.model.attr("body/fill", "#ff0000"); // blue color
        } else {
          console.log("Error");
        }
      });
    });

    document.getElementById("floatingLegend").style.display = "block";
    document.getElementById("floatingLegendheader").style.display = "block";
    document.getElementById("floatingLegend").width = "100";
    document.getElementById("heatmap_legend").width = "100";
    document.getElementById("floatingLegend").height = "400";
    document.getElementById("heatmap_legend").height = "400";
    document.getElementById("heatmap_legend").style = "border:1px solid #d3d3d3;";
    document.getElementById("heatmap_legend").style.display = "block";

    var c = document.getElementById("heatmap_legend");
    var ctx = c.getContext("2d");
    ctx.strokeText("Severity Level", 10, 10);
    var severityArray = ["Five", "Four", "Three", "Two", "One"];
    var colorArray = ["#ff0000", "#ff6f00", "#ffaa00", "#ffd900", "#fffb00"];
    // loop for the legend.
    for (var i = 0; i < severityArray.length; i++) {
      var space = i * 70;
      ctx.beginPath();
      ctx.rect(10, space + 40, 50, 50);
      ctx.fillStyle = colorArray[i];
      ctx.strokeText(severityArray[i], 10, space + 30);
      ctx.fill();
    }
    heatmapCount = heatmapCount + 1;
  },
  // Change ambiguity color based on Intentionality.
  graphIntentionality() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();
    var indexVal = cellArray.length;

    cellArray.forEach(function (cellArray) {
      let perspectives = AHAB.ModelController.data.perspectives;
      perspectives.forEach(function (perspectives) {
        var cellView = paper.findViewByModel(cellArray.id);
        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);

        if (
          //display === undefined &&
          cellView.model.get("type") === "terminal.Element"
        ) {
          //TERMINAL DO NOTHING TO CHANGE COLOR
        } else if (display === undefined) {
          // OTHER URN DO NOTHING TO CHANGE COLOR
          //console.log("Missing Element Error: " + cellView.model.attr("label/text"));
        } else if (display.intentionality === "y") {
          cellView.model.attr("body/fill", "#00fff2"); // teal color
        } else if (display.intentionality === "n") {
          cellView.model.attr("body/fill", "#ff00ee"); // violet color
        } else {
          console.log("Error: " + cellView.model.attr("label/text"));
        }
      });
    });

    document.getElementById("floatingLegend").style.display = "block";
    document.getElementById("floatingLegendheader").style.display = "block";
    document.getElementById("floatingLegend").width = "100";
    document.getElementById("heatmap_legend").width = "100";
    document.getElementById("floatingLegend").height = "175";
    document.getElementById("heatmap_legend").height = "175";
    document.getElementById("heatmap_legend").style = "border:1px solid #d3d3d3;";
    document.getElementById("heatmap_legend").style.display = "block";
    var c = document.getElementById("heatmap_legend");
    var ctx = c.getContext("2d");
    ctx.strokeText("Intentionality", 10, 10);
    // Variables for the legend
    var booleanArray = ["Yes", "No"];
    var colorArray = ["#00fff2", "#ff00ee"];
    // loop for the legend.
    for (var i = 0; i < booleanArray.length; i++) {
      var space = i * 70;
      ctx.beginPath();
      ctx.rect(10, space + 30, 50, 50);
      ctx.fillStyle = colorArray[i];
      ctx.strokeText(booleanArray[i], 10, space + 25);
      ctx.fill();
    }
    heatmapCount = heatmapCount + 1;
  },
  // Change ambiguity color based on Implementability.
  graphImplementability() {
    var graph = AHAB.JointJSWrapper.graph;
    var paper = AHAB.JointJSWrapper.paper;
    var cellArray = graph.getElements();
    var indexVal = cellArray.length;

    cellArray.forEach(function (cellArray) {
      let perspectives = AHAB.ModelController.data.perspectives;
      perspectives.forEach(function (perspectives) {
        var cellView = paper.findViewByModel(cellArray.id);
        
        //console.log("graphImplementability()->cellview:",cellView,"cellarray.id:",cellArray.id,"cellarray",cellArray);
        var display = AHAB.ModelController.getCellData(cellView.model.id);
        //cellView.model.get(perspectives);

        if (
          //display === undefined &&
          cellView.model.get("type") === "terminal.Element") 
          {
            console.log("graphImplementability()->terminal");
          //TERMINAL DO NOTHING TO CHANGE COLOR
        } else if (display === undefined) {
          
          console.log("graphImplementability()->undefined");
          // OTHER URN DO NOTHING TO CHANGE COLOR
        } else if (display.implementability === "y") {
          cellView.model.attr("body/fill", "#ccff00"); // green color
        } else if (display.implementability === "n") {
          cellView.model.attr("body/fill", "#aa00ff"); // yellow color
        } else {
          console.log("Error");
        }
      });
    });

    document.getElementById("floatingLegend").style.display = "block";
    document.getElementById("floatingLegendheader").style.display = "block";
    document.getElementById("floatingLegend").width = "100";
    document.getElementById("heatmap_legend").width = "100";
    document.getElementById("floatingLegend").height = "175";
    document.getElementById("heatmap_legend").height = "175";
    document.getElementById("heatmap_legend").style = "border:1px solid #d3d3d3;";
    document.getElementById("heatmap_legend").style.display = "block";
    var c = document.getElementById("heatmap_legend");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeText("Implementable", 10, 10);
    // Variables for the legend
    var booleanArray = ["Yes", "No"];
    var colorArray = ["#ccff00", "#aa00ff"];
    // loop for the legend.
    for (var i = 0; i < booleanArray.length; i++) {
      var space = i * 70;
      ctx.beginPath();
      ctx.rect(10, space + 30, 50, 50);
      ctx.fillStyle = colorArray[i];
      ctx.strokeText(booleanArray[i], 10, space + 25);
      ctx.fill();
    }
    heatmapCount = heatmapCount + 1;
  },
  // sets up the architecture for a heatmap representation of the graph.
  colorGraph() {
    var val = document.getElementById("heatmap").value;
    if (val === "off") {
      AHAB.Heatmap.resetHeatmap();
    } else if (val === "5") {
      AHAB.Heatmap.graphElementAgreement();
    } else if (val === "4") {
      AHAB.Heatmap.graphHeatmapPerspective();
    } else if (val === "3") {
      AHAB.Heatmap.graphAmbiguityType();
    } else if (val === "2") {
      AHAB.Heatmap.graphSeverityType();
    } else if (val === "1") {
      AHAB.Heatmap.graphIntentionality();
    } else if (val === "0") {
      AHAB.Heatmap.graphImplementability();
    } else {
      console.log("Index of heatmap out of bounds! " + val);
    }
  }
}