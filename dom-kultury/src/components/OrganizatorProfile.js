import React, { useContext } from "react";
import { GeneralData } from "../Context";

function OrganizatorProfile() {
  const { userData, setUserData } = useContext(GeneralData);
  return <div>oragnizator</div>;
}

export default OrganizatorProfile;
