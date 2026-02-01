/**
 * Clash 家宽代理复写配置 - 精简版
 * 适合直接粘贴到 Clash Parser 中使用
 */

const main = (config) => {
  // === 配置部分 - 根据需要修改 ===
  const PROXY_NAME = "🏠 美国住宅代理";
  const RELAY_NAME = "🇺🇸 家宽前置路由";
  
  // 家宽代理配置
  const residentialProxy = {
    name: PROXY_NAME,
    type: "http",
    server: "proxy.example.com",
    port: 443,
    username: "your_username",
    password: "your_password",
    udp: true,
    tls: false,
    "skip-cert-verify": true,
    "dialer-proxy": RELAY_NAME
  };
  
  // 要添加到的策略组列表
  const targetGroups = ["Proxies", "Netflix", "AI", "TikTok", "DisneyPlus", "HBO", "YouTube", "✈️Final"];

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
