import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Form, Input, DatePicker, List, message, Popconfirm, Space, Pagination } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined, PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getAnniversaries, addAnniversary, updateAnniversary, deleteAnniversary } from '../../api/anniversary';
import { updateLoveSettingsPut } from '../../api/loveSettings';
import { updateLoveSettings, setLoveSettingsLoading } from '../../redux/slices/authSlice';

// 严格按照原项目的浪漫心形花朵组件
const HeartFlower = ({ children }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const gardenRef = useRef(null);
  const bloomsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 520;
    const height = canvas.height = 520;
    const offsetX = width / 2;
    const offsetY = height / 2 - 5;

    // 严格按照原项目的 Vector 类
    function Vector(x, y) {
      this.x = x;
      this.y = y;
    }

    Vector.prototype = {
      rotate: function (angle) {
        const x = this.x;
        const y = this.y;
        this.x = Math.cos(angle) * x - Math.sin(angle) * y;
        this.y = Math.sin(angle) * x + Math.cos(angle) * y;
        return this;
      },
      mult: function (scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
      },
      clone: function () {
        return new Vector(this.x, this.y);
      },
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
      },
      set: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
      }
    };

    // 严格按照原项目的 Petal 类
    function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
      this.stretchA = stretchA;
      this.stretchB = stretchB;
      this.startAngle = startAngle;
      this.angle = angle;
      this.bloom = bloom;
      this.growFactor = growFactor;
      this.r = 1;
      this.isfinished = false;
    }

    Petal.prototype = {
      draw: function () {
        const ctx = this.bloom.garden.ctx;
        let e, d, c, b;
        e = new Vector(0, this.r).rotate((this.startAngle * Math.PI) / 180);
        d = e.clone().rotate((this.angle * Math.PI) / 180);
        c = e.clone().mult(this.stretchA);
        b = d.clone().mult(this.stretchB);
        ctx.strokeStyle = this.bloom.c;
        ctx.lineWidth = 1.5; // 增加线条粗细
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.bezierCurveTo(c.x, c.y, b.x, b.y, d.x, d.y);
        ctx.stroke();
      },
      render: function () {
        if (this.r <= this.bloom.r) {
          this.r += this.growFactor;
          this.draw();
        } else {
          this.isfinished = true;
        }
      }
    };

    // 严格按照原项目的 Bloom 类
    function Bloom(p, r, c, pc, garden) {
      this.p = p;
      this.r = r;
      this.c = c;
      this.pc = pc;
      this.petals = [];
      this.garden = garden;
      this.init();
      this.garden.addBloom(this);
    }

    Bloom.prototype = {
      draw: function () {
        let c, b = true;
        this.garden.ctx.save();
        this.garden.ctx.translate(this.p.x, this.p.y);
        for (let a = 0; a < this.petals.length; a++) {
          c = this.petals[a];
          c.render();
          b *= c.isfinished;
        }
        this.garden.ctx.restore();
        if (b === true) {
          this.garden.removeBloom(this);
        }
      },
      init: function () {
        const c = 360 / this.pc;
        const b = Math.floor(Math.random() * 90);
        for (let a = 0; a < this.pc; a++) {
          this.petals.push(new Petal(
            0.2 + Math.random() * 2.0, // 增大花瓣大小
            0.2 + Math.random() * 2.0,
            b + a * c,
            c,
            0.15 + Math.random() * 0.8, // 增加生长速度
            this
          ));
        }
      }
    };

    // 严格按照原项目的 Garden 类
    function Garden(ctx, canvas) {
      this.blooms = [];
      this.element = canvas;
      this.ctx = ctx;
    }

    Garden.prototype = {
      render: function () {
        for (let a = 0; a < this.blooms.length; a++) {
          this.blooms[a].draw();
        }
      },
      addBloom: function (bloom) {
        this.blooms.push(bloom);
      },
      removeBloom: function (bloom) {
        for (let c = 0; c < this.blooms.length; c++) {
          if (this.blooms[c] === bloom) {
            this.blooms.splice(c, 1);
            return this;
          }
        }
      },
      createRandomBloom: function (x, y) {
        this.createBloom(
          x, y,
          7 + Math.floor(Math.random() * 4), // 增大花朵半径 7-10
          this.randomrgba(128, 255, 0, 128, 0, 128, 0.2), // 增加透明度让花朵更明显
          8 + Math.floor(Math.random() * 7) // 增加花瓣数量 8-14
        );
      },
      createBloom: function (x, y, r, c, pc) {
        new Bloom(new Vector(x, y), r, c, pc, this);
      },
      clear: function () {
        this.blooms = [];
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
      },
      randomrgba: function (rmin, rmax, gmin, gmax, bmin, bmax, opacity) {
        const r = Math.round(rmin + Math.random() * (rmax - rmin));
        const g = Math.round(gmin + Math.random() * (gmax - gmin));
        const b = Math.round(bmin + Math.random() * (bmax - bmin));
        return `rgba(${r},${g},${b},${opacity})`;
      }
    };

    // 优化心形路径计算，确保完全显示
    function getHeartPoint(c) {
      const b = c / Math.PI;
      const scale = 0.8; // 稍微增大心形，充分利用空间
      const a = scale * 19.5 * (16 * Math.pow(Math.sin(b), 3));
      const d = scale * -20 * (13 * Math.cos(b) - 5 * Math.cos(2 * b) - 2 * Math.cos(3 * b) - Math.cos(4 * b));
      return [offsetX + a, offsetY + d];
    }

    // 初始化花园
    ctx.globalCompositeOperation = "lighter";
    const garden = new Garden(ctx, canvas);
    gardenRef.current = garden;

    // 严格按照原项目的心形动画 - 修改为立即显示
    function startHeartAnimation() {
      const heartPoints = [];
      
      // 一次性生成所有心形花朵，不再使用延时动画
      for (let angle = 10; angle <= 30; angle += 0.2) {
        const h = getHeartPoint(angle);
        let canCreate = true;
        
        for (let f = 0; f < heartPoints.length; f++) {
          const g = heartPoints[f];
          const distance = Math.sqrt(Math.pow(g[0] - h[0], 2) + Math.pow(g[1] - h[1], 2));
          if (distance < 8 * 1.3) { // 减少间距让花朵更密集
            canCreate = false;
            break;
          }
        }
        
        if (canCreate) {
          heartPoints.push(h);
          garden.createRandomBloom(h[0], h[1]);
        }
      }
    }

    // 动画渲染循环
    const animate = () => {
      garden.render();
      animationRef.current = requestAnimationFrame(animate);
    };

    // 立即启动心形动画，不再延迟
    startHeartAnimation();

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: 520, 
      height: 510,
      margin: '0 auto',
      padding: '10px', // 添加内边距确保不被裁切
      // 去掉所有背景和过渡效果
    }}>
      <canvas 
        ref={canvasRef}
        width={520}
        height={490}
        style={{ 
          position: 'absolute', 
          top: '10px',  // 对应padding
          left: '10px', // 对应padding
          // 去掉圆角
        }}
      />
      <div style={{ 
        position: 'absolute', 
        top: '60%', // 改为正中央
        left: '52%', 
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', 
        zIndex: 10,
        padding: '10px',
        maxWidth: '300px', // 稍微增加文字宽度
        // 去掉所有背景色和效果，直接展示文字
      }}>
        {children}
      </div>
    </div>
  );
};

// 优化时间计算函数，支持更详细的显示
function getDiff(startDate, mode = 'day') {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now - start;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  const weeks = Math.floor(totalDays / 7);
  const remainingDaysFromWeeks = totalDays % 7;
  
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const remainingDaysFromMonths = totalDays - Math.floor((months * 365.25) / 12);
  
  const years = now.getFullYear() - start.getFullYear() - (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate()) ? 1 : 0);
  const remainingMonthsFromYears = months - (years * 12);
  const remainingDaysFromYears = totalDays - Math.floor((years * 365.25));
  
  return { 
    days: totalDays, 
    hours, 
    minutes, 
    seconds, 
    weeks, 
    remainingDaysFromWeeks,
    months, 
    remainingDaysFromMonths,
    years,
    remainingMonthsFromYears,
    remainingDaysFromYears
  };
}

const Anniversary = () => {
  const dispatch = useDispatch();
  
  // 从Redux全局状态获取恋爱设置和用户信息
  const { loveSettings, loveSettingsLoading, user, partnerInfo } = useSelector(state => state.auth);
  const [settingsModal, setSettingsModal] = useState(false);
  const [settingsForm] = Form.useForm();

  // 纪念日列表
  const [anniversaries, setAnniversaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm] = Form.useForm();
  const [editing, setEditing] = useState(null);

  // 分页和搜索相关
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // 每页显示5条

  // 计时器相关 - 添加更多安全检查
  const startDate = loveSettings?.start_date;
  const [mode, setMode] = useState('day');
  const [diff, setDiff] = useState(null); // 初始化为null

  useEffect(() => {
    fetchAnniversaries();
  }, []);

  // 当startDate变化时重新计算diff（包括从null变为有值的情况）
  useEffect(() => {
    if (startDate) {
      const newDiff = getDiff(startDate, mode);
      setDiff(newDiff);
    } else {
      setDiff(null);
    }
  }, [startDate, mode]);

  // 定时器更新diff
  useEffect(() => {
    if (!startDate) return;
    const timer = setInterval(() => {
      const newDiff = getDiff(startDate, mode);
      setDiff(newDiff);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [startDate, mode]);

  // 获取纪念日列表
  const fetchAnniversaries = async () => {
    setLoading(true);
    try {
      const res = await getAnniversaries();
      const processedAnniversaries = Array.isArray(res) ? res.map(item => {
        // 重新计算天数确保正确性
        const today = new Date();
        const anniversaryDate = new Date(item.date);
        const timeDiff = anniversaryDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return {
          ...item,
          days: daysDiff,
          is_future: daysDiff > 0,
          is_pinned: item.is_pinned || false // 添加置顶状态
        };
      }) : [];
      setAnniversaries(processedAnniversaries);
    } catch {
      setAnniversaries([]);
    } finally {
      setLoading(false);
    }
  };

  // 置顶功能
  const handleTogglePin = async (item) => {
    try {
      const updatedItem = { ...item, is_pinned: !item.is_pinned };
      await updateAnniversary(item.id, {
        name: item.name,
        date: item.date,
        note: item.note || '',
        is_pinned: !item.is_pinned
      });
      message.success(updatedItem.is_pinned ? '已置顶' : '已取消置顶');
      fetchAnniversaries();
    } catch {
      message.error('操作失败');
    }
  };

  // 搜索过滤
  const filteredAnniversaries = anniversaries.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.note && item.note.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 排序：置顶在前，然后按日期排序
  const sortedAnniversaries = [...filteredAnniversaries].sort((a, b) => {
    // 首先按置顶状态排序
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    // 然后按日期排序（即将到来的在前）
    return new Date(a.date) - new Date(b.date);
  });

  // 分页数据
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAnniversaries = sortedAnniversaries.slice(startIndex, startIndex + pageSize);

  // 保存恋爱设置
  const handleSaveSettings = async (values) => {
    try {
      const saveData = {
        ...values,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : '',
        anniversary_dates: {},
      };
      await updateLoveSettingsPut(saveData);
      message.success('保存成功！');
      setSettingsModal(false);
      // 更新Redux全局状态
      dispatch(updateLoveSettings({
        couple_name: values.couple_name,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : '',
        anniversary_dates: loveSettings?.anniversary_dates || {},
      }));
    } catch {
      message.error('保存失败');
    }
  };

  // 新增/编辑纪念日
  const handleSaveAnniversary = async (values) => {
    try {
      console.log('保存纪念日数据:', values); // 添加调试日志
      const saveData = {
        name: values.name,
        date: values.date ? values.date.format('YYYY-MM-DD') : '',
        note: values.note || ''
      };
      console.log('格式化后的数据:', saveData); // 添加调试日志
      
      if (editing) {
        await updateAnniversary(editing.id, saveData);
        message.success('修改成功！');
      } else {
        await addAnniversary(saveData);
        message.success('添加成功！');
      }
      setEditModal(false);
      setEditing(null);
      editForm.resetFields();
      fetchAnniversaries();
    } catch (error) {
      console.error('保存纪念日失败:', error); // 添加错误日志
      message.error('操作失败：' + (error.message || '未知错误'));
    }
  };

  // 删除纪念日
  const handleDelete = async (id) => {
    try {
      await deleteAnniversary(id);
      message.success('删除成功');
      fetchAnniversaries();
    } catch {
      message.error('删除失败');
    }
  };

  // 切换计时器显示单位
  const handleSwitch = () => {
    setMode(m => (m === 'day' ? 'week' : m === 'week' ? 'month' : m === 'month' ? 'year' : 'day'));
  };

  // 如果loveSettings还在加载中，显示加载状态
  if (loveSettingsLoading && !loveSettings) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #ffeee6 0%, #fce7f3 25%, #f3e8ff 50%, #e8f4fd 75%, #f0f9ff 100%)', 
        minHeight: '100vh', 
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#d63384' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>💕</div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #ffeee6 0%, #fce7f3 25%, #f3e8ff 50%, #e8f4fd 75%, #f0f9ff 100%)', 
      minHeight: '100vh', 
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(221, 160, 221, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      {/* 浮动心形装饰 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '40px',
        color: 'rgba(255, 182, 193, 0.3)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }}>💝</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '8%',
        fontSize: '30px',
        color: 'rgba(221, 160, 221, 0.3)',
        animation: 'float 4s ease-in-out infinite 2s',
        pointerEvents: 'none'
      }}>💕</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        fontSize: '35px',
        color: 'rgba(255, 105, 180, 0.3)',
        animation: 'float 5s ease-in-out infinite 1s',
        pointerEvents: 'none'
      }}>💖</div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}
      </style>

      {/* 浪漫计时器 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeartFlower>
          <div style={{ 
            fontSize: '22px', 
            color: '#8b5a83', 
            fontWeight: '500', 
            marginBottom: '12px',
            fontFamily: 'Georgia, serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {partnerInfo?.username || partnerInfo?.username || 'My Love'}, I have fallen in love with you for
          </div>
          <div 
            onClick={handleSwitch} 
            style={{ 
              cursor: 'pointer', 
              fontSize: '28px', 
              color: '#d63384', 
              fontFamily: '"Courier New", "Monaco", "Consolas", monospace',
              fontWeight: 'bold',
              marginBottom: '8px',
              textShadow: '0 2px 8px rgba(214, 51, 132, 0.3)',
              background: 'linear-gradient(45deg, #d63384, #e91e63, #f06292)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'all 0.3s ease',
              lineHeight: '1.2'
            }}
          >
            {loveSettingsLoading ? (
              <span style={{ fontSize: '20px', color: '#999' }}>Loading...</span>
            ) : !startDate ? (
              <span style={{ fontSize: '20px', color: '#999' }}>Please set the start date</span>
            ) : !diff ? (
              <span style={{ fontSize: '20px', color: '#999' }}>Calculating...</span>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {mode === 'day' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#d63384', textShadow: '0 0 20px rgba(214, 51, 132, 0.5)' }}>
                        {diff.days}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>days</span>
                    </div>
                    <div style={{ fontSize: '22px' }}>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {diff.hours < 10 ? '0' + diff.hours : diff.hours}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#f06292', textShadow: '0 0 15px rgba(240, 98, 146, 0.5)' }}>
                        {diff.minutes < 10 ? '0' + diff.minutes : diff.minutes}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#ff69b4', textShadow: '0 0 15px rgba(255, 105, 180, 0.5)' }}>
                        {diff.seconds < 10 ? '0' + diff.seconds : diff.seconds}
                      </span>
                    </div>
                  </div>
                )}
                {mode === 'week' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#d63384', textShadow: '0 0 20px rgba(214, 51, 132, 0.5)' }}>
                        {diff.weeks}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>weeks</span>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {diff.remainingDaysFromWeeks}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>days</span>
                    </div>
                    <div style={{ fontSize: '22px' }}>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {diff.hours < 10 ? '0' + diff.hours : diff.hours}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#f06292', textShadow: '0 0 15px rgba(240, 98, 146, 0.5)' }}>
                        {diff.minutes < 10 ? '0' + diff.minutes : diff.minutes}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#ff69b4', textShadow: '0 0 15px rgba(255, 105, 180, 0.5)' }}>
                        {diff.seconds < 10 ? '0' + diff.seconds : diff.seconds}
                      </span>
                    </div>
                  </div>
                )}
                {mode === 'month' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#d63384', textShadow: '0 0 20px rgba(214, 51, 132, 0.5)' }}>
                        {diff.months}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>months</span>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {Math.floor(diff.remainingDaysFromMonths)}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>days</span>
                    </div>
                    <div style={{ fontSize: '22px' }}>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {diff.hours < 10 ? '0' + diff.hours : diff.hours}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#f06292', textShadow: '0 0 15px rgba(240, 98, 146, 0.5)' }}>
                        {diff.minutes < 10 ? '0' + diff.minutes : diff.minutes}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#ff69b4', textShadow: '0 0 15px rgba(255, 105, 180, 0.5)' }}>
                        {diff.seconds < 10 ? '0' + diff.seconds : diff.seconds}
                      </span>
                    </div>
                  </div>
                )}
                {mode === 'year' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#d63384', textShadow: '0 0 20px rgba(214, 51, 132, 0.5)' }}>
                        {diff.years}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>years</span>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {diff.remainingMonthsFromYears}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>months</span>
                      <span style={{ color: '#f06292', textShadow: '0 0 15px rgba(240, 98, 146, 0.5)' }}>
                        {Math.floor(diff.remainingDaysFromYears - (diff.remainingMonthsFromYears * 30.44))}
                      </span>
                      <span style={{ fontSize: '18px', margin: '0 8px', color: '#8b5a83' }}>days</span>
                    </div>
                    <div style={{ fontSize: '22px' }}>
                      <span style={{ color: '#e91e63', textShadow: '0 0 15px rgba(233, 30, 99, 0.5)' }}>
                        {diff.hours < 10 ? '0' + diff.hours : diff.hours}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#f06292', textShadow: '0 0 15px rgba(240, 98, 146, 0.5)' }}>
                        {diff.minutes < 10 ? '0' + diff.minutes : diff.minutes}
                      </span>
                      <span style={{ fontSize: '16px', margin: '0 6px', color: '#8b5a83' }}>:</span>
                      <span style={{ color: '#ff69b4', textShadow: '0 0 15px rgba(255, 105, 180, 0.5)' }}>
                        {diff.seconds < 10 ? '0' + diff.seconds : diff.seconds}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div style={{ 
            fontSize: '22px', 
            color: '#8b5a83',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            Love you  forever.
            <div style={{ 
              fontSize: '20px', 
              marginTop: '8px',
              color: '#999',
              fontFamily: 'Arial, sans-serif'
            }}>
              - {user?.username || user?.username || 'Forever yours'}
            </div>
          </div>
        </HeartFlower>
      </div>

      {/* 纪念日列表 */}
      <div style={{ 
        maxWidth: 700, 
        margin: '40px auto 0',
        background: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '20px', 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', 
        padding: '32px',
        minHeight: '200px',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <div style={{ 
            fontSize: '24px', 
            color: '#d63384', 
            fontWeight: '600',
            fontFamily: 'Georgia, serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            💝 Important Anniversaries
          </div>
          <Button 
            type="primary" 
            onClick={() => { 
              setEditing(null); 
              editForm.resetFields(); 
              setEditModal(true); 
            }}
            style={{
              background: 'linear-gradient(45deg, #d63384, #e91e63)',
              border: 'none',
              borderRadius: '12px',
              height: '40px',
              fontWeight: '500',
              boxShadow: '0 4px 15px rgba(214, 51, 132, 0.3)'
            }}
          >
            + 添加
          </Button>
        </div>

        {/* 搜索框 */}
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="搜索纪念日名称或备注..."
            prefix={<SearchOutlined style={{ color: '#d63384' }} />}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); // 搜索时重置到第一页
            }}
            style={{
              borderRadius: '8px',
              border: '1px solid rgba(214, 51, 132, 0.3)',
              boxShadow: '0 2px 8px rgba(214, 51, 132, 0.1)'
            }}
            allowClear
          />
        </div>

        <List
          loading={loading}
          dataSource={paginatedAnniversaries}
          locale={{ emptyText: searchText ? '未找到相关纪念日 🔍' : '暂无纪念日~ 点击"+ 添加"创建您的第一个纪念日！ 💕' }}
          renderItem={item => (
            <List.Item
              style={{
                background: item.is_pinned 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(252, 231, 243, 0.3) 100%)',
                borderRadius: '12px',
                margin: '12px 0',
                padding: '16px 20px',
                border: item.is_pinned 
                  ? '2px solid rgba(214, 51, 132, 0.3)'
                  : '1px solid rgba(214, 51, 132, 0.1)',
                boxShadow: item.is_pinned 
                  ? '0 4px 12px rgba(214, 51, 132, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              actions={[
                <Button 
                  type="text"
                  icon={item.is_pinned ? <PushpinFilled /> : <PushpinOutlined />}
                  onClick={() => handleTogglePin(item)}
                  style={{
                    color: item.is_pinned ? '#d63384' : '#999',
                    border: 'none',
                    padding: '4px 8px'
                  }}
                  title={item.is_pinned ? '取消置顶' : '置顶'}
                />,
                <Button 
                  type="link" 
                  onClick={() => { 
                    setEditing(item); 
                    editForm.setFieldsValue({
                      name: item.name,
                      date: item.date ? dayjs(item.date) : null,
                      note: item.note || ''
                    }); 
                    setEditModal(true); 
                  }}
                  style={{
                    color: '#d63384',
                    fontWeight: '500',
                    border: '1px solid rgba(214, 51, 132, 0.3)',
                    borderRadius: '8px',
                    padding: '4px 12px'
                  }}
                >
                  编辑
                </Button>,
                <Popconfirm 
                  title="确定要删除该纪念日吗？" 
                  onConfirm={() => handleDelete(item.id)} 
                  okText="删除" 
                  cancelText="取消"
                >
                  <Button 
                    type="link" 
                    danger
                    style={{
                      fontWeight: '500',
                      border: '1px solid rgba(255, 77, 79, 0.3)',
                      borderRadius: '8px',
                      padding: '4px 12px'
                    }}
                  >
                    删除
                  </Button>
                </Popconfirm>
              ]}
            >
              {item.is_pinned && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'linear-gradient(45deg, #d63384, #e91e63)',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  置顶
                </div>
              )}
              <List.Item.Meta
                title={
                  <span style={{ 
                    fontWeight: '600', 
                    color: item.is_future ? '#40a9ff' : '#333',
                    fontSize: '16px',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {item.name}
                  </span>
                }
                description={
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {item.date} {item.note && `｜${item.note}`}
                    <span style={{ 
                      marginLeft: '12px', 
                      color: item.is_future ? '#d63384' : '#9254de',
                      fontWeight: '500',
                      fontSize: '13px'
                    }}>
                      {item.is_future 
                        ? `还有 ${item.days} 天` 
                        : `已过 ${Math.abs(item.days)} 天`
                      }
                    </span>
                  </span>
                }
              />
            </List.Item>
          )}
        />

        {/* 分页组件 */}
        {sortedAnniversaries.length > pageSize && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '24px',
            padding: '16px'
          }}>
            <Pagination
              current={currentPage}
              total={sortedAnniversaries.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={(total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条纪念日`
              }
              style={{
                color: '#d63384'
              }}
            />
          </div>
        )}
      </div>

      {/* 恋爱设置弹窗 */}
      <Modal
        title="💕 Edit Love Settings"
        open={settingsModal}
        onCancel={() => setSettingsModal(false)}
        onOk={() => settingsForm.submit()}
        okText="Save"
        cancelText="Cancel"
        style={{ top: 100 }}
      >
        <Form
          form={settingsForm}
          layout="vertical"
          onFinish={handleSaveSettings}
          preserve={false}
        >
          <Form.Item 
            name="couple_name" 
            label="Couple Name" 
            rules={[{ required: true, message: 'Please enter couple name' }]}
          >
            <Input maxLength={20} placeholder="Enter your couple name" />
          </Form.Item>
          <Form.Item 
            name="start_date" 
            label="Anniversary Date" 
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select your anniversary date" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 纪念日编辑弹窗 */}
      <Modal
        title={editing ? '✨ 编辑纪念日' : '🎉 添加新纪念日'}
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          setEditing(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        okText="保存"
        cancelText="取消"
        style={{ top: 100 }}
      >
        <Form 
          form={editForm} 
          layout="vertical" 
          onFinish={handleSaveAnniversary}
          preserve={false}
        >
          <Form.Item 
            name="name" 
            label="纪念日名称" 
            rules={[{ required: true, message: '请输入纪念日名称' }]}
          >
            <Input maxLength={30} placeholder="请输入纪念日名称" />
          </Form.Item>
          <Form.Item 
            name="date" 
            label="纪念日日期" 
            rules={[{ required: true, message: '请选择纪念日日期' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择纪念日日期" />
          </Form.Item>
          <Form.Item name="note" label="备注（可选）">
            <Input maxLength={50} placeholder="为这个纪念日添加备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
 
export default Anniversary; 