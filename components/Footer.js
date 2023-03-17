import { Icon, Message } from "semantic-ui-react";

export default function Footer() {
  return (
    <footer>
      <Message floating className="main" color="blue">
        Developed by{" "}
        <a className="link" href="https://iiitl.ac.in">
          Indian Institute of Information Technology, Lucknow{" "}
          <Icon name="share" />
        </a>
      </Message>
    </footer>
  );
}
