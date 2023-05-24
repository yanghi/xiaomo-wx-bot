
import path from 'path'
import fs from 'fs'
import { parse, stringify } from 'yaml'

const defaults = {
  name: '小墨'
}

let config = {}

function getConfig() {
  const configDir = process.cwd()
  
  const confPath = path.join(configDir, 'config.yaml')
  if(!fs.existsSync(confPath)) {
    console.error(`为找到配置文件: "${confPath}"`)
    process.exit(1)
  }

  const yamlConf = parse(fs.readFileSync(confPath, 'utf8').toString())

  Object.assign(config, yamlConf)

  if(!config.openai || !config.openai.API_KEY) {
    console.error(`未配置API_KEY: "${confPath}"`)
    process.exit(1)
  }
}

getConfig()

export default config