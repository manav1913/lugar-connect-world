
import { useParams } from 'react-router'
import CommunityDisplay from '../components/CommunityDisplay'

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <CommunityDisplay communityId={Number(id)} />
    </div>
  )
}

export default CommunityPage