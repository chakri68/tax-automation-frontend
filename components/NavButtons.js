import { Button, Grid } from "semantic-ui-react";

export default function NavButtons({ back, home }) {
  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column>
          <Button
            labelPosition="left"
            icon="arrow left"
            onClick={back}
            content="Back"
          />
        </Grid.Column>
        <Grid.Column>
          <Button
            labelPosition="right"
            icon="home"
            onClick={home}
            content="Home"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
