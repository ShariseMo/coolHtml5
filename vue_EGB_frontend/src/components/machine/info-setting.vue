<template>
	<!-- 机器设置comp -->
	<div class="m_right_content machine_setting_box">
		<div class="top_bar">
			<h2 class="title">以下是该机器的【机器设置】</h2>
		</div>
		<div class="content_box">
			<div class="input_group">
				<label for="machine_name">机器名称:</label>
				<input type="text" id="machine_name" name="machine_name" v-model="machineData.machineName">
			</div>
			<div class="input_group">
				<label for="invite_code">邀请码:</label>
				<input disabled type="text" id="invite_code" name="machine_name" v-model="machineData.invitationCode">
			</div>
			<div class="input_group">
				<label for="">运营场所:</label>
	
				<div class="right">
					<input name="machineWorkArea" type="checkbox" value="1" id="mendian" v-model="machineData.machineWorkArea">
					<label for="mendian">门店</label>
	
					<input name="machineWorkArea" type="checkbox" value="2" id="shouloubu" v-model="machineData.machineWorkArea">
					<label for="shouloubu">售楼部</label>
	
					<input name="machineWorkArea" type="checkbox" value="3" id="xiaoqu" v-model="machineData.machineWorkArea">
					<label for="xiaoqu">小区</label>
	
					<input name="machineWorkArea" type="checkbox" value="4" id="hezuolianmeng" v-model="machineData.machineWorkArea">
					<label for="hezuolianmeng">合作联盟</label>
					<br>
					<input name="machineWorkArea" type="checkbox" value="5" id="shangcheng" v-model="machineData.machineWorkArea">
					<label for="shangcheng">商城</label>
	
					<input name="machineWorkArea" type="checkbox" value="6" id="huodong" v-model="machineData.machineWorkArea">
					<label for="huodong">活动现场</label>
	
					<input name="machineWorkArea" type="checkbox" value="7" id="shichang" v-model="machineData.machineWorkArea">
					<label for="shichang">市场门槛</label>
	
					<input name="machineWorkArea" type="checkbox" value="0" id="qita" v-model="machineData.machineWorkArea">
					<label for="qita">其他</label>
				</div>
				
			</div>
			<div class="input_group">
				<label for="machine_name">地址定位:</label>
				<div class="right">
					<p class="addr_text">
					{{ provinceTxt }} {{ cityTxt }} {{ districtTxt }} {{ townTxt }}
					{{ machineData.machineAddr }}<button class="btn" @click="showEditAddr">修改地址定位</button>
						<span style="color:red;vertical-align:middle;">(设置后在屏保能显示当地天气)</span>
					</p>
					<div class="edit_addr_box" v-if="ifEditAddr">
						<select name="province" id="province" @change="onProvinceChange" v-model="province">
							<option v-for="item in provinceList" :value="item.code">
								{{item.name}}
							</option>
						</select>
						<select name="city" id="city" @change="onCityChange" v-model="city" v-show="city">
							<option v-for="item in cityList" :value="item.code">
								{{item.name}}
							</option>
						</select>
						<select name="district" id="district" @change="onDistrictChange" v-model="district" v-show="district">
							<option v-for="item in districtList" :value="item.code">
								{{item.name}}
							</option>
						</select>
						<select name="town" id="town" @change="onTownChange" v-model="town" v-show="town">
							<option v-for="item in townList" :value="item.code">
								{{item.name}}
							</option>
						</select>
						<input type="text" v-show="showAddr" placeholder="详细地址..." v-model="machineData.machineAddr">
					</div>
					
				</div>
			</div>
	
			<div class="btn_group">
				<button class="save_btn" @click="updateInfo">保存</button>
				<!-- <button class="cancel_btn">取消</button> -->
			</div>
		</div>

		<model></model>
	</div>
</template>

<script>
	import model from '../model.vue';
	import { initAreaDB, getAreaName, getChildren } from '../../areaDB.js';
	export default{
		data(){
			return{
				machineData:{},
				ifEditAddr:false,
				showMsg:false,
				msgText:"",

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
				showAddr:false,

				provinceTxt:"",
				cityTxt:"",
				districtTxt:"",
				townTxt:"",
			}
		},
		route:{
			data:function(){
				var self = this;
				initAreaDB(() => {
					this.provinceList = getChildren();

					self.$http.get("/machine/"+self.$route.query.machineId).then(
						function(response){
							var data = response.data.data;
							data.machineWorkArea = data.machineWorkArea ? data.machineWorkArea.split(",") : [];
							self.machineData = data;
							self.addrInText(self.machineData);
						})
				});
			}
		},
		methods:{
			showEditAddr:function(){
				var self = this;
				self.ifEditAddr = self.ifEditAddr ? false : true;
				self.showAddr = self.ifEditAddr;
			},
			onProvinceChange:function(){
				this.addrInText();
				this.city = this.cityList.length > 0 ? this.cityList[0].code : null;
				this.onCityChange();
				this.onDistrictChange();
				this.onTownChange();
			},
			onCityChange:function(){
				this.addrInText();
				this.district = this.districtList.length > 0 ? this.districtList[0].code : null;
				this.onDistrictChange();
				this.onTownChange();
			},
			onDistrictChange:function(){
				this.addrInText();
				this.town = this.townList.length > 0 ? this.townList[0].code : null;
				this.onTownChange();
			},
			onTownChange:function(){
				this.addrInText();
			},

			//将获取到的地址编码遍历转化成字符串
			addrInText: function(data){
				if(data){
					this.province = data.machineProvince;
					this.city = data.machineCity;
					this.district = data.machineDistrict;
					this.town = data.machineTown;
				}

				this.cityList = this.province ? getChildren(this.province) : [];
				this.provinceTxt = this.province ? getAreaName(this.province) : '';

				this.districtList = this.city ? getChildren(this.city) : [];
				this.cityTxt = this.city ? getAreaName(this.city) : '';

				this.townList = this.district ? getChildren(this.district) : [];
				this.districtTxt = this.district ? getAreaName(this.district) : '';
				
				this.townTxt = this.town ? getAreaName(this.town) : '';
			},

			//更新信息
			updateInfo:function(){
				var obj = {},
						self = this;
				obj.machineProvince = self.province;
				obj.machineCity = self.city;
				obj.machineDistrict = self.district;
				obj.machineTown = self.town;
				obj.machineAddr = self.machineData.machineAddr;
				obj.machineName = self.machineData.machineName;
				obj.invitationCode = self.machineData.invitationCode;
				obj.machineWorkArea = self.machineData.machineWorkArea.join(",");
					
				self.$http.post("/machine_info/"+self.$route.query.machineId,obj).then(
					function(response){
						if(200 == response.data.code){
							self.$broadcast('tipsMsg',response.data.msg);

							window.location.reload();
						}else{
							self.$broadcast("tipsMsg",response.data.msg)
						}
					}
				)
			}
		},
		components:{
			model,
		}
	}
</script>

<style lang="sass">
@import '../../../style/lib.scss';
	//machine_setting_box
	.machine_setting_box{
		@extend .m_right_content;
		.content_box{
			padding:50px;
			box-sizing:border-box;

			.input_group{
				margin-top:20px;
				>label{
					display:inline-block;
					width:100px;
					height:30px;
					line-height: 30px;
					vertical-align:middle;
					text-align: right;
					font-size: 16px;
					color:#333;
				}
				>input[type='text']{
					display:inline-block;
					height:24px;
					width:180px;
				}
				.right{
					display:inline-block;
					vertical-align: top;
					padding:5px 0px;

					input[type="checkbox"]{
						height:20px;
						width:20px;
						vertical-align: middle;
						padding-bottom: 10px;
						background-color: #fff;
				    margin-bottom: 15px;
					}
					input[type="text"]{
						width:180px;
						height:24px;
						line-height: 24px;
						box-sizing:border-box;
					}
					label{
						display:inline-block;
						vertical-align: middle;
						color:#333;
						width:60px;
						padding-bottom: 5px;
					}
					.edit_addr_box{
						select,option{
							width:120px;
							height:24px;
							line-height: 24px;
						}

						label{
							display:inline-block;
							vertical-align: top;
							width:60px;
							padding-bottom: 10px;
						}
					}
					.addr_text{
						font-size: 14px;
						color:#333;
						margin-bottom: 10px;

						&:before{
							content:"";
							background:url(#{$client_images}/addr_icon.png) 0px 0px no-repeat;
							height:24px;
							width:24px;
							vertical-align: middle;
							background-size: 100% 100%;
							display:inline-block;
						}

						button{
							color:$lightBlue;
							padding:0px 10px;
							background-color: #fff;
							color:$lightBlue;
						}
					}

					
				}
			}


			.btn_group{
				margin:15px 100px;
				.save_btn{
					@extend .btn;
					background-color: $lightBlue;
					width:120px;
					height:30px;
					line-height: 30px;
				}
				.cancel_btn{
					@extend .btn;
					background-color: #888;
					width:120px;
					height:30px;
					line-height: 30px;
				}
			}
			
		}
	}
</style>