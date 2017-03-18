<template>
	<!-- 活动设置页 -->
	<div class="right_content active_material_setting">
		<div class="top_bar">
			<h2>活动信息设置</h2>
			<button class="add_btn" @click="addActive">添加活动</button>
		</div>
		<div class="search_box">
			<label for="active_name">活动标题:</label>
			<input type="text" name="active_name" id="active_name" v-model="filterActive">

			<button class="search_btn" @click="searchActive">查询</button>
		</div>

		<table class="active_table" border="1">
			<tr>
				<th>序号</th>
				<th>活动标题</th>
				<th>店铺名称</th>
				<th>店铺地址</th>
				<th>联系电话</th>
				<th>操作</th>
			</tr>

			<tr v-for="item in activeData" 
				track-by="$index"
				transition="staggered"
				stagger="0">
				<td>{{$index+1}}</td>
				<td>{{item.discountTitle}}</td>
				<td>{{item.discountStoreName}}</td>
				<td>{{item.discountStoreAddr}}</td>
				<td>{{item.discountTel}}</td>
				<td>
					<button class="btn" @click="updateActive(item)">修改</button>
					<button class="btn" @click="delActive($index,item.discountId)">删除</button>
				</td>
			</tr>
		</table>

		<page v-show="totalPages > 1" :current="current_page" :all="totalPages"></page>

		<!-- edit shop popup -->
		<div class="active_edit_box" v-show="show" transition="bounce">
			<div class="top_bar">
				添加活动
				<button class="btn close_btn" @click="hideEditBox">X</button>
			</div>

			<div class="form_box">
				<div class="input_group">
					<label for="edit_shop_name">活动标题:</label>
					<input type="text" id="edit_shop_name" v-model="editActiveData.discountTitle">
				</div>
				<div class="input_group">
					<label for="edit_shop_addr">活动名称:</label>
					<input type="text" id="edit_shop_addr" v-model="editActiveData.discountStoreName">
				</div>
				<div class="input_group">
					<label for="edit_shop_coor">店铺地址:</label>
					<input type="text" v-model="editActiveData.discountStoreAddr">
				</div>
				<div class="input_group">
					<label for="edit_shop_tel">联系电话:</label>
					<input type="text" id="edit_shop_tel" v-model="editActiveData.discountTel">
				</div>


			</div>

			<div class="bottom">
				<button class="btn save_btn" @click="checkEdit">确认</button>
				<button class="btn cancel_btn" @click="hideEditBox">取消</button>
			</div>
		</div>
		<div class="cover" v-show="show" @click="hideEditBox"></div>

		<!-- msg box -->
		<model v-if="showMsg" :msg="msgText"></model>
	</div>
</template>

<script>
	import model from '../model.vue';
	import page from '../paging.vue';
	export default{
		data(){
			return{
				activeData:[],
				filterActive:"",
				show:false,
				editActiveData:{},
				showMsg:false,

				//分页
				current_page:1,
				pageNumber:"",
				pageSize:5,
				totalPages:""
			}
		},
		route:{
			data:function(){
				var self = this;
				self.refresh();
			}
		},
		methods:{
			searchActive:function(){
				this.refresh(1,this.filterActive)
			},
			delActive:function(index,id){
				var self = this;
				self.activeData.splice(index,1);
				self.$http.delete("/discount/"+id).then(
					function(response){
						self.modelTips(response.data.msg);
					}
				)
			},
			hideEditBox:function(){
				this.show = false;
				this.editActiveData = {};
			},
			showEditBox:function(){
				this.show = true;
			},
			addActive:function(){
				this.showEditBox();
				this.editActiveData = {};
			},
			refresh:function(page,title){
				if(!page){page = 1}
				if(!title){title = ""}
				var self = this ;
				self.$http.get("/discounts",{discountTitle:title,pageNumber:page}).then(
					function(response){
						console.log(response);
						self.activeData = response.data.data.list;
						self.totalPages = response.data.data.totalPages;
						self.current_page = response.data.data.pageNumber;
					})
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
			updateActive:function(item){
				var self = this;
				self.editActiveData = item;
				console.log(self.editActiveData);
				self.showEditBox();
			},
			checkEdit:function(){
				var self = this;
				console.log(self.editActiveData.discountId)
				//edit active
				if(self.editActiveData.discountId){
					console.log("a")
					self.$http.post("/discount/"+self.editActiveData.discountId,self.editActiveData).then(
						function(response){
							if(200 == response.data.code){
								self.hideEditBox();
							}
						},
						function(err){
							console.log(err)
						}
					)
				}else{
					//add active
					self.$http.post("/discount",self.editActiveData).then(
						function(response){
							console.log(response)
							if(200 == response.data.code){
								this.hideEditBox();
								self.$http.get("/discounts").then(
								function(response){
									self.activeData = response.data.data.list;
								},function(err){
									console.log(err)
								})
							}else{
								console.log(response.data)
								self.modelTips(response.data.msg);
							}
						},
						function(err){
							console.log(err)
						}
					)
				}
			}
		},
		events:{
			'pageChange':function(page){
				this.refresh(page);
			}
		},
		components:{
			model,
			page,
		}
	}
</script>

<style lang="sass">
@import '../../../style/lib.scss';
		//active material manage page
	.active_material_setting{
		.search_box{
			padding:15px;
			 label{
			 	font-size: 16px;
			 }
			 input{
			 	width:350px;
			 	height:30px;
			 	margin-right: 20px;
			 }
		}

		.active_table{
			width:98%;
			border:1px solid $borderGray;

			th{
				background-color:$lightBlue;
				height:30px;
				line-height: 30px;
				color:#fff;
				text-align: center;
			}
			td{
				text-align: center;
				height: 80px;
				min-width: 50px;
				max-width: 250px;
				.btn{
					display:block;
					background-color:#fff;
					color:$lightBlue;
					margin:0px auto;
				}
			}
		}
	}

		//server edit css
	.active_edit_box{
    position: fixed;
    z-index: 100;
    background-color: #f8f8f8;
    width: 550px;
    height: 400px;
    border-radius: 5px;
    top: 50%;
    left: 50%;
    margin-top: -275px;
    margin-left: -200px;
    overflow: hidden;

		.top_bar{
			height:30px;
			line-height: 30px;
			padding-left:15px;
			background-color:#e7e7e7;

			.close_btn{
				float: right;
				margin-right: 15px;
				height:18px;
				width:18px;
				border-radius:50%;
				background-color:#aaa;
				margin-top: 5px;
			}
		}

		.form_box{
			padding-top:0px;
			min-height: 0px;
			.input_group{
				width:100%;
				text-align: left;
				padding-left:18%;
				margin:20px 0px;

				label{
					font-size:16px;
					display:inline-block;
					width:80px;
				}
				input[type="text"]{
					height:26px;
					width:320px;
				}
				input[type="file"]{
					display:none;
				}

				.cover_Avatar{
					height:60px;
					width:60px;
					vertical-align: middle;
					display:inline-block;
					background-color:#aaa;
					border-radius:50%;
					cursor: pointer;
				}
				.cover_qrcode{
					width:80px;
					height:80px;
					line-height: 40px;
					display:inline-block;
					background-color:#fff;
					text-align: center;
					cursor:pointer;
					margin-left: 80px;
				}
			}
		}

		.bottom{
			text-align:center;
			margin-top:50px;
			button{
				width:150px;
				height:40px;
			}
			.save_btn{
				background-color:$lightBlue
			}
			.cancel_btn{
				background-color:#aaa;
				margin-left: 20px;
			}
		}
	}
</style>