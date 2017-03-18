<template>
	<div class="edit_box" v-show="show">
		<h2>{{text_name}}</h2>
		<input type="text" v-model="text_content">
		<div class="bottom">
			<button class="save_btn">确定</button>
			<button class="cancel_btn">取消</button>
		</div>
	</div>
</template>
<script>
	export default{
		props:['title'],
		data(){
			return{
				text_content:"",
				text_name:"",
				show:false,
			}
		},
		events:{
			'editMsg':function(){
				return this.text_content
			},
			'showEdit':function(title){
				this.show = true;
				this.text_name = title;
			}
		}
	}
</script>
<style lang="sass">
	@import '../../style/lib.scss';
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
    box-shadow: 0px 0px 2px 2px #ccc;
    padding:10px;

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
</style>