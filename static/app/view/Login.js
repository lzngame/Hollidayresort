 Ext.define('Resort.view.Login',{
	extend:'Ext.Panel',
	xtype:'loginview',
	config:{
		id:'loginview',
		items:[
			{
				id:'loginpanel',
				xtype:'panel',
				//style:'background-color:#456789',
				style:'background:#000000 url("static/img/face.png") no-repeat center center fixed',
				height:'100%',
				width:'100%'
			},
			{
				id:'btn_play',
				xtype:'button',
				text:bigfourgame.uiconfig.btn_play_txt,
				width:'30%',
				height:50,
				top:'60%',
				left:'30%'
			}
		]
	}
});
