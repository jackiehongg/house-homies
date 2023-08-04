import { React, useState } from "react";

export default function MemberForm({ members, handleSubmitMember }) {
  const [name, setName] = useState("");

  const handleClear = (e) => {
    e.preventDefault();
    setName("");
  };

  return (
    <>
      <h1>Add members involved in this bill!</h1>
      <h1>Current Members...</h1>
      <form onSubmit={handleSubmitMember}>
        <label>Member</label>
        <input
          name="member"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>
      {members ? (
        members.map((member) => <li key={member}>{member}</li>)
      ) : (
        <h5>None</h5>
      )}
    </>
  );
}
