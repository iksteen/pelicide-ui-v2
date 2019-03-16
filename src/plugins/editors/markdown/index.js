import Editor from './editor'

function template (data) {
  return `Title: ${data.title}
Date: ${(new Date()).toISOString()}
Status: ${data.status}` + (data.author ? `
Author: ${data.author}` : '') + `
Tags:` + (data.category ? `
Category: ${data.category}` : '') + `
Slug: ${data.slug}

`
}

export default {
  install (vue) {
    vue.prototype.$pelicide.registerEditor(
      [
        'text/markdown',
        'text/x-markdown',
        'text/x-rmarkdown'
      ],
      'mdi-markdown',
      Editor
    )
    vue.prototype.$pelicide.registerTemplate(
      {
        id: 'md-article',
        name: 'Markdown article',
        type: 'article',
        extensions: ['md', 'markdown', 'mkd', 'mdown', 'rmd'],
        anchor: 'content',
        template
      }
    )
    vue.prototype.$pelicide.registerTemplate(
      {
        id: 'md-page',
        name: 'Markdown page',
        type: 'page',
        extensions: ['md', 'markdown', 'mkd', 'mdown', 'rmd'],
        anchor: 'content',
        template
      }
    )
  }
}
