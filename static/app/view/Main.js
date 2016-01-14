Ext.define('Resort.view.Main',{
	extend:'Ext.Panel',
	xtype:'mainview',
	config:{
		id:'mainview',
		items:[
			{
				id:'mainpanel',
				xtype:'panel',
				style:'background-color:#aa6789',
				height:'100%',
				width:'100%',
				html:'<div id="mainpaneldiv"></div>'
			},
			{
				id:'btn_login',
				xtype:'button',
				text:bigfourgame.uiconfig.btn_login_txt,
				width:'30%',
				height:50,
				top:'50%',
				left:'30%'
			},
			{
				id:'btn_test',
				xtype:'button',
				text:'test1',
				width:'30%',
				height:20,
				top:'60%',
				left:'30%'
			},
			{
				id:'btn_test1',
				xtype:'button',
				text:'test2',
				width:'30%',
				height:20,
				top:'70%',
				left:'30%'
			},
			{
				id:'btn_test2',
				xtype:'button',
				text:'test3',
				width:'30%',
				height:20,
				top:'80%',
				left:'30%'
			}
		]
	},
	
});
