<template>
	<div class="right_content active_material_setting">
		<div class="top_bar">
			<h2>添加广告</h2>
			<a v-link='{path:"/material_setting/adv_set"}' class="cancel_btn">取消</a>
			<button class="save_btn" @click="upload">保存</button>
		</div>
	
		<div class="formBox">
			<div class="input_group">
				<label for="adv_name">广告标题:</label>
				<input type="text" name="adv_name" v-model="adv_title" id="adv_name">
			</div><br/>

			<div class="input_group">
				<label for="adv_stat">投放状态:</label>
				<input type="radio" value="0" id="stat_show" v-model="adState" name="adv_stat">
				<label for="stat_show">显示</label>

				<input type="radio" value="1" id="stat_hide" v-model="adState" name="adv_stat">
				<label for="stat_hide">隐藏</label>
			</div>

			<div class="input_group">
				<label for="adv_scope">投放范围:</label>
				<input type="checkbox" v-model="adRange" id="be_common">
				<label for="be_common">是否通用</label>
			</div>

			<div class="input_group">
				<label for="common_mode">通用模式:</label>
				<input type="radio" id="common_mode" v-model="adType" checked>
				<label for="common_mode">立式</label>
			</div>

			<div class="input_group">
				<label for="adv_start">开始时间:</label>
				<input type="date">
			</div>
			<div class="input_group">
				<label for="adv_end">结束时间:</label>
				<input type="date">
			</div>
		</div>

		<!-- <router-view></router-view> -->
		<component :is="advTemp" :material.sync="materialData"></component>

		<!-- confirm box
		<confirm v-show="showConfirm" transition="bounce"></confirm> -->
	</div>
</template>

<script>
	import confirm from "../confirm.vue";
	import good from "./adv_template/good-main.vue";
	import poster from "./adv_template/poster-main.vue";
	import video from "./adv_template/video-main.vue";
	import notice from "./adv_template/notice-main.vue";
	export default{
		data(){
			return {
				//最终上传素材的id集合
				materialData:[],

				//广告信息
				adv_title:"",
				beginDate:"",
				endDate:"",
				adState:"",
				adRange:"",
				adType:"",


				// confirm
				showConfirm:false,

				//广告模板组件选择
				advTemp:"good"
			}
		},
		methods:{
			upload:function(){
				console.log(this.picsList);
				console.log(this.showPicsList);
				console.log(this.materialData);
			}
		},
		events:{
			'changeTemp':function(temp){
				this.advTemp = temp;
			}
		},
		components:{
			good,
			video,
			poster,
			notice,
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';
	.active_material_setting{
		.top_bar{
			.cancel_btn,.save_btn{
				display:inline-block;
				float:right;
				text-align:center;
				width:100px;
				height:30px;
				line-height:30px;
				border-radius:5px;
				border:none;
				color:#fff;
				margin-right:15px;
				margin-top:10px;
			}
			.cancel_btn{
				background-color:#ccc;
			}
			.save_btn{
				background-color:$lightBlue;
			}
		}

		.formBox{
			.input_group{
				display:inline-block;
				padding:15px;
				min-width:200px;

				label,input{
					vertical-align:middle;
				}

				label{
					font-size:16px;
				}
				input[type='text'],input[type='date']{
					height:26px;
					line-height:26px;
					box-sizing:border-box;
				}
				input[type='date']{
					width:250px;
				}

				&:nth-of-type(1){
					input{
						width:600px;
					}
				}
			}
		}
		
		
	}
</style>