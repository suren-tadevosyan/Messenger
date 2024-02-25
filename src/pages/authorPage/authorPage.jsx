import { useDispatch, useSelector } from "react-redux";
import "./authorPage.css";
import userPhoto1 from "../../images/userMale.png";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { updatePhoto } from "../../redux/slices/auth";

const AuthorPage = () => {
  const dispatch = useDispatch();

  const { name, photo, id } = useSelector((state) => state.user);

  const [userPhoto, setUserPhoto] = useState(
    photo.photo ? photo.photo : userPhoto1
  );

  const handleUpdatePhoto = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];

      if (file) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `user_photos/${id}/user-photo.jpg`);
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);

          setUserPhoto(downloadURL);

          dispatch(updatePhoto(downloadURL));
        } catch (error) {
          console.error("Error updating photo in Firebase:", error.message);
        }
      }
    };

    input.click();
  };

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `user_photos/${id}/user-photo.jpg`);
        const downloadURL = await getDownloadURL(storageRef);
        setUserPhoto(downloadURL);
      } catch (error) {
        console.error(
          "Error fetching author's image from Firebase storage:",
          error
        );
        setUserPhoto(userPhoto);
      }
    };

    fetchAuthorImage();
  }, [userPhoto, id]);

  return (
    <div className="auhtorContainer">
      <div className="user-photo-container">
        <div className="user-photo">
          <img src={userPhoto} alt="User" className="profile-photo" />
          <button onClick={handleUpdatePhoto} className="updatePhoto">
            Update Photo
          </button>
        </div>

        <p>{name}</p>
      </div>
    </div>
  );
};

export default AuthorPage;
