import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "./Infocard.css";
import { CardActionArea } from "@material-ui/core";

function Infocard({
  heading,
  todayCases,
  total,
  activeCases,
  activeRecovered,
  activeDeaths,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`card ${activeCases && "card--cases"} ${
        activeRecovered && "card--recovered"
      } ${activeDeaths && "card--deaths"}`}
    >
      <CardActionArea>
        <CardContent>
          <Typography
            variant="h6"
            className="card__heading"
            color="textSecondary"
          >
            {heading}
          </Typography>

          <Typography
            className="card__cases"
            variant="body1"
            color="textPrimary"
          >
            {todayCases} Today
          </Typography>
          <Typography
            className="card__total"
            variant="body1"
            color="textSecondary"
          >
            {total} Total
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Infocard;
