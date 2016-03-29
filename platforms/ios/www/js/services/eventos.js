angular.module('starter.services')
.factory('Eventos',function($rootScope,uiGmapGoogleMapApi,socket,Memory,Evento,$timeout,$interval,sql){
	var server=null;
	var circulo=null;
	var inicializa=function(){
		//se intenta recuperar lo guardado en memoria
		//Memory.set("Eventos",null);
		$rootScope.eventos=Memory.get('Eventos');
		//si no hay datos guardados se inicializa un arreglo vacio
		if(!$rootScope.eventos) $rootScope.eventos=[];
		$rootScope.eventosMap=[];
	}
	
	var getEventosServer=function(){
		if(server)$timeout.cancel(server)
		server=$timeout(function(){
			sql.getEventos();
		},400)
	}
	$rootScope.$watch('Usuario.Periodo', function(newValue, oldValue) {
		if(newValue!=oldValue)getEventosServer();
	})
	
	$rootScope.$watch('eventos', function(newValue, oldValue) {
  		if(newValue){
			Memory.set('Eventos',$rootScope.eventos)
		}
	},true);

	
 
	return {
		inicializa:function(){
			inicializa();
		},
		refresh:function(){
			getEventosServer();
		}
	}
})