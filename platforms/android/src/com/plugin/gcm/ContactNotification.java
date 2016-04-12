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

public class ContactNotification implements Notificacion {
	private String Title;
	private String Body;
	private int Id;
	private int Type;
	private int Asunto;
	private int Estado;
	private int Distancia;
	private String Contacto;
	
	public void create(Bundle extras) {
		// TODO Auto-generated method stub
		Asunto=Integer.parseInt(extras.getString("Asunto"));
		Estado=Integer.parseInt(extras.getString("Estado"));
		Body=extras.getString("Direccion");
		Type=Integer.parseInt(extras.getString("Tipo"));
		Id=Integer.parseInt(extras.getString("IdNotificacion"));
		Distancia=Integer.parseInt(extras.getString("Distancia"));
		Contacto=extras.getString("Contacto");
	}
	
	public String getTitle() {
		// TODO Auto-generated method stub
		Dictionary d= new Dictionary();
		if(Distancia<1000)return d.getAsunto(Asunto)+" a "+Distancia+"m. de "+Contacto;
		else {
			double x=(double)Distancia/1000;
			return d.getAsunto(Asunto)+" a "+String.format("%.1f",x)+"km. de "+Contacto;
		}
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
		int bgId=context.getResources().getIdentifier("bg_red", "drawable", context.getPackageName());
		Bitmap background = BitmapFactory.decodeResource(context.getResources(), bgId);
		return background;
	}

	@Override
	public Bitmap getLargeIcon(int cant) {
		Context context=NotificationStack.gcm;
		int bgId=context.getResources().getIdentifier("icon_white_contacto", "drawable", context.getPackageName());
		if(android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP)
			bgId=context.getResources().getIdentifier("alertacontacto", "drawable", context.getPackageName());
		return BitmapFactory.decodeResource(context.getResources(), bgId);
	}

	@Override
	public int getSmallIcon(int size) {
		// TODO Auto-generated method stub
		Context context=NotificationStack.gcm;
		return context.getResources().getIdentifier("icon_white_contacto", "drawable", context.getPackageName());
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
		// TODO Auto-generated method stub
		return false;
	}
	@Override
	public String getSound() {
		// TODO Auto-generated method stub
		return "Alerta";
	}
}
