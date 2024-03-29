import React, { useReducer, useState, useEffect } from "react";
import Champ from "../general/champ";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthWrapper";
import "../../styles/login&register/register.css";
import FenetrePopup from "../general/fenetre_popup";
import Bouton from "../general/bouton";

const FormInscription = () => {
  const formReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return { ...state, [action.field]: action.value };
      default:
        return state;
    }
  };

  const [formData, dispatchFormData] = useReducer(formReducer, {
    nom: "",
    prenom: "",
    pseudo: "",
    password: "",
    association: "",
    taille_tshirt: "",
    vegetarien: "",
    hebergement: "",
    adresse: "",
    num_telephone: "",
    mail: "",
    admin: false,
    referent: false,
  });

  const [pseudo, setPseudo] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false); // Afficher la fenêtre contextuelle
  const [isPropositionSelected, setIsPropositionSelected] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    // Cette fonction sera appelée après que le composant ait été rendu
    // et que setPseudo ait mis à jour l'état
    dispatchFormData({ type: "UPDATE_FIELD", field: "pseudo", value: pseudo });
  }, [pseudo]); // Assurez-vous d'ajouter pseudo comme dépendance ici

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
  
    // Déterminez la valeur à utiliser en fonction du champ et de la valeur reçue
    let finalValue = value;
    if (name === "vegetarien") {
      finalValue = value === "true"; // Convertit la chaîne "true" ou "false" en booléen
    }
  
    // Dispatch l'action avec la valeur finale
    dispatchFormData({ type: "UPDATE_FIELD", field: name, value: finalValue });

    // Si "proposition" est sélectionné, afficher le champ d'adresse
    if (name === "hebergement") {
      setIsPropositionSelected(value === "Proposition");
    }

    // Update pseudo when changing in the name or surname fields
    if (name === "prenom" || name === "nom") {
      // Assurez-vous d'avoir à la fois le prénom et le nom pour générer le pseudo
      const updatedFormData = { ...formData, [name]: value };
      generatePseudo(updatedFormData.prenom, updatedFormData.nom);
    }
  };

  const checkPseudoUnique = async (pseudo) => {
    try {
      const response = await fetch(
        `https://festivaldujeuback.onrender.com/benevole/check-pseudo/${pseudo}`
      );
      const data = await response.json();
      return data.exists; // 'exists' est un booléen renvoyé par le serveur indiquant si le pseudo existe
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'unicité du pseudo",
        error
      );
      return true; // En cas d'erreur, supposez que le pseudo n'est pas unique pour éviter les doublons
    }
  };

  const generatePseudo = async (prenom, nom) => {
    if (!prenom || !nom) return; // Si prénom ou nom est vide, ne faites rien

    let basePseudo = `${prenom}${nom.charAt(0)}`; // Génère le pseudo de base
    let uniquePseudo = basePseudo;
    let counter = 1;

    // Vérifie l'unicité du pseudo
    while (await checkPseudoUnique(uniquePseudo)) {
      uniquePseudo = `${basePseudo}${counter}`; // Ajoute un chiffre à la fin
      counter++;
    }

    // Une fois le pseudo unique trouvé, mettez à jour l'état avec ce pseudo
    setPseudo(uniquePseudo);
    dispatchFormData({
      type: "UPDATE_FIELD",
      field: "pseudo",
      value: uniquePseudo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { num_telephone } = formData;

    // Vérification pour le numéro de téléphone s'il est renseigné
    if (
      num_telephone &&
      (num_telephone.length !== 10 || isNaN(num_telephone))
    ) {
      setErrorMessage(
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
      setSuccessMessage(null);
      setPopupVisible(true);
      return;
    }

    if (isPropositionSelected.current && formData.adresse.trim() === "") {
      setErrorMessage(
        "L'adresse est obligatoire si vous sélectionnez \"proposition\" pour l'hébergement."
      );
      setSuccessMessage(null);
      setPopupVisible(true);
      return;
    }

    try {
      const response = await register(formData);

      if (response === "success") {
        setSuccessMessage("Inscription réussie");
        setErrorMessage(null);
        setPopupVisible(true);
        // La redirection sera effectuée après que l'utilisateur a vu la fenêtre contextuelle
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage("L'inscription a échoué");
        setSuccessMessage(null);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrorMessage(null);
      setPopupVisible(true);
    }
  };

  return (
    <div className="Form-register">
      <form onSubmit={handleSubmit}>
        <div className="champ-container">
          <div className="row">
            {/* <div className="field-with-aide"> */}
            <Champ label="Nom :">
              <input
                className="input"
                type="text"
                name="nom"
                id="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Champ>
            {/* </div>
              <div className="aide">
              <Aide />
            </div> */}

            <Champ label="Pseudo :">
              <input
                type="text"
                name="pseudo"
                id="pseudo"
                value={pseudo}
                onChange={handleInputChange}
                readOnly
                required
                className="input"
              />
            </Champ>

            <Champ label="Email :">
              <input
                type="text"
                name="mail"
                id="mail"
                value={formData.mail}
                onChange={handleInputChange}
                className="input"
                required
              />
            </Champ>

            <Champ label="Végétarien ? :">
              <select
                name="vegetarien"
                id="vegetarien"
                value={formData.vegetarien}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Sélectionnez une option</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </Champ>

            <Champ label="Téléphone :">
              <input
                type="tel"
                name="num_telephone"
                id="num_telephone"
                value={formData.num_telephone}
                onChange={handleInputChange}
                className="input"
              />
            </Champ>

            {isPropositionSelected && (
              <div className="invisible-field">
                <Champ label="Invisible :">
                  <input type="text" className="input" />
                </Champ>
              </div>
            )}
          </div>
          <div className="row">
            {/* <div className="field-with-aide"> */}
            <Champ label="Prénom :">
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="input"
                required
              />
            </Champ>
            {/* </div>
              <div className="aide">
              <Aide />
            </div> */}

            {/* <div className="field-with-aide"> */}
            <Champ label="Mot de passe :">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                required
              />
            </Champ>
            {/* </div>
              <div className="aide">
              <Aide /> */}
            {/* </div> */}

            <Champ label="Association :">
              <select
                name="association"
                id="association"
                value={formData.association}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Sélectionnez une option</option>
                <option value="APCU">APCU</option>
                <option value="MEN">MEN</option>
                <option value="SMI">SMI</option>
              </select>
            </Champ>

            <Champ label="Taille de Tee-shirt :">
              <select
                type="text"
                name="taille_tshirt"
                id="taille_tshirt"
                value={formData.taille_tshirt}
                onChange={handleInputChange}
                required
                className="input"
              >
                <option value="">Sélectionnez une option</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </Champ>

            <Champ label="Hébergement :">
              <select
                name="hebergement"
                id="hebergement"
                value={formData.hebergement}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Sélectionnez une option</option>
                <option value="Recherche">Recherche</option>
                <option value="Proposition">Proposition</option>
                <option value="Rien">Rien</option>
              </select>
            </Champ>

            {isPropositionSelected && (
              <Champ label="Adresse :">
                <input
                  type="text"
                  name="adresse"
                  id="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="input"
                />
              </Champ>
            )}
          </div>
        </div>

        <div className="button_container">
          <Bouton type="submit">S'inscrire</Bouton>
        </div>
      </form>

      {errorMessage && isPopupVisible && (
        <FenetrePopup message={errorMessage} type="error" onClose={hidePopup} />
      )}

      {successMessage && isPopupVisible && (
        <FenetrePopup
          message={successMessage}
          type="success"
          onClose={hidePopup}
        />
      )}
    </div>
  );
};

export default FormInscription;
