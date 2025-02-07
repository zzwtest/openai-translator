/* eslint-disable camelcase */
import { getUniversalFetch } from '@/common/universal-fetch'
import { getSettings, isDesktopApp } from '@/common/utils'
import { AbstractEngine } from '@/common/engines/abstract-engine'
import { IModel, IMessageRequest } from '@/common/engines/interfaces'

export const keyKimiAccessToken = 'kimi-access-token'
export const keyKimiRefreshToken = 'kimi-refresh-token'
export class GoogleTrans extends AbstractEngine {
    async checkLogin(): Promise<boolean> {
        const fetcher = getUniversalFetch()

        const headers = await this.getHeaders()

        const resp = await fetcher('https://kimi.moonshot.cn/api/user', {
            method: 'GET',
            headers,
        })

        return resp.status === 200
    }

    async getModel(): Promise<string> {
        return ''
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async listModels(_apiKey: string | undefined): Promise<IModel[]> {
        return []
    }

    async getHeaders() {
        const settings = await getSettings()
        let accessToken = settings.kimiAccessToken

        if (!isDesktopApp()) {
            const browser = (await import('webextension-polyfill')).default
            const config = await browser.storage.local.get([keyKimiAccessToken])
            accessToken = config[keyKimiAccessToken]
        }

        // generate traffic id like clg4susodhsh25d6vdhv
        const trafficID = Array.from({ length: 20 }, () => Math.floor(Math.random() * 36).toString(36)).join('')

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.41',
            'Origin': 'https://kimi.moonshot.cn',
            'Referer': 'https://kimi.moonshot.cn/',
            'X-Traffic-Id': trafficID,
        }
    }

    async sendMessage(req: IMessageRequest): Promise<void> {
        console.log(req)
        req.onStatusCode?.(200)
        req.onError('GoogleTrans: ' + 'TODO1')
        return
    }
}
