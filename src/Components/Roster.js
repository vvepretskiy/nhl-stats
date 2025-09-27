import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, SimpleListItem } from "@rmwc/list";
import { Grid, GridCell } from "@rmwc/grid";
import "@rmwc/data-table/styles";
import "@rmwc/grid/styles";
import "../App.css";

function Roster({ match }) {
  const [roster, setRoster] = useState([]);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    // const { id } = props.match.params;
    fetchRoster();
  }, [fetchRoster]);

  const fetchRoster = useCallback(async () => {
    const [{teams}, {roster}] = await Promise.all([
      fetch(`https://statsapi.web.nhl.com/api/v1/teams/${match.params.id}`).then(data => data.json()),
      fetch(`https://statsapi.web.nhl.com/api/v1/teams/${match.params.id}/roster`).then(data => data.json())
    ]);

    setRoster(roster);
    setTeamName(teams[0].name);
    console.log("roster", roster);
    console.log("team", teams[0]);
  }, [setTeamName, setRoster]);

  return (
    <div>
      <h3>Roster of {teamName}</h3>
      <Grid>
        {roster &&
          Object.values(roster).map(
            ({
              person: { fullName },
              jerseyNumber,
              position: { name },
              person: { id },
            }) => {
              return (
                <GridCell span={3}>
                  <List className="rosterContainer" twoLine>
                    <Link to={`/player/${id}`}>
                      <SimpleListItem
                        className="roster"
                        text={fullName}
                        secondaryText={jerseyNumber}
                        meta={name}
                      />
                    </Link>
                  </List>
                </GridCell>
              );
            }
          )}
      </Grid>
    </div>
  );
}

export default Roster;
