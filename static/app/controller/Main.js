Ext.define('Resort.controller.Main',{
	extend:'Ext.app.Controller',
	init:function(this_initialconfig){
		console.log('main controller init');
	},
	config:{
		refs:{
			mainview:{
				selector:'mainview',
				xtype:'mainview',
				autoCreate:true
			},
			btnlogin:'#btn_login',
		},
		control:{
			mainview:{
				activate:'onmainActivate',
				deactivate:'onmainDeactivate',
			},
			btnlogin:{
				tap:'on_btnlogin_tap',
			}
		},
		routes:{
			'main':'showMainview'
		}
	},
	onmainActivate:function(newactiveitem,thisself,oldactiveitem,eopts){
		console.log('mainview activate');
		initCanvas();
		touch.on($(CANVASID),'tap',panelTap);
		var ctx = $(CANVASID).getContext('2d');
		
		addEntityNode(new EntityNode('tmp',[['image 99','image 101']],100,50,50,200));
		addPool(new IconNode('temp','image 3923',100,200,50,50,'red','blue',null));
		//addPool(new ShapeNode('test',NodeTypeClass.bg,'blue','red',100,100,{w:100,h:120}));
		//addBgPool(new ShapeNode('temp',NodeTypeClass.roundrect,'white','green',30,200,{w:100,h:120,r:10}));
		//addBgPool(new ShapeNode('temp2',NodeTypeClass.roundrect,'white','green',130,200,{w:100,h:100,r:50}));
		
		initUpdate(1,function(){
			ctx.clearRect(0,0,stageWidth,stageHeight);
			drawRhombusMap(ctx,4,'blue','red');
			updateDraw(ctx)
		},40);
		
		currentActiveIndex = 1;
	},
	onmainDeactivate:function(newactiveitem,thisself,oldactiveitem,eopts){
		console.log('mainview deactivate');
		Ext.removeNode($(CANVASID));
		currentActiveIndex = -1;
	},
	on_btnlogin_tap:function(thisself,e,eopts){
		console.log('btnlogin tap');
		Ext.Viewport.animateActiveItem(this.getMainview(),{type:'slide',direction:'left'});
		this.redirectTo('login');
	},
	showMainview:function(){
		console.log('routes-login-showMainview');
		Ext.Viewport.setActiveItem(this.getMainview());
	}
});

function initCanvas(){
	Ext.DomHelper.append('mainpaneldiv',{
			id:CANVASID,
			tag:'canvas'
		});
	var canvas = $(CANVASID);
	canvas.width = stageWidth;
	canvas.height = stageHeight;
	var ctx = canvas.getContext('2d');
	
}

function panelTap(ev){
	console.log('the event done:',ev.type);
}


