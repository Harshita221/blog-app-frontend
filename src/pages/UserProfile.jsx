import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../images/avatar15.jpg";
import { FaEdit, FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );
        const { name, email, avatar } = response.data; // Fixed typo here
        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };
    getUser();
  }, [currentUser.id, token]);

  const changeAvatarHandler = useCallback(async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setAvatar(response?.data.avatar);
    } catch (error) {
      setError("Failed to update avatar.");
      console.log(error);
    }
  }, [avatar, token]);

  const updateUserDetails = useCallback(async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submission

    // Validate new password and confirmation
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    const userData = new FormData();
    userData.set("name", name);
    userData.set("email", email);
    userData.set("currentPassword", currentPassword);
    userData.set("newPassword", newPassword);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        userData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // Log user out
        navigate("/logout");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update details.");
    }
  }, [name, email, currentPassword, newPassword, confirmNewPassword, token, navigate]);

  if (loading) {
    return <p>Loading...</p>; // Loading feedback
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My Posts
        </Link>

        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img
                src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                alt="User Avatar"
              />
            </div>

            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="image/png, image/jpg, image/jpeg"
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser.name}</h1>

          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <button type="submit" className="btn primary">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
