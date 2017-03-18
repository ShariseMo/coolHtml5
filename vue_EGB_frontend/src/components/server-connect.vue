<template>
	<div class="comp" id="comp">
		<div class="title">
			选择客服
			<button class="close_btn">X</button>
		</div>
		<div class="search_bar">
			<label for="service_name">客服名称:</label>
			<input type="text" id="service_name">

			<label for="service_tel">客服电话:</label>
			<input type="text" id="service_tel">

			<button class="btn">查询</button>
		</div>
		<table>
			<tr>
				<th>序号</th>
				<th>客服名称</th>
				<th>联系电话</th>
				<th>选择关联</th>
			</tr>
			<tr v-for="item in list">
				<td>{{$index}}</td>
				<td>{{item.serverName}}</td>
				<td>{{item.serverMobile}}</td>
				<td><input type="checkbox" name="connect_list" :value="item.serverId" v-model="connect_list"></td>
			</tr>
		</table>

		<button @click="check_connect">确认选择</button>
		<button>取消返回</button>
	</div>
</template>

<script>
	export default{
		props:['list'],
		data(){
			return{
				connect_list:[]
			}
		},
		methods:{
			del:function(index){
				this.list.splice(index,1);
			},
			check_connect:function(){
				console.log(this.connect_list);
			}
		}
	}
</script>

<style lang="sass">
	
</style>