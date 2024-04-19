import { useState } from "react";

const UserTypeSelector = (userContract) => {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = async (userType) => {
        setUserType(userType);
        await userContract.updateUser(userType);
        console.log("User Type changed to " + userType);
    }

    return (
        <select name="userType" value={userType} onChange={event => handleUserTypeChange(event.target.value)}>
            <option id="1">Voter</option>
            <option id="2">Certifier</option>
        </select>
    )

}

export default UserTypeSelector;