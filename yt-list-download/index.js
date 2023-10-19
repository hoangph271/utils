const path = require('path')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const sanitizeFilename = require('sanitize-filename')
const fs = require('fs-extra')

require('dotenv').config()

const blackLists = [
  'Hozier - Take Me To Church',
];

async function main() {
  const inputs = require('./inputs')

  for (const input of inputs) {
    await fs.ensureDir(input.directory)

    try {
      const { items } = await ytpl(input.url, { pages: Number.POSITIVE_INFINITY })

      for (let i = 0; i < items.length; i++) {
        if (blackLists.some(keyword => items[i].title.toLowerCase().includes(keyword.toLowerCase()))) {
          console.info(`[BLACK_LISTED]: ${items[i].title}`)
          continue
        }

        console.info(`[START] ${items[i].title}`)

        try {
          await downloadItem(i, items, input)
        } catch (error) {
          console.error(err)
          console.info(`Failed: ${items[i].title}`)
        }
      }
    } catch (error) {
      console.error(error)
      console.error(`Failed for: ${JSON.stringify(input, null, 2)}`)
    }
  }
}

main()

const downloadItem = async (i, items, input) => {
  const { url: videoUrl, title } = items[i]

  const ext = input.onlyAudio ? 'mp3' : 'mp4'
  const filePath = path.join(input.directory, `${sanitizeFilename(title)}.${ext}`)
  const tempFilePath = `${filePath}._temp`
  const index = `[${i + 1}/${items.length}]`

  if (await fs.pathExists(filePath)) {
    // TODO: env to toggle skipping...?
    console.info(`[Skip] ${index}: ${filePath}`)
    return
  }

  await downloadMp4(videoUrl, tempFilePath)


  await fs.move(tempFilePath, filePath)

  console.info(`[Done] ${index}: ${filePath}`)
}

// ! Not sure if this function works
// const { FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg' } = process.env
const downloadMp4 = async (videoUrl, outputPath) => {
  const ws = fs.createWriteStream(outputPath)

  const ytdlStream = ytdl(videoUrl, { filter: 'audioandvideo', format: 'mp4' })

  ytdlStream.pipe(ws)

  await new Promise((resolve, reject) => {
    ws.once('finish', () => resolve())
    ws.once('error', reject)
  })
}
