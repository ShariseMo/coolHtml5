<template>
	<div class="m_right_content interaction_setting_box">
		<div class="top_bar">
			<h2 class="title">以下是该机器的【互动设置】</h2>
		</div>

		<div class="content_box">
			<div class="upload_box">
				<div class="input_group">
					<input type="file" id="upload_file" @change="uploadFile">
					<label for="upload_file">上传互动素材</label>
				</div>

				<button class="save_btn" @click="save_set">保存设置</button>
			</div>

			<div class="material_list">
				<div class="material_item">
					<img class="music_bg" src="/images/client_background/interact_music.jpg" alt="">
					<audio src="http://sc1.111ttt.com/2016/1/06/02/199021800127.mp3" controls></audio>
					<input type="checkbox">
					<label for="" class="check_logo"></label>
				</div>
				<div class="material_item">
					<img class="music_bg" src="/images/client_background/interact_music.jpg" alt="">
					<audio src="http://sc1.111ttt.com/2016/5/06/02/199021749229.mp3" controls></audio>
					<input type="checkbox">
					<label for="" class="check_logo"></label>
				</div>
				<div class="material_item">
					<img class="music_bg" src="/images/client_background/interact_music.jpg" alt="">
					<audio src="http://sc1.111ttt.com/2016/5/06/02/199021504234.mp3" controls></audio>
					<input type="checkbox">
					<label for="" class="check_logo"></label>
				</div>
				<div class="material_item">
					<img class="music_bg" src="/images/client_background/interact_music.jpg" alt="">
					<audio src="http://sc1.111ttt.com/2016/5/06/02/199021650408.mp3" controls></audio>
					<input type="checkbox">
					<label for="" class="check_logo"></label>
				</div>
				<div class="material_item">
					<video src="http://egoumanageossview.edsmall.cn/ljHXZ-8aBpdUeHOgXMkOoXIwsS8w" controls></video>
					<input type="checkbox">
					<label for="" class="check_logo"></label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{

			}
		},
		methods:{
			uploadFile:function(e){
				var file = e.target.files || e.target.files[0];

				console.log(file)
			},
			save_set:function(){

			}
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';

	@media screen and(max-width:1900px) {
    .material_list{
			.material_item{
				height:130px!important;
			}
    }
  }
  @media screen and(max-width:1200px) {
    .material_list{
			.material_item{
				height:110px!important;
			}
    }
  }

	.interaction_setting_box{
		.content_box{
			.upload_box{
				.input_group{
			    padding: 10px 25px;
			    display:inline-block;
					input[type="file"]{
						display:none;
					}
					label{
						display:inline-block;
						height:30px;
						width:120px;
						background-color:$lightBlue;
				    text-align: center;
				    color: #fff;
				    line-height: 30px;
				    border-radius: 5px;
				    cursor:pointer;
					}
				}
				.save_btn{
					@extend .btn;
					height:30px;
					width:120px;
					border-radius: 5px;
					background-color:$lightBlue;
				}
			}

			.material_list{
				padding:2%;
		    height: 500px;
		    overflow: auto;
				.material_item{
					height:150px;
					width:22%;
					display:inline-block;
					box-shadow:0px 0px 2px 2px #ccc;
					margin:1%;
			    vertical-align: top;
					position:relative;
					.music_bg{
						width:100%;
						height:90%;
						position:absolute;
						z-index:0;
						opacity:.7;
					}
					&:hover .music_bg{
						opacity:1;
						@include transition(all .3s);
					}
					audio,video{
						width:100%;
						position:absolute;
						bottom:0px;
				    height: 100%;
					}
					input[type='checkbox']{
						position:absolute;
						width:100%;
						height:60%;
						opacity:0;
						cursor:pointer;
						margin:0px;
					}
					input[type='checkbox']:checked+label{
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
				}
			}
		}
	}
</style>