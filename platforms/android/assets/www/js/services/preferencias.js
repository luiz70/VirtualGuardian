angular.module('starter.services')
.factory('Preferencias',function(Memory){
	
	return {
		get:function(key,funcion){
			if(window.plugins.pushNotification)window.plugins.pushNotification.getVariable(funcion, function () {},{"Key":key});
			else {
				funcion(Memory.get(key+"_1"));
			}
		},
		set:function(key,val){
			if(window.plugins.pushNotification)window.plugins.pushNotification.setVariable(function () {}, function () {},{"Key":key,"Value":""+val});
			else{
				Memory.set(key+"_1",val)
			}
		}
	}
})