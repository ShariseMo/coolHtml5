<template>
	<!-- 机器管理列表 -->
	<div class="machine_list">
		<div class="search_box">
			<label for="search_input">机器名称:</label>
			<input type="text" v-model="machineSearchName">
			<button class="list_search_btn" @click="searchMachine">查询</button>

			<span class="tips">提醒:E购宝返回到window桌面默认密码为888888</span>
		</div>
	
		<hr>
	
		<table class="list_box" border="1">
			<tr>
				<th>序号</th>
				<th>机器名称</th>
				<th>邀请码</th>
				<!-- <th>运行状态</th> -->
				<th>区域地址</th>
				<th>运营场所</th>
				<th>机器编码</th>
				<th>操作</th>
			</tr>

			<tr v-for="item in machineList">
				<td>{{$index+1}}</td>
				<td>{{item.machineName}}</td>
				<td>{{item.invitationCode}}</td>
				<!-- <td>{{item.machineWorkState}}</td> -->
				<td>{{addrInStr(item.machineProvince,1)}}{{addrInStr(item.machineCity,2)}}{{addrInStr(item.machineDistrict,3)}}{{addrInStr(item.machineTown,4)}}{{item.machineAddr}}</td>
				<td>{{areaInStr(item.machineWorkArea)}}</td>
				<td>{{item.machineNo}}</td>
				<td><a v-link='{path:"/machine_setting?machineId="+item.machineId}'>机器管理</a></td>
			</tr>
			
		</table>
	
		<paging :current="pageNumber" :all="totalPages"></paging>
		<model></model>
	</div>
</template>

<script>
	import paging from "./paging.vue"
	import { initAreaDB, getAreaName } from '../areaDB.js';
	import model from "./model.vue"

	export default {
		data(){
			return{
				machineList:[],
				machineSearchName:undefined,
				placeArr:[
					"其他",
					"门店","售楼部","小区",  
					"合作联盟","商城","活动现场",  
					"市场门槛",
				],

				//分页参数
				totalPages:0,
				pageNumber:0,
			}
		},
		route:{
			data:function(){
				initAreaDB(() => {
					this.getMachineList();
				});
			}
		},
		methods:{
			//地址编码转为字符串
			addrInStr:function(code,type){
				return getAreaName(code);
			},
			//运营产所转为字符
			areaInStr:function(areaArr){
				if(!areaArr) return '';
				return areaArr.split(',').map(value => { return this.placeArr[value]; }).join(',');
			},
			//获取机器列表信息
			getMachineList:function(){
				var self = this
				self.$broadcast('keepMsg','正在加载机器列表。')
				self.$http.get('/machines',{pageNumber:self.pageNumber,machineName:self.machineSearchName,pageSize:30}).then(
						function(response){
							// console.log(response)
							self.machineList = response.data.data.list;
							self.pageNumber = response.data.data.pageNumber;
							self.totalPages = response.data.data.totalPages;
							if(200 == response.data.code){
								self.$broadcast('hideMsg')
							}
						}
					)
			},
			//根据机器名查找机器，这里只需要将pageNumber改为1就好
			searchMachine:function(){
				this.pageNumber=1;
				this.getMachineList();
			}
		},
		events:{
			'pageChange':function(num){
				var self = this;
				if(num>self.totalPages){return;}
				self.pageNumber = num;
				self.getMachineList();
			}
		},
		components:{
			paging,
			model,
		}
	}
</script>

<style lang="sass">
	// machine list
	@import '../../style/lib.scss';
.machine_list{
	padding:35px 20px;
	min-height: 640px;
	padding-bottom:100px;
	position:relative;
	.search_box{
		label{
			font-size: 18px;
			vertical-align: middle;
		}

		input[type='text']{
			height:24px;
			width:200px;
			vertical-align:top;
		}
		button.list_search_btn{
			width:100px;
			height:24px;
			vertical-align: top;
			background:none;
			border:1px solid #ccc;
			cursor: pointer;
		}

		.tips{
			color:#FF3030;
			font-size:16px;
	    padding-left: 20px;
	    vertical-align: top;
		}
	}

	hr{
		margin:30px 0px;
		color:#ccc;
	}

	//机器列表
	.list_box{
		width:100%;
		border:1px solid #ccc;

		th,td{
			text-align: center;
		}

		th{
			background-color: $deepBlue;
			height:40px;
			line-height: 40px;
			color:#fff;
		}

		td{
			height:40px;
			line-height: 40px;
			max-width: 300px;
			a{
				color:$lightBlue;
			}
		}
	}
}
</style>