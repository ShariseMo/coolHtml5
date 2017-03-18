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
						<img src="/images/client_background/adv_templ_notice.png" class="template_pic" alt="">
						<h2>天气公告模板</h2>
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
							<div class="media_item" v-for="item in showPicsList">
								<img :src="item" alt="">
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
							<div class="media_item" v-show="showVideo">
								<video controls="controls" :src="showVideo" alt=""></video>
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
							<div class="media_item" v-for="item in showPosterList">
								<img :src="item" alt="">
							</div>
						</div>	
					</td>
				</tr>
		</table>
		<model v-show="loading" msg="文件上传中..."></model>
	</div>
</template>

<script>
	import model from '../../model.vue';
	export default{
		data(){
			return{
				//文件预览
				data:[],
				picsList:[],
				posterList:[],
				videoList:[],

				showPicsList:[],
				showPosterList:[],
				showVideo:"",

				showTempList:false,
				loading:false,
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

				self.uploadMaterial(file,2);
			},
			uploadMaterial:function(file,type){
				var self = this,
						xhr = new XMLHttpRequest(),
						formData = new FormData();
				//upload file
				if(2==type){
					formData.append('file',file);
				}else{
					for(var i=0;i<file.length;i++){
						formData.append('file',file[i]);
						console.log(file[i])
					}
				}
				formData.append('materialTitle',file.name);
				formData.append('materialType',type);
				var progress = {
					onprogress:function(response){
						console.log(response)
					}
				}
				self.uploading();
				self.$http.post("/upload",formData,{upload:progress}).then(
					function(response){
						console.log(response);
						if(200 == response.data.code){
							// self.modelTips(response.data.msg);
							self.uploading();
							self.materialList(response.data.data.path,type);
						}
					}
				)
			},
			materialList:function(path,type){
				console.log(path)
				var self = this;
				if(2==type){
					//视频
					self.showVideo=path;
					console.log(self.showVideoList)
				}else if(1==type){
					self.showPicsList = path.split(",");
					console.log(self.showPicsList)
				}else if(3==type){
					self.showPosterList = path.split(",")
					console.log(self.showPosterList)
				}else{
					console.log(path);
				}
			},
			showTempListBtn:function(){
				this.showTempList = this.showTempList ? false : true;
			},
			changeTemp:function(temp){
				this.$dispatch('changeTemp',temp);
			},
			uploading:function(){
				this.loading = this.loading ? false : true;
			},
		},
		components:{
			model,
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