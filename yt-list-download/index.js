const path = require('path')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const ffmpeg = require('fluent-ffmpeg')
const sanitizeFilename = require('sanitize-filename')

const {
  VIDEO_DIR = 'videos',
  FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg'
} = process.env

const LIST_URL = 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S'

async function main() {
  const { items } = await ytpl(LIST_URL, { pages: Number.POSITIVE_INFINITY })

  for (let i = 0; i < items.length; i++) {
    const videoUrl = items[i].url
    const { title } = (await ytdl.getBasicInfo(videoUrl, {})).videoDetails
    const videoPath = path.join(VIDEO_DIR, `${sanitizeFilename(title)}.mp3`)

    await new Promise(resolve => {
      const source = ytdl(videoUrl, {
        filter: 'audioonly',
        format: 'flv',
      })

      const process = new ffmpeg({ source })

      process.setFfmpegPath(FFMPEG_PATH)
      process.withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .output(require('fs').createWriteStream(videoPath))
        .run()

      process.on('end', resolve)
    })

    console.info(`Downloaded [${i}/${items.length}]: ${videoPath}`)
  }
}

main()
