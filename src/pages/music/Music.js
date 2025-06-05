import React, { useState } from 'react';
import { Layout, Menu, Button, Modal, Card, Divider, Typography, Space, Slider, Collapse } from 'antd';
import {
  CustomerServiceOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import MusicForm from './MusicForm';
import PlaylistMenu from './PlaylistMenu';
import MusicList from './MusicList';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const Music = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('all');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]); // 歌单列表
  const [currentMusic, setCurrentMusic] = useState(null); // 当前播放音乐
  const [isPlaying, setIsPlaying] = useState(false); // 播放状态
  const audioRef = React.useRef(null);
  const [audioProgress, setAudioProgress] = useState(0); // 当前进度（秒）
  const [audioDuration, setAudioDuration] = useState(0); // 总时长（秒）
  const [audioVolume, setAudioVolume] = useState(1); // 音量 0-1
  const [detailCollapsed, setDetailCollapsed] = useState(true);

  // 左侧固定菜单项
  const menuItems = [
    { key: 'all', icon: <UnorderedListOutlined />, label: '全部音乐' },
    { key: 'favorite', icon: <HeartOutlined />, label: '我的收藏' },
    { key: 'recent', icon: <ClockCircleOutlined />, label: '最近播放' },
  ];

  // 处理左侧菜单和歌单切换
  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
    setSelectedPlaylist(null);
  };
  const handlePlaylistSelect = (key) => {
    setSelectedMenu(key);
    if (key.startsWith('playlist_')) {
      setSelectedPlaylist(key);
    } else {
      setSelectedPlaylist(null);
    }
  };

  // 获取当前选中歌单名
  let currentPlaylistName = '';
  let currentPlaylistId = null;
  if (selectedPlaylist && playlists.length > 0) {
    const id = Number(selectedPlaylist.replace('playlist_', ''));
    const found = playlists.find(pl => pl.id === id);
    if (found) {
      currentPlaylistName = found.name;
      currentPlaylistId = found.id;
    }
  }

  // 计算当前模式
  let musicListMode = 'all';
  if (selectedMenu === 'favorite') musicListMode = 'favorite';
  else if (selectedMenu === 'recent') musicListMode = 'recent';
  else if (selectedPlaylist) musicListMode = 'playlist';

  // 自动补全file_url为完整后端地址
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return 'http://127.0.0.1:8000' + url;
  };

  // 播放/暂停控制
  const handlePlayMusic = (music) => {
    if (!currentMusic || music.id !== currentMusic.id) {
      setCurrentMusic(music);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play();
      }, 0);
    } else {
      // 切换播放/暂停
      if (isPlaying) {
        audioRef.current && audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current && audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // 音频播放/暂停事件同步状态
  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioEnded = () => setIsPlaying(false);

  // 进度与音量事件
  const handleTimeUpdate = () => {
    if (audioRef.current) setAudioProgress(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) setAudioDuration(audioRef.current.duration);
  };
  const handleSeek = (val) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setAudioProgress(val);
    }
  };
  const handleVolumeChange = (val) => {
    setAudioVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  // 时间格式化
  const formatTime = (s) => {
    if (!s) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fce7f3 0%, #fbc2eb 100%)' }}>
      {/* 左侧导航栏 */}
      <Sider width={220} style={{ background: 'white', boxShadow: '2px 0 8px #f0f1f2', zIndex: 2 }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#40a9ff', letterSpacing: 2 }}>
          <CustomerServiceOutlined style={{ marginRight: 8 }} />音乐库
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={({ key }) => handleMenuSelect(key)}
          style={{ borderRight: 0, fontSize: 16, minHeight: 120, background: 'transparent' }}
          items={menuItems}
        />
        <Divider style={{ margin: '12px 0' }}>歌单</Divider>
        <PlaylistMenu selectedKey={selectedPlaylist} onSelect={handlePlaylistSelect} onPlaylistsChange={setPlaylists} />
      </Sider>

      {/* 右侧内容区：上下布局 */}
      <Layout>
        <Content style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'transparent', padding: 0 }}>
          {/* 音乐内容区 */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '32px 24px 0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#222', marginRight: 16 }}>
                {selectedMenu === 'all' && '全部音乐'}
                {selectedMenu === 'favorite' && '我的收藏'}
                {selectedMenu === 'recent' && '最近播放'}
                {selectedPlaylist && currentPlaylistName}
              </span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginLeft: 'auto', borderRadius: 8, background: 'linear-gradient(45deg, #d63384, #40a9ff)' }}
                onClick={() => setUploadModalOpen(true)}
              >
                上传音乐
              </Button>
            </div>
            <MusicList mode={musicListMode} playlistId={currentPlaylistId} onPlay={handlePlayMusic} currentMusic={currentMusic} isPlaying={isPlaying} />
          </div>
          {/* 播放器条（内容区底部） */}
          <div style={{
            height: 80, background: '#fff', boxShadow: '0 -2px 16px #eee', zIndex: 9,
            display: 'flex', alignItems: 'center', padding: '0 32px',
          }}>
            {currentMusic ? (
              <>
                {/* 封面 */}
                {currentMusic.cover_url ? (
                  <img src={currentMusic.cover_url} alt="cover" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee', marginRight: 16 }} />
                ) : (
                  <div style={{ width: 56, height: 56, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 28, marginRight: 16 }}>
                    <CustomerServiceOutlined />
                  </div>
                )}
                {/* 歌名/歌手 */}
                <div style={{ minWidth: 120, maxWidth: 220, marginRight: 24, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentMusic.title}</div>
                  <div style={{ color: '#888', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentMusic.artist}</div>
                </div>
                {/* 播放/暂停 */}
                <Button
                  type="primary"
                  shape="circle"
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  size="large"
                  onClick={() => handlePlayMusic(currentMusic)}
                  style={{ marginRight: 16 }}
                />
                {/* 进度条+时间 */}
                <span style={{ width: 48, textAlign: 'right', color: '#888', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{formatTime(audioProgress)}</span>
                <Slider
                  min={0}
                  max={audioDuration || 1}
                  value={audioProgress}
                  onChange={handleSeek}
                  step={1}
                  style={{ width: 320, margin: '0 12px' }}
                  tooltip={{ open: false }}
                />
                <span style={{ width: 48, textAlign: 'left', color: '#888', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{formatTime(audioDuration)}</span>
                {/* 音量 */}
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 32 }}>
                  <span style={{ color: '#888', marginRight: 4 }}><CustomerServiceOutlined /></span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={audioVolume}
                    onChange={handleVolumeChange}
                    style={{ width: 80 }}
                    tooltip={{ open: false }}
                  />
                </div>
                {/* 隐藏audio标签 */}
                <audio
                  ref={audioRef}
                  src={getFullUrl(currentMusic.file_url)}
                  controls={false}
                  autoPlay={isPlaying}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                  onEnded={handleAudioEnded}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  style={{ display: 'none' }}
                />
              </>
            ) : (
              <div style={{ color: '#bbb', textAlign: 'center', width: '100%' }}>
                暂无正在播放的音乐
              </div>
            )}
          </div>
        </Content>
      </Layout>

      {/* 上传音乐弹窗 */}
      <Modal
        title="上传音乐"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
        destroyOnClose
        width={420}
      >
        <MusicForm onSuccess={() => setUploadModalOpen(false)} currentPlaylistId={currentPlaylistId} />
      </Modal>
    </Layout>
  );
};

export default Music; 