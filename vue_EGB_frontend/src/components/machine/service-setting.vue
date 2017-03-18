<template>
<!-- 客服设置comp -->
	<div class="m_right_content kefu_setting_box">
		<div class="top_bar">
			<h2 class="title">以下是该机器的【客服设置】</h2>
			<!-- <button class="connect_btn" @click="showConnect">关联客服</button> -->

			<div class="dxe_link_btn">
				<span>(跳转至店小二后台进行修改)</span>
				<a href="http://dxe.edsmall.cn" target="_blank">修改客服信息</a>
			</div>
		</div>
		<div class="content_box">
			<table class="kefu_table">
				<tr>
					<th>序号</th>
					<th>客服名称</th>
					<th>客服工号</th>
					<th>手机号码</th>
					<th>固定电话</th>
					<th>QQ号码</th>
					<th>电子邮箱</th>
					<th>微信</th>
				</tr>

				<tr v-for="item in allServers">
					<td>{{$index + 1}}</td>
					<td>{{item.cserversName}}</td>
					<td>{{item.cserversCode}}</td>
					<td>{{item.cserversMPhone}}</td>
					<td>{{item.cserversTel}}</td>
					<td>{{item.cserversICQ}}</td>
					<td>{{item.cserversEmail}}</td>
					<td>
						<img v-if="item.cserversWeiXinQRCode" :src="item.cserversWeiXinQRCode" alt="">
						<p>{{item.cserversWeiXin}}</p>
					</td>
				</tr>
				
			</table>
		</div>

		<!-- connect select box -->
		<div v-show="showSelectBox" class="connect_select" transition="bounce">
			<div class="top_bar">
				选择客服
				<button class="btn close_btn" @click="hideSelectBox">X</button>
			</div>
			<div class="search_bar">
				<label for="service_name">客服名称:</label>
				<input type="text" id="service_name" v-model="filterName">

				<label for="service_tel">客服电话:</label>
				<input type="text" id="service_tel" v-model="filterTel">

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
					<tr v-for="item in allServers | filterBy filterTel in 'cserversMPhone' | filterBy filterName in 'cserversName'"
						transition="staggered"
						stagger="100"
						>
						<td>{{$index+1}}</td>
						<td>{{item.cserversName}}</td>
						<td>{{item.cserversMPhone}}</td>
						<td><input type="checkbox" name="connect_list" :value="item.cserversId" v-model="connect_list"></td>
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
				relatedServiceIds:[],  //已关联客服id
				relatedServiceData:[],  //已关联客服数据
				allServers:[],  //所有客服

				connect_list:[],  //已选关联选项
				showSelectBox:false,  //弹窗是否显示
				filterTel:"",  //过滤客服电话
				filterName:"", //过滤客服名称
			}
		},
		route:{
			data:function(){
				var self = this;
				self.$http.get("/machine_server/"+self.$route.query.machineId).then(
					function(response){
						// console.log(response)
						self.relatedServiceIds = response.data.data.selected;
						self.allServers = response.data.data.servers;

						self.allServers.forEach(function(data){
							self.relatedServiceIds.forEach(function(id){
								if(id == data.cserversId){
									self.relatedServiceData.push(data)
								}
							})
						})
					})
				

			}
		},

		methods:{
			showConnect:function(){
				this.showSelectBox = this.showSelectBox ? false : true;
				var self = this;
				/*self.$http.get("/all_servers/"+self.$route.query.machineId).then(
					function(response){
						self.allServers = response.data.data.list;
					})*/
			},
			disconnect:function(index,id){
				var self = this,
						obj = {
							serverId:id,
						}
				self.$http.post('/machine_remove_server/'+self.$route.query.machineId,obj).then(
					function(response){
						if(200 == response.data.code){
							self.relatedServiceData.splice(index,1);
							self.$broadcast('tipsMsg',response.data.msg);
						}
					}
				)
			},
			refresh:function(){
				var self = this;
				self.$http.get("/related_servers/"+self.$route.query.machineId).then(
					function(response){
						self.relatedServiceData = response.data.data;
					})
			},
			checkSelect:function(){
				var str = this.connect_list.join(",");
				var self = this;

				var obj ={
							ids:str,
							type:1
						}

				self.$http.post("/machine_relation/"+self.$route.query.machineId,obj).then(
						function(response){
							if(200 == response.data.code){
								self.hideSelectBox();
								self.$broadcast('tipsMsg',response.data.msg);
								self.refresh();
							}
						})
			},
			hideSelectBox:function(){
				this.showSelectBox = false;
			},

			saveSelected:function(){
				var self = this;
				var data = {serverId:self.relatedServiceIds.join(',')};
				self.$http.put('/machine_server/'+self.$route.query.machineId,data).then(
					function(response){
						self.$broadcast('tipsMsg',response.data.msg)
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
	//kefu_setting_box
		.kefu_setting_box{

			.content_box{
				padding:10px;
				.kefu_table{
					@extend .commont_table;
				}
			}

			//connect_box
			.connect_select{
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
						width:150px;
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
			}

		}
</style>