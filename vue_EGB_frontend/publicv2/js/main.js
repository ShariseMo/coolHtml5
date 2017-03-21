	// 页面初始化
	function initPage(){
		$('.qrcode_span').hover(function(){
			$('.EDS_qrcode').css('display','inline-block');
		},function(){
			$('.EDS_qrcode').css('display','none');
		});

		$('.kefu_span').hover(function(){
			$('.kefu_box').css('display','inline-block');
			$('.kefu_arrow').css('transform','rotate(180deg)');
		},function(){
			$('.kefu_box').css('display','none');
			$('.kefu_arrow').css('transform','rotate(0deg)');
		});

		$('.user_span').hover(function(){
			$('.user_box').css('display','inline-block');
			$('.user_arrow').css('transform','rotate(180deg)');
		},function(){
			$('.user_box').css('display','none');
			$('.user_arrow').css('transform','rotate(0deg)');
		});
		$('.username').html(localStorage.getItem('username'));
	}

	// 按照code取得对应地名
	function getAddrName(pid,cid,did,tid){
		for(var i = 0;i<areaList.length;i++){
			var province = areaList[i];
			if(province['code']==pid)  machineProvince = province['name'];
			for(var j = 0;j<province['subordinates'].length;j++){
				var city = province['subordinates'][j];
				if(city['code']==cid)	machineCity = city['name'];
				for(var k = 0;k<city['subordinates'].length;k++){
					var district = city['subordinates'][k];
					if(district['code']==did)	machineDistrict = district['name'];
					for(var l = 0;l<district['subordinates'].length;l++){
						var town = district['subordinates'][l];
						if(town['code']==tid)	machineTown = town['name'];
					}
				}
			}
		}
	}

	// 取省份名
	function getProName(pid){
		for(var i=0;i<areaList.length;i++){
			if(areaList[i]['code']==pid){
				return areaList[i]['name'];
			}
		}
	}
	//取市名
	function getCityName(cid){
		for(var i = 0;i<areaList.length;i++){
			for(var j = 0;j<areaList[i]['subordinates'].length;j++){
				if(areaList[i]['subordinates'][j]['code']==cid){
					return areaList[i]['subordinates'][j]['name'];
				}
			}
		}
	}
	//取区名
	function getDistrictName(did){
		for(var i = 0;i<areaList.length;i++){
			for(var j = 0;j<areaList[i]['subordinates'].length;j++){
				var cc = areaList[i]['subordinates'][j];
				for(var k = 0;k<cc['subordinates'].length;k++){
					var dd = areaList[i]['subordinates'][j]['subordinates'][k];
					if(dd['code']==did){
						return dd['name'];
					}
				}
			}
		}
	}
	//取镇名
	function getTownName(tid){
		for(var i = 0;i<areaList.length;i++){
			for(var j = 0;j<areaList[i]['subordinates'].length;j++){
				var cc = areaList[i]['subordinates'][j];
				for(var k = 0;k<cc['subordinates'].length;k++){
					var dd = cc['subordinates'][k];
					for(var l = 0; l<dd['subordinates'].length;l++){
						var tt = dd['subordinates'][l];
						if(tt['code']==tid){
							return tt['name'];
						}
					}
				}
			}
		}
	}

	// 根据标号字符串获取场所名
	function getWorkAreaName(workArea){
		for(var i = 0;i<workArea.length;i++){
			switch(workArea[i]){
				case "0": workArea[i]="其他"; break;
				case "1": workArea[i]="门店"; break;
				case "2": workArea[i]="售楼部"; break;
				case "3": workArea[i]="小区"; break;
				case "4": workArea[i]="合作联盟"; break;
				case "5": workArea[i]="商城"; break;
				case "6": workArea[i]="活动现场"; break;
				case "7": workArea[i]="市场门槛"; break;
			};	
		}
		return workArea.join(',');
	}

	// 获取url参数
	function getUrlParam(name){      
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 	  
        var r = window.location.search.substr(1).match(reg); 	  
        if (r != null) return decodeURIComponent(r[2]); return null;
	}

	// 修改地址(四级联动)
	function select(){
		var html = "<option>===请选择===</option>";
		$('.city').append(html);
		$('.district').append(html);
		$('.town').append(html);
		for(var i = 0;i<areaList.length;i++){
			var pp = areaList[i];
			html += "<option value='"+pp['code']+"' parentid='"+pp['parentId']+"'>"+pp['name']+"</option>";
		}
		$('.province').append(html);

		$('.province').change(function(){
			if($(this).val()=="")  return;
			$('.city option').remove();
			$('.district option').remove();
			$('.town option').remove();
			var code = $(this).find('option:selected').val();
			var html = "<option>===请选择===</option>";
			for(var i = 0;i<areaList.length;i++){
				for(var j = 0;j<areaList[i]['subordinates'].length;j++){
					var cc = areaList[i]['subordinates'][j];
					if(cc['parentId'] == code){
						html += "<option value='"+cc['code']+"' parentid='"+cc['parentId']+"'>"+cc['name']+"</option>";
					}
				}
			}
			$('.city').append(html);
			$('.district').css('display','none');
			$('.town').css('display','none');
		});

		$('.city').change(function(){
			if($(this).val()=="") return;
			$('.district option').remove();
			$('.town option').remove();
			var code = $(this).find('option:selected').val();
			var html = "<option>===请选择===</option>";
			for(var i = 0;i<areaList.length;i++){
				for(var j = 0;j<areaList[i]['subordinates'].length;j++){
					for(var k = 0;k<areaList[i]['subordinates'][j]['subordinates'].length;k++){
						var dd = areaList[i]['subordinates'][j]['subordinates'][k];
						if(dd['parentId'] == code){
							html += "<option value='"+dd['code']+"' parentid='"+dd['parentId']+"'>"+dd['name']+"</option>";
						}
					}
				}
			}
			$('.district').css('display','inline-block');
			$('.district').append(html);
			$('.town').css('display','none');
		});

		$('.district').change(function(){
			if($(this).val()=="") return;
			$('.town option').remove();
			var code = $(this).find('option:selected').val();
			var html = "<option>===请选择===</option>";
			for(var i = 0;i<areaList.length;i++){
				for(var j = 0;j<areaList[i]['subordinates'].length;j++){
					for(var k = 0;k<areaList[i]['subordinates'][j]['subordinates'].length;k++){
						for(var l = 0;l<areaList[i]['subordinates'][j]['subordinates'][k]['subordinates'].length;l++){
							var tt = areaList[i]['subordinates'][j]['subordinates'][k]['subordinates'][l];
							if(tt['parentId'] == code){
								html +=  "<option value='"+tt['code']+"' parentid='"+tt['parentId']+"'>"+tt['name']+"</option>";
							}
						}
					}
				}
			}
			$('.town').css('display','inline-block');
			$('.town').append(html);
		});
	}


	// 悬浮出现(mouseover/mouseout)
	function overOut(hoverBox,showField){
		$(hoverBox).mouseover(function(){
			$(showField).removeClass('hidden'); 
		});
		$(hoverBox).mouseout(function(){
			$(showField).addClass('hidden'); 
		});
	}


