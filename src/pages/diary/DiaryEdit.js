import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Form, Input, Button, message, Space, Modal, Divider, Tag, Tooltip, Select, Slider } from 'antd';
import { SaveOutlined, EyeOutlined, ArrowLeftOutlined, InfoCircleOutlined, SettingOutlined, ColumnWidthOutlined, AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createDiary, updateDiary, getDiaryDetail } from '../../api/diary';
import { createDiaryAsync, updateDiaryAsync } from '../../redux/slices/diarySlice';
import styles from './DiaryEdit.module.css';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import EditorToolbar from '../../components/EditorToolbar';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import shell from 'highlight.js/lib/languages/shell';
import { createRoot } from 'react-dom/client';
import Video from 'tiptap-extension-video';
import axiosInstance from '../../api/axios';
import hljs from 'highlight.js';

const lowlight = createLowlight();
lowlight.register('python', python);
lowlight.register('javascript', javascript);
lowlight.register('xml', xml);
lowlight.register('json', json);
lowlight.register('shell', shell);

const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'hljs',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          const lang = attributes.language ? `language-${attributes.language}` : '';
          return {
            class: `${lang} hljs`.trim(),
          };
        },
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (!this.editor.isActive('codeBlock')) return false;
        this.editor.commands.insertContent('  ');
        return true;
      },
      Enter: () => {
        if (!this.editor.isActive('codeBlock')) return false;
        // 自动缩进上一行的空格
        const { state } = this.editor;
        const { $from } = state.selection;
        const lineStart = $from.before();
        const text = state.doc.textBetween(lineStart, $from.pos, '\n', '\n');
        const indent = text.match(/^\s*/)?.[0] || '';
        this.editor.commands.insertContent('\n' + indent);
        return true;
      },
    };
  },
});

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          return { style: attributes.style };
        },
      },
      'data-width': {
        default: null,
        parseHTML: element => element.getAttribute('data-width'),
        renderHTML: attributes => {
          return { 'data-width': attributes['data-width'] };
        },
      },
      'data-align': {
        default: null,
        parseHTML: element => element.getAttribute('data-align'),
        renderHTML: attributes => {
          return { 'data-align': attributes['data-align'] };
        },
      },
    };
  },
});

const { TextArea } = Input;

const DiaryEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [imageWidth, setImageWidth] = useState('100'); // 默认100%

  // tiptap 编辑器实例
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomImage,
      Video,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'table-row',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'table-cell',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'table-header',
        },
      }),
      CustomCodeBlock.configure({ lowlight }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.tiptapEditor,
      },
    },
  });

  useEffect(() => {
    if (id && editor) {
      fetchDiaryDetail();
    } else if (editor) {
      // 新建时清空表单和内容
      form.resetFields();
      setContent('');
      editor.commands.setContent('');
    }
    // eslint-disable-next-line
  }, [id, editor]);

  const fetchDiaryDetail = async () => {
    try {
      const response = await getDiaryDetail(id);
      if (response) {
        form.setFieldsValue({
          title: response.title,
          summary: response.summary,
        });
        setContent(response.content || '');
        editor.commands.setContent(response.content || '');
        setTags(response.tags || []);
      }
    } catch (error) {
      message.error('获取日记详情失败');
    }
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 预览日记
  const handlePreview = () => {
    setPreviewContent(content);
    setPreviewVisible(true);
    setTimeout(() => {
      document.querySelectorAll('.mdPreviewWrap pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }, 0);
  };

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const diaryData = {
        ...values,
        content,
        tags,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      if (id) {
        await dispatch(updateDiaryAsync({ id, ...diaryData })).unwrap();
        message.success('日记更新成功');
      } else {
        await dispatch(createDiaryAsync(diaryData)).unwrap();
        message.success('日记创建成功');
      }
      navigate('/diary/list');
    } catch (error) {
      message.error(id ? '更新日记失败' : '创建日记失败');
    } finally {
      setLoading(false);
    }
  };

  // 上传图片到后端，插入编辑器（带 style）
  const handleImageUpload = async (fileOrEvent) => {
    let file;
    if (fileOrEvent && fileOrEvent.target && fileOrEvent.target.files) {
      file = fileOrEvent.target.files[0];
    } else if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    }
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axiosInstance.post('/upload/image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.url;
      editor.chain().focus().setImage({
        src: url,
        style: 'width:100%;display:block;margin:0 auto;',
        'data-width': '100',
        'data-align': 'center'
      }).run();
    } catch (e) {
      message.error('图片上传失败');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 触发 input[type=file] 选择图片
  const handleImageButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // 支持粘贴图片插入（绑定到 .ProseMirror）
  useEffect(() => {
    if (!editor) return;
    const handler = (e) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          const reader = new FileReader();
          reader.onload = (evt) => {
            editor.chain().focus().setImage({ src: evt.target.result, style: 'width: 100%;', 'data-width': '100' }).run();
          };
          reader.readAsDataURL(file);
        }
      }
    };
    const editorDom = document.querySelector('.ProseMirror');
    if (editorDom) editorDom.addEventListener('paste', handler);
    return () => {
      if (editorDom) editorDom.removeEventListener('paste', handler);
    };
  }, [editor]);

  // 图片悬浮操作浮层
  useEffect(() => {
    if (!editor) return;
    let opDiv = null;
    let curImg = null;
    let hideTimer = null;
    let modalInstance = null;
    let keydownHandler = null;
    const showResizeModal = (img) => {
      if (modalInstance) return;
      const curWidth = parseInt(img.getAttribute('data-width') || '100', 10);
      let tempWidth = curWidth;
      let tempAlign = img.getAttribute('data-align') || 'center';
      modalInstance = Modal.confirm({
        title: '图片缩放',
        content: (
          <Slider
            min={10}
            max={100}
            defaultValue={curWidth}
            tooltip={{ open: true }}
            onChange={val => { tempWidth = val; }}
            onAfterChange={val => { tempWidth = val; }}
            style={{ width: 220, margin: '24px auto 0' }}
          />
        ),
        onOk: () => {
          let alignStyle = '';
          if (tempAlign === 'center') alignStyle = 'display:block;margin:0 auto;';
          else if (tempAlign === 'left') alignStyle = 'float:left;';
          else if (tempAlign === 'right') alignStyle = 'float:right;';
          const pos = editor.view.posAtDOM(img, 0);
          if (pos === -1) {
            message.error('图片节点定位失败，请重试');
            return;
          }
          const node = editor.view.state.doc.nodeAt(pos);
          if (node && node.type.name === 'image') {
            editor.chain().focus().setNodeSelection(pos).updateAttributes('image', {
              style: `width:${tempWidth}%;${alignStyle}`,
              'data-width': tempWidth,
              'data-align': tempAlign
            }).run();
          }
        },
        afterClose: () => {
          modalInstance = null;
          if (keydownHandler) {
            window.removeEventListener('keydown', keydownHandler);
          }
        },
        onOpenChange: (open) => {
          if (open) {
            keydownHandler = (e) => {
              if (e.key === 'Enter') {
                const okBtn = document.querySelector('.ant-modal-confirm .ant-btn-primary');
                if (okBtn) okBtn.click();
              }
            };
            window.addEventListener('keydown', keydownHandler);
          }
        },
      });
    };
    // 对齐切换（下拉菜单）
    const alignOptions = [
      { key: 'left', label: '左对齐', icon: <AlignLeftOutlined /> },
      { key: 'center', label: '居中', icon: <AlignCenterOutlined /> },
      { key: 'right', label: '右对齐', icon: <AlignRightOutlined /> },
    ];
    const alignIcon = {
      left: <AlignLeftOutlined />, center: <AlignCenterOutlined />, right: <AlignRightOutlined />
    };
    const setAlign = (img, align) => {
      let alignStyle = '';
      if (align === 'center') alignStyle = 'display:block;margin:0 auto;';
      else if (align === 'left') alignStyle = 'float:left;';
      else if (align === 'right') alignStyle = 'float:right;';
      img.setAttribute('data-align', align);
      const pos = editor.view.posAtDOM(img, 0);
      if (pos === -1) {
        message.error('图片节点定位失败，请重试');
        return;
      }
      const node = editor.view.state.doc.nodeAt(pos);
      if (node && node.type.name === 'image') {
        editor.chain().focus().setNodeSelection(pos).updateAttributes('image', {
          style: `width:${img.getAttribute('data-width') || '100'}%;${alignStyle}`,
          'data-width': img.getAttribute('data-width') || '100',
          'data-align': align
        }).run();
      }
    };
    // 浮层渲染
    const renderOpDiv = (img) => {
      if (opDiv) {
        if (opDiv._root) opDiv._root.unmount();
        opDiv.remove();
      }
      opDiv = document.createElement('div');
      opDiv.style.position = 'absolute';
      opDiv.style.zIndex = 1000;
      opDiv.style.top = (img.getBoundingClientRect().top + window.scrollY + 8) + 'px';
      opDiv.style.left = (img.getBoundingClientRect().right + window.scrollX - 120) + 'px';
      opDiv.style.background = 'rgba(255,255,255,0.95)';
      opDiv.style.borderRadius = '6px';
      opDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      opDiv.style.padding = '4px 8px';
      opDiv.style.display = 'flex';
      opDiv.style.gap = '8px';
      opDiv.style.alignItems = 'center';
      opDiv.style.border = '1px solid #eee';
      opDiv.style.fontSize = '18px';
      opDiv.onmouseenter = () => {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      };
      opDiv.onmouseleave = () => {
        if (opDiv) {
          if (opDiv._root) opDiv._root.unmount();
          opDiv.remove();
          opDiv = null;
        }
      };
      // 缩放按钮
      const scaleBtn = document.createElement('span');
      scaleBtn.title = '缩放';
      scaleBtn.style.cursor = 'pointer';
      scaleBtn.onclick = () => showResizeModal(img);
      scaleBtn._root = createRoot(scaleBtn);
      scaleBtn._root.render(<ColumnWidthOutlined />);
      // 对齐按钮（点击弹出菜单）
      const alignBtn = document.createElement('span');
      let curAlign = img.getAttribute('data-align') || 'center';
      alignBtn.title = '设置对齐方式';
      alignBtn.style.cursor = 'pointer';
      alignBtn.onclick = (e) => {
        e.stopPropagation();
        // 构建菜单
        let menuDiv = document.createElement('div');
        menuDiv.style.position = 'absolute';
        menuDiv.style.zIndex = 2000;
        menuDiv.style.top = (opDiv.getBoundingClientRect().bottom + window.scrollY + 2) + 'px';
        menuDiv.style.left = (opDiv.getBoundingClientRect().left + window.scrollX) + 'px';
        menuDiv.style.background = '#fff';
        menuDiv.style.border = '1px solid #eee';
        menuDiv.style.borderRadius = '6px';
        menuDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        menuDiv.style.padding = '4px 0';
        menuDiv.style.minWidth = '100px';
        menuDiv._roots = [];
        alignOptions.forEach(opt => {
          let item = document.createElement('div');
          item.style.display = 'flex';
          item.style.alignItems = 'center';
          item.style.gap = '8px';
          item.style.padding = '6px 16px';
          item.style.cursor = 'pointer';
          item.style.fontSize = '16px';
          if (curAlign === opt.key) item.style.background = '#e6f7ff';
          const itemRoot = createRoot(item);
          itemRoot.render(<>{opt.icon}<span>{opt.label}</span></>);
          menuDiv._roots.push(itemRoot);
          item.onclick = () => {
            if (menuDiv._destroyed) return;
            setAlign(img, opt.key);
            curAlign = opt.key;
            try {
              if (alignBtn._root && !menuDiv._destroyed) alignBtn._root.render(alignIcon[curAlign]);
            } catch (e) {}
            // 先更新icon，再销毁菜单
            menuDiv._roots.forEach(r => { try { r.unmount(); } catch (e) {} });
            menuDiv._destroyed = true;
            menuDiv._roots = [];
            alignBtn._root = null;
            menuDiv.remove();
          };
          menuDiv.appendChild(item);
        });
        document.body.appendChild(menuDiv);
        // 点击其它地方关闭菜单
        const closeMenu = (evt) => {
          if (!menuDiv.contains(evt.target)) {
            if (!menuDiv._destroyed) {
              menuDiv._roots.forEach(r => { try { r.unmount(); } catch (e) {} });
              menuDiv._destroyed = true;
              menuDiv._roots = [];
              alignBtn._root = null;
            }
            menuDiv.remove();
            document.removeEventListener('mousedown', closeMenu);
          }
        };
        setTimeout(() => document.addEventListener('mousedown', closeMenu), 10);
      };
      alignBtn._root = createRoot(alignBtn);
      alignBtn._root.render(alignIcon[curAlign]);
      opDiv.appendChild(scaleBtn);
      opDiv.appendChild(alignBtn);
      opDiv._root = { unmount: () => { scaleBtn._root.unmount(); alignBtn._root.unmount(); } };
      document.body.appendChild(opDiv);
    };
    // 悬浮事件
    const handlerMouseOver = (e) => {
      if (e.target.tagName === 'IMG' && editor && editor.view.dom.contains(e.target)) {
        e.target.style.cursor = 'pointer';
        e.target.title = '悬浮图片可操作';
        curImg = e.target;
        renderOpDiv(curImg);
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      }
    };
    const handlerMouseOut = (e) => {
      if (e.target.tagName === 'IMG' && curImg === e.target) {
        hideTimer = setTimeout(() => {
          if (opDiv) {
            if (opDiv._root) opDiv._root.unmount();
            opDiv.remove();
          }
        }, 200);
      }
    };
    window.addEventListener('scroll', () => {
      if (curImg && opDiv) {
        opDiv.style.top = (curImg.getBoundingClientRect().top + window.scrollY + 8) + 'px';
        opDiv.style.left = (curImg.getBoundingClientRect().right + window.scrollX - 120) + 'px';
      }
    });
    const dom = editor.view && editor.view.dom;
    if (dom) {
      dom.addEventListener('mouseover', handlerMouseOver);
      dom.addEventListener('mouseout', handlerMouseOut);
    }
    return () => {
      if (dom) {
        dom.removeEventListener('mouseover', handlerMouseOver);
        dom.removeEventListener('mouseout', handlerMouseOut);
      }
      if (opDiv) {
        if (opDiv._root) opDiv._root.unmount();
        opDiv.remove();
      }
    };
  }, [editor]);

  // 上传视频到后端，插入编辑器
  const handleVideoUpload = async (fileOrEvent) => {
    let file;
    if (fileOrEvent && fileOrEvent.target && fileOrEvent.target.files) {
      file = fileOrEvent.target.files[0];
    } else if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    }
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axiosInstance.post('/upload/video/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.url;
      editor.chain().focus().setVideo({ src: url }).run();
      // 如 setVideo 不生效可用：
      // editor.commands.insertContent(`<video src="${url}" controls style="max-width:100%"></video>`);
    } catch (e) {
      message.error('视频上传失败');
    }
  };

  useEffect(() => {
    if (previewVisible) {
      setTimeout(() => {
        document.querySelectorAll('.mdPreviewWrap pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      }, 0);
    }
  }, [previewVisible, previewContent]);

  return (
    <div className={styles.mainLayoutSimple}>
      {/* 工具栏单独悬浮 */}
      <div className={styles.toolbarWrap}>
        <EditorToolbar 
          editor={editor} 
          onImageUpload={handleImageUpload} 
          onImageButtonClick={handleImageButtonClick}
          onVideoUpload={handleVideoUpload} 
        />
        {/* 隐藏的 input 用于本地图片上传 */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>
      <Card className={styles.simpleCard}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
              colon={false}
          >
            <Input className={styles.titleInput} maxLength={100} showCount placeholder="请输入文章标题" />
          </Form.Item>
            {/* 编辑区 */}
          <Form.Item
              required={false}
              colon={false}
              style={{ marginBottom: 0 }}
          >
              <div className={styles.mdEditorWrap} style={{ maxWidth: 800, margin: '0 auto' }}>
              <EditorContent editor={editor} className={styles.tiptapContent} />
              </div>
          </Form.Item>
          <Divider />
          <div className={styles.actionBar}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              保存日记
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={handlePreview}
            >
              预览
            </Button>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/diary/list')}
            >
              返回列表
            </Button>
          </div>
        </Form>
        </div>
      </Card>
      <Modal
        title="日记预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={900}
        footer={null}
      >
        <div className={styles.mdPreviewWrap}>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      </Modal>
    </div>
  );
};

export default DiaryEdit; 