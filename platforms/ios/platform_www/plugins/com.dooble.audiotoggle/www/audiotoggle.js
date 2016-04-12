cordova.define("com.dooble.audiotoggle.AudioToggle", function(require, exports, module) {
var exec = require('cordova/exec');
exports.SPEAKER = 'speaker';
exports.EARPIECE = 'earpiece';
exports.RINGTONE = 'ringtone';
exports.NORMAL = 'normal';

exports.setAudioMode = function (mode) {
	cordova.exec(null, null, 'AudioTogglePlugin', 'setAudioMode', [mode]);
};
exports.playRingTone = function (tone,stop) {
    cordova.exec(null, null, 'AudioTogglePlugin', 'playRingTone',[tone,stop]);
};
exports.playTone = function (tone,stop) {
    cordova.exec(null, null, 'AudioTogglePlugin', 'playTone',[tone,stop]);
};
exports.playBye = function () {
    cordova.exec(null, null, 'AudioTogglePlugin', 'playBye',['']);
};
exports.stopTone = function () {
    cordova.exec(null, null, 'AudioTogglePlugin', 'stopTone',['']);
};

});
