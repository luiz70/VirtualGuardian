angular.module('starter.services')
.factory('Camara', ['$q', function($q) {
	return {
		clean:function(){
		var q = $q.defer();
		navigator.camera.cleanup(function(){
			q.resolve(true);
		},function(err){
			q.resolve(err);
		});
		return q.promise;
	},
    getPicture: function() {
		var q = $q.defer();
		var options = {
			quality: 70,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: false,
			encodingType: Camera.EncodingType.PNG,
			targetWidth: 500,
			targetHeight: 500,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};
		navigator.camera.getPicture(function(result) {
			// Do any magic you need
			q.resolve(result);
		}, function(err) {
			q.reject(err);
		}, options);
		return q.promise;
	}
}
}]);