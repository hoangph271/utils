// `directory` - to the FS for offline storage
// `url` - to the requested playlist
// `onlyAudio` - download as .mp3 files

const ROOT_DIR = '/Users/garand/useSynced/useMusics'

module.exports = [
  {
    directory: `${ROOT_DIR}/useLords`,
    url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S',
  },
  {
    directory: `${ROOT_DIR}/useThemes`,
    url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2ZjgNYYE_-uxToaHGrRGRHY',
  },
  {
    directory: `${ROOT_DIR}/Damn`,
    url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2bnlFH7VNeMh_ZUTQtRz3Me',
  },
]
