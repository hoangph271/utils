const path = require('path')
const fs = require('fs-extra')
const { sizeFormatter } = require('human-readable')

require('dotenv').config()

const { TARGET, RAW_EXTS = '.CR2' } = process.env

let rawsSize = 0
let notRawsSize = 0

async function countSizes (rootPath) {
  const children = await fs.readdir(rootPath)

  for (const itemName of children) {
    const itemPath = path.join(rootPath, itemName)
    const stats = await fs.stat(itemPath)

    if (stats.isDirectory()) {
      await countSizes(itemPath)
      continue
    }

    const isRaw = RAW_EXTS.split(',').includes(path.extname(itemName))
    if (isRaw) {
      rawsSize += stats.size
    } else {
      notRawsSize += stats.size
    }
  }
}

countSizes(TARGET).then(() => {
  const formatter = sizeFormatter()
  const rawsPercentage = rawsSize / (rawsSize + notRawsSize) * 100

  console.info(`RAWs size: ${formatter(rawsSize)}`)
  console.info(`NOT RAWs size: ${formatter(notRawsSize)}`)
  console.info(`RAWs percentage: ${rawsPercentage.toFixed(2)}%`)
})
