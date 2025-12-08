module.exports = {
  apps: [
    {
      name: 'hey.xyz',
      script: '/home/yoginth/.nvm/versions/node/v22.21.1/bin/pnpm',
      args: 'start',
      cwd: '/home/yoginth/hey/apps/web',
      env: {
        NODE_ENV: 'production',
      },
      restart_delay: 4000,
      max_restarts: 10,
    },
  ],
}
