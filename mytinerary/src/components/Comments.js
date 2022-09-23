import { useAuth } from "../hooks/useAuth";
import { useState, useRef } from "react";
import {
    useDeleteCommentMutation,
    useModifyCommentMutation,
} from "../features/commentsAPI";
import { toast } from "react-toastify";

import "../styles/Comments.css";

export default function Comments({ comment, refetchComments }) {
    const { user: currentUser } = useAuth();
    const newInput = useRef("");
    console.log(comment);
    const [deleteComment] = useDeleteCommentMutation();
    const [newComment] = useModifyCommentMutation();

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        open ? setOpen(false) : setOpen(true);
        // setOpen(!open); // toggle
    };

    const toastSuccess = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }

    const toastFailure = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const newComments = {
            id: comment._id,
            comment: newInput.current.value,
            user: comment.user,
            itinerary: comment.itinerary,
        };
        try {
            const response = await newComment(newComments).unwrap();
            console.log(response);
            if (response.success) {
                setOpen(false);
                refetchComments();
                toastSuccess(response.message);
            } else {
                toastFailure(response.data?.message);
            }
        } catch (error) {
            toastFailure(error.data?.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await deleteComment(comment._id).unwrap();
            if (response?.success) {
                refetchComments();
            } else {
                toastFailure(response.data?.message);
            }
        } catch (error) {
            toastFailure(error.data?.message);
        }
    };

    return (
        <div className="container-main-comment">
            <div className="img-user">
                <img src={comment.user.photo} alt=""></img>
            </div>
            <div className="container4-comments">
                <div className="mail">
                    <h4>
                        {comment.user.lastName} {comment.user.name}
                    </h4>
                </div>
                <div className="comment">
                    <p>{comment.comment}</p>
                </div>
            </div>
            {currentUser?.id === comment.user._id && (
                <div>
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={handleClick}>Modify</button>
                    {open ? (
                        <form>
                            <input
                                type="text"
                                name="comment"
                                defaultValue={comment.comment}
                                ref={newInput}
                            />
                            <button onClick={handleUpdate}>Update now!</button>
                        </form>
                    ) : null}
                </div>
            )}
        </div>
    );
}
