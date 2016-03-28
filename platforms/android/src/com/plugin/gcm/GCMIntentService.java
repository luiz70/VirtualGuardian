package com.plugin.gcm;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.android.gcm.GCMBaseIntentService;

@SuppressLint("NewApi")
public class GCMIntentService extends GCMBaseIntentService {

	private static final String TAG = "GCMIntentService";
	public static Context CONTEXT;
	private static final NotificationStack notificaciones=new NotificationStack();
	public GCMIntentService() {
		super("GCMIntentService");
	}

	@Override
	public void onRegistered(Context context, String regId) {

		Log.v(TAG, "onRegistered: "+ regId);

		JSONObject json;

		try
		{
			json = new JSONObject().put("event", "registered");
			json.put("regid", regId);

			Log.v(TAG, "onRegistered: " + json.toString());

			// Send this JSON data to the JavaScript application above EVENT should be set to the msg type
			// In this case this is the registration ID
			PushPlugin.sendJavascript( json );

		}
		catch( JSONException e)
		{
			// No message to the user is sent, JSON failed
			Log.e(TAG, "onRegistered: JSON exception");
		}
	}

	@Override
	public void onUnregistered(Context context, String regId) {
		Log.d(TAG, "onUnregistered - regId: " + regId);
	}

	@Override
	protected void onMessage(Context context, Intent intent) {
		SharedPreferences prefs = context.getSharedPreferences("com.app.virtualguardian", Context.MODE_PRIVATE);
		if(prefs.getString("Registered","").equals("1")){
			
			// Extract the payload from the message
			Bundle data = intent.getExtras();
			Bundle extras=new Bundle();
			
			
			/*for (String key : data.keySet()) {
			    Object value = data.get(key);
			    Log.d("Debug", String.format("%s %s (%s)", key,  
			        value.toString(), value.getClass().getName()));
			}
			Log.d("Debug",data.getString("Direccion"));*/
			
			if (data != null)
			{
				// if we are in the foreground, just surface the payload, else post it to the statusbar
	            if (PushPlugin.isInForeground()) {
					extras.putBoolean("foreground", true);
				}
				else {
					extras.putBoolean("foreground", false);
				}
				if(data.getString("Subtitulo") == null && Integer.parseInt(data.getString("IdNotificacion"))>0){
					int notif=notificaciones.add(data,context,this);
					if(!extras.getBoolean("foreground"))notificaciones.display(notif,extras);
					else if(notif>0)PushPlugin.sendExtras(extras);
				}else{
					String s;
					try {
						s = URLDecoder.decode(data.getString("Subtitulo"), "UTF-8");
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						s=data.getString("Subtitulo");
					}
					data.putString("Direccion",s);
					data.putString("Contacto",""+data.getString("Correo"));
					int notif=notificaciones.add(data,context,this);
					if(!extras.getBoolean("foreground"))notificaciones.display(notif,extras);
					else if(notif>0)PushPlugin.sendExtras(extras);
				}
				
	            
	        }
		}
	}

	
	
	@Override
	public void onError(Context context, String errorId) {
		Log.e(TAG, "onError - errorId: " + errorId);
	}

}
