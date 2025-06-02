import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, List, Spin, Typography, message, Button, Popconfirm, Input, Pagination, Row, Col, Tag } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { getDiaries, deleteDiary } from '../../api/diary';
import { fetchDiariesStart, fetchDiariesSuccess, fetchDiariesFailure } from '../../redux/slices/diarySlice';

const { Title, Text } = Typography;
const { Search } = Input;

const DiaryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 本地分页与搜索状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [diaryData, setDiaryData] = useState({ diaries: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  // 拉取数据
  const fetchData = async (params = {}) => {
    setLoading(true);
    setError(null);
      try {
      const data = await getDiaries({ page, page_size: pageSize, search, ...params });
      setDiaryData(data);
      } catch (err) {
      setError(err.message);
        message.error(err.message);
    } finally {
      setLoading(false);
      }
    };

  // 首次和依赖变化时拉取
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, pageSize, search]);

  // 删除日记
  const handleDelete = async (id) => {
    try {
      await deleteDiary(id);
      message.success('删除成功');
      fetchData();
    } catch (e) {
      message.error('删除失败');
    }
  };

  // 搜索
  const handleSearch = (val) => {
    setPage(1);
    setSearch(val.trim());
  };

  // 分页
  const handlePageChange = (p, ps) => {
    setPage(p);
    setPageSize(ps);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '-22px auto', background: '#fff', borderRadius: 12, padding: '20px 24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>日记列表</Title></Col>
        <Col><Button type="primary" onClick={() => navigate('/diary/edit')}>写日记</Button></Col>
      </Row>
      <Row style={{ marginBottom: 8 }}>
        <Col flex="1 1 300px">
          <Search
            placeholder="搜索标题/内容..."
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </Col>
      </Row>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spin size="large" tip="加载日记中..." />
        </div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>{error}</div>
      ) : (
        <>
      <List
            itemLayout="vertical"
            dataSource={diaryData.diaries}
            locale={{ emptyText: '暂无日记' }}
        renderItem={item => (
          <List.Item
                key={item.id}
                style={{ padding: '18px 0', borderBottom: '1px solid #f0f0f0' }}
            actions={[
                  <Button type="link" onClick={() => navigate(`/diary/detail/${item.id}`)} key="view">查看</Button>,
                  user && item.author === user.username && (
              <Button type="link" onClick={() => navigate(`/diary/edit/${item.id}`)} key="edit">编辑</Button>
                  ),
                  user && item.author === user.username && (
                    <Popconfirm title="确定要删除这篇日记吗？" onConfirm={() => handleDelete(item.id)} okText="删除" cancelText="取消">
                      <Button type="link" danger key="delete">删除</Button>
                    </Popconfirm>
                  )
                ].filter(Boolean)}
          >
            <List.Item.Meta
                  title={<span style={{ fontWeight: 600, fontSize: 18, cursor: 'pointer' }} onClick={() => navigate(`/diary/detail/${item.id}`)}>{item.title}</span>}
              description={
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
                      <Text type="secondary">{item.created_at ? moment(item.created_at).format('YYYY-MM-DD HH:mm') : ''}</Text>
                      {item.tags && item.tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                    </div>
              }
            />
                {item.summary && <div style={{ color: '#666', marginTop: 4, fontSize: 15 }}>{item.summary}</div>}
          </List.Item>
        )}
      />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={diaryData.total}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50]}
              onChange={handlePageChange}
              showTotal={t => `共 ${t} 条`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DiaryList; 