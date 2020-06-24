/* eslint @typescript-eslint/no-var-requires: 0 */
import { argv } from "@flypapertech/avian"
import * as webpack from "webpack"
import * as merge from "webpack-merge"

import { componentsCommonConfig, serverCommonConfig } from "./webpack.common"
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const reportPlugins = argv.FLYPAPER_BUNDLE_REPORT === true ? [new BundleAnalyzerPlugin()] : []

const smp = new SpeedMeasurePlugin()

const componentsDevSpecificConfig: webpack.Configuration = {
    devtool: "inline-source-map",
    mode: "development",
    optimization: {
        splitChunks: {
            chunks: "async"
        }
    },
    plugins: [...reportPlugins]
}

const serverDevSpecificConfig: webpack.Configuration = {
    devtool: "inline-source-map",
    mode: "development"
}

export const ComponentsConfig = smp.wrap(merge(componentsCommonConfig, componentsDevSpecificConfig))
export const ServerConfig = smp.wrap(merge(serverCommonConfig, serverDevSpecificConfig))
