// START JAVASCRIPT
function getSelectionText(){
    var selectedText = ""
    if (window.getSelection){ // all modern browsers and IE9+
        selectedText = window.getSelection().toString()
    }
    return selectedText
}

function selectElementText(el){
    var range = document.createRange() // create new range object
    //range.selectNodeContents(el) // set range to encompass desired element text
    var selection = window.getSelection() // get Selection object from currently user selected text
    selection.removeAllRanges() // unselect any user selected text (if any)
    selection.addRange(range) // add range to Selection object to select it
}


function copySelectionText(){
	var copysuccess // var to check whether execCommand successfully executed
	try{
		copysuccess = document.execCommand("copy") // run command to copy selected text to clipboard
	} catch(e){
		copysuccess = false
	}
return copysuccess
}

function copyfieldvalue(e, id){
	var field = document.getElementById(id)
	field.focus()
	field.setSelectionRange(0, field.value.length)
	var copysuccess = copySelectionText()
	if (copysuccess){
		showtooltip(e)
	}
}

function demo1(){
	var para = document.getElementById('para')
	selectElementText(para)
	var paratext = getSelectionText()
	alert(paratext) // alerts "My mama always says..."
}

function loadText(event) {
	var input = event.target;
	var jsonData;
	var jsonParsed;
    var reader = new FileReader();
    reader.onload = function(){
      jsonData = reader.result;
	  jsonParsed = JSON.parse(jsonData);
	  var stringer = JSON.stringify(jsonParsed);
	  var xmlhttp = new XMLHttpRequest();
	  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);
        txt += "<table border='1'>"
        for (x in myObj) {
            txt += "<tr><td>" + myObj[x].name + "</td></tr>";
        }
        txt += "</table>"
        document.getElementById("demo").innerHTML = txt;
    }
}
xmlhttp.open("POST", "json_demo_db_post.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send("x=" + dbParam);



	  document.getElementById('CapDisplay').innerHTML = txt;

    };

	// No clue why sessionStorage isn't captured here... Seems to work though
	//console.log(sessionStorage.length);

    reader.readAsText(input.files[0]);


}




function readLegalText(readFile){

	var reader = new FileReader();
    var fileToRead = document.querySelector('input').files[0];
	reader.addEventListener("loadend", function() {
     document.getElementById('CapDisplay').innerText = reader.result;
    });
    //reader.readAsText(fileToRead);

}

// END OF JAVASCRIPT.
