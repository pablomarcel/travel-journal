import { useNavigate } from "react-router-dom"
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth)

  return (
    <Container style={{ width: "400px" }}>
      <div className="p-3 box">
        <h3 className="mb-3 text-center">My profile</h3>
          <div className="pb-2">
            Display name: {user.firstName} {user.lastName}
          </div>
          <div className="pb-3">
            Email: {user.email}
          </div>
          {user.image ? (
            <div className="pb-3">
              <img src={`/${user.image}`} alt = '' className='author-image' />
            </div>): null
          }
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              type="Submit"
              onClick={() => navigate('/userHome')}
            >
              Back to My Posts page
            </Button>
          </div>
        
      </div>
    </Container>
  )
}

export default Profile
