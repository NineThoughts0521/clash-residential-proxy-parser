/**
 * Clash 配置文件预处理脚本 - 家宽代理前置路由
 * 版本: v1.1.0
 * 功能: 添加家宽代理，支持灵活的前置路由选择
 * 
 * 使用方法:
 * 1. 在 Clash 客户端中导入此脚本作为 Parser
 * 2. 脚本会自动处理订阅配置
 * 3. 可在"🇺🇸 家宽前置路由"中选择 DIRECT 或其他节点作为前置
 */

const main = (config) => {
    // ================= 配置区域 =================
    const CONFIG = {
        // 家宽代理配置
        residentialProxy: {
            name: "🏠 美国住宅代理",
            // 支持: http / https / socks5 / vless / vmess / ss / ss2022
            type: "http",
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
            dialerProxy: "🇺🇸 家宽前置路由"  // 指向影子策略组
        },

        // 影子策略组名称（用于前置路由选择）
        relayGroupName: "🇺🇸 家宽前置路由",

        // 源策略组（用于提取节点列表）
        sourceGroupName: "Proxies",

        // 需要添加家宽代理的目标策略组
        targetGroups: [
            "Proxies",      // 代理选择
            "Netflix",      // 奈飞
            "AI",           // AI 服务
            "TikTok",       // TikTok
            "DisneyPlus",   // 迪士尼+
            "HBO",          // HBO
            "YouTube",      // YouTube
            "✈️Final"       // 兜底策略
        ],

        // 需要排除的特殊节点
        excludeNodes: [
            "DIRECT",
            "REJECT",
            "🎯Direct"
        ]
    };

    // ================= 日志函数 =================
    const log = {
        info: (msg) => console.log(`✅ ${msg}`),
        warn: (msg) => console.log(`⚠️  ${msg}`),
        error: (msg) => console.error(`❌ ${msg}`)
    };

    const SUPPORTED_TYPES = new Set([
        "http",
        "https",
        "socks5",
        "vless",
        "vmess",
        "ss",
        "ss2022"
    ]);

    const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
    const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

    const parsePort = (value) => {
        const port = Number(value);
        if (!Number.isInteger(port) || port <= 0 || port > 65535) {
            throw new Error(`端口无效: ${value}`);
        }
        return port;
    };

    const parseAlterId = (value) => {
        if (value === undefined || value === null || value === "") return 0;
        const alterId = Number(value);
        if (!Number.isInteger(alterId) || alterId < 0) {
            throw new Error(`alterId 无效: ${value}`);
        }
        return alterId;
    };

    const buildResidentialProxy = (proxyConfig) => {
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

    // ================= 数据校验 =================

    // 校验配置对象基本结构
    if (!config || typeof config !== 'object') {
        log.error("配置对象无效");
        return config;
    }

    // 确保基础字段存在
    if (!config.proxies) {
        config.proxies = [];
        log.warn("proxies 字段不存在，已创建");
    }

    if (!config['proxy-groups']) {
        config['proxy-groups'] = [];
        log.warn("proxy-groups 字段不存在，已创建");
    }

    if (!Array.isArray(config.proxies) || !Array.isArray(config['proxy-groups'])) {
        log.error("proxies 或 proxy-groups 格式错误");
        return config;
    }

    // ================= 检查重复 =================

    // 检查家宽代理是否已存在
    const existingProxy = config.proxies.find(
        p => p.name === CONFIG.residentialProxy.name
    );

    if (existingProxy) {
        log.warn("家宽代理已存在，跳过添加");
        return config;
    }

    // ================= 提取节点列表 =================

    // 查找源策略组
    const sourceGroup = config['proxy-groups'].find(
        g => g.name === CONFIG.sourceGroupName
    );

    if (!sourceGroup) {
        log.error(`找不到源策略组: ${CONFIG.sourceGroupName}`);
        return config;
    }

    if (!sourceGroup.proxies || !Array.isArray(sourceGroup.proxies)) {
        log.error(`源策略组 ${CONFIG.sourceGroupName} 没有有效的 proxies 字段`);
        return config;
    }

    // 提取可用节点（排除特殊节点和家宽代理自身，防止循环引用）
    const excludeSet = new Set([
        ...CONFIG.excludeNodes,
        CONFIG.residentialProxy.name
    ]);

    const availableNodes = sourceGroup.proxies.filter(
        nodeName => !excludeSet.has(nodeName)
    );

    if (availableNodes.length === 0) {
        log.warn("没有可用的节点，仅添加 DIRECT 选项");
    }

    log.info(`提取到 ${availableNodes.length} 个可用节点`);

    // ================= 创建/更新影子策略组 =================

    const existingRelayGroup = config['proxy-groups'].find(
        g => g.name === CONFIG.relayGroupName
    );

    const relayGroup = {
        name: CONFIG.relayGroupName,
        type: "select",
        proxies: ["DIRECT", ...availableNodes]  // DIRECT 放在首位
    };

    if (existingRelayGroup) {
        log.warn("影子策略组已存在，更新节点列表");
        Object.assign(existingRelayGroup, relayGroup);
    } else {
        // 添加到策略组列表开头
        config['proxy-groups'].unshift(relayGroup);
        log.info(`创建影子策略组: ${CONFIG.relayGroupName}`);
    }

    // ================= 创建家宽代理节点 =================
    let residentialProxy;
    try {
        residentialProxy = buildResidentialProxy(CONFIG.residentialProxy);
    } catch (error) {
        log.error(`构建家宽代理失败: ${error.message}`);
        return config;
    }

    // 添加到节点列表开头
    config.proxies.unshift(residentialProxy);
    log.info(`添加家宽代理: ${CONFIG.residentialProxy.name}`);

    // ================= 添加到目标策略组 =================

    const targetGroupSet = new Set(CONFIG.targetGroups);
    let addedCount = 0;

    config['proxy-groups'].forEach(group => {
        if (targetGroupSet.has(group.name)) {
            // 确保 proxies 字段存在
            if (!group.proxies) {
                group.proxies = [];
            }

            // 如果未包含家宽代理，添加到开头
            if (!group.proxies.includes(residentialProxy.name)) {
                group.proxies.unshift(residentialProxy.name);
                addedCount++;
            }
        }
    });

    log.info(`已将家宽代理添加到 ${addedCount} 个策略组`);

    // ================= 完成 =================

    log.info("配置处理完成");
    log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    log.info("📌 使用提示:");
    log.info("1. 在策略组中选择 '🏠 美国住宅代理'");
    log.info("2. 在 '🇺🇸 家宽前置路由' 中选择前置节点:");
    log.info("   - DIRECT: 直连（默认，适合国内访问）");
    log.info("   - 其他节点: 使用机场节点作为前置");
    log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return config;
};
