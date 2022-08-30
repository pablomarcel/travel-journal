import axios from 'axios';
import PropTypes from 'prop-types';
import CommentDetail from './CommentDetail';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';

const CommentList = ({ comments, refreshCommentData }) => {
  const { user } = useSelector((state) => state.auth);
  const deleteComment = async(id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      // Delete the selected comment from comments data
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .delete(`/api/comments/${id}`, config)
        .then(res => {
          // Refresh the comment list after deleting this comment successful
          refreshCommentData();
          return res.data
        })
        .catch(err => toast.error(err));
    }
  };

  return (
    <>
      {comments.map((comment) => 
        <div key = {comment._id} className='comment'>
          {user && user._id === comment.author._id ? (
            <button onClick={() => deleteComment(comment._id)} className= 'close'>
              <FiX />
            </button>)
          : ''}
          {/* Comment list component */}
          <CommentDetail comment={comment} />
        </div>
      )}
    </>
  )
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshCommentData: PropTypes.func.isRequired,
}

export default CommentList
