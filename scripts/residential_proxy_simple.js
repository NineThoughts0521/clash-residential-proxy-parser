/**
 * Clash 家宽代理复写配置 - 精简版
 * 适合直接粘贴到 Clash Parser 中使用
 */

const main = (config) => {
  // === 配置部分 - 根据需要修改 ===
  const PROXY_NAME = "🏠 美国住宅代理";
  const RELAY_NAME = "🇺🇸 家宽前置路由";
  const PROXY_TYPE = "http"; // 支持: http / https / socks5 / vless / vmess / ss / ss2022
  
  // 家宽代理配置
  const residentialProxyConfig = {
    name: PROXY_NAME,
    type: PROXY_TYPE,
    server: "proxy.example.com",
    port: 443,
    username: "your_username",
    password: "your_password",
    // vless/vmess 必填
    uuid: "",
    // vmess/ss/ss2022 可用（ss2022 请使用 2022-blake3-* 系列 cipher）
    cipher: "",
    // vmess 可用
    alterId: 0,
    // vless/vmess 可用: tcp / ws / grpc / h2 ...
    network: "tcp",
    udp: true,
    tls: false,
    skipCertVerify: true,
    // vless/vmess 可用，映射到 servername
    sni: "",
    // vless 可用（如 xtls-rprx-vision）
    flow: "",
    // 透传附加字段（如 ws-opts、grpc-opts、reality-opts、plugin、plugin-opts）
    extra: {},
    dialerProxy: RELAY_NAME
  };
  
  // 要添加到的策略组列表
  const targetGroups = ["Proxies", "Netflix", "AI", "TikTok", "DisneyPlus", "HBO", "YouTube", "✈️Final"];

  const SUPPORTED_TYPES = new Set(["http", "https", "socks5", "vless", "vmess", "ss", "ss2022"]);
  const isNonEmptyString = value => typeof value === "string" && value.trim().length > 0;
  const isPlainObject = value => value && typeof value === "object" && !Array.isArray(value);
  const parsePort = value => {
    const port = Number(value);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new Error(`端口无效: ${value}`);
    }
    return port;
  };
  const parseAlterId = value => {
    if (value === undefined || value === null || value === "") return 0;
    const alterId = Number(value);
    if (!Number.isInteger(alterId) || alterId < 0) {
      throw new Error(`alterId 无效: ${value}`);
    }
    return alterId;
  };
  const buildResidentialProxy = proxyConfig => {
    const rawType = String(proxyConfig.type || "http").toLowerCase();
    if (!SUPPORTED_TYPES.has(rawType)) {
      throw new Error(`不支持的代理类型: ${rawType}`);
    }
    if (!isNonEmptyString(proxyConfig.name)) {
      throw new Error("代理名称不能为空");
    }
    if (!isNonEmptyString(proxyConfig.server)) {
      throw new Error("服务器地址不能为空");
    }

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
      if (!isNonEmptyString(proxyConfig.uuid)) {
        throw new Error("vless 协议需要填写 uuid");
      }
      proxy.uuid = proxyConfig.uuid;
      proxy.network = isNonEmptyString(proxyConfig.network) ? proxyConfig.network : "tcp";
      proxy.tls = proxyConfig.tls === true;
      proxy["skip-cert-verify"] = proxyConfig.skipCertVerify === true;
      if (isNonEmptyString(proxyConfig.sni)) proxy.servername = proxyConfig.sni;
      if (isNonEmptyString(proxyConfig.flow)) proxy.flow = proxyConfig.flow;
    }

    if (rawType === "vmess") {
      if (!isNonEmptyString(proxyConfig.uuid)) {
        throw new Error("vmess 协议需要填写 uuid");
      }
      proxy.uuid = proxyConfig.uuid;
      proxy.alterId = parseAlterId(proxyConfig.alterId);
      proxy.cipher = isNonEmptyString(proxyConfig.cipher) ? proxyConfig.cipher : "auto";
      proxy.network = isNonEmptyString(proxyConfig.network) ? proxyConfig.network : "tcp";
      proxy.tls = proxyConfig.tls === true;
      proxy["skip-cert-verify"] = proxyConfig.skipCertVerify === true;
      if (isNonEmptyString(proxyConfig.sni)) proxy.servername = proxyConfig.sni;
    }

    if (rawType === "ss" || rawType === "ss2022") {
      if (!isNonEmptyString(proxyConfig.cipher)) {
        throw new Error(`${rawType} 协议需要填写 cipher`);
      }
      if (!isNonEmptyString(proxyConfig.password)) {
        throw new Error(`${rawType} 协议需要填写 password`);
      }
      if (rawType === "ss2022" && !proxyConfig.cipher.startsWith("2022-blake3-")) {
        throw new Error("ss2022 需要使用 2022-blake3-* 系列 cipher");
      }
      proxy.cipher = proxyConfig.cipher;
      proxy.password = proxyConfig.password;
    }

    return proxy;
  };

  // === 处理逻辑 - 通常不需要修改 ===
  
  // 初始化
  if (!config.proxies) config.proxies = [];
  if (!config['proxy-groups']) config['proxy-groups'] = [];
  
  // 检查是否已添加
  if (config.proxies.some(p => p.name === PROXY_NAME)) {
    console.log("⚠️ 已存在，跳过");
    return config;
  }
  
  // 获取可用节点
  const sourceGroup = config['proxy-groups'].find(g => g.name === "Proxies");
  if (!sourceGroup) {
    console.error("❌ 找不到 Proxies 组");
    return config;
  }
  
  const availableNodes = (sourceGroup.proxies || []).filter(
    p => !["DIRECT", "REJECT", "🎯Direct", PROXY_NAME].includes(p)
  );
  
  // 创建影子组
  const relayGroup = {
    name: RELAY_NAME,
    type: "select",
    proxies: ["DIRECT", ...availableNodes]
  };
  
  // 添加配置
  let residentialProxy;
  try {
    residentialProxy = buildResidentialProxy(residentialProxyConfig);
  } catch (error) {
    console.error(`❌ 构建家宽代理失败: ${error.message}`);
    return config;
  }

  config['proxy-groups'].unshift(relayGroup);
  config.proxies.unshift(residentialProxy);
  
  // 添加到目标组
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
};
