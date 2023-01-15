const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const util = require("util");
// const { DOMParser } = require('xmldom');
// const { DOMParser } = require('xmldom-qsa')

const escapeStringRegexp = require("escape-string-regexp");

class InterpolateHtmlWithManifestPlugin {
    apply(compiler) {
        // compiler.hooks.compilation.tap(
        //     "InterpolateHtmlPlugin",
        //     (compilation) => {
        compiler.hooks.afterEmit.tapAsync(
            "InterpolateHtmlWithManifestPlugin",
            (compilation, callback) => {
                const assetManifest = JSON.parse(
                    fs.readFileSync("build/asset-manifest.json", "utf8")
                );

                // Get 'files' attribute of assetManifest. If it doesn't exist, return.
                // if (!assetManifest.getAttribute("files")) {
                if (!("files" in assetManifest)) {
                    return;
                }

                // Find all '....html' files in assetManifest.files
                const htmlFiles = Object.keys(assetManifest.files).filter(
                    (key) => key.endsWith(".html")
                );
                // Iterate over all '....html' files
                htmlFiles.forEach((htmlFile) => {
                    // Read in HTML as string, and replace all occurrences of `&key&` with `value`
                    let html = fs.readFileSync(
                        "build" + assetManifest.files[htmlFile],
                        "utf8"
                    );
                    // Log html
                    console.log(`> HTML for ${htmlFile}:`);
                    console.log(html);
                    console.log("");
                    Object.keys(
                        // assetManifest.getAttribute("files") || {}
                        assetManifest.files
                    ).forEach((key) => {
                        /* 
                        console.log(`> Looking for ${key}`);
                        console.log(
                            new RegExp(
                                /\[assetManifest\]/ +
                                    escapeStringRegexp(key) +
                                    /\[\/assetManifest\]/,
                                // "[assetManifest ]" + escapeStringRegexp(key) + "\[/assetManifest\]",
                                "g"
                            )
                        );
 */
                        const value = assetManifest.files[key];
                        let tagPattern = new RegExp(
                            "\\[assetManifest\\]" +
                                escapeStringRegexp(key) +
                                "\\[\\/assetManifest\\]",
                            // "[assetManifest ]" + escapeStringRegexp(key) + "\[/assetManifest\]",
                            "gm"
                        );
                        /* 
                        tagPattern = new RegExp("assetManifest", "g");
                        // Match the pattern across lines and in the middle of lines.
                        tagPattern = new RegExp(
                            "assetManifest",
                            "g" + (tagPattern.ignoreCase ? "i" : "")
                        );
 */
                        /*
                        tagPattern = VerEx()
                            // .startOfLine()
                            .anything()
                            .then("[assetManifest]")
                            .then(key)
                            .then("[/assetManifest]");
                            */
                        // .anything()
                        // .endOfLine();

                        // Output all matches of tagPattern
                        console.log(`> Matches for ${key}:`);
                        // console.log(html.match(tagPattern));
                        console.log(tagPattern.test(html));
                        console.log("");
                        console.log(`> Replacing ${key} with ${value}`);
                        // tagPattern.replace(html, value);

                        // Replace all matches of tagPattern with value
                        html = html.replace(tagPattern, value);
                    });
                    // Write the modified HTML to the file
                    fs.writeFileSync(
                        "build" + assetManifest.files[htmlFile],
                        html
                    );
                });

                /*
                        Object.keys(assetManifest).forEach((key) => {
                            const value = assetManifest[key];
                            data.html = data.html.replace(
                                new RegExp(
                                    "&" + escapeStringRegexp(key) + "&",
                                    "g"
                                ),
                                value
                            );
                        });
                        */

                callback();
            }
        );
    }
}

class TestWebpackPlugin {
    apply(compiler) {
        /* 
        compiler.hooks.emit.tapAsync('TestWebpackPlugin', (compilation, callback) => {
            console.log('The compiler is starting a new compilation...');
            // Write JSON of `compilation` to a file
            fs.writeFileSync('compilation.json', util.inspect(compilation, {showHidden: false, depth: null}));
            // fs.writeFileSync('compilation.json', JSON.stringify(compilation));

            // Log all keys of `compilation`
            console.log(Object.keys(compilation));
            
            // console.log(compilation);
            callback();
        });
         */
        compiler.hooks.afterEmit.tapAsync(
            "TestWebpackPlugin",
            (compilation, callback) => {
                console.log("The compiler has finished emitting assets.");
                // console.log(compilation);
                callback();

                // Load 'asset-manifest.json' from build directory
                const assetManifest = JSON.parse(
                    fs.readFileSync("build/asset-manifest.json", "utf8")
                );
                console.log(assetManifest);

                // Find all '....html' files in assetManifest.files
                const htmlFiles = Object.keys(assetManifest.files).filter(
                    (key) => key.endsWith(".html")
                );
                // Iterate over all '....html' files
                htmlFiles.forEach((htmlFile) => {
                    // Read the file and parse it as HTML
                    const html = fs.readFileSync(
                        "build/" + assetManifest.files[htmlFile],
                        "utf8"
                    );
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    // For any <link> tag with rel='stylesheet' and `data-unhashed-href` attribute ...
                    const linkTags = doc.querySelectorAll(
                        'link[rel="stylesheet"][data-unhashed-href]'
                    );
                    linkTags.forEach((linkTag) => {
                        // If the link tag does not have `data-unhashed-href` attribute, skip it.
                        if (!linkTag.hasAttribute("data-unhashed-href")) {
                            return;
                        }
                        // Add an `href` attribute that has the value of the key in `assetManifest` that
                        // has the value of `data-unhashed-href` attribute
                        linkTag.setAttribute(
                            "href",
                            assetManifest[
                                linkTag.getAttribute("data-unhashed-href")
                            ]
                        );
                        // ... replace the `href` attribute with the value of `data-unhashed-href` attribute
                        // linkTag.setAttribute('href', linkTag.getAttribute('data-unhashed-href'));
                        // Remove the `data-unhashed-href` attribute
                        linkTag.removeAttribute("data-unhashed-href");
                    });
                    console.log(
                        `> ${
                            "build" + assetManifest.files[htmlFile]
                        } (${htmlFile})`
                    );
                    // console.log(doc.outerHTML);

                    // Write the modified HTML to the file
                    fs.writeFileSync(
                        "build" + assetManifest.files[htmlFile],

                        // Convert doc.documentElement.outerHTML to string
                        doc.documentElement.outerHTML
                        // doc.documentElement.outerHTML
                    );
                });
            }
        );
    }
}

module.exports = {
    // Configure webpack to have two entries: main, and the content script
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // console.log(webpackConfig)

            // console.log(webpackConfig.plugins);

            // Get `replacements` from `InterpolateHtmlPlugin`
            const replacements = webpackConfig.plugins.filter(
                (plugin) => plugin.constructor.name === "InterpolateHtmlPlugin"
            )[0].replacements;

            // Remove `InterpolateHtmlPlugin`
            /*
            webpackConfig.plugins = webpackConfig.plugins.filter(
                (plugin) => plugin.constructor.name !== "InterpolateHtmlPlugin"
            );
             */

            // Add `InterpolateHtmlWithManifestPlugin`
            webpackConfig.plugins.push(
                new InterpolateHtmlWithManifestPlugin(replacements)
            );

            // Log InterpolateHtmlPlugin.replacements
            // console.log(webpackConfig.plugins[1].replacements)
            // Log HtmlWebpackPlugin userOptions
            // console.log(webpackConfig.plugins[0].userOptions);

            // Log optimization.minimizer
            // console.log(webpackConfig.optimization.minimizer);
            // console.log(webpackConfig.optimization.minimizer[1].options.minimizer);

            // Log DefinePlugin.definitions
            // console.log(webpackConfig.plugins[3].definitions);

            // Log MiniCssExtractPlugin.options and MiniCssExtractPlugin.runtimeOptions
            /*             
            console.log(webpackConfig.plugins[4].options);
            console.log(webpackConfig.plugins[4].runtimeOptions);

            // Log WebpackManifestPlugin.options
            console.log(webpackConfig.plugins[5].options);

            // Log a horizontal line
            console.log('----------------------------------------');
 */
            // console.log(env);
            // console.log(paths);

            // Add HtmlWebpackPlugin for ui.html
            webpackConfig.plugins.push(
                new HtmlWebpackPlugin({
                    inject: true,
                    template: paths.appPublic + "/ui.html",
                    filename: "ui.html",
                    chunks: ["content"],
                })
            );

            // Add TestWebpackPlugin
            /* 
            webpackConfig.plugins.push(
                new TestWebpackPlugin()
            );
             */

            // webpackConfig.entry = {
            //     app: paths.appIndexJs,
            //     content: paths.appSrc + '/content.js',
            // };
            // return webpackConfig;
            return {
                ...webpackConfig,
                entry: {
                    main: [
                        env === "development" &&
                            require.resolve(
                                "react-dev-utils/webpackHotDevClient"
                            ),
                        paths.appIndexJs,
                    ].filter(Boolean),
                    content: paths.appSrc + "/content-script/content.ts",
                    serviceWorker:
                        paths.appSrc + "/service-worker/serviceWorker.ts",
                },
                output: {
                    ...webpackConfig.output,
                    filename: "static/js/[name].js",
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                },
            };
        },
    },
};
