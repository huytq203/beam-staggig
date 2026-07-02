import styles from './AppIcon.module.css'

export type IconTypes = IconName

export type IconName =
  | 'location'
  | 'search'
  | 'world'
  | 'yellow_star'
  | 'calendar'

export function AppIcon({
  name = 'location',
  size = 'sm',
  type = 'dark',
  title = '',
  className = '',
  color = '',
}: {
  name: IconName | undefined
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  type?: 'light' | 'dark' | 'blue' | 'red' | 'gray'
  title?: string
  className?: string
  color?: string
}) {
  var iconpath = `/icons/${name}.svg`

  // iconpath = config.basePath ? `${config.basePath}/${iconpath}` : iconpath

  let width: number
  switch (size) {
    case '3xl':
      width = 60
      break
    case '2xl':
      width = 50
      break
    case 'xl':
      width = 40
      break
    case 'lg':
      width = 30
      break
    case 'md':
      width = 24
      break
    case 'sm':
      width = 16
      break
    case 'xs':
      width = 14
      break
    default:
      width = 18
      break
  }
  return (
    <img
      src={iconpath}
      width={width}
      alt={name}
      className={styles[type] + ' ' + className}
    />
  )
}
