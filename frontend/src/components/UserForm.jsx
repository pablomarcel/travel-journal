import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { Button, Container } from 'react-bootstrap';

function UserForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    oldPassword: '',
  })
  const [image, setImage] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [toggleChangePassword, setToggleChangePassword] = useState(false)

  const { firstName, lastName, email, password, password2, oldPassword } = formData

  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      return
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
    axios
      .get('/api/users/me', config)
      .then(res => {
        setImage(res.data.image)
        setFormData({
          ...formData,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          })
        })
      .catch(err => toast.error(err))

  }, [])

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

  const onSubmit = (e) => {
    e.preventDefault()
    if (oldPassword || password || password2) {
      if (password !== password2) {
        toast.error('Passwords do not match')
      }
    } 
    const userData = {
      firstName,
      lastName,
      email,
      oldPassword,
      password,
      image
    };
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    // Update user to db
    axios
      .put(`/api/users/${user._id}`, userData, config)
      .then(res => {
        // Store the user info in local storage
        localStorage.setItem('user', JSON.stringify(res.data));
        // Show success message
        toast.success('User profile is updated successfully.');
        // Return profile page
        navigate(`/profile/${user._id}`);
      })
      .catch(err => {
        if(err.response) {
          if (err.response.status===400) {
            toast.error('Email already exists.');
          };
          if (err.response.status===401) {
            toast.error('Old password is incorrect!');
          }
        }
      })
  }

  return (
    <Container style={{ width: "400px" }}>
      <section className='heading'>
        <h3>
          <FaUser /> Update Profile
        </h3>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='file'
              className='form-control'
              id='image'
              name='image'
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image?
              <img src={imagePath} alt = 'author' className='author-image' />
              : null}
          </div>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='firstName'
              name='firstName'
              value={firstName}
              placeholder='First name'
              onChange={onChange}
            />
            <input
              type='text'
              className='form-control'
              id='lastName'
              name='lastName'
              value={lastName}
              placeholder='Last name'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setToggleChangePassword(!toggleChangePassword)}
            >
              {toggleChangePassword? 'Disable Change Password': 'Change Password'}
            </Button>
          </div>
          {toggleChangePassword? (
            <>
              <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  id='oldPassword'
                  name='oldPassword'
                  value={oldPassword}
                  placeholder='Enter old password'
                  onChange={onChange}
                />
              </div>
              <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  id='password'
                  name='password'
                  value={password}
                  placeholder='Enter new password'
                  onChange={onChange}
                />
              </div>
              <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  id='password2'
                  name='password2'
                  value={password2}
                  placeholder='Confirm new password'
                  onChange={onChange}
                />
              </div>
            </>
          ) : null}

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </Container>
  )
}

export default UserForm
