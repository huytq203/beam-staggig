import { Button } from '@douyinfe/semi-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactCountryFlag from 'react-country-flag'

export const LocaleSwitcher = () => {
  const router = useRouter()
  const { locales, locale: activeLocale } = router
  const otherLocales = locales?.filter((locale) => locale !== activeLocale)

  const flags: any = {
    vi: {
      flag: 'VN',
      name: 'vi',
    },
    en: {
      flag: 'US',
      name: 'en',
    },
  }

  return (
    <>
      {otherLocales?.map((locale) => {
        const { pathname, query, asPath } = router
        return (
          <Link href={{ pathname, query }} as={asPath} locale={locale} legacyBehavior>
            <Button key={locale}>
              <a>
                {<ReactCountryFlag countryCode={flags[locale].flag} />}{' '}
                {flags[locale].name}
              </a>
            </Button>
          </Link>
        )
      })}
    </>
  )
}
