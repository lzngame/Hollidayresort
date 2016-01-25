function BuildNode(name,type,buildtype,x,y,depth,floorspace,posx,posy){
	this.name = name;
	this.x = x;
	this.y = y;
	this.depth = depth;
	this.isvisible = true;
	this.id = increaseId++;
	this.ntype = type;
	this.buildtype = buildtype;
	this.floorspace = floorspace;
	this.posx = posx;
	this.posy = posy;
	addEntityNode(this);
}

BuildNode.prototype.IsInFloorspace = function(xpos,ypos){
	return isInFloorspce(xpos,ypos,this.floorspace);
};

BuildNode.prototype.getDrawData = function(){
	var objdata = { name:this.name,
					x:this.x,
					y:this.y,
					type:this.ntype,
					depth:this.depth,
					buildtype:this.buildtype
					};
	return objdata;
};

BuildNode.prototype.drawself = function(ctx){
	var data = builddata[this.buildtype];
	
	for(var name in  data){
		var item = data[name];
		drawImg(ctx,name,this.x+item[0],this.y+item[1]);
	}
};

BuildNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
};

BuildNode.prototype.setDepth = function(zindex){
	this.depth = zindex;
};

function getSizeToMap(initw,inith){
	var nw = Math.round(initw/initTileSize);
	var nh = Math.round(inith/initTileSize);
	return {w:nw * baseRhombusHeight,h:nh*baseRhombusHeight};
}

function EntityNode(name,type,data,x,y,depth,frameFps){
	this.depth = depth || DEFAULT_DEPTH;
	this.frameFps = frameFps || DEFAULT_FPS;
	this.isvisible = true;
	this.x = x;
	this.y = y;
	this.name = name;
	if(typeof(data)=='object')
		this.data = data;
	else
		this.data = [[data]];
	this.id = increaseId ++;
	this.frameIndex = 0;
	this.frameSumTick = 0;
	this.currentAction = 0;
	this.ntype = type;
};

EntityNode.prototype.setVisible = function(isvisible){
	this.isvisible = isvisible;
};


EntityNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
};

EntityNode.prototype.setDepth = function(depth){
	this.depth = depth;
};


EntityNode.prototype.getFrame = function(){
	if(this.data[0].length == 1){
		var obj = this.data[0];
		return obj[0];
	}
		
	if(this.frameSumTick > this.frameFps){
		this.frameSumTick = 0;
		this.frameIndex++;
	}else{
		this.frameSumTick += bigfourgame.clock.getTick();
	}
	if(this.frameIndex >(this.data[this.currentAction].length -1)){
		this.frameIndex = 0;
	}
	
	return this.data[this.currentAction][this.frameIndex];
};



EntityNode.prototype.getDrawData = function(){
	var objdata = {name:this.getFrame(),x:this.x,y:this.y,type:this.ntype,depth:this.depth};
	return objdata;
};

function EntityFootNode(name,type,data,x,y,depth,frameFps,autodel,lastFunc,lastdata){
	this.depth = depth ;
	this.frameFps = frameFps ;
	this.isvisible = true;
	this.x = x;
	this.y = y;
	this.name = name;
	if(typeof(data)=='object')
		this.data = data;
	else
		this.data = [[data]];
	this.id = increaseId ++;
	this.frameIndex = 0;
	this.frameSumTick = 0;
	this.currentAction = 0;
	this.ntype = type;
	this.autodel = autodel;
	this.lastFunc = lastFunc;
	this.lastFuncdata = lastdata;
}

EntityFootNode.prototype.setVisible = function(isvisible){
	this.isvisible = isvisible;
};

EntityFootNode.prototype.lastFrameFun = function(){
	console.log('最后一帧执行');
};


EntityFootNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
};

EntityFootNode.prototype.setDepth = function(depth){
	this.depth = depth;
};

EntityFootNode.prototype.getFrame = function(){
	if(this.data[0].length == 1){
		var obj = this.data[0];
		return obj[0];
	}
		
	if(this.frameSumTick > this.frameFps){
		this.frameSumTick = 0;
		this.frameIndex++;
	}else{
		this.frameSumTick += bigfourgame.clock.getTick();
	}
	if(this.frameIndex >(this.data[this.currentAction].length -1)){
		this.frameIndex = 0;
		if(this.lastFunc != null){
			this.lastFunc(this.lastFuncdata);
		}
		if(this.autodel){
			delete entitys[this.id]
		}
	}
	
	return this.data[this.currentAction][this.frameIndex];
};

EntityFootNode.prototype.getSize = function(){
	var name = getPngSize(this.getFrame())
};

EntityFootNode.prototype.getDrawData = function(){
	var pngname = this.getFrame();
	var size = getPngSize(pngname);
	var offsetx = this.x-size.w/2;
	var offsety = this.y-size.h;
	var objdata = {name:this.getFrame(),x:offsetx,y:offsety,type:this.ntype,depth:this.depth};
	return objdata;
};


function addEntityNode(entityitem){
	var id = entityitem.id;
	entitys[id] = entityitem;
	return id;
}

function deleteEntity(id){
	if(typeof(id)=='number')
		delete entitys[id];
	else
		delete entitys[id.id];
}

function getTypeNode(name,typeclass){
	switch(typeclass){
		case NodeTypeClass.icon:
			return iconPool[name];
			break;
		case NodeTypeClass.icongroup:
			return groupPool[name];
			brek;
	}
}

function ShapeNode(name,shapetype,clr,borderclr,x,y,data){
	this.name =name;
	this.ntype = shapetype;
	this.x = x;
	this.y = y;
	this.clr = clr;
	this.borderclr = borderclr;
	this.data = data;
}

function ShapeCircle(name,clr,borderclr,x,y,r){
	this.name = name;
	this.x = x;
	this.y = y;
	this.ntype = NodeTypeClass.circle;
	this.x = x;
	this.y = y;
	this.r = r;
}

ShapeCircle.prototype.draw = function(ctx){
	ctx.fillStyle = this.clr;
	ctx.strokeStyle = this.borderclr;
	drawCircle(ctx,this.x,this.y,this.data.r);
};

function ShapeRect(name,clr,borderclr,x,y,w,h){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.clr = clr;
	this.borderclr = borderclr;
	layoutBgPool[name]= this;
	this.isvisible = true;
}

ShapeRect.prototype.draw = function(ctx){
	if(this.isvisible){
		ctx.fillStyle = this.clr;
		ctx.strokeStyle = this.borderclr;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.strokeRect(this.x,this.y,this.w,this.h);
	}
};

function ShapeRoundrect(name,clr,borderclr,x,y,w,h,r){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = r;
	this.clr = clr;
	this.borderclr = borderclr;
	layoutBgPool[name] = this;
}

ShapeRoundrect.prototype.draw = function(ctx){
	ctx.fillStyle = this.clr;
	ctx.strokeStyle = this.borderclr;
	ctx.roundRect(this.x,this.y,this.w,this.h,this.r).fill();
	ctx.roundRect(this.x,this.y,this.w,this.h,this.r).stroke();
}

function LvNode(name,iconname,x,y,n,size){
	this.x = x;
	this.y = y;
	this.name = name;
	this.n = n;
	this.iconname = iconname;
	this.size = size;
	layoutBgPool[name] = this;
}

LvNode.prototype.draw = function(ctx){
	for(var i=0;i<this.n;i++){
		var y = this.y;
		var x = this.x + i*this.size;
		drawImg(ctx,this.iconname,x,y,false,this.size,this.size);
	}
};

LvNode.prototype.setLv = function(n){
	this.n = n;
};

function ImageNode(name,iconname,x,y,w,h){
	this.name = name;
	this.iconname = iconname;
	this.x = x;
	this.y = y;
	if(w){
		this.w = w;
		this.h = h; 
	}else{
		var obj = getPngSize(iconname);
		var width = obj.w;
		var height = obj.h;
		this.w = width;
		this.h = height;
	}
	
	layoutBgPool[name] = this;
	this.isvisible = true;
}

ImageNode.prototype.draw = function(ctx){
	if(this.isvisible)
		drawImg(ctx,this.iconname,this.x,this.y,false,this.w,this.h);
};

ImageNode.prototype.setImg = function(iconname){
	var png = getPngSize(iconname);
	this.iconname = iconname;
	this.w = png.w;
	this.h = png.h;
}

function TxtNode(name,txt,iconhead,clr,x,y,w){
	this.name = name;
	this.txt = txt;
	this.initx = x;
	this.x = x;
	this.y = y;
	this.clr = clr;
	this.w = w;
	this.iconhead = iconhead;
	layoutBgPool[name] = this;
	this.speed = 1;
	this.circle = false;
	this.isvisible = true;
}

TxtNode.prototype.draw = function(ctx) {
	if (this.isvisible) {
		ctx.fillStyle = this.clr;
		this.run();
		if (this.iconhead)
			drawImg(ctx, this.iconhead, this.x, this.y);
		ctx.fillText(this.txt, this.x + 40, this.y + 12);
	}
};

TxtNode.prototype.run = function(stop) {
	if (this.circle) {
		this.x += this.speed;
		if (this.x > this.initx + this.w) {
			this.x = this.initx;
		}
	}
};

TxtNode.prototype.setTxt =  function(txt,iconhead,circle){
	this.txt = txt;
	this.iconhead = iconhead;
	this.circle = circle;
}

TxtNode.prototype.setPos = function(x){
	this.x = x;
}


function addPool(itemnode){
	var name = itemnode.name;
	var pooltype = itemnode.ntype;
	switch(pooltype){
		case NodeTypeClass.bg:
			layoutBgPool[name] = itemnode;
			break;
		case NodeTypeClass.icongroup:
			groupPool[name] = itemnode;
			break;
		case NodeTypeClass.icon:
			iconPool[name] = itemnode;
			break;
	}
	return itemnode;
}

function IconNodeGroup(name,x,y,w,h,bgclr,borderclr,icons,isvisible,targetDis){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.bgclr = bgclr;
	this.borderclr = borderclr;
	this.icons = icons;
	this.ntype = NodeTypeClass.icongroup;
	this.initx = x;
	this.inity = y;
	this.swipingRight = false;
	this.swipingLeft = false;
	this.targetRight = x + targetDis;
	this.isdisable = true;
	this.isvisible = isvisible;
	this.swipespeed = 12;
}

IconNodeGroup.prototype.draw = function(ctx) {
	if (this.isvisible) {
		if (this.swipingRight) {
			if (this.x >= this.targetRight) {
				this.x = this.targetRight;
				this.swipingRight = false;
				this.swipingLeft = false;
				this.isdisable = true;
				this.isvisible = true;
			} else {
				this.setPos(this.x + this.swipespeed, this.inity);
			}
		} else if (this.swipingLeft) {
			if (this.x <= this.initx) {
				this.x = this.initx;
				this.swipingRight = false;
				this.swipingLeft = false;
				this.isvisible = false;
			} else {
				this.setPos(this.x - this.swipespeed, this.inity)
			}
		}
		ctx.fillStyle = this.bgclr;
		ctx.strokeStyle = this.borderclr;
		ctx.roundRect(this.x, this.y, this.w, this.h, 3).fill();
		ctx.roundRect(this.x, this.y, this.w, this.h, 3).stroke();
		for (var i = 0; i < this.icons.length; i++) {
			var iconnode = this.icons[i];
			iconnode.isdisable = true;
			iconnode.draw(ctx);
		}
	}
};


IconNodeGroup.prototype.checkTap = function(tapx,tapy){
	return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
};

IconNodeGroup.prototype.changeswipe = function(){
	if(!this.swipingLeft && !this.swipingRight){
		if(this.x <= this.initx)
			this.swipe(Direct.right);
		else
			this.swipe(Direct.left);
	}else if(this.swipingLeft){
		this.swipe(Direct.right);
	}else{
		this.swipe(Direct.left);
	}
}

IconNodeGroup.prototype.swipe = function(direct){
	this.isvisible = true;
	switch(direct){
		case Direct.left:
			this.swipingLeft = true;
			this.swipingRight = false;
			break;
		case Direct.right:
			this.swipingRight = true;
			this.swipingLeft = false;
			break;
	}
};

IconNodeGroup.prototype.setPos = function(x,y){
	var dx = x -this.x;
	var dy = y -this.y;
	this.x = x;
	this.y = y;
	for(var i=0;i<this.icons.length;i++){
		var iconnode = this.icons[i];
		iconnode.setPos(iconnode.x+dx,iconnode.y+dy);
	}
};


function IconNode(name,iconname,x,y,w,h,defaultBgclr,activeBgclr,handler,borderClr){
	this.id = increaseId++;
	this.name = name;
	this.iconname = iconname;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.ntype = NodeTypeClass.icon;
	this.defaultBgclr = defaultBgclr;
	this.activeBgclr = activeBgclr;
	if(borderClr)
		this.borderclr = borderClr;
	this.handler = handler;
	this.depth = 1000;
	this.isvisible = true;
	this.isdisable = true; 
	this.groupname = '';
	this.active = false;
	this.txtclr ='black';
	this.txtdata = [];
}

IconNode.prototype.draw = function(ctx){
	var iconobj = getPngSize(this.iconname);
	var w = iconobj.w;
	var h = iconobj.h;
	if(this.active)
		ctx.fillStyle = this.activeBgclr;
	else
		ctx.fillStyle = this.defaultBgclr;
	ctx.roundRect(this.x,this.y,this.w,this.h,3).fill();
	ctx.strokeStyle = this.borderclr;
	ctx.roundRect(this.x,this.y,this.w,this.h,3).stroke();
	var xp = this.x + (this.w/2 - w/2);
	var yp = this.y + (this.h/2 - h/2);
	drawImg(ctx,this.iconname,xp,yp);
	if(this.txtdata.length > 0){
		ctx.fillStyle = this.txtclr;
		for(var i=0;i<this.txtdata.length;i++){
			ctx.fillText(this.txtdata[i],this.x+this.w+10,this.y+i*20+10);
		}
	}
};

IconNode.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

IconNode.prototype.checkTap = function(tapx,tapy){
	return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
};

IconNode.prototype.getDrawData = function(){
	return {name:this.iconname,x:this.x,y:this.y,type:this.type,depth:this.depth};
};

IconNode.prototype.deleteSelf = function(){
	delete iconPool[this.name];
};

function ImgNode(name,iconname,x,y,w,h,handler,handlerdata){
	this.id = increaseId++;
	this.name = name;
	this.iconname = iconname;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.ntype = NodeTypeClass.icon;
	
	this.handler = handler;
	this.depth = 1000;
	this.isvisible = true;
	this.isdisable = true; 
	addPool(this);
}

ImgNode.prototype.draw = function(ctx){
	if(this.isvisible)
		drawImg(ctx,this.iconname,this.x,this.y,false,this.w,this.h);
};

ImgNode.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

ImgNode.prototype.checkTap = function(tapx,tapy){
	if(!this.isvisible)
		return false;
	return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
};

ImgNode.prototype.getDrawData = function(){
	return {name:this.iconname,x:this.x,y:this.y,type:this.type,depth:this.depth};
};

ImgNode.prototype.deleteSelf = function(){
	delete iconPool[this.name];
};

function IconInfoNode(name,x,y,w,h,bgicon,txt1,txt2,num,handler){
	this.id = increaseId++;
	this.name = name;
	this.bgicon = bgicon;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.ntype = NodeTypeClass.icon;
	this.txt1 = txt1;
	this.txt2 = txt2;
	this.num = num;
	
	this.handler = handler;
	this.depth = 1000;
	this.isvisible = true;
}

IconInfoNode.prototype.draw = function(ctx){
	drawImg(ctx,this.bgicon,this.x,this.y,false,this.w,this.h);
	drawImg(ctx,this.txt1,this.x+2,this.y+4);
	drawImg(ctx,this.txt2,this.x+18,this.y+4);
	drawNumSt(ctx,this.num.toString(),this.x+34,this.y+3);
};

IconInfoNode.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

IconInfoNode.prototype.checkTap = function(tapx,tapy){
	return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
};

function EntitTextNode(txt,x,y,clr,size){
	this.text = txt;
	this.x = x;
	this.y = y;
	this.clr = clr;
	this.size = size;
}

EntitTextNode.prototype.draw = function(ctx){
	ctx.fillText(this.txt,x,y);
};

function UItextNode(name,txt,x,y,clr){
	this.name = name;
	this.x = x;
	this.y = y;
	this.clr = clr;
	this.txt = txt;
	layoutBgPool[name] = this;
	this.isvisible = true;
};

UItextNode.prototype.draw = function(ctx){
	if(this.isvisible){
		ctx.fillStyle = this.clr;
		ctx.fillText(this.txt,this.x,this.y);
	}
};

UItextNode.prototype.settxt = function(txt){
	this.txt = txt;
}

function PngNumNode(name,txt,x,y){
	this.name = name;
	this.x = x;
	this.y = y;
	this.txt = txt;
	this.ntype = NodeTypeClass.num;
	layoutBgPool[name] = this;
}

PngNumNode.prototype.draw = function(ctx){
	drawNumSt(ctx,this.txt,this.x,this.y);
};

PngNumNode.prototype.setTxt = function(txt){
	if(isNaN(txt))
		txt = '999999999999';
	this.txt = txt;
};

function ResortClock(name,x,y){
	this.x = x;
	this.y = y;
	this.sumtick =0;
	this.days = resortclockdata.days;
	this.hours = resortclockdata.hours;
	this.minitues = resortclockdata.minitues;
	this.timepace = resortclockdata.timespace;
}

ResortClock.prototype.update = function(ctx){
	this.sumtick += bigfourgame.clock.getTick();
	if(this.sumtick >= this.timepace){
		this.sumtick = 0;
		this.minitues++;
		if(this.minitues >= 60){
			this.hours++;
			this.minitues = 0;
			if(this.hours >= 24){
				this.hours = 0;
				this.days++;
			}
		}
	}
	//console.log('D:%d H:%d M:%d',this.days,this.hours,this.minitues);
	
	//drawNumSt(ctx,this.x+4,this.y+10,this.hours.toString()+':'+this.minitues.toString());
	var imgname = 'img3697';
	var imgstar = 'img3558';
	var st = '夜晚';
	var clr = 'white';
	if((this.hours >= 19 && this.hours <=24)||
	   (this.hours <= 7  && this.hours >= 0))
	{
		
	}else{
		st = '白天';
		clr = 'black';
		imgname = 'img3493bmp';
		imgstar = 'img3561';
	}
	drawImg(ctx,imgname,this.x+47,this.y+12,false,bottomsize.rilisize,40);
	drawImg(ctx,'iPhone-Calendar',this.x+50,this.y+12,false,15,15);
	drawImg(ctx,'iPhone-Clock',this.x+50,this.y+30,false,15,15);
	drawImg(ctx,'f43_43',this.x+70,this.y+14);
	drawNumSt(ctx,'365',this.x+95,this.y+15);
	drawImg(ctx,'f46_46',this.x+125,this.y+14);
	drawImg(ctx,imgstar,this.x,this.y);
	drawNumSt(ctx,this.hours.toString()+":"+this.minitues.toString(),this.x+90,this.y+31);
	//ctx.fillStyle = clr;
	//ctx.fillText(st,this.x+2,this.y+20);
}

function OnebuildingNode(name,xpos,ypos){
	var obj = getPixelByPos(xpos,ypos);
	var xpix = obj.xpix;
	var ypix = obj.ypix+baseRhombusHeight/2;
	addEntityNode(new EntityFootNode('buildingone',NodeTypeClass.entityitem,[['img259','img261','img263','img265','img267','img269']],xpix,ypix,ypix,1000));
}

OnebuildingNode.prototype.deleteNode = function(){
	delete entitys[this.one.id];
};

function ShowInfoNode(name,x,y,w,h){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	addPool(this);
	this.closename = this.name + 'close_name';
	this.closebtn = new IconNode(this.closename,'img2997',this.x+this.w-23,this.y+3,20,20,'red','red',function(){
		var obj = this;
		this.deleteSelf();
		delete layoutBgPool[name];
	},'red');
	addPool(this.closebtn);
	layoutBgPool[this.name] = this;
}

ShowInfoNode.prototype.closeInfoWin = function(){
	console.log('close');
	
	this.deleteSelf();
};

ShowInfoNode.prototype.draw = function(ctx){
	drawImg(ctx,'img2951',this.x,this.y,false,this.w,this.h);
};

function FloorNode(name,iconname,xpos,ypos,data){
	this.id = increaseId++;
	this.name = name;
	this.iconname = iconname;
	this.xpos = xpos;
	this.ypos = ypos;
	this.x = getPixByPosTile(xpos,ypos)[0];
	this.y = getPixByPosTile(xpos,ypos)[1];
	this.ntype = NodeTypeClass.floor;
	this.data = data;
	floorpool[this.id] = this;
}

FloorNode.prototype.draw = function(ctx){
	drawImgBottomTile(ctx,this.iconname,this.xpos,this.ypos);
};

FloorNode.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

FloorNode.prototype.checkTap = function(tapx,tapy){
	return checkPointInBox(tapx,tapy,this.x,this.y,baseRhombusWidth,baseRhombusWidth);	
};

FloorNode.prototype.deleteSelf = function(){
	delete floorpool[this.id];
};

function StopHandleMenu(name,x,y){
	this.name = name;
	this.x = x;
	this.y = y;
	this.iconname = 'StopHandleMenu_iconname';
	this.bgnodename = 'StopHandleMenu_bgname';
	this.closenodename = 'StopHandleMenu_stopname';
	this.txt1name = 'StopMenu_txt_handle';
	this.txt2name = 'StopMenu_txt_name';
	this.txt3name = 'StopMenu_txt_note';
	this.txt4name = 'StopMenu_txt_price';
	
	this.self = this;
	new ImageNode(this.bgnodename,'img396',this.x,this.y,186,112);
	var stopBtn = new ImgNode(this.closenodename,'cancel',this.x+100,this.y+4,80,25,this.hide);
	stopBtn.tapdata = this;
	
	this.handleTxt = new TxtNode(this.txt1name,'','','yellow',this.x-35,this.y+25,100);
	this.nameTxt =  new TxtNode(this.txt2name,'','','black',this.x+20,this.y+40,100);
	this.noteTxt =  new TxtNode(this.txt3name,'','','black',this.x+20,this.y+70,100);
	this.priceTxt = new TxtNode(this.txt4name,'','','black',this.x+20,this.y+90,100);
	
	this.iconImg = new ImageNode(this.iconname,'img409',this.x+10,this.y+45);
}

StopHandleMenu.prototype.hide = function(tapdata){
	var isvisible = false;
	if(tapdata != null){
		currentHandleStatus = handleStatus.normal;
		layoutBgPool[tapdata.bgnodename].isvisible = isvisible;
		iconPool[tapdata.closenodename].isvisible = isvisible;
		layoutBgPool[tapdata.txt1name].isvisible = isvisible;
		layoutBgPool[tapdata.txt2name].isvisible = isvisible;
		layoutBgPool[tapdata.txt3name].isvisible = isvisible;
		layoutBgPool[tapdata.txt4name].isvisible = isvisible;
		layoutBgPool[tapdata.iconname].isvisible = isvisible;
	}else{
		layoutBgPool[this.bgnodename].isvisible = isvisible;
		iconPool[this.closenodename].isvisible = isvisible;
		layoutBgPool[this.txt1name].isvisible = isvisible;
		layoutBgPool[this.txt2name].isvisible = isvisible;
		layoutBgPool[this.txt3name].isvisible = isvisible;
		layoutBgPool[this.txt4name].isvisible = isvisible;
		layoutBgPool[this.iconname].isvisible = isvisible;
	}
	currentHandleStatus = handleStatus.normal;
};

StopHandleMenu.prototype.show = function(){
	var isvisible = true;
	layoutBgPool[this.bgnodename].isvisible = isvisible;
	iconPool[this.closenodename].isvisible = isvisible;
	layoutBgPool[this.txt1name].isvisible = isvisible;
	layoutBgPool[this.txt2name].isvisible = isvisible;
	layoutBgPool[this.txt3name].isvisible = isvisible;
	layoutBgPool[this.txt4name].isvisible = isvisible;
	layoutBgPool[this.iconname].isvisible = isvisible;
	
	layoutBgPool[this.txt1name].setTxt('空地板上面点击建造');
	layoutBgPool[this.txt2name].setTxt(currentBuildData.name);
	layoutBgPool[this.txt3name].setTxt(currentBuildData.note);
	layoutBgPool[this.txt4name].setTxt('$:'+currentBuildData.price.toString());
	layoutBgPool[this.iconname].setImg(currentBuildData.tileurl);
};

StopHandleMenu.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

function PlantNode(name,type,frames,xpos,ypos,center){
	this.name = name;
	this.isvisible = true;
	this.id = increaseId++;
	this.ntype = type;
	if(typeof(frames)=='object'){
		var png = frames[0][0];
		this.w = getPngSize(png).w;
		this.h = getPngSize(png).h;
	}else{
		this.w = getPngSize(frames).w;
		this.h = getPngSize(frames).h;
	}
	var obj = getPixByPosTile(xpos,ypos);
	this.x = obj[0];
	this.y = obj[1];
	if(center)
		var y = this.y - this.h + baseRhombusHeight/2;
	else
		var y = this.y - this.h;
	var entitynode = new EntityNode(name,type,frames,this.x-this.w/2,y,ypos,330);
	this.entityid = entitynode.id;
	addEntityNode(entitynode);
	
	buildpool[this.id] = this;
}


PlantNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
};
 
PlantNode.prototype.setDepth = function(zindex){
	this.depth = zindex;
};

function HandleInfoMenu(name,x,y){
	this.name = name;
	this.x = x;
	this.y = y;
	this.ntype = NodeTypeClass.menu;
	
	this.namesObj = {
		closename:'icon_'+name+'_closename',
		bgheadname:name+'_bgheadname',
		bgrect:name+'_bgrectname',
		titlename:name+'_titlename',
		btndestoryname:'icon'+name+'_destoryname'
	}
	new ImageNode(this.namesObj.bgheadname,'img3358bmp',this.x,this.y,205,30);
	var alpha = 'rgba(200,200,200,0.5)';
	new ShapeRect(this.namesObj.bgrect,alpha,'black',this.x+1,this.y+30,204,100);
	var closeBtn = new ImgNode(this.namesObj.closename,'img2997',this.x+175,this.y+2,20,20,function(){
		this.closeData.hide(false);
	});
	closeBtn.closeData = this;
	var destoryBtn = new ImgNode(this.namesObj.btndestoryname,'destory',this.x+55,this.y+55,52,20,function(){
		this.closeData.hide(false);
		
		if(currentHandleNode.ntype == NodeTypeClass.floor)
			delete floorpool[currentHandleNode.id];
		if(currentHandleNode.ntype == NodeTypeClass.build)
			deleteEntity(currentHandleNode.id);
		currentHandleNode = null;
	});
	destoryBtn.closeData = this;
	var txttitle = new UItextNode(this.namesObj.titlename,'名称',this.x+10,this.y+15,'blue');
}

HandleInfoMenu.prototype.show = function(nodedata){
	layoutBgPool[this.namesObj.titlename].settxt(nodedata.name);
};

HandleInfoMenu.prototype.hide = function(isvisible){
	var data = this.closeData;
	if(this.ntype == NodeTypeClass.menu)
		data = this;
	for(var name in data.namesObj){
		var tmpname = data.namesObj[name];
		var check = tmpname.indexOf('icon');
		if(tmpname.indexOf('icon') == 0){
			iconPool[tmpname].isvisible = isvisible;
		}else{
			layoutBgPool[tmpname].isvisible = isvisible;
		}
	}
	if(nowHandleNodeSingle != null){
		deleteEntity(nowHandleNodeSingle);
		nowHandleNodeSingle = null;
	}
	if(nowHandleNodeFour != null){
		deleteEntity(nowHandleNodeFour);
		nowHandleNodeFour = null;
	}
	if(nowHandleNodeSix != null){
		deleteEntity(nowHandleNodeSix);
		nowHandleNodeSix = null;
	}
	
}


