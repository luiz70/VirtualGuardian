angular.module('starter.controllers')
.controller('Menu', function($scope,$rootScope,Message,$http) {
	/*
	$scope.sendpush=function(){
		var token={
  "users": ["APA91bGROxfJO2blobA59WvJjh396Ga16-qWB8aP1IG_l5Xb-DWsYIzvgnCBvoccef_u9TRUQezfRvW93Tu8tU8K1NjZkeVGj4qPGjEYNOLd_5LJG04opxK7BxcmtQltVZaLo2CEJl0K"],
  "android": {
    "collapseKey": 1,
    "data": {
      "message": "Your message here"
    }
  },
  "ios": {
    "badge": 0,
    "alert": "Your message here",
    "sound": "soundName"
  }
}
		
		//$http.post("https://www.virtual-guardian.com:8000",token)
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:8000/send', data: token,timeout :15000})
		.success(function(data){
			console.log(data)})
	}*/
	$scope.cerrarSesion=function(){
		Message.confirm($rootScope.idioma.Menu[7],$rootScope.idioma.Login[10],function(res){
			if(res){
				$rootScope.cerrarSesion();
			}
		},null,null,false,true)
	}
	$scope.abreCuenta=function(){
		Message.showModal("screens/modal/cuenta.html",'right');
	}
	$scope.abreAjustesNot=function(){
		Message.showModal("screens/modal/notificaciones.html",'right');
	}
	$scope.abreIconos=function(){
		Message.showModal("screens/modal/iconos.html",'right');
	}
	$scope.abreInfo=function(){
		Message.showModal("screens/modal/acercade.html",'right');
	}
})
.controller('Iconos', function($scope,$rootScope,Message,socket) {
	$scope.cierraModal=function(){
		Message.hideModal();
	}
})
.controller('Acerca', function($scope,$rootScope,Message,socket,$cordovaAppVersion) {
	$scope.version="2.0.0"
	if(window.cordova)
	$cordovaAppVersion.getAppVersion().then(function (version) {
    	$scope.version=version;
	});
	$scope.cierraModal=function(){
		Message.hideModal();
	}
})