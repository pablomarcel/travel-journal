import { useEffect, useState } from "react";
import axios from 'axios';
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import formatDistance from 'date-fns/formatDistance';
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import default_image from '../logo/default_user.jpg';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState({});
  const [toggleForm, setToggleForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!id) { return }
    axios
      .get(`/api/posts/post/${id}`)
      .then(res => setPost(res.data[0]))
      .catch(err => {
        toast.error(err)
      });

    axios
      .get(`/api/comments/post/${id}`)
      .then(res => {
        setComments(res.data)
      })
      .catch(err => toast.error(err));
  }, [id]);

  const toggleCommentForm = () => {
    setToggleForm(!toggleForm);
  };

  const refreshCommentData = async() => {
    await axios
      .get(`/api/comments/post/${id}`)
      .then(res => {
        setComments(res.data)
      })
      .catch(err => toast.error(err));
  }

  const addMyFavoritePost = async () => {
    if (!id || !user) {
      toast.error('Post Id and user id are required');
    } else {
      const data = {id};
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .post('/api/favoriteposts/', data, config)
        .then(res => {
          toast.success('The task has been done. Please visit your favorire posts page.');
          return res.data
        })
        .catch(err => 
          {
            if(err.response && err.response.status===400) {
              toast.error('The post already exists in your favorite post collection.');
            };
          });
    }
  };

  // Get author image
  const authorImage = post.author && post.author.image ? post.author.image : default_image;

  return (
    <Container fluid>
      <div className='title bottom__line'>{post.title}</div>
      <Row>
        <Col>
          <Card className='mb-2'>
            {post.image ? <Card.Img src = {post.image} alt={post.title} /> : ''}
            <Card.Body>
              <Card.Text>
                <img src={authorImage} alt = '' className='author-small-image' />
                {post.author ? ` ${post.author.firstName} ${post.author.lastName}`:''}
                {post.updatedAt? ` - Last modified: ${formatDistance(new Date(post.updatedAt), new Date())}`:''}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card.Text>
            Location: {post.city} - {post.country}
          </Card.Text>
          <Card.Text>
            {post.content}
          </Card.Text>
          <Card.Text>
            Price for a night: * AirBnB: {post.airBnBPrice} - * Hotel Price: {post.hotelPrice}
          </Card.Text>
          <Card.Text>
            Price for a round trip: * Couple: {post.couplePrice} - * Family: {post.familyPrice}
          </Card.Text>
          {user && !toggleForm ?
            (<div className="mb-2">
              <Button variant="outline-primary" type="submit" onClick={()=> toggleCommentForm()}>
                Add New Comment
              </Button>

            </div>)
            : ''
          }
          <div className={toggleForm? 'show' : 'hide'}>
            <Card.Body>
              <CommentForm postId={id} user={user} toggleCommentForm={toggleCommentForm} refreshCommentData = {refreshCommentData} />
            </Card.Body>
          </div>

          <Card className='mb-2'>
            <Card.Body>
              {comments && comments.length > 0 ? <CommentList comments = {comments} refreshCommentData = {refreshCommentData} /> : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="outline-primary" type="submit" onClick={()=> navigate('/')}>
        Back to Home Page
      </Button>{"  "}
      {user ?
        <Button variant="outline-primary" type="submit" onClick={addMyFavoritePost}>
          Add to My Favorite Posts
        </Button>
        : ''
      }
    </Container>
  )
}

export default PostDetail
