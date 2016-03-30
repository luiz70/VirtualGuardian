package com.plugin.gcm;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.json.JSONException;
import org.json.JSONObject;

import com.app.virtualguardian.MainActivity;
import com.app.virtualguardian.R;
import com.google.android.gcm.GCMBaseIntentService;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.text.Html;
import android.util.Log;


public class NotificationStack {
	public static final List<Notificacion> Normal=new ArrayList<Notificacion>();
	public static final List<Notificacion> Personal=new ArrayList<Notificacion>();
	public static final List<Notificacion> Contacto=new ArrayList<Notificacion>();
	public static final List<Notificacion> Auto=new ArrayList<Notificacion>();
	public static final List<Notificacion> Solicitud=new ArrayList<Notificacion>();
	public static final List<Notificacion> Aceptada=new ArrayList<Notificacion>();
	public static final List<Notificacion> Codigo=new ArrayList<Notificacion>();
	public static final List<Notificacion> Tip=new ArrayList<Notificacion>();
	public static final List<Notificacion> Familiar=new ArrayList<Notificacion>();
	public static Context context,gcm;
	  private static NotificationManagerCompat notificationManager;

	
	public  NotificationStack(){
	}
	public static boolean notificaciones(){
		if(Normal.size()>0)return true;
		if(Personal.size()>0)return true;
		if(Contacto.size()>0)return true;
		if(Auto.size()>0)return true;
		if(Solicitud.size()>0)return true;
		if(Aceptada.size()>0)return true;
		if(Codigo.size()>0)return true;
		if(Tip.size()>0)return true;
		if(Familiar.size()>0)return true;
		return false;
	}
	public static void cleanBar(){
		if(notificationManager!=null)notificationManager.cancelAll();
	}
	public static JSONObject clean(){
		JSONObject json;
		json = new JSONObject();
		try {
			int d=Normal.size()+ Personal.size()+Contacto.size()+Auto.size()+Codigo.size()+Tip.size()+Familiar.size();
			json.put("1",d );
			int x=Solicitud.size()+Aceptada.size();
			json.put("2",x);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Normal.clear();
		Personal.clear();
		Contacto.clear();
		Auto.clear();
		Solicitud.clear();
		Aceptada.clear();
		Codigo.clear();
		Tip.clear();
		Familiar.clear();
		return json;
		
	}
	public int add(Bundle data,Context context,GCMIntentService gcm){
		this.context=context;
		this.gcm=gcm;
		int tipo=Integer.parseInt(data.getString("Tipo"));
		Notificacion n;
		switch(tipo){
		case 1://normal
			n=new NormalNotification();
			n.create(data);
			if(!existe(n,Normal) && !n.isDanger()){
				Normal.add(n);
			}else return 0;		
			break;
		case 2://Personal
			n=new PersonalNotification();
			n.create(data);
			if(!existe(n,Personal)){
				Personal.add(n);
			}else return 0;	
			break;
		case 3://Contacto
			n=new ContactNotification();
			n.create(data);
			if(!existe(n,Contacto)){
				Contacto.add(n);
			}else return 0;	
			break;
		case 4://Auto
			n=new AutoNotification();
			n.create(data);
			if(!existe(n,Auto)){
				Auto.add(n);
			}else return 0;	
			break;
		case 5://Solicitud
			n=new SolicitudNotification();
			n.create(data);
			if(!existe(n,Solicitud)){
				Solicitud.add(n);
			}else return 0;
			break;
		case 6://Aceptada
			n=new AceptadaNotification();
			n.create(data);
			if(!existe(n,Aceptada)){
				Aceptada.add(n);
			}else return 0;
			break;
		case 7://Codigo
			n=new CodigoNotification();
			n.create(data);
			if(!existe(n,Codigo)){
				Codigo.add(n);
			}else return 0;
			break;
		case 8://Tip
			n=new TipNotification();
			n.create(data);
			if(!existe(n,Tip)){
				Tip.add(n);
			}else return 0;
			break;
		case 9://familiar
			n=new FamiliarNotification();
			n.create(data);
			if(!existe(n,Familiar)){
				Familiar.add(n);
			}else return 0;
			break;
		}
		return tipo;
	}
	public void display(int tipo,Bundle extras){
		switch(tipo){
		case 1://normal
				disp(Normal,extras);		
			break;
		case 2://Personal
			disp(Personal,extras);	
			break;
		case 3://Contacto
			disp(Contacto,extras);
			break;
		case 4://Auto
			disp(Auto,extras);
			break;
		case 5://Solicitud
			disp(Solicitud,extras);
			break;
		case 6://Aceptada
			disp(Aceptada,extras);
			break;
		case 7://Codigo
			disp(Codigo,extras);
			break;
		case 8://Tip
			disp(Tip,extras);
			break;
		case 9://familiar
			disp(Familiar,extras);
			break;
		default:
			break;
		}
	}
	private boolean existe(Notificacion n,List<Notificacion> notificaciones){
		for( int i=0; i<notificaciones.size();i++)
			if(notificaciones.get(i).getId()== n.getId())return true;
		return false;
		
	}
	private Bundle disp( List<Notificacion> notificaciones,Bundle extras){
		notificationManager = NotificationManagerCompat.from(gcm);
		//creacion de respuesta al click
		Intent notificationIntent = new Intent(gcm, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		//notificationIntent.putExtra("pushBundle", extras);
		PendingIntent contentIntent = PendingIntent.getActivity(gcm, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		//DEFAULTS DE LA NOTIFICACION
		int defaults = Notification.DEFAULT_ALL;			
		//PROPIEDADES WEAR
		Bitmap background = notificaciones.get(0).getBackground();
		NotificationCompat.WearableExtender wearableExtender =
		        new NotificationCompat.WearableExtender()
		        .setBackground(background);
		
		Bitmap largeIcon=notificaciones.get(0).getLargeIcon(notificaciones.size());
		int smallIcon=notificaciones.get(0).getSmallIcon(notificaciones.size());
		
		Notification summaryNotification;
		
		
		if(notificaciones.size()>1){
			Log.d("Debug","cant: "+notificaciones.size());
			NotificationCompat.InboxStyle estilo= new NotificationCompat.InboxStyle();
			notificaciones.get(0).getGroupContent(notificaciones,estilo);
			estilo.setBigContentTitle("Virtual Guardian");
			estilo.setSummaryText(""+notificaciones.size()+" New notifications");
			String pendientes="You have "+notificaciones.size()+" notifications pending";
			String ticker="Virtual Guardian Notification";
			//Uri sound = Uri.parse("android.resource://" + gcm.getPackageName() + "/" + R.raw.audio);
			if(Locale.getDefault().getLanguage().equals("es")){
				estilo.setSummaryText(""+notificaciones.size()+" Notificaciones nuevas");
				pendientes="Tienes "+notificaciones.size()+" notificaciones pendientes";
				ticker="Notificación Virtual Guardian";
				Log.d("Debug",ticker);
			}

		// Create an InboxStyle notification
		summaryNotification = new NotificationCompat.Builder(context)
				.setDefaults(defaults)
		        .setContentTitle("Virtual Guardian")
		        .setSmallIcon(smallIcon)
		        .setLargeIcon(largeIcon)
		        .setStyle(estilo)
		        .setContentText(pendientes)
		        .setGroup("group_key_emails")
		        .setGroupSummary(true)
		        .setAutoCancel(true)
		        .setContentIntent(contentIntent)
		        //.setOngoing(false)
		        .setWhen(System.currentTimeMillis())
		        .setTicker(ticker+"\n"+notificaciones.get(0).getTitle()+": "+notificaciones.get(0).getBody())
		        .extend(wearableExtender)
		        //.setSound(sound)
		        .build();
				
					
		}else{
			String ticker="Virtual Guardian Notification";
			//Uri sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.audio);
			if(Locale.getDefault().getLanguage().equals("es")){
				ticker="Notificación Virtual Guardian";
				Log.d("Debug",ticker);
			}
			summaryNotification =
					new NotificationCompat.Builder(context)
						.setDefaults(defaults)
						.setSmallIcon(notificaciones.get(0).getSmallIcon(notificaciones.size()))
						.setLargeIcon(largeIcon)
						.setAutoCancel(true)
						//.setOngoing(false)
						.setWhen(System.currentTimeMillis())
						.setContentTitle(notificaciones.get(0).getTitle())
						.setTicker(ticker+"\n"+notificaciones.get(0).getTitle()+": "+notificaciones.get(0).getBody())
						//.setSound(sound)
						.setContentText(notificaciones.get(0).getBody())
						.setContentIntent(contentIntent)
						.extend(wearableExtender)
						.build();
		}
		
		notificationManager.cancel(notificaciones.get(0).getType());
		notificationManager.notify(notificaciones.get(0).getType(), summaryNotification);
		return extras;
		
	}
	
	

}
