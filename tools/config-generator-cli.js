#!/usr/bin/env node

/**
 * Clash 家宽代理配置生成器 - 命令行版本
 * 使用方法: node config-generator-cli.js
 */

const readline = require("readline");
const fs = require("fs");

const SUPPORTED_PROXY_TYPES = [
    "http",
    "https",
    "socks5",
    "vless",
    "vmess",
    "ss",
    "ss2022"
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    red: "\x1b[31m"
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

const config = {
    proxyName: "🏠 美国住宅代理",
    server: "proxy.example.com",
    port: 443,
    proxyType: "http",
    username: "your_username",
    password: "your_password",
    uuid: "",
    cipher: "auto",
    alterId: 0,
    network: "tcp",
    sni: "",
    flow: "",
    protocolExtra: {},
    relayGroupName: "🇺🇸 家宽前置路由",
    targetGroups: ["Proxies", "Netflix", "AI", "TikTok", "DisneyPlus", "HBO", "YouTube", "✈️Final"],
    udp: true,
    tls: false,
    skipCertVerify: true,
    scriptVersion: "full"
};

const needsAuth = (type) => ["http", "https", "socks5"].includes(type);
const needsUuid = (type) => ["vless", "vmess"].includes(type);
const needsCipher = (type) => ["vmess", "ss", "ss2022"].includes(type);
const needsAlterId = (type) => type === "vmess";
const needsNetwork = (type) => ["vless", "vmess"].includes(type);
const needsSni = (type) => ["vless", "vmess"].includes(type);
const needsFlow = (type) => type === "vless";
const needsPassword = (type) => ["http", "https", "socks5", "ss", "ss2022"].includes(type);

const questions = [
    {
        key: "proxyName",
        question: "代理名称",
        default: config.proxyName,
        validate: (val) => val.length > 0
    },
    {
        key: "server",
        question: "服务器地址",
        default: config.server,
        validate: (val) => val.length > 0
    },
    {
        key: "port",
        question: "端口",
        default: config.port,
        validate: (val) => !Number.isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 65535,
        transform: (val) => parseInt(val, 10)
    },
    {
        key: "proxyType",
        question: "代理类型 (http/https/socks5/vless/vmess/ss/ss2022)",
        default: config.proxyType,
        validate: (val) => SUPPORTED_PROXY_TYPES.includes(val.toLowerCase()),
        transform: (val) => val.toLowerCase()
    },
    {
        key: "username",
        question: "用户名（仅 http/https/socks5）",
        default: config.username,
        condition: (ctx) => needsAuth(ctx.proxyType),
        validate: (val) => val.length > 0
    },
    {
        key: "password",
        question: "密码（http/https/socks5/ss/ss2022）",
        default: config.password,
        condition: (ctx) => needsPassword(ctx.proxyType),
        validate: (val) => val.length > 0
    },
    {
        key: "uuid",
        question: "UUID（vless/vmess 必填）",
        default: config.uuid,
        condition: (ctx) => needsUuid(ctx.proxyType),
        validate: (val) => val.length > 0
    },
    {
        key: "cipher",
        question: "Cipher（vmess/ss/ss2022）",
        default: config.cipher,
        condition: (ctx) => needsCipher(ctx.proxyType),
        validate: (val) => val.length > 0
    },
    {
        key: "alterId",
        question: "alterId（vmess）",
        default: config.alterId,
        condition: (ctx) => needsAlterId(ctx.proxyType),
        validate: (val) => Number.isInteger(Number(val)) && Number(val) >= 0,
        transform: (val) => parseInt(val, 10)
    },
    {
        key: "network",
        question: "network（vless/vmess，例如 tcp/ws/grpc/h2）",
        default: config.network,
        condition: (ctx) => needsNetwork(ctx.proxyType),
        validate: (val) => val.length > 0
    },
    {
        key: "sni",
        question: "SNI（vless/vmess，可留空）",
        default: config.sni,
        condition: (ctx) => needsSni(ctx.proxyType),
        validate: () => true
    },
    {
        key: "flow",
        question: "flow（vless，可留空）",
        default: config.flow,
        condition: (ctx) => needsFlow(ctx.proxyType),
        validate: () => true
    },
    {
        key: "protocolExtra",
        question: "协议附加参数 JSON（如 ws-opts/grpc-opts/plugin-opts）",
        default: "{}",
        validate: (val) => {
            try {
                const parsed = JSON.parse(val);
                return parsed && typeof parsed === "object" && !Array.isArray(parsed);
            } catch (error) {
                return false;
            }
        },
        transform: (val) => JSON.parse(val)
    },
    {
        key: "relayGroupName",
        question: "影子策略组名称",
        default: config.relayGroupName,
        validate: (val) => val.length > 0
    },
    {
        key: "targetGroups",
        question: "目标策略组 (逗号分隔)",
        default: config.targetGroups.join(", "),
        validate: (val) => val.length > 0,
        transform: (val) => val.split(",").map((s) => s.trim()).filter(Boolean)
    },
    {
        key: "udp",
        question: "启用 UDP? (y/n)",
        default: config.udp ? "y" : "n",
        validate: (val) => ["y", "n", "yes", "no"].includes(val.toLowerCase()),
        transform: (val) => ["y", "yes"].includes(val.toLowerCase())
    },
    {
        key: "tls",
        question: "启用 TLS? (y/n)",
        default: config.tls ? "y" : "n",
        validate: (val) => ["y", "n", "yes", "no"].includes(val.toLowerCase()),
        transform: (val) => ["y", "yes"].includes(val.toLowerCase())
    },
    {
        key: "skipCertVerify",
        question: "跳过证书验证? (y/n)",
        default: config.skipCertVerify ? "y" : "n",
        validate: (val) => ["y", "n", "yes", "no"].includes(val.toLowerCase()),
        transform: (val) => ["y", "yes"].includes(val.toLowerCase())
    },
    {
        key: "scriptVersion",
        question: "脚本版本 (full/simple)",
        default: config.scriptVersion,
        validate: (val) => ["full", "simple"].includes(val.toLowerCase()),
        transform: (val) => val.toLowerCase()
    }
];

function validateProtocolConfig(ctx) {
    if (ctx.proxyType === "ss2022" && !String(ctx.cipher || "").startsWith("2022-blake3-")) {
        return "ss2022 需要使用 2022-blake3-* 系列 cipher";
    }
    return "";
}

function askQuestion(index) {
    if (index >= questions.length) {
        const protocolError = validateProtocolConfig(config);
        if (protocolError) {
            console.log(colorize(`❌ ${protocolError}`, "red"));
            askQuestion(0);
            return;
        }
        generateAndSave();
        return;
    }

    const q = questions[index];
    if (typeof q.condition === "function" && !q.condition(config)) {
        askQuestion(index + 1);
        return;
    }

    const prompt = colorize(`\n${q.question}`, "cyan") +
        colorize(` [默认: ${q.default}]`, "yellow") +
        ": ";

    rl.question(prompt, (answer) => {
        const value = answer.trim() || String(q.default);
        if (!q.validate(value)) {
            console.log(colorize("❌ 输入无效，请重新输入", "red"));
            askQuestion(index);
            return;
        }
        config[q.key] = q.transform ? q.transform(value) : value;
        if (q.key === "proxyType" && config.proxyType === "ss2022" && config.cipher === "auto") {
            config.cipher = "2022-blake3-aes-256-gcm";
        }
        askQuestion(index + 1);
    });
}

function toLiteral(value) {
    return JSON.stringify(value);
}

function buildConfigBlock(ctx) {
    return `const CONFIG = {
    residentialProxy: {
      name: ${toLiteral(ctx.proxyName)},
      type: ${toLiteral(ctx.proxyType)},
      server: ${toLiteral(ctx.server)},
      port: ${ctx.port},
      username: ${toLiteral(ctx.username)},
      password: ${toLiteral(ctx.password)},
      uuid: ${toLiteral(ctx.uuid)},
      cipher: ${toLiteral(ctx.cipher)},
      alterId: ${ctx.alterId},
      network: ${toLiteral(ctx.network)},
      udp: ${ctx.udp},
      tls: ${ctx.tls},
      skipCertVerify: ${ctx.skipCertVerify},
      sni: ${toLiteral(ctx.sni)},
      flow: ${toLiteral(ctx.flow)},
      extra: ${JSON.stringify(ctx.protocolExtra)},
      dialerProxy: ${toLiteral(ctx.relayGroupName)}
    },
    relayGroupName: ${toLiteral(ctx.relayGroupName)},
    sourceGroupName: "Proxies",
    targetGroups: ${JSON.stringify(ctx.targetGroups)},
    excludeNodes: ["DIRECT", "REJECT", "🎯Direct"]
  };`;
}

function buildProtocolHelperSource() {
    return `const SUPPORTED_TYPES = new Set(["http", "https", "socks5", "vless", "vmess", "ss", "ss2022"]);
  const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
  const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);
  const parsePort = (value) => {
    const port = Number(value);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new Error("端口无效: " + value);
    }
    return port;
  };
  const parseAlterId = (value) => {
    if (value === undefined || value === null || value === "") return 0;
    const alterId = Number(value);
    if (!Number.isInteger(alterId) || alterId < 0) {
      throw new Error("alterId 无效: " + value);
    }
    return alterId;
  };
  const buildResidentialProxy = (proxyConfig) => {
    const rawType = String(proxyConfig.type || "http").toLowerCase();
    if (!SUPPORTED_TYPES.has(rawType)) {
      throw new Error("不支持的代理类型: " + rawType);
    }
    if (!isNonEmptyString(proxyConfig.name)) throw new Error("代理名称不能为空");
    if (!isNonEmptyString(proxyConfig.server)) throw new Error("服务器地址不能为空");

    const normalizedType = rawType === "ss2022" ? "ss" : rawType;
    const extra = isPlainObject(proxyConfig.extra) ? proxyConfig.extra : {};
    const proxy = {
      ...extra,
      name: proxyConfig.name,
      type: normalizedType,
      server: proxyConfig.server,
      port: parsePort(proxyConfig.port),
      udp: proxyConfig.udp !== false,
      "dialer-proxy": proxyConfig.dialerProxy
    };

    if (rawType === "http" || rawType === "https" || rawType === "socks5") {
      if (isNonEmptyString(proxyConfig.username)) proxy.username = proxyConfig.username;
      if (isNonEmptyString(proxyConfig.password)) proxy.password = proxyConfig.password;
      proxy.tls = rawType === "https" ? true : proxyConfig.tls === true;
      proxy["skip-cert-verify"] = proxyConfig.skipCertVerify !== false;
    }

    if (rawType === "vless") {
      if (!isNonEmptyString(proxyConfig.uuid)) throw new Error("vless 协议需要填写 uuid");
      proxy.uuid = proxyConfig.uuid;
      proxy.network = isNonEmptyString(proxyConfig.network) ? proxyConfig.network : "tcp";
      proxy.tls = proxyConfig.tls === true;
      proxy["skip-cert-verify"] = proxyConfig.skipCertVerify === true;
      if (isNonEmptyString(proxyConfig.sni)) proxy.servername = proxyConfig.sni;
      if (isNonEmptyString(proxyConfig.flow)) proxy.flow = proxyConfig.flow;
    }

    if (rawType === "vmess") {
      if (!isNonEmptyString(proxyConfig.uuid)) throw new Error("vmess 协议需要填写 uuid");
      proxy.uuid = proxyConfig.uuid;
      proxy.alterId = parseAlterId(proxyConfig.alterId);
      proxy.cipher = isNonEmptyString(proxyConfig.cipher) ? proxyConfig.cipher : "auto";
      proxy.network = isNonEmptyString(proxyConfig.network) ? proxyConfig.network : "tcp";
      proxy.tls = proxyConfig.tls === true;
      proxy["skip-cert-verify"] = proxyConfig.skipCertVerify === true;
      if (isNonEmptyString(proxyConfig.sni)) proxy.servername = proxyConfig.sni;
    }

    if (rawType === "ss" || rawType === "ss2022") {
      if (!isNonEmptyString(proxyConfig.cipher)) throw new Error(rawType + " 协议需要填写 cipher");
      if (!isNonEmptyString(proxyConfig.password)) throw new Error(rawType + " 协议需要填写 password");
      if (rawType === "ss2022" && !proxyConfig.cipher.startsWith("2022-blake3-")) {
        throw new Error("ss2022 需要使用 2022-blake3-* 系列 cipher");
      }
      proxy.cipher = proxyConfig.cipher;
      proxy.password = proxyConfig.password;
    }

    return proxy;
  };`;
}

function buildScriptBody(ctx, simple = false) {
    const configBlock = buildConfigBlock(ctx);
    const helper = buildProtocolHelperSource();
    if (simple) {
        return `/**
 * Clash 家宽代理复写配置 - 精简版
 * 生成时间: ${new Date().toLocaleString("zh-CN")}
 */

const main = (config) => {
  const PROXY_NAME = ${toLiteral(ctx.proxyName)};
  const RELAY_NAME = ${toLiteral(ctx.relayGroupName)};
  ${configBlock}
  const targetGroups = CONFIG.targetGroups;
  ${helper}

  if (!config.proxies) config.proxies = [];
  if (!config["proxy-groups"]) config["proxy-groups"] = [];

  if (config.proxies.some((p) => p.name === PROXY_NAME)) {
    console.log("⚠️ 已存在，跳过");
    return config;
  }

  const sourceGroup = config["proxy-groups"].find((g) => g.name === "Proxies");
  if (!sourceGroup) {
    console.error("❌ 找不到 Proxies 组");
    return config;
  }

  const availableNodes = (sourceGroup.proxies || []).filter(
    (p) => !["DIRECT", "REJECT", "🎯Direct", PROXY_NAME].includes(p)
  );

  const relayGroup = {
    name: RELAY_NAME,
    type: "select",
    proxies: ["DIRECT", ...availableNodes]
  };

  let residentialProxy;
  try {
    residentialProxy = buildResidentialProxy(CONFIG.residentialProxy);
  } catch (error) {
    console.error("❌ 构建家宽代理失败: " + error.message);
    return config;
  }

  config["proxy-groups"].unshift(relayGroup);
  config.proxies.unshift(residentialProxy);

  config["proxy-groups"].forEach((group) => {
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

    return `/**
 * Clash 配置文件预处理脚本 - 家宽代理前置路由
 * 版本: v1.1.0
 * 生成时间: ${new Date().toLocaleString("zh-CN")}
 */

const main = (config) => {
  // ================= 配置区域 =================
  ${configBlock}

  // ================= 日志函数 =================
  const log = {
    info: (msg) => console.log("✅ " + msg),
    warn: (msg) => console.log("⚠️  " + msg),
    error: (msg) => console.error("❌ " + msg)
  };

  ${helper}

  // ================= 数据校验 =================
  if (!config || typeof config !== "object") {
    log.error("配置对象无效");
    return config;
  }

  if (!config.proxies) {
    config.proxies = [];
    log.warn("proxies 字段不存在，已创建");
  }

  if (!config["proxy-groups"]) {
    config["proxy-groups"] = [];
    log.warn("proxy-groups 字段不存在，已创建");
  }

  if (!Array.isArray(config.proxies) || !Array.isArray(config["proxy-groups"])) {
    log.error("proxies 或 proxy-groups 格式错误");
    return config;
  }

  // ================= 检查重复 =================
  const existingProxy = config.proxies.find((p) => p.name === CONFIG.residentialProxy.name);
  if (existingProxy) {
    log.warn("家宽代理已存在，跳过添加");
    return config;
  }

  // ================= 提取节点列表 =================
  const sourceGroup = config["proxy-groups"].find((g) => g.name === CONFIG.sourceGroupName);
  if (!sourceGroup) {
    log.error("找不到源策略组: " + CONFIG.sourceGroupName);
    return config;
  }

  if (!sourceGroup.proxies || !Array.isArray(sourceGroup.proxies)) {
    log.error("源策略组 " + CONFIG.sourceGroupName + " 没有有效的 proxies 字段");
    return config;
  }

  const excludeSet = new Set([...CONFIG.excludeNodes, CONFIG.residentialProxy.name]);
  const availableNodes = sourceGroup.proxies.filter((nodeName) => !excludeSet.has(nodeName));

  if (availableNodes.length === 0) {
    log.warn("没有可用的节点，仅添加 DIRECT 选项");
  }

  log.info("提取到 " + availableNodes.length + " 个可用节点");

  // ================= 创建/更新影子策略组 =================
  const existingRelayGroup = config["proxy-groups"].find((g) => g.name === CONFIG.relayGroupName);
  const relayGroup = {
    name: CONFIG.relayGroupName,
    type: "select",
    proxies: ["DIRECT", ...availableNodes]
  };

  if (existingRelayGroup) {
    log.warn("影子策略组已存在，更新节点列表");
    Object.assign(existingRelayGroup, relayGroup);
  } else {
    config["proxy-groups"].unshift(relayGroup);
    log.info("创建影子策略组: " + CONFIG.relayGroupName);
  }

  // ================= 创建家宽代理节点 =================
  let residentialProxy;
  try {
    residentialProxy = buildResidentialProxy(CONFIG.residentialProxy);
  } catch (error) {
    log.error("构建家宽代理失败: " + error.message);
    return config;
  }

  config.proxies.unshift(residentialProxy);
  log.info("添加家宽代理: " + CONFIG.residentialProxy.name);

  // ================= 添加到目标策略组 =================
  const targetGroupSet = new Set(CONFIG.targetGroups);
  let addedCount = 0;

  config["proxy-groups"].forEach((group) => {
    if (targetGroupSet.has(group.name)) {
      if (!group.proxies) group.proxies = [];
      if (!group.proxies.includes(residentialProxy.name)) {
        group.proxies.unshift(residentialProxy.name);
        addedCount++;
      }
    }
  });

  log.info("已将家宽代理添加到 " + addedCount + " 个策略组");
  log.info("配置处理完成");
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log.info("📌 使用提示:");
  log.info("1. 在策略组中选择 '" + CONFIG.residentialProxy.name + "'");
  log.info("2. 在 '" + CONFIG.relayGroupName + "' 中选择前置节点:");
  log.info("   - DIRECT: 直连（默认，适合国内访问）");
  log.info("   - 其他节点: 使用机场节点作为前置");
  log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return config;
};`;
}

function generateAndSave() {
    console.log(colorize("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "bright"));
    console.log(colorize("📋 配置摘要", "bright"));
    console.log(colorize("━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "bright"));
    console.log(colorize("代理名称: ", "cyan") + config.proxyName);
    console.log(colorize("服务器: ", "cyan") + `${config.server}:${config.port}`);
    console.log(colorize("类型: ", "cyan") + config.proxyType.toUpperCase());
    console.log(colorize("脚本版本: ", "cyan") + (config.scriptVersion === "full" ? "完整版" : "精简版"));
    console.log(colorize("━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "bright"));

    const script = config.scriptVersion === "full"
        ? buildScriptBody(config, false)
        : buildScriptBody(config, true);

    const filename = `residential_proxy_${config.scriptVersion}_${Date.now()}.js`;
    fs.writeFileSync(filename, script, "utf8");

    console.log(colorize("✅ 配置生成成功！", "green"));
    console.log(colorize(`📁 文件已保存: ${filename}`, "blue"));
    console.log(colorize("\n💡 使用方法:", "yellow"));
    console.log("  1. 将生成的脚本复制到 Clash 的 Parser 配置中");
    console.log("  2. 或者在 Clash 配置文件中引用此脚本文件");
    console.log(colorize("\n感谢使用！🎉\n", "green"));

    rl.close();
}

function showWelcome() {
    console.clear();
    console.log(colorize("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "bright"));
    console.log(colorize("   🏠 Clash 家宽代理配置生成器 v1.1.0   ", "bright"));
    console.log(colorize("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "bright"));
    console.log(colorize("欢迎使用配置生成器！", "green"));
    console.log(colorize("按 Enter 使用默认值，或输入自定义值\n", "yellow"));
}

function main() {
    showWelcome();
    askQuestion(0);
}

main();
