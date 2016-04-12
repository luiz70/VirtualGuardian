angular.module('starter.controllers')
.controller('AjustesNotificaciones', function($scope,$rootScope,Message,socket,$timeout,Preferencias) {
	$scope.cargandoAjustesN=true;
	$scope.EstadosSelect={
		options:_.map($rootScope.idioma.Estados,function(v,i){return {text:v,selected:true,id:i}}),
		funcionSeleccion:function(res){
			//Message.closeSelectMultiple();		
		},
		titulo:"",
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
	$scope.TonosSelect={
		options:[{text:$rootScope.idioma.General[14],selected:false},{text:"Bell",selected:false},{text:"Cool",selected:false},{text:"Cyber",selected:false},{text:"Double",selected:false},{text:"Long",selected:false},{text:"Ping",selected:false}],
		funcionSeleccion:function(res){
			for(var i=0;i<$scope.TonosSelect.options.length;i++){
				if(res.text!=$scope.TonosSelect.options[i].text)$scope.TonosSelect.options[i].selected=false;
			}
			if(AudioToggle){
                AudioToggle.playRingTone(res.text.toLowerCase(),true);
			}
			//Message.closeSelect();
		},
		optionsSelected:function(){
			for(var i=0;i<$scope.TonosSelect.options.length;i++)
				if($scope.TonosSelect.options[i].selected)return $scope.TonosSelect.options[i].text
			return $scope.TonosSelect.options[0].text
		},
		hideTodos:true,
	}
	$scope.AlertasSelect={
		options:[{text:$rootScope.idioma.General[14],selected:false},{text:"Bell",selected:false},{text:"Cool",selected:false},{text:"Cyber",selected:false},{text:"Double",selected:false},{text:"Long",selected:false},{text:"Ping",selected:false}],
		funcionSeleccion:function(res){
			for(var i=0;i<$scope.AlertasSelect.options.length;i++){
				if(res.text!=$scope.AlertasSelect.options[i].text)$scope.AlertasSelect.options[i].selected=false;
			}
			if(AudioToggle){
                AudioToggle.playRingTone(res.text.toLowerCase(),true);
			}
			//Message.closeSelect();
		},
		optionsSelected:function(){
			for(var i=0;i<$scope.AlertasSelect.options.length;i++)
				if($scope.AlertasSelect.options[i].selected)return $scope.AlertasSelect.options[i].text
			return $scope.AlertasSelect.options[0].text
		},
		hideTodos:true,
	}
	$timeout(function(){
		$scope.cargandoAjustesN=true;
		socket.getSocket().on("getAjustesNotificaciones",$scope.cargaAjustes)
		Preferencias.get("Tono",function(res){
			if(res=="null" || res==null)$scope.TonosSelect.options[0].selected=true;
			else
			for(var i=0;i<$scope.TonosSelect.options.length;i++)
				if(res.toLowerCase()==$scope.TonosSelect.options[i].text.toLowerCase())$scope.TonosSelect.options[i].selected=true
				
			Preferencias.get("Alerta",function(res2){
			socket.getSocket().emit("getAjustesNotificaciones")
			if(res2=="null" || res2==null)$scope.AlertasSelect.options[0].selected=true;
			else
			for(var i=0;i<$scope.AlertasSelect.options.length;i++)
				if(res2.toLowerCase()==$scope.AlertasSelect.options[i].text.toLowerCase())$scope.AlertasSelect.options[i].selected=true
			})
		})
		
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
	$scope.seleccionaTodas=function(){
		var val=$scope.allSelected();
		for(var i=0;i<$scope.select.options.length;i++)
			$scope.select.options[i].selected=!val;
	}
	$scope.allSelected=function(){
		for(var i=0;i<$scope.select.options.length;i++)
		if($scope.select.options[i].selected==false)return false;
		return true;
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
			//error al guardar
			Message.alert($rootScope.idioma.Menu[3],$rootScope.idioma.Ajustes[16])
		}
		
	}
	$scope.guarda=function(){
		socket.getSocket().on("setAjustesNotificaciones",$scope.guardaAjustes)
		//Preferencias.set("Tono",$rootScope.Usuario.Id)
		$scope.ANotificaciones.Asuntos=_.compact(_.map($scope.AsuntosSelect.options,function(v,i){if(!v.selected)return parseInt(v.id)}))
		$scope.ANotificaciones.Estados=_.compact(_.map($scope.EstadosSelect.options,function(v,i){if(!v.selected)return parseInt(v.id)}))
		var Tonosel=_.compact(_.map($scope.TonosSelect.options,function(v,i){if(v.selected)return v.text}))
		Preferencias.set("Tono",Tonosel[0].toLowerCase())
		var Tonosel2=_.compact(_.map($scope.AlertasSelect.options,function(v,i){if(v.selected)return v.text}))
		Preferencias.set("Alerta",Tonosel2[0].toLowerCase())
		socket.getSocket().emit("setAjustesNotificaciones",$scope.ANotificaciones)
		Message.showLoading($rootScope.idioma.General[10]);
	}
	$scope.cambiaTono=function(){
		$scope.TonosSelect.temp=JSON.stringify($scope.TonosSelect.options);
		$scope.select=$scope.TonosSelect;
		Message.selectMultiple($scope)
	}
	$scope.cambiaAlerta=function(){
		$scope.AlertasSelect.temp=JSON.stringify($scope.AlertasSelect.options);
		$scope.select=$scope.AlertasSelect;
		Message.selectMultiple($scope)
	}
})
