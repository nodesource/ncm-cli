'use strict'

const chalk = require('chalk')
const L = console.log

module.exports = log

const definedStyles = {
  ncm: chalk.bold,

  main: chalk,
  title: chalk.bold,

  table: chalk.green.bold,

  error: chalk.bgRed.white,
  success: chalk.green.bold
}

const supportedTags = [
  // Chalk supported colors
  'black', 'red', 'green', 'yellow', 'blue',
  'magenta', 'cyan', 'white', 'gray', 'redBright',
  'greenBright', 'yellowBright', 'blueBright',
  'magentaBright', 'cyanBright', 'whiteBright',

  // Chalk supported modifiers
  'reset', 'bold', 'dim', 'italic', 'underline',
  'inverse', 'hidden', 'strikethrough', 'visible',

  // Chalk supported background colors
  'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue',
  'bgMagenta', 'bgCyan', 'bgWhite', 'bgBlackBright', 'bgRedBright',
  'bgGreenBright', 'bgYellowBright', 'bgBlueBright', 'bgMagentaBright',
  'bgCyanBright', 'bgWhiteBright'
]

function log (content) {
  if (!content) {
    L()
    return
  }

  let line = ''

  content.forEach(segment => {
    let { text, style } = segment

    if (definedStyles[style]) {
      line += definedStyles[style](text)
    }

    if (supportedTags.includes(...style)) {
      let template = chalkTemplateLiteral(text, style)
      line += chalk`{${template}}`
    }

    if (style.length === 0) {
      line += text
    }
  })

  L(line)
}

const chalkTemplateLiteral = (text, style) => {
  let validStyles = []

  style.forEach(tag => {
    if (supportedTags.includes(tag)) validStyles.push(tag)
  })

  return `${validStyles.join('.')} ${text}`
}
