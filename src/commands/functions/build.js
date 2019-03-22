const fs = require('fs')
const { flags } = require('@oclif/command')
const Command = require('@netlify/cli-utils')
const { zipFunctions } = require('@netlify/zip-it-and-ship-it')

class FunctionsBuildCommand extends Command {
  async run() {
    const { flags, args } = this.parse(FunctionsBuildCommand)
    const { config } = this.netlify

    const src = flags.src || config.build.functionsSource
    const dst = flags.functions || config.build.functions

    if (src === dst) {
      this.log("Source and destination for function build can't be the same")
      process.exit(1)
    }

    if (!src || !dst) {
      if (!src) this.log('You must specify a source folder with a --src flag or a functionsSource field in your config')
      if (!dst)
        this.log(
          'You must specify a destination functions folder with a --functions flag or a functions field in your config'
        )
      process.exit(1)
    }

    fs.mkdirSync(dst, { recursive: true })

    this.log('Building functions')
    zipFunctions(src, dst, { skipGo: true })
    this.log('Functions built to ', dst)
  }
}

FunctionsBuildCommand.description = `build functions locally
`

FunctionsBuildCommand.flags = {
  functions: flags.string({
    char: 'f',
    description: 'Specify a functions folder to build to'
  }),
  src: flags.string({
    char: 's',
    description: 'Specify the source folder for the functions'
  })
}

module.exports = FunctionsBuildCommand
