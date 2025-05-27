import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HomeOutlined,
  BookOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  SmileOutlined,
  CalendarOutlined,
  LogoutOutlined,
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
    try {
      await logoutApi();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">个人资料</Link>
      </Menu.Item>
      <Menu.Item key="partner">
        <Link to="/partner">伴侣绑定</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'diary',
      icon: <BookOutlined />,
      label: '日记',
      onClick: () => navigate('/diary/list'),
    },
    {
      key: 'photo',
      icon: <PictureOutlined />,
      label: '照片墙',
      onClick: () => navigate('/photo'),
    },
    {
      key: 'music',
      icon: <CustomerServiceOutlined />,
      label: '音乐收藏',
      onClick: () => navigate('/music'),
    },
    {
      key: 'mood',
      icon: <SmileOutlined />,
      label: '心情记录',
      onClick: () => navigate('/mood'),
    },
    {
      key: 'anniversary',
      icon: <CalendarOutlined />,
      label: '纪念日',
      onClick: () => navigate('/anniversary'),
    },
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
          <HeartOutlined /> 我们的小窝
        </div>
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Space style={{ color: 'white', cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>{user?.nickname || user?.username}</span>
            {partnerInfo && (
              <span style={{ marginLeft: '8px' }}>
                ❤️ {partnerInfo.nickname || partnerInfo.username}
              </span>
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