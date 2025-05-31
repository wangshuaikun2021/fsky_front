import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getDiaryDetail } from '../../api/diary';
import styles from './DiaryEdit.module.css';
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';
import { useSelector } from 'react-redux';

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diary, setDiary] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getDiaryDetail(id);
        setDiary(res);
      } catch (e) {
        message.error('获取日记详情失败');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (diary) {
      document.querySelectorAll('.mdPreviewWrap pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [diary]);

  if (loading) return <Spin style={{ margin: '80px auto', display: 'block' }} />;
  if (!diary) return null;

  return (
    <div className={styles.mainLayoutSimple}>
      <div style={{ maxWidth: 1000, width:'100%', margin: '-23px auto', background: '#fff', borderRadius: 12, padding: '24px 32px', boxShadow:'0 2px 12px 0 rgb(0, 0, 0, 0.06)', height: 'calc(100vh - 100px)', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: '#fff', paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: 12 }}>
              返回
            </Button>
            {user && diary.author === user.username && (
              <Button type="primary" onClick={() => navigate(`/diary/edit/${id}`)} style={{ marginRight: 12 }}>
                编辑
              </Button>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, height: '100%' }}>
          <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 12 }}>{diary.title}</h1>
          <div style={{ color: '#888', marginBottom: 8 }}>{diary.created_at}</div>
          {diary.category && <Tag color="blue" style={{ marginBottom: 8 }}>{diary.category}</Tag>}
          <div style={{ marginBottom: 16 }}>
            {diary.tags && diary.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <div className={styles.mdPreviewWrap} dangerouslySetInnerHTML={{ __html: diary.content }} />
        </div>
      </div>
    </div>
  );
};

export default DiaryDetail; 