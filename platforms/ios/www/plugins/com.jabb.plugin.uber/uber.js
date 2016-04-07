cordova.define("com.jabb.plugin.uber.uber", function(require, exports, module) {
               var exec = require('cordova/exec');
window.uber = function(str, success,error) {
    exec(success,error, "Uber", "requestWithUber", [str]);
};
});
