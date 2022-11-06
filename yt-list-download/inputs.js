// `directory` - to the FS for offline storage
// `url` - to the requested playlist
// `onlyAudio` - download as .mp3 files

module.exports = [
  {
    directory: '/Users/garand/useSynced/useMusics',
    url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2a0n2i_h6DPtOWn_v_KhL-S',
    onlyAudio: true,
    needsCleanup: false,
  },
  {
    directory: '/Users/garand/useSynced/useWatchlaters',
    url: 'https://www.youtube.com/playlist?list=PLpISLnShJQ2bhHnOjO9y4JlFBnnZc4eLJ',
    onlyAudio: false,
    needsCleanup: true,
  }
]
