var chai = require('chai');
var mocha = require('mocha');
var assert = chai.assert;
var expect = chai.expect;
var url = "file:///D:/Documents/Research/AHAB/master/AHAB.html";

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get(url);