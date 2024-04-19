import { useState } from "react";

const AddProposition = () => {
    const [proposition, setProposition] = useState('');

    const handleChange = (event) => {
        setProposition(event.target.value);
    }

    const handleAddProposition = () => {
        console.log("Proposition: " + proposition);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Enter proposition: </label>
            <input
                type="text"
                value={proposition}
                onChange={handleChange}
                style={{ width: "300px" }}
            />
            <button onClick={handleAddProposition}>Add Proposition</button>
        </div>
    )
}

export default AddProposition;