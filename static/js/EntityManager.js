function BuildNode(name,type,buildtype,x,y,depth){
	this.name = name;
	this.x = x;
	this.y = y;
	this.depth = depth;
	this.isVisble = true;
	this.id = increaseId++;
	this.ntype = type;
	this.buildtype = buildtype;
	/*this.initw = getPngSize(name).w;
	this.inith = getPngSize(name).h;
	this.w = getSizeToMap(this.initw,this.inith).w;
	this.h = getSizeToMap(this.initw,this.inith).h;*/
}

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

function getSizeToMap(initw,inith){
	var nw = Math.round(initw/initTileSize);
	var nh = Math.round(inith/initTileSize);
	return {w:nw * baseRhombusHeight,h:nh*baseRhombusHeight};
}

function EntityNode(name,type,data,x,y,depth,frameFps){
	this.depth = depth || DEFAULT_DEPTH;
	this.frameFps = frameFps || DEFAULT_FPS;
	this.isVisble = true;
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
}
EntityNode.prototype.setVisible = function(isVisible){
	this.isVisble = isVisible;
}


EntityNode.prototype.setPos = function(x,y){
	this.x = x;
	this.y = y;
}

EntityNode.prototype.setDepth = function(depth){
	this.depth = depth;
}

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
	if(this.frameIndex >(this.data[this.currentAction].length -1))
		this.frameIndex = 0;
	
	return this.data[this.currentAction][this.frameIndex];
};

EntityNode.prototype.getDrawData = function(){
	var objdata = {name:this.getFrame(),x:this.x,y:this.y,type:this.ntype,depth:this.depth};
	return objdata;
};

function addEntityNode(entityitem){
	var id = entityitem.id;
	entitys[id] = entityitem;
	return id;
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

ShapeNode.prototype.draw = function(ctx){
	ctx.fillStyle = this.clr;
	ctx.strokeStyle = this.borderclr;
	switch(this.ntype){
		case NodeTypeClass.rect:
			ctx.fillRect(this.x,this.y,this.data.w,this.data.h);
			ctx.strokeRect(this.x,this.y,this.data.w,this.data.h);
			break;
		case NodeTypeClass.roundrect:
			ctx.roundRect(this.x,this.y,this.data.w,this.data.h,this.data.r).fill();
			ctx.roundRect(this.x,this.y,this.data.w,this.data.h,this.data.r).stroke();
			break;
		case NodeTypeClass.circle:
			drawCircle(ctx,this.x,this.y,this.data.r);
			break;
		}
};

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

function IconNodeGroup(name,x,y,w,h,bgclr,borderclr,icons,isvisible){
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
	this.targetRight = x + 55;
	this.disable = false;
	this.isvisible = isvisible;
	this.swipespeed = 12;
}

IconNodeGroup.prototype.draw = function(ctx){
	if(this.swipingRight){
		if(this.x >= this.targetRight){
			this.x = this.targetRight;
			this.swipingRight = false;
			this.swipingLeft = false;
		}else{
			this.setPos(this.x + this.swipespeed,this.inity);
		}
	}else if(this.swipingLeft){
		if(this.x <= this.initx){
			this.x = this.initx;
			this.swipingRight = false;
			this.swipingLeft = false;
			this.isvisible = false;
		}else{
			this.setPos(this.x -this.swipespeed,this.inity)
		}
	}
	ctx.fillStyle = this.bgclr;
	ctx.strokeStyle = this.borderclr;
	ctx.roundRect(this.x,this.y,this.w,this.h,3).fill();
	ctx.roundRect(this.x,this.y,this.w,this.h,3).stroke();
	for(var i=0;i<this.icons.length;i++){
		var iconnode = this.icons[i];
		iconnode.draw(ctx);
	}
};

IconNodeGroup.prototype.checkTap = function(tapx,tapy){
	return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);	
};

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


function IconNode(name,iconname,x,y,w,h,defaultBgclr,activeBgclr,handler){
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
	this.handler = handler;
	this.depth = 1000;
	this.isVisble = true;
}

IconNode.prototype.draw = function(ctx){
	var iconobj = getPngSize(this.iconname);
	var w = iconobj.w;
	var h = iconobj.h;
	ctx.fillStyle = this.defaultBgclr;
	ctx.roundRect(this.x,this.y,this.w,this.h,3).fill();
	var xp = this.x + (this.w/2 - w/2);
	var yp = this.y + (this.h/2 - h/2);
	drawImg(ctx,this.iconname,xp,yp);
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
