import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userPFP from '../../img/profile/userProfile/empty_user.svg';
import styles from '../../css/Header/LoginSuccess_header_noneBackground.module.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useUserStore } from "../../stores/index.ts";
import reel_review_logo from '../../img/users/Reel_Review_logo_white.png';
import SignOutAlert from "../users/SignOutAlert";

export default function LoginSuccess_header_noneBackground({ profileData, userData }) {
  const userCd = userData ? userData.userCd : null;

  const [movieList, setMovieList] = useState([]);
  const [name, setName] = useState('');

  // 로그인 JWT 토큰
  const [cookies, setCookies] = useCookies();
  const { user, removeUser } = useUserStore();
  
  // 로그아웃 확인 알림창
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  // 로그아웃 로직
  const signOutHandler = () => {
    setCookies('token', '', { expires: new Date() });
    removeUser();
    window.location.href = 'http://localhost:3000';
  }

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);

    axios.post("http://localhost:8085/api/movieSearch", formData)
      .then((response) => {

        setMovieList(response.data);
        navigate('/searchSuccess', { state: { movieList: response.data, searchedName: name } });
      })
      .catch((error) => {
        console.error(error);
      });
  };



  return (
    <nav className={styles.topNav}>
      <div className={styles.navWrapper}>
        <ul className={styles.leftNav}>
          <Link to="/">
            <img src={reel_review_logo} className={styles.logoSection} />
          </Link>
        </ul>
        <ul className={styles.rightNav}>
          <li className={styles.findMovies}>
            <div className={styles.findWrapper}>
              <form onSubmit={handleSubmit}>
                <input className={styles.findWrapper_input} type="text" name="title" onChange={handleChange} placeholder="영화를 검색해보세요" autoComplete="off" />
                <button type="submit"></button>
              </form>
            </div>
          </li>
          <li className={styles.nameLi} onClick={() => {setShowSignOutAlert(true)}}> 로그아웃 </li>
          {showSignOutAlert && <SignOutAlert setShowSignOutAlert={setShowSignOutAlert} signOutHandler={signOutHandler} SignOutHeader={'SignOutHeader'}/>}
          <Link to="/csMain" className={styles.csMainPage} style={{ textDecoration: 'none' }}>
            <li className={styles.nameLi}> 문의하기 </li>
          </Link>
          <Link to={{ pathname: '/userProfiles' }} className={styles.userProfile_box}>
            <li>
              {profileData && profileData.pfImage !== 'defaultPfImage' ? (
                <img alt="profile" src={`http://localhost:8085/userProfiles/getProfilePicture?userCd=${userCd}`} className={styles.icon} />
              ) : (
                <img alt="profile" src={userPFP} className={styles.icon} />
              )}
            </li>
          </Link>
        </ul>
      </div>
    </nav >
  );
}