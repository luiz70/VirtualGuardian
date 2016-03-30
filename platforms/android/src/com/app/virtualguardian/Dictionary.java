package com.app.virtualguardian;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import android.util.Log;

public class Dictionary {
	public  Map<String, String> es = new HashMap<String, String>();
	public  Map<String, String> en = new HashMap<String, String>();
	public Dictionary(){
		//Asuntos español
		es.put("asunto_1", "Asalto");
		es.put("asunto_2", "Balacera");
		es.put("asunto_3", "Ejecución");
		es.put("asunto_4", "Explosión");
		es.put("asunto_5", "Hallazgo");
		es.put("asunto_6", "Movilización");
		es.put("asunto_7", "Persecución");
		es.put("asunto_8", "Bloqueo");
		es.put("asunto_9", "Robo");
		es.put("asunto_10", "Robo mercancía");
		//Estados español
		es.put("estado_1","Aguascalientes");
		es.put("estado_2","Baja California");
		es.put("estado_3","Baja California Sur");
		es.put("estado_4","Campeche");
		es.put("estado_5","Coahuila");
		es.put("estado_6","Colima");
		es.put("estado_7","Chiapas");
		es.put("estado_8","Chihuahua");
		es.put("estado_9","Distrito Federal");
		es.put("estado_10","Durango");
		es.put("estado_11","Guanajuato");
		es.put("estado_12","Guerrero");
		es.put("estado_13","Hidalgo");
		es.put("estado_14","Jalisco");
		es.put("estado_15","México");
		es.put("estado_16","Michoacán");
		es.put("estado_17","Morelos");
		es.put("estado_18","Nayarit");
		es.put("estado_19","Nuevo León");
		es.put("estado_20","Oaxaca");
		es.put("estado_21","Puebla");
		es.put("estado_22","Querétaro");
		es.put("estado_23","Quintana Roo");
		es.put("estado_24","San Luis Potosí");
		es.put("estado_25","Sinaloa");
		es.put("estado_26","Sonora");
		es.put("estado_27","Tabasco");
		es.put("estado_28","Tamaulipas");
		es.put("estado_29","Tlaxcala");
		es.put("estado_30","Veracruz");
		es.put("estado_31","Yucatán");
		es.put("estado_32","Zacatecas");
		//words
		es.put("en","en");
		
	}
	public String getAsunto(int id){
		//if(Locale.getDefault().getLanguage().equals("es"))
		return es.get("asunto_"+id);
		//else return en.get("asunto_"+id);
	}
	public String getEstado(int id){
		//if(Locale.getDefault().getLanguage().equals("es"))
		return es.get("estado_"+id);
		//else return en.get("asunto_"+id);
	}
	public String getWord(String key){
		//if(Locale.getDefault().getLanguage().equals("es"))
		return es.get(key);
		//else return en.get("asunto_"+id);
	}
}
