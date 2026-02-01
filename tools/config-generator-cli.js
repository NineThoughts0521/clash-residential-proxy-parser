#!/usr/bin/env node

/**
 * Clash 家宽代理配置生成器 - 命令行版本
 * 使用方法: node config-generator-cli.js
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

// 配置对象
const config = {
    proxyName: '🏠 美国住宅代理',
    server: 'proxy.example.com',
    port: 443,
    username: 'your_username',
    password: 'your_password',
    proxyType: 'http',
    relayGroupName: '🇺🇸 家宽前置路由',
    targetGroups: ['Proxies', 'Netflix', 'AI', 'TikTok', 'DisneyPlus', 'HBO', 'YouTube', '✈️Final'],
    udp: true,
    tls: false,
    skipCertVerify: true,
    scriptVersion: 'full'
};

// 问题列表
const questions = [
    {
        key: 'proxyName',
        question: '代理名称',
        default: config.proxyName,
        validate: (val) => val.length > 0
    },
    {
        key: 'server',
        question: '服务器地址',
        default: config.server,
        validate: (val) => val.length > 0
    },
    {
        key: 'port',
        question: '端口',
        default: config.port,
        validate: (val) => !isNaN(val) && val > 0 && val <= 65535,
        transform: (val) => parseInt(val)
    },
    {
        key: 'username',
        question: '用户名',
        default: config.username,
        validate: (val) => val.length > 0
    },
    {
        key: 'password',
        question: '密码',
        default: config.password,
        validate: (val) => val.length > 0
    },
    {
        key: 'proxyType',
        question: '代理类型 (http/https/socks5)',
        default: config.proxyType,
        validate: (val) => ['http', 'https', 'socks5'].includes(val)
    },
    {
        key: 'relayGroupName',
        question: '影子策略组名称',
        default: config.relayGroupName,
        validate: (val) => val.length > 0
    },
    {
        key: 'targetGroups',
        question: '目标策略组 (逗号分隔)',
        default: config.targetGroups.join(', '),
        validate: (val) => val.length > 0,
        transform: (val) => val.split(',').map(s => s.trim())
    },
    {
        key: 'udp',
        question: '启用 UDP? (y/n)',
        default: config.udp ? 'y' : 'n',
        validate: (val) => ['y', 'n', 'yes', 'no'].includes(val.toLowerCase()),
        transform: (val) => val.toLowerCase() === 'y' || val.toLowerCase() === 'yes'
    },
    {
        key: 'tls',
        question: '启用 TLS? (y/n)',
        default: config.tls ? 'y' : 'n',
        validate: (val) => ['y', 'n', 'yes', 'no'].includes(val.toLowerCase()),
        transform: (val) => val.toLowerCase() === 'y' || val.toLowerCase() === 'yes'
    },
    {
        key: 'skipCertVerify',
        question: '跳过证书验证? (y/n)',
        default: config.skipCertVerify ? 'y' : 'n',
        validate: (val) => ['y', 'n', 'yes', 'no'].includes(val.toLowerCase()),
        transform: (val) => val.toLowerCase() === 'y' || val.toLowerCase() === 'yes'
    },
    {
        key: 'scriptVersion',
        question: '脚本版本 (full/simple)',
        default: config.scriptVersion,
        validate: (val) => ['full', 'simple'].includes(val)
    }
];

// 询问问题
function askQuestion(index) {
    if (index >= questions.length) {
        generateAndSave();
        return;
    }

    const q = questions[index];
    const prompt = colorize(`\n${q.question}`, 'cyan') +
        colorize(` [默认: ${q.default}]`, 'yellow') +
        ': ';

    rl.question(prompt, (answer) => {
        const value = answer.trim() || q.default.toString();

        if (!q.validate(value)) {
            console.log(colorize('❌ 输入无效，请重新输入', 'red'));
            askQuestion(index);
            return;
        }

        config[q.key] = q.transform ? q.transform(value) : value;
        askQuestion(index + 1);
    });
}

// 生成完整版脚本
function generateFullScript(config) {
    const targetGroupsStr = config.targetGroups.map(g => `"${g}"`).join(', ');

    return `/**
 * Clash 配置文件预处理脚本 - 家宽代理前置路由
 * 版本: v1.0.0
 * 生成时间: ${new Date().toLocaleString('zh-CN')}
 */

const main = (config) => {
  // ================= 配置区域 =================
  const CONFIG = {
    residentialProxy: {
      name: "${config.proxyName}",
      type: "${config.proxyType}",
      server: "${config.server}",
      port: ${config.port},
      username: "${config.username}",
      password: "${config.password}",
      udp: ${config.udp},
      tls: ${config.tls},
      skipCertVerify: ${config.skipCertVerify},
      dialerProxy: "${config.relayGroupName}"
    },
    relayGroupName: "${config.relayGroupName}",
    sourceGroupName: "Proxies",
    targetGroups: [${targetGroupsStr}],
    excludeNodes: ["DIRECT", "REJECT", "🎯Direct"]
  };

  // ================= 日志函数 =================
  const log = {
    info: (msg) => console.log(\`✅ \${msg}\`),
    warn: (msg) => console.log(\`⚠️  \${msg}\`),
    error: (msg) => console.error(\`❌ \${msg}\`)
  };

  // ================= 数据校验 =================
  if (!config || typeof config !== 'object') {
    log.error("配置对象无效");
    return config;
  }

  if (!config.proxies) config.proxies = [];
  if (!config['proxy-groups']) config['proxy-groups'] = [];

  if (!Array.isArray(config.proxies) || !Array.isArray(config['proxy-groups'])) {
    log.error("proxies 或 proxy-groups 格式错误");
    return config;
  }

  // ================= 检查重复 =================
  const existingProxy = config.proxies.find(p => p.name === CONFIG.residentialProxy.name);
  if (existingProxy) {
    log.warn("家宽代理已存在，跳过添加");
    return config;
  }

  // ================= 提取节点列表 =================
  const sourceGroup = config['proxy-groups'].find(g => g.name === CONFIG.sourceGroupName);
  if (!sourceGroup) {
    log.error(\`找不到源策略组: \${CONFIG.sourceGroupName}\`);
    return config;
  }

  if (!sourceGroup.proxies || !Array.isArray(sourceGroup.proxies)) {
    log.error(\`源策略组 \${CONFIG.sourceGroupName} 没有有效的 proxies 字段\`);
    return config;
  }

  const excludeSet = new Set([...CONFIG.excludeNodes, CONFIG.residentialProxy.name]);
  const availableNodes = (sourceGroup.proxies || []).filter(p => !excludeSet.has(p));

  if (availableNodes.length === 0) {
    log.warn("没有可用的节点，仅添加 DIRECT 选项");
  }

  log.info(\`提取到 \${availableNodes.length} 个可用节点\`);

  // ================= 创建/更新影子策略组 =================
  const existingRelayGroup = config['proxy-groups'].find(g => g.name === CONFIG.relayGroupName);
  const relayGroup = {
    name: CONFIG.relayGroupName,
    type: "select",
    proxies: ["DIRECT", ...availableNodes]
  };

  if (existingRelayGroup) {
    log.warn("影子策略组已存在，更新节点列表");
    Object.assign(existingRelayGroup, relayGroup);
  } else {
    config['proxy-groups'].unshift(relayGroup);
    log.info(\`创建影子策略组: \${CONFIG.relayGroupName}\`);
  }

  // ================= 创建家宽代理节点 =================
  const residentialProxy = {
    name: CONFIG.residentialProxy.name,
    type: CONFIG.residentialProxy.type,
    server: CONFIG.residentialProxy.server,
    port: CONFIG.residentialProxy.port,
    username: CONFIG.residentialProxy.username,
    password: CONFIG.residentialProxy.password,
    udp: CONFIG.residentialProxy.udp,
    tls: CONFIG.residentialProxy.tls,
    "skip-cert-verify": CONFIG.residentialProxy.skipCertVerify,
    "dialer-proxy": CONFIG.residentialProxy.dialerProxy
  };

  config.proxies.unshift(residentialProxy);
  log.info(\`添加家宽代理: \${CONFIG.residentialProxy.name}\`);

  // ================= 添加到目标策略组 =================
  const targetGroupSet = new Set(CONFIG.targetGroups);
  let addedCount = 0;

  config['proxy-groups'].forEach(group => {
    if (targetGroupSet.has(group.name)) {
      if (!group.proxies) group.proxies = [];
      if (!group.proxies.includes(residentialProxy.name)) {
        group.proxies.unshift(residentialProxy.name);
        addedCount++;
      }
    }
  });

  log.info(\`已将家宽代理添加到 \${addedCount} 个策略组\`);

  // ================= 完成 =================
  log.info("配置处理完成");
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log.info("📌 使用提示:");
  log.info("1. 在策略组中选择 '${config.proxyName}'");
  log.info("2. 在 '${config.relayGroupName}' 中选择前置节点:");
  log.info("   - DIRECT: 直连（默认，适合国内访问）");
  log.info("   - 其他节点: 使用机场节点作为前置");
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return config;
};`;
}

// 生成精简版脚本
function generateSimpleScript(config) {
    const targetGroupsStr = config.targetGroups.map(g => `"${g}"`).join(', ');

    return `/**
 * Clash 家宽代理复写配置 - 精简版
 * 生成时间: ${new Date().toLocaleString('zh-CN')}
 */

const main = (config) => {
  const PROXY_NAME = "${config.proxyName}";
  const RELAY_NAME = "${config.relayGroupName}";
  
  const residentialProxy = {
    name: PROXY_NAME,
    type: "${config.proxyType}",
    server: "${config.server}",
    port: ${config.port},
    username: "${config.username}",
    password: "${config.password}",
    udp: ${config.udp},
    tls: ${config.tls},
    "skip-cert-verify": ${config.skipCertVerify},
    "dialer-proxy": RELAY_NAME
  };
  
  const targetGroups = [${targetGroupsStr}];

  if (!config.proxies) config.proxies = [];
  if (!config['proxy-groups']) config['proxy-groups'] = [];
  
  if (config.proxies.some(p => p.name === PROXY_NAME)) {
    console.log("⚠️ 已存在，跳过");
    return config;
  }
  
  const sourceGroup = config['proxy-groups'].find(g => g.name === "Proxies");
  if (!sourceGroup) {
    console.error("❌ 找不到 Proxies 组");
    return config;
  }
  
  const availableNodes = (sourceGroup.proxies || []).filter(
    p => !["DIRECT", "REJECT", "🎯Direct", PROXY_NAME].includes(p)
  );
  
  const relayGroup = {
    name: RELAY_NAME,
    type: "select",
    proxies: ["DIRECT", ...availableNodes]
  };
  
  config['proxy-groups'].unshift(relayGroup);
  config.proxies.unshift(residentialProxy);
  
  config['proxy-groups'].forEach(group => {
    if (targetGroups.includes(group.name)) {
      if (!group.proxies) group.proxies = [];
      if (!group.proxies.includes(PROXY_NAME)) {
        group.proxies.unshift(PROXY_NAME);
      }
    }
  });
  
  console.log("✅ 配置完成");
  return config;
};`;
}

// 生成并保存
function generateAndSave() {
    console.log(colorize('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright'));
    console.log(colorize('📋 配置摘要', 'bright'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright'));
    console.log(colorize(`代理名称: `, 'cyan') + config.proxyName);
    console.log(colorize(`服务器: `, 'cyan') + `${config.server}:${config.port}`);
    console.log(colorize(`类型: `, 'cyan') + config.proxyType.toUpperCase());
    console.log(colorize(`脚本版本: `, 'cyan') + (config.scriptVersion === 'full' ? '完整版' : '精简版'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright'));

    const script = config.scriptVersion === 'full'
        ? generateFullScript(config)
        : generateSimpleScript(config);

    const filename = `residential_proxy_${config.scriptVersion}_${Date.now()}.js`;

    fs.writeFileSync(filename, script, 'utf8');

    console.log(colorize('✅ 配置生成成功！', 'green'));
    console.log(colorize(`📁 文件已保存: ${filename}`, 'blue'));
    console.log(colorize('\n💡 使用方法:', 'yellow'));
    console.log('  1. 将生成的脚本复制到 Clash 的 Parser 配置中');
    console.log('  2. 或者在 Clash 配置文件中引用此脚本文件');
    console.log(colorize('\n感谢使用！🎉\n', 'green'));

    rl.close();
}

// 显示欢迎信息
function showWelcome() {
    console.clear();
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'bright'));
    console.log(colorize('   🏠 Clash 家宽代理配置生成器 v1.0.0   ', 'bright'));
    console.log(colorize('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'bright'));
    console.log(colorize('欢迎使用配置生成器！', 'green'));
    console.log(colorize('按 Enter 使用默认值，或输入自定义值\n', 'yellow'));
}

// 主程序
function main() {
    showWelcome();
    askQuestion(0);
}

main();
