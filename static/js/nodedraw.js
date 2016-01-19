//绘制左边的菜单
function drawLeftMenu(ctx){
	ctx.fillStyle = 'green';
	ctx.roundRect(0,0,50,300,5).fill();
	ctx.strokeStyle = 'white';
	ctx.roundRect(0,0,50,300,5).stroke();
}


//绘制菱形，x,y :中心点
function drawRhombusCenter(ctx,x,y,w,h,clr,clrborder){
	ctx.beginPath();
	ctx.moveTo(x-w/2,y);
	ctx.lineTo(x,y-h/2);
	ctx.lineTo(x+w/2,y);
	ctx.lineTo(x,y+h/2);
	ctx.closePath();
	ctx.fillStyle = clr;
	ctx.fill();
	ctx.strokeStyle = clrborder;
	ctx.stroke();
}
//绘制菱形，x,y:左上角
function drawRhombusLeftTop(ctx,x,y,w,h,clr,clrborder){
	drawRhombusCenter(ctx,x+w/2,y+h/2,w,h,clr,clrborder);
}

//绘制宽高2：1菱形，x,y:中心点
function drawRhombusDoubleCenter(ctx,x,y,h,clr,clrborder){
	drawRhombusCenter(ctx,x,y,2*h,h,clr,clrborder);
}

//绘制宽高2：1菱形，x,y:左上角
function drawRhombusDoubleLeftTop(ctx,x,y,h,clr,clrborder){
	var w = 2*h;
	drawRhombusCenter(ctx,x+w/2,y+h/2,w,h,clr,clrborder);
}

//绘制圆
function drawCircle(ctx,x,y,r,clr,clrborder){
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fillStyle = clr;
	ctx.strokeStyle = clrborder;
	ctx.fill();
	ctx.stroke();
}

//根据矩阵位置绘制
function drawRhombusPos(ctx,h,xpos,ypos){
	var w = 2*h;
	var x = xpos * h;
	var clr = 'yellow';
	var clrborder = 'blue';
	if(xpos %2 == 0){
		var y = ypos * h;
	}else{
		var y = ypos * h + h/2;
		clr = 'white';
	}
	x = x+zeroX;
	y = y+zeroY;
	drawRhombusCenter(ctx,x,y,w,h,clr,clrborder);
	ctx.fillStyle = 'black';
	ctx.fillText(xpos.toString()+':'+ypos.toString(),x-10,y+3);
	
	//drawJsonImg3(ctx,'image 690.png',x-h,y-h/2,w,h);
}

//根据矩阵位置绘制图块，单块
function drawTilePos(ctx,titlename,h,xpos,ypos){
	var w = 2*h;
	var x = xpos * h;
	if(xpos %2 == 0){
		var y = ypos * h;
	}else{
		var y = ypos * h + h/2;
	}
	drawImg(ctx,titlename,x-h,y-h/2,false,w,h);
}

//根据矩阵位置绘制图块
function drawTilePos2(ctx,titlename,h,sh,xpos,ypos){
	var w = 2*h;
	var x = xpos * sh;
	if(xpos %2 == 0){
		var y = ypos * sh;
	}else{
		var y = ypos * sh + sh/2;
	}
	drawImg(ctx,titlename,x-sh,y-sh,false,w,h);
}

//绘制菱形图块地图
function drawRhombusMap(ctx,mapw,maph,clr,clrborder){
	for(var i=0;i<=mapw;i++){
		for(var j=0;j<=maph;j++){
			drawRhombusPos(ctx,baseRhombusHeight,i,j);
		}
	}
}

function drawTileMap(ctx,tilename,w,h){
	for(var i=0;i<=w;i++){
		for(var j=0;j<=h;j++){
			var x = i * baseRhombusHeight;
			var y = j * baseRhombusHeight + baseRhombusHeight/2;
			if(i %2 == 0){
				y = j * baseRhombusHeight;
			}
			x = x+zeroX;
			y = y+zeroY;
			drawImg(ctx,tilename,x-baseRhombusHeight,y-baseRhombusHeight/2);
		}
	}
}

function drawMapRect(ctx,wNum){
	var wRect = stageWidth/wNum;
	var hRect = wRect/2;
	var hNum = stageHeight/hRect;
	
	for(var i=0;i<wNum*2;i++){
		for(var j=0;j<hNum;j++){
			
			if(i%2!=0){
				var x = i * hRect;
				var y = j * hRect;
				ctx.strokeStyle = 'blue';
				ctx.strokeRect(x,y,wRect,hRect);
				ctx.fillText(i.toString()+':'+j.toString(),x+wRect/2-10,y+hRect/2+4);
			}else{
				var x = i * hRect;
				var y = j * hRect/2;
				ctx.strokeStyle = 'yellow';
				ctx.strokeRect(x,y,wRect,hRect);
				ctx.fillText(i.toString()+':'+j.toString(),x+wRect/2-10,y+hRect/2+4);
			}
		}
	}
	
}

//绘制圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r);
        this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r);
        this.arcTo(x, y, x+w, y, r);
        // this.arcTo(x+r, y);
        this.closePath();
        return this;
    }

