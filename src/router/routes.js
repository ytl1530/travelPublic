
export default[
    // 登录
    {
        path:'/login',
        name:'login',
        component:()=>import('../views/login/index.vue'),
        meta:{
          show:false,
          keepAlive:false,
          title:'登录'
        }
    },
    /**
     * 数据面板
     */
    // 数据面板
    {
        path: '/layout',
        name: 'layout',
        component: () => import('../views/layout/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'数据面板'
        }
    },
    /**
     * 个人信息
     */
    // 数据面板
    {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('../views/userInfo/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'个人信息'
        }
    },

    /**
     * 游艇会信息管理
     */

    // 游艇会信息管理
    {
        path: '/yachtMessageAdmin',
        name: 'yachtMessageAdmin',
        component: () => import('../views/yachtMessageAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'游艇会信息管理'
        }
    },

    /**
     * 游艇管理
     */

    // 游艇列表
    {
        path: '/yachtAdmin',
        name: 'yachtAdmin',
        component: () => import('../views/yachtAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'游艇列表'
        }
    },
    // 游艇详情
    {
        path: '/yachtAdmin/yachtDetail',
        name: 'yachtDetail',
        component: () => import('../views/yachtAdmin/yachtDetail.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'游艇详情'
        }
    },
    // 添加游艇
    {
        path: '/yachtAdmin/addYacht',
        name: 'addYacht',
        component: () => import('../views/yachtAdmin/addYacht.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'添加游艇'
        }
    },

     /**
     * 船主管理
     */

    // 船主列表
    {
        path: '/shipownerAdmin',
        name: 'shipownerAdmin',
        component: () => import('../views/shipownerAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'船主列表'
        }
    },

     /**
     * 船长管理
     */

    // 船长列表
    {
        path: '/captainAdmin',
        name: 'captainAdmin',
        component: () => import('../views/captainAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'船长列表'
        }
    },

     /**
     * 角色管理
     */

    // 角色列表
    {
        path: '/roleAdmin',
        name: 'roleAdmin',
        component: () => import('../views/roleAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'角色列表'
        }
    },
    // 角色详情
    {
        path: '/roleAdmin/roleDetail',
        name: 'roleDetail',
        component: () => import('../views/roleAdmin/roleDetail.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'角色详情'
        }
    },

     /**
     * 财务管理
     */

    // 账单列表
    {
        path: '/financialAdmin',
        name: 'financialAdmin',
        component: () => import('../views/financialAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'账单列表'
        }
    },

    /**
     * 订单管理
     */

    // 订单列表
    {
        path: '/orderAdmin',
        name: 'orderAdmin',
        component: () => import('../views/orderAdmin/index.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'订单列表'
        }
    },
    // 订单详情
    {
        path: '/orderAdmin/orderDetail',
        name: 'orderDetail',
        component: () => import('../views/orderAdmin/orderDetail.vue'),
        meta: {
            show: true,
            keepAlive:false,
            title:'订单详情'
        }
    },
]