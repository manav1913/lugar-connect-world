import PostList from '../components/PostList'
import './Home.css'

const Home = () => {
  return (
    <section className="home">
      <div className="home-header">
        <h2>Recent Posts</h2>
      </div>

      <div className="home-posts">
        <PostList />
      </div>
    </section>
  )
}

export default Home