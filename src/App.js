import React, { useState, useEffect } from "react";
import "./App.css";
// import "fontsource-roboto";
import { Card, CardContent, FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Infocard from "./Infocard.js";
import Map from "./Map";
import DataTable from "./DataTable";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./util.js";
import { TwitterTimelineEmbed } from "react-twitter-embed";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 17.5707, lng: -3.9962 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries") //async await...Call to get data from external API
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            code: country.countryInfo.iso2,
            label: country.country,
          }));

          setCountries(countries);
          setMapCountries(data);
        });
      setCountries((countries) => [
        { code: "WW", label: "Worldwide" },
        ...countries,
      ]);
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    //USed to fetch worldwide info at the time of app launch
    fetch("https://disease.sh/v3/covid-19/all") //async await...Call to get data from external API
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        // console.log(data.cases);
      });
  }, []);

  const onCountryChange = async (event, newValue) => {
    newValue === null || newValue.label === "Worldwide"
      ? setCountry("WW")
      : setCountry(newValue);

    const url =
      newValue === null || newValue.label === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${newValue.code}`;

    try {
      await fetch(url) //async await...Call to get data from external API
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        });
    } catch (e) {
      console.log("Error 404");
    }
  };

  return (
    <div className="app">
      <div className="app__top">
        <div className="app__left">
          <div className="app__header">
            <h1>COVID 19 TRACKER</h1>

            <FormControl>
              <Autocomplete
                className="app__header__dropdown"
                // value={country.label}
                defaultValue={{ code: "WW", label: "Worldwide" }}
                onChange={onCountryChange}
                style={{ width: 300 }}
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(option) => (
                  <React.Fragment>
                    {option.label} ({option.code})
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </FormControl>
          </div>

          <div className="app__stats">
            <Infocard
              activeCases={casesType === "cases"}
              heading="COVID Cases"
              todayCases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
              onClick={(e) => setCasesType("cases")}
            />
            <Infocard
              activeRecovered={casesType === "recovered"}
              heading="Recovered"
              todayCases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
              onClick={(e) => setCasesType("recovered")}
            />
            <Infocard
              activeDeaths={casesType === "deaths"}
              heading="Deaths"
              todayCases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
              onClick={(e) => setCasesType("deaths")}
            />
          </div>

          <Map
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            casesType={casesType}
          />
        </div>

        <div className="app__middle">
          <Card>
            <CardContent>
              <DataTable />
              <LineGraph
                selectedCountry={country.code}
                selectedCountryName={country.label}
                casesType={casesType}
              />
              {/* //passing the name of selectedCountry from dropdown into the Linegraph component             */}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="app__bottom">
        <Card>
          <CardContent>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="MoHFW_INDIA"
              options={{ height: 600, width: 360 }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="CDCgov"
              options={{ height: 600, width: 360 }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="WHO"
              options={{ height: 600, width: 360 }}
            />
          </CardContent>
        </Card>
      </div>
      <p className="app__copyright">&#169; Pulkit Gupta</p>
    </div>
  );
}

export default App;
