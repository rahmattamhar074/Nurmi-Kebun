---
description: Deploy Inertia SSR on aaPanel with PM2
---

# Deploy Inertia SSR on aaPanel

## Prerequisites
- PM2 installed globally: `npm install -g pm2`
- Node.js installed on server

## Deployment Steps

### 1. Build SSR Bundle
```bash
pnpm build:ssr
```
This creates both the client bundle and SSR bundle at `bootstrap/ssr/ssr.js`.

### 2. Update ecosystem.config.cjs
Edit the `cwd` path to match your aaPanel project path:
```javascript
cwd: '/www/wwwroot/kizaru-pos', // Your actual project path
```

### 3. Start SSR Server with PM2
```bash
# Start the SSR server
pm2 start ecosystem.config.cjs

# Save PM2 process list (survives reboots)
pm2 save

# Enable PM2 startup on boot
pm2 startup
# Then run the command it outputs
```

### 4. Verify SSR is Running
```bash
# Check PM2 status
pm2 status

# View SSR logs
pm2 logs inertia-ssr

# Test SSR endpoint directly
curl http://127.0.0.1:13714
```

## Useful PM2 Commands
```bash
pm2 restart inertia-ssr   # Restart SSR server
pm2 stop inertia-ssr      # Stop SSR server
pm2 delete inertia-ssr    # Remove from PM2
pm2 logs inertia-ssr      # View logs
pm2 monit                 # Real-time monitoring
```

## After Code Updates
// turbo-all
```bash
# Rebuild SSR bundle after code changes
pnpm build:ssr

# Restart SSR server to pick up changes
pm2 restart inertia-ssr
```

## Troubleshooting

### SSR Not Working
1. Check if SSR server is running: `pm2 status`
2. Check logs: `pm2 logs inertia-ssr`
3. Verify port 13714 is not blocked

### Pages Rendering Without SSR
1. Ensure `config/inertia.php` has `'enabled' => true` in SSR section
2. Verify SSR bundle exists: `ls bootstrap/ssr/ssr.js`
3. Restart SSR server: `pm2 restart inertia-ssr`
