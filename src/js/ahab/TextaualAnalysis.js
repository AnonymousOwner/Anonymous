TextualAnalysis= {
  data : {},
  texts : {},
  getCheckShowData(){
    //getdata:
    let ch = new BroadcastChannel("ahabData");
    ch.postMessage("ready");
    ch.onmessage= function(e){
      console.log("got message");
      this.data= e.data['ahabModelData'];
      this.texts= e.data['texts'];
      ch.postMessage("Got Message");
      ch.close();
      console.log("broadcast channel is closed.")
      
      //checkdata:
      let dataIsRight=false;
      if (jQuery.isEmptyObject(this.data.cells)){
        console.log("No cells");
        $("#legalText").html("<h2>No model was built.</h2>").css('color', 'red').css('text-align','center');
      }
      else{
        let allTerminal = true;
        for (cell in this.data.cells){
          if(! this.data.cells[cell].terminal){
            this.data.model = this.data.cells[cell].regulatoryTextID;
            //console.log(this.texts)
            $("#legalText").css('text-align','left').html(this.texts[this.data.model]);
            allTerminal= false;
            dataIsRight = true;
            break;
          }
        }
        if (allTerminal){
        console.log("No Ambiguity Nodes");
        $("#legalText").html("<h2>The model doesn't have any ambiguity nodes.</h2>").css('color', 'red').css('text-align','center');
        }
      }

      //show nodes:
      if (dataIsRight){
        //let i=0;
        for (c in this.data.cells){
          let cell = this.data.cells[c];
          if(! cell.terminal){
            //sel.addRange(TextualAnalysis.selectionRange(document.getElementById("legalText"), cell.textPosition[0], cell.textPosition[1]));
            const divparent = document.createElement("div");
            divparent.setAttribute('class', "my-2 mr-2 w-100");
            divparent.setAttribute('id',c);
            const div = document.createElement("div");
            div.setAttribute('class',"bg-dark text-white text-center rounded-top");
            div.setAttribute('name',"title");
            div.setAttribute('id',`${c}_title`);
            const node = document.createTextNode(`${c}`);
            div.appendChild(node);
            divparent.appendChild(div);
            const textA = document.createElement("div");
            textA.setAttribute('class',"form-control h-max");/*textarea-autosize*/  

            let li= document.createElement("li");
            const textAmbitype = document.createTextNode(`Ambiguity Type:  ${cell.ambitype}, `);
            li.appendChild(textAmbitype);
            textA.appendChild(li);

            li= document.createElement("li");
            const textNotes = document.createTextNode(`\nNotes:  ${cell.notesText},`);
            li.appendChild(textNotes);
            textA.appendChild(li);
            
            li= document.createElement("li");
            const textImplementable = document.createTextNode(`Implementable:  ${cell.implementability}, `);
            li.appendChild(textImplementable);
            textA.appendChild(li);
            
            li= document.createElement("li");
            const textIntentional = document.createTextNode(`Intentional:  ${cell.intentionality}, `);
            li.appendChild(textIntentional);
            textA.appendChild(li);
            
            li= document.createElement("li");
            const textSeverity = document.createTextNode(`Severity:  ${cell.severity}, `);
            li.appendChild(textSeverity);
            textA.appendChild(li);
            
            li= document.createElement("li");
            const textOutgoing = document.createTextNode(`Outgoing links:  `);
            li.appendChild(textOutgoing);

            for(o in  cell.outgoingLinks){
              const l=document.createElement("a");
              l.setAttribute("href", `#${cell.outgoingLinks[o]}`);
              l.setAttribute("onclick", `let nodeClicked=document.getElementById('${cell.outgoingLinks[o]}'); nodeClicked.click()`);
              const lText=document.createTextNode(`${cell.outgoingLinks[o]}, `)
              l.appendChild(lText);
              li.appendChild(l);
            }
            textA.appendChild(li);

            li= document.createElement("li");
            const incomingLinksText= document.createTextNode("Incoming Links:  ");
            li.appendChild(incomingLinksText);
            for(o in  cell.incomingLinks){
              const l=document.createElement("a");
              l.setAttribute("href", `#${cell.incomingLinks[o]}`);
              l.setAttribute("onclick", `let nodeClicked=document.getElementById('${cell.incomingLinks[o]}'); nodeClicked.click()`);
              const lText=document.createTextNode(`${cell.incomingLinks[o]}, `)
              l.appendChild(lText);
              li.appendChild(l);
            }
            textA.appendChild(li);
            $('a').on('click',function(e){e.stopPropagation();})
            
            //textA.setAttribute('placeholder',`Ambiguity Type:  ${cell.ambitype}, \n\nNotes:  ${cell.notesText}, \n\nImplementable:  ${cell.implementability}, Intentional:  ${cell.intentionality}, Severity:  ${cell.severity}, \nOutgooing links:  ${cell.outgoingLinks},\nIncoming links:  ${cell.incomingLinks}`);

            function resizeTextarea(textA){
              //$(textA).css('height', $(textA).height() + 'px');
              var s_h = ($(textA).get(0).scrollHeight )+4;
              $(textA).css('height', s_h + 'px');
              $(textA).css('overflow','hidden');
            }
            textA.setAttribute('style','font-size:12px;');
            //$( "textarea" ).prop( "disabled", true );
            divparent.appendChild(textA);

            
            comments= document.getElementById("Comments");
            comments.appendChild(divparent);   
            resizeTextarea(textA);
            let dpBc= $(divparent).css('border-color');
            let dpBs= $(divparent).css('box-shadow');
            let dpO= $(divparent).css('outline');
            $(textA).on({
              'mouseover': function(e){
                $(divparent).css( 'border-color', `rgba(162, 165, 165, 0.8)`); /*rgba(7, 110, 121, 0.8)rgba(126, 239, 104, 0.8)*/
                $(divparent).css( 'box-shadow', `0 3px 3px rgba(0, 0, 0, 0.075) inset, 2px 2px 8px rgba(162, 165, 165, 0.6)`);
                $(divparent).css( 'outline', `0 none`);
              },
              'mouseout': function(){
                //console.log("mouseout is happening");
                $(divparent).css( 'border-color',dpBc);
                $(divparent).css( 'box-shadow',dpBs);
                $(divparent).css( 'outline',dpO);
              }, 
            })
            
            $(document).on('click',(event) => {
              event.stopPropagation();
              $("[name='title']").attr('class',"bg-dark text-white text-center rounded-top");     
            });
            $(`#${c}`).on({
              "click": function(e){
                e.stopPropagation();
                
                console.log(`this cell's Text is :  ${cell.regulatoryText}`);
                let sel = window.getSelection();
                sel.removeAllRanges();
                let el= document.getElementById("legalText");
                sel.addRange(TextualAnalysis.selectionRange(el, cell.textPosition[0], cell.textPosition[1]));

                //Now scroll to where it is selected:
                //https://stackoverflow.com/questions/7215479/get-parent-element-of-a-selected-text
                function getSelectionParentElement() {
                  var parentEl = null, sel;
                  if (window.getSelection) {
                      sel = window.getSelection();
                      if (sel.rangeCount) {
                          parentEl = sel.getRangeAt(0).startContainer//commonAncestorContainer;
                          if (parentEl.nodeType == 3) {
                            //console.log("nodename text")
                            parentEl = parentEl.parentNode;
                          }
                      }
                  } else if ( (sel = document.selection) && sel.type != "Control") {
                      parentEl = sel.createRange().parentElement();
                  }
                  return parentEl;
              }

                let legalText= document.getElementById('legalText');
                //console.log("selection anchorNode: \n");
                //console.log(sel.anchorNode);
                var elementTop = getSelectionParentElement().offsetTop;
                //console.log("parent: \n");
                //console.log(getSelectionParentElement());
                //console.log(elementTop);
                var divTop = legalText.offsetTop;
                //console.log(divTop);
                var elementRelativeTop = elementTop - divTop;
                //console.log(elementRelativeTop);
                $("#legalText").scrollTop(elementRelativeTop);

                //change the color of all the nodes' title bar to bg-dark
                $("[name='title']").attr('class',"bg-dark text-white text-center rounded-top");     

                //change the color of this node's title bar to bg-primary
                let node_id= $(this).attr('id');
                $(`[id = '${node_id}_title']`).attr('class',"bg-primary text-white text-center rounded-top");   
              }
            })
          }
        }
      }


    }
  },
  setup(){
    let innerh75= (0.65*window.innerHeight) - $('#page_def').height();
    $('#legalText').height(innerh75);
    $('#Comments').height(innerh75);

    TextualAnalysis.getCheckShowData();
  },
  /** Get all text nodes within an element for copying.
   * @param {HTMLElement} node - Element to get text nodes of.
   * @return {Array} textNodes - List of all text nodes.
   */
  getTextNodesIn(node) {
    var textNodes = [];
    // if it's text, add it to the array, otherwise, look at its children
    if (node.nodeType == window.Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      var children = node.childNodes;
      for (var i = 0, len = children.length; i < len; ++i) {
        textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
      }
    }
    return textNodes;
  },
  /**
  * returns a tuple containing a range (where the start and end position falls in the given legal text based on the given start and end postions (that were saved in the cell) and the textNodeNumber)
  * @param {HTMLElement} el
  * @param {Number} start
  * @param {Number} end
  */
  Node_RangeAndTextNodeNumber(el, start, end){
    //console.log(el);
    //console.log(start,end);
    var textNodeNumber=0;
    var range = document.createRange();
    range.selectNodeContents(el);// gives the Range, the element, which in our case is legalText (the legal text content)
    var textNodes = this.getTextNodesIn(el);// textNodes contain all the nodes in our text; for example it has node "h1" which has a child, and in it is our header.
    var foundStart = false;
    var charCount = 0,// stores the index of the start of the textNode that it is looking at, at each time
      endCharCount;   // stores the index of the end of the textNode that it is looking at, at each time
    //to set start and end of a range, it should be given the text nodes where the start-position and end-position are in and the index of start and end in their nodes. 
    for (var i = 0, textNode; (textNode = textNodes[i++]); ) {
      //console.log(`TEXTNODE.LEN= ${textNode.length} , textnode= ${textNode}, textNode.type= ${typeof textNode}, textNode.data=`);
      //console.log(textNode.data)
      endCharCount = charCount + textNode.length;
      //console.log(`charcount: ${charCount}, encharcount: ${endCharCount}`);
      if (
        !foundStart &&
        start >= charCount &&
        (start < endCharCount ||
          (start == endCharCount && i <= textNodes.length))
      ) {
        let s_offset= start-charCount;
        //when the range starts from index 0 of an HTML element then nothing gets added to the charcount 
        //so the element it would choose, would be the previous node that the text itself is inside it, 
        //but we want to get to the text itself and the index where the cell's text start. when this happens
        //textNode.length is equal to s_offset, so we know when this if statement is true we have gotten the
        // previous Node and not the actual textNode we were looking for. 
        if(textNode.length == s_offset){
          textNode= textNodes[i++];
          charCount= endCharCount;
          endCharCount = endCharCount + textNode.length;
          range.setStart(textNode, 0);
          //console.log("startoffset:\n");
          //console.log(0);
        }
        else
        {
          range.setStart(textNode, s_offset);
          //console.log("startoffset:\n");
          //console.log(s_offset);
        }
        //console.log("textNode:\n");
        //console.log(textNode);
        //console.log("length: ",textNode.length);
        //console.log("start text node: ", textNode);
        foundStart = true;
        textNodeNumber = i;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        //console.log("end text node: ", textNode);
        break;
      }
      charCount = endCharCount;
    }
    let a= {'range': range, 'textNodeNumber' : textNodeNumber};
    return a;
  },
  selectionRange(el, start, end) {
    //note: start position is calculated like this: each html tag is counted as 1 and each character, including space, inside an html character is also counted as 1. for example: <html data=".." ...> =>this is counted as one.  <html> hi mom </html> =>the start position for "mom" is 5 (one for tag and 4 for " hi ") 
    if (document.createRange && window.getSelection) {
      let cellTextPosInfo= this.Node_RangeAndTextNodeNumber(el, start, end);
      //console.log(cellTextPosInfo);
      let range= cellTextPosInfo['range']
      //var sel = window.getSelection();
      //sel.removeAllRanges();
      return range;
      //$("::selection").css( "background-color" );
    }/* else if (document.selection && document.body.createTextRange) {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(true);
      textRange.moveEnd("character", end);
      textRange.moveStart("character", start);
      textRange.select();
    }*/
  },
  
}
TextualAnalysis.setup();