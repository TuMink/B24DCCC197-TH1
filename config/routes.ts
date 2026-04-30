﻿export default [
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
        path: '/notification',
        routes: [
            { path: './subscribe', exact: true, component: './ThongBao/Subscribe' },
            { path: './check', exact: true, component: './ThongBao/Check' },
            { path: './', exact: true, component: './ThongBao/NotifOneSignal' },
        ],
        layout: false,
        hideInMenu: true,
    },
        { path: '/' }, // Existing route
        {
            path: '/blog',
            name: 'Blog',
            icon: 'ReadOutlined',
            component: '@/pages/Blog',
            exact: true,
        },
        {
            path: '/blog/:slug',
            component: '@/pages/Blog/Detail',
            hideInMenu: true,
        },
        {
            path: '/about',
            name: 'Giới thiệu',
            icon: 'UserOutlined',
            component: '@/pages/About',
        },
        {
            path: '/admin/posts',
  name: 'Quản lý bài viết',
  icon: 'table',
  component: './Admin/Post',
        },
        {
            path: '/admin/tags',
  name: 'Quản lý thẻ',
  icon: 'tags',
  component: './Admin/Tag',
        },
    { path: '/403', component: './exception/403/403Page', layout: false },
    { path: '/hold-on', component: './exception/DangCapNhat', layout: false },
    { component: './exception/404' },
];