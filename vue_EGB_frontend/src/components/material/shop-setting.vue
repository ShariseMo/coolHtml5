<template>
	<!-- 店铺设置 -->
	<div class="right_content shop_material_setting">
		<div class="top_bar">
			<h2>店铺信息设置</h2>
			<button class="add_btn" @click="addShop">添加店铺</button>
		</div>
		<div class="search_box">
			<label for="shop_name">店铺名称:</label>
			<input type="text" name="shop_name" id="shop_name" v-model="searchShopName">

			<button class="search_btn" @click="searchShop">查询</button>
		</div>

		<table class="shop_table" border="1">
			<tr>
				<th>序号</th>
				<th>店铺名称</th>
				<th>店铺地址</th>
				<th>门店坐标</th>
				<th>电话</th>
				<th>传真</th>
				<th>售后电话</th>
				<th>售后QQ</th>
				<th>邮箱</th>
				<th>投诉电话</th>
				<th>操作</th>
			</tr>

			<tr v-for="item in shopData | filterBy shopName in 'storeName'"
				transition="staggered"
				stagger="0"
				>
				<td>{{$index+1}}</td>
				<td>{{item.storeName}}</td>
				<td>{{item.address}}</td>
				<td>{{item.baiduLatitude}},{{item.baiduLongitude}}</td>
				<td>{{item.tel}}</td>
				<td>{{item.fax}}</td>
				<td>{{item.saleTel}}</td>
				<td>{{item.saleQQ}}</td>
				<td>{{item.email}}</td>
				<td>{{item.suggest}}</td>
				<td>
					<button class="btn" @click="updateShop(item)">修改</button>
					<button class="btn" @click="del_shop($index,item.storeId)">删除</button>
				</td>
			</tr>
		</table>

		<page v-show="totalPages > 1" :current="current_page" :all="totalPages"></page>

		<!-- edit shop popup -->
		<div class="shop_edit_box" v-show="show" transition="bounce">
			<div class="top_bar">
				修改
				<button class="btn close_btn" @click="hideEditBox">X</button>
			</div>

			<div class="form_box">
				<div class="title_logo">
					<img src="/images/client_background/egb_logo.png" alt="">
				</div>
				<div class="input_group">
					<label for="edit_shop_name">店铺名称:</label>
					<input type="text" id="edit_shop_name" v-model="editShopData.storeName">
				</div>
				<div class="input_group">
					<label for="edit_shop_addr">店铺地址:</label>
					<input type="text" id="edit_shop_addr" v-model="editShopData.address">
				</div>
				<div class="input_group">
					<label for="edit_shop_coor">店铺坐标:</label>
					<div class="right">
						<button class="btn coor_set">标记</button>
						{{editShopData.baiduLongitude}},{{editShopData.baiduLatitude}}   
					</div>
				</div>
				<div class="input_group">
					<label for="edit_shop_tel">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话:</label>
					<input type="text" id="edit_shop_tel" v-model="editShopData.tel">
				</div>
				<div class="input_group">
					<label for="edit_shop_fax">传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;真:</label>
					<input type="text" id="edit_shop_fax" v-model="editShopData.fax">
				</div>
				<div class="input_group">
					<label for="edit_shop_serviceTel">售后电话:</label>
					<input type="text" id="edit_shop_serviceTel" v-model="editShopData.saleTel">
				</div>
				<div class="input_group">
					<label for="edit_shop_qq">售后QQ:</label>
					<input type="text" id="edit_shop_qq" v-model="editShopData.saleQQ">
				</div>
				<div class="input_group">
					<label for="edit_shop_email">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:</label>
					<input type="text" id="edit_shop_email" v-model="editShopData.email">
				</div>
				<div class="input_group">
					<label for="edit_shop_adviseTel">投诉电话:</label>
					<input type="text" id="edit_shop_adviseTel" v-model="editShopData.suggest">
				</div>

			</div>

			<div class="bottom">
				<button class="btn save_btn" @click="checkEdit">确认</button>
				<button class="btn cancel_btn" @click="hideEditBox">取消</button>
			</div>
		</div>
		<div class="cover" v-show="show" @click="hideEditBox"></div>

		<!-- confirm box -->
		<confirm v-show="showConfirm" transition="bounce"></confirm>
	</div>
</template>

<script>
	import page from "../paging.vue";
	import confirm from "../confirm.vue";
	export default{
		data(){
			return{
				shopData:{},
				shopName:"",
				show:false,
				editShopData:{}, //编辑商店信息时存储用

				//分页
				current_page:1,
				pageNumber:"",
				pageSize:5,
				totalPages:"",

				//查询
				searchShopName:"",

				// confirm
				showConfirm:false,
			}
		},
		route:{
			data:function(){
				var self = this;
				self.refresh();
			}
		},
		methods:{
			searchShop:function(){
				this.refresh(1,this.searchShopName);
			},
			del_shop:function(index,id){
				var self = this;
				self.showConfirm = true;

				this.$http.delete("/store/"+id).then(
					function(response){
						this.modelTips(response.data.msg);
						console.log(response)
						if(200==response.data.code){
							self.shopData.splice(index,1);
							self.showConfirm = false;
						}
					})
			},
			showEidtBox:function(){
				this.show = true;
			},
			modelTips:function(msg){
				var self = this;
				self.showMsg = true;
				self.msgText = msg;

				function hide(){
					self.showMsg = false;
				}
				setTimeout(function(){
					hide();
				},1500)
			},
			hideEditBox:function(){
				this.show = false;
				this.editShopData={}
			},
			addShop:function(){
				this.showEidtBox();
				this.editShopData = {};
				this.editState = 0;
			},
			updateShop:function(item){
				this.show = true;
				this.editShopData = item;
				this.editState = 1;
			},
			refresh:function(page,str){
				if(!page){page = 1}
				if(!str){str = ""}
				var self = this ;
				self.$http.get("/stores",{pageNumber:page,storeName:str}).then(
					function(response){
						self.shopData = response.data.data.list;
						self.totalPages = response.data.data.totalPages;
						self.current_page = response.data.data.pageNumber;
					})
			},
			checkEdit:function(){
				var self = this;
				//若存在storeId，则为修改信息，若无则为新增
				if(this.editShopData.storeId){
					self.$http.post("/store/"+this.editShopData.storeId,this.editShopData).then(
						function(response){
							if(200 == response.data.code){
								this.show = false;
							}
						}
					)
				}else{
					//新增店铺
					self.$http.post("/store",this.editShopData).then(
						function(response){
							if(200 == response.data.code){
								self.hideEditBox();
								self.refresh()
							}
						}
					)
				}
			},
		},
		events:{
			'pageChange':function(page){
				this.refresh(page);
			},
			"confirmChcek":function(bool){
				console.log(bool)
			}
		},
		components:{
			page,
			confirm,
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';
	//shop material manage page
	.shop_material_setting{
		.search_box{
			padding:15px;
			label{
				font-size: 16px;
			}
			input[type='text']{
				width:250px;
				height:30px;
				margin-right: 15px;
			}
		}

		.shop_table{
			width:98%;
			border:1px solid $borderGray;
			th{
				background-color: $lightBlue;
				color:#fff;
				height:30px;
				line-height: 30px;
			}
			td{
				padding:5px;
				text-align:center;
				height:80px;

				min-width: 40px;
				max-width: 120px;
				word-break: break-all;

				.btn{
					display:block;
					background-color:#fff;
					color:$lightBlue;
					margin:0px auto;
					margin-bottom: 10px;
				}
			}
		}

		//shop_edit_box
		.shop_edit_box{
			position: fixed;
			width:560px;
			height:600px;
			z-index: 100;
			background-color:#f8f8f8;
			top:50%;
			left:50%;
			margin-top:-300px;
			margin-left:-280px;
			border-radius:8px;
			overflow:hidden;
			.top_bar{
				height:30px;
				line-height:30px;
				font-size:16px;
				text-align: left;
				padding-left:15px;
				background-color:#e8e8e8;

				.close_btn{
					float:right;
					background-color:#777;
					border-radius:50%;
					height:18px;
					width:18px;
					cursor: pointer;
					color:#fff;
					margin:5px 15px;
				}
			}

			.form_box{
				min-height:0;
				padding-top:0px;
				.title_logo{
					height:80px;
					width:80px;
					border-radius:50%;
					margin:10px auto;
					background-color: $lightBlue;
			    line-height: 80px;
					img{
						width:90%;
						display:inline-block;
						line-height:80px;
				    vertical-align: middle;
					}
				}
				.input_group{
					label{
						display:inline-block;
						width:80px;
						font-size:14px;
					}
					input[type="text"]{
						width:350px;
						height:28px;
					}
					.right{
						width:350px;
						display:inline-block;
						text-align: left;
						.coor_set{
							float:right;
							margin-right:20px;
							color:$lightBlue;
							background-color: #f8f8f8;
						}
					}
				}
			}

			.bottom{
				text-align: center;
				margin-top:15px;
				button{
					width:120px;
					height:40px;
				}
				.save_btn{
					background-color:$lightBlue;
				}
				.cancel_btn{
					background-color:#aaa;
					margin-left:20px;
				}
			}
		}
	}
</style>