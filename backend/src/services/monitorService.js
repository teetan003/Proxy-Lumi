import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import prisma from '../utils/prisma.js';

export async function checkProxyHealth(proxy) {
    try {
        const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.proxyIp}:${proxy.port}`;
        const agent = new HttpsProxyAgent(proxyUrl);

        const startTime = Date.now();
        await axios.get('https://api.ipify.org', {
            httpsAgent: agent,
            timeout: 5000
        });
        const latency = Date.now() - startTime;

        return { alive: true, latency };
    } catch (error) {
        return { alive: false, error: error.message };
    }
}

export async function runMonitoringJob() {
    const activeProxies = await prisma.proxy.findMany({
        where: { status: 'active' }
    });

    console.log(`Monitoring ${activeProxies.length} proxies...`);

    for (const proxy of activeProxies) {
        const health = await checkProxyHealth(proxy);
        if (!health.alive) {
            console.warn(`Proxy ${proxy.proxyIp}:${proxy.port} is DEAD. Error: ${health.error}`);
            // Logic to disable or alert
        } else {
            console.log(`Proxy ${proxy.proxyIp}:${proxy.port} is ALIVE. Latency: ${health.latency}ms`);
        }
    }
}
