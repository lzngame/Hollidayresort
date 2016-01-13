function EntityNode(name,data,x,y,depth,frameFps){
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
	this.type = NodeTypeClass.entityitem;
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
}

EntityNode.prototype.getDrawData = function(){
	var objdata = {name:this.getFrame(),x:this.x,y:this.y,type:this.type,depth:this.depth};
	return objdata;
};

function addEntityNode(entityitem){
	var id = entityitem.id;
	entitys[id] = entityitem;
	return id;
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
}

function addBgPool(shapenode){
	var name = shapenode.name;
	layoutBgPool[name] = shapenode;
	return shapenode;
}

function IconNodeGroup(name,x,y,w,h,bgclr){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.bgclr = bgclr;
}


function IconNode(name,iconname,x,y,w,h,defaultBgclr,activeBgclr,handler){
	this.id = increaseId++;
	this.name = name;
	this.iconname = iconname;
	this.x = x;
	this.y = y;
	this.w = w;
	this.y = y;
	this.ntype = NodeTypeClass.icon;
	this.defaultBgclr = defaultBgclr;
	this.activeBgclr = activeBgclr;
	this.handler = handler;
	this.depth = 1000;
	this.isVisble = true;
}

IconNode.prototype.getDrawData = function(){
	return {name:this.iconname,x:this.x,y:this.y,type:this.type,depth:this.depth};
}
