import { React, useEffect } from "react";

export default function ProductClaim({
  members,
  items,
  values,
  checks,
  setChecks,
  handleClaimSubmit,
}) {
  const pairs = items.map(function (item, i) {
    return [item, values[i]];
  });

  // TODO: Warning when adding member after item is created
  const handleClick = (e) => {
    const key = e.target.name;
    const newChecks = { ...checks };
    newChecks[key] = !newChecks[key];
    setChecks(newChecks);
  };

  useEffect(() => console.log(checks), [checks])

  return (
    <>
      <h1>Check off your items below</h1>
      <form onSubmit={handleClaimSubmit}>
        {pairs.map((pair, index) => {
          return (
            <>
              <h1>
                {pair[0]} {pair[1]}
              </h1>
              {members.map((member) => (
                <input
                  name={member + index}
                  type="checkbox"
                  checked={checks[member + index]}
                  onChange={handleClick}
                />
              ))}
            </>
          );
        })}
        
        <br />
        <button type="submit">Finalize</button>
      </form>
    </>
  );
}
