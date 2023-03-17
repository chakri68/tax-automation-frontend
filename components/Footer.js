import { Icon, Message } from "semantic-ui-react";

export default function Footer() {
  return (
    <footer>
      <Message floating className="main" color="blue">
        Developed by{" "}
        <a className="link" href="https://iiitl.ac.in" target='_blank' rel="noreferrer">
          <strong>
            Indian Institute of Information Technology, Lucknow{" "}
          </strong>
          <Icon name="external alternate" />
        </a>
      </Message>
    </footer>
  );
}
