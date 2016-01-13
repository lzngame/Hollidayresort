Ext.define('Resort.controller.Login',{
	extend:'Ext.app.Controller',
	init:function(this_initialconfig){
		console.log('login controller init');
	},
	config:{
		refs:{
			loginview:{
				selector:'loginview',
				xtype:'loginview',
				autoCreate:true
			},
			btnplay:'#btn_play',
			loginpanel:'#loginpanel'
		},
		control:{
			loginview:{
				activate:'onloginActivate',
			},
			btnplay:{
				tap:'on_btnplay_tap',
			},
			loginpanel:{
				activate:function(newactiveitem,thisself,oldactiveitem,eopts){
					console.log('loginpanel activate');
				}
			}
		},
		routes:{
			'login':'showLoginview'
		}
	},
	onloginActivate:function(newactiveitem,thisself,oldactiveitem,eopts){
		console.log('loginview activate');
		initStage();
	},
	on_btnplay_tap:function(thisself,e,eopts){
		console.log('btnplay tap');
		Ext.Viewport.animateActiveItem(this.getLoginview(),{type:'slide',direction:'right'});
		this.redirectTo('main');
	},
	showLoginview:function(){
		console.log('routes-login-showLoginview');
		Ext.Viewport.setActiveItem(this.getLoginview());
	}
});

function initStage(){
	if(initStageFirst)
		return;
	initStageFirst = true;
	var obj = Ext.get('loginview');
	stageWidth = obj.getWidth();
	stageHeight = obj.getHeight();
	console.log('stageHeight:%d stageHeight:%d',stageWidth,stageHeight);
}
