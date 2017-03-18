import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

Vue.use(VueResource)
Vue.use(VueRouter)

var router = new VueRouter();
/*----引入组件----*/
// //登录
// import login from './components/login.vue'
//修改密码
// import updatePwd from './components/updatePwd.vue'
//机器列表
import machineList from './components/machine-list.vue'

//机器设置页组件
import machineSet from './components/machine/machine-setting.vue'
import infoSet from './components/machine/info-setting.vue'
import serviceSet from './components/machine/service-setting.vue'
import shopSet from './components/machine/shop-setting.vue'
import advSet from './components/machine/adv-setting.vue'
import activeSet from './components/machine/active-setting.vue'
//import interactSet from './components/machine/interaction-setting.vue'  //互动设置页

// //信息管理页组件
// import materialSetting from './components/material/material-setting.vue'
// import activeSetting from './components/material/active-setting.vue'
// import serviceSetting from './components/material/service-setting.vue'
// import shopSetting from './components/material/shop-setting.vue'
// import advSetting from './components/material/adv-setting.vue'
// import advAdd from './components/material/adv-add.vue'
// //广告模板选择
// import goodMain from './components/material/adv_template/good-main.vue'
// import posterMain from './components/material/adv_template/poster-main.vue'
// import videoMain from './components/material/adv_template/video-main.vue'
// import noticeMain from './components/material/adv_template/notice-main.vue'


//设置路由
router.map({
/*	'/login':{
		component:login
	},*/
/*	'/update_pwd':{
		component:updatePwd
	},*/
	'/':{
		name:"index",
		component:machineList
	},
	'/machine_list':{
		component:machineList,
	},
	//机器设置页路由
	'/machine_setting':{
		name:"machine_setting",
		component:machineSet,
		subRoutes:{
			'/':{
				name:"info_set",
				component:infoSet
			},
			'/info_set':{
				name:"info_set",
				component:infoSet
			},
			'/service_set':{
				name:"service_set",
				component:serviceSet
			},
			'/shop_set':{
				name:"shop_set",
				component:shopSet
			},
			'/adv_set':{
				name:"adv_set",
				component:advSet
			},
			'/active_set':{
				name:"active_set",
				component:activeSet
			},
			/*'/interact_set':{
				name:'interact_set',
				component:interactSet
			}*/
		}
	},

	//素材页路由
	/*'/material_setting':{
		name:"material_setting",
		component:materialSetting,
		subRoutes:{
			'/':{
				name:"adv_set",
				component:advSetting
			},
			'/adv_set':{
				name:"adv_set",
				component:advSetting
			},
			'/adv_add':{
				name:"adv_set",
				component:advAdd,
				subRoutes:{
					'/':{
						name:"good_main",
						component:goodMain
					},
					'/good_main':{
						name:"good_main",
						component:goodMain
					},
					'/poster_main':{
						name:'poster_main',
						component:posterMain
					},
					'/video_main':{
						name:'video_main',
						component:videoMain
					},
					'/notice_main':{
						name:'notice_main',
						component:noticeMain
					}
				}
			},
			'/active_set':{
				name:"active_set",
				component:activeSetting
			},
			'/service_set':{
				name:"service_set",
				component:serviceSetting
			},
			'/shop_set':{
				name:"shop_set",
				component:shopSetting
			}
		}
	}*/
})

//绑定
router.start(App,'app')
//filter stagger
Vue.transition('stagger', {
  stagger: function (index) {
    // 每个过渡项目增加 50ms 延时
    // 但是最大延时限制为 300ms
    return Math.min(300, index * 50)
  }
})

