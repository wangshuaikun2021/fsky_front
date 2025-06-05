import React, { useEffect, useState } from 'react';
import { Menu, Button, Modal, Input, message, Dropdown, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOpenOutlined, MoreOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axios';

const PlaylistMenu = ({ selectedKey, onSelect, onPlaylistsChange }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // add/edit
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistName, setPlaylistName] = useState('');

  // 获取歌单列表
  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/playlists/');
      const list = Array.isArray(res) ? res : (res.data || res.playlists || []);
      setPlaylists(list);
      if (onPlaylistsChange) onPlaylistsChange(list);
    } catch {
      message.error('获取歌单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line
  }, []);

  // 新建歌单
  const handleAdd = () => {
    setModalType('add');
    setPlaylistName('');
    setModalOpen(true);
  };
  const handleAddSubmit = async () => {
    if (!playlistName.trim()) {
      message.error('请输入歌单名称');
      return;
    }
    try {
      await axiosInstance.post('/playlists/', { name: playlistName });
      message.success('歌单创建成功');
      setModalOpen(false);
      fetchPlaylists();
    } catch {
      message.error('歌单创建失败');
    }
  };

  // 编辑歌单
  const handleEdit = (playlist) => {
    setModalType('edit');
    setCurrentPlaylist(playlist);
    setPlaylistName(playlist.name);
    setModalOpen(true);
  };
  const handleEditSubmit = async () => {
    if (!playlistName.trim()) {
      message.error('请输入歌单名称');
      return;
    }
    try {
      await axiosInstance.put(`/playlists/${currentPlaylist.id}/`, { name: playlistName });
      message.success('歌单重命名成功');
      setModalOpen(false);
      fetchPlaylists();
    } catch {
      message.error('歌单重命名失败');
    }
  };

  // 删除歌单
  const handleDelete = async (playlist) => {
    try {
      await axiosInstance.delete(`/playlists/${playlist.id}/`);
      message.success('歌单已删除');
      fetchPlaylists();
    } catch {
      message.error('删除失败');
    }
  };

  // 歌单菜单项
  const playlistMenuItems = playlists.map((pl) => ({
    key: `playlist_${pl.id}`,
    icon: <FolderOpenOutlined />,
    label: (
      <Space>
        <span style={{ maxWidth: 90, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }}>{pl.name}</span>
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: '重命名',
                onClick: () => handleEdit(pl),
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: (
                  <Popconfirm title="确定删除该歌单吗？" onConfirm={() => handleDelete(pl)} okText="删除" cancelText="取消">
                    删除
                  </Popconfirm>
                ),
              },
            ],
          }}
        >
          <Button type="text" size="small" icon={<MoreOutlined />} style={{ marginLeft: 2 }} />
        </Dropdown>
      </Space>
    ),
  }));

  return (
    <>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => onSelect && onSelect(key)}
        style={{ borderRight: 0, fontSize: 16, minHeight: 200, background: 'transparent' }}
        items={playlistMenuItems}
      />
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        style={{ marginTop: 12, borderRadius: 8 }}
        onClick={handleAdd}
      >
        新建歌单
      </Button>
      <Modal
        title={modalType === 'add' ? '新建歌单' : '重命名歌单'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={modalType === 'add' ? handleAddSubmit : handleEditSubmit}
        okText={modalType === 'add' ? '创建' : '保存'}
        cancelText="取消"
        destroyOnClose
      >
        <Input
          value={playlistName}
          onChange={e => setPlaylistName(e.target.value)}
          maxLength={30}
          placeholder="请输入歌单名称"
        />
      </Modal>
    </>
  );
};

export default PlaylistMenu; 