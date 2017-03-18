<template>
	<div class="machine_manage">
		<div class="machine_info">
			<div class="info_group">
				<span class="info_box">
					机器名称:&nbsp;&nbsp;{{machineData.machineName}}
				</span>
				<span class="info_box">
					邀请码:&nbsp;&nbsp;{{machineData.invitationCode}}
				</span>
			</div>
			<div class="info_group">
				<!-- <span class="info_box">
					运行状态:&nbsp;&nbsp;{{machineData.machineWorkState}}
				</span> -->
				<span class="info_box">
					区域地址:&nbsp;&nbsp;
					{{provinceTxt}} {{cityTxt}} {{districtTxt}} {{townTxt}} {{machineData.machineAddr}}
				</span>
				<span class="info_box">
					机器编码:&nbsp;&nbsp;{{machineData.machineNo}}
				</span>
			</div>
			<div class="info_group">
				<span class="info_box">
					运营场所:&nbsp;&nbsp;{{placeText}}
				</span>
			</div>
	
			<a v-link='{path:"/machine_list"}' class="back_btn">返回</a>
		</div>
	
		<div class="manage_content">
			<ul class="left_nav">
				<li><a class="machine_setting" :class="{'active':is_machine}" v-link='{path:"/machine_setting/info_set?machineId="+machineData.machineId}'>机器设置</a></li>
				<li><a class="user_setting" :class="{'active':is_service}" v-link='{path:"/machine_setting/service_set?machineId="+machineData.machineId}'>客服设置</a></li>
				<li><a class="shop_setting" :class="{'active':is_shop}" v-link='{path:"/machine_setting/shop_set?machineId="+machineData.machineId}'>店铺设置</a></li>
				<li><a class="adv_setting" :class="{'active':is_adv}" v-link='{path:"/machine_setting/adv_set?machineId="+machineData.machineId}'>屏保设置</a></li>
				<li><a class="active_setting" :class="{'active':is_active}" v-link='{path:"/machine_setting/active_set?machineId="+machineData.machineId}'>活动设置</a></li>
				<!-- <li><a class="active_setting" :class="{'active':is_interact}" v-link='{path:"/machine_setting/interact_set?machineId="+machineData.machineId}'>互动设置</a></li> -->
			</ul>
	
			<router-view transition="fade" transition-mode="out-in"></router-view>
			<!-- <router-view></router-view> -->
		</div>
	</div>
</template>

<script>
	import { initAreaDB, getAreaName } from '../../areaDB.js';

	export default{
		data(){
			return{
				machineData:{},

				//运营场所编码转化成字符串
				placeArr:[
					"其他",
					"门店","售楼部","小区",  
					"合作联盟","商城","活动现场",  
					"市场门槛",
				],
				placeText:"",


				//address edit
				areaList:[],
				provinceList:[],
				cityList:[],
				districtList:[],
				townList:[],

				province:"",
				city:"",
				district:"",
				town:"",

				provinceTxt:"",
				cityTxt:"",
				districtTxt:"",
				townTxt:"",

				//nav css
				is_machine:false,
				is_active:false,
				is_service:false,
				is_shop:false,
				is_adv:false,
				is_interact:false,
			}
		},
		route:{
			data:function(){
				var self = this;

				initAreaDB(() => {
					self.$http.get("/machine/"+self.$route.query.machineId).then(
						function(response){
							self.machineData = response.data.data;
							self.addrInText(self.machineData);
						})
					var set_type = self.$route.name;
					switch(set_type){
						case "adv_set":self.clear();self.is_adv = true;break;
						case "shop_set":self.clear();self.is_shop = true;break;
						case "active_set":self.clear();self.is_active = true;break;
						case "service_set":self.clear();self.is_service = true;break;
						case "info_set":self.clear();self.is_machine = true;break;
						case "interact_set":self.clear();self.is_interact = true;break;
					}
				});
			}
		},
		methods:{
			//将获取到的地址编码遍历转化成字符串
			addrInText:function(data){
				var self = this;
				if(null===self.machineData.machineWorkArea){return}
				self.province = data.machineProvince;
				self.city = data.machineCity;
				self.district = data.machineDistrict;
				self.town = data.machineTown;

				if(data.machineWorkArea){
					var place = data.machineWorkArea.split(",");

					self.placeText = "";
					place.forEach(function(value,index){
						if(0!==index){
							self.placeText += ","+self.placeArr[value];
						}else{
							self.placeText += self.placeArr[value];
						}
						
					})
				}

				self.provinceTxt = getAreaName(data.machineProvince);
				self.cityTxt = getAreaName(data.machineCity);
				self.districtTxt = getAreaName(data.machineDistrict);
				self.townTxt = getAreaName(data.machineTown);
			},
		 	clear:function(){
		 		var self = this;
				self.is_service = false;
				self.is_adv = false;
				self.is_active = false;
				self.is_shop = false;
				self.is_machine = false;
				self.is_interact = false;
			}
			
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';

	@media screen and(max-width:1500px) {
	  .machine_info{
	  	.info_group{
	  		.info_box{
					font-size: 14px!important;

					/* &:nth-of-type(1),
					&:nth-of-type(4){
						width:150px!important;
						min-width: 0px!important;
					} */
				}
	  	}
			
	  }
	}
	//machine manage page
	.machine_manage{
		padding:20px 15px;
		//top info
		.machine_info{
			position: relative;
			border-bottom: 1px solid #ccc;
			padding-bottom: 15px;
			.info_group{
				display:inline-block;
				.info_box{
					display:block;
					min-height:30px;
					line-height: 30px;
					min-width:150px;
					max-width:720px;
					margin-left:20px;
					vertical-align: top;
					width:auto;
					font-size: 16px;
					text-indent: 1em;

					:nth-of-type(1),
					:nth-of-type(4){
						width:180px;
						min-width: 0px!important;
					}
				}
			}
			
		
			.back_btn{
				background-color: $deepBlue;
				width:90px;
				height:40px;line-height:40px;
				color:#fff;
				display:inline-block;
				position:absolute;
				padding-left: 40px;
				border-radius: 5px;
				top: 10px;
		    right: 40px;
		    font-size: 16px;

				&:before{
					content:"";
					background: url(#{$client_images}/back_btn.png) 0px 0px no-repeat;
					position: absolute;
					left:10px;
					top:10px;
					height:30px;
					width:30px;
				}
			}
		}

		//-----manage content
		.manage_content{
			margin-top:20px;
			//left_nav
			.left_nav{
				min-width: 150px;
				height:100%;
				min-height: 600px;
				padding-top: 20px;
				width:12%;
				font-size: 16px;
				background-color:$lightGray;
				cursor:pointer;
				border:1px solid $borderGray;
				border-radius: 3px;
				display:inline-block;
				vertical-align: top;
				text-align: center;

				a{
					padding-left: 40px;
					position: relative;
					line-height: 60px;
					height:60px;
					display:inline-block;
					width:100%;
					box-sizing:border-box;
				}

				a.active{
					background-color: $deepGray;
				}

				@each $name in machine,user,shop,adv,active{
					.#{$name}_setting:before{
						content:"";
						background: url(#{$client_images}/nav_#{$name}.png) 0px 0px no-repeat;
						position:absolute;
						right:60%;
						top:20px;
						width:30px;
						height:30px;
					}
				}

				
			}	



		}
	}
</style>