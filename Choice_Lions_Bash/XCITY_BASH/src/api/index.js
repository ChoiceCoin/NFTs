const url = "http://localhost:5000/posts";

export const fetchPosts = () => fetch.get(url);
export const createPost = (newPost) => fetch.post(url, newPost);
export const deletePost = (id) => fetch.delete(`${url}/${id}`);
