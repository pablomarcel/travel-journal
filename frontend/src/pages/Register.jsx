import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { Container } from 'react-bootstrap'
// import Image from 'react-bootstrap/Image'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  })

  const [image, setImage] = useState('')
  const [imagePath, setImagePath] = useState('')

  const { firstName, lastName, email, password, password2 } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  useEffect(() => {
    if (!image || image.length < 1) return;
    setImagePath(URL.createObjectURL(image));
  }, [image]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        image
      }

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Container style={{ width: "400px" }}>
      <section className='heading'>
        <h3>
          <FaUser /> Register
        </h3>
        <h4>Please create an account</h4>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
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
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
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
              placeholder='Confirm password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='file'
              className='form-control'
              id='image'
              name='image'
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
            />
            {imagePath?
              <img src={imagePath} alt = '' className='author-image' />
              : null
            }
          </div>
 
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

export default Register
