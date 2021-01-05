import React, { useContext } from "react";
import { GeneralData } from "../Context";

function AdminProfile() {
  const { userData, setUserData } = useContext(GeneralData);
  return <div>admin kot</div>;
}

export default AdminProfile;
