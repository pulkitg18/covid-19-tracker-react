import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "./LineGraph.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const casesTypeColors = {
  cases: {
    hex: "#f91867",
    rgba: "rgb(249, 24, 103, 0.5)",
  },
  recovered: {
    hex: "#7dd71d",
    rgba: "rgb(125, 215, 29, 0.5)",
  },
  deaths: {
    hex: "#CC1034",
    rgba: "rgb(204, 16, 52, 0.8)",
  },
};

function LineGraph(props) {
  const [casesData, setCasesData] = useState({});

  //function for converting API data into format compatible for LineGraph
  const getChartData = (data, caseType) => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data[caseType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[caseType][date];
    }
    return chartData;
  };

  useEffect(() => {
    let specificCountry = false;
    let url = "";

    if (props.selectedCountry === undefined || props.selectedCountry === "WW") {
      url = "https://disease.sh/v3/covid-19/historical/all?lastdays=90";
    } else {
      url = `https://disease.sh/v3/covid-19/historical/${props.selectedCountry}?lastdays=90`;
      specificCountry = true;
    }

    const fetchData = async () => {
      let chartData;
      try {
        await fetch(url) //async await...Call to get data from external API
          .then((response) => response.json())
          .then((data) => {
            if (specificCountry) {
              chartData = getChartData(data.timeline, props.casesType);
            } else {
              chartData = getChartData(data, props.casesType);
            }
            setCasesData(chartData);
          });
      } catch (e) {
        console.log("404 error");
      }
    };
    fetchData();
  }, [props.selectedCountry, props.casesType]);

  return (
    <div className="graph">
      <h3>
        {props.selectedCountryName} New {props.casesType}
      </h3>
      {casesData?.length > 0 && (
        <Line
          className="graph__linegraph"
          options={options}
          // width = {200}
          // height = {150}
          data={{
            datasets: [
              {
                data: casesData,
                backgroundColor: casesTypeColors[props.casesType].rgba,
                borderColor: casesTypeColors[props.casesType].hex,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
