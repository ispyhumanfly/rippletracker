/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-internal-modules */
import { argv } from "@flypapertech/avian"
import * as path from "path"
import * as VueLoader from "vue-loader"
import * as webpack from "webpack"
import * as nodeExternals from "webpack-node-externals"
import * as WebpackWatchedGlobEntries from "webpack-watched-glob-entries-plugin"
const IgnoreNotFoundExportPlugin = require("ignore-not-found-export-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

/* HACK This can be removed once webpack accepts our pull request
 * https://github.com/webpack/webpack/pull/10297
 */

const WebpackError = require("webpack/lib/WebpackError")
class EnvironmentPlugin {
    keys: any
    options: any
    defaultValues: any
    constructor(...keys: any[]) {
        this.options = {}
        if (keys.length > 1) {
            const options = keys[keys.length - 1]
            if (typeof options === "object") {
                this.options = options
                // remove options object from env keys
                keys.pop()
            }
        }

        if (keys.length === 1 && Array.isArray(keys[0])) {
            this.keys = keys[0]
            this.defaultValues = {}
        } else if (keys.length === 1 && keys[0] && typeof keys[0] === "object") {
            this.keys = Object.keys(keys[0])
            this.defaultValues = keys[0]
        } else {
            this.keys = keys
            this.defaultValues = {}
        }
    }

    apply(compiler: any) {
        const definitions = {}
        for (const key of this.keys) {
            const value = process.env[key] !== undefined ? process.env[key] : this.defaultValues[key]

            if (value === undefined) {
                compiler.hooks.thisCompilation.tap("EnvironmentPlugin", (compilation: any) => {
                    // @ts-ignore
                    const error = new WebpackError(
                        `EnvironmentPlugin - ${key} environment variable is undefined.\n\n` +
                            "You can pass an object with default values to suppress this warning.\n" +
                            "See https://webpack.js.org/plugins/environment-plugin for example."
                    )

                    error.name = "EnvVariableNotDefinedError"
                    if (this.options["errorLevel"] === "error") compilation.errors.push(error)
                    else compilation.warnings.push(error)
                })
            }

            // @ts-ignore
            definitions[`process.env.${key}`] = value === undefined ? "undefined" : JSON.stringify(value)
        }

        new webpack.DefinePlugin(definitions).apply(compiler)
    }
}

/**
 * @param subdir
 */
function srcPath(subdir: string) {
    return path.join(argv.home, subdir)
}

export const componentsCommonConfig: webpack.Configuration = {
    target: "web",
    entry: {
        "protest.client": "components/protest.client.web.ts"
    },
    output: {
        path: `${argv.home}/public`,
        filename: "[name].bundle.js",
        publicPath: "/",
        pathinfo: false
    },
    resolve: {
        extensions: [
            `.${argv.mode}.web.js`,
            ".web.js",
            `.${argv.mode}.js`,
            ".js",
            `.${argv.mode}.web.ts`,
            ".web.ts",
            `.${argv.mode}.ts`,
            ".ts",
            `.${argv.mode}.web.scss`,
            ".web.scss",
            `.${argv.mode}.scss`,
            ".scss",
            `.${argv.mode}.web.less`,
            ".web.less",
            `.${argv.mode}.less`,
            ".less",
            `.${argv.mode}.web.css`,
            ".web.css",
            `.${argv.mode}.css`,
            ".css",
            `.${argv.mode}.web.pug`,
            ".web.pug",
            `.${argv.mode}.pug`,
            ".pug",
            ".vue",
            ".json"
        ],
        alias: {
            vue$: "vue/dist/vue.js",
            common: srcPath("common"),
            components: srcPath("components")
        }
    },
    plugins: [
        new WebpackWatchedGlobEntries(),
        new VueLoader.VueLoaderPlugin(),
        new EnvironmentPlugin(
            ["FLYPAPER_AUTH0_DOMAIN", "FLYPAPER_AUTH0_CLIENT_ID", "FLYPAPER_AUTH0_REDIRECT_URL", "FLYPAPER_GOOGLE_MAPS_API_KEY", "FLYPAPER_API_URL"],
            { errorLevel: "error" }
        ),
        new webpack.DefinePlugin({
            MODE: JSON.stringify(argv.mode),
            LOGLABEL: JSON.stringify("client.web")
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            reportFiles: [
                "**/*.{ts,tsx}",
                "!**/*.mobile.{ts,tsx}",
                "!**/*server.{ts,tsx}",
                "!mobile/**/*.ts",
                "!scripts/**/*.ts",
                "!aws/**/*.ts",
                "!common/WebViewKit.ts"
            ]
        }),
        new IgnoreNotFoundExportPlugin({
            ignore: /\.schema?$/
        })
    ],
    externals: {
        vue: "Vue",
        axios: "axios",
        luxon: "luxon"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loaders: [
                    {
                        loader: "vue-loader"
                    }
                ]
            },
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to `<template lang="pug">` in Vue components
                    {
                        resourceQuery: /^\?vue/,
                        use: ["pug-plain-loader"]
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["vue-style-loader", "css-loader", { loader: "sass-loader", options: { implementation: require("sass") } }]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }]],
                        plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-transform-arrow-functions"]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }]],
                            plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-transform-arrow-functions"]
                        }
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ]
            },
            {
                test: /\.styl$/,
                loader: ["style-loader", "css-loader", "stylus-loader"]
            }
        ]
    }
}

export const serverCommonConfig: webpack.Configuration = {
    target: "node",
    entry: WebpackWatchedGlobEntries.getEntries([`${argv.home}/components/**/*server.*`], {
        ignore: `${argv.home}/components/**/serverless/*`
    }),
    output: {
        path: `${argv.home}/private`,
        filename: "[name].js",
        libraryTarget: "commonjs2",
        pathinfo: false
    },
    resolve: {
        extensions: [`.${argv.mode}.ts`, ".ts", ".js", ".json"],
        alias: {
            common: srcPath("common"),
            components: srcPath("components")
        }
    },
    plugins: [
        new WebpackWatchedGlobEntries(),
        new webpack.DefinePlugin({
            MODE: JSON.stringify(argv.mode),
            LOGLABEL: JSON.stringify("server")
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            reportFiles: [
                "**/*.{ts,tsx}",
                "!**/*.mobile.{ts,tsx}",
                "!**/*.client.{ts,tsx}",
                "!mobile/**/*.ts",
                "!scripts/**/*.ts",
                "!aws/**/*.ts",
                "!common/WebViewKit.ts"
            ]
        }),
        new IgnoreNotFoundExportPlugin({
            ignore: /\.schema?$/
        })
    ],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loaders: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    }
                ]
            }
        ]
    }
}
