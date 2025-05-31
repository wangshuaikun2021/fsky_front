import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Space, Row, Col, Button, Form, Input, Upload, message, Spin, Modal, Descriptions } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined, EnvironmentOutlined, LinkOutlined, CalendarOutlined, HeartOutlined, UploadOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ThunderboltOutlined, AppleOutlined, SmileOutlined, TrophyOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updateUser } from '../../redux/slices/authSlice';
import { updateUserInfo, changePassword } from '../../api/auth'; // Import API calls

const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, partnerInfo, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm] = Form.useForm(); // Renamed form
  const [passwordForm] = Form.useForm(); // Added password form
  const [uploading, setUploading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false); // Password modal state
  const [passwordLoading, setPasswordLoading] = useState(false); // Password change loading state

  // When user data is loaded or updated, populate the profile form
  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        nickname: user.nickname,
        email: user.email,
        favorite_game: user.profile?.favorite_game,
        favorite_food: user.profile?.favorite_food,
        favorite_animal: user.profile?.favorite_animal,
        favorite_sport: user.profile?.favorite_sport,
        favorite_color: user.profile?.favorite_color,
        avatar_file: undefined, // Add avatar_file field to form, but don't initialize it
      });
    }
  }, [user, profileForm]);

  // Effect to log profile data changes
  useEffect(() => {
    console.log('Profile component: user.profile state changed', user?.profile);
  }, [user?.profile]); // Depend on user.profile

  if (loading && !user) { // Show loading only on initial load if user is null
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
     // Should not happen with AuthInitializer if authenticated
     return <Card title="个人资料">无法加载用户数据。</Card>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset profile form fields to current user data
    profileForm.setFieldsValue({
       nickname: user.nickname,
       email: user.email,
       favorite_game: user.profile?.favorite_game,
       favorite_food: user.profile?.favorite_food,
       favorite_animal: user.profile?.favorite_animal,
       favorite_sport: user.profile?.favorite_sport,
       favorite_color: user.profile?.favorite_color,
       avatar_file: undefined, // Add avatar_file field to form, but don't initialize it
    });
  };

  const onProfileFormFinish = async (values) => {
    console.log('Received profile form values: ', values);

    // Restructure data to match backend expectation and include avatar_file if exists
    const requestData = {
      nickname: values.nickname,
      email: values.email,
      profile: {
        favorite_game: values.favorite_game,
        favorite_food: values.favorite_food,
        favorite_animal: values.favorite_animal,
        favorite_sport: values.favorite_sport,
        favorite_color: values.favorite_color,
      },
      // Only include avatar_file if it was selected for upload
      ...(values.avatar_file && { avatar_file: values.avatar_file }),
    };

    console.log('Sending profile update data: ', requestData);

    try {
      // Use the modified updateUserInfo function that handles FormData
      const updatedUserResponse = await updateUserInfo(requestData);
      // Backend should return the updated user object, including the new avatar URL
      dispatch(updateUser(updatedUserResponse.user)); // Assuming the response has a 'user' field with updated data
      message.success('个人资料更新成功！');
      setIsEditing(false);
    } catch (error) {
      message.error(error.message || '更新失败，请重试。');
    }
  };

  // Dummy upload function for avatar
  const handleAvatarUpload = async (options) => {
    const { file } = options;
    console.log('Uploading avatar file:', file);
    setUploading(true);

    try {
      // Create FormData for avatar upload
      const formData = new FormData();
      formData.append('avatar', file);

      // Use updateUserInfo to send the avatar file
      const updatedUserResponse = await updateUserInfo({ avatar_file: file });

      // Backend should return the updated user object with new avatar URL
      dispatch(updateUser(updatedUserResponse.user)); // Assuming response has a 'user' field
      message.success(`${file.name} 文件上传成功。`);
    } catch (error) {
      message.error(error.message || '头像上传失败。');
    } finally {
      setUploading(false);
    }
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  const onPasswordFormFinish = async (values) => {
    console.log('Received password form values: ', values);
    try {
      setPasswordLoading(true);
      const response = await changePassword(values);
      message.success(response.message || '密码修改成功！请重新登录。');
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
      // Optionally redirect to login after password change for security
      // setTimeout(() => { dispatch(logout()); navigate('/login'); }, 1500);
    } catch (error) {
      message.error(error.message || '修改密码失败，请重试。');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* Left Column: Avatar and basic info */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ textAlign: 'center' }}>
            <Avatar size={128} icon={user.avatar ? <img src={user.avatar} alt="avatar" /> : <UserOutlined />} />
            
            {isEditing ? (
              <Upload showUploadList={false} customRequest={handleAvatarUpload} disabled={uploading}>
                 <Button icon={<UploadOutlined />} loading={uploading} style={{ margin: '16px 0' }}>
                    上传头像
                 </Button>
              </Upload>
            ) : null}

            {isEditing ? (
               <Form
                form={profileForm} // Use profileForm
                name="profile_edit"
                onFinish={onProfileFormFinish} // Use onProfileFormFinish
                initialValues={{ 
                  nickname: user.nickname, 
                  email: user.email,
                  favorite_game: user.profile?.favorite_game,
                  favorite_food: user.profile?.favorite_food,
                  favorite_animal: user.profile?.favorite_animal,
                  favorite_sport: user.profile?.favorite_sport,
                  favorite_color: user.profile?.favorite_color,
                  avatar_file: undefined, // Add avatar_file field to form, but don't initialize it
                 }}
                layout="vertical"
               >
                 <Form.Item
                   name="nickname"
                   label="昵称"
                   rules={[{ required: true, message: '请输入昵称' }]}
                 >
                   <Input />
                 </Form.Item>
                 <Form.Item
                   name="email"
                   label="邮箱"
                   rules={[
                     { type: 'email', message: '请输入有效的邮箱地址' },
                     { required: true, message: '请输入邮箱' }
                    ]}>
                   <Input />
                 </Form.Item>
                 {/* Add other editable fields */}
                 <Form.Item name="favorite_game" label="喜欢的游戏"><Input /></Form.Item>
                 <Form.Item name="favorite_food" label="喜欢的食物"><Input /></Form.Item>
                 <Form.Item name="favorite_animal" label="喜欢的动物"><Input /></Form.Item>
                 <Form.Item name="favorite_sport" label="喜欢的运动"><Input /></Form.Item>
                 <Form.Item name="favorite_color" label="喜欢的颜色"><Input /></Form.Item>

                 <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存
                    </Button>
                    <Button onClick={handleCancelClick}>取消</Button>
                 </Space>
               </Form>
            ) : (
               <>
                 <Title level={3} style={{ margin: '16px 0 4px 0' }}>{user.nickname || user.username}</Title>
                 <Text type="secondary">@{user.username}</Text>
                 
                 {/* Add bio if available */}
                 {user.bio && <Text style={{ display: 'block', margin: '16px 0' }}>{user.bio}</Text>}

                 <Button type="default" block style={{ margin: '16px 0' }} onClick={handleEditClick}>编辑个人资料</Button>
                 <Button type="link" block onClick={showPasswordModal}>修改密码</Button> {/* Added Change Password Button */}

                 {/* Additional profile links/info */}
                 <Space direction="vertical" style={{ width: '100%', marginTop: '16px' }}>
                   {user.location && (
                     <Space>
                       <EnvironmentOutlined />
                       <Text>{user.location}</Text>
                     </Space>
                   )}
                   {user.website && (
                     <Space>
                       <LinkOutlined />
                       <Text><a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a></Text>
                     </Space>
                   )}
                    {user.email && (
                     <Space>
                       <MailOutlined />
                       <Text>{user.email}</Text>
                     </Space>
                   )}
                   {user.date_joined && (
                     <Space>
                       <CalendarOutlined />
                       <Text>Joined on {moment(user.date_joined).format('MMM DD, YYYY')}</Text>
                     </Space>
                   )}
                    {user.last_login && (
                     <Space>
                       <ClockCircleOutlined />
                       <Text>Last login: {moment(user.last_login).format('YYYY-MM-DD HH:mm:ss')}</Text>
                     </Space>
                   )}
                 </Space>
               </>
            )}
          </Card>
        </Col>

        {/* Right Column: Partner Info and other sections */}
        <Col xs={24} md={16}>
           <Card title="伴侣信息" bordered={false}>
             {partnerInfo ? (
                <Space>
                  <HeartOutlined style={{ color: '#ff4d4f' }} />
                  <Text>已绑定伴侣: {partnerInfo.nickname || partnerInfo.username}</Text>
                </Space>
             ) : (
                <Text type="secondary">暂未绑定伴侣。</Text>
             )}
           </Card>

           {/* Profile Details Card */}
           <Card title="个人爱好" bordered={false} style={{ marginTop: '24px' }}>
              {user.profile ? (
                <Descriptions bordered column={1} size="small" key={JSON.stringify(user.profile)}>
                  <Descriptions.Item label={<Space><ThunderboltOutlined style={{ color: '#ff7a45' }} /> 喜欢的游戏</Space>}>{user.profile.favorite_game}</Descriptions.Item>
                  <Descriptions.Item label={<Space><AppleOutlined style={{ color: '#73d13c' }} /> 喜欢的食物</Space>}>{user.profile.favorite_food}</Descriptions.Item>
                  <Descriptions.Item label={<Space><SmileOutlined style={{ color: '#ffc53d' }} /> 喜欢的动物</Space>}>{user.profile.favorite_animal}</Descriptions.Item>
                  <Descriptions.Item label={<Space><TrophyOutlined style={{ color: '#1677ff' }} /> 喜欢的运动</Space>}>{user.profile.favorite_sport}</Descriptions.Item>
                  <Descriptions.Item label={<Space><StarOutlined style={{ color: '#f75959' }} /> 喜欢的颜色</Space>}>{user.profile.favorite_color}</Descriptions.Item>
                </Descriptions>
              ) : (
                 <Text type="secondary">暂无爱好信息。</Text>
              )}
           </Card>
        </Col>
      </Row>
      
      {/* Change Password Modal */}
      <Modal
        title="修改密码"
        visible={isPasswordModalVisible}
        onCancel={handlePasswordModalCancel}
        footer={null} // Hide default footer buttons
      >
        <Form
          form={passwordForm} // Use passwordForm
          name="change_password"
          onFinish={onPasswordFormFinish} // Use onPasswordFormFinish
          layout="vertical"
        >
          <Form.Item
            name="old_password"
            label="旧密码"
            rules={[{ required: true, message: '请输入旧密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少需要6位' }, // Example rule
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="确认新密码"
            dependencies={['new_password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={passwordLoading} block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile; 