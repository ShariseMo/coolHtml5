<template>
	<div>
		用户名：<input type="text" v-model="account">
		密码：<input type="password" v-model="pwd">
		<input type="submit" @click="login">
	</div>
	
</template>

<script>
	export default{
		data(){
			return {
				account:"",
				pwd:""
			}
		},
		methods:{
			login:function(){
				console.log(this.account);
				console.log(this.pwd);
				var self = this;
        self.$http.post('/login', {userName: this.account, passWord: this.pwd}).then(function (response) {
            self.info = response.data;
            if(200 == self.info.code){
            	document.cookie='username'+'='+this.account;
	            this.$router.go({name:"index"});
            }
        }, function (response) {
            console.log(response)
        })
			}
		}
	}
</script>

<style>
	
</style>