import { Button, Header, Icon, Modal } from "semantic-ui-react";

export default function ErrorModal({
  open = undefined,
  warning = false,
  title = "Error",
  toggleOpen = () => {},
  onExit = () => {},
  children,
  ...props
}) {
  return (
    <Modal
      {...props}
      closeOnDimmerClick={false}
      open={open}
      onClose={() => toggleOpen(false)}
      onOpen={() => toggleOpen(true)}
    >
      <Header
        color={warning ? "orange" : "red"}
        icon="warning sign"
        content={title}
      />
      <Modal.Content>{children}</Modal.Content>
      <Modal.Actions>
        {warning ? (
          <Button
            color="orange"
            onClick={() => {
              onExit();
              toggleOpen(false);
            }}
          >
            {" "}
            Ok
          </Button>
        ) : (
          <Button
            color="red"
            onClick={() => {
              onExit();
              toggleOpen(false);
            }}
          >
            <Icon name="redo" /> Try Again
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}
