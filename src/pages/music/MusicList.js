import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Popconfirm, message, Tag, Tooltip, Avatar } from 'antd';
import { PlayCircleOutlined, HeartOutlined, DeleteOutlined, SearchOutlined, ClockCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axios';

const MusicList = ({ mode = 'all', playlistId, onPlay, currentMusic, isPlaying }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  // 获取音乐列表
  const fetchMusic = async () => {
    setLoading(true);
    try {
      let url = '/music/';
      let params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (mode === 'favorite') url = '/music/favorites/';
      if (mode === 'recent') url = '/music/history/';
      if (mode === 'playlist' && playlistId) url = `/playlists/${playlistId}/`;
      const res = await axiosInstance.get(url, { params });
      // 兼容不同返回结构
      let list = res.musics || res.data?.musics || res.data || res;
      if (Array.isArray(list.results)) list = list.results;
      setData(Array.isArray(list) ? list : []);
      setTotal(res.total || res.data?.total || 0);
    } catch {
      message.error('获取音乐列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic();
    // eslint-disable-next-line
  }, [mode, playlistId, page, pageSize, search]);

  // 操作：播放、收藏、删除
  const handlePlay = (record) => {
    if (onPlay) onPlay(record);
  };
  const handleFavorite = async (record) => {
    try {
      await axiosInstance.post(`/music/${record.id}/favorite/`);
      message.success('操作成功');
      fetchMusic();
    } catch {
      message.error('操作失败');
    }
  };
  const handleDelete = async (record) => {
    try {
      await axiosInstance.delete(`/music/${record.id}/`);
      message.success('已删除');
      fetchMusic();
    } catch {
      message.error('删除失败');
    }
  };

  // 表格列
  const columns = [
    {
      title: '',
      dataIndex: 'cover_url',
      width: 60,
      render: (url) => url ? <Avatar shape="square" size={48} src={url} icon={<FileImageOutlined />} /> : <Avatar shape="square" size={48} icon={<FileImageOutlined />} />,
    },
    {
      title: '歌曲名',
      dataIndex: 'title',
      render: (text, record) => <Tooltip title={text}><span style={{ fontWeight: 500 }}>{text}</span></Tooltip>,
    },
    {
      title: '歌手',
      dataIndex: 'artist',
      width: 120,
      render: (text) => <span>{text}</span>,
    },
    {
      title: '分类',
      dataIndex: 'category_name',
      width: 80,
      render: (cat) => cat ? <Tag color="blue">{cat}</Tag> : null,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      width: 80,
      render: (d) => d ? `${Math.floor(d/60)}:${(d%60).toString().padStart(2,'0')}` : '--',
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      width: 140,
      render: (t) => t ? <span style={{ color: '#888' }}>{t.slice(0,16).replace('T',' ')}</span> : '',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<PlayCircleOutlined />} type={currentMusic && currentMusic.id === record.id && isPlaying ? 'primary' : 'text'} onClick={() => handlePlay(record)} />
          <Button icon={<HeartOutlined />} type="text" onClick={() => handleFavorite(record)} />
          <Popconfirm title="确定删除该音乐吗？" onConfirm={() => handleDelete(record)} okText="删除" cancelText="取消">
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Input
          placeholder="搜索歌曲/歌手"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ width: 240, borderRadius: 8 }}
          allowClear
        />
        <span style={{ color: '#888', marginLeft: 16 }}>
          共 {total} 首
        </span>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
          showTotal: t => `共 ${t} 首音乐`,
        }}
        size="middle"
        bordered={false}
        style={{ background: 'white', borderRadius: 12 }}
        rowClassName={record => currentMusic && currentMusic.id === record.id ? 'music-row-playing' : ''}
      />
    </div>
  );
};

export default MusicList; 