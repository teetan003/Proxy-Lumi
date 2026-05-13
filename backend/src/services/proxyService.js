import fs from 'fs';
import prisma from '../utils/prisma.js';
import { exec } from 'child_process';
import path from 'path';

export async function regenerate3Proxy() {
    const proxies = await prisma.proxy.findMany({
        where: {
            status: 'active'
        }
    });

    let cfg = `
# Global settings
daemon
auth strong
maxconn 2000
nserver 8.8.8.8
nserver 1.1.1.1
log /var/log/3proxy/3proxy.log D
logformat "- +_L%t.%. %C:%c %R:%r %Q/%E %I %O %h %T"
archiver rar rar a -df -inul %A %f

# Users and Proxies
`;

    proxies.forEach(p => {
        cfg += `
users ${p.username}:CL:${p.password}
allow ${p.username}
proxy -n -a -p${p.port} -e${p.proxyIp}
flush
`;
    });

    const configPath = process.env.NODE_ENV === 'production' 
        ? '/etc/3proxy/3proxy.cfg' 
        : path.join(process.cwd(), '../proxy-node/3proxy.cfg');

    fs.writeFileSync(configPath, cfg);

    // In a real docker environment, you might use a signal or a container restart
    // For now, we'll try to run a command if possible, or just log it
    console.log('3proxy config regenerated at', configPath);
    
    // Example of how to reload 3proxy if it was local:
    // exec('pkill -HUP 3proxy', (err) => { ... });
}
