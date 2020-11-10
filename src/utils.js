//draw circles on the map with interactive tooltip
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";
import React from "react";

const casesTypeColors = {
  cases: {
    hex: "#f91867",
    multiplier: 500,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 700,
  },
  deaths: {
    hex: "#CC1034",
    multiplier: 900,
  },
};
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
