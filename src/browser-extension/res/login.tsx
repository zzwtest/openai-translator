import '../enable-dev-hmr'
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../../common/i18n.js'
import './index.css'
import beams from '../../common/assets/images/beams.jpg'
import * as utils from '../../common/utils'
import { Button } from 'baseui-sd/button'
import { Tabs, Tab } from 'baseui-sd/tabs-motion'
import { IoSettingsOutline } from 'react-icons/io5'

import { PiTextbox } from 'react-icons/pi'
import { TbCloudNetwork } from 'react-icons/tb'
import { BsKeyboard } from 'react-icons/bs'

import { createUseStyles } from 'react-jss'
import { IThemedStyleProps } from '../../common/types'
import { useTheme } from '../../common/hooks/useTheme'
import browser from 'webextension-polyfill'
import { optionsPageHeaderPromotionIDKey, optionsPageOpenaiAPIKeyPromotionIDKey } from '../common'

const useStyles = createUseStyles({
    root: (props: IThemedStyleProps) => ({
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: props.theme.colors.backgroundSecondary,
        minHeight: '100%',
    }),
    container: {
        maxWidth: '768px',
        height: '100%',
    },
})

const Login = () => {
    const { theme, themeType } = useTheme()
    const styles = useStyles({ theme, themeType })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__IS_OT_BROWSER_EXTENSION_OPTIONS__ = true
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [headerPromotionID, setHeaderPromotionID] = useState<string>()
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [isScrolled, setIsScrolled] = useState(window.scrollY > 0)

    useEffect(() => {
        browser.storage.local.get(optionsPageOpenaiAPIKeyPromotionIDKey).then((resp) => {
            setOpenaiAPIKeyPromotionID(resp[optionsPageOpenaiAPIKeyPromotionIDKey])
            browser.storage.local.remove(optionsPageOpenaiAPIKeyPromotionIDKey)
        })
    }, [])

    useEffect(() => {
        browser.storage.local.get(optionsPageHeaderPromotionIDKey).then((resp) => {
            setHeaderPromotionID(resp[optionsPageHeaderPromotionIDKey])
            browser.storage.local.remove(optionsPageHeaderPromotionIDKey)
        })
    }, [])

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <nav
                    style={{
                        position: utils.isBrowserExtensionOptions() ? 'sticky' : 'fixed',
                        left: 0,
                        top: 0,
                        zIndex: 999,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: `url(${utils.getAssetUrl(beams)}) no-repeat center center`,
                        boxSizing: 'border-box',
                        boxShadow: isScrolled ? theme.lighting.shadow600 : undefined,
                    }}
                    data-tauri-drag-region
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: '#333',
                            gap: 10,
                            padding: '15px 25px 0 25px',
                        }}
                    >
                        <img width='22' src={utils.getAssetUrl(icon)} alt='logo' />
                        <h2
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            OpenAI Translator
                            {AppConfig?.version ? (
                                <a
                                    href='https://github.com/yetone/openai-translator/releases'
                                    target='_blank'
                                    rel='noreferrer'
                                    style={linkStyle}
                                >
                                    {AppConfig.version}
                                </a>
                            ) : null}
                        </h2>
                        <div
                            style={{
                                flexGrow: 1,
                            }}
                        />
                        <div>
                            <Button
                                kind='secondary'
                                size='mini'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowBuyMeACoffee(true)
                                    trackEvent('buy_me_a_coffee_clicked')
                                }}
                            >
                                {'❤️  ' + t('Buy me a coffee')}
                            </Button>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: '#333',
                            gap: 10,
                            padding: '15px 25px 0 25px',
                        }}
                    >
                        当前账号:
                        {Object.keys(userInfo).length === 0 ? (
                            <Button
                                size='mini'
                                onClick={() => {
                                    /* 处理登录逻辑 */

                                    const loginUrl = chrome.runtime.getURL('src/browser-extension/res/login.html')

                                    // 使用 chrome.tabs API 打开新标签页
                                    chrome.tabs.create({ url: loginUrl })

                                    console.log('登录登录登录')
                                }}
                            >
                                登录
                            </Button>
                        ) : (
                            userInfo.user_name
                        )}
                    </div>

                    <Tabs
                        overrides={tabsOverrides}
                        activeKey={activeTab}
                        onChange={({ activeKey }) => {
                            setActiveTab(activeKey as string)
                        }}
                        fill='fixed'
                        renderAll
                    >
                        <Tab
                            title={t('General')}
                            key='general'
                            artwork={() => {
                                return <IoSettingsOutline size={14} />
                            }}
                            overrides={tabOverrides}
                        />
                        {isTauri && (
                            <Tab
                                title={t('Proxy')}
                                key='proxy'
                                artwork={() => {
                                    return <TbCloudNetwork size={14} />
                                }}
                                overrides={tabOverrides}
                            />
                        )}

                        <Tab
                            title={t('Writing')}
                            key='writing'
                            artwork={() => {
                                return <PiTextbox size={14} />
                            }}
                            overrides={tabOverrides}
                        />
                        <Tab
                            title={t('Shortcuts')}
                            key='shortcuts'
                            artwork={() => {
                                return <BsKeyboard size={14} />
                            }}
                            overrides={{
                                ...tabOverrides,
                                Tab: {
                                    ...tabOverrides.Tab,
                                    props: {
                                        'data-testid': 'shortcuts',
                                    },
                                },
                            }}
                        />
                    </Tabs>
                </nav>
            </div>
        </div>
    )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Login />
    </React.StrictMode>
)
