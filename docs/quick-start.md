# 快速开始指南

欢迎使用 Clash Residential Proxy Parser！本指南将在 5 分钟内帮您完成配置。

## 📋 前置要求

- ✅ Clash Premium 或 Clash Meta (mihomo)
- ✅ 支持 Parsers 的 Clash 客户端
- ✅ 您的住宅代理账号信息

## 🚀 三种使用方式

### 方式一：网页生成器（最简单）⭐

**适合：所有用户，特别是新手**

#### 步骤 1：打开生成器

```bash
# 下载项目
git clone https://github.com/NineThoughts0521/clash-residential-proxy-parser.git

# 进入目录
cd clash-residential-proxy-parser

# 打开网页生成器（双击或拖入浏览器）
tools/config-generator.html
```

#### 步骤 2：填写信息

在网页中填写以下信息：

| 字段       | 说明         | 示例              |
| ---------- | ------------ | ----------------- |
| 代理名称   | 节点显示名称 | 🏠 美国家宽        |
| 服务器地址 | IP 或域名    | proxy.example.com |
| 端口       | 代理端口     | 443               |
| 用户名     | 认证用户名   | myusername        |
| 密码       | 认证密码     | mypassword        |

#### 步骤 3：生成脚本

1. 点击 **"🚀 生成配置"** 按钮
2. 点击 **"📋 复制代码"** 按钮

#### 步骤 4：配置 Clash

**Clash for Windows:**
1. 打开 `设置` → `配置` → `Parsers`
2. 点击 `Edit` 编辑
3. 添加以下内容：

```yaml
parsers:
  - url: https://你的订阅链接
    code: |
      # 在这里粘贴刚才复制的代码
```

4. 保存并更新订阅

**Clash Verge:**
1. 打开 `订阅` 页面
2. 右键点击订阅 → `编辑信息`
3. 在 `预处理` 栏粘贴代码
4. 保存并更新

#### 步骤 5：使用代理

1. 更新订阅后，在节点列表中找到 `🏠 美国家宽`
2. 在需要的策略组中选择此节点
3. 在 `🇺🇸 家宽前置路由` 中选择 `美国节点`（推荐）
4. 开始使用！

---

### 方式二：直接使用脚本

**适合：熟悉代码的用户**

#### 步骤 1：下载脚本

```bash
# 完整版（推荐）
wget https://raw.githubusercontent.com/NineThoughts0521/clash-residential-proxy-parser/main/scripts/residential_proxy_prepend.js

# 或精简版
wget https://raw.githubusercontent.com/NineThoughts0521/clash-residential-proxy-parser/main/scripts/residential_proxy_simple.js
```

#### 步骤 2：修改配置

打开下载的脚本，找到 `CONFIG` 部分：

```javascript
const CONFIG = {
  residentialProxy: {
    name: "🏠 美国住宅代理",        // 改成您的名称
    server: "proxy.example.com",          // 改成您的服务器
    port: 443,                         // 改成您的端口
    username: "your_username",          // 改成您的用户名
    password: "your_password",            // 改成您的密码
    // ...
  }
};
```

#### 步骤 3：添加到 Clash

复制整个脚本内容，粘贴到 Clash 的 Parsers 配置中。

---

### 方式三：命令行生成器

**适合：开发者和批量处理**

#### 前置要求

- Node.js 12.0 或更高版本

#### 使用步骤

```bash
# 1. 进入工具目录
cd tools

# 2. 运行生成器
node config-generator-cli.js

# 3. 按提示输入信息（或回车使用默认值）
代理名称 [默认: 🏠 美国住宅代理]: 🏠 我的家宽
服务器地址 [默认: proxy.example.com]: 1.2.3.4
端口 [默认: 443]: 8080
用户名 [默认: your_username]: myuser
密码 [默认: your_password]: mypass
...

# 4. 生成完成！脚本已自动保存
✅ 配置生成成功！
📁 文件已保存: residential_proxy_full_1234567890.js
```

---

## 🎯 验证配置

### 检查节点列表

更新订阅后，检查：
- ✅ 是否出现 `🏠 美国家宽`（或您设置的名称）
- ✅ 是否出现 `🇺🇸 家宽前置路由` 策略组

### 检查策略组

在以下策略组中应该能看到家宽代理：
- Proxies
- Netflix
- AI
- TikTok
- DisneyPlus
- HBO
- YouTube
- ✈️Final

### 测试连接

1. 选择 Netflix 策略组 → `🏠 美国家宽`
2. 选择 `🇺🇸 家宽前置路由` → `DIRECT`
3. 访问 Netflix，检查是否正常

---

## 💡 常见问题

### Q1: 更新订阅后看不到新节点？

**解决方案**：
1. 检查 Parsers 配置是否正确保存
2. 确认订阅 URL 与 Parsers 中的 URL 匹配
3. 查看 Clash 日志是否有错误信息
4. 尝试完全重启 Clash

### Q2: 节点无法连接？

**检查项**：
- ✅ 服务器地址和端口是否正确
- ✅ 用户名和密码是否正确
- ✅ 代理服务是否正常运行
- ✅ 防火墙是否拦截

### Q3: 脚本会影响现有配置吗？

**不会**。脚本只是添加新内容，不修改现有节点和策略组。

---

## 🆘 需要帮助？

- 💬 [GitHub Discussions](https://github.com/NineThoughts0521/clash-residential-proxy-parser/discussions)
- 🐛 [提交 Issue](https://github.com/NineThoughts0521/clash-residential-proxy-parser/issues)
- 📧 Email: ninethoughts0521@outlook.com

---

**恭喜！您已经完成了基础配置！** 🎉
