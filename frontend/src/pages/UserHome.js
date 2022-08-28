import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Post from "../components/Post";
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import PostForm from "../components/PostForm";
import ImageSlideShow from "../components/ImageSlideShow";
import { getPostsByUser, reset, deletePost } from '../features/posts/postSlice';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserHome = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [postId, setPostId] = useState('');
  const [toggleDisplay, setToggleDisplay] = useState(false);
  const [toggleSlideShow, setToggleSlideShow] = useState(true);

  const { user } = useSelector((state) => state.auth)
    
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.posts
  )
  // console.log(posts);
  
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (!user) {
      navigate('/login')
    } 

    dispatch(getPostsByUser())
  
    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  const togglePostForm = () => {
    setToggleDisplay(!toggleDisplay);
    if (toggleDisplay) {
      setPostId(null);
    }
  };

  const updateForm = (postId) => {
    setToggleDisplay(true);
    setPostId(postId);
   };

  const returnAddForm = () => {
    // Reset postId value 
    setPostId('');
  };

  // Delete post function
  const delPost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(postId))
    };
  };

  return (
    <Container fluid>
      {/* Rendering button showing/hiding slide show */}
      <div className={toggleDisplay? "hide" : "right__side mt-2"}>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={()=> setToggleSlideShow(!toggleSlideShow)}
        >
          {toggleSlideShow? "Hide Slide Show" : "Show Slide Show"}
        </Button>
      </div>
      <Row>
        {/* Post Form area */}
        <Col className={toggleDisplay ? 'show' : 'hide'}>
          {/* PostForm Component */}
          {/* <PostForm postId={postId} returnAddForm = {returnAddForm} /> */}
          <PostForm postId={postId} togglePostForm = {togglePostForm} returnAddForm = {returnAddForm}/>
        </Col>
        {/* User's Post-List area */}
        <Col>
          <h3 className='title'>My Post-List</h3>
          {!toggleDisplay?
            <Button variant="outline-primary" onClick={()=> togglePostForm()}>
              Add New Post
            </Button> : ''}
          {posts.length > 0 ? (
            <>
              {posts.map((post, idx) => 
                <div key={idx} className='pb-2 mb-2 mt-2 bottom__line'>
                  <Post post={post} showUsername={false} fromFavoritePostPage={false} />
                  {/* Update Button */}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => updateForm(post._id)}
                  >
                    Update
                  </Button >{' '}
                  {/* Delete button */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => delPost(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </>
            ) : ('')
          }

        </Col>
        {/* Post Form */}
        <Col className={!toggleDisplay && toggleSlideShow ? 'show' : 'hide'}>
          <h3 className='title'>My Posts Image Slide Show</h3>
          {posts.length > 0 ? (<ImageSlideShow posts={posts} />):('')}
        </Col>
      </Row>
    </Container>
  )
}

export default UserHome
