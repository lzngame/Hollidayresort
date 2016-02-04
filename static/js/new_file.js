console.log(this.iconname);
			currentHandleStatus = handleStatus.tile;
			var data = carpetInfos[this.dataname];
			currentBuildfloor = data.tileurl;
			frontWallAlpha = 0.3;
			currentBuildData = data;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.carpet.name);
		});
		carpet.txtdata.push(obj.name+"  $:"+obj.price.toString());
		carpet.txtdata.push(obj.note);
		carpet.lock = true;
		carpet.groupname = obj.groupname;
		carpet.dataname = name;
		nodearray.push(carpet);
		i++