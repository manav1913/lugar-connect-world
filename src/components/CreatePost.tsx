import React, { useState, type ChangeEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import "./CreatePost.css"

interface PostInput {
  title: string
  content: string
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile)

  if (uploadError) throw new Error(uploadError.message)

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath)

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl })

  if (error) throw new Error(error.message)
  return data
}

const CreatePost = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile)
    },
    onSuccess: () => {
      setTitle("")
      setContent("")
      setSelectedFile(null)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    mutate({ post: { title, content }, imageFile: selectedFile })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          id="title"
          placeholder="Enter a post title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id="content"
          rows={5}
          placeholder="Write your post content here"
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label>Upload Image</label>

        <label className="file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="file-btn">Choose Image</span>
        </label>

        {selectedFile && (
          <p className="file-name">{selectedFile.name}</p>
        )}
      </div>

      {error && <p className="form-error">{error.message}</p>}

      <button className="submit-btn" type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  )
}

export default CreatePost