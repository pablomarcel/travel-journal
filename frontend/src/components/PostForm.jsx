import { useEffect, useState } from 'react';
import axios from 'axios';
import { createPost, updatePost } from '../features/posts/postSlice';
import { Card, Container, Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { FiX } from 'react-icons/fi';
function PostForm({ postId, togglePostForm, returnAddForm }) {
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
  const [imagePath, setImagePath] = useState('')

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
      setImage('');     
      return
    }
    axios
      .get(`/api/posts/post/${postId}`)
      .then(res => {
        setImage(res.data[0].image)
        setFormData({
          ...formData,
          title: res.data[0].title,
          city: res.data[0].city? res.data[0].city : '',
          country: res.data[0].country? res.data[0].country : '',
          content: res.data[0].content? res.data[0].content : '',
          airBnBPrice: res.data[0].airBnBPrice? res.data[0].airBnBPrice : '',
          hotelPrice: res.data[0].hotelPrice? res.data[0].hotelPrice : '',
          couplePrice: res.data[0].couplePrice? res.data[0].couplePrice : '',
          familyPrice: res.data[0].familyPrice? res.data[0].familyPrice : '',
        })
      })
      .catch(err => {
        toast.error(err)
      });
  }, [postId])


  useEffect(() => {
    if (!image || image.length < 1) return;
    image instanceof Object ? setImagePath(URL.createObjectURL(image)) : setImagePath(image)
  }, [image]);

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
        <div className='sub-header'>
          <div onClick={()=>togglePostForm()} className='form-icon'>
              <FiX />
          </div>
        </div>
        <h3 className="mb-2 title">{postId ? "Update Post" : "New Post"}</h3>

        <Form onSubmit={handleSubmit}>
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
                <Card.Img variant="top" src={imagePath} />
              </Card>
            </Form.Group>
          ) : null}
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
  togglePostForm: PropTypes.func.isRequired,
  returnAddForm: PropTypes.func.isRequired
}


export default PostForm
