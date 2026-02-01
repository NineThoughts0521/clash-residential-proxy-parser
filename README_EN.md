# 🏠 Clash Residential Proxy Parser

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/NineThoughts0521/clash-residential-proxy-parser)](https://github.com/NineThoughts0521/clash-residential-proxy-parser/releases)
[![GitHub stars](https://img.shields.io/github/stars/NineThoughts0521/clash-residential-proxy-parser)](https://github.com/NineThoughts0521/clash-residential-proxy-parser/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/NineThoughts0521/clash-residential-proxy-parser/pulls)

**Smart pre-processing scripts for adding residential proxies to Clash subscriptions**

English | [简体中文](./README.md)

[Features](#-features) • [Quick Start](#-quick-start) • [Config Generator](#️-config-generator) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Introduction

This project provides a complete toolchain to easily add residential proxy nodes to your Clash subscription configuration with flexible pre-routing options.

### 🎯 Problems Solved

- ✅ Streaming services like Netflix and Disney+ require real residential IPs.
- ✅ AI services like ChatGPT and OpenAI strictly limit datacenter IPs.
- ✅ Some websites detect and block datacenter IPs.
- ✅ Need for higher anonymity and authenticity.

### 💡 How It Works


```

┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────┐
│  Your   │───▶│  Pre-routing │───▶│ Residential  │───▶│ Target  │
│ Device  │    │(DIRECT/Node) │    │    Proxy     │    │  Site   │
└─────────┘    └──────────────┘    └──────────────┘    └─────────┘

```

**Key Features**:
- 🔄 Support DIRECT or airport nodes as pre-routing.
- 🎯 Auto-add to Netflix, AI, YouTube, and other policy groups.
- 🛡️ Prevent circular references and duplicate additions.
- 📝 Detailed log output.
- ⚡ Plug and play, no subscription link modification needed.

---

## ✨ Features

### Core Features

| Feature                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| 🏠 **Residential Proxy** | Add HTTP/HTTPS/SOCKS5 residential proxy nodes  |
| 🔀 **Pre-routing**       | Choose DIRECT or any airport node as pre-route |
| 🎯 **Smart Groups**      | Auto-add to Proxies, Netflix, AI, etc.         |
| 🛡️ **Safety**            | Prevent circular references and duplicates     |
| 📊 **Logging**           | Detailed runtime logs for debugging            |
| ⚙️ **Flexible**          | Support both full and simple script versions   |

### Advanced Features

- ✅ **Idempotency Guarantee** - Multiple runs won't create duplicates.
- ✅ **Complete Validation** - Auto-detect configuration validity.
- ✅ **High Compatibility** - Support Clash Premium / Meta (mihomo).
- ✅ **Easy to Extend** - Clear code structure for customization.

---

## 🚀 Quick Start

### Method 1: Use Config Generator (Recommended)

1. **Open Config Generator**
   ```bash
   # Clone repository
   git clone https://github.com/NineThoughts0521/clash-residential-proxy-parser.git
   cd clash-residential-proxy-parser
   
   # Open web generator
   open tools/config-generator.html  # macOS
   # Or double-click tools/config-generator.html

```

2. **Fill in Your Proxy Info**
* Server Address
* Port
* Username
* Password


3. **Generate and Copy Script**
* Click "🚀 Generate Config"
* Click "📋 Copy Code"


4. **Configure Clash Client**
**Clash for Windows / Clash Verge:**
```yaml
parsers:
  - url: https://your-subscription-link
    code: |
      # Paste the copied code here

```


**Done!** Update your subscription to use.

### Method 2: Use Script Directly

1. **Download Script**
```bash
# Full version (Recommended)
wget https://raw.githubusercontent.com/NineThoughts0521/clash-residential-proxy-parser/main/scripts/residential_proxy_prepend.js

# Or simple version
wget https://raw.githubusercontent.com/NineThoughts0521/clash-residential-proxy-parser/main/scripts/residential_proxy_simple.js

```


2. **Modify Configuration**
Edit the `CONFIG` section in the script:
```javascript
const CONFIG = {
  residentialProxy: {
    name: "🏠 Your Proxy Name",
    server: "your.server.address",
    port: your_port,
    username: "your_username",
    password: "your_password",
    // ...
  }
};

```


3. **Add to Clash**
Paste the modified script into the Parsers configuration.

---

## 🛠️ Config Generator

This project provides **3** configuration generation tools:

### 1. Web Generator (Easiest) ✨

📁 `tools/config-generator.html`

**Features**:

* ✅ Visual interface, no programming knowledge required.
* ✅ Real-time preview of generation results.
* ✅ One-click copy for fast deployment.
* ✅ Supports preset templates.

**Usage**:

```bash
# Open directly in browser
open tools/config-generator.html

```

### 2. CLI Generator (Batch Processing)

📁 `tools/config-generator-cli.js`

**Features**:

* ✅ Interactive command-line interface.
* ✅ Supports batch generation.
* ✅ Automatically saves files.

**Usage**:

```bash
# Requires Node.js environment
node tools/config-generator-cli.js

```

### 3. JSON Template (Config Management)

📁 `tools/config-template.json`

**Features**:

* ✅ Structured configuration.
* ✅ Version control friendly.
* ✅ Supports multi-config management.

---

## 📚 Documentation

### Basic Documentation

* [Quick Start Guide](docs/quick-start.md) - 5-minute tutorial

---

## 🎯 Use Cases

### Scenario 1: Netflix / Disney+ Streaming

```
Recommended Config:
- Pre-routing: DIRECT
- Policy Groups: Netflix, DisneyPlus, HBO

Advantages:
✅ Real residential IP, not detected as a proxy.
✅ Bypass geo-restrictions.
✅ Stable streaming playback.

```

### Scenario 2: ChatGPT / OpenAI

```
Recommended Config:
- Pre-routing: DIRECT
- Policy Groups: AI

Advantages:
✅ Avoid datacenter IP bans.
✅ Lower risk of triggering security controls.
✅ More stable API access.

```

### Scenario 3: Privacy Protection (Double Proxy)

```
Recommended Config:
- Pre-routing: Hong Kong/Japan Node
- Policy Groups: Proxies, Final

Advantages:
✅ Double hop for enhanced privacy.
✅ Hide real exit IP.
✅ Higher level of anonymity.

```

---

## 🔧 Supported Clients

| Client              | Status | Notes                     |
| ------------------- | ------ | ------------------------- |
| Clash Premium       | ✅      | Fully supported           |
| Clash Meta (mihomo) | ✅      | Fully supported           |
| Clash for Windows   | ✅      | Parsers supported         |
| Clash Verge         | ✅      | Pre-processing supported  |
| Stash (iOS)         | ✅      | Script pre-processing     |
| Clash Open Source   | ⚠️      | No `dialer-proxy` support |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. **Fork the Project**
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to Branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Report Issues

If you find a bug or have a feature suggestion, please [Submit an Issue](https://github.com/NineThoughts0521/clash-residential-proxy-parser/issues).

When submitting, please include:

* 📝 Detailed description
* 🔄 Steps to reproduce
* 💻 Environment info (OS, Clash version, etc.)
* 📋 Relevant logs (if any)

---

## 💬 Community & Support

* 💬 [GitHub Discussions](https://github.com/NineThoughts0521/clash-residential-proxy-parser/discussions) - Discussions
* 🐛 [Issue Tracker](https://github.com/NineThoughts0521/clash-residential-proxy-parser/issues) - Bug Reports
* 📧 Email: ninethoughts0521@outlook.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 Nine Thoughts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...

```

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=NineThoughts0521/clash-residential-proxy-parser&type=date&legend=top-left)](https://www.star-history.com/#NineThoughts0521/clash-residential-proxy-parser&type=date&legend=top-left)

---

## 🙏 Acknowledgments

Thanks to the following projects and contributors:

* Clash - Excellent proxy tool
* Clash Meta - Powerful Clash fork

---

## ⚠️ Disclaimer

* This project is for educational purposes only.
* Please comply with local laws and regulations.
* Users are responsible for any consequences arising from the use of this tool.
* The author is not liable for any losses caused by using this tool.

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

Made with ❤️ by [Nine Thoughts]

</div>

```
