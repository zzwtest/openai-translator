export interface IUserInfo {
    user_id: string
    user_name: string
    created_at?: string
}

// 读取用户 Token 的函数（返回 Promise）
export const getUserToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['userToken'], (result) => {
            resolve(result.userToken || null)
        })
    })
}

// 存储用户 Token 的函数（可选补充）
export const saveUserToken = (token: string): Promise<void> => {
    return new Promise((resolve) => {
        chrome.storage.local.set({ userToken: token }, () => {
            resolve()
        })
    })
}

export async function userInfo(): Promise<IUserInfo> {
    const token = await getUserToken()
    if (!token) {
        return {} as IUserInfo
    }
    try {
        const resp = await fetch(
            `https://api.example.com/user-info`, // 替换为实际的API接口地址
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        if (!resp.ok) {
            throw new Error(resp.statusText)
        }
        return await resp.json()
    } catch (error) {
        console.error('Error fetching user info: ', error)
        return {} as IUserInfo
    }
}
