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
var resortclock = null;

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
		addEntityNode(new EntityNode('tmp',NodeTypeClass.entityitem,[['img432','img434','img436','img438']],110,210,50,30));
		

		
		var obj = getPixelByPos(7,4);
		var xpix = obj.xpix;
		var ypix = obj.ypix+baseRhombusHeight/2;
		addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img259','img261','img263','img265','img267','img269']],xpix,ypix,ypix,1230));
		//addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img196','img198','img200','img202']],150,250,50,130));
		
		//addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img417','img419','img421']],xpix,ypix,50,330));
		
		LayoutUI(ctx);
		
		resortclock = new ResortClock('resortclock',10,stageHeight -40);
		addPool(
			new IconNodeGroup('tmptest',2,50,60,335,'green','blue',
			[
				new IconNode('temp1','img3151',2,55,iconSize.lefticon,iconSize.lefticon,'red','blue',function(name){
					console.log(this.iconname);
					currentHandleStatus = handleStatus.tile;
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp2','img3154',2,110,iconSize.lefticon,iconSize.lefticon,'red','blue',function(name){
					console.log(this.name);
					currentHandleStatus = handleStatus.tile;
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp3','img3157',2,165,iconSize.lefticon,iconSize.lefticon,'red','blue',function(name){
					console.log(this.name);
					currentHandleStatus = handleStatus.tile;
					currentBuildTileIconName = this.iconname;
					groupBack();
				}),
				new IconNode('temp4','img2200',2,220,iconSize.lefticon,iconSize.lefticon,'red','blue',function(name){
					console.log(this.name);
					currentBuildIconName = this.name;
					currentHandleStatus = handleStatus.dragingbuild;
					currentBuildType = buildTypes.houselv1;
					groupBack();
				}),
				new IconNode('temp5','img3036',2,275,iconSize.lefticon,iconSize.lefticon,'red','blue',function(name){
					console.log(this.name);
					currentBuildIconName = this.name;
					currentHandleStatus = handleStatus.dragingbuild;
					currentBuildType = buildTypes.houselv2;
					groupBack();
				}),
				new IconNode('temp6','img2740',2,330,iconSize.lefticon,iconSize.lefticon,'red','blue',function(name){
					console.log(this.name);
					currentBuildIconName = this.name;
					currentHandleStatus = handleStatus.dragingbuild;
					currentBuildType = buildTypes.houselv3;
					groupBack();
				})
			],false,iconSize.lefticon+2
		));
		
		layoutLeftIcons();
		
		/*addPool(new IconNode('temp222','img452',2,100,iconSize.lefticon,iconSize.lefticon,'white','blue',function(name){
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
		}));*/
		/*addPool(new IconNode('backlogin','img3368',stageWidth - 50,355,50,50,'yellow','blue',function(name){
					console.log(this.iconname);
					Ext.Viewport.animateActiveItem(this.getMainview(),{type:'slide',direction:'left'});
					this.redirectTo('login');
		}));*/
		
		
		
		
		//addPool(new ShapeNode('test',NodeTypeClass.bg,'blue','red',100,100,{w:100,h:120}));
		//addBgPool(new ShapeNode('temp',NodeTypeClass.roundrect,'white','green',30,200,{w:100,h:120,r:10}));
		//addBgPool(new ShapeNode('temp2',NodeTypeClass.roundrect,'white','green',130,200,{w:100,h:100,r:50}));
		
		initUpdate(1,function(){
			ctx.clearRect(0,0,stageWidth,stageHeight);
			drawRhombusMap(ctx,mapWTiles,mapHTiles,'blue','red');
			updateDraw(ctx);
			resortclock.update(ctx);
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
			if(canbuild){
				//addEntityNode(new BuildNode('house1',NodeTypeClass.build,currentBuildType,x,y,y,roundAr));
				for(var i=0;i<roundAr.length-1;i++){
					var o = roundAr[i];
					var xpos = o[0];
					var ypos = o[1];
					var obj = getPixelByPos(xpos,ypos);
					var xpix = obj.xpix;
					var ypix = obj.ypix+baseRhombusHeight/2;
					addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img259','img261','img263','img265','img267','img269']],xpix,ypix,ypix,1230,true));
				}
				var o = roundAr[3]
				var xpos = o[0];
				var ypos = o[1];
				var obj = getPixelByPos(xpos,ypos);
				var xpix = obj.xpix;
				var ypix = obj.ypix+baseRhombusHeight/2;
				addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img259','img261','img263','img265','img267','img269']],xpix,ypix,ypix-baseRhombusHeight,1230,true,function(data){
					addEntityNode(new BuildNode('house1',NodeTypeClass.build,currentBuildType,x,y,y,roundAr));
				},{xp:x,yp:y,ar:roundAr}));
				
			}
				
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
		if(itemnode.isdisable && !itemnode.swipingLeft && !itemnode.swipingRight && itemnode.isvisible && itemnode.checkTap(tapx,tapy)){
			for(var i=0;i<itemnode.icons.length;i++){
				var iconnode = itemnode.icons[i];
				if(iconnode.checkTap(tapx,tapy)){
					iconnode.handler();
					return;
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

function LayoutUI(ctx){
	addPool(new IconNode('Head','img300',0,0,layoutconfig.headsize,layoutconfig.headsize,layoutconfig.headbgclr,layoutconfig.headborderclr,function(name){
					console.log(this.iconname);
					layoutBgPool['lvstar'].setLv(Math.round(Math.random()*10));
					layoutBgPool['numnode'].setTxt(Math.floor(Math.random()*10000).toString());
		},layoutconfig.headborderclr));
	//var shape = new ShapeRoundrect('shaperoundrect','black','blue',layoutconfig.headsize+1,1,100,50,4);
	//debugger;
	var imgbg   = new ImageNode('moneybg','img3697',layoutconfig.headsize+1,1,stageWidth-layoutconfig.headsize,22);
	var imgnode = new ImageNode('moneyicon','img302',layoutconfig.headsize+3,5,layoutconfig.moneyiconsize,layoutconfig.moneyiconsize);
	var numnode = new PngNumNode('numnode','0.1+2--3:456789',layoutconfig.headsize+layoutconfig.moneyiconsize+5,5);
	var lvstar = new LvNode('lvstar','img3252',layoutconfig.headsize+layoutconfig.moneyiconsize+5+100,5,1,layoutconfig.lvstarsize);
	
		
	/*addPool(new IconNode('btn1','img3044',stageWidth-150,23,50,20,'yellow','blue',function(name){
					console.log(this.iconname);
		},'yellow'));	
	addPool(new IconNode('btn2','img3044',stageWidth-100,23,50,20,'yellow','blue',function(name){
					console.log(this.iconname);
		},'yellow'));*/
	addPool(new IconInfoNode('btn1',stageWidth-64,23,64,22,'img3044','f18_18','f54_54',120,function(name){
					console.log(this.iconname);
		},'yellow'));
	addPool(new IconInfoNode('btn2',stageWidth-2*64,23,64,22,'img3044','f18_18','f54_54',50,function(name){
					console.log(this.iconname);
		},'yellow'));
	addPool(new IconInfoNode('btn3',stageWidth-3*64,23,64,22,'img3044','f18_18','f54_54',8,function(name){
					console.log(this.iconname);
					Ext.Msg.alert('请先选择虫族');
		},'yellow'));
		
		
	addPool(new IconNode('Head','img300',0,0,50,50,'yellow','blue',function(name){
		console.log(this.iconname);
		layoutBgPool['lvstar'].setLv(Math.round(Math.random()*10));
		layoutBgPool['numnode'].setTxt(Math.floor(Math.random()*10000).toString());
		},'red'));
}

function layoutLeftIcons(ctx){
	var space = 4;
	var inity = 5;
	var bg_lefticons   = new ShapeRoundrect('lefticonsbg',colors.lefticonsbg,'blue',1,layoutconfig.headsize+1,iconSize.lefticon+4,238,4);
	addPool(new IconNode('temp222','img452',2,(iconSize.lefticon+space)*0+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,colors.lefticonborder,function(name){
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
		},colors.lefticonborder));
	addPool(new IconNode('temp2212','img3160',2,(iconSize.lefticon+space)*1+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,'blue',function(name){
			console.log(this.name);
		},colors.lefticonborder));
	addPool(new IconNode('temp2213','img2196',2,(iconSize.lefticon+space)*2+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,'blue',function(name){
			console.log(this.name);
		},colors.lefticonborder));
	addPool(new IconNode('temp2214','img460',2,(iconSize.lefticon+space)*3+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,'blue',function(name){
			console.log(this.name);
		},colors.lefticonborder));
	addPool(new IconNode('temp2215','img468',2,(iconSize.lefticon+space)*4+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,'blue',function(name){
			console.log(this.name);
		},colors.lefticonborder));
	addPool(new IconNode('temp2216','img464',2,(iconSize.lefticon+space)*5+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,'blue',function(name){
			console.log(this.name);
		},colors.lefticonborder));
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


