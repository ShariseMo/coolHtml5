<template>
	<div>
		<table class="upload_table" border="1">
				<tr>
					<th>选择模板</th>
					<th>位置/操作</th>
					<th>广告素材展示</th>
				</tr>

				<tr>
					<td rowspan="3" class="temp_pic_box">
						<img src="/images/client_background/adv_templ_good.jpg" class="template_pic" alt="">
						<h2>产品为主模板</h2>
						<button class="btn" @click="showTempListBtn">更换模板
							<ul v-show="showTempList">
								<li><a @click="changeTemp('good')">产品为主模板</a></li>
								<li><a @click="changeTemp('poster')">海报为主模板</a></li>
								<li><a @click="changeTemp('video')">视频为主模板</a></li>
								<li><a @click="changeTemp('notice')">公告天气模板</a></li>
							</ul>
						</button>
					</td>
					<td class="second_td">
					<p>位置一(产品图)</p>
					<input type="file" id="file_1" multiple id="file_3" multiple @change="add_pic">
					<label for="file_1">浏览...</label>

					<button class="btn">素材库</button>
					</td>
					<td class="third_td">
						<p class="tips">产品图: 尺寸:580px*580px, 数量上限:50个,单文件大小:500Kb以下</p>	

						<div class="media_list">
							<div class="media_item" v-for="item in showPicsList" @click="showConfirmBox($index,1,item.materialId)">
								<img :src="item.materialBody" alt="">
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td class="second_td">
					<p>位置二(视频)</p>
					<input type="file" id="file_2" multiple @change="add_video">
					<label for="file_2">浏览...</label>

					<button class="btn">素材库</button>
					</td>
					<td class="third_td">
						<p class="tips">视频:不低于560p的视频文件，数量:1,文件大小:600Mb以下</p>	

						<div class="media_list">
							<div class="media_item" v-if="showVideo.materialId" @click="showConfirmBox(1,2,showVideo.materialId)">
								<video controls="controls" :src="showVideo.materialBody" alt=""></video>
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td class="second_td">
					<p>位置三(海报)</p>
					<input type="file" id="file_3" multiple @change="add_poster">
					<label for="file_3">浏览...</label>

					<button class="btn">素材库</button>
					
					</td>
					<td class="third_td">
						
						<p class="tips">广告海报:720px*325px,数量上限:6个,单个文件大小:350Kb以下。</p>

						<div class="media_list">
							<div class="media_item" v-for="item in showPosterList" @click="showConfirmBox($index,3,item.materialId)">
								<img :src="item.materialBody" alt="">
							</div>
						</div>	
					</td>
				</tr>
		</table>
		<model v-show="loading" :msg="loadMsg"></model>
		<confirm :confirm="confirmId" v-show="showConfirm"></confirm>	
	</div>
</template>

<script>
	import model from '../../model.vue'
	import confirm from '../../confirm.vue'
	// import './moxie.js'
/*	import 'plupload/js/plupload.full.min.js'*/
	/*import 'Qiniu'
	import 'plupload'*/
	export default{
		props:["materialData"],
		data(){
			return{
				//七牛uploader
				uploader:{},
				uploadToken:"",
				host:"",
				//文件预览
				data:[],
				picsList:[],
				posterList:[],
				videoList:[],

				showPicsList:[],
				showPosterList:[],
				showVideo:{},

				showTempList:false,
				loading:false,
				loadMsg:"",

				showConfirm:false,
				confirmId:"",
				confirmIndex:"",
				confirmType:"",
			}
		},
		ready:function(){
			var self = this;
			self.$http.get("/uploadtoken").then(
				function(response){
					self.uploadToken = response.data.data.uploadToken;
					self.host = response.data.data.host;
					/*console.log(self.uploadToken)
					self.initQiniu();*/
				}
			)
		},
		http:{
			headers:{
				'Content-Type':'multipart/form-data; boundary=<frontier>'
			}
		},
		methods:{
			add_pic:function(e){
				var self = this;
				var obj={},
				    file = e.target.files;

				for(var i = 0;i<file.length;i++){
					var reader = new FileReader();
					reader.readAsDataURL(file[i]);
					self.picsList.push(file[i]);
					/*reader.onload=function(e){
						self.showPicsList.push(e.target.result);
					}*/
				}
				self.uploadMaterial(self.picsList,1);
			},
			add_poster:function(e){
				var self = this;
				var obj={},
				    file = e.target.files,
				    form_data = new FormData();
				for(var i = 0;i<file.length;i++){
					var reader = new FileReader();
					reader.readAsDataURL(file[i]);
					self.posterList.push(file[i]);
					/*reader.onload=function(e){
						self.showPosterList.push(e.target.result);
					}*/
				}

				self.uploadMaterial(self.posterList,3);
			},
			add_video:function(e){
				var self = this;
				var obj={},
						
						reader = new FileReader();
				var file = e.target.files[0];
				reader.readAsDataURL(file);

				self.videoList[0] = file;
				/*self.showVideoList.push(URL.createObjectURL(file));
				console.log(self.showVideoList);*/

				//self.uploadMaterial(file,2);
				self.uploadQiniu(file)
			},
			uploadMaterial:function(file,type){
				console.log(file)
				var self = this,
						xhr = new XMLHttpRequest(),
						formData = new FormData();
				//upload file
				if(2==type){
					formData.append('file',file);
				}else{
					for(var i=0;i<file.length;i++){
						formData.append('file',file[i]);
						// console.log(file[i])
					}
				}
				formData.append('materialTitle',file[0].name);
				formData.append('materialType',type);
				formData.append('adTemplate',1);

				if(1==type){
					formData.append("position",1)
				}else if(3==type){
					formData.append("position",3)
				}

				console.log(formData.getAll('file1'))
				//上传进度
				var progress={
					onloadstart:function(){
						self.loadMsg = "文件上传中..."
						self.uploading();
					},
					onprogress:function(response){
						var per = response.loaded / response.total;
						var perMsg = (Math.round(per*10000)/100).toFixed(2)+'%';
						if(1!=per){
							self.loadMsg = "文件上传中..."+perMsg;
						}else{
							self.loadMsg = "文件上传成功！"
							setTimeout(function(){
								self.uploading()
							},1500)
						}
					}
				}
				self.uploading();
				self.$http.post("/materials",formData,{upload:progress}).then(
					function(response){
						if(200 == response.data.code){
							console.log(response)
							// self.modelTips(response.data.msg);
							self.uploading();
							self.materialList(response.data.data,type);
						}else{
							console.log(response)
						}
					}
				)
			},
			//视频文件传到七牛云，返回key再给oss储存
			uploadQiniu:function(file){
				var self = this,
						name = file.name;

				var fileData = new FormData();
				fileData.append('file',file);
				fileData.append('token',self.uploadToken);
				var progress={
					onloadstart:function(){
						self.loadMsg = "文件上传中..."
						self.uploading();
					},
					onprogress:function(response){
						var per = response.loaded / response.total;
						var perMsg = (Math.round(per*10000)/100).toFixed(2)+'%';
						if(1!=per){
							self.loadMsg = "文件上传中..."+perMsg;
						}else{
							self.loadMsg = "文件上传成功！"
							setTimeout(function(){
								self.uploading()
							},1500)
						}
					}
				}
				
				self.$http.post("http://upload.qiniu.com",fileData,{upload:progress}).then(
					function(response){
						console.log(self.host + response.data.key)

						var formData = new FormData();
						formData.append('materialType',2);
						formData.append('adTemplate',1);
						formData.append('position',2);
						formData.append('materialTitle',name);
						formData.append('materialBody',self.host+response.data.key);

						this.$http.post("/materials",formData).then(
							function(response){
								console.log(response)
								self.showVideo = response.data.data[0];
							}
						)
					}
				)
			},
			materialList:function(list,type){
				var self = this;
				if(1==type){
					self.showPicsList = list.map(function(value){return value});
					console.log(self.showPicsList)
				}else if(3==type){
					self.showPosterList = list.map(function(value){return value})
					console.log(self.showPosterList)
				}else{
					console.log(list);
				}
			},
			showTempListBtn:function(){
				this.showTempList = this.showTempList ? false : true;
			},
			uploading:function(){
				this.loading = this.loading ? false : true;
			},
			showConfirmBox:function(index,type,id){
				console.log(id)
				this.showConfirm = true;
				this.confirmId = id;
				this.confirmIndex = index;
				this.confirmType = type;
			},
			delShowList:function(){
				var self = this;
				var index = self.confirmIndex,
				    type = self.confirmType;
				if(2==type){
					self.showVideo = ""
				}else if(1 == type){
					self.showPicsList.splice(index,1);
				}else{
					self.showPosterList.splice(index,1)
				}

				console.log(self.showPicsList)
			},
			changeTemp:function(temp){
				this.$dispatch('changeTemp',temp);
			},
		},
		events:{
			'confirmChcek':function(confirm){
				var self=this;
				console.log(confirm)
				if(!confirm){
					self.showConfirm = false;
					self.confirmId = "";
				}else{
					self.$http.delete("/material/"+confirm).then(
						function(response){
							if(200 == response.data.code){
								self.showConfirm = false;
								self.confirmId = "";
								self.delShowList();
							}
						}
					)
				}
			}
		},
		computed:{
			materialData:function(){
				var self = this;
				self.materialData = self.picsList.map(function(value){
					return {materialBody:value.materialId,position:1}
				})
			}
		},
		components:{
			model,
			confirm,
		}
	}
</script>

<style lang="sass">
	@import '../../../../style/lib.scss';
	.upload_table{
			width:95%;
			margin:10px auto;
			border:1px solid $borderGray;
			th{
				background-color:$lightGray;
				height:50px;
				line-height:50px;
				font-size:16px;
			}
			td{
				text-align: center;
				height:150px;
				overflow:hidden;
			}
			.temp_pic_box{
				width:25%;
				.template_pic{
					width:80%;
				}

				button{
					background-color:$lightBlue;
					width:100px;
					height:26px;
					margin-top:15px;
					position:relative;

					ul{
						position:absolute;
						top:26px;
						left:0px;
						width:100px;

						background-color:$lightBlue;
						font-size: 0px;
						li{
							line-height: 30px;
							height:30px;
							display:block;
							a{
								display:inline-block;
								font-size: 14px;
								color:#fff;
								width:100%;
								text-align: center;
							}
						}
					}
				}

				h2{
					color:#777;
					text-align: center;
					font-size: 18px;
				}
			}

			.second_td{
				width:20%;

				input[type='file']{
					display:none;
				}
				p{
					margin:10px 0px;
				}
				label{
					width:80px;
					height:24px;
					line-height:24px;
					background-color:$btnRed;
					display:inline-block;
					color:#fff;
					cursor:pointer;
					border-radius:3px;
				}
				button{
					width:80px;
					height:24px;
					border-radius:3px;
					background-color:$lightBlue;
				}
			}

			.third_td{
				position: relative;
				overflow: auto;
				width:400px;
				.tips{
					position:absolute;
					bottom:5px;
					color:#777;
					font-size:14px;
					left:15px;
					z-index: 100;
				}

				.media_list{
					margin:10px;
					width:auto;
					height:100px;
					overflow-x:auto;
					.media_item{
						width:120px;
						height:80px;
						position:relative;
						display:inline-block;
						margin:5px;
						cursor:pointer;
						box-sizing:border-box;

						&:after{
							content:"";
							position:absolute;
							width:14px;
							height:14px;
							border-radius:50%;
							background:url(#{$client_images}/close.png) 3px 3px no-repeat;
							background-size:12px 12px;
							background-color:$btnRed;
							top:-8px;
							right:-8px;
							padding:2px;
							opacity: .7;
							display:none;
						}

						&:hover{
							border:1px solid $btnRed;
							box-shadow:0px 0px 2px 1px $btnRed;
						}
						&:hover:after{
							display:block;
						}

						img,video{
							width:100%;
							height:100%;
						}
					}
				}
				
			}
		}
</style>