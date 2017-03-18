<template>
<!-- 广告设置comp -->
	<div class="m_right_content adv_setting_box">
		<div class="top_bar">
			<h2 class="title">以下是该机器的【屏保设置】</h2>
			<!-- <button class="connect_btn">关联广告</button> -->
		</div>

		<div class="content_box">
			<div class="info_box">
				<!-- <input type="hidden" :value=""> -->
				<!-- <p><label for="">屏保标题:&nbsp;</label>&nbsp;<input type="text" v-model="adTitle"></p><br> -->
				<!-- <p><label for="">展示时间:&nbsp;</label>2016年5月1日  ——  2016年5月7日</p><br> -->
				
				<p><label for="">滚屏公告:&nbsp;</label>
				<input class="scroll_notice" v-model="scrollNotice" type="text" placeholder="请输入滚屏公告。"></p>
				<p><label for="">显示公告:&nbsp;</label><input type="checkbox" v-model="showNotice" :checked="showNotice"></p><br>
				<p><label for="">屏保模板:&nbsp;</label>
					<select name="adTemplate" @change="adTemplateChange" id="adTemplate" v-model="adTemplate">
						<option value="1">产品为主模板</option>
						<option value="2">视频为主模板</option>
						<option value="3">海报为主模板</option>
						<option value="4">天气公告模板</option>
					</select>
					<a href="/adv_template_poster.psd">850x505px PSD海报模板下载</a>
					<a href="/adv_template_other.psd">720x325px PSD海报模板下载</a>
				</p>
				<!-- <p><label>投放状态:&nbsp;</label>显示</p>
				<p><label>投放范围:&nbsp;</label>通用/不通用</p>
				<p><label>通用模式:&nbsp;</label>立式</p> -->
				<button class="save_btn" @click="saveAdv">保存设置</button>
			</div>
			
			<!-- 广告模板为1,2,3时 -->
			<div class="adv_preview" v-if="4!=adTemplate">
				<img src="/images/client_background/shenqi_bg.png" class="bg_img" alt="">

				<div class="tigan">
					<img src="/images/client_background/shenqi_tigan.png" alt="">
				</div>
				<div class="camera">
					<img src="/images/client_background/shenqi_camera.png" alt="">
				</div>

				<!-- 产品图 -->
				<div :class="preClass.good">
					<div class="top_bar">
						<input class="search_product" type="text" @keyup.enter="getProduct(1)" placeholder="输入产品关键字" v-model="productSearchText">
						<button @click="getProduct(1)" class="search_btn"></button>
						<tooltip 
							content="删除全部产品" 
							trigger="hover" 
							effect="fadein"
							placement="right">
							<button class="del_btn" @click="delAllProduct"></button>
						</tooltip>
						<button class="edit_btn" @click="showSelectBox">添加展示内容</button>
					</div>
					<img class="productsSelectedBgImg" src="/images/client_background/shenqi_product.png" alt="">
					<!-- 素材集合显示列表 -->
					<div class="files_list" @scroll="scroll" v-if="productsSelected.length>0">
						<!-- <tooltip 
							:content="item.materialTitle" 
							trigger="hover" 
							placement="bottom" 
							v-for="item in productsSelected">
							<div class="file_item" :data-id="item.materialId" >
								<img @click="preMaterialsFile(item)" src="/images/client_background/file_icon.png" :title="item.materialTitle" alt="">
								<button class="del_btn" @click="delMaterialsFile($index,item)">X</button>
								<button class="pre_btn" @click="preMaterialsFile(item)">P</button>
							</div>
						</tooltip> -->
						<div class="product_item" v-if="item.productid" v-for="item in productsSelected">
							<button class="del_one_btn" @click="removeProduct($index,item)">X</button>

							<img @click="showProductDetail(item)" class="product_img_s" :src="item.imgpath+'@360w_360h_.png'" alt="">
							<p>{{item.productnum}}</p>
							<!-- <p>{{item.productname}}</p> -->
							<!-- <p>￥{{item.mallsaleprice}}</p> -->
						</div>
					</div>
					<div v-else class="emptyNotice">
						<h2>显示商城所有商品。</h2>
					</div>
				</div>
				<!-- 海报 -->
				<div :class="preClass.poster">
					<div class="top_bar">
						<button class="edit_btn" @click="showEditBox('poster')">更换展示内容</button>
					</div>
					<carousel indicators="false" v-if="enableCarousel">
						<slider v-for="item in prePoster">
							<img :src="item+'@360w_360h_.png'" alt="">
						</slider>
					</carousel>
				</div>
				<!-- 视频 -->
				<div :class="preClass.video">
					<div class="top_bar">
						<button class="edit_btn" @click="showEditBox('video')">更换展示内容</button>
					</div>
					<video :src="preVideo.body" @ended="changeVideo" controls></video>
				</div>
			</div>

			<!-- 广告模板为4时，即为天气公告模板时 -->
			<div class="adv_preview" v-if="4==adTemplate">
				<img src="/images/client_background/shenqi_bg.png" class="bg_img" alt="">

				<div class="tigan">
					<img src="/images/client_background/shenqi_tigan.png" alt="">
				</div>
				<div class="camera">
					<img src="/images/client_background/shenqi_camera.png" alt="">
				</div>

				<div class="rt_box">
					<img src="/images/client_background/shenqi_clock.png" alt="">
				</div>
				<div class="rb_box">
					<img src="/images/client_background/shenqi_weather.png" alt="">
				</div>

				<!-- 海报 -->
				<div class="lb_box">
					<div class="top_bar">
						<button class="edit_btn" @click="showEditBox('poster')">更换展示内容</button>
					</div>
						<carousel indicators="false" v-if="enableCarousel">
							<slider v-for="item in prePoster">
								<img :src="item" alt="">
							</slider>
						</carousel>
				</div>
			</div>
			
			<!-- <div class="opera_bottom">
				<button class="save_btn" @click="saveAdv">保存设置</button>
				<button class="cancel_btn">取消</button>
			</div> -->
		</div>

		<!-- 更换素材编辑框，包括视频和海报，可选已上传的素材或者新增素材 -->
		<div class="material_edit_box" v-show="editShow" transition="bounce">
			<div class="cover" @click="hideEditBox"></div>
			<div class="edit_box">
				<div class="top_bar">
					素材选择
					<button class="close_btn btn" @click="hideEditBox">X</button>
				</div>
				<div class="edit_content">
					<div class="material_item" v-for="item in materialList">
						<button class="del_one_btn" @click="delMaterial(item)">X</button>
						<img v-if='uploadType=="poster"' :src="item.materialBody">
						<video v-else :src="item.materialBody" controls="controls"></video>

						<input type="checkbox" v-if="uploadType=='poster'" name="select_poster" :value="item" v-model="item.selected">
						<input type="checkbox" v-else name="select_poster" :value="item" v-model="item.selected" :checked="item.selected">
						<label for=""></label>
					</div>
				</div>
				<div class="bottom">
					<input type="file" v-if="uploadType=='poster'" id="uploadFile" @change="uploadFile" multiple>
					<input type="file" v-else id="uploadFile" @change="uploadFile">
					<label for="uploadFile" class="upload_btn">上传素材</label>
					<button class="save_btn" @click="saveSelected">确定</button>
					<button class="cancel_btn" @click="hideEditBox">取消</button>
				</div>

				<p v-if="'video'==uploadType" class="notice_tips">上传视频最大为600Mb，建议分辨率不低于560p。</p>
				<p v-if="'poster'==uploadType" class="notice_tips">上传海报尺寸建议为{{posterCurrectSize.width}}px*{{posterCurrectSize.height}}px，最多一次上传6个。</p>
			</div>
		</div>

		<scroll-good :ad-template="adTemplate" :ad-id="adId" keep-alive></scroll-good>
		<model></model>
		<detail></detail>
	</div>
</template>

<script>
	import model from '../model.vue'
	import scrollGood from '../scrollGood.vue'
	import detail from '../productPopup.vue'
	import carousel from '../vue-strap/Carousel.vue'
	import slider from '../vue-strap/Slider.vue'
	import tooltip from '../vue-strap/Tooltip.vue'
	// import sidebar from '../vue-strap/Aside.vue'
	
	export default{
		data(){
			return{
				uploadType:"",
				editShow:false,
				selectShow:false,
				materialList:[],
				adTitle:"",
				adId:"",
				scrollNotice:"", //滚屏公告
				showNotice:false,
				adTemplate:1, //1为产品图为主，2为视频为主，3为海报为主，4为公告模板
				getting:false,  //判断获取商品请求是否已成功
				uploading:false,  //检测是否正在上传文件

				//上传文件到七牛用
				uploadToken:"",
				host:"",

				//广告预览素材
				preVideo:{
					number:0,
					body:""
				},
				prePoster:['http://www.edsmall.cn/Source/images/f_side2.jpg'],
				preGood:[],

				
				isPreGood:false,
				preId:"",

				//保存不同类已选素材ids
				posterSelected:[],
				videoSelected:[],
				productsSelected:[],
				productPageNumber:1,
				productPageSize:20,
				productSearchText:"",
				gettingProduct:false,
				
				tempVideoSeleced:[],
				enableCarousel: false
			}
		},
		route:{
			deactivate:function(transition){
				if(this.uploading){
					// var leave=confirm("离开页面将中断此次视频上传...")
					if(!leave){
						transition.abort()
					}else{
						transition.next()
					}
				}else{
					transition.next()
				}
			}
		},
		ready:function(){
			var self = this;
			self.$http.get("/uploadtoken").then(
				function(response){
					self.uploadToken = response.data.data.uploadToken;
					self.host = response.data.data.host;
				}
			);

			
			self.$http.get("/machine_ad/"+self.$route.query.machineId).then(
					function(response){
						console.log(response)
						if(!response.data.data) return;

						var adData = response.data.data.ad,
								adMaterial = response.data.data.materials;
						self.adTitle = adData.adTitle;
						self.adId = adData.adId;
						self.scrollNotice = adData.notice==null?"":adData.notice;
						self.showNotice = adData.showNotice==1?true:false;
						self.adTemplate = adData.adTemplate;

						adMaterial.forEach(
							(value)=>{
									if(2==value.materialType){
										self.videoSelected.push(value)
									}else if(3==value.materialType){
										self.posterSelected.push(value)
									}else{
										//产品条件集合和产品id集合都存放在已选产品内
										self.productsSelected.push(value)
									}
								}
							)
						console.log(self.videoSelected)
						if(self.adTemplate!==4 && self.videoSelected.length > 0){
							self.preVideo.body = self.videoSelected[0].materialBody;
						}
						self.preVideo.number =0;


						self.prePoster = self.posterSelected.map(function(value){
							return value.materialBody
						})

						self.enableCarousel = false;
						self.$nextTick(() => {
							self.enableCarousel = true;
						});

						//获取到广告id后再获取已选择商品
						self.getProduct();
					}
				)

		},
		methods:{
			getAdv:function(){
				var self = this;
				//每次获取广告信息，先把这几个用于存储的变量清空
				self.posterSelected.length=0;
				self.videoSelected=[];
				self.productsSelected.length=0;

				self.$http.get("/machine_ad/"+self.$route.query.machineId+"/"+self.adTemplate).then(
					function(response){
						console.log(response)
						if(!response.data.data) return;

						var adData = response.data.data.ad,
								adMaterial = response.data.data.materials;
						self.adTitle = adData.adTitle;
						self.adId = adData.adId;
						self.scrollNotice = adData.notice==null?"":adData.notice;
						self.showNotice = adData.showNotice==1?true:false;
						self.adTemplate = adData.adTemplate;

						adMaterial.forEach(
							(value)=>{
									if(2==value.materialType){
										self.videoSelected.push(value)
									}else if(3==value.materialType){
										self.posterSelected.push(value)
									}else{
										//产品条件集合和产品id集合都存放在已选产品内
										self.productsSelected.push(value)
									}
								}
							)
						if(self.adTemplate!==4){
							self.preVideo.body = self.videoSelected[0].materialBody;
						}
						self.preVideo.number =0;


						self.prePoster = self.posterSelected.map(function(value){
							return value.materialBody
						})

						self.enableCarousel = false;
						self.$nextTick(() => {
							self.enableCarousel = true;
						});

						//获取到广告id后再获取已选择商品
						if(4!==self.adTemplate){
							self.getProduct();
						}
					}
				)
			},
			getProduct:function(type){
				var self = this,
						rqData = "";

				//当type为1时为搜索关键字产品，清空已加载的已选商品
				if(1==type){
					self.productPageNumber = 1;
					self.productsSelected = [];
				}

				rqData = "?pageNumber="+self.productPageNumber+
								 "&pageSize="+self.productPageSize+
								 "&keyword="+self.productSearchText;
				if(self.gettingProduct){
					return
				}else{
					self.gettingProduct = true;
				}

				

				self.$broadcast('keepMsg','正在加载已选商品...')
				//获取已选择商品
				/*if(0==self.adId.length){
					self.$broadcast('hideMsg');
					self.gettingProduct = false;
					return;
				}*/
				self.$http.get('/machine_ad_product/'+self.$route.query.machineId+"/"+self.adTemplate+rqData).then(
					function(response){
						console.log(response)
						if(200==response.data.code){
							self.productsSelected = self.productsSelected.concat(response.data.data.list);
							if(0==response.data.data.list.length){
								self.$broadcast('tipsMsg','没有更多的商品了')
							}else{
								self.productPageNumber++;
								self.$broadcast('hideMsg');
							}
							
						}else{
							self.$broadcast('hideMsg');
							self.$broadcast('tipsMsg',response.data.msg)
						}
						
						
						self.gettingProduct = false;
					}
				)
			},
			showEditBox:function(type){
				var self = this;
				self.editShow = true;
				self.uploadType = type;
				self.materialList=[];


				/*self.posterSelected =[];
				self.videoSelected ="";*/

				self.getMaterial();
			},
			hideEditBox:function(){
				this.editShow = false;
			},
			showSelectBox:function(){
				var self = this;
				self.$broadcast('toggleSelectBox');
			},
			hideSelectBox:function(){
				self.$broadcast('toggleSelectBox');
			},
			
			getMaterial:function(){
				var self = this,
						// formData = new FormData(),
						type="";
				if(self.uploadType == 'poster'){
					type = 3;
				}else{
					type = 2;
				}
				var data = {
					'adTemplate':self.adTemplate,
					'materialType':type,
					'position':self.m_position[self.uploadType]
				}
		    /*formData.append('adTemplate',self.adTemplate)
		    formData.append('materialType',type)
		    formData.append('position',self.m_position[self.uploadType])*/

				self.$http.get('/materials',data).then(
					function(response){
						console.log(response)
						response.data.data.forEach(material => {
							material.selected = self.checkIfMaterialIsSelected(material);
						});
						self.materialList = response.data.data;
					}
				)
			},
			/*checkDileSize:function(e){
				var file = e.target.files || e.target.files[0],
						fileUpload = [],
						reader = new FileReader(),
						image = new Image(),
						self = this;

				
				//判断上传的海报尺寸是否符合要求
				reader.onload = function(){
					image.src = reader.result;
				}
				image.onload = function(){
					if(image.width !== self.posterCurrectSize.width || image.height !== self.posterCurrectSize.width){
						var check = confirm(`文件${file.name}的尺寸不符合要求，继续上传？`)
						if(check){
							fileUpload.push(image)
						}
					}
				}
				console.log(file)
				for(var i = 0;i<file.length;i++){
					reader.readAsDataURL(file[i])
				}

				console.log(fileUpload)
			},*/
			uploadFile:function(e){
				var file = e.target.files || e.target.files[0],
						self = this,
						name = file.name || file[0].name,
						formData = new FormData(),
						progress={
							onloadstart:function(){
								self.$broadcast("keepMsg","文件上传中")
							},
							onprogress:function(response){
								var per = response.loaded / response.total;
								var perMsg = (Math.round(per*10000)/100).toFixed(2)+'%';
								if(1!=per){
									self.$broadcast("keepMsg","文件上传中..."+perMsg)
								}else{
									self.$broadcast("tipsMsg","文件上传成功")
								}
							},
							onloadend:function(){
								return false;
							}
						};
				//判断上传文件是否符合要求
				if('video'==self.uploadType && file[0].size/1024/1024 >= 600){
					self.$broadcast("tipsMsg",'上传视频文件大小超过600Mb。')
					return;
				}else if('poster'==self.uploadType && file.length > 6){
					self.$broadcast('tipsMsg','上传海报数量超过6张。')
					return;
				}
				self.uploading = true;
				if('poster'==self.uploadType){
					//上传海报的
					
					for(var i = 0;i<file.length;i++){
						formData.append('file',file[i])
					}

					formData.append('adTemplate',self.adTemplate);
					formData.append('materialType',3)

					formData.append('position',self.m_position.poster);
					
					self.$http.post('/materials',formData,{upload:progress}).then(
						function(response){
							if(200==response.data.code){
								self.uploading = false;
								self.getMaterial();
							}else{
								self.$broadcast('tipsMsg',response.data.msg)
							}
						}
					)
				}else{
					//上传视频到七牛
					if(0>file[0].type.indexOf('video')){
						self.$broadcast('tipsMsg','上传文件不符合要求。')
						return;
					}
					formData.append('file',file[0]);
					formData.append('token',self.uploadToken);
					
					
					self.$http.post("http://upload.qiniu.com",formData,{upload:progress}).then(
						function(response){

							var fileData = new FormData();
							fileData.append('materialType',2);
							fileData.append('adTemplate',self.adTemplate);
						
							fileData.append('position',self.m_position.video);
							
							fileData.append('materialTitle',name);
							fileData.append('materialBody',self.host+response.data.key);

							self.$http.post("/materials",fileData).then(
								function(response){
									if(200==response.data.code){
										self.uploading = false;
										self.getMaterial();
									}
								}
							)
						}
					)
				}
			},
			//保存已选海报或视频
			saveSelected:function(){
				var self = this,
						ids = "",
						formData = new FormData();
				
				if(self.uploadType === 'poster'){
					self.posterSelected = self.materialList.filter(material => {
						if(material.selected){
							delete material.selected;
							return true;
						}
						return false;
					});

					self.enableCarousel = false;
					self.$nextTick(() => {
						self.enableCarousel = true;
					});
				}else if(self.uploadType === 'video'){
					// self.videoSelected = self.tempVideoSeleced;
					self.videoSelected = self.materialList.filter(material => {
						if(material.selected){
							delete material.selected;
							return true;
						}
						return false;
					});
				}

				//拼接上传素材字符串
				if('poster'==self.uploadType){
					ids += self.posterSelected.map((value)=>{
						return value.materialId
					})
				}else{
					ids += self.videoSelected.map((value)=>{
						return value.materialId
					})
				}

				console.log(ids)

				var type = self.uploadType=='poster'?3:2;
				console.log(type)

				formData.append('materialType',type)
				formData.append('materialIds',ids)

				self.$http.post('/machine_ad_material/'+self.adId,formData).then(
					function(response){
						console.log(response)
						if(200==response.data.code){
							self.$broadcast('tipsMsg',response.data.msg)

							if(2==type){
								self.preVideo.body = self.videoSelected[0].materialBody;
								self.preVideo.number = 0;
							}else if(3==type){
								self.prePoster = self.posterSelected.map((value)=>{
									return value.materialBody
								})
								self.enableCarousel = false;
								self.$nextTick(() => {
									self.enableCarousel = true;
								});
							}

						}else{
							self.$broadcast('tipsMsg',response.data.msg)
							console.log(response)
						}
					}
				)

				self.hideEditBox();
			},
			//保存广告设置
			saveAdv:function(){
				var self = this,
						formData = new FormData();

				formData.append('showNotice',self.showNotice?1:0);
				formData.append('notice',self.scrollNotice)
				formData.append('adTemplate',self.adTemplate)

				console.log(self.adTemplate)

				self.$http.post("/machine_ad/"+self.adId,formData).then(
					function(response){
						if(200==response.data.code){
							self.$broadcast('tipsMsg',response.data.msg)
						}else{
							self.$broadcast('tipsMsg',response.data.msg)
							console.log(response)
						}
					}
				)
			},
			//预览素材集
			preMaterialsFile:function(item){
				this.$broadcast('preGood',item)
			},
			//删除单个已上传素材
			delMaterial:function(item){
				var self = this;
				var check = confirm(`确定要删除已上传素材${item.materialTitle}?`)
				if(check){
					self.$http.delete('/material/'+item.materialId).then(
						(response)=>{
							self.$broadcast('tipsMsg',response.data.msg);
							self.getMaterial();
						}
					)
				}else{
					return
				}
			},
			//删除素材集
			delMaterialsFile:function(index,item){
				var self = this;
				var id = item.materialId ? item.materialId : item.ids;
			  self.$http.delete('/product_material/'+id).then(
			  	function(response){
			  		if(200==response.data.code){
			  			self.productsSelected.splice(index,1);
			  			self.$broadcast('tipsMsg',response.data.msg);
			  		}
			  	}
			  )
			},
			checkIfMaterialIsSelected:function(material){
				var selected = false;
				if(this.uploadType === 'poster'){
					selected = this.posterSelected.filter(p => { return p.materialId === material.materialId; }).length > 0;
				}else if(this.uploadType === 'video'){
					// selected = (this.videoSelected.materialId === material.materialId);
					selected = this.videoSelected.filter(v => {return v.materialId === material.materialId;}).length>0;
				}
				return selected;
			},
			changeVideo:function(){
				var self = this;
				self.preVideo.number++;
				console.log(self.videoSelected.length)
				if(self.preVideo.number >= self.videoSelected.length){self.preVideo.number = 0 };
				self.preVideo.body = self.videoSelected[self.preVideo.number].materialBody;
			},
			scroll:function(e){
				var self = this;
				var list = e.target.childNodes;
				var target = list[list.length-5];
				var dis = target.getBoundingClientRect().top;
				if(dis<=700){
					self.getProduct();
				}
			},
			//移除单个已选产品
			removeProduct:function(index,item){
				var self = this;
				console.log(item)
				self.$http.post('/remove_product/'+item.materialId,{productId:item.productid}).then(
					function(response){
						if(200==response.data.code){
							self.$broadcast('tipsMsg','删除成功');
							self.productsSelected.splice(index,1);
							self.$broadcast('hideDetail',item.productid)
						}
					}
				)
			},
			//移除所有已选产品
			delAllProduct:function(){
				if(0==this.productsSelected.length){
					this.$broadcast('tipsMsg','您还没选择任何要展示的商品。')
					return;
				}
				var check = confirm('确定删除所有已选商品？');
				if(check){
					this.$http.delete('/machine_ad_product/'+this.adId).then(
						function(response){
							if(200==response.data.code){
								this.$broadcast('tipsMsg','删除成功');
								this.productsSelected = [];
							}
						}
					)
				}
			},
			//查看商品详情
			showProductDetail:function(item){
				this.$broadcast('showDetail',item)
			},
			//更换屏保模板
			adTemplateChange:function(){
				var self = this;
				self.productPageNumber = 1;
				self.productSearchText ="";
				self.getAdv(1);
			}
		},
		computed:{
			'preClass':function(){
				var self = this,
						classArr = {};
				if(1==self.adTemplate){
					classArr.video = "rt_box";
					classArr.good = "lb_box";
					classArr.poster = "rb_box";
				}else if(2==self.adTemplate){
					classArr.video = "lb_box";
					classArr.good = "rt_box";
					classArr.poster = "rb_box";
				}else if(3==self.adTemplate){
					classArr.video = "rt_box";
					classArr.good = "rb_box";
					classArr.poster = "lb_box";
				}

				return classArr;
			},
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
				}else if(4==self.adTemplate){
					data.poster = 1;
				}

				return data;
			},
			//当前模板下海报的尺寸检测
			'posterCurrectSize':function(){
				var size = {};
				if(3 == this.adTemplate || 4 == this.adTemplate){
					size.width = 850;
					size.height = 505;
				}else if(1==this.adTemplate || 2 == this.adTemplate){
					size.width = 720;
					size.height = 325;
				}

				return size;
			}
		},
		events:{
			'saveProducts':function(data){
				var self = this,
						formData = new FormData()
				/*self.productsSelected.push(item.map((value)=>{
					return value
				}));
				console.log(self.productsSelected)*/
				// formData.append('materialType',1)
				// formData.append('materialIds',productId)

				self.$http.post('/machine_ad_product/'+self.adId,data).then(
					function(response){
						console.log(response)
						if(200==response.data.code){
							self.$broadcast('tipsMsg',response.data.msg)
							self.productPageNumber = 1;
							self.getProduct();
						}else{
							self.$broadcast('tipsMsg',response.data.msg)
							console.log(response)
						}
					}
				)
				// self.productPageNumber = 1;
			}
		},
		components:{
			model,
			scrollGood,
			carousel,
			slider,
			tooltip,
			detail,
			// sidebar,
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';
	//adv setting box
	.adv_setting_box{
		.content_box{
			.info_box{
				padding:15px;
				border-bottom:1px solid $borderGray;
				position:relative;
				p{
					display:inline-block;
					min-width: 200px;
					margin: 5px;
					font-size: 16px;

					label{
						display:inline-block;
						width:100px;
						text-align: right;
						color:#555;
					}
					input[type='text']{
						width:250px;
						height:26px;
					}
					input[type="checkbox"]{
				    height: 18px;
				    width: 18px;
				    vertical-align: middle;
				    margin:0px;
					}
					.scroll_notice{
						width:500px;
					}
					a{
						font-size:14px;
						margin-left:10px;
						color:$lightBlue;
					}
				}
				.save_btn{
					@extend .btn;
					position:absolute;
			    right: 150px;
			    top: 30px;
					width:120px;
					height:30px;
					background-color:$lightBlue;
				}
			}

			.adv_preview{
				width:80%;
				margin:10px auto;
				position:relative;
				
				.bg_img{
					width:100%;
					height:auto;
				}

				.tigan,.camera{
					width:20%;
					position:absolute;
					img{
						width:100%;
						height:auto;
					}
				}

				.tigan{
					left:8%;
					top:11%;
				}
				.camera{
					left:33%;
					top:11%;
				}

				// data show
				.rt_box,.lb_box,.rb_box{
					width:35%;
					position:absolute;
					border-radius: 10px;
					box-shadow: 0px 0px 1px 2px $lightBlue;
					background-color:#fff;
					overflow:hidden;
					
					img{
						width:100%;
						height: 100%;
					}
					.productsSelectedBgImg{
						opacity:.3;
					}
					.carousel_box{
						width:100%;
						height:100%;
						position:relative;

						img{
							position:absolute;
						}
					}
					video,embed{
						width:100%;
						height: 100%;
						border-radius: 5px;
					}

					&:hover{
						.top_bar{
							top:0px!important;
							@include transition(all .2s);
						}
						.files_list{
							padding-top:50px!important;
							@include transition(all .2s);
						}
					}


					.top_bar{
						position: absolute;
						top:-40px;
						left:0;
						width:100%;
						height:40px;
						line-height: 40px;
						background-color:rgba(51,51,51,0.7);
						cursor:pointer;
						z-index:100;
						.edit_btn{
							@extend .btn;
							height:100%;
							background-color:$lightBlue;
							font-size:14px;
							padding:0px 10px;
							box-sizing:border-box;
							min-width:30%;
							float:right;
						}
						.search_product{
					    height: 28px;
					    margin-left: 5px;
					    border-radius: 3px;
					    padding-left:10px;
					    box-sizing:border-box;
					    width:35%;
						}
						.search_btn{
					    width: 36px!important;
					    vertical-align: middle;
						}
						@media screen and (max-width:1700px){
							.search_btn{
								display:none;
							}
						}
						.del_btn{
							@extends .btn;
							width:36px!important;
							vertical-align:middle;
						}
					}

					//素材集列表
					.files_list{
						position:absolute;
				    left: 0px;
				    top: 0px;
						width:100%;
						height:100%;
				    font-size: 0;
				    font-size: 0;
				    overflow:auto;

						.file_item{
							width:80px;
							/* height:50px; */
							text-align:center;
							position:relative;
							display:inline-block;


							img{
								width:50px;
								height:50px;
								margin-top:5px;
								cursor:pointer;
							}
							.del_btn,.pre_btn{
								@extend .btn;
								position:absolute;
								
								border-radius:50%;
						    width: 20px;
						    height: 20px;
						    opacity: 0;
							}
							.del_btn{
						    top: 0px;
						    right: 10px;
						    background-color:#ff0000;
							}
							.pre_btn{
						    top: 0px;
						    left: 10px;
						    background-color:$lightBlue;
							}
							&:hover{
								.del_btn,.pre_btn{
									opacity:.7;
								}
							}
						}

						.product_item{
							width:25%;
							min-height:100px;
							box-sizing:border-box;
							display:inline-block;
					    background-color: rgba(255,255,255,0.3);
					    cursor:pointer;
					    position:relative;
			        vertical-align: top;
					    &:hover{
					    	background-color: rgba(0,0,0,0.3)!important;
					    	@include transition(all 0.3s);
					    	/* .data_pupup{
									display:block!important;
								} */
								.del_one_btn{
									width:20px!important;
									height:20px!important;
								}
					    }
					    text-align: center;
					    padding: 5px;
							.product_img_s{
								width:80%;
								min-height:60px;
							}
							>p{
								color:#333;
								font-size:14px;
								text-align:center;
						    word-wrap: break-word;
							}
							.del_one_btn{
								@extend .btn;
								position:absolute;
								right:0px;
								top:0px;
								background-color:rgba(255,0,0,0.7);
								height:0px;
								width:0px;
								overflow:hidden;
								color:#fff;
							}
							
						}
					}
					//当已选商品为空时显示提示
					.emptyNotice{
						height:100%;
						width:100%;
				    position: absolute;
				    top: 0;
				    left:0;
						h2{
							text-align:center;
							color:#333;
					    height: 250px;
					    font-size: 18px;
					    line-height: 250px;
						}
					}
				}

				.rt_box{
					right:8%;
					top:12%;
					height: 37%;
				}
				.lb_box{
					left:8%;
					bottom:11%;
					height: 52%;
					width:45%;
				}
				.rb_box{
					right:8%;
					bottom:11%;
					height: 37%;
				}

				// 轮播
				.carousel-inner>.item,.carousel-inner,.carousel{
					height:100%;
				}
			}

			.opera_bottom{
				text-align:center;
				padding:10px 0px;
				button{
					@extend .btn;
					width:120px;
					height:30px;
				}
				.save_btn{
					background-color:$lightBlue;
				}
				.cancel_btn{
					background-color:$deepGray;
				}
			}
		}
		
		.material_edit_box{
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

				.edit_content{
					padding:15px;
					margin:10px;
					text-align:left;
					height:450px;
					overflow:auto;
					font-size:0px;
					.material_item{
						margin:10px;
						position: relative;
						display:inline-block;
						width:240px;
						height:120px;
						box-shadow:0px 0px 2px 2px #ccc;

						img,video{
							width:100%;height:100%
						}

						input[type="checkbox"],
						input[type="radio"]{
							position: absolute;
							width:100%;
							height:70%;
							z-index:100;
							opacity:0;
							top:0px;
							left:0px;
							cursor:pointer;
						}
						input[type="checkbox"]:checked+label,
						input[type="radio"]:checked+label{
							background:url(#{$client_images}/white_gou.png) 5px 5px no-repeat;
					    background-size: 60% 60%;
					    display: inline-block;
					    width: 24px;
					    height: 24px;
					    background-color: #4ec963;
					    border-radius: 50%;
					    position: absolute;
					    right: -10px;
					    top: -10px;
					    opacity: .8;
						}
						.del_one_btn{
							@extend .btn;
							background-color:rgba(255,0,0,0.7);
							position:absolute;
							width:40px;
							height:24px;
							top:0px;
							left:0px;
							display:none;
							z-index:1000;
						}
						&:hover{
							.del_one_btn{
								display:block;
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
					.upload_btn{
						background-color:$lightBlue;
						width:120px;
						height:30px;
						line-height:30px;
						display:inline-block;
						text-align:center;
						color:#fff;
						cursor:pointer;
					}
					.save_btn{
						background-color:$lightBlue;
					}
					.cancel_btn{
						background-color:#777;
					}
				}

				.notice_tips{
					color:red;
					font-size:14px;
					text-align:center;
				}
			}
		}
	}
</style>