import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CreatePostPage from './pages/CreatePostPage'
import PostPage from './pages/PostPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CreateCommunity from './components/CreateCommunity'
import CommunitiesPage from './pages/CommunitiesPage'
import CommunityPage from './pages/CommunityPage'
const App = () => {
  return (
    <div>
      <Navbar/>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/create' element={<CreatePostPage/>}/>
          <Route path='/post/:id' element={<PostPage/>}/>
          <Route path='/community/create' element={<CreateCommunityPage/>}/>
          <Route path='/communities' element={<CommunitiesPage/>}/>
          <Route path='/communities/:id' element={<CommunityPage/>}/>

        </Routes>
      </div>
    </div>
  )
}

export default App
