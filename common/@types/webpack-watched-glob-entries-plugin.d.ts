declare module "webpack-watched-glob-entries-plugin" {
    import * as glob from "glob"
    import webpack = require("webpack")
    interface Files {
        [key: string]: string
    }
    class WebpackWatchedGlobEntries extends webpack.Plugin {
        static getEntries(globs: string[], globOptions?: glob.IOptions, pluginOptions_?: object): webpack.EntryFunc
        static getFiles(globString: string, globOptions?: glob.IOptions, basename_as_entry_name?: boolean): Files
    }

    namespace WebpackWatchedGlobEntries {}

    export = WebpackWatchedGlobEntries
}
