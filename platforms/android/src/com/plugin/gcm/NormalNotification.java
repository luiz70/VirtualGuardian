package com.plugin.gcm;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.net.ssl.HttpsURLConnection;

import org.apache.http.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import com.app.virtualguardian.Dictionary;
import com.grum.geocalc.*;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.text.Html;
import android.util.Log;

public class NormalNotification implements Notificacion {
	private String Body;
	private int Id;
	private int Type;
	private int Asunto;
	private int Estado;
	private double Latitud;
	private double Longitud;
	private LocationManager locationManager;
	private double latUser;
	private double lngUser;
	
	public void create(Bundle extras) {
		// TODO Auto-generated method stub
		Asunto=Integer.parseInt(extras.getString("Asunto"));
		Estado=Integer.parseInt(extras.getString("Estado"));
		Body=extras.getString("Direccion");
		Type=Integer.parseInt(extras.getString("Tipo"));
		Id=Integer.parseInt(extras.getString("IdNotificacion"));
		Latitud=Double.parseDouble(extras.getString("Latitud"));
		Longitud=Double.parseDouble(extras.getString("Longitud"));
	}
	
	public String getTitle() {
		// TODO Auto-generated method stub
		Dictionary d= new Dictionary();
		return d.getAsunto(Asunto)+" "+d.getWord("en")+" "+d.getEstado(Estado);
	}
	
	public String getBody() {
		// TODO Auto-generated method stub
		return Body;
	}
	
	public int getId() {
		// TODO Auto-generated method stub
		return Id;
	}
	
	public int getType() {
		// TODO Auto-generated method stub
		return Type;
	}
	
	public String getIcon() {
		// TODO Auto-generated method stub
		return "icon";
	}
	
	public String getTicker() {
		// TODO Auto-generated method stub
		return "Notificación Virtual Guardian";
	}

	@Override
	public Bitmap getBackground() {
		Context context=NotificationStack.gcm;
		// TODO Auto-generated method stub bg_blue
		int bgId=context.getResources().getIdentifier("bg_blue", "drawable", context.getPackageName());
		Bitmap background = BitmapFactory.decodeResource(context.getResources(), bgId);
		return background;
	}

	@Override
	public Bitmap getLargeIcon(int cant) {
		Context context=NotificationStack.gcm;
		String name ="icon";
		if(cant==1)name="icon_"+Asunto;
		int bgId=context.getResources().getIdentifier("icon_white", "drawable", context.getPackageName());
		if(android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP)
			bgId=context.getResources().getIdentifier(name, "drawable", context.getPackageName());
		return BitmapFactory.decodeResource(context.getResources(), bgId);
	}

	@Override
	public int getSmallIcon(int size) {
		// TODO Auto-generated method stub
		Context context=NotificationStack.gcm;
		return context.getResources().getIdentifier("icon_white", "drawable", context.getPackageName());
	}

	@Override
	public void getGroupContent(List<Notificacion> notificaciones, NotificationCompat.InboxStyle estilo){
		for(int i=notificaciones.size()-1; i>=0;i--){
			estilo.addLine(Html.fromHtml(String.format("<b>"+notificaciones.get(i).getTitle()+"</b>")));
			estilo.addLine(Html.fromHtml(String.format(notificaciones.get(i).getBody())));
		}
	}

	@Override
	public boolean isDanger() {
		// TODO Auto-generated method stub //getCarroPos(context).getString("Latitud")
		SharedPreferences prefs = NotificationStack.context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE); 
		int distancia=pingGps(Latitud,Longitud);
		int distanciaAuto=pingCar();
		if(distancia<0)distancia =Integer.MAX_VALUE;
		if(distanciaAuto<0)distanciaAuto =Integer.MAX_VALUE;
		int maxPer = Integer.parseInt(prefs.getString("distanciaPersonal","3000")); 
		int maxCar = Integer.parseInt(prefs.getString("distanciaAuto","3000"));
		if(distancia<=maxPer){
			//avisaamigos
			avisaAmigos(distancia);
		}
		if(distanciaAuto<=maxCar){
			//avisaauto
			avisaAuto(distanciaAuto);
		}
		if(distancia<=maxPer || distanciaAuto<=maxCar)return true;
		return false;
	}
	public int pingCar()
	{ 
		SharedPreferences prefs = NotificationStack.context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
		boolean estacionado = Boolean.parseBoolean(prefs.getString("Estatus","false"));
		if(estacionado){
		double carlat = Double.parseDouble(prefs.getString("Latitud","0")); 
		double carlng = Double.parseDouble(prefs.getString("Longitud","0")); 
		return distancia( Latitud, Longitud, carlat, carlng);
		}else return Integer.MAX_VALUE;
	    
	}
	public int pingGps(double lat,double lon)
	{ 
		Context context=NotificationStack.gcm;
		if(lat!=0 && lon!=0){
		locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
	    // Define the criteria how to select the locatioin provider -> use
	    // default
	    Criteria criteria = new Criteria();
	    String provider = locationManager.getBestProvider(criteria, false);
	    Location location = locationManager.getLastKnownLocation(provider);

	    // Initialize the location fields
	    if (location != null) {
	      System.out.println("Provider " + provider + " has been selected.");
	      return onLocationChanged(location,lat,lon);
	      
	    } else {
	      latUser=0;
	      lngUser=0;
	      return Integer.MAX_VALUE;
	    }
		}else return Integer.MAX_VALUE;
	    
	}
	public int onLocationChanged(Location location, double lat, double lon) {
	    latUser=location.getLatitude();
	    lngUser=location.getLongitude();
	    Log.d("Debug",""+latUser+" "+lngUser);
	    Log.d("Debug",""+lat+" "+lon);
	    return distancia(latUser,lngUser, lat, lon);
	  }
	private int distancia(double la1,double lo1, double la2, double lo2)
	{
		
		Coordinate lat = new DegreeCoordinate(la1);
		Coordinate lng = new DegreeCoordinate(lo1);
		Point point = new Point(lat, lng);
		lat = new DegreeCoordinate(la2);
		lng = new DegreeCoordinate(lo2);
		Point point2 = new Point(lat, lng);
		double distancia=EarthCalc.getDistance(point2, point)/1000;
		return (int)EarthCalc.getDistance(point2, point);
	}
	private void avisaAmigos(int dist){
		SharedPreferences prefs = NotificationStack.context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
		int id = Integer.parseInt(prefs.getString("IdUsuario","0"));
		List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
	    nameValuePairs.add(new BasicNameValuePair("IdEvento", ""+Id));
	    nameValuePairs.add(new BasicNameValuePair("funcion", "NotificaAmigos"));
	    nameValuePairs.add(new BasicNameValuePair("IdUsuario", ""+id));//usuario
	    nameValuePairs.add(new BasicNameValuePair("Distancia", ""+dist));
	    post(nameValuePairs);
		
		
	}
	private void avisaAuto(int dist){
		SharedPreferences prefs = NotificationStack.context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
		int id = Integer.parseInt(prefs.getString("IdUsuario","0"));
		List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
	    nameValuePairs.add(new BasicNameValuePair("IdEvento", ""+Id));
	    nameValuePairs.add(new BasicNameValuePair("funcion", "NotificaAuto"));
	    nameValuePairs.add(new BasicNameValuePair("IdUsuario", ""+id));//usuario
	    nameValuePairs.add(new BasicNameValuePair("Distancia", ""+dist));
	    post(nameValuePairs);
		
	}
	private void post(List<NameValuePair> data) {
		Log.d("Debug","2");
		HttpClient httpclient2 = new DefaultHttpClient();
		HttpPost httppost2 = new HttpPost("https://www.virtual-guardian.com/portal/php/notificacionAndroid.php");
		
		try {
		    
			//HttpPost httppost2 = new HttpPost(address);
		    httppost2.setEntity(new UrlEncodedFormEntity(data));
		    
		    // Execute HTTP Post Request
		    HttpResponse response2 = httpclient2.execute(httppost2);
		    StatusLine statusLine = response2.getStatusLine();
		    int statusCode = statusLine.getStatusCode();
		    Log.d("Debug",""+statusCode);

		} catch (ClientProtocolException e) {
		    // TODO Auto-generated catch block
		} catch (IOException e) {
		    // TODO Auto-generated catch block
		}   
	}

	@Override
	public String getSound() {
		// TODO Auto-generated method stub
		return "Tono";
	}
	
	
}
