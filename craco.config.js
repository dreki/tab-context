module.exports = {
    // Configure webpack to have two entries: main, and the content script
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // webpackConfig.entry = {
            //     app: paths.appIndexJs,
            //     content: paths.appSrc + '/content.js',
            // };
            // return webpackConfig;
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
                    content: paths.appSrc + '/content-script/content.ts',
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }
        }
    }
}
