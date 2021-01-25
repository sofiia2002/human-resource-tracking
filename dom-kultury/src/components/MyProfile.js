import React, { useContext, useState, useEffect } from "react";
import { GeneralData } from "../Context";
import DeveloperProfile from "./DeveloperProfile";
import OrganizatorProfile from "./OrganizatorProfile";
import ParticipantProfile from "./ParticipantProfile";
import AdminProfile from "./AdminProfile";
import "../styles/MyProfile.css";

function MyProfile() {
  const { userData } = useContext(GeneralData);
  const [userType, setUserType] = useState('');

  useEffect(()=>{
    if (userData.stanowisko){
      setUserType(userData.stanowisko);
    }
  }, [userData]);

  const serveMyProfile = (usertype) => {
    switch (usertype) {
      case "Developer":
        return <DeveloperProfile />;

      case "Organizator":
        return <OrganizatorProfile />;

      case "Administrator":
        return <AdminProfile />;

      case "Uczestnik":
        return <ParticipantProfile />;

      default:
        return <h1>Essa, nie ma hakowanka XD </h1>;
    }
  };

  return serveMyProfile(userType);
}

export default MyProfile;
