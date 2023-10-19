// `directory` - to the FS for offline storage
// `url` - to the requested playlist
// `onlyAudio` - download as .mp3 files

const ROOT_DIR_1 = '/Users/garand/useSynced/useMusics'
const ROOT_DIR_2 = '/Volumes/SSD/useClouded/useMusics'

module.exports = [
  {
    // onlyAudio: true,
    directory: `${ROOT_DIR_1}/useLords`,
    url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S',
  },
  // {
  //   directory: `${ROOT_DIR_1}/useThemes`,
  //   url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2ZjgNYYE_-uxToaHGrRGRHY',
  // },
  // {
  //   directory: `${ROOT_DIR_2}/Damn`,
  //   url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2bnlFH7VNeMh_ZUTQtRz3Me',
  // },
]
