import React from 'react';
import "../styles/bouton.css"

const Bouton = ({ children }) => {
    return (
      <button className="CustomButton">
        <span className="ButtonText">
            {children}
        </span>
      </button>
    );
  };

export default Bouton;