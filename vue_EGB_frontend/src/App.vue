<template>
  <div id="app">
    <!-- 顶部栏 -->
    <div class="top_nav_bar">

      <a href="#">欢迎使用E购宝管理后台</a>

      <div class="group_box user-icon">{{username}}
        <div class="hide_box">
          <!-- <a v-link='{path:"/update_pwd"}'>修改密码</a> -->
          <a href="http://121.40.85.110:9010/index/1" target="_blank">修改密码</a>
          <!-- <a v-link='{path:"/login.html"}' href="/login.html">退出</a> -->
          <a @click="logout">退出</a>
        </div>
      </div>
      <div class="group_box kefu-icon">
        联系客服
        <div class="hide_box service_box">
          <ul>
            <li>
              <img src="/images/client_background/service_qrcode_zxh.png" class="left" alt="">
              <div class="right">
                <p>姓名:周小欢</p>
                <p>手机:18813399491</p>
                <p>座机:0760-28103698</p>
                <p>微信:18813399491</p>
              </div>
            </li>
            <li>
              <img src="/images/client_background/service_qrcode_fyh.png" class="left" alt="">
              <div class="right">
                <p>姓名:方盈花</p>
                <p>手机:18813399517</p>
                <p>座机:0760-28103697</p>
                <p>微信:18813399517</p>
              </div>
            </li>
            <li>
              <img src="/images/client_background/service_qrcode_wm.png" class="left" alt="">
              <div class="right">
                <p>姓名:吴梦</p>
                <p>手机:15007605221</p>
                <p>座机:0760-28103699</p>
                <p>微信:15007605221</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <a href="http://wiki.edsmall.cn/" target="_blank" class="group_box baike-icon">EDS百科</a>
      <div class="group_box qrcode-icon">
        公众号
        <div class="hide_box qrcode_box">
          <img class="qrcode_img" src="/images/client_background/eds_qrcode.png" alt="">
        </div>
      </div>
    </div>

    <div class="clear"></div>
    <!-- 头部导航栏 -->
    <div class="head_bar"> 
      <a href="#" class="logo_link">客户终端管理后台</a>

      <!-- <a class="sources_link" v-link='{path:"/material_setting"}'>信息设置</a>
      <a class="machine_link" v-link='{path:"/machine_list"}'>机器管理</a> -->
    </div>

    <div class="content_body">
      <router-view keep-alive transition="fade" transition-mode="out-in"></router-view>
    </div>

    <!-- footer -->
    <div class="footer">
      EDS会员商城    www.edsmall.cn    免费热线4006-621-721   咨询QQ：4006-621-721   EDS百科  粤ICP备14009360号
    </div>
  </div>
</template>

<script>
  // import {moxie} from 'plupload/js/moxie.min.js'
/*  import * as plupload from 'plupload/js/plupload.full.min.js'
  import * as qiniu from 'qiniu-js/dist/qiniu.js'*/
export default {
  data () {
    return {
      username:"",
    }
  },
  ready:function(){
    var self = this;
    document.cookie.split(";").forEach((cookie)=>{
      var kvp = cookie.split("=");
      if('username'==kvp[0].trim()){
        self.username = decodeURI(kvp[1]);
        return;
      }
    })
  },
  methods:{
    logout:function(){
      this.$http.get('/logout').then(
        function(response){
          if(200==response.data.code){
            location.href="/login.html"
          }
        }
      )
    }
  }
}
</script>

<style lang="sass">
  @import '../style/lib.scss';

  @media screen and(max-width:1400px) {
    .top_nav_bar,.head_bar{
      padding:0px 10%!important;
      box-sizing:border-box;
    }
  }
  @media screen and(max-width:1250px) {
    .top_nav_bar,.head_bar{
      padding:0px 5%!important;
      box-sizing:border-box;
    }
  }
  @media screen and(max-width:1100px) {
    .top_nav_bar,.head_bar{
      padding:0px!important;
      box-sizing:border-box;
    }
  }

/* top bar */
  .top_nav_bar{
    height:30px;
    line-height: 30px;
    background-color: $lightGray;
    padding:0px 13%;
    color:#333;

    .group_box{
      float:right;
      margin-left: 30px;
      position:relative;
      display:inline-block;
      min-width:80px;
      padding-left: 20px;
      cursor:pointer;
      text-align: center;
      .hide_box{
        display:none;
        position:absolute;
        z-index: 99;
      } 
      .qrcode_box{
        left: -80px;
        .qrcode_img{
          width:250px;
          background-color: #fff;
          padding: 15px;
          box-shadow: 1px 1px 2px 2px #ccc;
        }
      }
      .service_box{
        width: 300px;
        background-color: #fff;
        left: -140px;
        box-shadow: 0px 2px 2px 2px #ccc;
        ul{
          width:100%;
          padding:2% 10px;
          box-sizing: border-box;
          li{
            border-bottom:1px solid #ccc;
            &:nth-of-type(3){
              border-bottom:none;
            }
            padding:2% 10px;
            min-height:40px;
            .left{
              display:inline-block;
              vertical-align:middle;
              width:30%;
            }
            .right{
              display:inline-block;
              vertical-align:middle;
              width:65%;
              padding-left:10px;
              box-sizing:border-box;
              p{
                text-align:left;
                line-height:22px;
              }
            }
          }
        }
      }
      &:hover{
        &:after{
          @include transform(rotate(180deg));
          @include transition(all .2s);
        }

        .hide_box{
          display:block;
        }
      }
    }
    @each $name in user,kefu,baike,qrcode{
      .#{$name}-icon:before{
        content:"";
        background: url(#{$client_images}/icon_#{$name}.png) 0px 0px no-repeat;
        background-size:100% 100%;
        width:16px;
        height:16px;
        position:absolute;
        left:-5px;
        top:6px;
      }
    }
      
    .user-icon:after,.kefu-icon:after{
      content:"";
        background: url(#{$client_images}/icon_arrow.png) 0px 0px no-repeat;
        background-size:100% 100%;
        width:8px;
        height:8px;
        position:absolute;
        right:-8px;
        top:10px;
    }
    .user-icon{
      .hide_box{
        width:120px;
        padding:0px 5px;
        margin-left: -40px;
        text-align: center;
        background-color:#fff;
        a{
          position:relative;
          display:block;
          width:100%;
          height:40px;
          line-height: 40px;
          border-bottom:1px solid $borderGray;
        }

        a:nth-of-type(1):before{
          content:"";
          background: url(#{$client_images}/icon_change_pwd.png) 0px 0px no-repeat;
          background-size: 100% 100%;
          width:18px;
          height:18px;
          position:absolute;
          left:5px;
          top:10px;
        }
        a:nth-of-type(2):before{
          content:"";
          background: url(#{$client_images}/icon_exit.png) 0px 0px no-repeat;
          background-size: 100% 100%;
          width:18px;
          height:18px;
          position:absolute;
          left:5px;
          top:10px;
        }
      }
    }

  }

/* header_bar */
  .head_bar{
    background-color: $lightBlue;
    height: 100px;
    line-height: 100px;

    padding:0px 12%;

    .logo_link{
      float: left;
      font-size: 24px;
      position:relative;
      width:350px;
      display:inline-block;
      padding-left: 130px;
      color:#fff;
    
      &:before{
        content:"";
        background: url("#{$client_images}/egb_logo.png") 0px 0px no-repeat;
        position:absolute;
        width:120px;
        height:70px;
        background-size: 100% 100%;
        left:0;
        top:15px;
      }
    }

    .machine_link,.sources_link{
      float:right;
      color:#fff;
      margin-right: 15px;
      font-size: 16px;
      display: inline-block;
      position: relative;
      width:100px;
      text-align: center;
      margin-top:25px;
    }

    @mixin link_icon{
      width:50px;
      height:43px;
      top:-10px;
      left:25px;
      position: absolute;
      background-size: 100% 100%;
    }

    .machine_link:after{
      content:"";
      background: url("#{$client_images}/machine_link_logo.png") 0px 0px no-repeat;
      @include link_icon;
    }

    .sources_link:after{
      content:"";
      background: url("#{$client_images}/material_link_logo.png") 0px 0px no-repeat;
      @include link_icon;
    }
  }

/* .content_body */
  .content_body{
    margin:15px auto;
    width:75%;
    min-width: 1080px;
    background-color: #fff;
    clear:both;
  }

//fotter
  .footer{
    height:60px;
    line-height: 60px;
    background-color: #fff;
    text-align: center;
    clear:both;
  }
</style>
