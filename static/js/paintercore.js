function checkRoundWall(node){
	var round = getBuildWall(node);
	for(var i=0;i<round.length;i++){
		var item = getBuildNodeByPos(round[i][0],round[i][1]);
		if(item != null && !item.isDraw)
			return true;
	}
	return false;
}

function updateDraw(ctx){
			for(var id in floorpool){
				var floor = floorpool[id];
				floor.draw(ctx);
			}
			drawBackwall(ctx,wallImg,mapInitPosx-1,mapInitPosy-1,userinfo.buildarealv.width+1,userinfo.buildarealv.width+1);
	
			var hadDraw = 0;
			while(buildNums > 0 && hadDraw < buildNums){
				for(var id in entitys){ 
 					var entity = entitys[id];  
 					if(entity.ntype == NodeTypeClass.build && !entity.isDraw && entity.isbuild){
 						if(!checkRoundWall(entity)){
 							entity.draw(ctx);
 							entity.isDraw = true;
 							hadDraw++;
 						}
 					}
 				}
			}
			hadDraw = 0;
			
			for(var id in entitys){ 
 				var entity = entitys[id];  
 				if(entity.ntype == NodeTypeClass.build)
 					entity.isDraw = false;
 				if(entity.isvisible && !entity.isbuild){ 
 					entity.draw(ctx);
 				} 
 			}
			drawFrontwall(ctx,wallImg,mapInitPosx-1,mapInitPosy-1,userinfo.buildarealv.width+1,userinfo.buildarealv.width+1);
			
			for(var name in layoutBgPool){
				var itemnode = layoutBgPool[name];
				itemnode.draw(ctx);
			}
			
			for(var name in groupPool){
				var groupnode = groupPool[name];
				groupnode.draw(ctx);
			}
			for(var name in iconPool){
				var iconnode = iconPool[name];
				iconnode.draw(ctx);
			}
			while(drawOrderPool.length >0){
				drawOrderPool.pop();
			}
			
		}


function checkTwobox(a,b){
	return (Math.abs(a.posx-b.posx) < (a.w+b.w)  && (Math.abs(a.posy -b.posy) < (a.h + b.h)));
}

function checkTwobox(a,b){
	return (Math.abs(a.posx-b.posx) < (a.w+b.w)  && (Math.abs(a.posy -b.posy) < (a.h + b.h)));
}


function drawImg(context,name,x,y,border,w,h){
	var infoobj = jsonObj[name];
	if(infoobj == null){
		console.log('ErrorNameForDrawImage:%s',name);
		return;
	}
	var width = infoobj[2];
	var height = infoobj[3];
	if(w){
		width = w;
		height = h;
	}
	context.drawImage(img_sencha,infoobj[0],infoobj[1],infoobj[2],infoobj[3],x,y,width,height);
	if(border)
		drawPoint(context,x,y,width,height);
}

function drawTurnImg(context,name,x,y,border,w,h){
	var infoobj = jsonObj[name];
	if(infoobj == null){
		console.log('ErrorNameForDrawImage:%s',name);
		return;
	}
	var width = infoobj[2];
	var height = infoobj[3];
	if(w){
		width = w;
		height = h;
	}
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.translate(x,y);
	context.scale(-1,1);
	context.drawImage(img_sencha,infoobj[0],infoobj[1],infoobj[2],infoobj[3],-width,0,width,height);
	context.restore();
	if(border)
		drawPoint(context,x,y,width,height);
}


		
function drawImgCenter(context,name,x,y){
	var imgw = jsonObj[name][4][0];
	var imgh = jsonObj[name][4][1];
	debugger;
	drawScaleImg(context,name,x-imgw/2,y-imgh/2,1);
}
		
function drawPoint(context,x,y,w,h){
			context.fillStyle = "red";
			context.fillRect(x,y,2,2);
			context.strokeStyle = "black";
			context.strokeRect(x,y,w,h);
		}


function drawCircle(context,x,y,r){
	context.fillStyle = "yellow";
	context.beginPath();
	context.arc(x,y,r,0,Math.PI*2,true);
	context.closePath();
	context.fill();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r);
        this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r);
        this.arcTo(x, y, x+w, y, r);
        this.closePath();
        return this;
    }


//flat :1 尖顶 0 平顶
function drawHexagon(ctx,x,y,r,clr,clrborder,flat){
			if(flat == null)
				flat = 0;
			if(clr)
				ctx.fillStyle = clr;
			if(clrborder==null)
				clrborder = clr;
			ctx.strokeStyle = clrborder;
			//ctx.fillRect(x,y,4,4);
			ctx.beginPath();
			var x0 = x;
			var y0 = y;
			var ang = 0;
			for(var i=0;i<12;i++){
				ang = i * (Math.PI/6)+(Math.PI/6*flat);
				x0 = x - r*Math.sin(ang);
				y0 = y + r*Math.cos(ang);
				if(i==0){
					ctx.moveTo(x0,y0);
				}		
				else{
					if(i%2==0)
						ctx.lineTo(x0,y0);
				}
				    
				//ctx.fillText(i.toString(),x0,y0);
			}

			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}


function drawHexagonRoute(ctx,x,y,r,flat){
			if(flat == null)
				flat = 0;
			ctx.strokeStyle = 'red';
			ang = 2 * (Math.PI/6)+(Math.PI/6*flat);
			var x10 = x - r*Math.sin(ang);
			var y10 = y + r*Math.cos(ang);
			ctx.moveTo(x10,y10);
			
			ang = 8 * (Math.PI/6)+(Math.PI/6*flat);
			x10 = x - r*Math.sin(ang);
			y10 = y + r*Math.cos(ang);
			ctx.lineTo(x10,y10);
			ctx.stroke();
		}

function drawHexagonBorder(ctx,x,y,r,clrborder,flat){
			if(flat == null)
				flat = 0;
			
			ctx.strokeStyle = clrborder;
			ctx.beginPath();
			var x0 = x;
			var y0 = y;
			var ang = 0;
			for(var i=0;i<12;i++){
				ang = i * (Math.PI/6)+(Math.PI/6*flat);
				x0 = x - r*Math.sin(ang);
				y0 = y + r*Math.cos(ang);
				if(i==0){
					ctx.moveTo(x0,y0);
				}		
				else{
					if(i%2==0)
						ctx.lineTo(x0,y0);
				}
			}

			ctx.closePath();
			ctx.stroke();
		}



function drawText(ctx,x,y,fontDis,txtArray){
			for(var i=0;i<txtArray.length;i++){
				ctx.fillText(txtArray[i],x,y+i*fontDis);
			}
		}

var numspacedis ={
	'0':9,
	'1':6,
	'2':9,
	'3':9,
	'4':10,
	'5':9,
	'6':9,
	'7':9,
	'8':9,
	'9':9,
	':':6,
	'+':8,
	'-':8,
	'.':5
};
var numsoffsety ={
	'0':0,
	'1':0,
	'2':0,
	'3':0,
	'4':0,
	'5':0,
	'6':0,
	'7':0,
	'8':0,
	'9':0,
	':':3,
	'+':3,
	'-':5,
	'.':10
};
var numurls ={
	'0':'num0',
	'1':'num1',
	'2':'num2',
	'3':'num3',
	'4':'num4',
	'5':'num5',
	'6':'num6',
	'7':'num7',
	'8':'num8',
	'9':'num9',
	':':'numcolon',
	'+':'numplus',
	'-':'numminusbmp',
	'.':'numspotbmp'
};
function drawNumSt(ctx,st,x,y){
	var offsetx = 0;
	for(var i=0;i<st.length;i++){
		var numst = st.slice(i,i+1);
		var num = numurls[numst];
		drawImg(ctx,num,x+offsetx,y+numsoffsety[numst]);
		offsetx += numspacedis[numst];
	}
}


