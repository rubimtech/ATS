module.exports = {
    entry: {
        app: './assets/js/app.js',
    },
    output: {
        filename: '[name].min.js',
        path: __dirname + '/assets/js/',
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /.js$/,
            exclude: function(modulePath) {
                return /node_modules/.test(modulePath) &&
                    !/runtime/.test(modulePath);
            },
            use: [{
                loader: 'babel-loader',
                options: { sourceMaps: true }
            }]
        }, 
        // {
        //     test: require.resolve('jquery'),
        //     loader: 'expose-loader',
        //     options: {
        //         exposes: ["$", "jQuery"],
        //     },
        // }
        ]
    },
    // externals: function ({request, context}, callback) {
    //     if(request === 'jquery' && require.resolve('bootstrap').indexOf(context) === 0) {
    //         return callback(null, 'jQuery');
    //     }
    //     callback();
    // }
};
