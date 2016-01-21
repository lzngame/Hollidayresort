Ext.define('Resort.view.Main',{
	extend:'Ext.Panel',
	xtype:'mainview',
	config:{
		id:'mainview',
		items:[
			{
				id:'mainpanel',
				xtype:'panel',
				styleHtmlCls:'background-image:url(/static/img/image 162.bmp)',
				height:'100%',
				width:'100%',
				html:'<div id="mainpaneldiv"></div>'
			},
			{
				id:'btn_login',
				xtype:'button',
				text:'Back',
				width:'20%',
				height:20,
				top:'40%',
				left:'80%'
			},
			/*{
				id:'btn_test',
				xtype:'button',
				text:'test1',
				width:'20%',
				height:20,
				top:'10%',
				left:'80%'
			}*/
		]
	},
	
});
