import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Modal, Typography, Space, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { bindPartner, unbindPartner, getUserInfo } from '../../api/auth';
import { setPartnerInfo, removePartner, updateUser } from '../../redux/slices/authSlice';
import { HeartOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getLoveSettings, updateLoveSettings } from '../../api/loveSettings';

const { Title, Text } = Typography;

const BindPartner = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user, partnerInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // 1. 先绑定伴侣
      const response = await bindPartner(values.partnerUsername);
      dispatch(setPartnerInfo(response.partner));
      message.success(response.message || '绑定伴侣成功！');
      // 2. 绑定成功后自动创建/更新情侣空间
      try {
        await updateLoveSettings({
          couple_name: values.coupleName,
          start_date: values.startDate ? values.startDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
        });
        message.success('情侣空间已创建！可前往纪念日页面设置更多内容~');
      } catch (e) {
        message.warning('情侣空间自动创建失败，请稍后在情侣空间设置页面手动补充');
      }
      // 3. 绑定后自动刷新用户信息，保证界面立即更新
      try {
        const userInfo = await getUserInfo();
        dispatch(updateUser(userInfo.user));
      } catch {}
      form.resetFields();
    } catch (error) {
      message.error(error.error || '绑定失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const showUnbindConfirm = () => {
    Modal.confirm({
      title: '解除绑定',
      content: '确定要解除与伴侣的绑定吗？这将影响数据共享。',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await unbindPartner();
          dispatch(removePartner());
          message.success(response.message || '已解除绑定');
          // 解绑后自动刷新用户信息，保证界面立即更新
          try {
            const userInfo = await getUserInfo();
            dispatch(updateUser(userInfo.user));
          } catch {}
        } catch (error) {
          message.error(error.error || '解除绑定失败');
        }
      },
    });
  };

  return (
    <div className="form-container">
      <Card title="伴侣绑定" bordered={false}>
        {partnerInfo ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <HeartOutlined style={{ color: '#ff4d4f' }} /> 当前已绑定伴侣
              </Title>
              <Space direction="vertical">
                <Text>用户名：{partnerInfo.username}</Text>
                {partnerInfo.nickname && <Text>昵称：{partnerInfo.nickname}</Text>}
              </Space>
            </div>
            <Button 
              type="primary" 
              danger 
              icon={<CloseCircleOutlined />}
              onClick={showUnbindConfirm}
            >
              解除绑定
            </Button>
          </Space>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>绑定伴侣</Title>
              <Text type="secondary">
                绑定伴侣后，你们可以共享日记、照片、音乐等数据。
              </Text>
            </div>
            <Form
              form={form}
              name="bindPartner"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="partnerUsername"
                label="伴侣用户名"
                rules={[
                  { required: true, message: '请输入伴侣的用户名' },
                  { 
                    validator: (_, value) => {
                      if (value === user?.username) {
                        return Promise.reject('不能绑定自己为伴侣');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="请输入伴侣的用户名" />
              </Form.Item>
              <Form.Item
                name="coupleName"
                label="情侣名称"
                rules={[{ required: true, message: '请输入情侣名称' }]}
              >
                <Input placeholder="请输入情侣名称" maxLength={20} />
              </Form.Item>
              <Form.Item
                name="startDate"
                label="在一起的日期"
                rules={[{ required: true, message: '请选择在一起的日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<HeartOutlined />}
                >
                  绑定伴侣
                </Button>
              </Form.Item>
            </Form>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default BindPartner; 