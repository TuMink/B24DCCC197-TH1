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
  name: 'Bài tập thực hành 3',
  icon: 'code', // Icon lịch cho phù hợp với bài đặt lịch
  path: '/bai-tap-3',
  routes: [
    {
      name: 'Báo cáo và thống kê',
      path: '/bai-tap-3/dashboard',
      component: './BaiTap3/Dashboard',
    },
    {
      name: 'Quản lý danh mục',
      path: '/bai-tap-3/danh-muc',
      routes: [
        {
          name: 'Dịch vụ',
          path: '/bai-tap-3/danh-muc/dich-vu',
          component: './BaiTap3/DichVu',
        },
        {
          name: 'Nhân viên',
          path: '/bai-tap-3/danh-muc/nhan-vien',
          component: './BaiTap3/NhanVien',
        },
      ]
    },
    {
      name: 'Quản lý lịch hẹn',
      path: '/bai-tap-3/lich-hen',
      component: './BaiTap3/LichHen',
    },
    {
      name: 'Đánh giá và Phản hồi',
      path: '/bai-tap-3/danh-gia',
      component: './BaiTap3/DanhGia',
    },
  ]
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
