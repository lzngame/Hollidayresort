var getTimeNow = function(){
	return +new Date;
};

var cutPngName = function(longname){
	var pattern = /[A-Za-z0-9]*.png/;
	var shortname = longname.match(pattern)[0];
	return shortname.split('.')[0];
}

var img_sencha = null;

var LoadManager = function(){
	this.images ={};
	this.imageUrls =[];
	this.imagesLoaded = 0;
	this.imagesFailedToLoad = 0;
	this.imagesIndex = 0;
	this.isComplete = true;
	this.imageLoadingProcessCallback;
	this.callfinished = null;
};

LoadManager.prototype ={
	getImage:function(imageUrl){
		return this.images[imageUrl];
	},
	
	imageLoadedCallback:function(e){
		this.imagesLoaded++;
		if(this.imagesLoaded == this.imageUrls.length){
			console.log("Download complete!")
			this.isComplete = true;
			img_sencha = this.images['kailuo'];
			if(this.callfinished !=null){
				this.callfinished();
			}
		}
	},
	
	imageLoadedErrorCallback:function(e){
		this.imagesFailedToLoad++;
	},
	
	loadImage:function(imageUrl){
		var image = new Image();
		image.src = imageUrl;
		console.log(imageUrl); 
		var self = this;
		image.addEventListener('load',function(e){
			self.imageLoadedCallback(e);	
			
		});
		image.addEventListener('error',function(e){
			self.imageLoadedErrorCallback(e);
		});
		var shortName = cutPngName(imageUrl);
		this.images[shortName] = image;
	},
	
	loadImages:function(urls){
		this.imageUrls = urls;
		this.isComplete = false;
		while(this.imagesIndex <this.imageUrls.length){
			this.loadImage(this.imageUrls[this.imagesIndex]);
			this.imagesIndex++;
		}
		console.log("Loaded:%d FailedLoaded:%d  Total:%d",this.imagesLoaded,this.imagesFailedToLoad,this.imageUrls.length);
		return (this.imagesLoaded + this.imagesFailedToLoad)/this.imageUrls.length * 100;
	},
};
