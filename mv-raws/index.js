const path = require('path')
const fs = require('fs-extra')

require('dotenv').config()

const { TARGET, RAW_EXTS = '.CR2', RAW_DIR_NAME = '_raws' } = process.env

let totalCount = 0

async function moveRaws (rootPath) {
  const stats = await fs.stat(rootPath)
  const hasRawDirName = path.basename(rootPath) === RAW_DIR_NAME
  const isRawDir = stats.isDirectory() && hasRawDirName

  if (isRawDir) {
    console.info(`SKIP - Raw dir: ${rootPath}`)
    return
  }

  const children = await fs.readdir(rootPath)
  const rawDir = path.join(rootPath, RAW_DIR_NAME)

  for (const itemName of children) {
    const itemPath = path.join(rootPath, itemName)
    const stats = await fs.stat(itemPath)

    if (stats.isDirectory()) {
      await moveRaws(itemPath)
      continue
    }

    const isRaw = RAW_EXTS.split(',').includes(path.extname(itemName))
    if (isRaw) {
      const newPath = path.join(rawDir, itemName)

      if (await fs.pathExists(newPath)) {
        console.info(`EXISTED: ${newPath}`)
      } else {
        await fs.ensureDir(rawDir)
        await fs.move(itemPath, newPath)
        console.info(`MOVE: ${itemPath} to ${newPath}`)
        process.exit(0)
        totalCount += 1
      }
    }
  }
}

moveRaws(TARGET).then(() => {
  console.info(`Total moved: ${totalCount}`)
})
