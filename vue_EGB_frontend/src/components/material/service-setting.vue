<template>
	<div class="right_content kefu_material_setting">
		<div class="top_bar">
			<h2>客服信息设置</h2>
			<button class="add_btn" @click="showEditBox">添加客服</button>
		</div>
		<div class="search_box">
			<label for="kefu_name">客服标题:</label>
			<input type="text" name="kefu_name" id="kefu_name" v-model="serverName">
			<label for="kefu_phone">电话号码:</label>
			<input type="text" name="kefu_phone" id="kefu_phone" v-model="serverTel">

			<button class="search_btn" @click="searchServer">查询</button>
		</div>

		<table class="kefu_table" border="1">
			<tr>
				<th>序号</th>
				<th>客服名称</th>
				<th>客服工号</th>
				<th>手机号码</th>
				<th>固定电话</th>
				<th>QQ号码</th>
				<th>电子邮箱</th>
				<th>微信</th>
				<th>操作</th>
			</tr>

			<tr v-for="item in allServiceData"
					transition="staggered"
					stagger="0"
				>
				<td>{{$index+1}}</td>
				<td>
					<img :src="item.serverHeadImage" alt="">
					{{item.serverName}}
				</td>
				<td>{{item.serverCode}}</td>
				<td>{{item.serverMobile}}</td>
				<td>{{item.serverTel}}</td>
				<td>{{item.serverQQ}}</td>
				<td>{{item.serverEmail}}</td>
				<td>
					<img :src="item.serverWeChatQRCode" alt="">
					{{item.serverWeChat}}
				</td>
				<td>
					<button class="btn" @click="editServer(item)">修改</button>
					<button class="btn" @click="del_server($index,item.serverId)">删除</button>
				</td>
			</tr>
		</table>

		<page v-show="totalPages > 1" :current="current_page" :all="totalPages"></page>

		<div class="server_edit_box" v-show="show" transition="bounce">
			<div class="top_bar">
				添加客服
				<button class="btn close_btn" @click="hideEditBox">X</button>
			</div>
			<div class="form_box">
				<div class="input_group">
					<label for="server_avatar">客服头像:</label>
					<input type="file" id="server_avatar" @change="preview_avatar" name="serverAvatarImg">
					<label for="server_avatar" class="cover_Avatar">上传<br/>头像</label>
					<img v-show="avatarImg" :src="avatarImg" alt="" id="preview_avatar" class="preview_avatar">
					<!-- <img v-if="serverData.serverHeadImage" class="preview_avatar" :src="serverData.serverHeadImage" alt=""> -->
				</div>
				<div class="input_group">
					<label for="server_name">客服名称:</label>
					<input type="text" id="server_name" v-model="serverData.serverName" required>
				</div>
				<div class="input_group">
					<label for="server_num">客服工号:</label>
					<input type="text" id="server_num" v-model="serverData.serverCode" required>
				</div>
				<div class="input_group">
					<label for="server_mobile">手机号码:</label>
					<input type="text" id="server_mobile" v-model="serverData.serverMobile" required>
				</div>
				<div class="input_group">
					<label for="server_tel">固&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话:</label>
					<input type="text" id="server_tel" v-model="serverData.serverTel" required>
				</div>
				
				<div class="input_group">
					<label for="server_email">电子邮箱:</label>
					<input type="text" id="server_email" v-model="serverData.serverEmail" required>
				</div>
				<div class="input_group">
					<label for="server_qq">Q&nbsp;Q号码:</label>
					<input type="text" id="server_qq" v-model="serverData.serverQQ" required>
				</div>
				<div class="input_group">
					<label for="server_wechat">微&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;信:</label>
					<input type="text" id="server_wechat" v-model="serverData.serverWeChat" required>
				</div>
				<div class="input_group">
					<input type="file" @change="preview_wechat" id="server_wechatImg" name="serverWechatImg">
					<label for="server_wechatImg" class="cover_qrcode">上传<br/>微信二维码</label>
					<img v-show="wechatImg" id="preview_wechat" class="preview_wechat" :src="wechatImg" alt="">
					<!-- <img v-if="serverData.serverWeChatQRCode" class="preview_wechat" :src="serverData.serverWeChatQRCode" alt=""> -->
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
				allServiceData:[],
				serverName:"",
				serverTel:"",
				show:false,
				showMsg:false,
				serverData:{},
				wechatImg:"",
				avatarImg:"",
				showWechat:false,
				showAvatar:false,

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
			searchServer:function(){
				this.refresh(1,this.serverName,this.serverTel);
			},
			del_server:function(index,id){
				var self = this;
				self.allServiceData.splice(index,1);
				self.$http.delete("/server/"+id).then(
					function(response){
						this.modelTips(response.data.msg);
					},
					function(err){
						console.log(err)
					}
				)
			},
			hideEditBox:function(){
				this.show = false;
				this.serverData = [];
			},
			showEditBox:function(){
				console.log(this.serverData);
				this.show = true;
			},
			editServer:function(item){
				this.serverData = item;
				this.wechatImg = item.serverWeChatQRCode;
				this.avatarImg = item.serverHeadImage;
				this.showEditBox();
			},
			preview_wechat:function(e){
				var self = this;
				let file = e.target.files[0];
				// let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png'];


				self.serverData.qrCode = file;
				var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function(e){
        	self.wechatImg = e.target.result;
        }
        self.showWechat = true;
			},
			preview_avatar:function(e){
				var self = this;
				let file = e.target.files[0] || e.target.files;

				self.serverData.headImage = file;
				var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function(e){
        	self.avatarImg = e.target.result;
        }
        self.showAvatar = true;
			},
			refresh:function(page,name,tel){
				if(!page){page=1}
				if(!name){name=""}
				if(!tel){tel=""}
				var self = this;
				self.$http.get("/servers",{pageNumber:page,serverName:name,serverMobile:tel}).then(
					function(response){
						self.allServiceData = response.data.data.list;
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
			writeFrom:function(data){
				var form_data = new FormData();
				form_data.append('headImage',data.headImage);
				form_data.append('qrCode',data.qrCode);
				form_data.append('serverWeChat',data.serverWeChat);
				form_data.append('serverQQ',data.serverQQ);
				form_data.append('serverEmail',data.serverEmail);
				form_data.append('serverTel',data.serverTel);
				form_data.append('serverMobile',data.serverMobile);
				form_data.append('serverCode',data.serverCode);
				form_data.append('serverName',data.serverName);

				return form_data;
			},
			checkEdit:function(){
				var self = this;
						
				var uploadData = self.writeFrom(self.serverData);
				if(self.serverData.serverId){
					self.$http.post("/server/"+self.serverData.serverId,
						uploadData).then(
						function(response){
							if(200 == response.data.code){
								self.modelTips(response.data.msg);
								self.hideEditBox();
								self.serverData = {};
								self.refresh();
							}else{
								console.log(response);
								self.modelTips(response.data.msg);
							}
						}
					)
				}else{
					self.$http.post("/server",uploadData).then(
						function(response){
							if(200 == response.data.code){
								self.modelTips(response.data.msg)
								self.hideEditBox();
								self.refresh();
								self.serverData = {};
							}else{
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
	//kefu material manage page
	.kefu_material_setting{
		.search_box{
			padding:15px;
			 label{
			 	font-size: 16px;
			 }
			 input{
			 	width:200px;
			 	height:26px;
			 	margin-right: 20px;
			 }
		}

		.kefu_table{
			width:98%;
			border:1px solid $borderGray;
			th{
				background-color:$lightBlue;
				color:#fff;
				text-align: center;
				min-width: 60px;
				height:30px;
				line-height: 30px;
			}
			td{
				height:80px;
				text-align: center;
				padding:10px;
				&:nth-of-type(2){
					img{
						border-radius: 50%;
						width:70%;
						display:block;
						margin:0px auto 5px;
					}
				}
				&:nth-of-type(5){
					color:$lightBlue;
					text-decoration: underline;
				}
				&:nth-of-type(8){
					img{
						width:50%;
						max-width:120px;
						display:block;
						margin:0px auto 5px;
					}
				}
				&:nth-of-type(9){
					.btn{
						color:$lightBlue;
						background:#fff;
						margin-bottom: 15px;
					}
				}
			}
		}
	}
	
	//server edit css
	.server_edit_box{
		position: fixed;
		z-index: 100;
		background-color:#f8f8f8;
		width:600px;
		height:600px;
		border-radius:5px;
		top:50%;
		left: 50%;
		margin-top:-300px;
		margin-left: -300px;
		overflow:hidden;

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
					color:#fff;
					text-align:center;
					line-height: 30px;
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
					vertical-align: middle;

				}

				.preview_avatar{
					height:60px;
					width:60px;
			    height: 70px;
					width: 70px;
					border-radius: 50%;
					vertical-align: middle;
				}
				.preview_wechat{
			    height: 90px;
				  width: 90px;
				  vertical-align: middle;
				}
			}
		}

		.bottom{
			text-align:center;
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