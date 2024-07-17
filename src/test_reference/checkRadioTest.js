const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { assert } = require('chai');
var url = "file:///D:/Documents/Research/AHAB/master/AHAB.html";

//let Features = require('../scripts/ahab/Features.js');

function checkRadio(attrName, driver) {
    //var radios = document.getElementsByName(name);
    var radios = driver.findElements(By.name(attrName));
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            return (radios[i].value);
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}


describe('checkRadio function', function() {
	   const driver = new Builder().forBrowser('chrome').build();
	   before(async () => {
		 await driver.get(url);
         // removed below - page doesn't load with an alert, causing failure
      	 //await driver.wait(until.alertIsPresent());
		 //let alert = await driver.switchTo().alert();
		 //let alertText = await alert.getText();
		 //console.log("The alert text is: "+alertText);
		 //await alert.sendKeys("AutoTest");
		 //await alert.accept();
		});
	  it('should return the value Lexical', async function(){
		  expect(checkRadio("ambiguity", driver)).to.equal("Lexical");

	  });
	  
	  after(async () => { 
		driver.quit();
	});

});