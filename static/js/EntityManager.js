function BuildNode(name,type,buildtype,x,y,floorspace,posx,posy){
	this.name = name;
	this.x = x;
	this.y = y;
	this.isvisible = true;
	this.id = increaseId++;
	this.ntype = type;
	this.buildtype = buildtype;
	this.floorspace = floorspace;	
	this.posx = posx;
	this.posy = posy;
	this.lv = 1;
	this.isturn = false;
	this.alpha = 1;
	this.waiter = null;
	this.furnitiure = null;
	this.data = null;
	this.isDraw = false;
	this.isbuild = true;
	addEntityNode(this);
	this.exp = 0;
}

BuildNode.prototype.setAlpha = function(a){
	this.alpha = a;
}

BuildNode.prototype.IsInFloorspace = function(xpos,ypos){
	return isInFloorspce(xpos,ypos,this.floorspace);
};

BuildNode.prototype.draw = function(ctx) {
	var databuild = builddata[this.buildtype];
	for (var name in databuild) {
		var item = databuild[name];
		var x = this.x + item[0];
		var y = this.y + item[1];
		ctx.globalAlpha = this.alpha;
		if(this.isturn)
			drawTurnImg(ctx, item[this.lv + 1], x+zeroX, y+zeroY);
		else
			drawImg(ctx, item[this.lv + 1], x+zeroX, y+zeroY);
		ctx.globalAlpha = 1;
		
		if(this.expline)
			this.expline.draw(ctx);
	}
	if(this.waiter != null){
		this.waiter.draw(ctx);
	}
	if(this.waiter2 != null){
		this.waiter2.draw(ctx);
	}
	if(this.furnitiure != null){
		this.furnitiure.draw(ctx);
	}
	if(this.furnitiure2 != null){
		this.furnitiure2.draw(ctx);
	}
};

BuildNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
	var obj = getTilePos(x,y);
	this.posx = obj.posx;
	this.posy = obj.posy;
};

BuildNode.prototype.setPosCoor = function(posx,posy){
	var	dataobj = getOffsetXY(this.data.floorarea, posx, posy);
	this.x = dataobj.x;
	this.y = dataobj.y;
	this.posx = dataobj.posx;
	this.posy = dataobj.posy;
	this.floorspace = dataobj.roundAr;
};

BuildNode.prototype.upLv = function(){
	if(this.lv < 3){
		this.lv++;
		return true;
	}else{
		return false;
	}
};



function EntityNode(name,type,data,x,y,frameFps){
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
	this.isturn = false;
};

EntityNode.prototype.setVisible = function(isvisible){
	this.isvisible = isvisible;
};


EntityNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
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

EntityNode.prototype.draw = function(ctx){
	if(this.isturn)
		drawTurnImg(ctx,this.getFrame(),this.x+zeroX,this.y+zeroY);
	else
		drawImg(ctx,this.getFrame(),this.x+zeroX,this.y+zeroY);
};


/*EntityNode.prototype.getDrawData = function(){
	var objdata = {id:this.id,name:this.getFrame(),x:this.x,y:this.y,type:this.ntype};
	return objdata;
};*/

function EntityFootNode(name,type,data,x,y,frameFps,autodel,lastFunc,lastdata){
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

EntityFootNode.prototype.draw = function(ctx){
	drawImg(ctx,this.getFrame(),this.x+zeroX,this.y+zeroY,true);
};

EntityFootNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
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
	var objdata = {id:this.id,name:this.getFrame(),x:offsetx,y:offsety,type:this.ntype};
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

function PngNode(name,iconname,x,y,w,h){
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

PngNode.prototype.draw = function(ctx){
	if(this.isvisible)
		drawImg(ctx,this.iconname,this.x,this.y,false,this.w,this.h);
};

PngNode.prototype.setImg = function(iconname){
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
		default:
			layoutBgPool[name] = itemnode;
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
	if(this.isvisible)
		return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
	else
		return  false;
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
	this.isvisible = true;
	this.isdisable = true; 
	this.groupname = '';
	this.active = false;
	this.txtclr ='black';
	this.txtdata = [];
	this.lock = false;
	this.tapdata = null;
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
	if(this.lock)
		drawImg(ctx,'img3142',xp,yp);
	else
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
	if(this.isvisible)
		return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
	else
		return false;
};

IconNode.prototype.getDrawData = function(){
	return {name:this.iconname,x:this.x,y:this.y,type:this.type};
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
	return {name:this.iconname,x:this.x,y:this.y,type:this.type};
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
	this.isvisible = true;
}

IconInfoNode.prototype.draw = function(ctx){
	if(this.isvisible){
		drawImg(ctx,this.bgicon,this.x,this.y,false,this.w,this.h);
		drawImg(ctx,this.txt1,this.x+2,this.y+4);
		drawImg(ctx,this.txt2,this.x+18,this.y+4);
		drawNumSt(ctx,this.num.toString(),this.x+34,this.y+3);
	}
};

IconInfoNode.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

IconInfoNode.prototype.checkTap = function(tapx,tapy){
	return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
};


function IconTxtBtn(name,x,y,w,h,bgicon,text,textclr,handler){
	this.id = increaseId++;
	this.name = name;
	this.bgicon = bgicon;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.ntype = NodeTypeClass.icon;
	this.text = text;
	this.textclr = textclr;
	
	this.handler = handler;
	this.isvisible = true;
	iconPool[this.name] = this;
}

IconTxtBtn.prototype.draw = function(ctx) {
	if (this.isvisible) {
		ctx.textalign = 'center';
		ctx.textBaseline = 'middle';
		drawImg(ctx, this.bgicon, this.x, this.y, false, this.w, this.h);
		var w = ctx.measureText(this.text).width;
		ctx.fillStyle = this.textclr;
		ctx.fillText(this.text, this.x + this.w / 2 - w / 2, this.y + this.h / 2);
	}
};

IconTxtBtn.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};

IconTxtBtn.prototype.checkTap = function(tapx,tapy){
	if(!this.isvisible)
		return false;
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
	drawNumSt(ctx,this.days.toString(),this.x+95,this.y+15);
	drawImg(ctx,'f46_46',this.x+125,this.y+14);
	drawImg(ctx,imgstar,this.x,this.y);
	drawNumSt(ctx,this.hours.toString()+":"+this.minitues.toString(),this.x+90,this.y+31);
	//ctx.fillStyle = clr;
	//ctx.fillText(st,this.x+2,this.y+20);
}


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


function PlantNode(name,type,frames,xpos,ypos,center,data){
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
	this.body = new EntityNode(name,type,frames,this.x-this.w/2,y,ypos,330);
	this.entityid = this.body.id;
	addEntityNode(this);
	this.floorspace = [[xpos,ypos]];
	this.data = data;
	this.floorarea = 1;
}

PlantNode.prototype.draw = function(ctx){
	this.body.draw(ctx);
};


PlantNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
};

PlantNode.prototype.IsInFloorspace = function(xpos,ypos){
	return isInFloorspce(xpos,ypos,this.floorspace);
};

PlantNode.prototype.getDrawData = function(){
	var objdata = { name:this.name,
					id:this.id,
					x:this.x,
					y:this.y,
					type:this.ntype,
					buildtype:this.buildtype
					};
	return objdata;
};

/*
 * 人物
 */
function ManNode(name,data,x,y){
	this.isvisible = true;
	this.x = x;
	this.y = y;
	this.posx = getTilePos(x,y).posx;
	this.posy = getTilePos(x,y).posy;
	this.name = name;
	this.data = data;
	this.id = increaseId ++;
	this.frameIndex = 0;
	this.frameSumTick = 0;
	this.currentAction = 0;
	this.isturn = true;
	this.currentAction = 0;
	this.frameFps = 500;
	this.direct = Direct.down;
	this.speed = 0;
	this.action = manstatus.idle;
};

ManNode.prototype.setAction = function(action){
	this.action = action;
	switch(action){
		case manstatus.idle:
			this.speed = 0;
			if(this.direct == Direct.down){
				this.currentAction = 0;
				this.isturn = false;
			}
			if(this.direct == Direct.up){
				this.currentAction = 1;
				this.isturn = false;
			}
			if(this.direct == Direct.left){
				this.currentAction = 0;
				this.isturn = true;
			}
			if(this.direct == Direct.right){
				this.currentAction = 1;
				this.isturn = true;
			}
			break;
		case manstatus.walk:
			this.speed = 0.1;
			if(this.direct == Direct.down){
				this.currentAction = 2;
				this.isturn = false;
			}
			if(this.direct == Direct.up){
				this.currentAction = 3;
				this.isturn = false;
			}
			if(this.direct == Direct.left){
				this.currentAction = 2;
				this.isturn = true;
			}
			if(this.direct == Direct.right){
				this.currentAction = 3;
				this.isturn = true;
			}
			break;
	}
};

ManNode.prototype.setDirect = function(direct){
	this.direct = direct;
	this.setAction(this.action);
	console.log(this.direct);
}

ManNode.prototype.update = function(){
	if(this.action == manstatus.walk){
		this.setSpeed();
	}
};

ManNode.prototype.setSpeed = function(){
	switch(this.direct){
		case Direct.up:
			this.x -= 2*this.speed;
			this.y -= this.speed;
			break;
		case Direct.down:
			this.x += 2*this.speed;
			this.y += this.speed;
			break;
		case Direct.right:
			this.x += 2*this.speed;
			this.y -= this.speed;
			break;
		case Direct.left:
			this.x -= 2*this.speed;
			this.y += this.speed;
			break;
	}
};

ManNode.prototype.setVisible = function(isvisible){
	this.isvisible = isvisible;
};

ManNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
};

ManNode.prototype.getFrame = function(){
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

ManNode.prototype.getOffsetY = function(){
	if(this.action == manstatus.idle){
		if(this.frameIndex == 0)
			return 1;
		else	
			return 0;
	}
	return 0;
}

ManNode.prototype.draw = function(ctx){
	this.update();
	if(this.isturn)
		drawTurnImg(ctx,this.getFrame(),this.x+zeroX-7,this.y+this.getOffsetY()+zeroY-22,true);
	else
		drawImg(ctx,this.getFrame(),this.x+zeroX-7,this.y+this.getOffsetY()+zeroY-22,true);
};


ManNode.prototype.getDrawData = function(){
	var objdata = {id:this.id,name:this.getFrame(),x:this.x,y:this.y};
	return objdata;
};
