const getters = {
  userInfo: ({ app }) => app.userInfo,
  token: ({ app }) => app.userInfo.accessToken,
  realName: ({ app }) => app.userInfo.realName,
  idCode: ({ app }) => app.userInfo.idCode,
  appInfo: ({ app }) => app.appInfo,
  useZhb: ({ app }) => app.appInfo.useZhb,
  isIdentify: ({ app }) => app.isIdentify
}
export default getters
