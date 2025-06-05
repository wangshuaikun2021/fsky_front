# 情侣小窝 API 接口文档

**基础 URL:** `http://127.0.0.1:8000/`

**认证方式:** Token 认证，在请求头中添加 `Authorization: Token <your_token>`

---

## 1. 用户认证与个人资料相关接口

### 1.1 用户注册

*   **功能描述:** 创建新用户账号并自动生成关联的个人资料
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/register/`
*   **需要认证:** 否
*   **请求体 (JSON):**
    ```json
    {
      "username": "string",    // 用户名 (必需)
      "password": "string",    // 密码 (必需)
      "nickname": "string"     // 昵称 (可选)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "token": "string",     // 认证 Token
          "user": {
            "id": "integer",
            "username": "string",
            "nickname": "string",
            "avatar": "string or null",
            "is_partner": "boolean",
            "partner": { ... } | null,
            "profile": {
                "favorite_game": "string",
                "favorite_food": "string",
                "favorite_animal": "string",
                "favorite_sport": "string",
                "favorite_color": "string"
            }
          }
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string"      // 错误信息
        }
        ```

### 1.2 用户登录

*   **功能描述:** 用户登录获取认证 Token
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/login/`
*   **需要认证:** 否
*   **请求体 (JSON):**
    ```json
    {
      "username": "string",    // 用户名 (必需)
      "password": "string"     // 密码 (必需)
    }
    ```
*   **响应体 (JSON):** 同注册接口

### 1.3 用户登出

*   **功能描述:** 使当前用户的认证 Token 失效
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/logout/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "status": "success"
    }
    ```

### 1.4 获取当前用户信息

*   **功能描述:** 获取当前登录用户的完整资料
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/user-info/`
*   **需要认证:** 是
*   **响应体 (JSON):** 同登录接口

### 1.5 更新用户信息

*   **功能描述:** 更新当前用户的个人信息，支持部分更新
*   **HTTP 方法:** `PUT`, `PATCH`
*   **URL 路径:** `/user/update/`
*   **需要认证:** 是
*   **请求体:** 支持 `application/json` 或 `multipart/form-data`
*   **响应体 (JSON):**
    ```json
    {
      "status": "success",
      "user": { ... }          // 更新后的用户信息
    }
    ```

### 1.6 修改密码

*   **功能描述:** 修改当前用户密码
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/user/change-password/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "old_password": "string", // 旧密码 (必需)
      "new_password": "string"  // 新密码 (必需)
    }
    ```

### 1.7 绑定伴侣

*   **功能描述:** 绑定情侣关系并创建情侣空间
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/bind-partner/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "partner_username": "string", // 伴侣用户名 (必需)
      "couple_name": "string",      // 情侣名称 (可选)
      "start_date": "YYYY-MM-DD"    // 在一起日期 (可选)
    }
    ```
*   **响应体 (JSON):**
    ```json
    {
      "message": "绑定成功"
    }
    ```

### 1.8 解除绑定

*   **功能描述:** 解除情侣关系并删除情侣空间
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/unbind-partner/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "message": "解除绑定成功"
    }
    ```

---

## 2. 情侣空间设置接口

### 2.1 获取情侣空间设置

*   **功能描述:** 获取当前用户的情侣空间设置信息
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/love-settings/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "couple_name": "string",        // 情侣名称
      "start_date": "YYYY-MM-DD",     // 恋爱开始日期
      "anniversary_dates": {}         // 纪念日列表
    }
    ```

### 2.2 创建情侣空间设置

*   **功能描述:** 创建新的情侣空间设置
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/love-settings/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "couple_name": "string",      // 情侣名称 (可选)
      "start_date": "YYYY-MM-DD",   // 恋爱开始日期 (可选)
      "anniversary_dates": {}       // 纪念日列表 (可选)
    }
    ```

### 2.3 更新情侣空间设置

*   **功能描述:** 部分更新情侣空间设置
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/love-settings/`
*   **需要认证:** 是
*   **请求体 (JSON):** 只传递需要更新的字段
*   **响应体 (JSON):**
    ```json
    {
      "status": "success"
    }
    ```

---

## 3. 纪念日管理接口

### 3.1 获取纪念日列表

*   **功能描述:** 获取当前情侣空间的所有纪念日，按置顶状态和日期排序
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/anniversaries/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    [
      {
        "id": "integer",           // 纪念日ID
        "name": "string",          // 纪念日名称
        "date": "YYYY-MM-DD",      // 纪念日日期
        "note": "string",          // 备注
        "is_pinned": "boolean",    // 是否置顶
        "days": "integer",         // 距离/已过天数
        "is_future": "boolean"     // 是否为未来日期
      }
    ]
    ```

### 3.2 添加纪念日

*   **功能描述:** 在当前情侣空间添加新的纪念日
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/anniversaries/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "name": "string",          // 纪念日名称 (必需)
      "date": "YYYY-MM-DD",      // 纪念日日期 (必需)
      "note": "string",          // 备注 (可选)
      "is_pinned": "boolean"     // 是否置顶 (可选，默认false)
    }
    ```
*   **响应体 (JSON):**
    ```json
    {
      "status": "success",
      "id": "integer"            // 新创建的纪念日ID
    }
    ```

### 3.3 更新纪念日

*   **功能描述:** 更新指定纪念日的信息
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/anniversaries/<int:pk>/`
*   **需要认证:** 是
*   **请求体 (JSON):** 传递需要更新的字段
*   **响应体 (JSON):**
    ```json
    {
      "status": "success"
    }
    ```

### 3.4 删除纪念日

*   **功能描述:** 删除指定纪念日
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/anniversaries/<int:pk>/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "status": "success"
    }
    ```

---

## 4. 日记相关接口

### 4.1 获取日记列表

*   **功能描述:** 获取当前用户和其伴侣的日记列表，支持分页和搜索
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/diaries/`
*   **需要认证:** 是
*   **请求参数:**
    - `page`: 页码 (可选，默认1)
    - `page_size`: 每页数量 (可选，默认10)
    - `search`: 搜索关键词 (可选，搜索标题和内容)
*   **响应体 (JSON):**
    ```json
    {
      "total": "integer",        // 总条数
      "page": "integer",         // 当前页码
      "page_size": "integer",    // 每页数量
      "diaries": [
        {
          "id": "integer",
          "title": "string",
          "content": "string",
          "created_at": "YYYY-MM-DD HH:MM:SS",
          "mood": "string or null",
          "is_public": "boolean",
          "author": "string"     // 作者昵称或用户名
        }
      ]
    }
    ```

### 4.2 获取日记详情

*   **功能描述:** 获取指定日记详情（只能查看自己和伴侣的日记）
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/diaries/<int:pk>/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "id": "integer",
      "title": "string",
      "content": "string",
      "created_at": "YYYY-MM-DD HH:MM:SS",
      "mood": "string or null",
      "is_public": "boolean",
      "author": "string"
    }
    ```

### 4.3 创建日记

*   **功能描述:** 创建新日记（自动设置作者为当前用户）
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/diaries/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "title": "string",         // 日记标题 (必需)
      "content": "string",       // 日记内容 (必需，支持富文本HTML)
      "mood_id": "integer",      // 关联的心情记录ID (可选)
      "is_public": "boolean"     // 是否公开 (可选，默认true)
    }
    ```

### 4.4 更新日记

*   **功能描述:** 更新指定日记（只能更新自己创建的日记）
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/diaries/<int:pk>/`
*   **需要认证:** 是
*   **请求体 (JSON):** 传递需要更新的字段

### 4.5 删除日记

*   **功能描述:** 删除指定日记（只能删除自己创建的日记）
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/diaries/<int:pk>/`
*   **需要认证:** 是

---

## 5. 富文本上传接口

### 5.1 上传图片

*   **功能描述:** 富文本编辑器图片上传
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/upload/image/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    file: file                 // 图片文件 (必需)
    ```
*   **响应体 (JSON):**
    ```json
    {
      "url": "string"          // 图片访问URL
    }
    ```

### 5.2 上传视频

*   **功能描述:** 富文本编辑器视频上传
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/upload/video/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    file: file                 // 视频文件 (必需)
    ```
*   **响应体 (JSON):**
    ```json
    {
      "url": "string"          // 视频访问URL
    }
    ```

---

## 6. 照片相关接口

### 6.1 获取照片列表

*   **功能描述:** 获取公开的照片列表
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/photos/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "photos": [
        {
          "id": "integer",
          "title": "string",
          "image_url": "string",
          "description": "string",
          "location": "string",
          "upload_date": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

### 6.2 上传照片

*   **功能描述:** 上传新照片
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/photos/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    title: string              // 照片标题 (必需)
    image: file               // 图片文件 (必需)
    description: string       // 描述 (可选)
    location: string          // 地点 (可选)
    is_public: boolean        // 是否公开 (可选，默认true)
    ```

### 6.3 获取照片详情

*   **HTTP 方法:** `GET`
*   **URL 路径:** `/photos/<int:pk>/`

### 6.4 更新照片

*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/photos/<int:pk>/`

### 6.5 删除照片

*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/photos/<int:pk>/`

---

## 7. 音乐相关接口

### 7.1 获取音乐列表

*   **功能描述:** 获取所有音乐列表，支持分页、搜索和分类
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/`
*   **需要认证:** 是
*   **请求参数:**
    - `page`: 页码 (可选，默认1)
    - `page_size`: 每页数量 (可选，默认10)
    - `search`: 搜索关键词 (可选，搜索标题和艺术家)
    - `category`: 分类 (可选，如：流行、摇滚、民谣等)
    - `sort`: 排序方式 (可选，如：latest, popular, name)
*   **响应体 (JSON):**
    ```json
    {
      "total": "integer",        // 总条数
      "page": "integer",         // 当前页码
      "page_size": "integer",    // 每页数量
      "music": [
        {
          "id": "integer",
          "title": "string",          // 歌曲名称
          "artist": "string",         // 艺术家
          "file_url": "string",       // 音乐文件URL
          "cover_url": "string",      // 封面图片URL
          "duration": "integer",      // 时长(秒)
          "category": "string",       // 分类
          "created_at": "YYYY-MM-DD HH:MM:SS",
          "is_favorite": "boolean",   // 是否已收藏
          "play_count": "integer"     // 播放次数
        }
      ]
    }
    ```

### 7.2 上传音乐文件

*   **功能描述:** 上传新音乐文件
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/music/upload/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    file: file               // 音乐文件 (必需，支持mp3, wav格式)
    ```
*   **响应体 (JSON):**
    ```json
    {
      "file_url": "string"   // 音乐文件访问URL
    }
    ```

### 7.3 上传封面图片

*   **功能描述:** 上传音乐封面图片
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/music/upload-cover/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    file: file               // 图片文件 (必需，支持jpg, png格式)
    ```
*   **响应体 (JSON):**
    ```json
    {
      "cover_url": "string"  // 封面图片访问URL
    }
    ```

### 7.4 创建音乐

*   **功能描述:** 创建新音乐记录
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/music/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "title": "string",          // 歌曲名称 (必需)
      "artist": "string",         // 艺术家 (必需)
      "file_url": "string",       // 音乐文件URL (必需)
      "cover_url": "string",      // 封面图片URL (可选)
      "duration": "integer",      // 时长(秒) (可选)
      "category": "string"        // 分类 (可选)
    }
    ```

### 7.5 更新音乐

*   **功能描述:** 更新音乐信息
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/music/<int:pk>/`
*   **需要认证:** 是
*   **请求体 (JSON):** 传递需要更新的字段

### 7.6 删除音乐

*   **功能描述:** 删除音乐记录
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/music/<int:pk>/`
*   **需要认证:** 是

### 7.7 收藏/取消收藏音乐

*   **功能描述:** 收藏或取消收藏音乐
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/music/<int:pk>/favorite/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "is_favorite": "boolean"    // 当前收藏状态
    }
    ```

### 7.8 获取收藏列表

*   **功能描述:** 获取用户收藏的音乐列表
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/favorites/`
*   **需要认证:** 是
*   **请求参数:** 同音乐列表接口
*   **响应体 (JSON):** 同音乐列表接口

### 7.9 歌单管理

#### 7.9.1 创建歌单

*   **功能描述:** 创建新歌单
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/playlists/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "name": "string",           // 歌单名称 (必需)
      "description": "string",    // 描述 (可选)
      "cover_url": "string",      // 封面图片URL (可选)
      "is_public": "boolean"      // 是否公开 (可选，默认true)
    }
    ```

#### 7.9.2 获取歌单列表

*   **功能描述:** 获取用户的歌单列表
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/playlists/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "playlists": [
        {
          "id": "integer",
          "name": "string",
          "description": "string",
          "cover_url": "string",
          "is_public": "boolean",
          "music_count": "integer",
          "created_at": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

#### 7.9.3 获取歌单详情

*   **功能描述:** 获取歌单详情及包含的音乐列表
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/playlists/<int:pk>/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "cover_url": "string",
      "is_public": "boolean",
      "created_at": "YYYY-MM-DD HH:MM:SS",
      "music": [
        {
          "id": "integer",
          "title": "string",
          "artist": "string",
          "file_url": "string",
          "cover_url": "string",
          "duration": "integer"
        }
      ]
    }
    ```

#### 7.9.4 更新歌单

*   **功能描述:** 更新歌单信息
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/playlists/<int:pk>/`
*   **需要认证:** 是

#### 7.9.5 删除歌单

*   **功能描述:** 删除歌单
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/playlists/<int:pk>/`
*   **需要认证:** 是

#### 7.9.6 添加音乐到歌单

*   **功能描述:** 向歌单添加音乐
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/playlists/<int:pk>/add-music/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "music_id": "integer"    // 音乐ID (必需)
    }
    ```

#### 7.9.7 从歌单移除音乐

*   **功能描述:** 从歌单移除音乐
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/playlists/<int:pk>/remove-music/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "music_id": "integer"    // 音乐ID (必需)
    }
    ```

### 7.10 播放历史

#### 7.10.1 获取播放历史

*   **功能描述:** 获取用户的播放历史记录
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/history/`
*   **需要认证:** 是
*   **请求参数:** 同音乐列表接口
*   **响应体 (JSON):**
    ```json
    {
      "total": "integer",
      "page": "integer",
      "page_size": "integer",
      "history": [
        {
          "id": "integer",
          "music": {
            "id": "integer",
            "title": "string",
            "artist": "string",
            "file_url": "string",
            "cover_url": "string",
            "duration": "integer"
          },
          "played_at": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

#### 7.10.2 添加播放记录

*   **功能描述:** 添加音乐播放记录
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/music/history/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "music_id": "integer"    // 音乐ID (必需)
    }
    ```

#### 7.10.3 清空播放历史

*   **功能描述:** 清空用户的播放历史记录
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/music/history/`
*   **需要认证:** 是

### 7.11 背景音乐设置

#### 7.11.1 获取背景音乐设置

*   **功能描述:** 获取用户的背景音乐设置
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/background/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "music_id": "integer or null",    // 背景音乐ID
      "volume": "float",                // 音量 (0-1)
      "is_enabled": "boolean"           // 是否启用
    }
    ```

#### 7.11.2 更新背景音乐设置

*   **功能描述:** 更新用户的背景音乐设置
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/music/background/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "music_id": "integer",    // 背景音乐ID (可选)
      "volume": "float",        // 音量 (可选，0-1)
      "is_enabled": "boolean"   // 是否启用 (可选)
    }
    ```

### 7.12 获取音乐分类列表

*   **功能描述:** 获取音乐分类列表
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/categories/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "categories": ["流行", "摇滚", "民谣", "古典"]
    }
    ```

---

## 8. 心情记录接口

### 8.1 获取心情列表

*   **功能描述:** 获取所有心情记录列表
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/moods/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "moods": [
        {
          "id": "integer",
          "mood_type": "string",     // 心情类型: happy, sad, angry, excited, calm, love
          "description": "string",
          "emoji": "string",
          "created_at": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

### 8.2 创建心情记录

*   **功能描述:** 创建新的心情记录
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/moods/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "mood_type": "string",     // 心情类型 (必需)
      "description": "string",   // 描述 (可选)
      "emoji": "string"          // 心情表情 (必需)
    }
    ```

### 8.3 其他心情记录操作

*   **获取详情:** `GET /moods/<int:pk>/`
*   **更新:** `PUT /moods/<int:pk>/`
*   **删除:** `DELETE /moods/<int:pk>/`

---

## 9. 评论相关接口

### 9.1 获取评论列表

*   **功能描述:** 获取指定日记下的评论及回复
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/diaries/<int:diary_id>/comments/`
*   **需要认证:** 是
*   **响应体 (JSON):**
    ```json
    {
      "comments": [
        {
          "id": "integer",
          "content": "string",
          "created_at": "YYYY-MM-DD HH:MM:SS",
          "replies": [
            {
              "id": "integer",
              "content": "string",
              "created_at": "YYYY-MM-DD HH:MM:SS"
            }
          ]
        }
      ]
    }
    ```

### 9.2 添加评论

*   **功能描述:** 在指定日记下添加评论或回复
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/diaries/<int:diary_id>/comments/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "content": "string",       // 评论内容 (必需)
      "parent_id": "integer"     // 父评论ID (可选，回复时使用)
    }
    ```

### 9.3 其他评论操作

*   **获取详情:** `GET /comments/<int:pk>/`
*   **更新:** `PUT /comments/<int:pk>/`
*   **删除:** `DELETE /comments/<int:pk>/`

---

## 权限说明

### 情侣空间权限模型

1. **日记模块**
   - 只能查看自己和绑定伴侣的日记
   - 只能编辑/删除自己创建的日记
   - 伴侣可以查看但不能编辑对方的日记

2. **纪念日模块**
   - 情侣空间成员都可以添加、编辑、删除纪念日
   - 只能操作本情侣空间下的纪念日

3. **其他模块**
   - 照片、音乐、心情记录：按照原有权限控制
   - 评论：可以对可见的日记进行评论

### 错误码说明

*   **200:** 请求成功
*   **201:** 创建成功
*   **400:** 请求参数错误
*   **401:** 未认证
*   **403:** 权限不足
*   **404:** 资源不存在或无权访问
*   **500:** 服务器内部错误

### 认证说明

所有需要认证的接口都需要在请求头中添加：
```
Authorization: Token <your_token>
```

获取 Token 的方式：
1. 通过注册接口获取
2. 通过登录接口获取 