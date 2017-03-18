<template>
	<!-- 广告设置页 -->
	<div class="right_content adv_material_setting">
		<div class="top_bar">
			<h2>广告信息设置</h2>
			<a v-link='{path:"/material_setting/adv_add"}' class="add_btn">添加广告</a>
		</div>

		<div class="search_box">
			<label for="adv_name">广告标题:</label>
			<input type="text" name="adv_name" id="adv_name"><br>

			<label for="adv_start">投放时间:</label>
			<input type="date" name="adv_start" id="adv_start">

			<label for="adv_end">至</label>
			<input type="date" name="adv_end" id="adv_end">

			<button class="search_btn">查询</button>
		</div>

		<table class="adv_table">
				<tr>
					<th>序号</th>
					<th>广告标题</th>
					<th>投放时间</th>
					<th>投放状态</th>
					<th>投放范围</th>
					<th>通用模式</th>
					<th>广告模板</th>
					<th>操作</th>
				</tr>

				<tr>
					<td>1</td>
					<td>国庆活动</td>
					<td>
						2016-05-05
						<p>至</p>
						2016-10-10
					</td>
					<td>
						显示
					</td>
					<td>
						通用
					</td>
					<td>
						立式
					</td>
					<td>
						默认模板
					</td>
					<td>
						<button class="btn">修改</button>
						<button class="btn">删除</button>
					</td>
				</tr>
			</table>

	</div>

</template>

<script>
	export default {
		data(){
			return {
				machine_list:[],
				show_edit:false,
			}
		},
		methods:{
			upload:function(){
			}
		},
		http:{
			headers:{'Content-Type':'application/x-www-form-urlencoded'}
		},
		/*route:{
			data:function(){
				var self = this;
				self.$http({url:'../../test_data/machine_data.json',method:'GET'}).then(function(res){
					self.machine_list = res.data.machine_data;
				},function(res){
					console.log('error')
				})
			}
		}*/
	}
</script>

<style lang="sass">
	// adv material manage page
	@import '../../../style/lib.scss';
	.adv_material_setting{
		
		.search_box{
			padding:15px 10px;
			position:relative;
			label{
				font-size: 16px;
			}
			input[type='text']{
				width:400px;
				height:30px;
				margin-bottom: 15px;
			}
			input[type='date']{
				width:180px;
				height:30px;
				margin-right: 15px;
			}

			.search_btn{
				position:absolute;
				top:35%;
				right:30%;
			}
		}

		.adv_table{
			width:98%;
			margin-top:20px;
			border:1px solid $lightGray;

			th{
				background-color: $lightBlue;
				color:#fff;
				height:30px;
				line-height: 30px;
				border:1px solid $lightGray;
			}
			td{
				text-align: center;
				border:1px solid $lightGray;
				padding:10px 0px;
				min-height:100px;
				&:nth-of-type(8){
					&>button{
						@extend .btn;

						background-color: #fff;
						color:$lightBlue;
						display:block;
						margin:0px auto;
					}
				}
			}
		}
	}
</style>