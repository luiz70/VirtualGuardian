angular.module('starter.services')
.factory('Push',function($http,$rootScope,$cordovaPush,socket,Memory){
	$rootScope.push=Memory.get("Push");
	if(!$rootScope.push)
	$rootScope.push={
		notificaciones:0,
		contactos:0,
		reportes:0,
	}
	
	var iosConfig = {
    	"badge": true,
    	"sound": true,
    	"alert": true,
  	}; 
	var androidConfig = {
    	"senderID": "12591466094",
  	};
  	var registra=function(token){
		socket.getSocket().emit("setDevice",$rootScope.Usuario.Id,token,window.device.platform)
		socket.getSocket().on("setDevice",setDevice);
		socket.getSocket().on("errorSetDevice",errorSetDevice);
  	}
	var errorSetDevice=function(data){
		$timeout(function(){
			registra(data);
		},5000);
	}
	var setDevice=function(data){
		socket.getSocket().removeListener("setDevice",setDevice);
		$rootScope.Usuario.Registro=data;
	}
	$rootScope.$watch("push",function(newval){
		Memory.set("Push",$rootScope.push);
	},true)
	 $rootScope.$on('$cordovaPush:notificationReceived', function(event, notificacion) {
		switch(notificacion.event) {
			case 'registered': if(notificacion.regid.length > 0 )	registra(notificacion.regid);
          	break;
        	case 'message':
				$rootScope.push.notificaciones+=(parseInt(notificacion.data["1"]))
				$rootScope.push.contactos+=(parseInt(notificacion.data["2"]))
				if(notificacion.foreground){
					//alert("frente");
				}else{
					//alert("back");
				}
          		//console.log(notificacion);
          	break;
		}
	})
	return {
		registra:function(state){
			if(state){
				if(window.cordova)
				switch(window.device.platform.toLowerCase()){
					case "android":
						$cordovaPush.register(androidConfig).then(function(result){});
					break;
					case "ios":
						$cordovaPush.register(iosConfig).then(registra)
					break;
				}
				else registra("")
			}else{
				$cordovaPush.unregister().then(function(result) {
					registra("");
				}, function(err) {
					registra("");
				});
			}
			
			return true;
		},
		desregistra:function(){
			
    		return true;
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			return true;
		}
	}
})