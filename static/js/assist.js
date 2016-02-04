function $(id){
	return document.getElementById(id);
}

function getPngSize(name){
	var data = jsonObj[name];
	return {w:data[2],h:data[3]};
}

function getDis(x1,y1,x2,y2){
	return Math.sqrt(getDisSquare(x1,y1,x2,y2));
}

function getDisSquare(x1,y1,x2,y2){
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function checkPointInBox(x,y,boxX,boxY,boxW,boxH){
	return (x >boxX) && (x< boxX+boxW) && (y > boxY) && (y< boxY+boxH);
}

window.ontouchstart = function(e) { e.preventDefault(); };



function getMaincanvas(){
	return $(CANVASID);
}

//新的坐标系下，取得Tile 右，右下，下 和自身 4个图块
function getTile_rigntup(xpos,ypos){
	return [[xpos,ypos],[xpos+1,ypos],[xpos+1,ypos+1],[xpos,ypos+1]];
}

//新坐标系下，取得点击坐标
function getTilePos(x,y){
	var xpos = Math.floor(x/baseRhombusWidth - y/baseRhombusHeight);
	var ypos = Math.floor(x/baseRhombusWidth + y/baseRhombusHeight);
	var roundArray = getTile_rigntup(xpos,ypos);
	var dis = 10000000;
	var targetX = -10000;
	var targetY = -10000;
	for(var i=0;i<roundArray.length;i++){
		var tilex = roundArray[i][0];
		var tiley = roundArray[i][1];
		var pixAr = getPixByPosTile(tilex,tiley);
		var pixX =  pixAr[0];
		var pixY =  pixAr[1];
		var tmpdis = getDisSquare(x,y,pixX,pixY);
		if(dis > tmpdis){
			dis = tmpdis;
			targetX = tilex;
			targetY = tiley;
		}
	}
	console.log('tapx:%d tapy:%d',targetX,targetY);
	return {posx:targetX,posy:targetY};	
}


/*
 * 新坐标系下，根据整数坐标取得像素坐标
 */
function getPixByPosTile(xpos,ypos){
	var x = xpos*baseRhombusHeight +ypos*baseRhombusHeight;
	var y = -xpos*baseRhombusHeight/2+ypos*baseRhombusHeight/2;
	return [x,y];
}

function getOffsetXY(floorarea,xpos,ypos) {
	var x,y,posx,posy,roundAr;
	var posobj = getPixByPosTile(xpos,ypos);
	if (floorarea == 1) {
		x = posobj[0] - baseRhombusWidth / 2;
		y = posobj[1] - baseRhombusHeight/2;
		posx = xpos;
		posy = ypos;
		roundAr = getRound1ByLeftTop(posx, posy);
	} else	if (floorarea == 4) {
		x = posobj[0] - baseRhombusWidth - baseRhombusWidth / 2;
		y = posobj[1] - baseRhombusHeight;
		posx = xpos - 1;
		posy = ypos - 1;
		roundAr = getRound4ByLeftTop(posx, posy);
	} else if (floorarea == 6) {
		x = posobj[0] - baseRhombusWidth;
		y = posobj[1] - baseRhombusHeight;
		posx = xpos - 1;
		posy = ypos;
		roundAr = getRound6ByLeftTop(posx, posy);
	} else if (floorarea == 8) {
		x = posobj[0] - 1.5 * baseRhombusWidth;
		y = posobj[1] - 1 * baseRhombusHeight;
		posx = xpos - 1;
		posy = ypos - 1;
		roundAr = getRound2x4ByLeftTop(posx, posy);
	} else if (floorarea == 9) {
		x = posobj[0] - 1.5 * baseRhombusWidth;
		y = posobj[1] - 1.5 * baseRhombusHeight;
		posx = xpos - 1;
		posy = ypos - 1;
		roundAr = getRound9ByLeftTop(posx, posy);
	} else if(floorarea == 12){
		x = posobj[0] - 2*baseRhombusWidth;
		y = posobj[1] - 2.5*baseRhombusHeight;
		posx = xpos-1;
		posy = ypos-2;
		roundAr = getRound12ByLeftTop(posx, posy);
	}else if(floorarea == 16){
		x = posobj[0] - 2*baseRhombusWidth;
		y = posobj[1] - 2.5*baseRhombusHeight;
		posx = xpos-1;
		posy = ypos-2;
		roundAr = getRound16ByLeftTop(posx, posy);
	}
	return {x:x,y:y,posx:posx,posy:posy,roundAr:roundAr};
}

/**
 * 检查边界
 */
function checkEdage(xpos,ypos){
	return (xpos < mapInitPosx ||
		   xpos > mapInitPosx + userinfo.buildarealv.width ||
		   ypos < mapInitPosy ||
		   ypos > mapInitPosy + userinfo.buildarealv.width);
}

/*
 * 取得该坐标地板Node
 */
function getFloorNodeByPos(xpos,ypos){
	for(var id in floorpool){
		var floor = floorpool[id];
		if(floor.xpos == xpos && floor.ypos== ypos){
			return floor;
		}
	}
	return null;
}

function getBuildWall(node){
	var x = node.posx;
	var y = node.posy;
	switch(node.data.floorarea){
		case 1:
			return [[x,y-1],[x+1,y-1],[x+1,y]];
		case 4:
			return [[x,y-1],[x+1,y-1],[x+2,y-1],
					[x+2,y],[x+2,y+1]];
		case 6:
			return [[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],
					[x+3,y],[x+3,y+1]];
		case 8:
			return [[x,y-1],[x+1,y-1],[x+2,y-1],
					[x+2,y],[x+2,y+1],[x+2,y+2],[x+2,y+3]];
		case 9:
			return [[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],
					[x+3,y],[x+3,y+1],[x+3,y+2]];
		case 12:
			return [[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],[x+4,y-1],
					[x+4,y],[x+4,y+1],[x+4,y+2]];
		case 16:
			return [[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],[x+4,y-1],
					[x+4,y],[x+4,y+1],[x+4,y+2],[x+4,y+3]];			
	}
}

//取得该坐标上面的建筑
function getBuildNodeByPos(xpos,ypos){
	for(var id in entitys){
		var node = entitys[id];
		if(node.ntype == NodeTypeClass.build){
			if(node.IsInFloorspace(xpos,ypos))
				return node;
		}
	}
	return null;
}


function getCoorBuildByPos(xpos,ypos){
	for(var id in entitys){
		var node = entitys[id];
		if(node.posx == xpos && node.posy == ypos){
			return node;
		}
	}
}

//根据整数坐标取得菱形中心像素坐标
function getPixelByPos(xpos,ypos){
	var x = xpos * baseRhombusHeight;
	if(xpos % 2 == 0){
		var y = ypos * baseRhombusHeight;
		clr = 'yellow';
	}else{
		var y = ypos * baseRhombusHeight + baseRhombusHeight/2;
	}
	return {xpix:x,ypix:y}
}


//取得周围的四个相邻图块
function getRoundTiles(xpos,ypos){
	return [[xpos-1,ypos-1],[xpos-1,ypos],[xpos+1,ypos-1],[xpos+1,ypos]];
}

//取得点击最近中心的图块整数坐标
function getCloseTile(tapx,tapy){
	var ctapx = tapx+baseRhombusHeight;
	var ctapy = tapy+baseRhombusHeight/2;
				
	var x1 = Math.floor(ctapx / baseRhombusWidth);
	var y1 = Math.floor(ctapy /baseRhombusHeight);
				
	var x2 = x1 *2;
	var y2 = y1;
	
	var targetX = x2;
	var targetY = y2;
	var roundAr = getRoundTiles(x2,y2);
	
	var posObj = getPixelByPos(x2,y2);
	var dis = getDisSquare(tapx,tapy,posObj.xpix,posObj.ypix);
	for(var i=0;i<roundAr.length;i++){
		var xpos = roundAr[i][0];
		var ypos = roundAr[i][1];
		var obj = getPixelByPos(xpos,ypos);
		var disCompare = getDisSquare(tapx,tapy,obj.xpix,obj.ypix);
		if(disCompare < dis){
			dis = disCompare;
			targetX = xpos;
			targetY = ypos;
		}
	}
	//console.log('点击的坐标：  %d:%d',targetX,targetY);
	return [targetX,targetY];
}

function GetPosInBuild(xpos,ypos){
	for (var id in entitys) {
		var item = entitys[id];
		if (item.ntype == NodeTypeClass.build) {
			var floorspace = item.floorspace;
			if(floorspace != null){
				var find = isInFloorspce(xpos, ypos,floorspace);
				if (find) {
					return item;
				}
			}
		}
	}
	return null;
}

function getRound1ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos]
	]
}

function getRound4ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos],[xpos+1,ypos],[xpos+1,ypos+1],[xpos,ypos+1]
	]
}

function getRound6ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos],[xpos+1,ypos],[xpos+2,ypos],
		[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1]
	]
}

function getRound9ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos],  [xpos+1,ypos],  [xpos+2,ypos],
		[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1],
		[xpos,ypos+2],[xpos+1,ypos+2],[xpos+2,ypos+2]
	]
}

function getRound12ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos],  [xpos+1,ypos],  [xpos+2,ypos],  [xpos+3,ypos],
		[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1],[xpos+3,ypos+1],
		[xpos,ypos+2],[xpos+1,ypos+2],[xpos+2,ypos+2],[xpos+3,ypos+2]
	]
}

function getRound16ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos],  [xpos+1,ypos],  [xpos+2,ypos],  [xpos+3,ypos],
		[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1],[xpos+3,ypos+1],
		[xpos,ypos+2],[xpos+1,ypos+2],[xpos+2,ypos+2],[xpos+3,ypos+2],
		[xpos,ypos+3],[xpos+1,ypos+3],[xpos+2,ypos+3],[xpos+3,ypos+3]
	]
}

function getRound2x4ByLeftTop(xpos,ypos){
	return [
		[xpos,ypos],  [xpos+1,ypos], 
		[xpos,ypos+1],[xpos+1,ypos+1],
		[xpos,ypos+2],[xpos+1,ypos+2],
		[xpos,ypos+3],[xpos+1,ypos+3],
	]
}

function getExit4ByLeftTop(x,y){
		return [
			[x-1,y],[x-1,y+1],[x,y+2],[x+1,y+2]
		]
}

function isInFloorspce(x,y,floorspaceArray){
	var re = false;
	for(var i=0;i<floorspaceArray.length;i++){
		var itemtarget = floorspaceArray[i];
		if(itemtarget[0]==x && itemtarget[1]==y){
			re = true;
			break;
		}
	}
	return re;
}

function isInRhombus4(x,y){
	var target = getRound4ByLeftTop(x,y);
	var re = false;
	for(var i=0;i<target.length;i++){
		var itemtarget = target[i];
		if(itemtarget[0]==x && itemtarget[1]==y){
			re = true;
			break;
		}
	}
	return re;
}

function easeFrom(pos) {
	var dis = Math.pow(pos,4);
	if(dis < 1)
		return 2;
	return Math.pow(pos,4);
	
};

function  easeOutCubic(pos){
    return (Math.pow((pos-1), 3) +1)
};
