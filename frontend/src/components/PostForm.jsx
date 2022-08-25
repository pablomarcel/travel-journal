import { useEffect, useState } from 'react';
import axios from 'axios';
import { createPost, updatePost } from '../features/posts/postSlice';
import { Card, Container, Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

function PostForm({ postId, returnAddForm }) {
  // const navigate = useNavigate()
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    country: '',
    content: '',
    airBnBPrice: 0,
    hotelPrice: 0,
    couplePrice: 0,
    familyPrice: 0,
  });

  const [image, setImage] = useState('');
  // const [imagePath, setImagePath] = useState('')
  // const imageInputRef = useRef();

  const {title, city, country, content, airBnBPrice, hotelPrice, couplePrice, familyPrice} = formData;

  useEffect(() => {
    if (!postId) {
      setFormData({
        ...formData,
        title: '',
        city: '',
        country: '',
        content: '',
        airBnBPrice: '',
        hotelPrice: '',
        couplePrice: '',
        familyPrice: '',
      })      
      return
    }
    axios
      .get(`/api/posts/post/${postId}`)
      .then(res => 
        setFormData({
          ...formData,
          title: res.data.title,
          city: res.data.city,
          country: res.data.country,
          content: res.data.content,
          airBnBPrice: res.data.airBnBPrice,
          hotelPrice: res.data.hotelPrice,
          couplePrice: res.data.couplePrice,
          familyPrice: res.data.familyPrice,
        })
      .then(res => setImage(res.data.image))
      )
      .catch(err => {
        toast.error(err)
      });
  }, [postId])


  // useEffect(() => {
  //   if (!image || image.length < 1) return;
  //     // setImagePath(URL.createObjectURL(image))    
  // }, [image]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postId) {
      if (!title || !content) {
        toast.error('Title and content are required');
      } else {
        const postData = {
          title,
          city,
          country,
          content,
          airBnBPrice,
          hotelPrice,
          couplePrice,
          familyPrice,
          image
        }
        dispatch(createPost(postData))
      }
    } else {
      // Update post
      const postData = {
        postId,
        title,
        city,
        country,
        content,
        airBnBPrice,
        hotelPrice,
        couplePrice,
        familyPrice,
        image
      }
      // update database
      dispatch(updatePost(postData))
      // Return AddPost Form
      returnAddForm();
    }
  };


  return (
    <Container>
      <div className="pb-2 box">
        <h3 className="mb-2 title">{postId ? "Update Post" : "New Post"}</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id='title'
              name='title'
              value={title}
              placeholder="Title"
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id='city'
              name='city'
              value={city}
              placeholder="City"
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id='country'
              name='country'
              value={country}
              placeholder="Country"
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              id='content'
              name='content'
              value={content}
              placeholder="Content"
              rows={10}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              id='airBnBPrice'
              name='airBnBPrice'
              value={airBnBPrice}
              placeholder="AirBnB Price for 1 night"
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              id='hotelPrice'
              name='hotelPrice'
              value={hotelPrice}
              placeholder="Hotel price for 1 night"
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              id='couplePrice'
              name='couplePrice'
              value={couplePrice}
              placeholder="Round trip price for a couple"
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              id='familyPrice'
              name='familyPrice'
              value={familyPrice}
              placeholder="Round trip price for a family"
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          {image? (
            <Form.Group controlId="formCard" className="mb-3">
              <Card>
                <Card.Img variant="top" src={`/${image}`} />
              </Card>
            </Form.Group>
            ) : null}
 
          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              {postId ? "Update Post" : "Add Post"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  )
}

// Define props types for postId, returnAddForm
PostForm.propTypes = {
  postId: PropTypes.string,
  returnAddForm: PropTypes.func.isRequired
}


export default PostForm
