import React from 'react'
import CommunityDisplay from '../components/CommunityDisplay'
import { useParams } from 'react-router'

const CommunityPage = () => {
    const {id} = useParams<{id:string}>()
  return (
    <div>
      <CommunityDisplay communityId={Number(id)}/>
    </div>
  )
}

export default CommunityPage
