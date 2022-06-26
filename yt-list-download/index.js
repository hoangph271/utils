const fs = require('fs')
const path = require('path')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const sanitizeFilename = require('sanitize-filename')

const { VIDEO_DIR = 'videos' } = process.env

const LIST_URL = 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S'

async function main() {
  const { items } = await ytpl(LIST_URL, { pages: Number.POSITIVE_INFINITY })

  for (let i = 0; i < items.length; i++) {
    const videoUrl = items[i].url
    const { title } = (await ytdl.getBasicInfo(videoUrl, {})).videoDetails
    const videoPath = path.join(VIDEO_DIR, `${sanitizeFilename(title)}.flv`)

    await new Promise(resolve => {
      const ws = fs.createWriteStream(videoPath)

      ws.once('finish', resolve)

      ytdl(videoUrl, {
        filter: 'audioonly',
        format: 'flv',
      }).pipe(ws)
    })

    console.info(`Downloaded [${i}/${items.length}]: ${videoPath}`)
  }
}

main()
