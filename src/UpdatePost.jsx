import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import api from './api/Posts';

const UpdatePost = ({ posts, setPosts }) => {
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const navigate = useNavigate();

  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);

  function resetEditForm(setEditTitle, setEditBody) {
    setEditTitle('');
    setEditBody('');
  }

  // Update
  const handleEdit = async (e, id) => {
    e.preventDefault();
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');

    const updatedPost = { id, title: editTitle, datetime, body: editBody };

    try {
      const response = await api.put(`/posts/${id}`, updatedPost);

      const allPosts = posts.map((post) =>
        post.id === id ? { ...response.data } : post
      );
      setPosts(allPosts);
      navigate('/');
      resetEditForm(setEditTitle, setEditBody);
    } catch (error) {
      console.error(`Error: ${error.message} `);
    }
  };

  useEffect(() => {
    // const post = posts.find((post) => post.id.toString() === id);
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, []);

  return (
    <main className='NewPost'>
      <h2>Edit Post</h2>

      <form
        action=''
        className='newPostForm'
        onSubmit={(e) => {
          handleEdit(e, post.id);
        }}
      >
        <label htmlFor='postTitle'>Title: </label>

        <input
          type='text'
          name='postTitle'
          id='postTitle'
          required
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />

        <label htmlFor='postBody'>Post: </label>

        <input
          type='text'
          name='postBody'
          id='postBody'
          required
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    </main>
  );
};

export default UpdatePost;
