import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deletePost } from "../../actions/post";
import { likePost } from "../../actions/post";
import { unLikePost } from "../../actions/post";
import "./Posts.css";

const PostItem = (props) => {
  const [liked, setLiked] = useState(null);
  const [likes, setLikes] = useState(null);

  React.useEffect(() => {
    if (
      props.auth.user._id &&
      props.post.likes.filter((like) => like.user === props.auth.user._id)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    const number = props.post.likes.length
    setLikes(number)
  }, []);

  const onDelete = () => {
    props.deletePost(props.post._id);
    window.location.reload(false);
  };

  const onLike = () => {
    if (!liked) {
      props.likePost(props.post._id);
      setLiked(true);
      setLikes(likes + 1);
    } else {
      props.unLikePost(props.post._id);
      setLiked(false);
      setLikes(likes - 1);
    }
    console.log(likes);
  };
  return (
    <div className="card">
      <Link to={`/posts/${props.post._id}`}>
        <img
          src={props.post.url}
          style={{ border: `2px solid #161b21`}}
          className="card-img-top"
        ></img>
      </Link>
      <div className="card-body">
        <h5 className="card-title">{props.post.name}</h5>
        <button className="btn btn-light" onClick={onLike}>
          <i className="far fa-heart"></i> {likes}
        </button>

        <div className="dropdown">
          <span className="btn btn-dark">
            Options <i className="fas fa-chevron-circle-down"></i>
          </span>
          <div className="dropdown-content">
            {!props.auth.loading && props.post.user === props.auth.user._id && (
              <button className="btn btn-danger option" onClick={onDelete}>
                <i className="fas fa-trash-alt"></i>
                <br />
                Delete
              </button>
            )}
            <a
              href={props.post.url}
              download
              className="btn btn-success option"
            >
              <i className="fas fa-file-download"></i>
              <br />
              Download
            </a>
            <Link to={`/posts/${props.post._id}`}>
              <button className="btn btn-primary option">
                <i className="fas fa-eye"></i> <br />
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unLikePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { likePost, unLikePost, deletePost })(
  PostItem
);
