import MainProfile from '../MainProfile'
import TopProfile from './TopProfile'

const ContentProfile = () => {
  return (
    <div>
      <div>
        <TopProfile />
      </div>
      <div style={{ paddingTop: '160px', paddingBottom: '100px' }}>
        <MainProfile />
      </div>
    </div>
  )
}

export default ContentProfile
