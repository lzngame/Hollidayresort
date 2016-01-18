function updateDraw(ctx){
			for(var id in entitys){
				var entity = entitys[id];
				if(entity.isVisble){
					var dataObj = entity.getDrawData();
					drawPool.push(dataObj);
				}
			}
			if(drawPool.length > 0)
				drawPool.sort(orderDepthNode);
			for(var i=0;i<drawPool.length;i++){
				var data = drawPool[i];

				data.x = data.x + zeroX;
				data.y = data.y + zeroY;
				if(data.type == NodeTypeClass.tile){
					drawJsonImg3(ctx,data.name,data.x,data.y,baseRhombusWidth,baseRhombusHeight,true,true);
				}else if(data.type == NodeTypeClass.entityitem){
					drawJsonImg(ctx,data.name,data.x,data.y,true,true);
				}else if(data.type == NodeTypeClass.build){
					var databuild = builddata[data.buildtype];
					for(var name in  databuild){
						var item = databuild[name];
						var x = data.x + item[0];
						var y = data.y + item[1];
						drawJsonImg(ctx,name,x,y,true,true);
					}
				}
			}
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
			while(drawPool.length >0){
				drawPool.pop();
			}
		}
		
function orderDepthNode(nodeA,nodeB){
			if(nodeA.depth > nodeB.depth)	
				return 1;
			else if(nodeA.depth < nodeB.depth)
				return -1;
			else 
				return 0;
		}
		
function drawScaleImg(context,name,x,y,scale){
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(true){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.drawImage(img_sencha,dx,dy,dw,dh,x+rectX,y+rectY,dw*scale,dh*scale);
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.drawImage(img_sencha,dx,dy,dh,dw,-dh*scale-rectY,rectX,dh*scale,dw*scale);
				context.restore();
			}
		};
		
function drawImg(context,name,x,y){
	drawJsonImg(context,name,x,y,true,false);
}

function drawPng(context,name,x,y,w,h,border){
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			context.drawImage(img_sencha,dx,dy,dw,dh,x,y,w,h);
			if(border)
				drawPoint(context,x,y,w,h);
}

function drawJsonImg(context,name,x,y,init,border,boxoffsetX,boxoffsetY){
			if(!boxoffsetX)
				boxoffsetX = 0;
			if(!boxoffsetY)
				boxoffsetY = 0;
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(!init){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.drawImage(img_sencha,dx,dy,dw,dh,x+rectX+boxoffsetX,y+rectY+boxoffsetY,dw,dh);
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.drawImage(img_sencha,dx,dy,dh,dw,-dh-rectY+boxoffsetY,rectX+boxoffsetX,dh,dw);
				context.restore();
			}
			if(border)
				drawPoint(context,x,y,initW,initH);
		};

function drawJsonImg2(name,x,y,init,border,boxoffsetX,boxoffsetY){
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(!init){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.save();
				context.setTransform(1,0,0,1,0,0);
				context.translate(x,y);
				context.scale(-1,1);
				context.drawImage(img_sencha,dx,dy,dw,dh,-rectX-dw+boxoffsetX,rectY+boxoffsetY,dw,dh);
				context.restore();
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.scale(1,-1)
				context.drawImage(img_sencha,dx,dy,dh,dw,-dh-rectY+boxoffsetY,-dw-(initW-dw-rectX)+boxoffsetX,dh,dw);
				context.restore();
			}
			if(border)
				drawPoint(context,x,y,initW,initH);
		};
		
function drawJsonImg3(context,name,x,y,mw,mh,init,border,boxoffsetX,boxoffsetY){
			if(!boxoffsetX)
				boxoffsetX = 0;
			if(!boxoffsetY)
				boxoffsetY = 0;
			var data = jsonObj[name];
			if(data == null){
				console.log('ErrorName:%s',name);
			}
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(!init){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.drawImage(img_sencha,dx,dy,dw,dh,x+rectX+boxoffsetX,y+rectY+boxoffsetY,mw,mh);
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.drawImage(img_sencha,dx,dy,dh,dw,-mh-rectY+boxoffsetY,rectX+boxoffsetX,mh,mw);
				context.restore();
			}
			if(border)
				drawPoint(context,x,y,mw,mh);
		};
		
function drawImgCenter(context,name,x,y){
	var imgw = jsonObj[name][4][0];
	var imgh = jsonObj[name][4][1];
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
        //if (w < 2 * r) r = w / 2;
        //if (h < 2 * r) r = h / 2;
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

//var numWidths ={[9,6,9,9,10,9,9,9,9,9];}
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
		drawJsonImg(ctx,num,x+offsetx,y+numsoffsety[numst],true,false,0,0);
		offsetx += numspacedis[numst];
	}
}


