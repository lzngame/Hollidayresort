function HandleInfoMenu(name,x,y){
	this.name = name;
	this.x = x;
	this.y = y;
	this.ntype = NodeTypeClass.menu;
	this.isvisible = false;
	
	this.namesObj = {
		closename:'icon_'+name+'_closename',
		bgheadname:name+'_bgheadname',
		bgrect:name+'_bgrectname',
		titlename:name+'_titlename',
		lvname:name+'_lvname',
		notename:name+'_note',
		btnupdatename:'icon_'+name+'_updatename',
		btndestoryname:'icon_'+name+'_destoryname',
		btnroatename:'icon_'+name+'_roatename',
		explinename:name+'_explinename',
		servicename:name+'_servicename',
	}
	new PngNode(this.namesObj.bgheadname,'img3358bmp',this.x,this.y,205,30);
	var alpha = 'rgba(200,200,200,0.5)';
	new ShapeRect(this.namesObj.bgrect,alpha,'black',this.x+1,this.y+30,204,100);
	
	var closeBtn = new ImgNode(this.namesObj.closename,'img2997',this.x+175,this.y+2,20,20,function(){
		this.closeData.hide(false);
	});
	closeBtn.closeData = this;
	
	var destoryBtn = new IconTxtBtn(this.namesObj.btndestoryname,this.x+10,this.y+105,50,20,'img3048',buttontextName.handle_destory,'white',function(){
		this.closeData.hide(false);
		if(currentHandleNode == null)
			debugger;
		if(currentHandleNode.ntype == NodeTypeClass.floor)
			delete floorpool[currentHandleNode.gid];
		if(currentHandleNode.ntype == NodeTypeClass.build){
			deleteEntity(currentHandleNode.gid);
			buildNums--;
		}
			
		new ToastInfo('mytoast',currentHandleNode.data.name+warntext.build_destory,-130,100,1500);
		currentHandleNode = null;
	});
	destoryBtn.closeData = this;
	
	var updateBtn = new IconTxtBtn(this.namesObj.btnupdatename,this.x+70,this.y+105,50,20,'img3044',buttontextName.handle_uplv,'blue',function(){
		if(currentHandleNode.ismaxlv()){
			new ToastInfo('mytoast',currentHandleNode.data.name+warntext.build_maxlv,-130,100,1500);
			return;
		}
		this.closeData.hide(false);
		var upprice = 0;
		if(currentHandleNode.lv == 1)
			upprice = currentHandleNode.data.uplv2;
		else
			upprice = currentHandleNode.data.uplv3;
		if(checkCost(upprice)){
			if(currentHandleNode.upLv()){
				new ToastInfo('mytoast',currentHandleNode.data.name+warntext.build_success,-130,100,1500);
				userinfo.money -= upprice;
				layoutBgPool['numnode'].setTxt(userinfo.money.toString());
			}else{
				new ToastInfo('mytoast',currentHandleNode.data.name+warntext.build_maxlv,-130,100,1500);
			}
		}
			
		if(currentHandleNode.buildtype == buildTypes.receptioncenter){
			setReceptionPos();
		}
	});
	updateBtn.closeData = this;
	
	var roateBtn = new IconTxtBtn(this.namesObj.btnroatename,this.x+130,this.y+105,50,20,'img3044',buttontextName.handle_rotate,'blue',function(){
		this.closeData.hide(false);
		currentHandleNode.isturn = !currentHandleNode.isturn;
		new ToastInfo('mytoast',currentHandleNode.data.name+warntext.build_rotate,-130,100,800);
	});
	roateBtn.closeData = this;
	
	var expline = new ExpLine(this.namesObj.explinename,'red','white','black',this.x+2,this.y+30,204,5,0,1000);
	addPool(expline);
	var txttitle = new UItextNode(this.namesObj.titlename,'',this.x+10,this.y+15,'blue');
	var txtnote  = new UItextNode(this.namesObj.notename,'',this.x+10,this.y+55,'blue');
	var txtlv  = new UItextNode(this.namesObj.lvname,'',this.x+100,this.y+15,'yellow','red');
	var txtservice = new UItextNode(this.namesObj.servicename,'',this.x+10,this.y+85,'blue');
}

HandleInfoMenu.prototype.show = function(handlenode){
	var	type = handlenode.data.groupname;
	switch(type){
		case GroupType.lawn:
		case GroupType.floor:
		case GroupType.plant:
		case GroupType.carpet:
			iconPool[this.namesObj.btnroatename].isvisible = false;
			iconPool[this.namesObj.btnupdatename].isvisible = false;
			layoutBgPool[this.namesObj.lvname].settxt('');
			break;
		case GroupType.house:
		case GroupType.restaurant:
			if(handlenode.buildtype == buildTypes.receptioncenter)
				iconPool[this.namesObj.btndestoryname].isvisible = false;
			iconPool[this.namesObj.btnroatename].isvisible = false;
			layoutBgPool[this.namesObj.lvname].settxt(this.getLvtxt(handlenode));
			break;
		case GroupType.miniroom:
			if(handlenode.buildtype != buildTypes.roomMiniClearroom){
				iconPool[this.namesObj.btnupdatename].isvisible = false;
				layoutBgPool[this.namesObj.lvname].settxt('');
			}else{
				layoutBgPool[this.namesObj.lvname].settxt(this.getLvtxt(handlenode));
			}
			break;
	}
	layoutBgPool[this.namesObj.titlename].settxt(handlenode.data.name);
	layoutBgPool[this.namesObj.notename].settxt(handlenode.data.note);
	layoutBgPool[this.namesObj.servicename].settxt(handlenode.getServiceNote());
};

HandleInfoMenu.prototype.getLvtxt = function(handlenode){
	if(handlenode.lv == 0)
		return '';
	else if(handlenode.lv == 1)
		return '★ ☆ ☆';
	else if(handlenode.lv ==2)
		return '★ ★ ☆';
	else	
		return '★ ★ ★ ';
}

HandleInfoMenu.prototype.hide = function(isvisible){
	this.isvisible = isvisible;
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
	if(nowHandleNode9 != null){
		deleteEntity(nowHandleNode9);
		nowHandleNode9 = null;
	}
	if(nowHandleNode12 != null){
		deleteEntity(nowHandleNode12);
		nowHandleNode12 = null;
	}
	if(nowHandleNode16 != null){
		deleteEntity(nowHandleNode16);
		nowHandleNode16 = null;
	}
}

/*
 * Toast 控件
 */
function ToastInfo(name,txt,initx,inity,timeout){
	this.name = name;
	this.txt = txt;
	this.initx = initx;
	this.inity = inity;
	this.ntype = NodeTypeClass.menu;
	this.sumtick = 0;
	this.timeout = timeout;
	this.x = initx;
	this.y = inity;
	this.space = 20;
	this.w = this.txt.length*16 + this.space;
	this.h = 30;
	this.speed = 10;
	this.targetx = stageWidth/2 - this.w/2;
	this.stepOne = false;
	this.stepTwo = false;
	layoutBgPool[name] = this;
}

ToastInfo.prototype.draw = function(ctx){
	this.update();
	ctx.textAlign = 'start';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'yellow';
	//ctx.fillRect(this.x,this.y,this.w,this.h);
	ctx.fillStyle = 'rgba(0,51,0,0.8)';
	ctx.roundRect(this.x,this.y,this.w,this.h,3).fill();
	ctx.strokeStyle = 'green';
	ctx.roundRect(this.x,this.y,this.w,this.h,3).stroke();
	ctx.fillStyle = 'yellow';
	ctx.fillText(this.txt,this.x+this.space,this.y+15);
};

ToastInfo.prototype.update = function(){
	if(!this.stepOne && this.x <this.targetx){
		this.x += this.speed;
	}
	if(!this.stepOne && this.x >= this.targetx){
		this.x = this.targetx;
		this.stepOne = true;
	}
	if(this.stepOne){
		this.sumtick += bigfourgame.clock.getTick();
		if(this.sumtick >= this.timeout){
			this.stepTwo = true;
		}
	}
	if(this.stepTwo){
		var pseed =  easeFrom(this.x/100);
		this.x += pseed;
	}
	if(this.x > stageWidth){
		delete layoutBgPool[this.name];
	}
};

/*
 * WindowPanel 控件
 */
function WindowPanel(name,titletxt,x,y,w,h){
	this.name = name;
	this.x = x;
	this.y = y;
	this.ntype = NodeTypeClass.menu;
	this.w = w;
	this.h = h;
	
	this.name = name;
	this.x = x;
	this.y = y;
	this.ntype = NodeTypeClass.menu;
	this.defaultid = 1000;
	
	this.namesObj = {
		closename:'icon_'+name+'_closename',
		titleheadname:name+'_bgheadname',
		bgrect:name+'_bgrectname',
		bgtoprect:name+'_bgtoprectname',
		titlename:name+'_titlename',
	}

	var alpha = 'rgba(10,10,10,0.9)';
	new ShapeRect(this.namesObj.bgrect,alpha,'black',this.x,this.y,this.w,this.h,4);
	new ShapeRect(this.namesObj.bgtoprect,'#336600','#336600',this.x,this.y,this.w,30,4);
	new PngNode(this.namesObj.titleheadname,'img247',this.x+this.w/2-75,this.y+4,150,20);
	var closeBtn = new ImgNode(this.namesObj.closename,'img2997',this.x+this.w-25,this.y+4,20,20,function(){
		this.closeData.hide(false);
	});
	closeBtn.closeData = this;
	this.increaseId= 1000;
	this.content = [];
	
	var txttitle = new UItextNode(this.namesObj.titlename,titletxt,this.x+this.w/2-20,this.y+15,'white');
}

WindowPanel.prototype.hide = function(isvisible){
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
	for(var i=0;i<this.content.length;i++){
		var name = this.content[i];
		if(name.indexOf('icon') ==-1)
			delete layoutBgPool[name];
		else
			delete iconPool[name];
	}
	this.content = [];
	this.increaseId = this.defaultid;
};

WindowPanel.prototype.addContentImg = function(imgname,x,y,w,h){
	this.increaseId++;
	var name = this.increaseId.toString()+'_'+imgname;
	var pngnode = new PngNode(name,imgname,this.x+x,this.y+y,w,h);
	this.content.push(name);
};

WindowPanel.prototype.addContentTxt = function(txt,x,y,clr){
	this.increaseId++;
	var name = this.increaseId.toString()+'_'+'txt';
	var txtnode = new UItextNode(name,txt,this.x+x,this.y+y,clr);
	this.content.push(name);
};

WindowPanel.prototype.addContentBtn = function(txt,bgicon,x,y,w,h,clr,handler,data){
	this.increaseId++;
	var name = 'icon_'+this.increaseId.toString()+'_'+bgicon;
	var btn = new IconTxtBtn(name,this.x+x,this.y+y,w,h,bgicon,txt,clr,handler);
	if(data)
		btn.data = data;
	this.content.push(name);
};

function UItextNode(name,txt,x,y,clr,borderClr){
	this.name = name;
	this.x = x;
	this.y = y;
	this.clr = clr;
	this.txt = txt;
	layoutBgPool[name] = this;
	this.isvisible = true;
	this.borderClr = borderClr;
};

UItextNode.prototype.draw = function(ctx){
	if(this.isvisible){
		ctx.fillStyle = this.clr;
		ctx.fillText(this.txt,this.x,this.y);
		if(this.borderClr){
			ctx.strokeStyle = this.borderClr;
			ctx.strokeText(this.txt,this.x,this.y);
		}
	}
};

UItextNode.prototype.settxt = function(txt){
	this.txt = txt;
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
	new PngNode(this.bgnodename,'img396',this.x,this.y,186,112);
	var stopBtn = new ImgNode(this.closenodename,'cancel',this.x+100,this.y+4,80,25,this.hide);
	stopBtn.tapdata = this;
	
	this.handleTxt = new UItextNode(this.txt1name,'',this.x+55,this.y+40,'yellow');
	this.nameTxt =   new UItextNode(this.txt2name,'',this.x+55,this.y+60,'black');
	this.noteTxt =   new UItextNode(this.txt3name,'',this.x+50,this.y+85,'black');
	this.priceTxt =  new UItextNode(this.txt4name,'',this.x+50,this.y+105,'black');
	
	this.iconImg = new PngNode(this.iconname,'img409',this.x+10,this.y+45);
}

StopHandleMenu.prototype.hide = function(tapdata){
	var isvisible = false;
	if(tapdata != null){
		currentHandleStatus = handleStatus.normal;
		frontWallAlpha = 1;
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
	frontWallAlpha = 1;
	if(txtinfo)
		txtinfo.hide(true);
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
	if(currentBuildData.groupname == "LAWN_GROUP" || currentBuildData.groupname == "CARPET_GROUP" )
		layoutBgPool[this.txt1name].settxt(warntext.build_tap);
	else
		layoutBgPool[this.txt1name].settxt(warntext.build_drag);
	layoutBgPool[this.txt2name].settxt(currentBuildData.name);
	layoutBgPool[this.txt3name].settxt(currentBuildData.note);
	layoutBgPool[this.txt4name].settxt('$:'+currentBuildData.price.toString());
	layoutBgPool[this.iconname].setImg(currentBuildData.tileurl);
};

StopHandleMenu.prototype.setPos= function(x,y){
	this.x = x;
	this.y = y;
};


function ShapeRect(name,clr,borderclr,x,y,w,h,r){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = r;
	this.clr = clr;
	this.borderclr = borderclr;
	layoutBgPool[name]= this;
	this.isvisible = true;
}

ShapeRect.prototype.draw = function(ctx){
	if(this.isvisible){
		ctx.fillStyle = this.clr;
		ctx.strokeStyle = this.borderclr;
		if(!this.r){
			ctx.fillRect(this.x,this.y,this.w,this.h);
			ctx.strokeRect(this.x,this.y,this.w,this.h);
		}else{
			ctx.roundRect(this.x,this.y,this.w,this.h,this.r).fill();
			ctx.roundRect(this.x,this.y,this.w,this.h,this.r).stroke();
		}
	}
};

ShapeRect.prototype.setSize = function(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

/**
 * 商店 有上下页
 */
function ShopPanel(name,titletxt,x,y,w,h){
	this.name = name;
	this.winpanel = new WindowPanel('shoppanel',titletxt,x,y,w,h);
	this.pagenum = 8;
	this.initpage = 0;
}

ShopPanel.prototype.hide = function(isvisible){
	this.winpanel.hide(isvisible);
	if(!isvisible)
		this.initpage = 0;
};

ShopPanel.prototype.pagedown = function(){
	var total = Math.ceil(shopProps.length/this.data.pagenum);
	if(this.data.initpage/this.data.pagenum >= total-1)
		return;
	this.data.initpage+=this.data.pagenum;
	this.data.setdata();
};

ShopPanel.prototype.pageup = function(){
	if(this.data.initpage == 0)
		return;
	this.data.initpage-=this.data.pagenum;
	this.data.setdata();
};

ShopPanel.prototype.setdata = function(){
	this.winpanel.hide(true);
	this.winpanel.addContentBtn(buttontextName.prevpage, 'img3044', this.winpanel.w/2 -48-20, this.winpanel.h -25, 48, 20, 'black', this.pageup,this);
	this.winpanel.addContentBtn(buttontextName.nextpage, 'img3044', this.winpanel.w/2+20, this.winpanel.h -25, 48, 20, 'black', this.pagedown,this);
	var initx = 20;
	var inity = 50;
	var index = 0;
	for(var i = this.initpage;i<this.initpage+this.pagenum;i++){
			if(i >= shopProps.length-1)
				return;
			var obj = shopProps[i];
			var y  = inity+index * 40;
			this.winpanel.addContentImg(obj.img,initx,y,30,30);
			this.winpanel.addContentTxt(obj.name,initx + 35,y+10,'white');
			this.winpanel.addContentBtn(buttontextName.buy, 'img3044', initx+80, y+5, 48, 20, 'black', function() {
				
				console.log(this);
			});
			index++;
		}
};

/**
 * 经验条
 */
function ExpLine(name,frontclr,backclr,borderclr,x,y,w,h,currentvalue,total){
	this.name = name;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.frontclr = frontclr;
	this.backclr = backclr;
	this.borderclr = borderclr;
	this.total = total;
	this.valuewidth = 0;
	this.reset(currentvalue);
	this.isvisible = true;
}

ExpLine.prototype.draw = function(ctx){
	if(this.isvisible){
		ctx.fillStyle = this.backclr;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = this.frontclr;
		ctx.fillRect(this.x,this.y,this.valuewidth,this.h);
		ctx.strokeStyle = this.borderclr;
		ctx.strokeRect(this.x,this.y,this.w,this.h);
	}
};

ExpLine.prototype.reset = function(val){
	this.currentvalue = val;
	this.valuewidth = (this.currentvalue * this.w)/this.total; 
};

ExpLine.prototype.setTotal = function(total){
	this.total = total;
	this.reset(this.currentvalue);
};


/**
 * 下方提示文字
 */
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
	this.showTime = 0;	
}

TxtNode.prototype.draw = function(ctx) {
	if (this.isvisible) {
		ctx.fillStyle = 'rgba(200,200,200,0.8)';
		ctx.fillRect(47,stageHeight-63,stageWidth-47,30)
		ctx.fillStyle = this.clr;
		this.run();
		if (this.iconhead)
			drawImg(ctx, this.iconhead, this.x, this.y);
		ctx.fillText(this.txt, this.x + 40, this.y + 12);
		this.showTime++;
	}
};

TxtNode.prototype.hide = function(visual){
	this.isvisible = visual;
	if(this.isvisible){
		this.setTxt(tasks[userinfo.currentTaskIndex]);
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

