<template>
	<!-- 分页comp -->
	<div class="paging">
		<a v-show="havePre" class="first_page_btn" @click="firstPage"></a>
		<a v-show="havePre" class="pre_page_btn" @click="prePage"></a>
		<span class="page_num">第{{current}}页/共{{all}}页</span>
		<a v-show="haveNext" class="next_page_btn" @click="nextPage"></a>
		<a v-show="haveNext" class="last_page_btn" @click="lastPage"></a>
	</div>
</template>

<script>
	export default {
		props:['current',"all"],
		data(){
			return{
				havePre:false,
			}
		},
		methods:{
			nextPage:function(){
				var self = this;

				if(self.current + 1 == self.all){
					self.haveNext = false;
				}else{
					self.haveNext = true;
				}
				self.havePre = true;

				self.current ++;
				self.$dispatch("pageChange",self.current);
			},
			prePage:function(){
				var self = this;
				if(2 == self.current){
					self.havePre = false;
				}else{
					self.havePre = true;
				}
				self.haveNext = true;
				self.current --;
				self.$dispatch("pageChange",self.current);
			},
			firstPage:function(){
				var self = this;
				self.current = 1;
				self.havePre = false;
				self.haveNext = true;
				self.$dispatch("pageChange",self.current);
			},
			lastPage:function(){
				var self = this;
				self.current = self.all;
				self.haveNext = false;
				self.havePre = true;
				self.$dispatch("pageChange",self.current);
			},
		},
		computed:{
			'haveNext':function(){
				var self = this;
				if(self.current<self.all){
					return true;
				}else{
					return false;
				}
			}
		}
	}
</script>

<style lang="sass">
@import '../../style/lib.scss';
	// pageing comp
.paging{
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;

    a{
    	cursor:pointer;
    }

	@each $name in first_page_btn,last_page_btn{
		.#{$name}{
			background: url(#{$client_images}/#{$name}.jpg) 0px 0px no-repeat;
			background-size:100% 100%;
			height:30px;
			width:30px;
			display:inline-block;
			vertical-align: middle;
		}
	}

	@each $name in pre_page_btn,next_page_btn{
		.#{$name}{
			background: url(#{$client_images}/#{$name}.jpg) 0px 0px no-repeat;
			background-size:100% 100%;
			height:30px;
			width:80px;
			margin:0px 5px;
			display:inline-block;
			vertical-align: middle;
		}
	}

	.page_num{
		font-size: 16px;
		text-align: center;
		width:120px;
		display:inline-block;
	}
}
</style>