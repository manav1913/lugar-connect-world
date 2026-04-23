import CommunityList from '../components/CommunityList'
import './CommunitiesPage.css'

const CommunitiesPage = () => {
  return (
    <div className="communities-page">
      <div className="communities-page-container">
        <div className="communities-page-header">
          <h2>Communities</h2>
          <p>Explore and join communities created by users.</p>
        </div>

        <CommunityList />
      </div>
    </div>
  )
}

export default CommunitiesPage