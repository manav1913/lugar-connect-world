import CreatePost from '../components/CreatePost'
import "./CreatePostPage.css"

const CreatePostPage = () => {
    return (
        <div className="create-post-page">
            <div className="create-post-page-container">
                <div className="create-post-header">
                    <h2 className="create-post-page-title">Create a new post</h2>
                    <p className="create-post-page-subtitle">
                        Share an idea, a story, or something useful with your community.
                    </p>
                </div>

                <CreatePost />
            </div>
        </div>
    )
}

export default CreatePostPage