import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Modal, Typography, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { bindPartner, unbindPartner } from '../../api/auth';
import { setPartnerInfo, removePartner } from '../../redux/slices/authSlice';
import { HeartOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BindPartner = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user, partnerInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await bindPartner(values.partnerUsername);
      dispatch(setPartnerInfo(response.partner));
      message.success(response.message || '绑定伴侣成功！');
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