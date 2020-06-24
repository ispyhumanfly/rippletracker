declare module "progress-bar-webpack-plugin" {
    import webpack = require("webpack")
    interface Options {
        format?: string
        width?: number
        complete?: string
        incomplete?: string
        renderThrottle?: number
        clear?: boolean
        callback?: Function
        stream?: NodeJS.WritableStream
        summary?: boolean
        summaryContent?: string
        customSummary?: CustomSummaryCallback
    }

    type CustomSummaryCallback = (buildTime: string) => any

    class ProgressBarPlugin extends webpack.Plugin {
        constructor(options: Options)
    }

    namespace ProgressBarPlugin {}

    export = ProgressBarPlugin
}
