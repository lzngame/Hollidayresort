var handleStatus = {
    normal:10000,
    dragingbuild:10001,
    tile:10002
}
var currentHandleStatus = -1;
var currentBuildTileIconName = '';
var currentBuildIconName = '';
var currentBuildType = -1;
var tmpnode = null; 
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
		currentHandleStatus = handleStatus.normal;
		addEntityNode(new EntityNode('tmp',NodeTypeClass.entityitem,[['img432','img434','img436','img438']],110,10,50,30));
		
		var shape = new ShapeRoundrect('shaperoundrect','black','blue',61,1,150,26,4);
		var numnode = new PngNumNode('numnode','0123456789',85,5);
		var lvstar = new LvNode('lvstar','img3415',125,4,5,25);
		var imgnode = new ImageNode('testimgnode','img3415',61,130,25,25);
		
		addPool(new IconNode('Money','img302',62,3,20,20,'white','white',function(name){
					console.log(this.iconname);
		},'white'));
		addPool(new IconNode('Head','img3368',0,0,60,60,'yellow','blue',function(name){
					console.log(this.iconname);
					layoutBgPool['lvstar'].setLv(Math.round(Math.random()*10));
					layoutBgPool['numnode'].setTxt(Math.floor(Math.random()*10000).toString());
		},'red'));
		
		addPool(
			new IconNodeGroup('tmptest',2,50,60,335,'green','blue',
			[
				new IconNode('temp1','img400',2,55,50,50,'red','blue',function(name){
					console.log(this.iconname);
					currentHandleStatus = handleStatus.tile;
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp2','img694',2,110,50,50,'red','blue',function(name){
					console.log(this.name);
					currentHandleStatus = handleStatus.tile;
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp3','img692',2,165,50,50,'red','blue',function(name){
					console.log(this.name);
					currentHandleStatus = handleStatus.tile;
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('img766','img2200',2,220,50,50,'red','blue',function(name){
					console.log(this.name);
					currentBuildIconName = this.name;
					currentHandleStatus = handleStatus.dragingbuild;
					currentBuildType = buildTypes.houselv1;
					groupBack();
				}),
				new IconNode('img766','img3036',2,275,50,50,'red','blue',function(name){
					console.log(this.name);
					currentBuildIconName = this.name;
					currentHandleStatus = handleStatus.dragingbuild;
					currentBuildType = buildTypes.houselv2;
					groupBack();
				}),
				new IconNode('img766','img2740',2,330,50,50,'red','blue',function(name){
					console.log(this.name);
					currentBuildIconName = this.name;
					currentHandleStatus = handleStatus.dragingbuild;
					currentBuildType = buildTypes.houselv3;
					groupBack();
				})
			],false
		));
		
		addPool(new IconNode('temp222','img690',2,100,50,50,'white','blue',function(name){
			console.log(this.name);
			var group = getTypeNode('tmptest',NodeTypeClass.icongroup);
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
		addPool(new IconNode('backlogin','img3368',stageWidth - 50,355,50,50,'yellow','blue',function(name){
					console.log(this.iconname);
					Ext.Viewport.animateActiveItem(this.getMainview(),{type:'slide',direction:'left'});
					this.redirectTo('login');
		}));
		
		
		
		
		//addPool(new ShapeNode('test',NodeTypeClass.bg,'blue','red',100,100,{w:100,h:120}));
		//addBgPool(new ShapeNode('temp',NodeTypeClass.roundrect,'white','green',30,200,{w:100,h:120,r:10}));
		//addBgPool(new ShapeNode('temp2',NodeTypeClass.roundrect,'white','green',130,200,{w:100,h:100,r:50}));
		
		initUpdate(1,function(){
			ctx.clearRect(0,0,stageWidth,stageHeight);
			drawRhombusMap(ctx,mapWTiles,mapHTiles,'blue','red');
			updateDraw(ctx);
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
	
	rightEdge = baseRhombusHeight* mapWTiles -stageWidth;
	bottomEdge = baseRhombusHeight * mapHTiles -stageHeight;
	console.log('tileWidth:%s tileHeight:%s',baseRhombusWidth.toString(),baseRhombusHeight.toString())
}
var dragzerox = 0;
var dragzeroy = 0;
function panelDrag(ev) {
	if (currentHandleStatus == handleStatus.normal) {
		if (ev.type == 'dragstart') {
			dragzerox = ev.position.x - zeroX;
			dragzeroy = ev.position.y - zeroY;
		}
		if (ev.type == 'drag') {
			zeroX = ev.position.x - dragzerox;
			zeroY = ev.position.y - dragzeroy;
			if (zeroX >= 0)
				zeroX = 0;
			if (zeroY >= 0)
				zeroY = 0;

			if (zeroX <= -rightEdge)
				zeroX = -rightEdge;
			if (zeroY <= -bottomEdge)
				zeroY = -bottomEdge;
		}
		if (ev.type == 'dragend') {
			dragzerox = 0;
			dragzeroy = 0;
		}
	}else if(currentHandleStatus == handleStatus.dragingbuild){
		var tapx = ev.position.x;
		var tapy = ev.position.y;
		var obj = getCloseTile(tapx-zeroX,tapy-zeroY);
		var posobj = getPixelByPos(obj[0],obj[1]);
		
		var x = posobj.xpix -baseRhombusHeight-baseRhombusWidth;
		var y = posobj.ypix -baseRhombusHeight;
		var wsize = builddata[currentBuildType];
		for(var i in wsize){
			var size = getPngSize(i);
			if(Math.abs(size.w - baseRhombusWidth) <= 5){
				x = posobj.xpix -baseRhombusHeight;
				y = posobj.ypix -baseRhombusHeight/2;
			}
			break;
		}
		
		if (ev.type == 'dragstart') {
			tmpnode = new BuildNode('tmpnode',NodeTypeClass.build,currentBuildType,0,0,0);
			tmpnode.setPos(x,y);
			tmpnode.setDepth(y);
			addEntityNode(tmpnode);
			canbuild = true;
		}
		if (ev.type == 'drag') {
			var findx = x+15;
			var findy = y+baseRhombusHeight;
			var findObj = getCloseTile(findx,findy);
			console.log('Find:%d-%d',findObj[0],findObj[1]);
			var roundAr = getRound4ByLeftTop(findObj[0],findObj[1]);
			
			for(var i=0;i<roundAr.length;i++){
				var ar = roundAr[i];
				if(GetPosInBuild(ar[0],ar[1]) != null){
					console.log('不能建造');
					canbuild = false;
					break;
				}
			}

			tmpnode.setPos(x,y);
			tmpnode.setDepth(y);
		}
		if (ev.type == 'dragend') {
			currentHandleStatus = handleStatus.normal;	
			delete entitys[tmpnode.id];
			tmpnode = null;
			var canbuild = true;
			var findx = x+15;
			var findy = y+baseRhombusHeight;
			var findObj = getCloseTile(findx,findy);
			console.log('buildend:%d-%d',findObj[0],findObj[1]);
			var roundAr = getRound4ByLeftTop(findObj[0],findObj[1]);
			var exitAr = getExit4ByLeftTop(findObj[0],findObj[1]);
			
			for(var i=0;i<roundAr.length;i++){
				var ar = roundAr[i];
				if(GetPosInBuild(ar[0],ar[1]) != null){
					console.log('建筑区域内有建筑物，不能建造');
					canbuild = false;
					break;
				}
			}
			
			
			for(var i=0;i<exitAr.length;i++){
				canbuild = false;
				var ar = exitAr[i];
				if(GetPosInBuild(ar[0],ar[1]) == null){
					console.log('建筑区域内有通道，可以建造');
					canbuild = true;
					break;
				}
				console.log('建筑区域内没有通道，不能建造');
			}
			if(canbuild)
				addEntityNode(new BuildNode('house1',NodeTypeClass.build,currentBuildType,x,y,y,roundAr));
		}
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
	
	if (currentHandleStatus == handleStatus.normal) {
		var tapx = ev.position.x;
		var tapy = ev.position.y;
		var obj = getCloseTile(tapx - zeroX, tapy - zeroY);
		var item = GetPosInBuild(obj[0],obj[1]);
		if(item != null)
		   console.log('find:%d-%s',item.id,item.name);
	}
	
	
	if(currentHandleStatus == handleStatus.tile){
		var obj = getCloseTile(tapx-zeroX,tapy-zeroY);
		var posobj = getPixelByPos(obj[0],obj[1]);
		var x = posobj.xpix -baseRhombusHeight;
		var y = posobj.ypix -baseRhombusHeight/2;
		addEntityNode(new EntityNode('tile',NodeTypeClass.tile,[[currentBuildTileIconName]],x,y,50,200));
	}
}

function groupBack(){
	var group = getTypeNode('tmptest',NodeTypeClass.icongroup);
	group.swipe(Direct.left);
	tapStatus = 'buildtile';
	addPool(new IconNode(IconNameTxts.cancleBuildTile,'img2997',100,5,50,50,'white','blue',function(name){
			console.log(this.name);
			this.deleteSelf();
			currentHandleStatus = handleStatus.normal;
		}));
}


