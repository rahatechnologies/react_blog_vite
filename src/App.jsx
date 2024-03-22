import Layout from './Layout';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// used for proper date formatting
import { format } from 'date-fns';

import UpdatePost from './UpdatePost';
import api from './api/Posts';

//  custom hook
import useWindowSize from './hooks/useWindowSize';

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const { width } = useWindowSize();

  const navigate = useNavigate();

  //  Read
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  //  create
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost);

      const allPosts = [...posts, response.data];

      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch (error) {
      console.error(`Error: ${err.message} `);
    }
  };

  //  Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsList = posts.filter((post) => post.id !== id);
      setPosts(postsList);

      // redirecting purpose
      navigate('/');
    } catch (error) {
      console.error(`Error: ${err.message} `);
    }
  };

  return (
    <Routes>
      <Route
        path='/'
        element={<Layout search={search} setSearch={setSearch} width={width} />}
      >
        <Route index element={<Home posts={searchResults} />} />
        <Route path='sample' element={<samplePage />} />
        <Route path='post'>
          <Route
            index
            element={
              <NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
              />
            }
          />

          <Route
            path=':id'
            element={<PostPage posts={posts} handleDelete={handleDelete} />}
          />
          <Route path='edit'>
            <Route
              path=':id'
              element={<UpdatePost posts={posts} setPosts={setPosts} />}
            />
          </Route>
        </Route>

        <Route path='about' element={<About />} />
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
