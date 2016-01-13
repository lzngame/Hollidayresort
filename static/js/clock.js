bigfourgame.clock = new function(){
    var self = this;
    var lastTime = 0;
    var systemTime = 0;
    var tick = 0;
    var frameCount =0;
    var tickSum = 0;
    var fps = 0;
    self.update = function(){
        var now =+ new Date;
        var interval = now - lastTime;
        if(interval == 0)
            interval = 1;
        fps = Math.floor(1000/interval);
        tick = now - lastTime;
        if(tick > 1000)
            tick = 0;
        systemTime += tick;
        lastTime = now;
        frameCount++;
        if(fps ==Infinity)
            console.log(lastTime);
        //console.log('tick:%d fps:%d time:%d',tick,fps,systemTime);
        return fps;
    }
    
    self.getTick = function(){
        return tick;
    }
    
    self.getGameTime = function(){
    	return systemTime;
    }
};



