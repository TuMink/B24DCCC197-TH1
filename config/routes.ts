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
    path: '/bai-tap-4',
    name: 'Bài tập thực hành 4',
    icon: 'reconciliation', // Icon quyển sổ
    routes: [
      {
        path: '/bai-tap-4/so-van-bang',
        name: 'Quản lý Sổ Văn Bằng',
        component: './BaiTap4/SoVanBang',
      },
	  {
        path: '/bai-tap-4/quyet-dinh',
        name: 'Quyết Định Tốt Nghiệp',
        component: './BaiTap4/QuyetDinh',
      },
	  {
        path: '/bai-tap-4/cau-hinh',
        name: 'Cấu Hình Biểu Mẫu',
        component: './BaiTap4/CauHinh',
      },
	  {
        path: '/bai-tap-4/thong-tin-van-bang',
        name: 'Thông Tin Văn Bằng',
        component: './BaiTap4/ThongTinVanBang',
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
