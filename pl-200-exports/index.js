const csvtojsonV2 = require('csvtojson/v2')
const fs = require('fs')

csvtojsonV2()
  .fromFile('./PL-200 Oct-2022.csv')
  .then(items => {
    const csvItems = items
      .map(item => {
        return {
          id: item['#'],
          term: `${item.Question}\n${item.Answer || item.field4}`,
          def: item['R1'],
        }
      })

    const csvContent = csvItems
      .map(item => {
        return `${item.term}\n|\n${item.def}`
      })
      .join('\n\n')

    fs.writeFileSync('output.quizlet', csvContent)
  })
