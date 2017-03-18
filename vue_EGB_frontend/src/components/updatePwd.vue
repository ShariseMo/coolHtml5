<template>
	<div class="form_box machine_manage">
		<div class="input_group">
			<label for="account">用户名:</label>
			<input type="text" id="account" v-model="username" disabled>
		</div>
		

		<div class="input_group">
			<label for="oldPwd">旧密码:</label>
			<input type="password" id="oldPwd" v-model="oldPwd">
		</div>
		
		<div class="input_group">
			<label for="newPwd">新密码:</label>
			<input type="password" id="newPwd" v-model="newPwd">
		</div>

		<button class="btn update_btn" @click="updatePwd">提交</button>
		<model></model>
	</div>
</template>

<script>
import md5 from 'md5-hex'
import model from "./model.vue"
export default{
	data(){
		return{
			username:"",
			oldPwd:"",
			newPwd:"",
		}
	},
	ready:function(){
    var self = this;
    document.cookie.split(";").forEach((cookie)=>{
      var kvp = cookie.split("=");
      if(' username'==kvp[0]){
        self.username = decodeURI(kvp[1]);
        return;
      }
    })
  },
  methods:{
  	updatePwd:function(){
  		var self = this;
  		var pwdData={
  			password:md5(self.oldPwd),
  			newPassword:md5(self.newPwd)
  		}
  		self.$http.post('/updatePassword',pwdData).then(
  			function(response){
  				if(200==response.data.code){
  					self.$broadcast('tipsMsg',response.data.msg)
  					self.oldPwd = "";
  					self.newPwd = "";
  					location.href="/";
  				}else{
  					self.$broadcast('tipsMsg',response.data.msg)
  					console.log(response)
  				}
  			}
  		)
  	}
  },
  components:{
  	model,
  }
}
</script>

<style lang="sass">
	@import '../../style/lib.scss';
	.form_box{
		text-align: center;
		min-height:680px;
		padding-top:4%;
		.input_group{
			display:block;
			text-align: center;
			margin:15px auto;
			label{
				font-size: 16px;
			}
			input[type="text"],
			input[type="password"]{
				height:28px;
				width: 350px;
			}
		}

		.update_btn{
			width:200px;
			height:40px;
			background-color:$lightBlue;
			color:#fff;
		}
	}
</style>