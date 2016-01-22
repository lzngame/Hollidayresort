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
		LayoutUI(ctx);
		resortclock = new ResortClock('resortclock',0,stageHeight -47);
		layoutLeftIcons();
		layoutGroups();
		
		new PlantNode('test',NodeTypeClass.entityitem,[['img705','img717','img713','img709']],-9,29,true);
		new PlantNode('test',NodeTypeClass.entityitem,'img1605',-10,30,true);
		
		initUpdate(1,function(){
			ctx.clearRect(0,0,stageWidth,stageHeight);
			//
			//drawRhombusMap2(ctx,mapWTiles,mapHTiles,'blue','red');
			drawBg(ctx,'img162bmp');
			//drawTileMap(ctx,currentTileType,mapWTiles,mapHTiles);
			updateDraw(ctx);
			resortclock.update(ctx);
		},30);
		
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
	var tapx = ev.position.x-zeroX;
	var tapy = ev.position.y-zeroY;
	var sceneX = ev.position.x;
	var sceneY = ev.position.y;
	
	var objtarget = getTilePos(tapx,tapy);
	
	var node = getNodeByPos(objtarget.posx,objtarget.posy);
	
	for(var name in iconPool){
		var itemnode = iconPool[name];
		if(itemnode.checkTap(sceneX,sceneY)){
			itemnode.handler(itemnode.tapdata);
			return;
		}
	}
	
	for(var name in groupPool){
		var itemnode = groupPool[name];
		if(itemnode.isdisable && !itemnode.swipingLeft && !itemnode.swipingRight && itemnode.isvisible && itemnode.checkTap(sceneX,sceneY)){
			for(var i=0;i<itemnode.icons.length;i++){
				var iconnode = itemnode.icons[i];
				if(iconnode.checkTap(sceneX,sceneY)){
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
		var floor = new FloorNode('lawn',currentBuildfloor,objtarget.posx,objtarget.posy,function(){
			console.log(this);
		});
		/*var obj = getCloseTile(tapx-zeroX,tapy-zeroY);
		var posobj = getPixelByPos(obj[0],obj[1]);
		var x = posobj.xpix -baseRhombusHeight;
		var y = posobj.ypix -baseRhombusHeight/2;
		addEntityNode(new EntityNode('tile',NodeTypeClass.tile,[[currentBuildTileIconName]],x,y,50,200));*/
	}
	if(currentHandleStatus == handleStatus.plant){
		//if(getNodeByPos(objtarget.posx,objtarget.posy))
		new PlantNode('test',NodeTypeClass.entityitem,currentBuildType,objtarget.posx,objtarget.posy,false);
	}
}

function LayoutUI(ctx){
	addPool(new IconNode('Head','img300',0,0,layoutconfig.headsize,layoutconfig.headsize,layoutconfig.headbgclr,layoutconfig.headborderclr,function(name){
					console.log(this.iconname);
					layoutBgPool['lvstar'].setLv(Math.round(Math.random()*10));
					layoutBgPool['numnode'].setTxt(Math.floor(Math.random()*10000).toString());
		},layoutconfig.headborderclr));
	var imgbg   = new ImageNode('moneybg','img3697',layoutconfig.headsize+1,1,stageWidth-layoutconfig.headsize,22);
	var imgnode = new ImageNode('moneyicon','img302',layoutconfig.headsize+3,5,layoutconfig.moneyiconsize,layoutconfig.moneyiconsize);
	var numnode = new PngNumNode('numnode','0.1+2--3:456789',layoutconfig.headsize+layoutconfig.moneyiconsize+5,5);
	var lvstar = new LvNode('lvstar','img3252',layoutconfig.headsize+layoutconfig.moneyiconsize+5+100,5,1,layoutconfig.lvstarsize);
	
		
	addPool(new IconInfoNode('btn1',stageWidth-64,23,64,22,'img3044','f18_18','f54_54',120,function(name){
					console.log(this.iconname);
		},'yellow'));
	addPool(new IconInfoNode('btn2',stageWidth-2*64,23,64,22,'img3044','f18_18','f54_54',50,function(name){
					console.log(this.iconname);
					new ShowInfoNode('tmpshowinf',100,100,100,150);
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
	var bottomRightWidth = (stageWidth - bottomsize.rilisize -47)/4;
	for(var i=0;i<4;i++){
		addPool(new ImgNode('bottom'+i.toString(),'img3516',bottomsize.rilisize+47+i*bottomRightWidth,stageHeight-40,bottomRightWidth-2,38));
	}
	
	layourHandleInfo();
}
var activeLeftIconnode = null;

function layoutBottomTxtinfo(){
	new ImageNode('txtbg','img3358bmp',47,stageHeight-70,stageWidth-47,30);
	txtinfo = new TxtNode('welcome','欢迎来到度假村世界游戏！','img3195','#676767',55,stageHeight-67,stageWidth - 47);
}

var stopHandleBtn = null;
function layourHandleInfo(){
	stopHandleBtn =  new StopHandleMenu('test',stageWidth-188,stageHeight-112-40);
	stopHandleBtn.hide();
}


function layoutLeftIcons(ctx){
	var space = 4;
	var inity = 5;
	var bg_lefticons   = new ShapeRoundrect('lefticonsbg',colors.lefticonsbg,'blue',1,layoutconfig.headsize+1,iconSize.lefticon+4,315,4);
	var dis = 0;
	for(var name in lefticonInfos){
		var obj = lefticonInfos[name];
		var iconnode = new IconNode(obj.name,obj.url,3,(iconSize.lefticon+space)*dis+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,colors.lefticonactive,function(name){
			console.log(this.name);
			stopHandleBtn.hide();
			this.active = !this.active;
			var group = getTypeNode(this.groupname,NodeTypeClass.icongroup);
			group.changeswipe();
			if(this.active){
				if(activeLeftIconnode != null){
					groupPool[activeLeftIconnode.groupname].swipe(Direct.left);
					activeLeftIconnode.active = false;
				}
				activeLeftIconnode = this;
			}else{
				activeLeftIconnode = null;
			}
		},colors.lefticonborder);
		
		iconnode.groupname = obj.groupname;
		addPool(iconnode);
		dis++;
	}
}

function layoutGroups(){
	var space = 44;
	
	var nodearray = [];
	var i = 0;
	for(var name in floorInfos){
		var obj = floorInfos[name];
		var floor = new IconNode(obj.iconnodename,obj.url,2,i*space+55,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentTileType = this.floortype;
			groupBack(this.groupname,lefticonInfos.floor.name);
		});
		floor.txtdata.push(obj.name+"  $:"+obj.price.toString());
		floor.txtdata.push(obj.note);
		floor.floortype = obj.floortype;
		floor.groupname = obj.groupname;
		nodearray.push(floor);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.floor.groupname,2,50,200,190,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
	
	nodearray = [];
	i = 0;
	for(var name in plantInfos){
		var obj = plantInfos[name];
		var plant = new IconNode(obj.iconnodename,obj.url,2,i*space+55,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.plant;
			var data = plantInfos[this.dataname];
			currentBuildType = data.tileurl;
			currentBuildData = data;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.plant.name);
		});
		plant.txtdata.push(obj.name+"  $:"+obj.price.toString());
		plant.txtdata.push(obj.note);
		plant.groupname = obj.groupname;
		plant.dataname = name;
		nodearray.push(plant);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.plant.groupname,2,50,200,354,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
	
	nodearray = [];
	i = 0;
	for(var name in houseInfos){
		var obj = houseInfos[name];
		var house = new IconNode(obj.iconnodename,obj.url,2,i*space+135,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.tile;
			currentBuildTileIconName = this.iconname;
			groupBack(this.groupname,lefticonInfos.house.name);
		});
		house.txtdata.push(obj.name+"  $:"+obj.price.toString());
		house.txtdata.push(obj.note);
		house.groupname = obj.groupname;
		nodearray.push(house);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.house.groupname,2,130,200,90,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
	
	nodearray = [];
	i = 0;
	for(var name in carpetInfos){
		var obj = carpetInfos[name];
		var carpet = new IconNode(obj.iconnodename,obj.url,2,i*space+150,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.tile;
			var data = carpetInfos[this.dataname];
			currentBuildfloor = data.tileurl;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.carpet.name);
		});
		carpet.txtdata.push(obj.name+"  $:"+obj.price.toString());
		carpet.txtdata.push(obj.note);
		carpet.groupname = obj.groupname;
		carpet.dataname = name;
		nodearray.push(carpet);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.carpet.groupname,2,145,200,90,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
	
	nodearray = [];
	i = 0;
	for(var name in lawnInfos){
		var obj = lawnInfos[name];
		var x = Math.floor(i/5)*90 +2;
		var y = (i % 5)*space + 155;
		var lawn = new IconNode(obj.iconnodename,obj.url,x,y,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.tile;
			var data = lawnInfos[this.dataname];
			currentBuildfloor = data.tileurl;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.lawn.name);
		});
		lawn.txtdata.push(obj.name);
		lawn.txtdata.push("$:"+obj.price.toString());
		lawn.groupname = obj.groupname;
		lawn.dataname = name;
		nodearray.push(lawn);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.lawn.groupname,2,148,200,220,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
	
	nodearray = [];
	i = 0;
	for(var name in restaurantInfos){
		var obj = restaurantInfos[name];
		var x = Math.floor(i/7)*90 +2;
		var y = (i % 7)*space + 55;
		var room = new IconNode(obj.iconnodename,obj.url,x,y,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.tile;
			currentBuildTileIconName = this.iconname;
			groupBack(this.groupname,lefticonInfos.restaurant.name);
		});
		room.txtdata.push(obj.name);
		room.txtdata.push("$:"+obj.price.toString());
		room.groupname = obj.groupname;
		nodearray.push(room);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.restaurant.groupname,2,50,230,310,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
}

function groupBack(icongroupname,parentname){
	var group = getTypeNode(icongroupname,NodeTypeClass.icongroup);
	group.changeswipe();
	var parentIcon = iconPool[parentname];
	parentIcon.active = false;
	activeLeftIconnode = null;
}


