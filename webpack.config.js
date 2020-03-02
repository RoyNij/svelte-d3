const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules : [
            {
                test: /\.(html|svelte)$/,
                exclude: /node_modules/,
                use: 'svelte-loader'
            }
        ]
    },
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
    }
}