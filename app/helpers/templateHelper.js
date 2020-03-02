import jade from 'jade'
import filesystem from 'fs'
import log from '../common/logger'
import path from 'path'
import Promise from 'bluebird'

const fs = Promise.promisifyAll(filesystem)

export default {

  renderTemplateToString(relativePath, data) {

    const templatePath = path.join(__dirname, `../views/${relativePath}.jade`)
    log.debug({ templatePath }, 'TemplatePath')

    return fs.readFileAsync(templatePath, 'utf8')
      .then(templateContent => {

        log.info('Template loaded.')
        const renderFunc = jade.compile(templateContent)
        const html = renderFunc(data)

        log.info('Template rendered.')
        return html
      })
      .catch(err => {
        log.error(err, 'Cannot render email template.')
        throw err
      })

  }

}

