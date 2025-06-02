import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HomeOutlined,
  BookOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  SmileOutlined,
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { logout } from '../redux/slices/authSlice';
import { logout as logoutApi } from '../api/auth';
import { Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, partnerInfo } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    // 1. 立即清除本地登录状态并跳转
    dispatch(logout());
    navigate('/login');
    // 2. 异步通知后端（不影响前端流程）
    try {
      await logoutApi();
    } catch (error) {
      console.error('登出失败:', error);
      // 可以选择提示用户，但不影响前端跳转
    }
  };

  // Update userMenu structure for Ant Design v5 Dropdown
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人资料</Link>,
    },
    {
      key: 'partner',
      label: <Link to="/partner">伴侣绑定</Link>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    { key: 'dashboard', icon: <HomeOutlined />, label: '首页', onClick: () => navigate('/dashboard') },
    { key: 'diary', icon: <BookOutlined />, label: '日记', onClick: () => navigate('/diary/list') },
    { key: 'photo', icon: <PictureOutlined />, label: '照片墙', onClick: () => navigate('/photo') },
    { key: 'music', icon: <CustomerServiceOutlined />, label: '音乐收藏', onClick: () => navigate('/music') },
    { key: 'mood', icon: <SmileOutlined />, label: '心情记录', onClick: () => navigate('/mood') },
    { key: 'anniversary', icon: <CalendarOutlined />, label: '纪念日', onClick: () => navigate('/anniversary') },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          <HeartOutlined /> 浪漫小窝~~~~~
        </div>
        {/* Use menu prop instead of overlay */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ color: '#222', cursor: 'pointer', fontSize: 16 }}>
            <Avatar src={user?.avatar} icon={<UserOutlined />} />
            <span style={{ fontWeight: 500, marginLeft: 8 }}>{user?.username || user?.nickname}</span>
            <span style={{ fontSize: 16, color: '#ff4d4f', margin: '0 10px' }}>❤️</span>
            {partnerInfo && (
              <span style={{ fontWeight: 500 }}>{partnerInfo.username || partnerInfo.nicename}</span>
            )}
          </Space>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.split('/')[1]]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: 24, 
            margin: 0, 
            minHeight: 280,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 