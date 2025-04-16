import React from "react";

function Logo({ width = "100px" }) {
  return (
    <div
      className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text cursor-pointer"
      
    >
      GYM
    </div>
  );
}

export default Logo;