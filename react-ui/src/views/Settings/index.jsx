import {Button, TextField, Text} from "@radix-ui/themes";
import * as Label from '@radix-ui/react-label';

function Settings() {
    return (
        <div>
            <h1>Settings</h1>
            <div>
                <span>Processing path</span>
                <TextField.Root placeholder="Enter path"/>
            </div>
            <Button onClick={()=> {
                window.electronAPI.closeSettingsWindow();
            }}>Close</Button>
        </div>
    );
}

export default Settings;
