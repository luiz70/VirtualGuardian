if(!window.plugins.SQLitePlugin){
	window.plugins.SQLitePlugin={
		openDatabase:function(object){
			return window.openDatabase("VirtualG", "1.0", "VirtualG", 100000000)
		}
	}
}