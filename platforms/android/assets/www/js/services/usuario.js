angular.module('starter.services')
.factory('Usuario',function($http,$rootScope,socket,$interval,Message,Memory,$timeout,Preferencias){
	$rootScope.Usuario;
	$timeout(function(){
		//saveidusuario
		Preferencias.set("IdUsuario",$rootScope.Usuario.Id)
	},4000);
	var interval=null;
	var refresh=function(){
		if($rootScope.Usuario){
			socket.getSocket().on("getUsuario",revisaUsuario)
			socket.getSocket().emit("getUsuario",$rootScope.Usuario.Id)
		}else console.log("no logged");
		
	}
	var revisaUsuario=function(data){
		socket.getSocket().removeListener("getUsuario",revisaUsuario);
		if(data){
			//sustituye
			_.extend($rootScope.Usuario,data)
			//console.log($rootScope.Usuario);
			//$rootScope.Usuario=data
		}
	}
	$rootScope.$watch("Usuario",function(newVal, oldVal){
		Memory.set("Usuario",$rootScope.Usuario)
	},true)
	$rootScope.$watch("Usuario.Id",function(newVal, oldVal){
		Preferencias.set("IdUsuario",$rootScope.Usuario.Id)
		//Preferencias.get("IdUsuario",function(res){})
		//if(window.plugins.pushNotification)window.plugins.pushNotification.setVariable(function () {}, function () {},{"Key":"IdUsuario","Value":""+$rootScope.Usuario.Id});
	},true)
	return {
		login:function(credentials){
			if($rootScope.internet.state)
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:'+$rootScope.port+'/login', data: credentials,timeout :15000})
			else return false;
		},
		refresh:function(){
			if(interval)$interval.cancel(interval);
			refresh();
			interval=$interval(function(){
				refresh();
			},900000)
    		return true;
		}
	}
})