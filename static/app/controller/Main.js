var tapStatus = 'normal';
var currentBuildTileIconName = '';

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
		touch.on($(CANVASID),'drag dragstart dragend',panelDrag);
		var ctx = $(CANVASID).getContext('2d');
		
		addEntityNode(new EntityNode('tmp',NodeTypeClass.entityitem,[['image 282','image 283']],200,50,50,200));
		
		addPool(
			new IconNodeGroup('tmptest',2,50,60,260,'green','blue',
			[
				new IconNode('temp1','image 400',2,55,50,50,'red','blue',function(name){
					console.log(this.iconname);
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp2','image 694',2,110,50,50,'red','blue',function(name){
					console.log(this.name);
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp3','image 692',2,165,50,50,'red','blue',function(name){
					console.log(this.name);
					currentBuildTileIconName = this.iconname;
					groupBack();
				})
			],false
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
			drawRhombusMap(ctx,screenTiles,'blue','red');
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
		zeroX++;
		zeroY++;
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
var dragzerox = 0;
var dragzeroy = 0;
function panelDrag(ev){
	//debugger;
	//console.log(ev.type);
	//console.log(ev.position.x);
	
	if(ev.type == 'dragstart'){
		dragzerox = ev.position.x -zeroX;
		dragzeroy = ev.position.y -zeroY;
		console.log('%d:%d',dragzerox,dragzerox);
	}
	if(ev.type == 'drag'){
		//var dX = (dragzerox -ev.position.x);
		//var dY = (dragzeroy -ev.position.y);
		zeroX = ev.position.x-dragzerox;
		zeroY = ev.position.y-dragzerox;
	}
	
	if(ev.type == 'dragend'){
		//dragzerox = ev.position.x;
		//dragzeroy = ev.position.y;
	}
}

function panelTap(ev){
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
	
	if(tapStatus == 'buildtile'){
		var obj = getCloseTile(tapx,tapy);
		var posobj = getPixelByPos(obj[0],obj[1]);
		var x = posobj.xpix -baseRhombusHeight;
		var y = posobj.ypix -baseRhombusHeight/2;
		addEntityNode(new EntityNode('tile',NodeTypeClass.tile,[[currentBuildTileIconName]],x,y,50,200));
	}
}

function groupBack(){
	var group = getTypNode('tmptest',NodeTypeClass.icongroup);
	group.swipe(Direct.left);
	tapStatus = 'buildtile';
	addPool(new IconNode('cancle','image 2997',100,5,50,50,'white','blue',function(name){
			console.log(this.name);
			this.deleteSelf();
			tapStatus = 'normal';
		}));
}


