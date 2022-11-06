const path = require('path')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const ffmpeg = require('fluent-ffmpeg')
const sanitizeFilename = require('sanitize-filename')
const fs = require('fs-extra')

require('dotenv').config()

async function main() {
  const inputs = require('./inputs')

  for (const input of inputs) {
    const { items } = await ytpl(input.url, { pages: Number.POSITIVE_INFINITY })

    for (let i = 0; i < items.length; i++) {
      const { url: videoUrl, title } = items[i]

      const ext = input.onlyAudio ? 'mp3' : 'mp4'
      const videoPath = path.join(input.directory, `${sanitizeFilename(title)}.${ext}`)

      const index = `[${i + 1}/${items.length}]`

      if (await fs.pathExists(videoPath)) {
        // TODO: env to toggle skipping...?
        console.info(`[Skip] ${index}: ${videoPath}`)
        continue
      }

      if (input.onlyAudio) {
        await downloadMp3(videoUrl, videoPath)
      } else {
        await downloadMp4(videoUrl, videoPath)
      }

      console.info(`[Done] ${index}: ${videoPath}`)
    }
  }
}

main()


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
const { FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg' } = process.env
const downloadMp4 = async (videoUrl, outputPath) => {
  const ws = fs.createWriteStream(outputPath)

  ytdl(videoUrl, { filter: 'audioandvideo', format: 'mp4' }).pipe(ws)

  await new Promise((resolve) => {
    ws.once('finish', () => {
      resolve()
      console.info(`Saved: ${outputPath}`)
    })
  })

  // const process = new ffmpeg({ source: fs.createReadStream(outputPath) })

  // process.setFfmpegPath(FFMPEG_PATH)
  // process.withAudioCodec('libmp3lame')
  //   .toFormat('mp4')
  //   .output(require('fs').createWriteStream(outputPath))
  //   .run()

  // return new Promise(resolve => {
  //   process.on('end', resolve)
  // })
}
