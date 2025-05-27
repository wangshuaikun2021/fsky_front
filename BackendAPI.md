### API 接口文档

**基础 URL:** 根据你的 Django 项目运行情况而定，例如 `http://127.0.0.1:8000/love_diary/`

---

#### 1. 用户认证相关接口

**1.1 用户注册**

*   **功能描述:** 创建一个新的用户账号。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/register/`
*   **需要认证:** 否
*   **请求体 (JSON):**
    ```json
    {
      "username": "string", // 用户名 (必需)
      "password": "string", // 密码 (必需)
      "nickname": "string"  // 昵称 (可选)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "token": "string", // 用于后续请求的认证 Token
          "user": {
            "id": "integer",      // 用户ID
            "username": "string", // 用户名
            "nickname": "string"  // 用户昵称
          }
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息，例如 "用户名已存在"
        }
        ```

**1.2 用户登录**

*   **功能描述:** 使用用户名和密码进行登录，获取认证 Token。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/login/`
*   **需要认证:** 否
*   **请求体 (JSON):**
    ```json
    {
      "username": "string", // 用户名 (必需)
      "password": "string"  // 密码 (必需)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "token": "string", // 用于后续请求的认证 Token
          "user": {
            "id": "integer",      // 用户ID
            "username": "string", // 用户名
            "nickname": "string"  // 用户昵称
          }
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息，例如 "用户名或密码错误"
        }
        ```

**1.3 用户登出**

*   **功能描述:** 使当前用户的认证 Token 失效。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/logout/`
*   **需要认证:** 是 (通过 `Authorization: Token <token_value>` 头传递 Token)
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```

**1.4 绑定伴侣**

*   **功能描述:** 将当前用户与另一个用户账号绑定为伴侣关系。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/bind-partner/`
*   **需要认证:** 是 (通过 `Authorization: Token <token_value>` 头传递 Token)
*   **请求体 (JSON):**
    ```json
    {
      "partner_username": "string" // 对方的用户名 (必需)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息，例如 "已经绑定伴侣", "对方已经绑定伴侣", "伴侣不存在"
        }
        ```

---

#### 2. 恋爱设置接口

**2.1 获取恋爱设置**

*   **功能描述:** 获取当前用户的恋爱设置信息。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/love-settings/`
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "couple_name": "string",        // 情侣名称
          "start_date": "YYYY-MM-DD",   // 恋爱开始日期
          "anniversary_dates": {}       // 纪念日列表 (JSON对象)
        }
        ```

**2.2 更新恋爱设置**

*   **功能描述:** 更新当前用户的恋爱设置信息。如果没有设置，则新建一条。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/love-settings/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "couple_name": "string",      // 新的情侣名称 (必需)
      "start_date": "YYYY-MM-DD", // 新的恋爱开始日期 (必需)
      "anniversary_dates": {}     // 新的纪念日列表 (JSON对象, 必需，即使为空也需传递{})
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```

---

#### 3. 照片相关接口

**3.1 获取照片列表**

*   **功能描述:** 获取公开的照片列表。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/photos/`
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "photos": [
            {
              "id": "integer",             // 照片ID
              "title": "string",           // 标题
              "image_url": "string",       // 图片文件的相对URL
              "description": "string",     // 描述
              "location": "string",        // 地点
              "upload_date": "YYYY-MM-DD HH:MM:SS" // 上传时间
            },
            // ... 更多照片对象
          ]
        }
        ```

**3.2 获取照片详情**

*   **功能描述:** 获取指定 ID 的公开照片详情。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/photos/<int:pk>/` (将 `<int:pk>` 替换为照片的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "id": "integer",             // 照片ID
          "title": "string",           // 标题
          "image_url": "string",       // 图片文件的相对URL
          "description": "string",     // 描述
          "location": "string",        // 地点
          "upload_date": "YYYY-MM-DD HH:MM:SS" // 上传时间
        }
        ```
    *   **未找到 (状态码 404):** 如果指定 ID 的照片不存在或不是公开的。

**3.3 上传照片**

*   **功能描述:** 上传新的照片。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/photos/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    title: string           // 照片标题 (必需)
    description: string     // 照片描述 (可选)
    location: string        // 拍摄地点 (可选)
    is_public: boolean      // 是否公开 (可选，默认 true)
    image: file            // 图片文件 (必需，支持常见图片格式)
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 201):**
        ```json
        {
          "photo_id": "integer" // 新创建的照片ID
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**3.4 更新照片**

*   **功能描述:** 更新指定 ID 的照片信息。
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/photos/<int:pk>/` (将 `<int:pk>` 替换为照片的实际 ID)
*   **需要认证:** 是
*   **请求体 (application/x-www-form-urlencoded):**
    ```
    title: string           // 新的照片标题 (可选)
    description: string     // 新的照片描述 (可选)
    location: string        // 新的拍摄地点 (可选)
    is_public: boolean      // 新的公开状态 (可选)
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 400/404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**3.5 删除照片**

*   **功能描述:** 删除指定 ID 的照片。
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/photos/<int:pk>/` (将 `<int:pk>` 替换为照片的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

---

#### 4. 日记相关接口

**4.1 获取日记列表**

*   **功能描述:** 获取公开的日记列表。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/diaries/`
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "diaries": [
            {
              "id": "integer",             // 日记ID
              "title": "string",           // 标题
              "content": "string",         // 内容 (包含HTML)
              "created_at": "YYYY-MM-DD HH:MM:SS", // 创建时间
              "mood": "string" or null     // 心情类型，如果有关联的心情记录
            },
            // ... 更多日记对象
          ]
        }
        ```

**4.2 获取日记详情**

*   **功能描述:** 获取指定 ID 的公开日记详情。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/diaries/<int:pk>/` (将 `<int:pk>` 替换为日记的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "id": "integer",             // 日记ID
          "title": "string",           // 标题
          "content": "string",         // 内容 (包含HTML)
          "created_at": "YYYY-MM-DD HH:MM:SS", // 创建时间
          "mood": "string" or null     // 心情类型，如果有关联的心情记录
        }
        ```
    *   **未找到 (状态码 404):** 如果指定 ID 的日记不存在或不是公开的。

**4.3 创建日记**

*   **功能描述:** 创建新的日记。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/diaries/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "title": "string",      // 日记标题 (必需)
      "content": "string",    // 日记内容 (必需，支持HTML)
      "mood_id": "integer" or null, // 关联的心情记录ID (可选)
      "is_public": "boolean"  // 是否公开 (可选，默认 true)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 201):**
        ```json
        {
          "diary_id": "integer" // 新创建的日记ID
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**4.4 更新日记**

*   **功能描述:** 更新指定 ID 的日记。
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/diaries/<int:pk>/` (将 `<int:pk>` 替换为日记的实际 ID)
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "title": "string",      // 新的日记标题 (可选)
      "content": "string",    // 新的日记内容 (可选，支持HTML)
      "mood_id": "integer" or null, // 新的关联心情记录ID (可选)
      "is_public": "boolean"  // 新的公开状态 (可选)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 400/404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**4.5 删除日记**

*   **功能描述:** 删除指定 ID 的日记。
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/diaries/<int:pk>/` (将 `<int:pk>` 替换为日记的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

---

#### 5. 评论相关接口

**5.1 获取评论列表**

*   **功能描述:** 获取指定日记下的顶级评论及其回复。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/diaries/<int:diary_id>/comments/` (将 `<int:diary_id>` 替换为日记的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "comments": [
            {
              "id": "integer",             // 评论ID
              "content": "string",         // 评论内容
              "created_at": "YYYY-MM-DD HH:MM:SS", // 评论时间
              "replies": [
                {
                  "id": "integer",           // 回复ID
                  "content": "string",       // 回复内容
                  "created_at": "YYYY-MM-DD HH:MM:SS" // 回复时间
                },
                // ... 更多回复对象
              ]
            },
            // ... 更多顶级评论对象
          ]
        }
        ```
    *   **未找到日记 (状态码 404):** 如果指定 ID 的日记不存在或不是公开的。

**5.2 添加评论**

*   **功能描述:** 在指定日记下添加新的评论或回复。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/diaries/<int:diary_id>/comments/` (将 `<int:diary_id>` 替换为日记的实际 ID)
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "content": "string",      // 评论内容 (必需)
      "parent_id": "integer" or null // 如果是回复，填写父评论的 ID；如果是顶级评论，填写 null
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success",
          "comment_id": "integer" // 新创建的评论ID
        }
        ```
    *   **未找到日记 (状态码 404):** 如果指定 ID 的日记不存在或不是公开的。

**5.3 获取评论详情**

*   **功能描述:** 获取指定 ID 的评论详情。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/comments/<int:pk>/` (将 `<int:pk>` 替换为评论的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "id": "integer",             // 评论ID
          "content": "string",         // 评论内容
          "created_at": "YYYY-MM-DD HH:MM:SS", // 评论时间
          "diary_id": "integer"        // 关联日记的ID
        }
        ```
    *   **未找到 (状态码 404):** 如果指定 ID 的评论不存在。

**5.4 更新评论**

*   **功能描述:** 更新指定 ID 的评论内容。
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/comments/<int:pk>/` (将 `<int:pk>` 替换为评论的实际 ID)
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "content": "string" // 新的评论内容 (必需)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 400/404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**5.5 删除评论**

*   **功能描述:** 删除指定 ID 的评论。
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/comments/<int:pk>/` (将 `<int:pk>` 替换为评论的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

---

#### 6. 音乐相关接口

**6.1 获取音乐列表**

*   **功能描述:** 获取所有音乐列表。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/`
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "music": [
            {
              "id": "integer",             // 音乐ID
              "title": "string",           // 歌曲名称
              "artist": "string",          // 艺术家
              "file_url": "string",        // 音乐文件的相对URL
              "cover_image_url": "string" or null, // 封面图片的相对URL，如果存在
              "duration": "integer"        // 时长 (秒)
            },
            // ... 更多音乐对象
          ]
        }
        ```

**6.2 获取音乐详情**

*   **功能描述:** 获取指定 ID 的音乐详情。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/music/<int:pk>/` (将 `<int:pk>` 替换为音乐的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "id": "integer",             // 音乐ID
          "title": "string",           // 歌曲名称
          "artist": "string",          // 艺术家
          "file_url": "string",        // 音乐文件的相对URL
          "cover_image_url": "string" or null, // 封面图片的相对URL，如果存在
          "duration": "integer"        // 时长 (秒)
        }
        ```
    *   **未找到 (状态码 404):** 如果指定 ID 的音乐不存在。

**6.3 上传音乐**

*   **功能描述:** 上传新的音乐文件。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/music/`
*   **需要认证:** 是
*   **请求体 (multipart/form-data):**
    ```
    title: string           // 歌曲名称 (必需)
    artist: string          // 艺术家 (必需)
    duration: integer       // 时长(秒) (必需)
    file: file             // 音乐文件 (必需，支持常见音频格式)
    cover_image: file      // 封面图片 (可选，支持常见图片格式)
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 201):**
        ```json
        {
          "music_id": "integer" // 新创建的音乐ID
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**6.4 更新音乐**

*   **功能描述:** 更新指定 ID 的音乐信息。
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/music/<int:pk>/` (将 `<int:pk>` 替换为音乐的实际 ID)
*   **需要认证:** 是
*   **请求体 (application/x-www-form-urlencoded):**
    ```
    title: string           // 新的歌曲名称 (可选)
    artist: string          // 新的艺术家 (可选)
    duration: integer       // 新的时长(秒) (可选)
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 400/404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**6.5 删除音乐**

*   **功能描述:** 删除指定 ID 的音乐。
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/music/<int:pk>/` (将 `<int:pk>` 替换为音乐的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

---

#### 7. 心情记录接口

**7.1 获取心情列表**

*   **功能描述:** 获取所有心情记录列表。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/moods/`
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "moods": [
            {
              "id": "integer",             // 心情记录ID
              "mood_type": "string",       // 心情类型 (例如: "happy", "sad")
              "description": "string",     // 描述
              "emoji": "string",           // 心情表情 (UTF8mb4 字符)
              "created_at": "YYYY-MM-DD HH:MM:SS" // 记录时间
            },
            // ... 更多心情记录对象
          ]
        }
        ```

**7.2 获取心情详情**

*   **功能描述:** 获取指定 ID 的心情记录详情。
*   **HTTP 方法:** `GET`
*   **URL 路径:** `/moods/<int:pk>/` (将 `<int:pk>` 替换为心情记录的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "id": "integer",             // 心情记录ID
          "mood_type": "string",       // 心情类型
          "description": "string",     // 描述
          "emoji": "string",           // 心情表情
          "created_at": "YYYY-MM-DD HH:MM:SS" // 记录时间
        }
        ```
    *   **未找到 (状态码 404):** 如果指定 ID 的心情记录不存在。

**7.3 创建心情记录**

*   **功能描述:** 创建新的心情记录。
*   **HTTP 方法:** `POST`
*   **URL 路径:** `/moods/`
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "mood_type": "string",    // 心情类型 (必需)
      "description": "string",  // 描述 (可选)
      "emoji": "string"        // 心情表情 (可选)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 201):**
        ```json
        {
          "mood_id": "integer" // 新创建的心情记录ID
        }
        ```
    *   **失败 (状态码 400):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**7.4 更新心情记录**

*   **功能描述:** 更新指定 ID 的心情记录。
*   **HTTP 方法:** `PUT`
*   **URL 路径:** `/moods/<int:pk>/` (将 `<int:pk>` 替换为心情记录的实际 ID)
*   **需要认证:** 是
*   **请求体 (JSON):**
    ```json
    {
      "mood_type": "string",    // 新的心情类型 (可选)
      "description": "string",  // 新的描述 (可选)
      "emoji": "string"        // 新的心情表情 (可选)
    }
    ```
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 400/404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

**7.5 删除心情记录**

*   **功能描述:** 删除指定 ID 的心情记录。
*   **HTTP 方法:** `DELETE`
*   **URL 路径:** `/moods/<int:pk>/` (将 `<int:pk>` 替换为心情记录的实际 ID)
*   **需要认证:** 是
*   **请求体:** 无
*   **响应体 (JSON):**
    *   **成功 (状态码 200):**
        ```json
        {
          "status": "success"
        }
        ```
    *   **失败 (状态码 404):**
        ```json
        {
          "error": "string" // 错误信息
        }
        ```

---

**注意:**

*   所有需要认证的接口，都需要在 HTTP 请求头中加入 `Authorization: Token <你的token>`。
*   文件上传（照片、音乐）的接口支持常见的文件格式，具体支持的格式取决于服务器配置。
*   所有接口的响应状态码都遵循 RESTful API 的标准：
  * 200: 请求成功
  * 201: 创建成功
  * 400: 请求参数错误
  * 401: 未认证
  * 403: 权限不足
  * 404: 资源不存在
  * 500: 服务器内部错误 