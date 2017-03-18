<template>
	<!-- 		素材管理页   -->
	<div class="material_manage">
		
	

		<router-view keep-alive transition="fade" transition-mode="out-in"></router-view>

		<!-- 信息设置页，左侧导航栏 -->
		<ul class="left_nav" >
			<li><a class="adv_nav" @click="nav_change('adv_set')" v-bind:class="{'active':is_adv}" v-link='{path:"/material_setting/adv_set"}'>广告设置</a></li>
			<li><a class="active_nav" @click="nav_change('active_set')" v-bind:class="{'active':is_active}" v-link='{path:"/material_setting/active_set"}'>活动设置</a></li>
			<li><a class="kefu_nav" @click="nav_change('service_set')" v-bind:class="{'active':is_kefu}" v-link='{path:"/material_setting/service_set"}'>客服设置</a></li>
			<li><a class="shop_nav" @click="nav_change('shop_set')" v-bind:class="{'active':is_shop}" v-link='{path:"/material_setting/shop_set"}'>店铺设置</a></li>
		</ul>
	</div>

</template>

<script>
	export default{
		data(){
			return{
				is_kefu:false,
				is_adv:false,
				is_active:false,
				is_shop:false,
			}
		},
		methods:{
			nav_change:function(target){
				var self = this;
				switch(target){
					case "adv_set":self.clear();self.is_adv = true;break;
					case "shop_set":self.clear();self.is_shop = true;break;
					case "active_set":self.clear();self.is_active = true;break;
					case "service_set":self.clear();self.is_kefu = true;break;
				}
			},
			clear:function(){
				this.is_kefu = false;
				this.is_adv = false;
				this.is_active = false;
				this.is_shop = false;
			}
		}
	}
</script>

<style lang="sass">
	@import '../../../style/lib.scss';
	.material_manage{
		.left_nav{
			width:12%;
			min-width: 150px;
			display:inline-block;
			background-color: #d7d7d7;
			min-height: 750px;

			box-sizing:border-box;

			a.active{
				background-color: $deepGray;
			}

			@each $name in adv,active,kefu,shop{
				.#{$name}_nav{
					position:relative;
					text-align: center;
					display:inline-block;
					height:80px;
					line-height: 140px;
					font-size: 16px;
					margin-bottom: 10px;
					padding:10px 0px;
					width:100%;
					&:before{
						content:"";
						background: url(#{$client_images}/m_nav_#{$name}.png) 0px 0px no-repeat;
						background-size: 100%;
						display:inline-block;
						position:absolute;
						width:45px;
						height:45px;
						top:15px;
						left: 50%;
				    margin-left: -23px;
					}
				}
			}
		}

		//common right content
		.right_content{
			float:right;
			/* display:inline-block; */
			width:85%;
			.top_bar{
				height:50px;
				line-height: 50px;
				border-bottom:1px solid $borderGray;
				h2{
					font-size: 20px;
					display:inline-block;
					padding:0px 55px 0px 10px;
					border-bottom:2px solid $deepBlue;
				}

				.add_btn{
					float:right;
					margin: 10px 25px;
				}
			}
		}

	}
</style>