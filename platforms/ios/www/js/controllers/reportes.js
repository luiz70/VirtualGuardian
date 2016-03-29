angular.module('starter.controllers')
.controller('Reportes', function($scope,$rootScope,$timeout,$ionicScrollDelegate,socket,ionicMaterialMotion,ionicMaterialInk,Message,Reporte) {
	$scope.cargandoReportes=false;
	$scope.reportesRefresh=false;
	$scope.moreData=true;
	$scope.$on('$ionicView.beforeEnter',function(){
		$rootScope.push.reportes=0;
	})
	$scope.$on('$ionicView.afterEnter',function(){
		$rootScope.push.reportes=0;
		$scope.cargandoReportes=true;
		$timeout(function(){
			$ionicScrollDelegate.scrollTop();
        	$scope.loadReportes(0);
			$rootScope.reportes=$rootScope.reportes.slice(0, 15)
			$scope.moreData=true;
		},100)
	})
	$scope.creaReporte=function(){
		if($rootScope.internet.state && !_.isUndefined(google)){
			Message.showModal("screens/modal/reporte.html",'right');
		}else{
			//no hay internet, no abre
			Message.alert($rootScope.idioma.Reportes[1],$rootScope.idioma.General[7],function(){})
		}
	}
	$scope.animate=function(){
		
		// Set Motion
		ionicMaterialMotion.fadeSlideInRight();
		// Set Ink
		ionicMaterialInk.displayEffect();
	}
	$scope.loadReportes=function(val){
		
		socket.getSocket().removeListener("getReportes",getReportes)
		socket.getSocket().removeListener("connect",connect)
		socket.getSocket().removeListener("connect_error",connectError);
		socket.getSocket().on("getReportes",getReportes)
		socket.getSocket().on("connect",connect)
		socket.getSocket().on("connect_error",connectError);
		if(socket.isConnected())Reporte.getReportes(val);
		else{ 
			getReportes([])
			$scope.moreData=false;
		}
		/*
		
		if(!$scope.$$phase)
			$scope.$apply(function(){
				$scope.reportesRefresh=true;
			})
		else{
			$scope.reportesRefresh=true;
		}*/
		
	}
	function getReportes(data){
		$rootScope.push.reportes=0;
		socket.getSocket().removeListener("getReportes",getReportes)
		$timeout(function(){
			$ionicScrollDelegate.resize()
			$scope.animate();
		},300)
		$timeout(function(){
			$scope.cargandoReportes=false;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
			if(data.Tipo==1 && data.Data.length==0)$scope.moreData=false;
		},100)
	}
	var connect=function(){
		if($rootScope.reportes && $rootScope.reportes.length>0)
			socket.getSocket().emit("setReportes",_.map($rootScope.reportes,function(v){return {IdR:v.IdReporte,Edi:v.Editado}}))
		socket.getSocket().removeListener("connect",connect)
		$scope.loadReportes(0)
		$scope.cargandoReportes=true;
		$scope.moreData=true;
		
	}
	var connectError=function(){
		socket.getSocket().removeListener("connect_error",connectError);
		getReportes([]);
		$scope.moreData=false;
	}
	$scope.abreReporte=function(data){
		var buttons=[
			{text:$rootScope.idioma.Reportes[7],funcion:$scope.apoyarReporte,data:data},
			{text:$rootScope.idioma.Reportes[8],funcion:$scope.rechazarReporte,data:data},
			/*{text:$rootScope.idioma.Notificaciones[20],funcion:$scope.verEvento,data:data}*/
		];
		Message.showActionSheet(null,buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				if($rootScope.internet.state){
				res.funcion(res.data);
				}else{
				Message.alert($rootScope.idioma.Reportes[6],$rootScope.idioma.General[7],function(){})
				}
			}
		})
	}
	$scope.apoyarReporte=function(data){
		console.log(data);
	}
	$scope.rechazarReporte=function(data){
		console.log(data);
	}
})

.controller('CreaReporte', function($scope,$rootScope,Message,$ionicScrollDelegate,$timeout,Ubicacion,$animate,Camara,$ionicPopup,socket) {
	$scope.idioma=$rootScope.idioma
	$scope.buscando=false;
	$scope.direccion={search:""};
	$scope.timeout=null;
	$scope.resultados=[];
	$scope.maploaded=false;
	$scope.resumen=null;
	$scope.select={
		options:_.map($rootScope.idioma.Asuntos, function(value, index) {return {text:value,value:index,selected:false}}),
		selected:1,
		funcionSeleccion:function(res){
			Message.closeSelect();
			for(var i=0;i<$scope.select.options.length;i++){
				$scope.select.options[i].selected=false
			}
			$scope.reporte.Asunto=res.value;
			$scope.minimap.marker.options.icon=$scope.iconoMarcador();
			
		}
	}
	$scope.select.selected=$scope.select.options[0].value;
	$scope.select.options[0].selected=true;
	$scope.reporte={
		Asunto:1,
		Direccion:{},
		Fecha:$rootScope.idioma.Tiempos[0],
		Imagen:null
	}
	$scope.iconoMarcador=function(){
		return {
			url: 'img/iconos/reportes/marcadores/'+$scope.reporte.Asunto+'.png',
			//define el tamaño del marcador
			size: new google.maps.Size(40, 51),
   			origin: new google.maps.Point(0,0),
   			anchor: new google.maps.Point(20, 51),
			scaledSize:new google.maps.Size(40, 51)
		}
	}
	$scope.minimap={
		center:{ latitude: $rootScope.ubicacion.location.latitude, longitude: $rootScope.ubicacion.location.longitude},
		zoom:16,
		options:{
				mapTypeControl: false,
				panControl: false,
				zoomControl: false,
				scaleControl: false,
				streetViewControl: false,
				styles:[
				   	{featureType: "poi",stylers: [{ visibility: "off" }]},
					{"featureType": "road","stylers": [{"gamma": 1.07 },{ "lightness": 6 },{ "hue": "#00bbff" },{ "saturation": -67 }]}
				],
		},
		marker:{
			latitude: $rootScope.ubicacion.location.latitude, 
			longitude:  $rootScope.ubicacion.location.longitude,
			options:{
				draggable:true,
				zIndex:10000,
				icon:$scope.iconoMarcador(),
				opacity:0.9,
				shape:{
					coords: [0, 0, 0, 51, 40, 51, 40 , 0],
					type: 'poly',
				},
				visible:true,
			},
			events:{
				mouseup:function(event){
					$scope.minimap.marker.latitude=event.position.lat();
					$scope.minimap.marker.longitude=event.position.lng();
					$timeout(function(){
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({'location': event.position}, function(results, status) {
							if (status === google.maps.GeocoderStatus.OK) {
								$scope.reporte.Direccion=results[0];
								$scope.direccion.search=results[0].formatted_address;
								$rootScope.$apply()
								/*$scope.minimap.marker.latitude=$scope.reporte.Direccion.geometry.location.lat();
								$scope.minimap.marker.longitude=$scope.reporte.Direccion.geometry.location.lng();*/
							}
						})
					},300);
				}
			}
		},
		events:{
			tilesloaded:function(e){
				//$scope.maploaded=true;
			}
		}
	}
	$scope.refreshCenter=function(newVal){
		$scope.minimap.center={latitude:$scope.minimap.marker.latitude,longitude:$scope.minimap.marker.longitude}
		$timeout(function(){
			$scope.minimap.center={latitude:$scope.minimap.marker.latitude,longitude:$scope.minimap.marker.longitude}
		},600);
	}
	$scope.$watch("minimap.marker",$scope.refreshCenter,true)
	$scope.$watch("minimap.marker",$scope.refreshCenter,true)
	$timeout(function(){
		/*$scope.minimap.center={ latitude: $rootScope.ubicacion.location.latitude, longitude: $rootScope.ubicacion.location.longitude}*/
		$scope.minimap.marker.latitude=$rootScope.ubicacion.location.latitude
		$scope.minimap.marker.longitude=$rootScope.ubicacion.location.longitude
		$animate.addClass(document.getElementsByClassName("minimap")[0],'visible')
		$scope.maploaded=true;
		$scope.refreshPosition();
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': new google.maps.LatLng($rootScope.ubicacion.location.latitude,$rootScope.ubicacion.location.longitude)}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				$scope.reporte.Direccion=results[0];
				$scope.direccion.search=results[0].formatted_address;
				$rootScope.$apply()
			}
		})
	
	},500)
	$scope.refreshPosition=function(){
		Ubicacion.stopPosition();
		$timeout(function(){
		navigator.geolocation.getCurrentPosition($scope.successReporte, $scope.reporteError,{enableHighAccuracy: true,timeout:15000 ,maximumAge:500});
		},500);
	}
	
	$scope.successReporte=function(pos){
		/*$scope.minimap.center={latitude:pos.coords.latitude,longitude:pos.coords.longitude};*/
		$scope.minimap.marker.latitude=pos.coords.latitude
		$scope.minimap.marker.longitude=pos.coords.longitude
		Ubicacion.startPosition();
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude)}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				$scope.reporte.Direccion=results[0];
				$scope.direccion.search=results[0].formatted_address;
				$rootScope.$apply()
			}
		})
	}
	$scope.reporteError=function(err){
		Ubicacion.startPosition();
	}
	
	
	$scope.eliminaDireccion=function(){
		$scope.direccion.search="";
		$scope.resultados=[];
		$timeout(function(){
		document.getElementById("reporte-direccion").focus();
		},1000);
	}
	$scope.cierraModal=function(){
		Message.hideModal();
	}
	$scope.abreCamara=function(){
		Camara.clean();
		$rootScope.hideSplash=true;
		Camara.getPicture().then(function(imageURI) {
      		$scope.reporte.Imagen=imageURI;
    	}, function(err) {
    	});
	}
	$scope.cambiaFecha=function(){
		var buttons=[];
		for(var i=0;i<$rootScope.idioma.Tiempos.length;i++)
		buttons.push({text:$rootScope.idioma.Tiempos[i].titulo,data:$rootScope.idioma.Tiempos[i]})
		Message.showActionSheet($rootScope.idioma.Reportes[14],buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				$scope.reporte.Fecha=res.data;
			}
		})
	}
	$rootScope.reporta=function(){
		
		$scope.parseAddress();
		$scope.reporte.staticMap={Latitud:$scope.reporte.Direccion.geometry.location.lat(),Longitud:$scope.reporte.Direccion.geometry.location.lng(),Icono:$rootScope.idioma.AsuntosIconos[$scope.reporte.Asunto]}
		if($scope.resumen)$scope.resumen.close();
		$scope.resumen=$ionicPopup.show({
  			cssClass: 'resumen-popup',
			templateUrl: 'screens/modal/resumenReporte.html', // String (optional). The URL of an html template to place in the popup   body.
			scope: $scope, // Scope (optional). A scope to link to the popup content.
			});
			
		//Message.hideModal();
	}
	
	
	
	$scope.cierraResumen=function(){
		if($scope.resumen)$scope.resumen.close();
	}
	$scope.reporteCreado=function(data){
		Message.hideLoading();
		if(data){
			Message.hideModal();
			Message.alert($rootScope.idioma.Reportes[1],$rootScope.idioma.Reportes[17],function(){})
		}else{
			Message.alert($rootScope.idioma.Reportes[1],$rootScope.idioma.Reportes[18],function(){})
		}
		
	}
	$scope.guardaReporte=function(){
		if($scope.resumen)$scope.resumen.close();
		if(socket.isConnected()){
			Message.showLoading($rootScope.idioma.Reportes[16])
			var repo=JSON.parse(JSON.stringify($scope.reporte));
			repo.Fecha=repo.Fecha.valor;
			delete repo.staticMap;
			delete repo.Direccion;
			repo.Direccion=repo.Parsed;
			delete repo.Parsed;
			repo.Position={lat:$scope.minimap.marker.latitude,lng:$scope.minimap.marker.longitude}
			socket.getSocket().removeListener("setReporte",$scope.reporteCreado)
			socket.getSocket().on("setReporte",$scope.reporteCreado)
			socket.getSocket().emit('setReporte',repo);
			
		}else Message.alert($rootScope.idioma.Reportes[1],$rootScope.idioma.General[7],function(){})
	}
	$scope.parseAddress=function(){
		var data={Estado:"",Municipio:"",Colonia:"",Calles:""};
		var input=$scope.reporte.Direccion.address_components;
		for(var i=0;i<input.length;i++){
			if(input[i].types && input[i].types.length>0){
				if(_.indexOf(input[i].types, "route")>=0)data.Calles=input[i].short_name
				else if(_.indexOf(input[i].types, "sublocality")>=0)data.Colonia=input[i].long_name
				else if(_.indexOf(input[i].types, "locality")>=0)data.Municipio=input[i].long_name
				else if(_.indexOf(input[i].types, "administrative_area_level_1")>=0)data.Estado=input[i].long_name.toLowerCase();
			}
		}
		if(data.Estado=="estado de méxico")data.Estado="méxico";
		data.Estado=_.indexOf(_.map($rootScope.idioma.Estados,function(v){return v.toLowerCase()}),data.Estado)+1;
		$scope.reporte.Parsed=data;
	}
	$scope.cambiaAsunto=function(){
		
		for(var i=0;i<$scope.select.options.length;i++){
				$scope.select.options[i].selected=($scope.select.options[i].value!=$scope.reporte.Asunto)?false:true
		}
		Message.select($scope)
	}
	$scope.abrelugar=function(place){
		$scope.reporte.Direccion=place;
		$scope.direccion.search=place.formatted_address;
		$scope.resultados=[];
		/*$scope.minimap.center={latitude:place.geometry.location.lat(),longitude:place.geometry.location.lng()};*/
		$scope.minimap.marker.latitude=place.geometry.location.lat()
		$scope.minimap.marker.longitude=place.geometry.location.lng()
	}
	$scope.buscaDireccion=function(){
		$scope.buscando=true;
		if($scope.timeout)$timeout.cancel($scope.timeout)
		$scope.timeout=$timeout($scope.busca,1000);
	}
	$scope.busca=function(){
		$scope.resultados=[]
		$ionicScrollDelegate.scrollTop();
		$scope.buscando=true;
		if($scope.direccion.search){
		if($scope.direccion.search.trim()!=""){
		$scope.searchBox = new google.maps.places.PlacesService($rootScope.map.getGMap());
		var service = new google.maps.places.AutocompleteService();
 		service.getPlacePredictions({ input: $scope.direccion.search ,componentRestrictions: {country: 'mx'},language:"es"}, $scope.predicciones);
		}else $scope.resultados=[]
		}else $scope.buscando=false;
	}
	$scope.predicciones = function(predictions, status) {
		$scope.resultados=[]
		if(!predictions)
		$scope.$apply(function () {
			$scope.buscando=false
		})
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        predictions.forEach(function(prediction) {
		$scope.searchBox.getDetails({placeId:prediction.place_id}, $scope.placeDetails);	
    	});
	}
	
  };
  $scope.placeDetails=function(result,status){
	 $scope.buscando=false;
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  $scope.$apply(function () {
          	$scope.resultados.push(result);
        });
	  }
	  
  }
})
.controller('Hora', function($rootScope) {
	alert(3);
})
