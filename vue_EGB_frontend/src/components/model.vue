<template>
	<div class="msg_box" v-show="show">
		{{msgText}}
	</div>
</template>

<script>
	export default{
		data(){
			return{
				msgText:"",
				show:false,
			}
		},
		events:{
			"keepMsg":function(msg){
				var self = this;
				self.msgText = msg;
				self.show = true;
			},
			"hideMsg":function(){
				this.show = false;
			},
			"tipsMsg":function(msg){
				var self = this;
				self.msgText = msg;
				self.show = true;

				setTimeout(function(){
					self.show = false
				},1500)
			}
		}
	}
</script>

<style lang="sass">
	@import '../../style/lib.scss';

	.msg_box{
		position: fixed;
		z-index: 1000;
		left: 50%;
		top:50%;
		background-color: #888;
		opacity: .7;
		border-radius: 8px;
		color:#fff;
		display: inline-block;
    padding: 15px 20px;
    text-align: center;
	}
	.hide{
		opacity:0;
	}
</style>