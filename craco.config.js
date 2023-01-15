const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");

const escapeStringRegexp = require("escape-string-regexp");

/**
 * This plugin for webpack will find all HTML files in `build/asset-manifest.json` and replace all
 * occurrences of `#manifest('key')#` with `value` from `build/asset-manifest.json`.
 *
 * Using this plugin, you can replace dynamically-generated URLs in your HTML files with the actual
 * URLs. (Dynamically-generated URLs can include content hashes, making them difficult to predict.)
 *
 * Note that this plugin will only process HTML files that are listed in
 * `build/asset-manifest.json`. Typically this means that you need HtmlWebpackPlugin to be aware of
 * the HTML file.
 */
class InterpolateHtmlWithManifestPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync(
            "InterpolateHtmlWithManifestPlugin",
            (compilation, callback) => {
                const assetManifest = JSON.parse(
                    fs.readFileSync("build/asset-manifest.json", "utf8")
                );

                // Get 'files' attribute of assetManifest. If it doesn't exist, return.
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
                    Object.keys(assetManifest.files).forEach((key) => {
                        const value = assetManifest.files[key];
                        let tagPattern = new RegExp(
                            "\\[assetManifest\\]" +
                                escapeStringRegexp(key) +
                                "\\[\\/assetManifest\\]",
                            "gm"
                        );
                        // Set the pattern to match strings like "#manifest('main.css')#"
                        tagPattern = new RegExp(
                            "#manifest\\('" + escapeStringRegexp(key) + "'\\)#",
                            "gm"
                        );
                        // Replace all matches of tagPattern with value
                        html = html.replace(tagPattern, value);
                    });
                    // Write the modified HTML to the file
                    fs.writeFileSync(
                        "build" + assetManifest.files[htmlFile],
                        html
                    );
                });
                // All done
                callback();
            }
        );
    }
}

module.exports = {
    // Configure webpack to have two entries: main, and the content script
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // Add HtmlWebpackPlugin for ui.html. We need to do this so it's in the manifest and
            // will be processed by InterpolateHtmlWithManifestPlugin.
            webpackConfig.plugins.push(
                new HtmlWebpackPlugin({
                    inject: true,
                    template: paths.appPublic + "/ui.html",
                    filename: "ui.html",
                    // chunks: ["content"],˝
                })
            );

            // Add `InterpolateHtmlWithManifestPlugin`
            webpackConfig.plugins.push(new InterpolateHtmlWithManifestPlugin());

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
