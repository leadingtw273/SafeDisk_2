module.exports = {
    apps: [
        {
            name: 'SafeDisk_2',
            script: './bin/www',
            exec_mode: 'cluster',
            watch: false,
            instances: 1,
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
