export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
    name: 'Bài tập thực hành 1',
    icon: 'code',
    path: '/bai-tap',
    routes: [
      {
        name: 'Bài 1: Game Đoán Số',
        path: '/bai-tap/bai-1',
        component: './BaiTap/Bai1',
      },
      {
        name: 'Bài 2: TodoList',
        path: '/bai-tap/bai-2',
        component: './BaiTap/Bai2',
      },
    ],
  },
  {
    name: 'Bài TH6: Quản lý Du lịch',
    path: '/bai-tap-6',
    routes: [
      {
        path: '/bai-tap-6/kham-pha',
        name: '1. Khám phá điểm đến',
        component: './BaiTap6/Home',
      },
      {
        path: '/bai-tap-6/lich-trinh',
        name: '2. Lịch trình & Ngân sách',
        component: './BaiTap6/ItineraryBudget', 
      },
      {
        path: '/bai-tap-6/admin',
        name: '3. Quản trị (Admin)',
        component: './BaiTap6/Admin',
      },
    ],
  },
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
