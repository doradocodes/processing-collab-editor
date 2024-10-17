import {AlertDialog, Button, Flex} from "@radix-ui/themes";
import {useWebsocketStore} from "../../store/websocketStore.js";

function DisconnectAlertDialog({isOpen, onClose}) {
    const onDisconnect = () => {
        onClose();
    }

    return <AlertDialog.Root open={isOpen}>
        <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>Disconnect from collaborative sketch?</AlertDialog.Title>
            <AlertDialog.Description size="2">
                Are you sure you want to disconnect from the collaborative sketch? You will lose access to the sketch and must reconnect to access it again.
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="center">
                <AlertDialog.Cancel>
                    <Button variant="soft" color="gray" onClick={onClose}>
                        Cancel
                    </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                    <Button variant="solid" color="red" onClick={onDisconnect}>
                        Disconnect
                    </Button>
                </AlertDialog.Action>
            </Flex>
        </AlertDialog.Content>
    </AlertDialog.Root>

}

export default DisconnectAlertDialog;
