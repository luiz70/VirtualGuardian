package com.plugin.gcm;

import java.util.List;

import com.app.virtualguardian.Dictionary;
import com.app.virtualguardian.MainActivity;
import com.app.virtualguardian.R;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.text.Html;
import android.util.Log;

public class FamiliarNotification implements Notificacion {
	private String Title;
	private String Contacto;
	private int Id;
	private int Type;
	
	public void create(Bundle extras) {
		// TODO Auto-generated method stub
		Contacto=extras.getString("Contacto");
		Type=Integer.parseInt(extras.getString("Tipo"));
		Id=Integer.parseInt(extras.getString("IdNotificacion"));
	}
	
	public String getTitle() {
		// TODO Auto-generated method stub
		Dictionary d= new Dictionary();
		return "Suscripción Familiar";
	}
	
	public String getBody() {
		// TODO Auto-generated method stub
		return Contacto+" quiere agregarte a su suscripción familiar.";
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
		int bgId=context.getResources().getIdentifier("bg_black", "drawable", context.getPackageName());
		Bitmap background = BitmapFactory.decodeResource(context.getResources(), bgId);
		return background;
	}

	@Override
	public Bitmap getLargeIcon(int cant) {
		Context context=NotificationStack.gcm;
		int bgId=context.getResources().getIdentifier("icon_white", "drawable", context.getPackageName());
		if(android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP)
			bgId=context.getResources().getIdentifier("familiar", "drawable", context.getPackageName());
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
			estilo.addLine(Html.fromHtml(String.format(notificaciones.get(i).getBody())));
		}
	}

	@Override
	public boolean isDanger() {
		// TODO Auto-generated method stub
		return false;
	}

}
