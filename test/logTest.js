const expect = require("chai").expect;

// AHAB modules
const features = require("../js/ahab/Features.js");

// Tests

describe("Log functions", function () {
  // mock sessionStorage and the timeStamp function
  before(function () {
    global.sessionStorage = {
      items: {
        "logfile.txt": "old log"
      },
      setItem(item, value) {
        this.items[item] = value;
      },
      getItem(item) {
        return this.items[item];
      }
    };
    features.timeStamp = function () {
      return "time";
    };
  });

  // Check that the new log has been added to the old log
  describe("# logItem", function () {
    it("writes to logfile.txt in sessionStorage", function () {
      features.logItem("new log");
      expect(sessionStorage.getItem("logfile.txt")).to.equal(
        `old log\ntime: new log`
      );
    });
  });
});
