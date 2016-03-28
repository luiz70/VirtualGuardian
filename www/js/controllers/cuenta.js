angular.module('starter.controllers')
.controller('Cuenta', function($scope,$rootScope,Message,socket,Verificacion) {
	$scope.cuentaCargada=false;
	$scope.promo={
		code:"",
		data:false
	};
	$scope.nuevacontrasena={
		c:"",
		r:""
	}
	$scope.cierraModal=function(){
		Message.hideModal();
	}
	$scope.guarda=function(){
		Message.hideModal();
	}
	
	$scope.refreshCuenta=function(){
		socket.getSocket().emit("getCuenta");
		socket.getSocket().on("getCuenta",$scope.getCuenta)
	}
	$scope.agregaSuscripcion=function(vinculado){
		if(vinculado.IdUsuario==0){
			//titulo,texto,funcion,tipo,placeholder)
			Message.prompt($rootScope.idioma.Cuenta[12],$rootScope.idioma.Cuenta[23],function(data){
				if(data!=""){
					data=data.toLowerCase();
					var error=0;
					for(var i=0;i<$rootScope.Usuario.Vinculados.length;i++)
					if($rootScope.Usuario.Vinculados[i].Correo==data)error=1;
					if(error==1)Message.alert($rootScope.idioma.Cuenta[12],data+$rootScope.idioma.Cuenta[26]);
					else{
					Message.showLoading($rootScope.idioma.Cuenta[24]);
					socket.getSocket().on("addFamiliar",$scope.addFamiliar)
					socket.getSocket().emit("addFamiliar",data);
					}
					
				}
			},"text",$rootScope.idioma.Login[2])
		}
	}
	$scope.addFamiliar=function(data){
		Message.hideLoading()
		socket.getSocket().removeListener("addFamiliar",$scope.addFamiliar)
		if(data.error===0){
			//servicor
			Message.alert($rootScope.idioma.Cuenta[12],$rootScope.idioma.General[7]);
		}else if(data.error===1){
			//mismo
			Message.alert($rootScope.idioma.Cuenta[12],$rootScope.idioma.Contactos[3]);
		}else if(data.error===2){
			//noexiste
			Message.alert($rootScope.idioma.Cuenta[12],data.Correo+$rootScope.idioma.Contactos[5]);
		}else{
			Message.alert($rootScope.idioma.Cuenta[12],data.Correo+$rootScope.idioma.Cuenta[25])
			$scope.refreshCuenta();
		}
	}
	$scope.getCuenta=function(data){
		console.log(data);
		if(data.Vinculados){
			while(data.Vinculados.length<3){
				data.Vinculados.push({Correo:"",Estatus:0,IdUsuario:0});
			}
		}
		socket.getSocket().removeListener("getCuenta",$scope.getCuenta)
		_.extend($rootScope.Usuario,data)
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
		$scope.cuentaCargada=true;
		Message.hideLoading();
	}
	$scope.refreshCuenta();
	$scope.cierraContrasena=function(event){
		event.preventDefault()
		Message.closeAlert()
	}
	$scope.guardaContrasena=function(event){
		Message.closeAlert()
		event.preventDefault();
		if(!Verificacion.password($scope.nuevacontrasena.c,8)){
			Message.alert($rootScope.idioma.Cuenta[4],$rootScope.idioma.Registro[11],function(){
				$scope.cambiaContrasena();
			})	
		}else if($scope.nuevacontrasena.c!=$scope.nuevacontrasena.r){
			Message.alert($rootScope.idioma.Cuenta[4],$rootScope.idioma.Registro[12],function(){
				$scope.cambiaContrasena();
			})	
		}else{
			Message.showLoading($rootScope.idioma.General[10])
			socket.getSocket().on("setPassword",$scope.contrasenaCambiada)
			socket.getSocket().emit("setPassword",$scope.nuevacontrasena.c);
		}
	}
	$scope.contrasenaCambiada=function(data){
		socket.getSocket().removeListener("setPassword",$scope.contrasenaCambiada)
		Message.hideLoading();
		if(data)Message.alert($rootScope.idioma.Cuenta[4],$rootScope.idioma.Cuenta[17])
		else Message.alert($rootScope.idioma.Cuenta[4],$rootScope.idioma.Cuenta[18])
	}
	$scope.activaCode=function(){
		var cod=$scope.promo.code.toLowerCase()
		if(cod.length==0)Message.alert($rootScope.idioma.Cuenta[9],$rootScope.idioma.Registro[9])
		else{
			Message.showLoading($rootScope.idioma.Registro[32])
			Verificacion.promocion(cod)
			.success(function(data){
				Message.hideLoading();
				if(data.error){
					$scope.promo.code="";
					Message.alert($rootScope.idioma.Cuenta[9],$rootScope.idioma.Registro[9],function(){})
				}else{
					if(data.Cantidad==0){
						$scope.promo.code="";
						Message.alert($rootScope.idioma.Cuenta[9],$rootScope.idioma.Registro[31],function(){})
					}else {
						Message.showLoading("");
						$scope.promo.data=data;
						socket.getSocket().on("setPromocion",$scope.setPromocion)
						socket.getSocket().emit("setPromocion",data.Id);
						
					}
				}
			})
			.error(function(data){
				console.log(data);
			});	
		}
	}
	$scope.setPromocion=function(data){
		socket.getSocket().removeListener("setPromocion",$scope.setPromocion)
		$scope.refreshCuenta();
		
	}
	$scope.cambiaContrasena=function(){
		$scope.nuevacontrasena={c:"",r:""}
		var buttons=[{ 
    				text: $rootScope.idioma.General[6],
    				type: 'button-default',
    				onTap:$scope.cierraContrasena
  				},{
    				text: $rootScope.idioma.General[12],
    				type: "button",
    				onTap: $scope.guardaContrasena
  				}]
		Message.alertTemplate($scope,"screens/alert/contrasena.html",$rootScope.idioma.Cuenta[4],buttons,"alert-contrasena")
	}
})
