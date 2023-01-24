const path = require('path')

const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    // mode: 'development',
    mode: 'production',
    optimization: {
        usedExports: true,
    },

    watch: true,

    plugins: [
        new WebpackBuildNotifierPlugin({
            title: "My Webpack Project",
            logo: path.resolve("./favicon.png"),
            suppressSuccess: true, // don't spam success notifications
            successSound: "/usr/share/sounds/LinuxMint/stereo/dialog-information.ogg",
            failureSound: "/usr/share/sounds/LinuxMint/stereo/dialog-error.ogg"
        })
    ]
};