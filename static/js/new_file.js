var obj = houseInfos[name];
		var house = new IconNode(obj.iconnodename,obj.url,2,i*space+135,iconSize.lefticon,iconSize.lefticon,'yellow','blue',function(name){
			console.log(this.iconname);
			currentHandleStatus = handleStatus.dragingbuild;
			currentBuildData = houseInfos[this.dataname];
			currentBuildType = currentBuildData.housetype;
			stopHandleBtn.show();
			groupBack(this.groupname,lefticonInfos.house.name);
		});
		house.txtdata.push(obj.name+"  $:"+obj.price.toString());
		house.txtdata.push(obj.note);
		house.groupname = obj.groupname;
		house.dataname = name;
		nodearray.push(house);
		i++