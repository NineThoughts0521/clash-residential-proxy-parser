# 贡献指南

感谢您考虑为 Clash Residential Proxy Parser 项目做出贡献！

## 🤝 如何贡献

### 报告 Bug

如果您发现了 bug，请：

1. 检查 [Issues](https://github.com/NineThoughts0521/clash-residential-proxy-parser/issues) 确保问题尚未被报告
2. 创建新的 Issue，包含：
   - 清晰的标题和描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 截图（如适用）
   - 环境信息（操作系统、Clash 版本等）
   - 相关日志

### 提出新功能

1. 先在 [Discussions](https://github.com/NineThoughts0521/clash-residential-proxy-parser/discussions) 中讨论
2. 获得反馈后，创建 Feature Request Issue
3. 详细描述功能需求和使用场景

### 提交代码

1. **Fork 项目**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   ```

2. **克隆您的 Fork**
   ```bash
   git clone https://github.com/NineThoughts0521/clash-residential-proxy-parser.git
   cd clash-residential-proxy-parser
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **进行更改**
   - 遵循现有代码风格
   - 添加必要的注释
   - 更新相关文档

5. **测试您的更改**
   - 确保脚本可以正常生成
   - 在实际 Clash 环境中测试
   - 检查是否有语法错误

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   # 或
   git commit -m "fix: resolve some bug"
   ```

   **提交信息规范**：
   - `feat:` 新功能
   - `fix:` Bug 修复
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 代码重构
   - `test:` 测试相关
   - `chore:` 构建/工具相关

7. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**
   - 在 GitHub 上点击 "New Pull Request"
   - 填写 PR 模板
   - 等待审核

## 📝 代码规范

### JavaScript 代码风格

```javascript
// ✅ 好的示例
const CONFIG = {
  proxy: {
    name: "My Proxy",
    server: "1.2.3.4"
  }
};

function processConfig(config) {
  if (!config) {
    console.error("Invalid config");
    return null;
  }
  return config;
}

// ❌ 避免
var config={proxy:{name:"My Proxy",server:"1.2.3.4"}};
function processConfig(config){if(!config){console.error("Invalid config");return null;}return config;}
```

### 注释规范

```javascript
/**
 * 处理配置对象
 * @param {Object} config - Clash 配置对象
 * @returns {Object} 处理后的配置对象
 */
function processConfig(config) {
  // 实现逻辑
}
```

### 文档规范

- 使用 Markdown 格式
- 中文文档使用中文标点
- 英文文档使用英文标点
- 代码块使用正确的语法高亮

## 🧪 测试

在提交 PR 前，请确保：

1. **功能测试**
   - 在 Clash for Windows / Clash Verge 中测试
   - 验证生成的脚本可以正常工作
   - 检查日志输出是否正确

2. **边界测试**
   - 测试空配置
   - 测试重复添加
   - 测试无效输入

3. **兼容性测试**
   - 在不同 Clash 版本中测试（如可能）
   - 在不同操作系统中测试（如可能）

## 📄 文档贡献

文档同样重要！您可以：

- 修正错别字或语法错误
- 改进现有文档的清晰度
- 添加新的使用示例
- 翻译文档到其他语言
- 添加截图或图表

## 🎨 设计贡献

欢迎改进：

- 配置生成器的 UI/UX
- 项目 Logo 或图标
- README 中的图表或示意图
- 文档中的可视化元素

## 💬 社区准则

### 行为准则

- 尊重他人
- 保持友好和专业
- 欢迎新贡献者
- 提供建设性的反馈
- 避免人身攻击或歧视性言论

### 沟通渠道

- **Issues** - Bug 报告和功能请求
- **Pull Requests** - 代码贡献
- **Discussions** - 一般讨论和问题

## 🏆 贡献者

感谢所有贡献者！

<!-- 
贡献者列表会自动生成
可以使用 all-contributors 等工具
-->

## 📮 联系方式

如有任何问题，请通过以下方式联系：

- 📧 Email: ninethoughts0521@outlook.com
- 💬 GitHub Discussions
- 🐛 GitHub Issues

---

再次感谢您的贡献！🎉
