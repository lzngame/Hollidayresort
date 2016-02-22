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
		
		addEntityNode(new EntityNode('tmp',NodeTypeClass.entityitem,[['img432','img434','img436','img438']],110,210,30));
		var obj = getPixelByPos(7,4);
		var xpix = obj.xpix;
		var ypix = obj.ypix+baseRhombusHeight/2;
		LayoutUI(ctx);
		resortclock = new ResortClock('resortclock',0,stageHeight -47);
		layoutLeftIcons();
		layoutGroups();
		
		initUpdate(1,function(){
			ctx.clearRect(0,0,stageWidth,stageHeight);
			//drawRhombusMap2(ctx,userinfo.buildarealv.xEdageTileNums,userinfo.buildarealv.yEdageTileNums,'blue','red');
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
		if(!checkCost(currentBuildData.price)){
			return;
		}
		
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
			tmpnode.isbuild = false;
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
				if(checkEdage(ar[0],ar[1])){
					console.log('超过边界，不能建造');
					new ToastInfo('waringbuild',warntext.build_outarea,-130,100,500);
					canbuild = false;
					break;
				}
			}
			if(canbuild){
				var o = dataobj.roundAr[0]
				var xpos = o[0];
				var ypos = o[1];
				var obj = getPixByPosTile(xpos,ypos);
				//var xpix = obj[0];
				//var ypix = obj[1]+baseRhombusHeight/2;
				
				
				addEntityNode(new EntityFootNode('work',NodeTypeClass.entityitem,[['img259','img261','img263','img265','img267','img269']],dataobj.x+baseRhombusHeight,dataobj.y,130,true,function(data){
					var build = new BuildNode('house1',NodeTypeClass.build,currentBuildType,dataobj.x,dataobj.y,dataobj.roundAr,dataobj.posx,dataobj.posy);
					build.data = currentBuildData;
					addWaiter(currentBuildData.housetype,build);
					buildNums++;
					userinfo.money -= currentBuildData.price;
					setUiUserdata();
				},{xp:x,yp:y,ar:dataobj.roundAr}));
			}
		}
	}
}

function addReceptioncenter(){
	currentBuildData = restaurantInfos["receptioncenter"];
	var	dataobj = getOffsetXY(currentBuildData.floorarea, 0, 0);
	receptionCenter = new BuildNode('receptionCenter',NodeTypeClass.build,buildTypes.receptioncenter,dataobj.x,dataobj.y,dataobj.roundAr,dataobj.posx,dataobj.posy);
	receptionCenter.data = currentBuildData;
	addWaiter(currentBuildData.housetype,receptionCenter);
	buildNums++;
	setReceptionPos();
};

function setReceptionPos(){
	var floorExist1 =  getFloorNodeByPos(receptionCenter.posx-1,receptionCenter.posy);
	if(floorExist1 != null)
		delete floorpool[floorExist1.id];
	var floorExist2 =  getFloorNodeByPos(receptionCenter.posx,receptionCenter.posy+4);
	if(floorExist2 != null)
		delete floorpool[floorExist2.id];
	
	var wallwidth = (userinfo.buildarealv.width+2-doorwidth)/2;
	var posx = mapInitPosx+wallwidth+(doorwidth-2);
	var posy = mapInitPosy+userinfo.buildarealv.width-3;
	receptionCenter.setPosCoor(posx,posy);
	receptionCenter.waiter.setPos(receptionCenter.x +100,receptionCenter.y + 52);
	receptionCenter.furnitiure.setPos(receptionCenter.x +79,receptionCenter.y + 28);
	receptionCenter.waiter2.setPos(receptionCenter.x +33,receptionCenter.y + 22);
	receptionCenter.furnitiure2.setPos(receptionCenter.x +5,receptionCenter.y);
	
	var tiletype = null;
	if(receptionCenter.lv == 1){
		tiletype = carpetInfos.carpet1.tileurl;
	}else if(receptionCenter.lv == 2){
		tiletype = carpetInfos.carpet2.tileurl;
	}else{
		tiletype = carpetInfos.carpet3.tileurl;
	}
	var floor = new FloorNode('lawn',tiletype,receptionCenter.posx-1,receptionCenter.posy,carpetInfos.carpet1);
	var floor = new FloorNode('lawn',tiletype,receptionCenter.posx,receptionCenter.posy+4,carpetInfos.carpet1);
};

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
					iconnode.handler(iconnode.tapdata);
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
 				handleInfoMenu.show(currentHandleNode);
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
					handleInfoMenu.show(currentHandleNode);
					groupBack();
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
		if(!checkCost(currentBuildData.price)){
			return;
		}
		else{
			userinfo.money -= currentBuildData.price;
			setUiUserdata();
		}
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
	layTopIconHead();	
	layoutBottomFourButton();
	layourHandleInfo();
	
	extendmapShopMenu = new WindowPanel('extendsmap',buttontextName.extendmap_title,55,100,250,300);
	extendmapShopMenu.hide(false);
	
	propShopMenu = new ShopPanel('shop',buttontextName.shop_title,55,30,260,400);
	propShopMenu.hide(false);
	
	
	
	
	testman = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],-9,30);
	addEntityNode(testman);
	testman.setAction(manstatus.idle);
	testman.setDirect(Direct.up);
	addReceptioncenter();
}

function layTopIconHead(){
	var imgbg   = new PngNode('moneybg','img3697',layoutconfig.headsize+1,1,stageWidth-layoutconfig.headsize,22);
	var imgnode = new PngNode('moneyicon','img302',layoutconfig.headsize+3,5,layoutconfig.moneyiconsize,layoutconfig.moneyiconsize);
	var numnode = new PngNumNode('numnode',userinfo.money,layoutconfig.headsize+layoutconfig.moneyiconsize+5,5);
	var lvstar =  new LvNode('lvstar','img3252',layoutconfig.headsize+layoutconfig.moneyiconsize+5+100,userinfo.lv,1,layoutconfig.lvstarsize);
	userExpline = new ExpLine('userexp','red','yellow','blue',layoutconfig.headsize+1,23,stageWidth-layoutconfig.headsize,5,500,1000);
	addPool(userExpline);
	/*addPool(new IconInfoNode('btn1',stageWidth-64,23,64,22,'img3044','f18_18','f54_54',120,function(name){
					console.log(this.iconname);
		},'yellow'));
	addPool(new IconInfoNode('btn2',stageWidth-2*64,23,64,22,'img3044','f18_18','f54_54',50,function(name){
					console.log(this.iconname);
					orderDraw();
					
		},'yellow'));
	addPool(new IconInfoNode('btn3',stageWidth-3*64,23,64,22,'img3044','f18_18','f54_54',8,function(name){
					console.log(this.iconname);
		},'yellow'));*/
		
		
	addPool(new IconNode('Head','img300',0,0,50,50,'yellow','blue',function(name){
		console.log(this.iconname);
		},'red'));
	
	setUiUserdata();
}

function setUiUserdata(){
	layoutBgPool['lvstar'].setLv(userinfo.lv);
	layoutBgPool['numnode'].setTxt(userinfo.money.toString());
}

function layoutBottomFourButton() {
	var bottomRightWidth = 40;
	addPool(new ImgNode('bottomSetconfig', 'img3516', bottomsize.rilisize + 47 + 0 * 40, stageHeight - 37, bottomRightWidth - 1, 38, function() {
		var nextlv = null;
		if (userinfo.buildarealv.lv == 1) {
			nextlv = extendsBuildConfig.lv2;
		} else if (userinfo.buildarealv.lv == 2) {
			nextlv = extendsBuildConfig.lv3;
		}
		if (nextlv == null) {
			new ToastInfo('mytoast', warntext.maxbuildarea, -130, 100, 1500);
		} else {
			extendmapShopMenu.hide(true);
			propShopMenu.hide(false);
			stopHandleBtn.hide();
			if(handleInfoMenu.isvisible)
				handleInfoMenu.hide(false);
			groupBack();
			extendmapShopMenu.addContentImg('img208', 20, 70, 68, 59);
			extendmapShopMenu.addContentTxt(nextlv.note, 122, 90, 'yellow');
			extendmapShopMenu.addContentTxt(nextlv.note2 + nextlv.price.toString(), 122, 110, 'yellow');
			extendmapShopMenu.addContentBtn(buttontextName.buy, 'img3044', 60, 206, 48, 20, 'black', function() {
				console.log('extend map');
				userinfo.buildarealv = nextlv;
				setEdage();
				extendmapShopMenu.hide(false);
				setReceptionPos();
				new ToastInfo('mytoast', warntext.build_extend_success, -130, 100, 1500);
			});
			extendmapShopMenu.addContentBtn(buttontextName.cancel, 'img3044', 160, 206, 48, 20, 'black', function() {
				extendmapShopMenu.hide(false);
			});
		}
	}));
	addPool(new ImgNode('bottomExtend', 'img3519', bottomsize.rilisize + 47 + 1 * 40, stageHeight - 37, bottomRightWidth - 1, 38, function() {
		console.log('购买道具');
		extendmapShopMenu.hide(false);
		groupBack();
		if(handleInfoMenu.isvisible)
				handleInfoMenu.hide(false);
		stopHandleBtn.hide();
		propShopMenu.setdata();
	}));
	addPool(new ImgNode('bottomTemp1', 'img3522', bottomsize.rilisize + 47 + 2 * 40, stageHeight - 37, bottomRightWidth - 1, 38, function() {
		console.log(this.name);
	}));
	addPool(new ImgNode('bottomTemp3', 'img3535', bottomsize.rilisize + 47 + 3 * 40, stageHeight - 37, bottomRightWidth - 1, 38, function() {
		console.log(this.name);
	}));
}

function setEdage(){
	rightEdge = baseRhombusHeight* userinfo.buildarealv.xEdageTileNums -stageWidth;
	bottomEdge = baseRhombusHeight * userinfo.buildarealv.yEdageTileNums -stageHeight;
}

var activeLeftIconnode = null;

function layoutBottomTxtinfo(){
	new PngNode('txtbg','img3358bmp',47,stageHeight-70,stageWidth-47,30);
	txtinfo = new TxtNode('welcome','欢迎来到度假村世界游戏！','img3195','#676767',55,stageHeight-67,stageWidth - 47);
}


function layourHandleInfo(){
	stopHandleBtn =  new StopHandleMenu('stop Handler',stageWidth-188,stageHeight-112-40);
	stopHandleBtn.hide();
	handleInfoMenu = new HandleInfoMenu('handleInfo',stageWidth - 205,stageHeight - 130-40);
	handleInfoMenu.hide(false);
}


function layoutLeftIcons(ctx){
	var space = 4;
	var inity = 5;
	var bg_lefticons   = new ShapeRect('lefticonsbg',colors.lefticonsbg,'blue',1,layoutconfig.headsize+1,iconSize.lefticon+4,275,4);
	var dis = 0;
	for(var name in lefticonInfos){
		var obj = lefticonInfos[name];
		var iconnode = new IconNode(obj.name,obj.url,3,(iconSize.lefticon+space)*dis+layoutconfig.headsize+inity,iconSize.lefticon,iconSize.lefticon,colors.lefticonbg,colors.lefticonactive,function(name){
			console.log(this.name);
			extendmapShopMenu.hide(false);
			propShopMenu.hide(false);
			stopHandleBtn.hide();
			if(handleInfoMenu.isvisible)
				handleInfoMenu.hide(false);
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
	
	AddHandleIcons(floorInfos,2,55,space,lefticonInfos.floor.groupname,2,50,200,180,LeftIconsHandlerTap);
	AddHandleIcons(plantInfos,2,55,space,lefticonInfos.plant.groupname,2,50,200,354,LeftIconsHandler);
	AddHandleIcons(houseInfos,2,135,space,lefticonInfos.house.groupname,2,130,200,90,LeftIconsHandler);
	AddHandleIcons(miniroomInfos,2,238,space,lefticonInfos.miniroom.groupname,2,236,200,170,LeftIconsHandler);
	AddHandleIcons(restaurantInfos,2,55,space,lefticonInfos.restaurant.groupname,2,50,230,268,LeftIconsHandler,6,90);
	AddHandleIcons(carpetInfos,2,159,space,lefticonInfos.carpet.groupname,2,145,200,138,LeftIconsHandlerTap);
	AddHandleIcons(lawnInfos,2,155,space,lefticonInfos.lawn.groupname,2,148,200,222,LeftIconsHandlerTap,5,90);
}

function AddHandleIcons(dataObj,initx,inity,custspace,grouptype,groupinitx,groupinity,groupw,grouph,handler,rows,spacew){
	var nodearray = [];
	var i = 0;
	var multip = false;
	if(!rows){
		rows = 1;
		spacew = 0;
	}else{
		multip = true;
	}
	for(var name in dataObj){
		if(name == 'receptioncenter')
			continue;
		var x = Math.floor(i/rows)*spacew +initx;
		if(rows > 1)
			var y = (i % rows)*custspace + inity; 
		else
			var y = i * custspace + inity;
		var obj = dataObj[name];
		var house = new IconNode(obj.iconnodename,obj.url, x,y,iconSize.lefticon,iconSize.lefticon,'yellow','blue',handler);
		if(!multip){
			house.txtdata.push(obj.name+"  $:"+obj.price.toString());
			house.txtdata.push(obj.note);
		}else{
			house.txtdata.push(obj.name);
			house.txtdata.push("$:"+obj.price.toString());
		}
		
		house.groupname = obj.groupname;
		house.dataname = name;
		house.tapdata = dataObj;
		nodearray.push(house);
		i++;
	}
	addPool(new IconNodeGroup(grouptype,groupinitx,groupinity,groupw,grouph,'#C0F56E','blue',nodearray,false,iconSize.lefticon+2));
}

function LeftIconsHandler(infosojb) {
	if (!checkCost(infosojb[this.dataname].price)){
		groupBack();
		return;
	}
		
	currentHandleStatus = handleStatus.dragingbuild;
	frontWallAlpha = 0.3;
	currentBuildData = infosojb[this.dataname];
	currentBuildType = currentBuildData.housetype;
	stopHandleBtn.show();
	groupBack();
}

function LeftIconsHandlerTap(infosojb) {
	if (!checkCost(infosojb[this.dataname].price)){
		groupBack();
		return;
	}
	currentHandleStatus = handleStatus.tile;
	frontWallAlpha = 0.3;
	currentBuildData = infosojb[this.dataname];
	currentBuildfloor = currentBuildData.tileurl;
	stopHandleBtn.show();
	groupBack();
}

function groupBack(){
	if(activeLeftIconnode){
		var group = getTypeNode(activeLeftIconnode.groupname,NodeTypeClass.icongroup);
		group.changeswipe();
		var parentIcon = iconPool[activeLeftIconnode.name];
		parentIcon.active = false;
		activeLeftIconnode = null;
	}
}

function addWaiter(buildtype,build){ 
	if(buildtype == buildTypes.bar){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+35,build.y+19);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
		var tesk = new EntityNode('bartesk','tesk','img2412',build.x+15,build.y+2,200);
		build.furnitiure = tesk;
	}
	if(buildtype == buildTypes.chinarestaurant){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+31,build.y+17);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
		var tesk = new EntityNode('bartesk','tesk','img2412',build.x+15,build.y+2,200);
		build.furnitiure = tesk;
	}
	if(buildtype == buildTypes.japanrestaurant){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+31,build.y+17);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
		var tesk = new EntityNode('bartesk','tesk','img2344',build.x+15,build.y+2,200);
		build.furnitiure = tesk;
	}
	if(buildtype == buildTypes.westrestaurant){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+31,build.y+17);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
		var tesk = new EntityNode('bartesk','tesk','img2412',build.x+15,build.y+2,200);
		build.furnitiure = tesk;
	}
	if(buildtype == buildTypes.market){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+59,build.y+54);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.left);
		build.waiter = waiter;
		var tesk = new EntityNode('cashierdesk','desk','img2511',build.x+15+21,build.y+2+38,200);
		build.furnitiure = tesk;
	}
	if(buildtype == buildTypes.medical){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+52,build.y+24);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
	}
	if(buildtype == buildTypes.spa){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+37,build.y+9);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
	}
	if(buildtype == buildTypes.receptioncenter){
		var waiter = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+31,build.y+17);
		waiter.setAction(manstatus.idle);
		waiter.setDirect(Direct.down);
		build.waiter = waiter;
		var desk = new EntityNode('bartesk','tesk','img442',build.x+15,build.y+2,200);
		desk.isturn = true;
		build.furnitiure = desk;
		
		var waiter2 = new ManNode('testman',[['img927','img37'],['img919','img1474'],
									 ['img35','img37','img39'],['img917','img919','img921'],
									 ['img924'],['img932'],
									 ['img934']
									 ],build.x+31,build.y+17);
		waiter2.setAction(manstatus.idle);
		waiter2.setDirect(Direct.left);
		build.waiter2 = waiter2;
		var desk2 = new EntityNode('bartesk','tesk','img442',build.x+15,build.y+2,200);
		build.furnitiure2 = desk2;
	}
}


