import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message, Select, Space, Modal, Popconfirm } from 'antd';
import { UploadOutlined, InboxOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axios';

const { Dragger } = Upload;
const { Option } = Select;

const MusicForm = ({ onSuccess, currentPlaylistId }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [coverList, setCoverList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catModalType, setCatModalType] = useState('add'); // add/edit
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [editingCat, setEditingCat] = useState(null);

  // 获取分类
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/music/categories/');
      setCategories(res || []);
    } catch {
      message.error('获取分类失败');
    }
  };
  useEffect(() => { fetchCategories(); }, []);

  // 新建分类
  const handleAddCat = () => {
    setCatModalType('add');
    setCatName('');
    setCatDesc('');
    setEditingCat(null);
    setCatModalOpen(true);
  };
  const handleEditCat = (cat) => {
    setCatModalType('edit');
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setEditingCat(cat);
    setCatModalOpen(true);
  };
  const handleDeleteCat = async (cat) => {
    try {
      await axiosInstance.delete(`/music/categories/${cat.id}/`);
      message.success('删除成功');
      fetchCategories();
    } catch {
      message.error('删除失败');
    }
  };
  const handleCatModalOk = async () => {
    if (!catName.trim()) { message.error('请输入分类名'); return; }
    try {
      if (catModalType === 'add') {
        await axiosInstance.post('/music/categories/', { name: catName, description: catDesc });
        message.success('分类创建成功');
      } else {
        await axiosInstance.put(`/music/categories/${editingCat.id}/`, { name: catName, description: catDesc });
        message.success('分类修改成功');
      }
      setCatModalOpen(false);
      fetchCategories();
    } catch {
      message.error('操作失败');
    }
  };

  // 上传音乐文件
  const handleMusicUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axiosInstance.post('/music/upload/', formData);
      return res.file_url;
    } catch {
      message.error('音乐文件上传失败');
      return null;
    }
  };

  // 上传封面
  const handleCoverUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axiosInstance.post('/music/upload-cover/', formData);
      return res.cover_url;
    } catch {
      message.error('封面上传失败');
      return null;
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error('请上传音乐文件');
      return;
    }

    setUploading(true);
    try {
      // 1. 上传音乐文件
      const fileUrl = await handleMusicUpload(fileList[0].originFileObj);
      if (!fileUrl) return;

      // 2. 上传封面（如果有）
      let coverUrl = null;
      if (coverList.length > 0) {
        coverUrl = await handleCoverUpload(coverList[0].originFileObj);
      }

      // 3. 创建音乐记录
      const musicData = {
        ...values,
        file_url: fileUrl,
        cover_url: coverUrl,
      };
      const res = await axiosInstance.post('/music/', musicData);
      message.success('上传成功');

      // 4. 如果当前在歌单模式下，自动添加到歌单
      if (currentPlaylistId && res.id) {
        try {
          await axiosInstance.post(`/playlists/${currentPlaylistId}/music/${res.id}/`);
          message.success('已添加到当前歌单');
        } catch (err) {
          console.error('添加到歌单失败:', err);
        }
      }

      onSuccess();
      form.resetFields();
      setFileList([]);
      setCoverList([]);
    } catch (err) {
      console.error('提交失败:', err);
      message.error('提交失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="title"
        label="歌曲名"
        rules={[{ required: true, message: '请输入歌曲名' }]}
      >
        <Input placeholder="请输入歌曲名" />
      </Form.Item>

      <Form.Item
        name="artist"
        label="歌手"
        rules={[{ required: true, message: '请输入歌手' }]}
      >
        <Input placeholder="请输入歌手" />
      </Form.Item>

      <Form.Item
        name="category"
        label={<span>分类 <Button size="small" icon={<PlusOutlined />} type="link" onClick={handleAddCat}>管理</Button></span>}
        rules={[]}
      >
        <Select placeholder="请选择分类（可不选）" allowClear dropdownRender={menu => (
          <>
            {menu}
            <div style={{ padding: 8, borderTop: '1px solid #eee' }}>
              {categories.map(cat => (
                <Space key={cat.id} style={{ marginRight: 8 }}>
                  <Button size="small" icon={<EditOutlined />} onClick={() => handleEditCat(cat)} />
                  <Popconfirm title="确定删除该分类吗？" onConfirm={() => handleDeleteCat(cat)} okText="删除" cancelText="取消">
                    <Button size="small" icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                  <span>{cat.name}</span>
                  {cat.description && <InfoCircleOutlined title={cat.description} style={{ color: '#aaa' }} />}
                </Space>
              ))}
            </div>
          </>
        )}>
          {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item label="音乐文件" required>
        <Dragger
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
          accept=".mp3,.wav,.ogg"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 mp3、wav、ogg 格式</p>
        </Dragger>
      </Form.Item>

      <Form.Item label="封面图片">
        <Upload
          fileList={coverList}
          onChange={({ fileList }) => setCoverList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
          accept="image/*"
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>上传封面</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading} block>
          提交
        </Button>
      </Form.Item>

      <Modal
        title={catModalType === 'add' ? '新建分类' : '编辑分类'}
        open={catModalOpen}
        onOk={handleCatModalOk}
        onCancel={() => setCatModalOpen(false)}
        okText={catModalType === 'add' ? '创建' : '保存'}
        cancelText="取消"
        destroyOnClose
      >
        <Input value={catName} onChange={e => setCatName(e.target.value)} maxLength={20} placeholder="请输入分类名称" style={{ marginBottom: 12 }} />
        <Input.TextArea value={catDesc} onChange={e => setCatDesc(e.target.value)} maxLength={100} placeholder="分类描述（可选）" rows={3} />
      </Modal>
    </Form>
  );
};

export default MusicForm; 