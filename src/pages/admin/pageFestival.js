import React from "react";
import BandeauAdmin from "../../components/admin/bandeauAdmin";
import BoiteOnglet from "../../components/general/boiteOnglet";
import DisplayStand from "../../components/admin/stands/display_stand";
import DisplayZone from "../../components/admin/jeux/zonesAdmin";
import "../../styles/Pages/admin/pageFestival.css";

function PageFestival() {
  return (
    <div className="pageStand">
      <BandeauAdmin />
      <BoiteOnglet nomOnglet1="Stands" nomOnglet2="Zones">
        <div className="Onglet1">
          <DisplayStand />
        </div>
        <div>
        <DisplayZone />
        </div>
      </BoiteOnglet>
    </div>
  );
}

export default PageFestival;
