<template>
	<!-- 广告产品图区域显示产品类型选择框 -->
	<div class="good_select_box" v-show="selectShow" transition="bounce">
		<div class="cover" @click="toggleShow"></div>
		<div class="selectBox">
			<div class="top_bar">
				<button class="close_btn btn" @click="toggleShow">X</button>
				<p v-show="!isPre">显示产品条件筛选</p>
				<p v-else>产品集预览</p>
				
			</div>
			<div class="select_form" v-show="!isPre">
				<!-- 风格 -->
				<div class="input_group">
					<label for="pstyle">风格:</label>
					<select name="pstyle" @change="getProductsList(1)" v-model="searchData.pstyle" id="pstyle">
						<option value="">全部</option>
						<option :value="item" v-for="item in styles | orderBy chnSort">{{item}}</option>
					</select>
				</div>
				<!-- 类型 -->
				<div class="input_group">
					<label for="ptype">类型:</label>
					<select name="ptype" @change="getProductsList(1)" v-model="searchData.ptype" id="ptype">
						<option value="">全部</option>
						<option :value="item" v-for="item in types | orderBy chnSort">{{item}}</option>
					</select>
				</div>
				<!-- 空间 -->
				<div class="input_group">
					<label for="pspace">空间:</label>
					<select name="pspace" @change="getProductsList(1)" v-model="searchData.aspace" id="pspace">
						<option value="">全部</option>
						<option :value="item" v-for="item in aspace | orderBy chnSort">{{item}}</option>
					</select>
				</div>
				<!-- 材质 -->
				<div class="input_group">
					<label for="pmade">材质:</label>
					<select name="pmade" @change="getProductsList(1)" v-model="searchData.pmade" id="pmade">
						<option value="">全部</option>
						<option :value="item" v-for="item in pmade | orderBy chnSort">{{item}}</option>
					</select>
				</div>
				<!-- 价格 -->
				<div class="input_group">
					<label for="price">价格:</label>
					<select name="price" @change="getProductsList(1)" v-model="searchData.price" id="price">
						<option value="">全部</option>
						<option value="0-499">0-499</option>
						<option value="500-1999">500-1999</option>
						<option value="2000-4999">2000-4999</option>
						<option value="5000-9999">5000-9999</option>
						<option value="10000-19999">10000-19999</option>
						<option value="20000以上">20000以上</option>
					</select>
					自定义价格段
					<input type="number" min="0" @change="customPrice" v-model="minPrice">—
					<input type="number" :min="minPrice" @change="customPrice" v-model="maxPrice">
				</div>
				<!-- 品牌 -->
				<div class="input_group">
					<label for="brand">品牌:</label>
					<select name="brand" @change="getProductsList(1)" v-model="searchData.brand" id="brand">
						<option value="">全部</option>
						<option :value="item" v-for="item in brands">{{item}}</option>
					</select>
				</div>
				
				<!-- 关键字 -->
				<div class="input_group">
					<label for="">关键字:</label>
					<input type="text"  v-model="searchData.keyword" class="keyword">
					<button class="c_search_btn" @click="getProductsList(1)">搜索</button>
				</div>
			</div>
			<div class="table_title">
				<span>编号</span>
				<span>产品图</span>
				<span>名称</span>
				<span>品牌</span>
				<span>价格</span>
				<span>
					选择
					<!-- <input type="checkbox" id="allSelect" checked>
					<label for="allSelect">全选</label> -->
				</span>
			</div>
			<div class="table_box" @scroll="scroll">
				<table class="good_list_table" border="1">
					<tr v-for="item in productsList" :class="{'selected':item.flag==1}">
						<td>{{item.productnum}}</td>
						<td>
							<img :src="item.imgpath+'@360w_360h_.png'" alt="">
						</td>
						<td>{{item.productname}}</td>
						<td>{{item.brand}}</td>
						<td>￥ {{item.mallsaleprice}}</td>
						<td>
							<input v-show="selectAll || isPre" disabled type="checkbox" checked>
							<input v-else type="checkbox" v-model="productsFiles || item.flag==1" :value="item">
						</td>
					</tr>
					<!-- <h2 v-if="productsList.length < 1">没有符合条件的商品</h2> -->
				</table>
			</div>

			
			<div class="bottom">
				<p>=====符合条件的商品共<span>{{productsSum}}</span>个=====
					<input type="checkbox" checked v-model="selectAll" name="selectAll" id="selectAll">
					<label v-show="!isPre" for="selectAll">选择当前条件下的所有商品</label>
				</p>
				<button v-show="!isPre" class="save_btn" @click="saveSelectedProducts">确认</button>
				<button v-show="!isPre" class="cancel_btn" @click="toggleShow">取消</button>
			</div>
		</div>	
		<!-- <div class="edit_box" v-show="showEditName">
			<h2>编辑产品集标题</h2>
			<input type="text" v-model="materialTitle">
			<div class="bottom">
				<button class="save_btn" @click="saveSelectedProducts">确定</button>
				<button class="cancel_btn" @click="hideEditName">取消</button>
			</div>
		</div> -->

		<model></model>
	</div>
</template>

<script>
	import model from './model.vue'
	export default{
		props:['ad-template','ad-id'],
		data(){
			return {
				selectShow:false,
				isPre:false,
				preIds:"",
				preCondition:"",
				prePageNumber:1,
				// preTotalRecords:20,
				prePageSize:20,

				isGetting:false, //判断请求是否已经完成
				showEditName:false, //显示编辑素材集标题

				//产品条件筛选
				materialTitle:"",
				selectAll:true, //全选当前条件下的所有商品
				brands:[],
				pmade:[],
				aspace:[],
				styles:[],
				types:[],
				keyword:"",
				minPrice:"",
				maxPrice:"",
				productsList:[],
				productsSum:20,
				searchData:{
					pageNumber:1,
					pageSize:20,
					price:"",
					pstyle:"",
					ptype:"",
					aspace:"",
					pmade:"",
					brand:"",
					keyword:""
				},
				//存储已选择的商品条件或ids
				productsFiles:[],
			}
		},
		ready:function(){
			var self = this;
			self.$broadcast("keepMsg","数据加载中...");
			//获取分类信息
			self.$http.get("/dictionary").then(
				function(response){
					self.brands = response.data.data.brands;
					self.pmade = response.data.data.pmade;
					self.aspace = response.data.data.spaces;
					self.styles = response.data.data.styles;
					self.types = response.data.data.types;

					self.$broadcast("hideMsg");

				}
			)
		},
		methods:{
			//中文字符排序
			chnSort:function(a,b){
				return a.localeCompare(b);
			},
			clearSearch:function(){
				this.prePageNumber=1;
				this.searchData.pageNumber=1;
				this.searchData.pageSize=20;
				this.searchData.price="";
				this.searchData.pstyle="";
				this.searchData.ptype="";
				this.searchData.aspace="";
				this.searchData.pmade="";
				this.searchData.brand="";
				this.searchData.keyword="";
			},
			//自定义价格获取
			customPrice:function(){
				var self = this;
				self.searchData.price = self.minPrice +"-"+self.maxPrice;
			},
			toggleShow:function(){
				this.selectShow = this.selectShow ? false : true;
				this.clearSearch();
				this.selectAll = true;
			},
			scroll:function(e){
				var self = this;
				var list = e.target.childNodes[1].childNodes[1].childNodes;
				var target = list[list.length-5];
				var dis = target.getBoundingClientRect().top;
				if(720>dis){
					if(self.isPre){
						self.getPreProducts();
					}else{
						self.getProductsList();
					}
				}
			},
			editName:function(){
				this.showEditName = true;
			},
			hideEditName:function(){
				this.showEditName = false;
				this.selectAll = true;
			},
			//保存已选商品
			saveSelectedProducts:function(){
				var self = this,
						conditionStr = "",
						condition = {},
						formData = new FormData();
				formData.append('adTemplate',self.adTemplate);
				formData.append('position',self.m_position.good);
				// formData.append('materialTitle',self.materialTitle);
				if(self.selectAll){
					condition = {
											"price":self.searchData.price,
											 "pstyle":self.searchData.pstyle,
											 "ptype":self.searchData.ptype,
											 "aspace":self.searchData.aspace,
											 "pmade":self.searchData.pmade,
											 "brand":self.searchData.brand,
											 "keyword":self.searchData.keyword
											}
					formData.append('materialType',4);
					formData.append('condition.price',self.searchData.price);
					formData.append('condition.pstyle',self.searchData.pstyle);
					formData.append('condition.ptype',self.searchData.ptype);
					formData.append('condition.aspace',self.searchData.aspace);
					formData.append('condition.pmade',self.searchData.pmade);
					formData.append('condition.brand',self.searchData.brand);
					formData.append('condition.keyword',self.searchData.keyword);

					// formData.append('condition',condition);

					// formData.append('condition',conditionStr)
					/*self.$http.post('/product_material',formData).then(
						function(response){
							console.log(response)
							self.$broadcast('tipsMsg',response.data.msg)
							var data = response.data.data
							self.$dispatch('saveProducts',data);
						}
					)*/
				}else{
					conditionStr += self.productsFiles.map(function(value){return value.productid});

					formData.append('materialType',1);
					formData.append('addProducts',conditionStr);

					/*self.$http.post('/product_material',formData).then(
						function(response){
							self.$broadcast('tipsMsg',response.data.msg)
							// self.productsSelected.push(response.data.data.materialId)
							var data = {
								condition:condition,
								ids:response.data.data.materialId,
								materialTitle:self.materialTitle,
							}
							self.$dispatch('saveProducts',data);
						}
					)*/
				}

				self.$dispatch('saveProducts',formData);
				self.productsFiles=[];
				self.toggleShow();
				this.showEditName = false;
				return self.productsSelected;
			},
			getProductsList:function(change){
				var self = this,
						url = '/products/'+self.adId;
				if(1==change){
					self.productsList = [];
					self.getting = false;
					self.searchData.pageNumber = 1;
				}/*else if(2 == change){
					url = "/machine_ad_product/"+self.adId;
				}*/
				if(self.getting){
					//上一次请求未完成，不允许发起请求
					return;
				}else{
					self.getting=true;
				}

				if((self.searchData.pageNumber-1)*self.searchData.pageSize >= self.productsSum && self.searchData.pageNumber!=1){
					//已获取条件下所有商品，不再请求
					return;
					self.$broadcast("keepMsg","没有更多的商品了");
				}
				self.$broadcast("keepMsg","数据加载中...");
				
				self.$http.get(url,self.searchData).then(
					function(response){
						self.getting = false;
						console.log(response)
						if(200!=response.data.code){
							return;
							self.modelTips(response.data.msg);
						}
						if(0==response.data.data.list.length){
							self.$broadcast("tipsMsg","没有符合条件的商品");
							self.productsSum=0;
							return;
						}
						self.productsList = self.productsList.concat(response.data.data.list);

						if(self.productsList.length<response.data.data.pageSize){
							self.productsSum = self.productsList.length;
						}else{
							self.productsSum = response.data.data.totalRecords;
						}
						self.$broadcast("hideMsg");
						self.searchData.pageNumber++;
					}
				)
			},
			getPreProducts:function(){
				var self = this;
				if(self.isGetting){
					return;
				}else{
					self.isGetting = true;
				}
				if(self.productsSum<self.prePageSize*(self.prePageNumber-1) && self.prePageNumber>1){
					self.$broadcast('tipsMsg','没有更多的商品了.');
					self.isGetting = false;
					return;
				}
				self.$http.get('/product_material/'+self.preIds,
						{pageNumber:self.prePageNumber,pageSize:self.prePageSize}
					).then(
					function(response){
						console.log(response)
						if(200==response.data.code){
							self.productsList = self.productsList.concat(response.data.data.list);
							self.productsSum = response.data.data.totalRecords;
							self.prePageNumber++;
							self.isGetting = false;
						}else{
							self.$broadcast('tipsMsg',response.data.msg)
							self.isGetting = false;
						}
						
					}
				)
			}
		},
		events:{
			
			'toggleSelectBox':function(){
				this.isPre= false;
				this.selectShow = this.selectShow ? false : true;
				this.getProductsList();
			},
			'preGood':function(item){
				var self = this;
				self.clearSearch();
				self.productsList=[];
				
				self.isPre= true;

				self.preCondition = item.condition ? item.condition : item.materialId;
				self.preIds = item.ids ? item.ids : item.materialId;
				self.selectShow = this.selectShow ? false : true;
				self.getPreProducts();
			}
		},
		computed:{
			//素材位置
			'm_position':function(){
				var data = {},
						self = this;
				if(1==self.adTemplate){
					data.good = 1;
					data.video = 2;
					data.poster = 3;
				}else if(2==self.adTemplate){
					data.good = 2;
					data.video = 1;
					data.poster = 3;
				}else if(3==self.adTemplate){
					data.good = 3;
					data.video = 2;
					data.poster = 1;
				}

				return data;
			},
		},
		components:{
			model,
		}
	}
</script>

<style lang="sass">
	@import '../../style/lib.scss';
	.good_select_box{
			position:fixed;
			top:0;
			left:0;
			width:100%;
			height:100%;
			z-index:100;
			.selectBox{
				width:600px;
				min-height:450px;
				position:absolute;
				padding-bottom:20px;
				top:50%;
				left:50%;
				z-index:100;
				margin-top:-340px;
				margin-left:-300px;
				background-color:#fff;
				border-radius:5px;

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
				    padding-left:8px;
				    line-height:15px;
				    border-radius: 50%;
				    margin: 5px;
				    background-color: #777;
					}
				}

				.select_form{
					padding:15px;
					.input_group{
						display:inline-block;
						min-width:250px;
						padding:5px;
						select{
							width:200px;
							height:26px;
						}

						input{
							width:90px;
							height:26px;
						}
						.keyword{
							width:120px;
						}
						.c_search_btn{
							@extend .btn;
							width:80px;
							height:26px;
							line-height:26px;
							vertical-align:top;
							background-color:$lightBlue;
							color:#fff;
							border:1px solid #aaa;
							border-radius:3px;
							padding-left:0px;
							box-sizing:border-box;
						}
					}
				}

				.table_title{
					width:95%;
					margin:0px auto;
					border:1px solid #ccc;
					background-color:$lightGray;
					height:30px;
					line-height:30px;
					box-sizing:border-box;

					span{
						display:inline-block;
						width:17%;
						text-align:center;
					}
					span:nth-of-type(6){
						width:10%;
					}
				}
				.table_box{
					height:350px;
					width:95%;
					margin:0px auto;
					overflow:auto;
					box-shadow: 0px 1px 2px 1px #ccc;
					.good_list_table{
						width:100%;
						margin:0px auto;
						position:relative;
						height:350px;
						overflow:auto;
						padding-top:30px;
						border:1px solid #ccc;
					
						.selected{
							background-color:#f5f5f5;
							position:relative;
							/* &:before{
								content:"";
								position:absolute;
								background:url(#{$client_images}/white_gou.png) 0px 0px no-repeat;
								width:16px;
								height:16px;
								background-color:red;
								left:10px;
								bottom:10px;
								@include transform(rotate(30deg));
							} */
						}
						tr{
							td{
								width:16%;
								text-align:center;
								padding:5px;
								box-sizing:border-box;
						    word-break: break-all;
								img{
									width:60%;
								}
							}
							td:nth-of-type(6){
								width:10%;
							}
						}
					}
				}

				.bottom{
					text-align:center;
					p{
						color:#333;
						text-align:center;
						line-height:36px;
						font-size:16px;
						span{
							color:red;
						}
					}
					button{
						@extend .btn;
						width:100px;
						height:30px;
					}
					.save_btn{
						background-color:$lightBlue
					}
					.cancel_btn{
						background-color:$deepGray;
					}
				}
				
			}
			.edit_box{
				position:fixed;
				z-index:1000;
				background-color:#fff;
				border-radius:5px;
				width:250px;
				height:100px;
				top:50%;
				left:50%;
				margin-left:-125px;
				margin-top:-50px;
		    box-shadow: 0px 0px 20px 10px #ccc;
		    padding:10px;
		    box-sizing:content-box;

				h2{
					font-size:16px;
					color:#333;
					text-align:center;
				}
				input{
					width:80%;
					height:30px;
					display:block;
					padding-left:5px;
					margin:10px auto;
				}
				.bottom{
					text-align:center;
					button{
						@extend .btn;
						width:80px;
						height:26px;
					}
					.save_btn{
						background-color:$lightBlue;
					}
					.cancel_btn{
						background-color:$deepGray;
					}
				}
			}
		}
</style>