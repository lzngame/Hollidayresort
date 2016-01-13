//游戏活动场景 
var loadmanager = new LoadManager();

var currentActiveIndex = -1;
var activeUpdatePool = [];
var activeUpdatePoolTime = [];
var tickActiveSum = 0;
var updatePool = [];
var localupdate = {
	sumtick:0,
	
	update:function(){
		this.sumtick += bigfourgame.clock.getTick();
		if(this.sumtick > 1000){
			this.sumtick = 0;
		}
	}
}

function initUpdate(id,func,t){
	activeUpdatePool[id] = func;
	if(t==null)
		t = 1000;
	activeUpdatePoolTime[id] = t;
}

Ext.application({
	name:'Resort',
	appFolder:'static/app',
	views:['Login','Main'],
	controllers:['Login','Main'],
	launch:function(){
		console.log('launch');
		Ext.fly('appLoadingIndicator').destroy();
		Ext.Viewport.setMasked({xtype:'loadmask',message:'资源加载...'});
		
		loadmanager.callfinished = function(){
			Ext.Viewport.setMasked(false);
		}
		loadmanager.loadImages(["/static/img/kailuo.png"]);
		Ext.Viewport.add(Ext.create('Resort.view.Login'));
		window.requestNextAnimationFrame(animate);
	}
});


function animate(time){
	bigfourgame.clock.update();
	localupdate.update();
	for(var func in updatePool){
		func();
	}
	
	if((activeUpdatePool[currentActiveIndex]) != null){
		tickActiveSum +=  bigfourgame.clock.getTick();
		if(tickActiveSum > activeUpdatePoolTime[currentActiveIndex]){
			tickActiveSum = 0;
			activeUpdatePool[currentActiveIndex]();
		}
	}
	window.requestNextAnimationFrame(animate);
}