import React, { useState } from 'react';
import { Tooltip, Modal, Select, Upload, message, Dropdown, Menu } from 'antd';
import {
  UndoOutlined, RedoOutlined, BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
  BlockOutlined, CodeOutlined, OrderedListOutlined, UnorderedListOutlined, CheckSquareOutlined,
  PictureOutlined, VideoCameraOutlined, TableOutlined, LinkOutlined, MinusOutlined, FontSizeOutlined
} from '@ant-design/icons';
import './EditorToolbar.css';

const codeLanguages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Shell', value: 'shell' },
  { label: '其他', value: 'plaintext' },
];

const EditorToolbar = ({ editor, onImageUpload, onVideoUpload, onImageButtonClick }) => {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeLang, setCodeLang] = useState('javascript');

  if (!editor) return null;

  // 工具栏按钮通用渲染
  const renderBtn = (icon, title, onClick, active = false) => (
    <Tooltip title={title}>
      <button
        className={`toolbar-btn${active ? ' active' : ''}`}
        onClick={onClick}
        type="button"
      >
        {icon}
      </button>
    </Tooltip>
  );

  // 代码块插入
  const handleInsertCode = () => {
    setCodeModalOpen(true);
  };
  const handleCodeOk = () => {
    editor.chain().focus().toggleCodeBlock({ language: codeLang }).run();
    setCodeModalOpen(false);
  };

  // 图片上传
  const handleImageChange = (info) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      const file = info.file.originFileObj || info.file;
      onImageUpload && onImageUpload(file);
    }
  };

  // 视频上传
  const handleVideoChange = (info) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      const file = info.file.originFileObj || info.file;
      onVideoUpload && onVideoUpload(file);
    }
  };

  // 多级标题下拉菜单
  const headingMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'paragraph') {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: Number(key) }).run();
        }
      }}
      items={[
        { label: '正文', key: 'paragraph' },
        { label: 'H1 一级标题', key: '1' },
        { label: 'H2 二级标题', key: '2' },
        { label: 'H3 三级标题', key: '3' },
        { label: 'H4 四级标题', key: '4' },
        { label: 'H5 五级标题', key: '5' },
        { label: 'H6 六级标题', key: '6' },
      ]}
    />
  );

  return (
    <div className="editor-toolbar">
      {/* 撤销/重做 */}
      {renderBtn(<UndoOutlined />, '撤销', () => editor.chain().focus().undo().run())}
      {renderBtn(<RedoOutlined />, '重做', () => editor.chain().focus().redo().run())}
      <span className="toolbar-divider" />
      {/* 多级标题下拉 */}
      <Dropdown overlay={headingMenu} placement="bottom">
        <button
          className={`toolbar-btn${editor.isActive('heading') || editor.isActive('paragraph') ? ' active' : ''}`}
          type="button"
        >
          <FontSizeOutlined />
          {editor.isActive('heading', { level: 1 }) && 'H1'}
          {editor.isActive('heading', { level: 2 }) && 'H2'}
          {editor.isActive('heading', { level: 3 }) && 'H3'}
          {editor.isActive('heading', { level: 4 }) && 'H4'}
          {editor.isActive('heading', { level: 5 }) && 'H5'}
          {editor.isActive('heading', { level: 6 }) && 'H6'}
          {editor.isActive('paragraph') && '正文'}
        </button>
      </Dropdown>
      {/* 加粗/斜体/下划线/删除线 */}
      {renderBtn(<BoldOutlined />, '加粗', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {renderBtn(<ItalicOutlined />, '斜体', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {renderBtn(<UnderlineOutlined />, '下划线', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
      {renderBtn(<StrikethroughOutlined />, '删除线', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
      <span className="toolbar-divider" />
      {/* 引用/分割线/代码块 */}
      {renderBtn(<BlockOutlined />, '引用', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
      {renderBtn(<MinusOutlined />, '分割线', () => editor.chain().focus().setHorizontalRule().run())}
      {renderBtn(<CodeOutlined />, '代码块', handleInsertCode, editor.isActive('codeBlock'))}
      <span className="toolbar-divider" />
      {/* 列表/任务列表 */}
      {renderBtn(<UnorderedListOutlined />, '无序列表', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
      {renderBtn(<OrderedListOutlined />, '有序列表', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
      {renderBtn(<CheckSquareOutlined />, '任务列表', () => editor.chain().focus().toggleTaskList().run(), editor.isActive('taskList'))}
      <span className="toolbar-divider" />
      {/* 表格 */}
      {renderBtn(<TableOutlined />, '表格', () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
      {/* 图片上传 */}
      {renderBtn(<PictureOutlined />, '插入图片', onImageButtonClick)}
      {/* 视频上传 */}
      <Upload showUploadList={false} beforeUpload={() => false} onChange={handleVideoChange} accept="video/*">
        {renderBtn(<VideoCameraOutlined />, '插入视频', () => {})}
      </Upload>
      {/* 链接 */}
      {renderBtn(<LinkOutlined />, '插入链接', () => {
        const url = window.prompt('请输入链接地址');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }, editor.isActive('link'))}
      {/* 代码块语言选择弹窗 */}
      <Modal
        title="选择代码语言"
        open={codeModalOpen}
        onOk={handleCodeOk}
        onCancel={() => setCodeModalOpen(false)}
        okText="插入"
        cancelText="取消"
      >
        <Select
          style={{ width: 200 }}
          value={codeLang}
          onChange={setCodeLang}
          options={codeLanguages}
        />
      </Modal>
    </div>
  );
};

export default EditorToolbar; 