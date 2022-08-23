const path = require('path')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const ffmpeg = require('fluent-ffmpeg')
const sanitizeFilename = require('sanitize-filename')

const {
  VIDEO_DIR = 'videos',
  FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg',
  OUTPUT = 'mp3'
} = process.env

const LIST_URL = 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S'

async function main() {
  const { items } = await ytpl(LIST_URL, { pages: Number.POSITIVE_INFINITY })

  for (let i = 0; i < items.length; i++) {
    const videoUrl = items[i].url
    const { title } = (await ytdl.getBasicInfo(videoUrl, {})).videoDetails

    const downloadMp3 = async (videoUrl, outputPath) => {
      const source = ytdl(videoUrl, {
        filter: 'audioonly',
        format: 'flv',
      })

      const process = new ffmpeg({ source })
      process.setFfmpegPath(FFMPEG_PATH)
      process.withAudioCodec('libmp3lame')
        .toFormat('mp3')
        .output(require('fs').createWriteStream(outputPath))
        .run()

      return new Promise(resolve => {
        process.on('end', resolve)
      })
    }

    // ! Not sure if this function works
    const downloadMp4 = (videoUrl, outputPath) => {
      // const ws = require('fs').createWriteStream(videoPath)
      // ytdl(videoUrl, { format: bestFormat }).pipe(ws)

      // ws.once('finish', () => {
      //   resolve()
      //   console.info(`Saved: ${videoPath}`)
      // })

      const process = new ffmpeg({ source })

      process.setFfmpegPath(FFMPEG_PATH)
      process.withAudioCodec('libmp3lame')
        .toFormat('mp4')
        .output(require('fs').createWriteStream(videoPath))
        .run()

      return new Promise(resolve => {
        process.on('end', resolve)
      })
    }

    const isMp3 = OUTPUT === 'mp3'
    const ext = isMp3 ? 'mp3' : 'mp4'
    const videoPath = path.join(VIDEO_DIR, `${sanitizeFilename(title)}.${ext}`)

    if (isMp3) {
      await downloadMp3(videoUrl, videoPath)
    } else {
      await downloadMp4(videoUrl, videoPath)
    }

    console.info(`[Done] [${i + }/${items.length}]: ${videoPath}`)
  }
}

main()
