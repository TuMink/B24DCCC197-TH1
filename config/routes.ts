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
    name: 'Bài tập thực hành 7',
    path: '/bai-tap-7',
    icon: 'project',
    routes: [
      {
        path: '/bai-tap-7/dang-nhap',
        name: 'Đăng nhập',
        component: './BaiTap7/Login',
        hideInMenu: true, // Ẩn khỏi menu bên trái (vì ta sẽ tự động chuyển hướng khi chưa đăng nhập)
      },
      {
        path: '/bai-tap-7/cong-viec',
        name: '1. Danh sách công việc',
        component: './BaiTap7/Tasks',
      },
      {
        path: '/bai-tap-7/lich',
        name: '2. Lịch (Calendar)',
        component: './BaiTap7/Calendar',
      },
      {
        path: '/bai-tap-7/thong-ke',
        name: '3. Thống kê tổng quan',
        component: './BaiTap7/Dashboard',
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
