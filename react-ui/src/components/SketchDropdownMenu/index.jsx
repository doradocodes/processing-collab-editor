import {ChevronDownIcon, DropdownMenu, IconButton} from "@radix-ui/themes";
import {deleteSketch, updateSketch} from "../../utils/localStorageUtils.js";
import {useEditorStore} from "../../store/editorStore.js";
import {generateroomID} from "../../utils/utils.js";

const SketchDropdownMenu = ({onRename, hasCollab}) => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const onSave = async () => {
        const fileName = currentSketch.fileName || `sketch_${new Date().getTime()}`;
        if (!currentSketch.fileName) {
            await setCurrentSketch({
                ...currentSketch,
                fileName,
            });
        }
        await updateSketch(fileName, currentSketch.content || '');
    }

    const onCollabToggle = async () => {
        const roomID = generateroomID();
        await updateSketch(currentSketch.fileName, currentSketch.content);
        window.electronAPI.openNewWindow(`collab/${roomID}/user/Host/sketch/${currentSketch.fileName}`);
    };

    const onDelete = async () => {
        await deleteSketch(currentSketch.fileName);

        window.location.reload();
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" size="2" aria-label="Menu">
                    <ChevronDownIcon/>
                </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item
                    onClick={onSave}
                    shortcut="⌘ S / Ctrl-S"
                >
                    Save
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => onRename()}
                >
                    Rename
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => onDelete()}
                >
                    Delete
                </DropdownMenu.Item>

                {hasCollab && [
                    <DropdownMenu.Separator key={1}/>,
                    <DropdownMenu.Item
                        key={2}
                        onClick={onCollabToggle}
                    >
                        Collaborate
                    </DropdownMenu.Item>
                ]}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default SketchDropdownMenu;
