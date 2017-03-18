<template>
	<div transition="fade" transition-mode="out-in" class="data_pupup" v-show="show">
		<button @click="hidePopup" class="close_btn">X</button>
		<img :src="productDetail.imgpath+'@360w_360h_.png'" alt="" class="product_img_l">
		<p style="font-size:16px;">{{productDetail.productname}}</p>
		<p>型号:{{productDetail.productnum}}</p>
		<p>价格:￥{{productDetail.mallsaleprice}}</p>
		<p>类型:{{productDetail.prodtype}}</p>
		<p>品牌:{{productDetail.brand}}</p>
		<p>风格:{{productDetail.prodstyle}}</p>
		<p>尺寸:长{{productDetail.speclength}}*宽{{productDetail.specwidth}}*高{{productDetail.specheight}}</p>
		<p>材质:{{productDetail.productmade}}</p>
		<p>颜色:{{productDetail.productcolor}}</p>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				productDetail:{},
				show:false,
			}
		},
		methods:{
			hidePopup:function(){
				this.show = false;
			}
		},
		events:{
			showDetail:function(item){
				this.show = true;
				this.productDetail = item;
			},
			hideDetail:function(productId){
				console.log(this.item)
				if(productId == this.productDetail.productid){
					this.show=false;
				}
			}
		}
	}
</script>

<style lang="sass">
	@import '../../style/lib.scss';

	.data_pupup{
		position:fixed;
		z-index:1000;
		background-color:#fff;
    width: 280px;
    left:15%;
    top:35%;
    font-size: 14px;
	  box-shadow: 0px 10px 40px 10px #ccc;
    padding:10px;
		img{
			width:80%;
			display:block;
			margin:0px auto;
		}
    p{
    	line-height:24px;
    	font-size:14px;
    	padding-left:10px;
    }
    .close_btn{
    	@extend .btn;
			width: 20px;
	    height: 20px;
	    background-color:$deepGray;
	    position: absolute;
	    right: 10px;
	    top: 10px;
	    border-radius: 20px;
    }
	}
</style>