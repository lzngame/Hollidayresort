function $(id){
	return document.getElementById(id);
}

function getPngSize(name){
	var data = jsonObj[name];
	
	var d1 = data[0];
	var dw = d1[2];
	var dh = d1[3];
	var initW = data[4][0];
	var initH = data[4][1];
	return {w:dw,h:dh};
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

function getRound4ByLeftTop(x,y){
	if(x % 2== 0){
		return [
			[x,y],[x+1,y-1],[x+1,y],[x+2,y]
		]
	}else{
		return [
			[x,y],[x+1,y],[x+1,y+1],[x+2,y]
		]
	}
}

function getExit4ByLeftTop(x,y){
	if(x %2 == 0){
		return [
			[x-1,y],[x,y+1],[x+2,y+1],[x+3,y]
		]
	}else{
		return [
			[x-1,y+1],[x,y+1],[x+2,y+1],[x+3,y+1]
		]
	}
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
