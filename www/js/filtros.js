angular.module('starter')
.filter('FHNotificacion', function () {
	/*return function (input) {
	   if(input){
		   var date=new Date(parseInt(input.Fecha)*1000);
		   var d,m
		   d=(date.getDate()<10)?("0"+date.getDate()):date.getDate()
		   m=((date.getMonth()+1)<10)?("0"+(date.getMonth()+1)):(date.getMonth()+1)
		   return ""+d+"-"+m+"-"+date.getFullYear()+" "+input.Hora
	   }
	}*/
	return function (input,scope) {
	   if(input){
		  
		   var hm=input.Hora.split(":");
		   if(input.Editado==null)var f1=(parseInt(input.Fecha)*1000)
		 	else  var f1=(parseInt(input.Fecha)*1000)+(parseInt(hm[0])*60*60000)+(parseInt(hm[1])*60000)
		   var f2=new Date();
		   f2=f2.getTime();
		   var val=Math.floor((f2-f1)/60000)
		    if(input.Editado==null)console.log(new Date(f1),new Date(f2));
		   if(val==0){
			   return scope.idioma.Reportes[15]; 
		   }else if(val<60){
			   return scope.idioma.Reportes[9]+val+scope.idioma.Reportes[10]
		   }else if(Math.floor(val/60)<24){
			   var d=Math.floor(val/60);
			   return scope.idioma.Reportes[9]+d+scope.idioma.Reportes[11]
		   }else{
			   	var dt=new Date(f1);
			  	d=(dt.getDate()<10)?("0"+dt.getDate()):dt.getDate()
			   	res= d + scope.idioma.Notificaciones[5]+scope.idioma.Meses[dt.getMonth()+1];
			   	if(dt.getFullYear() != (new Date(f2)).getFullYear())res=res+scope.idioma.Notificaciones[5]+dt.getFullYear();
			   	res=res+" "+scope.idioma.Notificaciones[24]+" "+input.Hora;
		   		return res;
		   }
	   }
	}
})

.filter('ajustesTime', function () {
	return function (input) {
	   if(input){
		  /*if(input<60)return input+" min.";
		  else if(input<120){
			  var hr= Math.floor(input/60)
			  var mins=Math.floor(input%60)
			  return input hr
		  }
		  else return intput */
		  return input+" min.";
	   }
	}
})
.filter('FHReporte', function () {
	return function (input,scope) {
	   if(input){
		   var f1=parseInt(input.Fecha)*1000
		   var f2=new Date();
		   f2=f2.getTime();
		   var val=Math.floor((f2-f1)/60000)
		   if(val==0){
			   return scope.idioma.Reportes[15]; 
		   }else if(val<60){
			   return scope.idioma.Reportes[9]+val+scope.idioma.Reportes[10]
		   }else {
			   var d=Math.floor(val/60);
			   return scope.idioma.Reportes[9]+d+scope.idioma.Reportes[11]
		   }
	   }
	}
})
.filter('FHReportar', function () {
	return function (input,scope) {
	   if(input){
		   var f1=input.getTime();
		   var f2=new Date();
		   f2=f2.getTime();
		   var val=Math.floor((f2-f1)/60000)
		   console.log(val);
		   if(val==0){
			   return scope.idioma.Reportes[15]; 
		   }else if(val<60){
			   return scope.idioma.Reportes[9]+val+scope.idioma.Reportes[10]
		   }else {
			   var d=Math.floor(val/60);
			   return scope.idioma.Reportes[9]+d+scope.idioma.Reportes[11]
		   }
	   }
	}
})

.filter('diasSP', function () {
	return function (input) {
		if(input.FechaPromocion){
		var d=new Date();
		var d2=new Date(input.FechaPromocion);
		d2.setDate(d2.getDate()+input.Duracion);
		
		return Math.ceil((d2.getTime()-d.getTime())/(1000*60*60*24));
		}
	}
})
.filter('diasSG', function () {
	return function (input) {
		var d=new Date();
		var d2=new Date(input);
		d2.setDate(d2.getDate()+30);
		
		return Math.ceil((d2.getTime()-d.getTime())/(1000*60*60*24));
	}
})
.filter('StaticMap', function () {
	return function (input) {
	   if(input){
		   
		   return "https://maps.googleapis.com/maps/api/staticmap?center="+input.Latitud+","+input.Longitud+"&zoom=16&size=640x640&scale=2&format=png&maptype=roadmap&language=es&markers=icon:http://www."+input.Icono+"%7C"+input.Latitud+","+input.Longitud+"&key=AIzaSyCmZHupxphffFq38UTwBiVB-dbAZ736hLs";
	   }
	}
})

.filter('tituloReporte', function () {
	return function (input,scope) {
		if(input){
			return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[1]+scope.idioma.Estados[input.Estado]
		}
	}
})
.filter('subtituloReporte', function () {
	return function (input,scope) {
	   if(input){
		   var palabras=scope.idioma.Palabras
		   var direc=[]
		   if((""+input.Calles).trim()!="")direc.push(input.Calles)
		   if((""+input.Colonia).trim()!="")direc.push(input.Colonia)
		   if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
		   if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		   var direc=direc.join(", ").toLowerCase().split(" ");
		   for(var i=0;i<direc.length;i++)
		   		if(palabras.indexOf(direc[i])<0)direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase();
			return direc.join(" ")
	   }
	}
})
.filter('tituloNotificacion', function () {
	return function (input,scope) {
		if(input){
			if(input.Tipo==1) return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[1]+scope.idioma.Estados[input.Estado]
			else if(input.Tipo==2)return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[3]+(parseInt(input.Distancia)>=1000?((parseInt(input.Distancia/1000))+" km."): (input.Distancia+" m."))+scope.idioma.Notificaciones[4];
			else if(input.Tipo==3)return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[3]+(parseInt(input.Distancia)>=1000?((parseInt(input.Distancia/1000))+" km."): (input.Distancia+" m."))+scope.idioma.Notificaciones[5]+input.Persona
			else if(input.Tipo==4)return scope.idioma.Asuntos[input.Asunto]+scope.idioma.Notificaciones[3]+(parseInt(input.Distancia)>=1000?((parseInt(input.Distancia/1000))+" km."): (input.Distancia+" m."))+scope.idioma.Notificaciones[6]
			else if(input.Tipo==5 || input.Tipo==6)return scope.idioma.Notificaciones[7];
			else if(input.Tipo==7) return scope.idioma.Notificaciones[8];
			else if(input.Tipo==8) return scope.idioma.Notificaciones[9];
			else if(input.Tipo==9)return scope.idioma.Notificaciones[10];
	   }
	}
})

.filter('subtituloNotificacion', function () {
	return function (input,scope) {
	   if(input){
			if(input.Tipo<5){
				var palabras=scope.idioma.Palabras
				var direc=[]
				if((""+input.Calles).trim()!="")direc.push(input.Calles)
				if((""+input.Colonia).trim()!="")direc.push(input.Colonia)
				if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
				if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
				var direc=direc.join(", ").toLowerCase().split(" ");
				for(var i=0;i<direc.length;i++)
					if(palabras.indexOf(direc[i])<0)direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase();
				return direc.join(" ")
			}
			else if(input.Tipo==5)return input.Persona+scope.idioma.Notificaciones[11];
			else if(input.Tipo==6)return input.Persona+scope.idioma.Notificaciones[12];
			else if(input.Tipo==7) return input.Persona+scope.idioma.Notificaciones[13];
			else if(input.Tipo==8) return scope.idioma.Notificaciones[14];
			else if(input.Tipo==9)return input.Persona+scope.idioma.Notificaciones[15];
	   }
	}
})
.filter('notificaciones', function () {
	return function (input) {
	   if(input){
		   var d=[];
		   for(var i=0;i<input.length;i++)
		   if(!_.isUndefined(input[i].Evento))d.push(input[i]);	
		   console.log(d);  
			return d;
	   }
	}
})
.filter('contactoEstatus', function () {
	return function (input,scope) {
	   if(input){
		   if(input.Estatus==1)return  scope.idioma.Contactos[8];
		   else{
			   if(input.Tipo==1)return scope.idioma.Contactos[9];
			   else return scope.idioma.Contactos[10]
		   }
	   }
	}
})
.filter("duracion",function(){
	return function(t){
		var sec_num = parseInt(t, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    
		return time;
	}
})
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
}
})
.filter('subtituloInfo', function () {
return function (input,scope) {
   if(input){
	   	var direc=[]
		if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
		if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		var direc=direc.join(", ").split(" ");
		for(var i=0;i<direc.length;i++)
			direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase()
		return direc.join(" ")
   }else return "";
}
})
.filter('direccion', function () {
return function (input,scope) {
   if(input){
		var palabras=scope.idioma.Palabras		
	   	var direc=[]
		if((""+input.Calles).trim()!="")direc.push(input.Calles)
		if((""+input.Colonia).trim()!="")direc.push(input.Colonia)
		if((""+input.Municipio).trim()!="")direc.push(input.Municipio)
		if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		var direc=direc.join(", ").toLowerCase().split(" ");
		for(var i=0;i<direc.length;i++)
			if(palabras.indexOf(direc[i])<0)direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase();
		return direc.join(" ")
   }else return "";
}
})
.filter('fechaInfo', function () {
	return function (input,scope) {
	   if(input && input.Fecha && input.Hora){
		    var hm=input.Hora.split(":");
		   var x=new Date((parseInt(input.Fecha)*1000)+(parseInt(hm[0])*60*60000)+(parseInt(hm[1])*60000))
		   return ((x.getDate()<10)?"0":"")+x.getDate()+" de "+scope.idioma.Meses[parseInt(x.getMonth()+1)]+" de "+x.getFullYear();
	   }
	}
})
.filter('horaInfo', function () {
	return function (input,scope) {
	   if(input && input.Hora){
		   var hm=input.Hora.split(":");
		   var f1=new Date((parseInt(input.Fecha)*1000)+(parseInt(hm[0])*60*60000)+(parseInt(hm[1])*60000))
		   var hora=f1.getHours();
		   var pos=" a.m."
		   if(hora>12){
			   pos=" p.m."
			   hora-=12;
		   }
		   hora=hora<10?"0"+hora:hora
		   var minutos=(f1.getMinutes()<10?"0":"")+f1.getMinutes()
		   return hora+":"+minutos+pos
	   }
	}
})
.filter('horaInfoCentro', function () {
	return function (input,scope) {
	   if(input && input.Hora){
		   var hm=input.Hora.split(":");
		   var f1=new Date((parseInt(input.Fecha)*1000)+(parseInt(hm[0])*60*60000)+(parseInt(hm[1])*60000))
		   f1.setMinutes(f1.getMinutes()+f1.getTimezoneOffset()-360)
		   var hora=f1.getHours();
		   var pos=" a.m."
		   if(hora>12){
			   pos=" p.m."
			   hora-=12;
		   }
		   hora=hora<10?"0"+hora:hora
		   var minutos=(f1.getMinutes()<10?"0":"")+f1.getMinutes()
		   return hora+":"+minutos+pos
	   }
	}
})
.filter('escalaV', function () {
	return function (input) {
	   if(input){
		   if(!input.Prom)input.Prom=0;
		   var escala=(input.Val*5)/input.Prom;
		   if(escala>10)escala=10;
		   if(escala<0) escala=0;
		   return (escala).toFixed(1);
	   }
	}
})
.filter('escalaVColor', function () {
	return function (input,bg) {
	   if(input){
		   if(!input.Prom)input.Prom=0;
		   var escala=(input.Val*5)/input.Prom;
		   if(escala>10)escala=10;
		   if(escala<0) escala=0;
		   if(escala<3.3)return "#059DB5";
		   else if(escala>6.6)return "#BD1614";
		   else return "#FDBE16; "+(bg?"color:#242424;":"");
		   return (escala).toFixed(1);
	   }
	}
})
.filter('fechaFiltros', function () {
	return function (input,scope,id) {
	   if(input){
		   var f=new Date();
		   switch(id){
			   case 1:
			   		if(input.tipo)f.setDate(f.getDate()-input.periodo)
					else f=input.fechaInicial
			   break;
			   case 2:
			   		if(!input.tipo)f=input.fechaFinal
			   break;
		   }
		   var d=f.getDate()
		   return (d<10?"0"+d:d)+" - "+scope.idioma.Meses[parseInt(f.getMonth()+1)].substring(0,3)+" - "+f.getFullYear();
	   }
	}
})
.filter('FstMayus', function () {
	return function (input) {
	   if(input){
		  return input.substr(0,1).toUpperCase()+input.substr(1).toLowerCase()
	   }
	}
})