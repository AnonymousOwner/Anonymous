// START JAVASCRIPT
// -=-=-=-=-=-=-=-=-=-=-=-=-
//        Models
// -=-=-=-=-=-=-=-=-=-=-=-=-
// Joint JS custom elements
// Needed for Ambiguity Shape
// basic octagonal shape
joint.shapes.ambiguity = {};
joint.shapes.ambiguity.Element = joint.shapes.standard.Polygon.extend({
  defaults: joint.util.deepSupplement({
    type: 'ambiguity.Element',
    attrs: {
      body: {
        refPoints: '0,5 0,10 7,15 13,15 20,10 20,5 13,0 7,0',
        fill: 'lightgray',
        stroke: 'black',
      },
      text: {
        'text-anchor': 'middle',
        'ref-x': 0.5,
        'ref-y': 0.4,
        'y-alignment': 'middle',
      },
      label: {
        text: 'test',
      },
    },
  }, joint.shapes.standard.Polygon.defaults),
});
// terminal shape
joint.shapes.terminal = {};
joint.shapes.terminal.Element = joint.shapes.standard.Circle.extend({
  defaults: joint.util.deepSupplement({
    type: 'terminal.Element',
    attrs: {
      body: {
        fill: 'black',
        stroke: 'black',
        r: 30,
        cx: 30,
        cy: 30,
      },
      label: {
        text: 'Start',
        refX: 30,
        refY: 30,
        textAnchor: 'middle',
        yAlignment: 'middle',
        fill: 'white',
      },
    },
  }, joint.shapes.standard.Circle.defaults),
});

// ------------------------
// Backbone models
// ------------------------
ahab.Ambiguity = Backbone.Model.extend({
  defaults: {
    uuid: 'uuid0',
    ambiguityType: '',
    severity: '',
    intentionality: false,
    implementability: false,
    regulatoryText: '',
    regulatoryTextRef: '',
    regulatoryID: '',
    notesText: '',
    jointjsID: '',
  },
  validate: {
    uuid: 'uuid' + '',
    ambiguityType: '',
    severity: '',
    intentionality: false,
    implementability: false,
    regulatoryText: '',
    regulatoryTextRef: '',
    regulatoryID: '',
    notesText: '',
    jointjsID: '',
  },
});
// Extending the models.
ahab.Perspective = Backbone.Model.extend({
  defaults: {
    owner: '',
  },
  model: ahab.Ambiguity,
});
// -------------
// Collection
// -------------
ahab.Schema = Backbone.Collection.extend({
  defaults: {
  },
  model: ahab.Perspective,
  localStorage: new window['Backbone.LocalStorage'].LocalStorage('backbone-legal-Artifact'),
});
ahab.Schema = new ahab.Schema();
// END JAVASCRIPT
