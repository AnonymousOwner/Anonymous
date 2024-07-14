const { JSDOM } = require('jsdom');

// set up mock DOM
global.window = new JSDOM(``).window;
global.document = window.document;

global.$ = require('jquery');

require('./ModelControllerTest');
require('./FileHandler.spec');
require('./HelpersTest');
