import React, { useReducer, useState } from "react";
import Champ from "../general/champ";
import "../../styles/login&register/login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthWrapper";
import FenetrePopup from "../general/fenetre_popup";
import Bouton from "../general/bouton";

const Login = () => {
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { pseudo: "", password: "" }
  );

  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const doLogin = async () => {
    try {
      const response = await login(formData.pseudo, formData.password);
      const { token, admin, referent } = response; // Assurez-vous que l'attribut admin est retourné par la fonction login.
      localStorage.setItem("authToken", token);
      localStorage.setItem("pseudo", formData.pseudo);
  
      if (referent) {
        navigate("/referent");
      } else if(admin) {
        navigate("/admin");
      } else {
        navigate("/accueil");
      }
    } catch (error) {
      console.error('Erreur côté client lors de la connexion :', error);
      setErrorMessage(error.message || "Identifiants invalides");
      setPopupVisible(true);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pseudo || !formData.password) {
      setErrorMessage("Veuillez saisir un pseudo et un mot de passe"); // Message si des champs sont vides
      return;
    }

    try {
      await doLogin();
    } catch (error) {
      console.error("Erreur lors de la tentative de connexion :", error);
      setErrorMessage("Une erreur s'est produite lors de la connexion");
    }
  };

  return (
    <div className="Form-login">
      <form onSubmit={handleSubmit}>
        <Champ label="Pseudo :">
          <input
            className="input"
            type="text"
            value={formData.pseudo}
            onChange={(e) => setFormData({ pseudo: e.target.value })}
            required
          />
        </Champ>
        <Champ label="Mot de passe :">
          <input
            className="input"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            required
          />
        </Champ>

        <div className="button_container">
          <Bouton onClick={doLogin} type="submit">
            Se connecter
          </Bouton>
        </div>
      </form>

      {errorMessage && isPopupVisible && (
        <FenetrePopup message={errorMessage} type="error" onClose={hidePopup} />
      )}
    </div>
  );
};

export default Login;
