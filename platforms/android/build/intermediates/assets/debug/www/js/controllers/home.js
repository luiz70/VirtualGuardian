angular.module('starter.controllers')
.controller('Home', function($scope,$timeout,$ionicSideMenuDelegate,$state,socket,$rootScope,Memory,$ionicViewSwitcher,Usuario,Notificacion,Contactos,Reporte,Llamada,Mapa,Filtros,sql,Usuario,Push,uiGmapGoogleMapApiManualLoader,uiGmapGoogleMapApi,$animate) {
	$scope.$on('$ionicView.afterEnter',function(){
		if(Memory.get("Usuario"))
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                angular.element(document.getElementsByClassName("animate-enter-up").item(0)).addClass("animate")
				if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 100);
			
    })
	$rootScope.tip="";
	$scope.cambiaPantalla=function(val){
		switch(val){
			case 1:$state.go("app.home.mapa")
			break;
			case 2:$state.go("app.home.notificaciones")
			break;
			case 3:$state.go("app.home.contactos")
			break;
			case 4:$state.go("app.home.reportes")
			break;
		}
		
	}
	$rootScope.cierraTip=function(){
		$animate.removeClass(document.getElementById("tip-virtual-guardian"),'show-tip')
		$animate.addClass(document.getElementById("tip-virtual-guardian"),'hide-tip')
		$timeout(function(){
			angular.element(document.getElementById("tip-virtual-guardian")).css("display","none");
		},400)
	}
	$rootScope.abreTip=function(img){
		$rootScope.tip=img;
		angular.element(document.getElementById("tip-virtual-img")).css("opacity","0")
		angular.element(document.getElementById("tip-virtual-guardian")).css("opacity","0")
		angular.element(document.getElementById("tip-virtual-guardian")).css("display","block")
		$animate.removeClass(document.getElementById("tip-virtual-guardian"),'hide-tip')
		$animate.addClass(document.getElementById("tip-virtual-guardian"),'show-tip')
		var url = "https://www.virtual-guardian.com/tips/"+img+".png"
		var img = new Image();
		img.onload = function() {
			$timeout(function(){
   			 angular.element(document.getElementById("tip-virtual-img")).css("opacity","1");
			},5000);
		}
		img.src = url;
if (img.complete) img.onload();
		
	}
	if(!Memory.get("Usuario")){
		$ionicViewSwitcher.nextTransition("none");
		$ionicViewSwitcher.nextDirection('enter');
		$state.go("app.login")
	}else{
		$timeout(function(){
		Llamada.inicializa();
		angular.element(document.getElementsByClassName("mapa-search")[0]).css("display","block")
		$rootScope.Usuario=Memory.get("Usuario")
		socket.inicializa();
		$rootScope.sql=sql;
		$scope.loadMapa();
		},500)
	}
	$scope.loadMapa=function(){
		$rootScope.cargandoMapa=true;
		uiGmapGoogleMapApiManualLoader.load();
	}
	uiGmapGoogleMapApi.then(function(){
		Mapa.inicializa();
	})
	
	$scope.conectedonce=function(evt,res){
		$scope.conectado();
		sql.inicializa(true)
		if(res){
			sql.update();
			Push.registra(true);
			Usuario.refresh();
			Contactos.inicializa()
			Notificacion.inicializa()
			Reporte.inicializa()
			Filtros.inicializa()
		}
		Contactos.inicializa()
		Notificacion.inicializa()
		Reporte.inicializa()
		Filtros.inicializa()
		socket.getSocket().on("connect",$scope.conected)
	}
	$scope.conected=function(){
		sql.inicializa(true);
		Push.registra(true);
		Usuario.refresh();
		sql.update();
		Contactos.inicializa()
		Notificacion.inicializa()
		Reporte.inicializa()
		Filtros.inicializa()
	}
	
	$scope.conectado=$rootScope.$on("socket.connect",$scope.conectedonce)
	document.addEventListener("pause", function(){
		socket.disconnect();
	}, false);
	document.addEventListener("resume", function(){
		$scope.conectado();
		$scope.conectado=$rootScope.$on("socket.connect",$scope.conectedonce)
		socket.connect();
	})
		
	$scope.menuWidth=function(){
		if(window.innerHeight> window.innerWidth)return window.innerWidth*0.85;
		else return window.innerHeight*0.85;
	}
	$scope.menuAbierto=false;
	$scope.seccion=1;
	$scope.menuOpen=false
	
	$scope.$watch(function () {
    	return $ionicSideMenuDelegate.isOpenLeft();
  	},
     function (isOpen) {
    if (isOpen){
		angular.element(document.getElementsByTagName("disable-screen").item(0)).addClass("display")
		$scope.menuOpen=true
	}else {
		angular.element(document.getElementsByTagName("disable-screen").item(0)).removeClass("display")
		$scope.menuOpen=false
	}
  });
	$scope.isCover=function(){
		return $ionicSideMenuDelegate.isOpen()
	}
	
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.seccion=$state.current.id;
	})
	
	
	$rootScope.Asuntos=Memory.get("Asuntos")
	
	
	
	
	
	$rootScope.$watch("Asuntos",function(newValue){
		if(newValue) Memory.set("Asuntos",$rootScope.Asuntos)	
	})
	
})