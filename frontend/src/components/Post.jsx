import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Post = ({ post, fromFavoritePostPage }) => {
  // Get the post author name
  // const author = `${post.user[0].firstName} ${post.user[0].lastName}`;
  const postId = fromFavoritePostPage ? post.post[0]._id : post._id;
  const title = fromFavoritePostPage ? post.post[0].title : post.title;
  const image = fromFavoritePostPage ? post.post[0].image : post.image;
  return (
    <Card className='mb-2'>
      <Link to={`/postDetail/${postId}`}>
        {image ? <Card.Img src = {image} alt={title} className="w-100" /> : ''}
      </Link>

      <Card.Body>
        <Link to={`/postDetail/${postId}`}>
          <Card.Title>{title}</Card.Title>
        </Link>
        <Card.Text>
          {post.updatedAt ? `Last modified: ${post.updatedAt}`: ''} 
          {/* {showUsername? ` - Author: ${author}` : ''} */}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
// Define proptypes for post, showUsername, fromFavoritePostPage
Post.propTypes = {
  post: PropTypes.object.isRequired,
  // showUsername: PropTypes.bool.isRequired,
  fromFavoritePostPage: PropTypes.bool.isRequired,
}

export default Post
