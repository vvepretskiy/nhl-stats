import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardPrimaryAction,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionButton,
  CardActionIcons,
} from "@rmwc/card";
import { Typography } from "@rmwc/typography";
import "@rmwc/data-table/styles";
import "@rmwc/card/styles";
import "@rmwc/card/styles";
import "@rmwc/icon/styles";
import "@rmwc/typography/styles";
import "./Player.scss";

function Player({ match }) {
  const [player, setPlayer] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [currentTeam, setCurrentTeam] = useState("");
  const date = new Date();
  const year = date.getFullYear();
  console.log(year);

  const fetchRoster = useCallback(async () => {
    const [{people}, {stats}] = await Promise.all([
        fetch(`https://statsapi.web.nhl.com/api/v1/people/${match.params.id}`).then(data => data.json()),
        fetch(`https://statsapi.web.nhl.com/api/v1/people/${match.params.id}/stats?stats=statsSingleSeason&season=${year - 1}${year}`).then(data => data.json())
      ]);
    
    setPlayer(people);
    setCurrentTeam(people[0].currentTeam.name);
    const stat = stats[0].splits[0].stat;
    setStatistics(stat);
    console.log("player", people);
    console.log("Player statistics", stat);
  }, [setPlayer, setCurrentTeam, setStatistics]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  return (
    <div>
      <h3> {currentTeam || "Team"}</h3>
      {player &&
        Object.values(player).map(
          ({
            fullName,
            birthCity,
            birthDate,
            birthCountry,
            height,
            weight,
            primaryPosition: { name: primaryPosition },
            primaryNumber,
          }) => {
            return (
              <Card className="playerCard">
                <CardPrimaryAction>
                  <CardMedia
                    sixteenByNine
                    style={{
                      backgroundImage: "url(../Logo/nhl-logo-vector-21.png)",
                    }}
                  />
                  <div style={{ padding: "0 1rem 1rem 1rem" }}>
                    <Typography use="headline6" tag="h2">
                      {fullName}
                    </Typography>
                    <Typography
                      use="subtitle2"
                      tag="h3"
                      theme="textSecondaryOnBackground"
                      style={{ marginTop: "-1rem" }}
                    >
                      Birth date:{birthDate}, {birthCountry}
                    </Typography>
                    <Typography
                      use="subtitle2"
                      tag="h3"
                      theme="textSecondaryOnBackground"
                      style={{ marginTop: "-1rem" }}
                    >
                      Height: {height}, Weight: {weight}
                    </Typography>
                    <Typography
                      use="body1"
                      tag="div"
                      theme="textSecondaryOnBackground"
                    >
                      {primaryPosition}
                    </Typography>
                    <Typography
                      use="body1"
                      tag="div"
                      theme="textSecondaryOnBackground"
                    >
                      Jersey # {primaryNumber}
                    </Typography>
                    <hr />
                    <Typography tag="div">
                      Game Played this season : {statistics.games}.
                    </Typography>
                    <Typography tag="div">
                      Goals scored : {statistics.goals}
                    </Typography>
                  </div>
                </CardPrimaryAction>
                <CardActions>
                  <CardActionButtons>
                    <CardActionButton>Read</CardActionButton>
                    <CardActionButton>Bookmark</CardActionButton>
                  </CardActionButtons>
                  <CardActionIcons>
                    {/* <CardActionIcon onIcon="favorite" icon="favorite_border" />
                    <CardActionIcon icon="share" />
                    <CardActionIcon icon="more_vert" /> */}
                  </CardActionIcons>
                </CardActions>
              </Card>
            );
          }
        )}
    </div>
  );
}

export default Player;
