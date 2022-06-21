const fs = require('fs')
const path = require('path')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const sanitizeFilename = require('sanitize-filename')

const {
  VIDEO_DIR = 'videos',
} = process.env

const LIST_URL = 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S'

async function main() {
  const { items } = await ytpl(LIST_URL, { pages: Number.POSITIVE_INFINITY })

  for (let i = 0; i < items.length; i++) {
    const videoUrl = items[i].url
    const { title } = (await ytdl.getBasicInfo(videoUrl, {})).videoDetails

    const videoPath = path.join(VIDEO_DIR, `${sanitizeFilename(title)}.mp3`)
    const ws = fs.createWriteStream(videoPath)

    ytdl(videoUrl, {
      quality: 'highestaudio'
    }).pipe(ws)

    await new Promise(resolve => {
      ws.once('close', resolve)
    })

    console.info(`Downloaded [${i}/${items.length}]: ${videoPath}`)
  }
}

main()
