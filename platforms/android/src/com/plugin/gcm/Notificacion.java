package com.plugin.gcm;

import java.util.List;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat.InboxStyle;

public interface Notificacion {
	
	void create(Bundle extras);
	String getTitle();
	String getBody();
	int getId();
	int getType();
	String getIcon();
	String getTicker();
	Bitmap getBackground();
	Bitmap getLargeIcon(int cant);
	int getSmallIcon(int size);
	void getGroupContent(List<Notificacion> notificaciones, InboxStyle estilo);
	boolean isDanger();
	String getSound();
}
