function $(id){return document.getElementById(id)}function getPngSize(name){var data=jsonObj[name];return{w:data[2],h:data[3]}}function getDis(x1,y1,x2,y2){return Math.sqrt(getDisSquare(x1,y1,x2,y2))}function getDisSquare(x1,y1,x2,y2){return(x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)}function checkPointInBox(x,y,boxX,boxY,boxW,boxH){return x>boxX&&x<boxX+boxW&&y>boxY&&y<boxY+boxH}window.ontouchstart=function(e){e.preventDefault()};function getMaincanvas(){return $(CANVASID)}function getTile_rigntup(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos+1,ypos+1],[xpos,ypos+1]]}function getTilePos(x,y){var xpos=Math.floor(x/baseRhombusWidth-y/baseRhombusHeight);var ypos=Math.floor(x/baseRhombusWidth+y/baseRhombusHeight);var roundArray=getTile_rigntup(xpos,ypos);var dis=1e7;var targetX=-1e4;var targetY=-1e4;for(var i=0;i<roundArray.length;i++){var tilex=roundArray[i][0];var tiley=roundArray[i][1];var pixAr=getPixByPosTile(tilex,tiley);var pixX=pixAr[0];var pixY=pixAr[1];var tmpdis=getDisSquare(x,y,pixX,pixY);if(dis>tmpdis){dis=tmpdis;targetX=tilex;targetY=tiley}}console.log("tapx:%d tapy:%d",targetX,targetY);return{posx:targetX,posy:targetY}}function getPixByPosTile(xpos,ypos){var x=xpos*baseRhombusHeight+ypos*baseRhombusHeight;var y=-xpos*baseRhombusHeight/2+ypos*baseRhombusHeight/2;return[x,y]}function getOffsetXY(floorarea,xpos,ypos){var x,y,posx,posy,roundAr;var posobj=getPixByPosTile(xpos,ypos);if(floorarea==1){x=posobj[0]-baseRhombusWidth/2;y=posobj[1]-baseRhombusHeight/2;posx=xpos;posy=ypos;roundAr=getRound1ByLeftTop(posx,posy)}else if(floorarea==4){x=posobj[0]-baseRhombusWidth-baseRhombusWidth/2;y=posobj[1]-baseRhombusHeight;posx=xpos-1;posy=ypos-1;roundAr=getRound4ByLeftTop(posx,posy)}else if(floorarea==6){x=posobj[0]-baseRhombusWidth;y=posobj[1]-baseRhombusHeight;posx=xpos-1;posy=ypos;roundAr=getRound6ByLeftTop(posx,posy)}else if(floorarea==8){x=posobj[0]-1.5*baseRhombusWidth;y=posobj[1]-1*baseRhombusHeight;posx=xpos-1;posy=ypos-1;roundAr=getRound2x4ByLeftTop(posx,posy)}else if(floorarea==9){x=posobj[0]-1.5*baseRhombusWidth;y=posobj[1]-1.5*baseRhombusHeight;posx=xpos-1;posy=ypos-1;roundAr=getRound9ByLeftTop(posx,posy)}else if(floorarea==12){x=posobj[0]-2*baseRhombusWidth;y=posobj[1]-2.5*baseRhombusHeight;posx=xpos-1;posy=ypos-2;roundAr=getRound12ByLeftTop(posx,posy)}else if(floorarea==16){x=posobj[0]-2*baseRhombusWidth;y=posobj[1]-2.5*baseRhombusHeight;posx=xpos-1;posy=ypos-2;roundAr=getRound16ByLeftTop(posx,posy)}return{x:x,y:y,posx:posx,posy:posy,roundAr:roundAr}}function checkEdage(xpos,ypos){return xpos<mapInitPosx||xpos>mapInitPosx+userinfo.buildarealv.width||ypos<mapInitPosy||ypos>mapInitPosy+userinfo.buildarealv.width}function getFloorNodeByPos(xpos,ypos){for(var gid in floorpool){var floor=floorpool[gid];if(floor.xpos==xpos&&floor.ypos==ypos){return floor}}return null}function getBuildWall(node){var x=node.posx;var y=node.posy;switch(node.data.floorarea){case 1:return[[x,y-1],[x+1,y-1],[x+1,y]];case 4:return[[x,y-1],[x+1,y-1],[x+2,y-1],[x+2,y],[x+2,y+1]];case 6:return[[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],[x+3,y],[x+3,y+1]];case 8:return[[x,y-1],[x+1,y-1],[x+2,y-1],[x+2,y],[x+2,y+1],[x+2,y+2],[x+2,y+3]];case 9:return[[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],[x+3,y],[x+3,y+1],[x+3,y+2]];case 12:return[[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],[x+4,y-1],[x+4,y],[x+4,y+1],[x+4,y+2]];case 16:return[[x,y-1],[x+1,y-1],[x+2,y-1],[x+3,y-1],[x+4,y-1],[x+4,y],[x+4,y+1],[x+4,y+2],[x+4,y+3]]}}function getBuildNodeByPos(xpos,ypos){for(var gid in entitys){var node=entitys[gid];if(node.ntype==NodeTypeClass.build){if(node.IsInFloorspace(xpos,ypos))return node}}return null}function getCoorBuildByPos(xpos,ypos){for(var gid in entitys){var node=entitys[gid];if(node.posx==xpos&&node.posy==ypos){return node}}}function getPixelByPos(xpos,ypos){var x=xpos*baseRhombusHeight;if(xpos%2==0){var y=ypos*baseRhombusHeight;clr="yellow"}else{var y=ypos*baseRhombusHeight+baseRhombusHeight/2}return{xpix:x,ypix:y}}function getRoundTiles(xpos,ypos){return[[xpos-1,ypos-1],[xpos-1,ypos],[xpos+1,ypos-1],[xpos+1,ypos]]}function getCloseTile(tapx,tapy){var ctapx=tapx+baseRhombusHeight;var ctapy=tapy+baseRhombusHeight/2;var x1=Math.floor(ctapx/baseRhombusWidth);var y1=Math.floor(ctapy/baseRhombusHeight);var x2=x1*2;var y2=y1;var targetX=x2;var targetY=y2;var roundAr=getRoundTiles(x2,y2);var posObj=getPixelByPos(x2,y2);var dis=getDisSquare(tapx,tapy,posObj.xpix,posObj.ypix);for(var i=0;i<roundAr.length;i++){var xpos=roundAr[i][0];var ypos=roundAr[i][1];var obj=getPixelByPos(xpos,ypos);var disCompare=getDisSquare(tapx,tapy,obj.xpix,obj.ypix);if(disCompare<dis){dis=disCompare;targetX=xpos;targetY=ypos}}return[targetX,targetY]}function GetPosInBuild(xpos,ypos){for(var gid in entitys){var item=entitys[gid];if(item.ntype==NodeTypeClass.build){var floorspace=item.floorspace;if(floorspace!=null){var find=isInFloorspce(xpos,ypos,floorspace);if(find){return item}}}}return null}function getRound1ByLeftTop(xpos,ypos){return[[xpos,ypos]]}function getRound4ByLeftTop(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos+1,ypos+1],[xpos,ypos+1]]}function getRound6ByLeftTop(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos+2,ypos],[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1]]}function getRound9ByLeftTop(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos+2,ypos],[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1],[xpos,ypos+2],[xpos+1,ypos+2],[xpos+2,ypos+2]]}function getRound12ByLeftTop(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos+2,ypos],[xpos+3,ypos],[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1],[xpos+3,ypos+1],[xpos,ypos+2],[xpos+1,ypos+2],[xpos+2,ypos+2],[xpos+3,ypos+2]]}function getRound16ByLeftTop(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos+2,ypos],[xpos+3,ypos],[xpos,ypos+1],[xpos+1,ypos+1],[xpos+2,ypos+1],[xpos+3,ypos+1],[xpos,ypos+2],[xpos+1,ypos+2],[xpos+2,ypos+2],[xpos+3,ypos+2],[xpos,ypos+3],[xpos+1,ypos+3],[xpos+2,ypos+3],[xpos+3,ypos+3]]}function getRound2x4ByLeftTop(xpos,ypos){return[[xpos,ypos],[xpos+1,ypos],[xpos,ypos+1],[xpos+1,ypos+1],[xpos,ypos+2],[xpos+1,ypos+2],[xpos,ypos+3],[xpos+1,ypos+3]]}function getExit4ByLeftTop(x,y){return[[x-1,y],[x-1,y+1],[x,y+2],[x+1,y+2]]}function isInFloorspce(x,y,floorspaceArray){var re=false;for(var i=0;i<floorspaceArray.length;i++){var itemtarget=floorspaceArray[i];if(itemtarget[0]==x&&itemtarget[1]==y){re=true;break}}return re}function isInRhombus4(x,y){var target=getRound4ByLeftTop(x,y);var re=false;for(var i=0;i<target.length;i++){var itemtarget=target[i];if(itemtarget[0]==x&&itemtarget[1]==y){re=true;break}}return re}function easeFrom(pos){var dis=Math.pow(pos,4);if(dis<1)return 2;return Math.pow(pos,4)}function easeOutCubic(pos){return Math.pow(pos-1,3)+1}bigfourgame.clock=new function(){var self=this;var lastTime=0;var systemTime=0;var tick=0;var frameCount=0;var tickSum=0;var fps=0;self.update=function(){var now=+new Date;var interval=now-lastTime;if(interval==0)interval=1;fps=Math.floor(1e3/interval);tick=now-lastTime;if(tick>1e3)tick=0;systemTime+=tick;lastTime=now;frameCount++;if(fps==Infinity)console.log(lastTime);return fps};self.getTick=function(){return tick};self.getGameTime=function(){return systemTime}};function BuildNode(name,type,buildtype,x,y,floorspace,posx,posy){this.name=name;this.x=x;this.y=y;this.isvisible=true;this.gid=increaseId++;this.ntype=type;this.buildtype=buildtype;this.floorspace=floorspace;this.posx=posx;this.posy=posy;this.lv=1;this.isturn=false;this.alpha=1;this.waiter=null;this.furnitiure=null;this.data=null;this.isDraw=false;this.isbuild=true;addEntityNode(this);this.exp=40;this.buildday=resortclock.getDays();this.currentday=this.buildday}BuildNode.prototype.setAlpha=function(a){this.alpha=a};BuildNode.prototype.IsInFloorspace=function(xpos,ypos){return isInFloorspce(xpos,ypos,this.floorspace)};BuildNode.prototype.draw=function(ctx){var databuild=builddata[this.buildtype];for(var name in databuild){var item=databuild[name];var x=this.x+item[0];var y=this.y+item[1];ctx.globalAlpha=this.alpha;if(this.isturn)drawTurnImg(ctx,item[this.lv+1],x+zeroX,y+zeroY);else drawImg(ctx,item[this.lv+1],x+zeroX,y+zeroY);ctx.globalAlpha=1;if(this.expline)this.expline.draw(ctx)}if(this.waiter!=null){this.waiter.draw(ctx)}if(this.waiter2!=null){this.waiter2.draw(ctx)}if(this.furnitiure!=null){this.furnitiure.draw(ctx)}if(this.furnitiure2!=null){this.furnitiure2.draw(ctx)}this.update()};BuildNode.prototype.setPos=function(x,y){this.x=x;this.y=y;var obj=getTilePos(x,y);this.posx=obj.posx;this.posy=obj.posy};BuildNode.prototype.setPosCoor=function(posx,posy){var dataobj=getOffsetXY(this.data.floorarea,posx,posy);this.x=dataobj.x;this.y=dataobj.y;this.posx=dataobj.posx;this.posy=dataobj.posy;this.floorspace=dataobj.roundAr};BuildNode.prototype.upLv=function(){if(this.lv<3){this.lv++;return true}else{return false}};BuildNode.prototype.update=function(){if(this.currentday!=resortclock.getDays()){this.buildday++;this.currentday=resortclock.getDays();userinfo.money+=this.getServicePrice();userinfo.currentexp+=1;if(userinfo.currentexp>=lvexp[userinfo.lv]){userinfo.currentexp=0;userinfo.lv++;userExpline.setTotal(lvexp[userinfo.lv]);userExpline.reset(0)}setUiUserdata()}};BuildNode.prototype.ismaxlv=function(){return this.lv==3};BuildNode.prototype.getServicePrice=function(){var price=0;if(!this.data.lv1day)return price;if(this.lv==1)price=this.data.lv1day;else if(this.lv==2)price=this.data.lv2day;else price=this.data.lv3day;return price};BuildNode.prototype.getServiceNote=function(){var price=this.getServicePrice();if(price==0){return warntext.servicenote+":"+warntext.freeservice}else{return warntext.servicenote+":"+price.toString()}};function EntityNode(name,type,data,x,y,frameFps){this.frameFps=frameFps||DEFAULT_FPS;this.isvisible=true;this.x=x;this.y=y;this.name=name;if(typeof data=="object")this.data=data;else this.data=[[data]];this.gid=increaseId++;this.frameIndex=0;this.frameSumTick=0;this.currentAction=0;this.ntype=type;this.isturn=false}EntityNode.prototype.setVisible=function(isvisible){this.isvisible=isvisible};EntityNode.prototype.setPos=function(x,y){this.x=x;this.y=y};EntityNode.prototype.getFrame=function(){if(this.data[0].length==1){var obj=this.data[0];return obj[0]}if(this.frameSumTick>this.frameFps){this.frameSumTick=0;this.frameIndex++}else{this.frameSumTick+=bigfourgame.clock.getTick()}if(this.frameIndex>this.data[this.currentAction].length-1){this.frameIndex=0}return this.data[this.currentAction][this.frameIndex]};EntityNode.prototype.draw=function(ctx){if(this.isturn)drawTurnImg(ctx,this.getFrame(),this.x+zeroX,this.y+zeroY);else drawImg(ctx,this.getFrame(),this.x+zeroX,this.y+zeroY)};function EntityFootNode(name,type,data,x,y,frameFps,autodel,lastFunc,lastdata){this.frameFps=frameFps;this.isvisible=true;this.x=x;this.y=y;this.name=name;if(typeof data=="object")this.data=data;else this.data=[[data]];this.gid=increaseId++;this.frameIndex=0;this.frameSumTick=0;this.currentAction=0;this.ntype=type;this.autodel=autodel;this.lastFunc=lastFunc;this.lastFuncdata=lastdata}EntityFootNode.prototype.setVisible=function(isvisible){this.isvisible=isvisible};EntityFootNode.prototype.lastFrameFun=function(){console.log("最后一帧执行")};EntityFootNode.prototype.draw=function(ctx){drawImg(ctx,this.getFrame(),this.x+zeroX,this.y+zeroY,true)};EntityFootNode.prototype.setPos=function(x,y){this.x=x;this.y=y};EntityFootNode.prototype.getFrame=function(){if(this.data[0].length==1){var obj=this.data[0];return obj[0]}if(this.frameSumTick>this.frameFps){this.frameSumTick=0;this.frameIndex++}else{this.frameSumTick+=bigfourgame.clock.getTick()}if(this.frameIndex>this.data[this.currentAction].length-1){this.frameIndex=0;if(this.lastFunc!=null){this.lastFunc(this.lastFuncdata)}if(this.autodel){delete entitys[this.gid]}}return this.data[this.currentAction][this.frameIndex]};EntityFootNode.prototype.getSize=function(){var name=getPngSize(this.getFrame())};EntityFootNode.prototype.getDrawData=function(){var pngname=this.getFrame();var size=getPngSize(pngname);var offsetx=this.x-size.w/2;var offsety=this.y-size.h;var objdata={gid:this.gid,name:this.getFrame(),x:offsetx,y:offsety,type:this.ntype};return objdata};function addEntityNode(entityitem){var gid=entityitem.gid;entitys[gid]=entityitem;return gid}function deleteEntity(gid){if(typeof gid=="number")delete entitys[gid];else delete entitys[gid.gid]}function getTypeNode(name,typeclass){switch(typeclass){case NodeTypeClass.icon:return iconPool[name];break;case NodeTypeClass.icongroup:return groupPool[name];brek}}function ShapeNode(name,shapetype,clr,borderclr,x,y,data){this.name=name;this.ntype=shapetype;this.x=x;this.y=y;this.clr=clr;this.borderclr=borderclr;this.data=data}function ShapeCircle(name,clr,borderclr,x,y,r){this.name=name;this.x=x;this.y=y;this.ntype=NodeTypeClass.circle;this.x=x;this.y=y;this.r=r}ShapeCircle.prototype.draw=function(ctx){ctx.fillStyle=this.clr;ctx.strokeStyle=this.borderclr;drawCircle(ctx,this.x,this.y,this.data.r)};function LvNode(name,iconname,x,y,n,size){this.x=x;this.y=y;this.name=name;this.n=n;this.iconname=iconname;this.size=size;layoutBgPool[name]=this}LvNode.prototype.draw=function(ctx){for(var i=0;i<this.n;i++){var y=this.y;var x=this.x+i*this.size;drawImg(ctx,this.iconname,x,y,false,this.size,this.size)}};LvNode.prototype.setLv=function(n){this.n=n};function PngNode(name,iconname,x,y,w,h){this.name=name;this.iconname=iconname;this.x=x;this.y=y;if(w){this.w=w;this.h=h}else{var obj=getPngSize(iconname);var width=obj.w;var height=obj.h;this.w=width;this.h=height}layoutBgPool[name]=this;this.isvisible=true}PngNode.prototype.draw=function(ctx){if(this.isvisible)drawImg(ctx,this.iconname,this.x,this.y,false,this.w,this.h)};PngNode.prototype.setImg=function(iconname){var png=getPngSize(iconname);this.iconname=iconname;this.w=png.w;this.h=png.h};function addPool(itemnode){var name=itemnode.name;var pooltype=itemnode.ntype;switch(pooltype){case NodeTypeClass.bg:layoutBgPool[name]=itemnode;break;case NodeTypeClass.icongroup:groupPool[name]=itemnode;break;case NodeTypeClass.icon:iconPool[name]=itemnode;break;default:layoutBgPool[name]=itemnode;break}return itemnode}function IconNodeGroup(name,x,y,w,h,bgclr,borderclr,icons,isvisible,targetDis){this.name=name;this.x=x;this.y=y;this.w=w;this.h=h;this.bgclr=bgclr;this.borderclr=borderclr;this.icons=icons;this.ntype=NodeTypeClass.icongroup;this.initx=x;this.inity=y;this.swipingRight=false;this.swipingLeft=false;this.targetRight=x+targetDis;this.isdisable=true;this.isvisible=isvisible;this.swipespeed=12}IconNodeGroup.prototype.draw=function(ctx){if(this.isvisible){if(this.swipingRight){if(this.x>=this.targetRight){this.x=this.targetRight;this.swipingRight=false;this.swipingLeft=false;this.isdisable=true;this.isvisible=true}else{this.setPos(this.x+this.swipespeed,this.inity)}}else if(this.swipingLeft){if(this.x<=this.initx){this.x=this.initx;this.swipingRight=false;this.swipingLeft=false;this.isvisible=false}else{this.setPos(this.x-this.swipespeed,this.inity)}}ctx.fillStyle=this.bgclr;ctx.strokeStyle=this.borderclr;ctx.roundRect(this.x,this.y,this.w,this.h,3).fill();ctx.roundRect(this.x,this.y,this.w,this.h,3).stroke();for(var i=0;i<this.icons.length;i++){var iconnode=this.icons[i];iconnode.isdisable=true;iconnode.draw(ctx)}}};IconNodeGroup.prototype.checkTap=function(tapx,tapy){if(this.isvisible)return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);else return false};IconNodeGroup.prototype.changeswipe=function(){if(!this.swipingLeft&&!this.swipingRight){if(this.x<=this.initx)this.swipe(Direct.right);else this.swipe(Direct.left)}else if(this.swipingLeft){this.swipe(Direct.right)}else{this.swipe(Direct.left)}};IconNodeGroup.prototype.swipe=function(direct){this.isvisible=true;switch(direct){case Direct.left:this.swipingLeft=true;this.swipingRight=false;break;case Direct.right:this.swipingRight=true;this.swipingLeft=false;break}};IconNodeGroup.prototype.setPos=function(x,y){var dx=x-this.x;var dy=y-this.y;this.x=x;this.y=y;for(var i=0;i<this.icons.length;i++){var iconnode=this.icons[i];iconnode.setPos(iconnode.x+dx,iconnode.y+dy)}};function IconNode(name,iconname,x,y,w,h,defaultBgclr,activeBgclr,handler,borderClr){this.gid=increaseId++;this.name=name;this.iconname=iconname;this.x=x;this.y=y;this.w=w;this.h=h;this.ntype=NodeTypeClass.icon;this.defaultBgclr=defaultBgclr;this.activeBgclr=activeBgclr;if(borderClr)this.borderclr=borderClr;this.handler=handler;this.isvisible=true;this.isdisable=true;this.groupname="";this.active=false;this.txtclr="black";this.txtdata=[];this.lock=false;this.tapdata=null}IconNode.prototype.draw=function(ctx){var iconobj=getPngSize(this.iconname);var w=iconobj.w;var h=iconobj.h;if(this.active)ctx.fillStyle=this.activeBgclr;else ctx.fillStyle=this.defaultBgclr;ctx.roundRect(this.x,this.y,this.w,this.h,3).fill();ctx.strokeStyle=this.borderclr;ctx.roundRect(this.x,this.y,this.w,this.h,3).stroke();var xp=this.x+(this.w/2-w/2);var yp=this.y+(this.h/2-h/2);if(this.lock)drawImg(ctx,"img3142",xp,yp);else drawImg(ctx,this.iconname,xp,yp);if(this.txtdata.length>0){ctx.fillStyle=this.txtclr;for(var i=0;i<this.txtdata.length;i++){ctx.fillText(this.txtdata[i],this.x+this.w+10,this.y+i*20+10)}}};IconNode.prototype.setPos=function(x,y){this.x=x;this.y=y};IconNode.prototype.checkTap=function(tapx,tapy){if(this.isvisible)return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h);else return false};IconNode.prototype.getDrawData=function(){return{name:this.iconname,x:this.x,y:this.y,type:this.type}};IconNode.prototype.deleteSelf=function(){delete iconPool[this.name]};function ImgNode(name,iconname,x,y,w,h,handler,handlerdata){this.gid=increaseId++;this.name=name;this.iconname=iconname;this.x=x;this.y=y;this.w=w;this.h=h;this.ntype=NodeTypeClass.icon;this.handler=handler;this.isvisible=true;this.isdisable=true;addPool(this)}ImgNode.prototype.draw=function(ctx){if(this.isvisible)drawImg(ctx,this.iconname,this.x,this.y,false,this.w,this.h)};ImgNode.prototype.setPos=function(x,y){this.x=x;this.y=y};ImgNode.prototype.checkTap=function(tapx,tapy){if(!this.isvisible)return false;return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h)};ImgNode.prototype.getDrawData=function(){return{name:this.iconname,x:this.x,y:this.y,type:this.type}};ImgNode.prototype.deleteSelf=function(){delete iconPool[this.name]};function IconInfoNode(name,x,y,w,h,bgicon,txt1,txt2,num,handler){this.gid=increaseId++;this.name=name;this.bgicon=bgicon;this.x=x;this.y=y;this.w=w;this.h=h;this.ntype=NodeTypeClass.icon;this.txt1=txt1;this.txt2=txt2;this.num=num;this.handler=handler;this.isvisible=true}IconInfoNode.prototype.draw=function(ctx){if(this.isvisible){drawImg(ctx,this.bgicon,this.x,this.y,false,this.w,this.h);drawImg(ctx,this.txt1,this.x+2,this.y+4);drawImg(ctx,this.txt2,this.x+18,this.y+4);drawNumSt(ctx,this.num.toString(),this.x+34,this.y+3)}};IconInfoNode.prototype.setPos=function(x,y){this.x=x;this.y=y};IconInfoNode.prototype.checkTap=function(tapx,tapy){return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h)};function IconTxtBtn(name,x,y,w,h,bgicon,text,textclr,handler){this.gid=increaseId++;this.name=name;this.bgicon=bgicon;this.x=x;this.y=y;this.w=w;this.h=h;this.ntype=NodeTypeClass.icon;this.text=text;this.textclr=textclr;this.handler=handler;this.isvisible=true;iconPool[this.name]=this}IconTxtBtn.prototype.draw=function(ctx){if(this.isvisible){ctx.textalign="center";ctx.textBaseline="middle";drawImg(ctx,this.bgicon,this.x,this.y,false,this.w,this.h);var w=ctx.measureText(this.text).width;ctx.fillStyle=this.textclr;ctx.fillText(this.text,this.x+this.w/2-w/2,this.y+this.h/2)}};IconTxtBtn.prototype.setPos=function(x,y){this.x=x;this.y=y};IconTxtBtn.prototype.checkTap=function(tapx,tapy){if(!this.isvisible)return false;return checkPointInBox(tapx,tapy,this.x,this.y,this.w,this.h)};function EntitTextNode(txt,x,y,clr,size){this.text=txt;this.x=x;this.y=y;this.clr=clr;this.size=size}EntitTextNode.prototype.draw=function(ctx){ctx.fillText(this.txt,x,y)};function PngNumNode(name,txt,x,y){this.name=name;this.x=x;this.y=y;this.txt=txt;this.ntype=NodeTypeClass.num;layoutBgPool[name]=this}PngNumNode.prototype.draw=function(ctx){drawNumSt(ctx,this.txt,this.x,this.y)};PngNumNode.prototype.setTxt=function(txt){if(isNaN(txt))txt="999999999999";this.txt=txt};function ResortClock(name,x,y){this.x=x;this.y=y;this.sumtick=0;this.days=resortclockdata.days;this.hours=resortclockdata.hours;this.minitues=resortclockdata.minitues;this.timepace=resortclockdata.timespace}ResortClock.prototype.update=function(ctx){this.sumtick+=bigfourgame.clock.getTick();if(this.sumtick>=this.timepace){this.sumtick=0;this.minitues++;if(this.minitues>=60){this.hours++;this.minitues=0;if(this.hours>=24){this.hours=0;this.days++}}}var imgname="img3697";var imgstar="img3558";var st="夜晚";var clr="white";if(this.hours>=19&&this.hours<=24||this.hours<=7&&this.hours>=0){}else{st="白天";clr="black";imgname="img3493bmp";imgstar="img3561"}drawImg(ctx,imgname,this.x+47,this.y+12,false,bottomsize.rilisize,40);drawImg(ctx,"iPhone-Calendar",this.x+50,this.y+12,false,15,15);drawImg(ctx,"iPhone-Clock",this.x+50,this.y+30,false,15,15);drawImg(ctx,"f43_43",this.x+70,this.y+14);drawNumSt(ctx,this.days.toString(),this.x+95,this.y+15);drawImg(ctx,"f46_46",this.x+125,this.y+14);drawImg(ctx,imgstar,this.x,this.y);drawNumSt(ctx,this.hours.toString()+":"+this.minitues.toString(),this.x+90,this.y+31)};ResortClock.prototype.getMiniters=function(){return this.minitues};ResortClock.prototype.getHours=function(){return this.hours};ResortClock.prototype.getDays=function(){return this.days};function FloorNode(name,iconname,xpos,ypos,data){this.gid=increaseId++;this.name=name;this.iconname=iconname;this.xpos=xpos;this.ypos=ypos;this.x=getPixByPosTile(xpos,ypos)[0];this.y=getPixByPosTile(xpos,ypos)[1];this.ntype=NodeTypeClass.floor;this.data=data;floorpool[this.gid]=this}FloorNode.prototype.draw=function(ctx){drawImgBottomTile(ctx,this.iconname,this.xpos,this.ypos)};FloorNode.prototype.setPos=function(x,y){this.x=x;this.y=y};FloorNode.prototype.checkTap=function(tapx,tapy){return checkPointInBox(tapx,tapy,this.x,this.y,baseRhombusWidth,baseRhombusWidth)};FloorNode.prototype.deleteSelf=function(){delete floorpool[this.gid]};function PlantNode(name,type,frames,xpos,ypos,center,data){this.name=name;this.isvisible=true;this.gid=increaseId++;this.ntype=type;if(typeof frames=="object"){var png=frames[0][0];this.w=getPngSize(png).w;this.h=getPngSize(png).h}else{this.w=getPngSize(frames).w;this.h=getPngSize(frames).h}var obj=getPixByPosTile(xpos,ypos);this.x=obj[0];this.y=obj[1];if(center)var y=this.y-this.h+baseRhombusHeight/2;else var y=this.y-this.h;this.body=new EntityNode(name,type,frames,this.x-this.w/2,y,ypos,330);this.entityid=this.body.gid;addEntityNode(this);this.floorspace=[[xpos,ypos]];this.data=data;this.floorarea=1}PlantNode.prototype.draw=function(ctx){this.body.draw(ctx)};PlantNode.prototype.setPos=function(x,y){this.x=x;this.y=y};PlantNode.prototype.IsInFloorspace=function(xpos,ypos){return isInFloorspce(xpos,ypos,this.floorspace)};PlantNode.prototype.getDrawData=function(){var objdata={name:this.name,gid:this.gid,x:this.x,y:this.y,type:this.ntype,buildtype:this.buildtype};return objdata};function ManNode(name,data,x,y){this.isvisible=true;this.x=x;this.y=y;this.posx=getTilePos(x,y).posx;this.posy=getTilePos(x,y).posy;this.name=name;this.data=data;this.gid=increaseId++;this.frameIndex=0;this.frameSumTick=0;this.currentAction=0;this.isturn=true;this.currentAction=0;this.frameFps=500;this.direct=Direct.down;this.speed=0;this.action=manstatus.idle}ManNode.prototype.setAction=function(action){this.action=action;switch(action){case manstatus.idle:this.speed=0;if(this.direct==Direct.down){this.currentAction=0;this.isturn=false}if(this.direct==Direct.up){this.currentAction=1;this.isturn=false}if(this.direct==Direct.left){this.currentAction=0;this.isturn=true}if(this.direct==Direct.right){this.currentAction=1;this.isturn=true}break;case manstatus.walk:this.speed=.1;if(this.direct==Direct.down){this.currentAction=2;this.isturn=false}if(this.direct==Direct.up){this.currentAction=3;this.isturn=false}if(this.direct==Direct.left){this.currentAction=2;this.isturn=true}if(this.direct==Direct.right){this.currentAction=3;this.isturn=true}break}};ManNode.prototype.setDirect=function(direct){this.direct=direct;this.setAction(this.action);console.log(this.direct)};ManNode.prototype.update=function(){if(this.action==manstatus.walk){this.setSpeed()}};ManNode.prototype.setSpeed=function(){switch(this.direct){case Direct.up:this.x-=2*this.speed;this.y-=this.speed;break;case Direct.down:this.x+=2*this.speed;this.y+=this.speed;break;case Direct.right:this.x+=2*this.speed;this.y-=this.speed;break;case Direct.left:this.x-=2*this.speed;this.y+=this.speed;break}};ManNode.prototype.setVisible=function(isvisible){this.isvisible=isvisible};ManNode.prototype.setPos=function(x,y){this.x=x;this.y=y};ManNode.prototype.getFrame=function(){if(this.data[0].length==1){var obj=this.data[0];return obj[0]}if(this.frameSumTick>this.frameFps){this.frameSumTick=0;this.frameIndex++}else{this.frameSumTick+=bigfourgame.clock.getTick()}if(this.frameIndex>this.data[this.currentAction].length-1){this.frameIndex=0}return this.data[this.currentAction][this.frameIndex]};ManNode.prototype.getOffsetY=function(){if(this.action==manstatus.idle){if(this.frameIndex==0)return 1;else return 0}return 0};ManNode.prototype.draw=function(ctx){this.update();if(this.isturn)drawTurnImg(ctx,this.getFrame(),this.x+zeroX-7,this.y+this.getOffsetY()+zeroY-22,true);else drawImg(ctx,this.getFrame(),this.x+zeroX-7,this.y+this.getOffsetY()+zeroY-22,true)};ManNode.prototype.getDrawData=function(){var objdata={gid:this.gid,name:this.getFrame(),x:this.x,y:this.y};return objdata};function checkRoundWall(node){var round=getBuildWall(node);for(var i=0;i<round.length;i++){var item=getBuildNodeByPos(round[i][0],round[i][1]);if(item!=null&&!item.isDraw)return true}return false}function updateDraw(ctx){for(var gid in floorpool){var floor=floorpool[gid];floor.draw(ctx)}drawBackwall(ctx,wallImg,mapInitPosx-1,mapInitPosy-1,userinfo.buildarealv.width+1,userinfo.buildarealv.width+1);var hadDraw=0;while(buildNums>0&&hadDraw<buildNums){for(var gid in entitys){var entity=entitys[gid];if(entity.ntype==NodeTypeClass.build&&!entity.isDraw&&entity.isbuild){if(!checkRoundWall(entity)){entity.draw(ctx);entity.isDraw=true;hadDraw++}}}}hadDraw=0;for(var gid in entitys){var entity=entitys[gid];if(entity.ntype==NodeTypeClass.build)entity.isDraw=false;if(entity.isvisible&&!entity.isbuild){entity.draw(ctx)}}drawFrontwall(ctx,wallImg,mapInitPosx-1,mapInitPosy-1,userinfo.buildarealv.width+1,userinfo.buildarealv.width+1);for(var name in layoutBgPool){var itemnode=layoutBgPool[name];itemnode.draw(ctx)}for(var name in groupPool){var groupnode=groupPool[name];groupnode.draw(ctx)}for(var name in iconPool){var iconnode=iconPool[name];iconnode.draw(ctx)}while(drawOrderPool.length>0){drawOrderPool.pop()}}function checkTwobox(a,b){return Math.abs(a.posx-b.posx)<a.w+b.w&&Math.abs(a.posy-b.posy)<a.h+b.h}function checkTwobox(a,b){return Math.abs(a.posx-b.posx)<a.w+b.w&&Math.abs(a.posy-b.posy)<a.h+b.h}function drawImg(context,name,x,y,border,w,h){var infoobj=jsonObj[name];if(infoobj==null){console.log("ErrorNameForDrawImage:%s",name);return}var width=infoobj[2];var height=infoobj[3];if(w){width=w;height=h}context.drawImage(img_sencha,infoobj[0],infoobj[1],infoobj[2],infoobj[3],x,y,width,height);if(border)drawPoint(context,x,y,width,height)}function drawTurnImg(context,name,x,y,border,w,h){var infoobj=jsonObj[name];if(infoobj==null){console.log("ErrorNameForDrawImage:%s",name);return}var width=infoobj[2];var height=infoobj[3];if(w){width=w;height=h}context.save();context.setTransform(1,0,0,1,0,0);context.translate(x,y);context.scale(-1,1);context.drawImage(img_sencha,infoobj[0],infoobj[1],infoobj[2],infoobj[3],-width,0,width,height);context.restore();if(border)drawPoint(context,x,y,width,height)}function drawImgCenter(context,name,x,y){var imgw=jsonObj[name][4][0];var imgh=jsonObj[name][4][1];debugger;drawScaleImg(context,name,x-imgw/2,y-imgh/2,1)}function drawPoint(context,x,y,w,h){context.fillStyle="red";context.fillRect(x,y,2,2);context.strokeStyle="black";context.strokeRect(x,y,w,h)}function drawCircle(context,x,y,r){context.fillStyle="yellow";context.beginPath();context.arc(x,y,r,0,Math.PI*2,true);context.closePath();context.fill()}CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this};function drawHexagon(ctx,x,y,r,clr,clrborder,flat){if(flat==null)flat=0;if(clr)ctx.fillStyle=clr;if(clrborder==null)clrborder=clr;ctx.strokeStyle=clrborder;ctx.beginPath();var x0=x;var y0=y;var ang=0;for(var i=0;i<12;i++){ang=i*(Math.PI/6)+Math.PI/6*flat;x0=x-r*Math.sin(ang);y0=y+r*Math.cos(ang);if(i==0){ctx.moveTo(x0,y0)}else{if(i%2==0)ctx.lineTo(x0,y0)}}ctx.closePath();ctx.fill();ctx.stroke()}function drawHexagonRoute(ctx,x,y,r,flat){if(flat==null)flat=0;ctx.strokeStyle="red";ang=2*(Math.PI/6)+Math.PI/6*flat;var x10=x-r*Math.sin(ang);var y10=y+r*Math.cos(ang);ctx.moveTo(x10,y10);ang=8*(Math.PI/6)+Math.PI/6*flat;x10=x-r*Math.sin(ang);y10=y+r*Math.cos(ang);ctx.lineTo(x10,y10);ctx.stroke()}function drawHexagonBorder(ctx,x,y,r,clrborder,flat){if(flat==null)flat=0;ctx.strokeStyle=clrborder;ctx.beginPath();var x0=x;var y0=y;var ang=0;for(var i=0;i<12;i++){ang=i*(Math.PI/6)+Math.PI/6*flat;x0=x-r*Math.sin(ang);y0=y+r*Math.cos(ang);if(i==0){ctx.moveTo(x0,y0)}else{if(i%2==0)ctx.lineTo(x0,y0)}}ctx.closePath();ctx.stroke()}function drawText(ctx,x,y,fontDis,txtArray){for(var i=0;i<txtArray.length;i++){ctx.fillText(txtArray[i],x,y+i*fontDis)}}var numspacedis={0:9,1:6,2:9,3:9,4:10,5:9,6:9,7:9,8:9,9:9,":":6,"+":8,"-":8,".":5};var numsoffsety={0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,":":3,"+":3,"-":5,".":10};var numurls={0:"num0",1:"num1",2:"num2",3:"num3",4:"num4",5:"num5",6:"num6",7:"num7",8:"num8",9:"num9",":":"numcolon","+":"numplus","-":"numminusbmp",".":"numspotbmp"};function drawNumSt(ctx,st,x,y){var offsetx=0;for(var i=0;i<st.length;i++){var numst=st.slice(i,i+1);var num=numurls[numst];drawImg(ctx,num,x+offsetx,y+numsoffsety[numst]);offsetx+=numspacedis[numst]}}