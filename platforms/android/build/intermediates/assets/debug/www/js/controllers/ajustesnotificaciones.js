angular.module('starter.controllers')
.controller('AjustesNotificaciones', function($scope,$rootScope,Message,socket,$timeout) {
	$scope.cargandoAjustesN=true;
	$scope.EstadosSelect={
		options:_.map($rootScope.idioma.Estados,function(v,i){return {text:v,selected:true,id:i}}),
		funcionSeleccion:function(res){
			//Message.closeSelectMultiple();		
		},
		optionsLength:function(){
			var d=0;
			for(var i=0;i<$scope.EstadosSelect.options.length;i++)
				if($scope.EstadosSelect.options[i].selected)d++;
			if($scope.EstadosSelect.options.length==d)return $rootScope.idioma.General[13]+" "+$rootScope.idioma.General[15].toLowerCase();
			else return d+" "+$rootScope.idioma.General[15];
		}
	}
	$scope.AsuntosSelect={
		options:_.map($rootScope.idioma.Asuntos,function(v,i){return {text:v,selected:true,id:i}}),
		funcionSeleccion:function(res){
			//Message.closeSelectMultiple();		
		},
		optionsLength:function(){
			var d=0;
			for(var i=0;i<$scope.AsuntosSelect.options.length;i++)
				if($scope.AsuntosSelect.options[i].selected)d++;
			if($scope.AsuntosSelect.options.length==d)return $rootScope.idioma.General[13]+" "+$rootScope.idioma.General[15].toLowerCase();
			else return d+" "+$rootScope.idioma.General[15];
		}
	}
	$timeout(function(){
		$scope.cargandoAjustesN=true;
		socket.getSocket().on("getAjustesNotificaciones",$scope.cargaAjustes)
		socket.getSocket().emit("getAjustesNotificaciones")
	},500);
	
	$scope.cargaAjustes=function(data){
		socket.getSocket().off("getAjustesNotificaciones",$scope.cargaAjustes)
		$scope.ANotificaciones.tiempo=data.Tiempo;
		$scope.ANotificaciones.activas=Boolean(data.Notificaciones);
		$scope.ANotificaciones.contactos=Boolean(data.Alertas);
		var Estados=data.Estados.split(",");
		var Asuntos=data.Asuntos.split(",");
		if(Estados.length>0)
		for(var i=0;i<$scope.EstadosSelect.options.length;i++)
			if(Estados.indexOf($scope.EstadosSelect.options[i].id)>=0)$scope.EstadosSelect.options[i].selected=false
		
		if(Asuntos.length>0)
		for(var i=0;i<$scope.AsuntosSelect.options.length;i++)
			if(Asuntos.indexOf($scope.AsuntosSelect.options[i].id)>=0)$scope.AsuntosSelect.options[i].selected=false
		$scope.cargandoAjustesN=false;
		$scope.$apply(function(){});
		
	}
	$scope.ANotificaciones={
		activas:true,
		tiempo:30,
		contactos:true,
	}
	$scope.cambiaTiempo=function(){
		
		var buttons=[];
		for(var i=0;i<$rootScope.idioma.TiempoNotificacion.length;i++)
		buttons.push({text:$rootScope.idioma.TiempoNotificacion[i].titulo,data:$rootScope.idioma.TiempoNotificacion[i]})
		Message.showActionSheet($rootScope.idioma.Ajustes[8],buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				$scope.ANotificaciones.tiempo=res.data.valor;
			}
		})
	}
	$scope.cambiaEstados=function(){
		$scope.EstadosSelect.temp=JSON.stringify($scope.EstadosSelect.options);
		$scope.select=$scope.EstadosSelect;
		Message.selectMultiple($scope)
	
	}
	$scope.cambiaAsuntos=function(){
		$scope.AsuntosSelect.temp=JSON.stringify($scope.AsuntosSelect.options);
		$scope.select=$scope.AsuntosSelect;
		Message.selectMultiple($scope)
	
	}
	$scope.cambiaContactos=function(){
		$scope.ANotificaciones.contactos=!$scope.ANotificaciones.contactos;
	}
	$scope.cierraSelectMultiple=function(){
		$scope.select.options=JSON.parse($scope.select.temp);
		Message.closeSelectMultiple();	
	}
	$scope.guardaSelectMultiple=function(){
		Message.closeSelectMultiple();	
	}
	$scope.cierraModal=function(){
		Message.hideModal();
	}
	$scope.guardaAjustes=function(data){
		socket.getSocket().off("setAjustesNotificaciones",$scope.guardaAjustes);
		Message.hideLoading();
		
		if(data){
			Message.hideModal();
		}else{
			Message.alert("sfd","sdfsfds")
		}
	}
	$scope.guarda=function(){
		socket.getSocket().on("setAjustesNotificaciones",$scope.guardaAjustes)
		$scope.ANotificaciones.Asuntos=_.compact(_.map($scope.AsuntosSelect.options,function(v,i){if(!v.selected)return parseInt(v.id)}))
		$scope.ANotificaciones.Estados=_.compact(_.map($scope.EstadosSelect.options,function(v,i){if(!v.selected)return parseInt(v.id)}))
		socket.getSocket().emit("setAjustesNotificaciones",$scope.ANotificaciones)
		Message.showLoading($rootScope.idioma.General[10]);
	}
})
