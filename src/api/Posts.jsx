import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3500'
});

// const Posts = () => {
//   return (
//     <div>Posts</div>
//   )
// }

// export default Posts
