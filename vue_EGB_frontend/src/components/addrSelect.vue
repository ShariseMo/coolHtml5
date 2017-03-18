<template>
	<div class="edit_addr_box">
		<select name="province" id="province" @change="changeCity" v-model="province" v-show="province">
			<option v-for="item in provinceList" :value="item.code">
				{{item.name}}
			</option>
		</select>
		<select name="city" id="city" @change="changeDistrict" v-model="city" v-show="city">
			<option v-for="item in cityList" :value="item.code">
				{{item.name}}
			</option>
		</select>
		<select name="district" id="district" @change="changeTown" v-model="district" v-show="district">
			<option v-for="item in districtList" :value="item.code">
				{{item.name}}
			</option>
		</select>
		<select name="town" id="town" v-model="town" v-show="town">
			<option v-for="item in townList" :value="item.code">
				{{item.name}}
			</option>
		</select>
		<input type="text" v-show="town">
	</div>
</template>

<script>
	export default{
		props:["addrText"],
		data(){
			return {
				areaList:[],
				provinceList:[],
				cityList:[],
				districtList:[],
				townList:[],

				province:"11",
				city:"",
				district:"",
				town:""
			}
		},
		created:function(){
			var self = this;
			self.$http.get("/areaList.js").then(
				function(response){
					self.areaList = eval(response.data);
					console.log(self.areaList);
					self.provinceList = self.areaList;
				}
			)
		},
		methods:{
			changeCity:function(){
				var self = this;
				var code = self.province;

				self.areaList.forEach(function(value){
					if(self.province == value.code){
						self.cityList = value.subordinates;
					}
				})

				self.city = self.cityList[1].code;
				console.log(self.cityList);
			},
			changeDistrict:function(){
				var self = this;
				var code = self.city;

				self.cityList.forEach(function(value){
					if(self.city == value.code){
						self.districtList = value.subordinates;
					}
				})

				self.district = self.districtList[1].code;
			},
			changeTown:function(){
				var self = this;
				var code = self.district;

				self.districtList.forEach(function(value){
					if(self.district == value.code){
						self.townList = value.subordinates;
					}
				})

				self.town = self.townList[1].code;
				console.log(self.townList);
			}
		}
	}
</script>

<style lang="sass">
@import '../../style/lib.scss';
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
</style>