<template>
	<div class="m_right_content active_setting_box">
		<div class="top_bar">
			<h2 class="title">以下是该机器的【活动设置】</h2>
			<!-- <button class="connect_btn">关联活动</button> -->

			<div class="dxe_link_btn">
				<a @click="toggleRecordBox">已领取的客户</a>
			</div>
		</div>
		<div class="content_box">
			<div class="active_item">
				<div class="edit_box">	
						<p>活动标题:
							<input type="text" v-model="discount.discountTitle"/>
						</p>
						<p>联系电话:
							<input type="tel" v-model="discount.discountTel"/>
						</p>
						<p>有效时间:
							<!-- <input type="text" @click="showCalendar"  v-model="value" placeholder="请输入日期"/>- -->
							<!-- <datepicker :readonly="false" format="YYYY-M-D" :value="discount.beginDate" v-model="discount.beginDate"></datepicker>
							—
							<datepicker :readonly="false" format="YYYY-M-D" :value="discount.endDate" v-model="discount.endDate"></datepicker> -->

							<input type="date" name="beginDate" @change="dateChange" v-model="discount.beginDate">-
							<input type="date" name="endDate" @change="dateChange" v-model="discount.endDate"  >
						</p>
						<p>使用地址:
							<input type="text" v-model="discount.discountStoreAddr"/>
						</p>
						<p>使用说明:
							<input type="text" v-model="discount.discountDesc"/>
						</p>
						<div class="bottom">
							<button class="save_btn" @click="saveDiscount">保存</button>
							<input type="checkbox" v-model="showAllMachine" :checked="showAllMachine" id="allMachine">
							<label for="allMachine">运用到所有机器</label>
						</div>
				</div>
				
			</div>

			
		</div>

		<div v-show="showRecordBox" class="discount_record_box" transition="bounce">
			<div class="cover" @click="toggleRecordBox"></div>
			<div class="edit_box">
				<div class="top_bar">
					已领取优惠券的客户
					<button class="close_btn btn" @click="toggleRecordBox">X</button>
				</div>
				<div class="table_box">
					<table border="1">
						<tr>
							<th>序号</th>
							<th>手机号码</th>
							<th>领取时间</th>
						</tr>
						<tr v-for="item in discountRecord">
							<td>{{$index+1}}</td>
							<td>{{item.sendMobile}}</td>
							<td>{{item.sendTime}}</td>
						</tr>
					</table>
					<paging :current="pageNumber" :all="totalPages"></paging>
				</div>
				<div class="bottom">
					<button class="cancel_btn" @click="toggleRecordBox">返回</button>
				</div>
			</div>
		</div>

	<!-- 	popup edit
	<div v-show="ifSelectBox" class="connect_select" transition="bounce">
		<div class="top_bar">
			选择活动
			<button class="btn close_btn" @click="hideSelectBox">X</button>
		</div>
		<div class="search_bar">
			<label for="active_name">活动标题:</label>
			<input type="text" id="active_name" v-model="filterName">
	
			<button class="btn">查询</button>
		</div>
		
		<div class="item_list">
			<div class="item" v-for="item in all_actives | filterBy filterName in 'discountTitle'">
				<p>活动标题:{{item.discountTitle}}</p>
				<p>店铺名称:{{item.discountStoreName}}</p>
				<p>店铺地址:{{item.discountStoreAddr}}</p>
				<p>联系电话:{{item.discountTel}}</p>
				<input type="checkbox" :value="item.discountId" name="discountId" v-model="selectActives">
				<label></label>
			</div>
		</div>
	
		<div class="bottom">
			<button class="btn save_btn" @click="checkSelect">确认选择</button>
			<button class="btn cancel_btn" @click="hideSelectBox">取消返回</button>
		</div>
	</div>
	<div class="cover" v-show="ifSelectBox" @click="hideSelectBox" transition="bounce"></div>
	 -->
		<!-- msg box -->
		<model></model>
	</div>
</template>

<script>
	import paging from "../paging.vue";
	import model from '../model.vue';
	// import datepicker from 'vue-date-picker';
	export default{
		data(){
			return{
				discount:{
					beginDate:"",
					endDate:""
				},
				showMsg:false,
				editState:false,
				showAllMachine:true,
				effectiveTime:"",
				showRecordBox:false,
				discountRecord: [],

				totalPages:0,
				pageNumber:0
			}
		},
		route:{
			data:function(){
				this.refresh();
			}
		},
		methods:{
			refresh:function(){
				var self = this;
				self.$http.get("/machine_discount/"+self.$route.query.machineId).then(
					function(response){
						console.log(response)
						self.discount = response.data.data ? response.data.data : {};
						self.showAllMachine = self.discount.isShared === 1;
					})
			},
			//确认有效日期起始日期和结束日期正确
			checkDate:function(){
				var self = this;
				var beginTime = new Date(self.discount.beginDate).getTime();
				var endTime = new Date(self.discount.endDate).getTime();

				console.log(self.discount.beginDate)
				console.log(self.discount.endDate)

				if(beginTime>=endTime && beginTime>0){
					self.discount.endDate=self.discount.beginDate;
					self.$broadcast("tipsMsg",'请选择正确的有效时间。')
				}
			},
			currentDate:function(){
				var date = new Date();
				var year = date.getFullYear(),
						month = date.getMonth()>10 ? date.getMonth() : "0"+date.getMonth(),
						day = date.getDate()>10 ? date.getDate() : "0"+date.getDate();

				var defaultTime = year+"-"+month+"-"+day;

				return defaultTime;
			},
			saveDiscount:function(){
				var self = this;
				self.discount.isShared = self.showAllMachine ? 1 : 0;
				self.$http.post("/machine_discount/"+self.$route.query.machineId,self.discount).then(
					function(response){
						if(200 == response.data.code){
							// console.log(response);
							self.$broadcast('tipsMsg',response.data.msg)
						}else{
							self.$broadcast('tipsMsg',response.data.msg)
						}
					}
				)
			},
			clearDiscount:function(){
				var self = this;
				self.$http.delete("/machine_discount/"+self.$route.query.machineId,self.discount).then(
					function(response){
						if(200 == response.data.code){
							self.modelTips(response.data.msg)
							self.refresh();
						}else{
							self.modelTips(response.data.msg)
						}
					}
				)
			},
			dateChange:function(e){
				var self = this;
				var begin = new Date(self.discount.beginDate).getTime();
				var end = new Date(self.discount.endDate).getTime();

				console.log(begin+"--"+end)
				var target = e.target.getAttribute('name');
				console.log(target)
				if(end<begin && begin!==0 && end!==0){
					self.$broadcast('tipsMsg','请选择正确的有效时间。')
					if('beginDate'==target){
						e.target.value = self.discount.endDate;
					}else{
						e.target.value = self.discount.beginDate;
					}
				}
			},
			toggleRecordBox:function(e){
				this.showRecordBox = !this.showRecordBox;
				if(this.showRecordBox){
					this.getSendlog();
				}
			},
			getSendlog: function(){
				this.$broadcast('keepMsg','正在加载。')
				this.$http.get("/machine_discount_log/"+this.$route.query.machineId, {
					pageNumber: this.pageNumber,
					pageSize: 10
				}).then(function(response){
					if(200 == response.data.code){
						this.$broadcast('hideMsg')
					}

					var data = response.data.data;
					this.discountRecord = data.list;
					this.pageNumber = data.pageNumber;
					this.totalPages = data.totalPages;
				})
			}
		},
		events: {
			'pageChange':function(num){
				if(num>this.totalPages){
					return;
				}
				this.pageNumber = num;
				this.getSendlog();
			}
		},
		components:{
			paging,
			model,
			// datepicker
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';

	.active_setting_box{

		.content_box{
			position:relative;
			.active_item{
				display:block;
				background:url(#{$client_images}/active_bg.png) 0px 0px no-repeat;
				background-size:100% 100%;
		    color: #fff;
		    height: 600px;
		    text-align: center;
		    width:950px;
		    padding-top:30px;
		    box-sizing: border-box;
		    position:relative;
		    margin:20px auto;
		    overflow:hidden;

				.edit_box{
			    width: 450px;
			    margin: 25px auto 10px;
					p{
						line-height: 26px;
						font-size: 16px;
						margin-top:5px;
						text-align:left;
						padding-left:30px;
						input{
							width:280px;
							height:24px;
							box-sizing:border-box;
							color:#333;
						}
						&:nth-of-type(3){
							input{
								width:135px;
							}
						}
					}
					.bottom{
						text-align:center;
						.save_btn{
							@extend .btn;
							display:inline-block;
							margin:5px auto;
							width:120px;
							height:30px;
							background-color:$lightBlue;
						}

						label{
							color:#fff;
							font-size:14px;
							margin:0px;
							vertical-align:middle;
						}
						input[type="checkbox"]{
							height:18px;
							width:18px;
							vertical-align:middle;
						}
					}
					
				}

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
					width:300px;
					height:28px;
					border:1px solid #borderGray;
				}
				button{
					background-color:$lightBlue;
					width:80px;
					height:28px;
				}
			}

			.item_list{
		    width: 90%;
		    margin: 10px auto;
		    background-color: #fff;
		    height: 400px;
		    overflow: auto;
		    padding:25px 80px;
		    box-sizing:border-box;

		    .item{
					background:url(#{$client_images}/active_item_bg.png) 0px 0px no-repeat;
					background-size:100% 100%;
			    color: #fff;
			    height: 180px;
			    text-align: left;
			    padding: 30px 80px;
			    box-sizing: border-box;
			    position:relative;
			    

					p{
						line-height: 26px;
						font-size: 16px;
					}

					input[type="checkbox"]{
						position:absolute;
						display:block;
						width:100%;
						height:100%;
						left:0;
						top:0;
						opacity: 0;
						cursor: pointer;
					}
					
					input[type="checkbox"]:checked+label{
						background:url(#{$client_images}/white_gou.png) 5px 5px no-repeat;
				    background-size: 60% 60%;
				    display: inline-block;
				    width: 24px;
				    height: 24px;
				    background-color: #4ec963;
				    border-radius: 50%;
				    position: absolute;
				    right: 3px;
				    top: -5px;
				    opacity: .8;
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

		.discount_record_box{
			display:block;
	    position: fixed;
	    width: 100%;
	    height: 100%;
	    top: 0px;
	    left: 0px;
	    z-index:100;
			.edit_box{
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
				    line-height: 12px;
		        padding-left: 8px;
				    border-radius: 50%;
				    margin: 5px;
				    background-color: #777;
					}
				}

				.table_box{
					width:100%;
					height:480px;
					overflow:auto;
					margin:10px 0px;
					position: relative;
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
					text-align:center;
					button{
						@extend .btn;
						width:120px;
						height:30px;
					}
					input[type="file"]{
						display:none;
					}
					.cancel_btn{
						background-color:#777;
					}
				}
			}
		}
	}
</style>