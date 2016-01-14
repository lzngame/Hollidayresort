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
			btntest:'#btn_test',
			btntest2:'#btn_test1',
			btntest3:'#btn_test2',
		},
		control:{
			mainview:{
				activate:'onmainActivate',
				deactivate:'onmainDeactivate',
			},
			btnlogin:{
				tap:'on_btnlogin_tap',
			},
			btntest:{
				tap:'on_btntest_tap'
			},
			btntest2:{
				tap:'on_btntest2_tap'
			},
			btntest3:{
				tap:'on_btntest3_tap'
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
		
		addEntityNode(new EntityNode('tmp',[['image 282','image 283']],200,50,50,200));
		
		addPool(
			new IconNodeGroup('tmptest',2,50,60,260,'green','blue',
			[
				new IconNode('temp1','image 3923',2,55,50,50,'red','blue',function(name){
					console.log(this.name);
				}),
				new IconNode('temp2','image 3923',2,110,50,50,'red','blue',function(name){
					console.log(this.name);
				}),
				new IconNode('temp3','image 3923',2,165,50,50,'red','blue',function(name){
					console.log(this.name);
				})
			]
		));
		
		addPool(new IconNode('temp222','image 690',2,100,50,50,'white','blue',function(name){
			console.log(this.name);
			var group = getTypNode('tmptest',NodeTypeClass.icongroup);
			if(!group.swipingLeft && !group.swipingRight){
				if(group.x <= group.initx)
					group.swipe(Direct.right);
				else
					group.swipe(Direct.left);
			}else if(group.swipingLeft){
				group.swipe(Direct.right);
			}else{
				group.swipe(Direct.left);
			}
			
		}));
		//addPool(new ShapeNode('test',NodeTypeClass.bg,'blue','red',100,100,{w:100,h:120}));
		//addBgPool(new ShapeNode('temp',NodeTypeClass.roundrect,'white','green',30,200,{w:100,h:120,r:10}));
		//addBgPool(new ShapeNode('temp2',NodeTypeClass.roundrect,'white','green',130,200,{w:100,h:100,r:50}));
		
		initUpdate(1,function(){
			ctx.clearRect(0,0,stageWidth,stageHeight);
			drawRhombusMap(ctx,4,'blue','red');
			updateDraw(ctx)
		},15);
		
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
	on_btntest_tap:function(thisself,e,eopts){
		console.log('btntest tap');
		var group = getTypNode('tmptest',NodeTypeClass.icongroup);
		//group.setPos(90,90);
		//group.swiperight();
		group.disable = true;
	},
	on_btntest2_tap:function(thisself,e,eopts){
		console.log('btntest2 tap');
		var group = getTypNode('tmptest',NodeTypeClass.icongroup);
		group.swipe(Direct.right);
	},
	on_btntest3_tap:function(thisself,e,eopts){
		console.log('btntest3 tap');
		var group = getTypNode('tmptest',NodeTypeClass.icongroup);
		group.swipe(Direct.left);
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
	var tapx = ev.position.x;
	var tapy = ev.position.y;
	for(var name in iconPool){
		var itemnode = iconPool[name];
		if(itemnode.checkTap(tapx,tapy)){
			itemnode.handler();
			return;
		}
	}
	
	for(var name in groupPool){
		var itemnode = groupPool[name];
		if(itemnode.checkTap(tapx,tapy)){
			if(!itemnode.disable && !itemnode.isswiping){
				for(var i=0;i<itemnode.icons.length;i++){
					var iconnode = itemnode.icons[i];
					if(iconnode.checkTap(tapx,tapy)){
						iconnode.handler();
						return;
					}
				}
			}
			return;
		}
	}
	var obj = getCloseTile(tapx,tapy);
}


