import { UserConfig } from 'vite'
import solid from 'vite-plugin-solid'
import * as path from "path";

export const ViteComConfig: UserConfig = {
    plugins: [solid({
        hot: false
    })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src"),
        }
    },
}