import { useEffect } from 'react'

import { compact } from 'lodash-es'
import { useL10n } from 'provider/I18nProvider'

type MetaProps = {
  title?: string,
  description?: string,
  image?: string,
}

const Meta = ({ title: pageTitle, description: pageDescription, image: pageImage }: MetaProps) => {
  const l10n = useL10n()

  const title = compact([pageTitle, l10n('meta.title')]).join(' | ')
  const description = pageDescription || l10n('meta.description')

  useEffect(() => {
    document.title = title

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)

    let metaViewport = document.querySelector('meta[name="viewport"]')
    if (!metaViewport) {
      metaViewport = document.createElement('meta')
      metaViewport.setAttribute('name', 'viewport')
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1')
      document.head.appendChild(metaViewport)
    }

    let metaCharset = document.querySelector('meta[charset]')
    if (!metaCharset) {
      metaCharset = document.createElement('meta')
      metaCharset.setAttribute('charset', 'utf-8')
      document.head.appendChild(metaCharset)
    }
  }, [title, description])

  return null
}

export default Meta
