import { default as Logger } from 'electron-log'

export const log = Logger.create({ logId: 'mainInstance' })

const d = new Date()
const prefix = d.getFullYear() + ('00' + (d.getMonth() + 1)).slice(-2) + ('00' + d.getDate()).slice(-2)

const curr = log.transports.file.fileName
log.transports.file.fileName = `${prefix}_${curr}`

log.errorHandler.startCatching()
