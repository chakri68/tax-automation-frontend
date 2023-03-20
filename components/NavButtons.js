import { Button, Grid } from "semantic-ui-react";

export default function NavButtons({ back, home }) {
  return (
    <Grid centered>
      <Grid.Row columns={2}>
        <Grid.Column textAlign="right">
          <Button
            labelPosition="left"
            icon="arrow left"
            onClick={back}
            content="Back to List"
          />
        </Grid.Column>
        <Grid.Column textAlign="left">
          <Button
            labelPosition="right"
            icon="home"
            onClick={home}
            content="Back to Dashboard"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
