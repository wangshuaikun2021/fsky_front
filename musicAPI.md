# 音乐模块接口文档

## 1. 获取音乐列表
- **GET** `/music/`
- **参数**（可选）：`page`、`page_size`、`category`
- **返回**
```json
{
  "total": 100,
  "page": 1,
  "page_size": 10,
  "musics": [
    {
      "id": 1,
      "title": "歌曲名",
      "artist": "歌手",
      "file_url": "http://.../media/music/1/xxx.mp3",
      "cover_url": "http://.../media/covers/1/xxx.jpg",
      "duration": 180,
      "category": "流行",
      "play_count": 5,
      "created_at": "2024-06-02 20:00:00"
    }
  ]
}
```

---

## 2. 上传音乐文件
- **POST** `/music/upload/`
- **参数**：`file`（form-data，mp3/wav/ogg）
- **返回**
```json
{
  "id": 1,
  "file_url": "http://.../media/music/1/xxx.mp3"
}
```

---

## 3. 上传音乐封面
- **POST** `/music/upload-cover/`
- **参数**：`file`（form-data，jpg/png/gif）
- **返回**
```json
{
  "id": 1,
  "cover_url": "http://.../media/covers/1/xxx.jpg"
}
```

---

## 4. 创建音乐记录
- **POST** `/music/`
- **参数**（json）：
  - `title`（必填）
  - `artist`
  - `file_url`（必填，上传音乐后返回的 url）
  - `cover_url`
  - `duration`
  - `category`
- **返回**
```json
{
  "id": 1,
  "title": "xxx",
  "artist": "xxx",
  "file_url": "...",
  "cover_url": "...",
  "duration": 180,
  "category": "流行",
  "play_count": 0,
  "created_at": "2024-06-02 20:00:00"
}
```

---

## 5. 音乐详情/修改/删除
- **GET/PUT/DELETE** `/music/<id>/`
- **GET 返回**：同上
- **PUT 参数**：同创建
- **DELETE 返回**：`{"status": "success"}`

---

## 6. 收藏/取消收藏音乐
- **POST** `/music/<music_id>/favorite/`
- **返回**
```json
{"status": "favorited"} // 或 {"status": "unfavorited"}
```

---

## 7. 获取收藏列表
- **GET** `/music/favorites/`
- **参数**：`page`、`page_size`
- **返回**：同音乐列表

---

## 8. 获取音乐分类
- **GET** `/music/categories/`
- **返回**
```json
{
  "categories": ["流行", "摇滚", "民谣"]
}
```

---

## 9. 歌单相关
- **GET** `/playlists/` 获取歌单列表（自动包含"默认歌单"）
- **GET/PUT/DELETE** `/playlists/<id>/` 歌单详情/修改/删除
- **POST/DELETE** `/playlists/<playlist_id>/music/<music_id>/` 添加/移除歌单音乐
- **PUT** `/playlists/<playlist_id>/order/` 更新歌单音乐排序

---

## 10. 播放历史
- **GET/POST/DELETE** `/music/history/`
  - GET：获取播放历史
  - POST：添加播放记录（参数：music_id）
  - DELETE：清空播放历史

---

## 11. 背景音乐设置
- **GET/PUT** `/music/background/`
  - GET：获取设置
  - PUT：设置背景音乐（参数：music_id, volume, is_enabled）

---

**所有接口均需登录认证，且只允许情侣空间内的成员访问和操作。** 