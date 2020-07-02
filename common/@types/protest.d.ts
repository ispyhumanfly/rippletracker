/* eslint-disable @typescript-eslint/no-explicit-any */
declare let TNS_ENV: string
declare let MODE: string
declare let LOGLABEL: string

declare module "tz-lookup"
declare module "pdfmake"
declare module "vue-socket.io"
declare module "socket.io-client"
declare module "nativescript-vue-devtools"
declare module "@flypapertech/nativescript-fonticon"
declare module "ffmpeg-static"
declare module "magick-cli"
declare module "tempy"
declare module "vue-clazy-load"
declare module "vue-doc-preview"
declare module "box-node-sdk"
declare module "filepreview"
declare module "cookie"
declare module "cookie-signature"
declare module "json-schema-merge-allof"
declare module "vuedraggable"
declare module "unzipper"
declare module "vuetify-google-autocomplete"

declare module "*.vue" {
    import Vue from "vue"
    export default Vue
}

declare module "*.scss" {
    const value: any
    export default value
}

declare module "*.json" {
    const value: any
    export default value
}

// Doesn't need to be definitely typed, it won't help us since its a vue component with props
declare module "vue2-dropzone"

interface Dictionary<T> {
    [index: string]: T
}

interface ProtestTokenResponse {
    token: string
}

interface Snack {
    action?: () => void
    actionText?: string
    color: "error" | "success" | "warning" | "info"
    message: string
    noAction?: () => {}
    timeout?: number
}

interface SSEData {
    action: string
    data: any
}

interface AvailablePatches {
    [key: string]: (newValue: any, oldValue: any) => Promise<unknown | PatchFailure>
}

type PatchArrayMode = "append" | "remove" | "replace"
interface PatchFailure {
    error: string
}

interface IdsWithAccess {
    componentAccess: {
        access: string[]
        date_removed?: string
    }
    ids: number[]
}

interface Navigation {
    [key: string]: Array<NavigationPart>
}

interface NavigationPart {
    companyAdmin?: boolean
    description: string
    href: string
    icon: string
    mobile: boolean
    modes?: string[]
    name: string
    projectAdmin?: boolean
}
interface RequiredId {
    id: number
}
