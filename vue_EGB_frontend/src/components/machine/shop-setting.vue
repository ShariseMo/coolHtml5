<template>
<!-- 店铺设置comp -->
	<div class="m_right_content shop_setting_box">
		<div class="top_bar">
			<h2 class="title">以下是该机器的【店铺设置】</h2>
			<!-- <button class="connect_btn" @click="showConnect">关联店铺</button> -->
			<!-- <button class="connect_btn" @click="saveSelectedShop">保存设置</button> -->

			<div class="dxe_link_btn">
				<span>(跳转至店小二后台进行修改)</span>
				<a href="http://dxe.edsmall.cn" target="_blank">修改店铺信息</a>
			</div>
		</div>
		<div class="content_box">
			<table class="shop_table">
				<tr>
					<th>序号</th>
					<th>店铺名称</th>
					<th>店铺地址</th>
					<th>门店坐标</th>
					<th>联系电话</th>
					<th>售后电话</th>
					<th>售后QQ</th>
					<th>邮箱</th>
				</tr>
				<tr v-for="item in allShopData">
					<td>{{$index+1}}</td>
					<td>{{item.storeName}}</td>
					<td>{{item.address}}</td>
					<td>{{item.baiduLongitude}},{{item.baiduLatitude}}</td>
					<td>{{item.tel}}</td>
					<td>{{item.saleTel}}</td>
					<td>{{item.saleQQ}}</td>
					<td>
						{{item.email}}
					</td>
				</tr>
			</table>
		</div>

		<!-- connect select box -->
		<div v-show="showSelectBox" class="connect_select" transition="bounce">
			<div class="top_bar">
				选择店铺
				<button class="btn close_btn" @click="hideSelectBox">X</button>
			</div>
			<div class="search_bar">

				<label for="service_tel">店铺名称:</label>
				<input type="text" id="service_tel" v-model="filterShop">

				<button class="btn">查询</button>
			</div>

			<div class="table_box">
				<table border="1">
					<tr>
						<th>序号</th>
						<th>客服名称</th>
						<th>联系电话</th>
						<th>选择关联</th>
					</tr>
					<tr v-for="item in allShop | filterBy filterShop in 'storeName'"
						transition="staggered"
						stagger="100"
						>
						<td>{{$index+1}}</td>
						<td>{{item.storeName}}</td>
						<td>{{item.tel}}</td>
						<td><input type="checkbox" name="connect_list" :value="item.storeId" v-model="connect_list"></td>
					</tr>
				</table>
			</div>


			<div class="bottom">
				<button class="btn save_btn" @click="checkSelect">确认选择</button>
				<button class="btn cancel_btn" @click="hideSelectBox">取消返回</button>
			</div>
		</div>
		<div class="cover" v-show="showSelectBox" @click="hideSelectBox" transition="bounce"></div>

		<!-- msg box -->
		<model></model>
	</div>
</template>

<script>
	import model from '../model.vue';
	export default{
		data(){
			return{
				allShopData:[],
				allShop:[],
				filterShop:"",
				connect_list:[],  //已选关联选项
				showSelectBox:false,  //弹窗是否显示
				showMsg:false,
				selectedShop:[], //已选店铺ID
			}
		},
		route:{
			data:function(){
				var self = this;
				self.refresh();
			}
		},

		methods:{
			showConnect:function(){
				this.showSelectBox = this.showSelectBox ? false : true;
				var self = this;
				self.$http.get("/all_stores/"+self.$route.query.machineId).then(
					function(response){
						self.allShop = response.data.data.list;
					})
			},
			saveSelectedShop:function(id){
				var self = this;
				// self.selectedShop.splice(self.selectedShop.indexOf(id),1);

				if(self.selectedShop.indexOf(id)<0){
					self.$http.post('/machine_store/'+self.$route.query.machineId,
							{storeId:id}
						).then(
						function(response){
							// console.log(response);
							self.$broadcast('tipsMsg',response.data.msg);
						},
					)
				}else{
					self.$http.post('/machine_remove_store/'+self.$route.query.machineId,{storeId:id}).then(
						function(response){
							// console.log(response);
							self.$broadcast('tipsMsg',response.data.msg);
						},
					)
				}
			},
			selectAllShop:function(){
				var self = this,
						str = "";
				// console.log(self.allShopData)
				str += self.allShopData.map(function(value){
					return value.seqId
				});
				// console.log(str)
				self.$http.put('/machine_store/'+self.$route.query.machineId,
							{storeId:str}
						).then(
						function(response){
							// console.log(response);
							self.$broadcast('tipsMsg',response.data.msg);
							self.refresh();
						},
					)
				self.refresh()
			},
			checkSelect:function(){
				var str = this.connect_list.join(",");
				var self = this;

				self.$http.post("/machine_relation/"+self.$route.query.machineId,
						{
							ids:str,
							type:2
						}
					).then(
						function(response){
							if(200 == response.data.code){
								if (200 == response.data.code) {
									self.refresh();
									self.hideSelectBox();
									self.$broadcast('tipsMsg',response.data.msg);
								}
							}
						})
			},
			hideSelectBox:function(){
				this.showSelectBox = false;
			},
			refresh:function(){
				var self = this;
				self.$http.get("/machine_store/"+self.$route.query.machineId).then(
					function(response){
						// console.log(response)
						self.allShopData = response.data.data.stores;
						self.selectedShop = response.data.data.selected;
					})
			},
			delShop:function(id){
				var self = this,
						obj = {
							machineId:self.$route.query.machineId,
							storeId:id
						}
				self.$http.post("/remove_related_store",obj).then(
					function(response){
						if (200 == response.data.code) {
							self.refresh();
							self.$broadcast('tipsMsg',response.data.msg);
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
		//shop_setting_box
	.shop_setting_box{
		.content_box{
			padding:10px;
			.shop_table{
				@extend .commont_table;
			}
		}
		//connect_box
		/* .connect_select{
			z-index: 100;
			display: block;
			width: 600px;
			height: 600px;
			border-radius:10px;
			background-color:#f8f8f8;
			position: fixed;
			left: 50%;
			top:50%;
			margin-left: -300px;
			margin-top:-300px;
			box-sizing:border-box;

			.top_bar{
				height:36px;
				line-height: 36px;
				font-size: 16px;
				text-align: left;
				padding-left:15px;
				
				.close_btn{
			    float: right;
			    width: 24px;
			    height: 24px;
			    border-radius: 50%;
			    margin: 5px;
			    background-color: #777;
				}
			}

			.search_bar{
				text-align: center;
				label{
					font-size:16px;
				}
				input{
					width:250px;
					height:28px;
					border:1px solid #borderGray;
				}
				button{
					background-color:$lightBlue;
					width:80px;
					height:28px;
				}
			}

			.table_box{
				width:100%;
				height:450px;
				overflow:auto;
				margin:10px 0px;
				table{
					width:95%;
					margin:15px auto;
					border:1px solid #f8f8f8;

					th,td{
						background-color: #fff;
						text-align: center;
						height:34px;
						line-height: 34px;

						input[type="checkbox"]{
							border:1px solid $borderGray;
					    width: 16px;
					    height: 16px;
					    cursor: pointer;
						}
					}
				}
			}

			.bottom{
				text-align: center;
				button{
					width:150px;
					height:40px;
					border:5px;
					font-size:16px;
				}
				.save_btn{
					background-color: $lightBlue;
				}
				.cancel_btn{
					background-color: #ccc;
					margin-left: 20px;
				}
			}			
		} */
	}		
</style>