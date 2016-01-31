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
		//addEntityNode(new EntityNode('tmp',NodeTypeClass.entityitem,[['img432','img434','img436','img438']],110,210,30));
		var obj = getPixelByPos(7,4);
		var xpix = obj.xpix;
		var ypix = obj.ypix+baseRhombusHeight/2;
		LayoutUI(ctx);
		resortclock = new ResortClock('resortclock',0,stageHeight -47);
		layoutLeftIcons();
		layoutGroups();
		
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
	
	setEdage();
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
		var tapx = ev.position.x-zeroX;
		var tapy = ev.position.y-zeroY;
		var sceneX = ev.position.x;
		var sceneY = ev.position.y;
		var obj = getTilePos(tapx,tapy);
		var x =0;
		var y =0;
		var posx = 0;
		var posy = 0;
		var roundAr = null;
		var dataobj = null;
 		if (ev.type == 'dragstart') {
			tmpnode = new BuildNode('tmpnode',NodeTypeClass.build,currentBuildType,0,0,0);
			tmpnode.data = currentBuildData;
			tmpnode.setPos(x,y);
			canbuild = true;
		}
		if (ev.type == 'drag') {
			dataobj = getOffsetXY(currentBuildData.floorarea,obj.posx,obj.posy);
			console.log('find %d:%d',dataobj.posx,dataobj.posy);
			for(var i=0;i<dataobj.roundAr.length;i++){
				var ar = dataobj.roundAr[i];
				if(GetPosInBuild(ar[0],ar[1]) != null){
					console.log('不能建造');
					canbuild = false;
					break;
				}
			}
			tmpnode.setPos(dataobj.x,dataobj.y);
			console.log(tmpnode.getDrawData());
			console.log('----------------');
		}
		if (ev.type == 'dragend') {
			delete entitys[tmpnode.id];
			tmpnode = null;
			var canbuild = true;
			dataobj = getOffsetXY(currentBuildData.floorarea,obj.posx,obj.posy);
			console.log('buildend:%d:%d',dataobj.posx,dataobj.posy);
			
			for(var i=0;i<dataobj.roundAr.length;i++){
				var ar = dataobj.roundAr[i];
				if(GetPosInBuild(ar[0],ar[1]) != null){
					console.log('建筑区域内有建筑物，不能建造');
					new ToastInfo('waringbuild',warntext.build_inarea,-130,100,500);
					canbuild = false;
					break;
				}
			}
			if(canbuild){
				
				var o = dataobj.roundAr[0]
				var xpos = o[0];
				var ypos = o[1];
				var obj = getPixByPosTile(xpos,ypos);
				var xpix = obj[0];
				var ypix = obj[1]+baseRhombusHeight/2;
				addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img259','img261','img263','img265','img267','img269']],xpix,ypix,1230,true,function(data){
					var build = new BuildNode('house1',NodeTypeClass.build,currentBuildType,dataobj.x,dataobj.y,dataobj.roundAr,dataobj.posx,dataobj.posy);
					build.data = currentBuildData;
					addWaiter(currentBuildData.housetype,build);
				},{xp:x,yp:y,ar:dataobj.roundAr}));
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
	
	if (currentHandleStatus == handleStatus.normal)  {
		var tapx = ev.position.x;
		var tapy = ev.position.y;
		var obj = getCloseTile(tapx - zeroX, tapy - zeroY);
		var item = GetPosInBuild(obj[0],obj[1]);
		if(item != null)
		   console.log('find:%d-%s',item.id,item.name);
		
		
		currentHandleNode = getBuildNodeByPos(objtarget.posx,objtarget.posy);
		if(currentHandleNode)
			console.log('id:%d ~ posx:%d  posy:%d',currentHandleNode.id,currentHandleNode.posx,currentHandleNode.posy);
		if(currentHandleNode != null){
			if(currentHandleNode.ntype == NodeTypeClass.build){
				handleInfoMenu.hide(true);
 				handleInfoMenu.show(currentHandleNode.data);
				var obj = getPixByPosTile(currentHandleNode.floorspace[0][0],currentHandleNode.floorspace[0][1]);
				var x = obj[0];
				var y = obj[1];
				if(currentHandleNode.data.floorarea == 1){
					nowHandleNodeSingle = new EntityNode('tmp1',NodeTypeClass.entityitem,[['img382','img384','img386']],x-baseRhombusHeight,y-baseRhombusHeight/2,130);
					addEntityNode(nowHandleNodeSingle);
				}
				if(currentHandleNode.data.floorarea == 4){
					nowHandleNodeFour = new EntityNode('tmp4',NodeTypeClass.entityitem,[['img374','img376','img378']],x-baseRhombusHeight,y-baseRhombusHeight,130);
					addEntityNode(nowHandleNodeFour);
				}
				if(currentHandleNode.data.floorarea == 6){
					nowHandleNodeSix = new EntityNode('tmp6',NodeTypeClass.entityitem,[['img672','img674','img676']],x-baseRhombusHeight,y-1.5*baseRhombusHeight,130);
					addEntityNode(nowHandleNodeSix);
				}
				if(currentHandleNode.data.floorarea == 9){
					nowHandleNode9 = new EntityNode('tmp9',NodeTypeClass.entityitem,[['img662','img664','img666']],x-baseRhombusHeight,y-1.5*baseRhombusHeight,130);
					addEntityNode(nowHandleNode9);
				}
				if(currentHandleNode.data.floorarea == 12){
					nowHandleNode12 = new EntityNode('tmp12',NodeTypeClass.entityitem,[['img652','img654','img656']],x-baseRhombusHeight,y-2*baseRhombusHeight,130);
					addEntityNode(nowHandleNode12);
				}
				if(currentHandleNode.data.floorarea == 16){
					nowHandleNode16 = new EntityNode('tmp16',NodeTypeClass.entityitem,[['img642','img644','img646']],x-baseRhombusHeight,y-2*baseRhombusHeight,1000,130);
					addEntityNode(nowHandleNode16);
				}
			}
		}else{
			currentHandleNode = getFloorNodeByPos(objtarget.posx,objtarget.posy);
			if(currentHandleNode != null){
				if(currentHandleNode.ntype == NodeTypeClass.floor){
					handleInfoMenu.hide(true);
					handleInfoMenu.show(currentHandleNode.data);
					var obj = getPixByPosTile(objtarget.posx,objtarget.posy);
					var x = obj[0];
					var y = obj[1];
					nowHandleNodeSingle= new EntityNode('tmp',NodeTypeClass.entityitem,[['img382','img384','img386']],x-baseRhombusHeight,y-baseRhombusHeight/2,130);
					addEntityNode(nowHandleNodeSingle);
				}
			}
		}
	}
	
	if(currentHandleStatus == handleStatus.tile){
		var floorExist =  getFloorNodeByPos(objtarget.posx,objtarget.posy);
		if(floorExist == null){
			var floor = new FloorNode('lawn',currentBuildfloor,objtarget.posx,objtarget.posy,currentBuildData);
		}else{
			delete floorpool[floorExist.id];
			var floor = new FloorNode('lawn',currentBuildfloor,objtarget.posx,objtarget.posy,currentBuildData);
		}
	}
	if(currentHandleStatus == handleStatus.plant){
		var floor = getBuildNodeByPos(objtarget.posx,objtarget.posy);
		if(floor == null || floor.ntype == NodeTypeClass.floor){
			new PlantNode('test',NodeTypeClass.build,currentBuildType,objtarget.posx,objtarget.posy,false,currentBuildData);
		}else{
			console.log('建筑区域内有建筑物，不能建造');
			new ToastInfo('waringbuild',warntext.build_inarea,-130,100,500);
		}
	}
}
var testman = null;
function LayoutUI(ctx){
	var imgbg   = new PngNode('moneybg','img3697',layoutconfig.headsize+1,1,stageWidth-layoutconfig.headsize,22);
	var imgnode = new PngNode('moneyicon','img302',layoutconfig.headsize+3,5,layoutconfig.moneyiconsize,layoutconfig.moneyiconsize);
	var numnode = new PngNumNode('numnode','0.1+2--3:456789',layoutconfig.headsize+layoutconfig.moneyiconsize+5,5);
	var lvstar = new LvNode('lvstar','img3252',layoutconfig.headsize+layoutconfig.moneyiconsize+5+100,5,1,layoutconfig.lvstarsize);
	
		
	addPool(new IconInfoNode('btn1',stageWidth-64,23,64,22,'img3044','f18_18','f54_54',120,function(name){
					console.log(this.iconname);
					testman.setDirect(Direct.left);
		},'yellow'));
	addPool(new IconInfoNode('btn2',stageWidth-2*64,23,64,22,'img3044','f18_18','f54_54',50,function(name){
					console.log(this.iconname);
					//new ShowInfoNode('tmpshowinf',100,100,100,150);
					testman.setDirect(Direct.right);
		},'yellow'));
	addPool(new IconInfoNode('btn3',stageWidth-3*64,23,64,22,'img3044','f18_18','f54_54',8,function(name){
					console.log(this.iconname);
					//Ext.Msg.alert('请先选择虫族');
					shopMenu.hide(true);
					shopMenu.addContentImg('img208',20,70,68,59);
					shopMenu.addContentTxt('扩展为20×20',122,90,'yellow');
					shopMenu.addContentTxt('需要花费 $ 25000',122,110,'yellow');
					shopMenu.addContentBtn('购买','img3044',60,206,48,20,'black',function(){
						console.log('extend map');
						mapLvWidth = 21;
						mapWTiles = 48;
						mapHTiles = 30;
						setEdage();
						shopMenu.hide(false);
					});
					shopMenu.addContentBtn('取消','img3044',160,206,48,20,'black',function(){
						shopMenu.hide(false);
					});
					//testman.setDirect(Direct.up);
		},'yellow'));
		
		
	addPool(new IconNode('Head','img300',0,0,50,50,'yellow','blue',function(name){
		console.log(this.iconname);
		testman.setDirect(Direct.down);
		layoutBgPool['lvstar'].setLv(Math.round(Math.random()*10));
		layoutBgPool['numnode'].setTxt(Math.floor(Math.random()*10000).toString());
		},'red'));
	var bottomRightWidth = (stageWidth - bottomsize.rilisize -47)/4;
	for(var i=0;i<4;i++){
		addPool(new ImgNode('bottom'+i.toString(),'img3516',bottomsize.rilisize+47+i*bottomRightWidth,stageHeight-40,bottomRightWidth-2,38));
	}
	
	layourHandleInfo();
	
	shopMenu = new WindowPanel('testwinpanel',55,100,250,300);
	shopMenu.hide(false);
	
	//testman = new ManNode('testman',[['img35','img37','img39'],['img42','img44','img46'],
	//								 ['img924'],['img932']
	//								 ],-9,30);
	//addEntityNode(testman);
}

function setEdage(){
	rightEdge = baseRhombusHeight* mapWTiles -stageWidth;
	bottomEdge = baseRhombusHeight * mapHTiles -stageHeight;
}

var activeLeftIconnode = null;

function layoutBottomTxtinfo(){
	new PngNode('txtbg','img3358bmp',47,stageHeight-70,stageWidth-47,30);
	txtinfo = new TxtNode('welcome','欢迎来到度假村世界游戏！','img3195','#676767',55,stageHeight-67,stageWidth - 47);
}


function layourHandleInfo(){
	stopHandleBtn =  new StopHandleMenu('test',stageWidth-188,stageHeight-112-40);
	stopHandleBtn.hide();
	handleInfoMenu = new HandleInfoMenu('handleInfo',stageWidth - 205,stageHeight - 130-40);
	handleInfoMenu.hide(false);
	
}


function layoutLeftIcons(ctx){
	var space = 4;
	var inity = 5;
	var bg_lefticons   = new ShapeRect('lefticonsbg',colors.lefticonsbg,'blue',1,layoutconfig.headsize+1,iconSize.lefticon+4,355,4);
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
			currentHandleStatus = handleStatus.dragingbuild;
			currentBuildData = plantInfos[this.dataname];
			currentBuildType = currentBuildData.housetype;
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
			currentHandleStatus = handleStatus.dragingbuild;
			currentBuildData = houseInfos[this.dataname];
			currentBuildType = currentBuildData.housetype;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.house.name);
		});
		house.txtdata.push(obj.name+"  $:"+obj.price.toString());
		house.txtdata.push(obj.note);
		house.groupname = obj.groupname;
		house.dataname = name;
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
			currentBuildData = data;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.carpet.name);
		});
		carpet.txtdata.push(obj.name+"  $:"+obj.price.toString());
		carpet.txtdata.push(obj.note);
		carpet.lock = true;
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
			currentBuildData = data;
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
		var x = Math.floor(i/6)*90 +2;
		var y = (i % 6)*space + 55;
		var room = new IconNode(obj.iconnodename,obj.url,x,y,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.dragingbuild;
			currentBuildData = restaurantInfos[this.dataname];
			currentBuildType = currentBuildData.housetype;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.restaurant.name);
		});
		room.txtdata.push(obj.name);
		room.txtdata.push("$:"+obj.price.toString());
		room.groupname = obj.groupname;
		room.dataname = name;
		nodearray.push(room);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.restaurant.groupname,2,50,230,270,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));

	nodearray = [];
	i = 0;
	for(var name in miniroomInfos){
		var obj = miniroomInfos[name];
		var miniroom = new IconNode(obj.iconnodename,obj.url,2,i*space+281,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.dragingbuild;
			currentBuildData = miniroomInfos[this.dataname];
			currentBuildType = currentBuildData.housetype;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.miniroom.name);
		});
		miniroom.txtdata.push(obj.name+"  $:"+obj.price.toString());
		miniroom.txtdata.push(obj.note);
		miniroom.groupname = obj.groupname;
		miniroom.dataname = name;
		nodearray.push(miniroom);
		i++
	}
	addPool(new IconNodeGroup(lefticonInfos.miniroom.groupname,2,276,200,130,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
}

function groupBack(icongroupname,parentname){
	var group = getTypeNode(icongroupname,NodeTypeClass.icongroup);
	group.changeswipe();
	var parentIcon = iconPool[parentname];
	parentIcon.active = false;
	activeLeftIconnode = null;
}

function addWaiter(buildtype,build){ 
	if(buildtype == buildTypes.bar){
		var waiter = new EntityNode('barwaiter','waiter',[['img2326','img2328']],build.x+30,build.y-5,200);
		build.waiter = waiter;
		var tesk = new EntityNode('bartesk','tesk','img2412',build.x+15,build.y+2,200);
		build.furnitiure = tesk;
	}
}


