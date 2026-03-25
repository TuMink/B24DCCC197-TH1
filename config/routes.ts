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
        path: '/bai-tap-5',
        name: 'Bài tập thực hành 5',
        icon: 'team', // Bạn có thể giữ icon hoặc đổi tùy ý
        routes: [
          // --- Minh phụ trách ---
          {
            path: '/bai-tap-5/danh-sach-clb',
            name: 'Danh sách Câu lạc bộ',
            component: './BaiTap5/DanhSachCLB',
          },
          // --- Khánh phụ trách ---
          {
            path: '/bai-tap-5/don-dang-ky',
            name: 'Đơn đăng ký',
            component: './BaiTap5/DonDangKy',
          },
          {
            path: '/bai-tap-5/thanh-vien',
            name: 'Thành viên CLB',
            component: './BaiTap5/ThanhVien',
          },
          // --- Minh phụ trách ---
          {
            path: '/bai-tap-5/bao-cao',
            name: 'Báo cáo Thống kê',
            component: './BaiTap5/BaoCaoThongKe',
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
