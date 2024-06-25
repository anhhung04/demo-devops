module.exports = {
    apps: [
        {
            name: 'demo-devops',
            script: 'bin/www',
            autorestart: true,
            watch: true,
            max_memory_restart: '2G',
            env: {
                NODE_ENV: 'production'
            },
            env_development: {
                NODE_ENV: 'development'
            }
        }
    ]
};