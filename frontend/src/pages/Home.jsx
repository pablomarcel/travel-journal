import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import ImageSlideShow from '../components/ImageSlideShow';
import Post from '../components/Post';
import ReactPaginate from 'react-paginate';
import '../components/Pagination.css';
// import PropTypes from 'prop-types';
import { FcPrevious, FcNext } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, reset } from '../features/posts/postSlice'
import { toast } from 'react-toastify';

const Home = () => {
  const [toggleSlideShow, setToggleSlideShow] = useState(true);
  // Define some vars for pagination function
  const [pageNumber, setPageNumber] = useState(0);

  const dispatch = useDispatch()

  const { posts, isLoading, isError, message } = useSelector((state) => state.posts)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(getAllPosts())

    return () => {
      dispatch(reset())
    }
  }, [isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  // Set the number of items for each page
  const postsPerPage = 2;
  const pagesVisited = pageNumber * postsPerPage;
  // This function is used to display the set of items on the home page 
  const displayPosts = posts
    .slice(pagesVisited, pagesVisited + postsPerPage)
    .map((post, idx) => {
      return (
        <Post key={idx} post={post} showUsername={true} fromFavoritePostPage={false} />
      );
    });

  const pageCount = Math.ceil(posts.length / postsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <Container fluid>
      {/* Rendering button showing/hiding slide show */}
      <div className="right__side mt-2">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={()=> setToggleSlideShow(!toggleSlideShow)}
        >
          {toggleSlideShow? "Hide Slide Show" : "Show Slide Show"}
        </Button>
      </div>
      <Row>
        {/* Post-List area */}
        <Col>
          <h3 className='title mb-2'>Post-List</h3>
          {posts.length > 0 ? (
            <>
              {displayPosts}
              {/* {posts.map((post) => <Post key={post.id} post={post} showUsername={true} fromFavoritePostPage={false} />)} */}
            </>
            ) : ('')
          }
          {/* Rendering the pagination buttons */}
          <Row className='pt-2'>
            <ReactPaginate
              previousLabel={<FcPrevious />}
              nextLabel={<FcNext />}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </Row>
        </Col>
        {/* Image Slide Show area */}
        <Col className={toggleSlideShow? "show":"hide"}>
          <h3 className='title mb-2'>Unforgettable Places Slide Show</h3>
          {posts.length > 0 ? (<ImageSlideShow posts={posts} />):('')}
        </Col>
      </Row>
    </Container>
  );
}

// Home.propTypes = {
//   posts: PropTypes.arrayOf(PropTypes.object).isRequired
// }

export default Home