import React, { useState } from 'react';
import { Text } from 'react-native';
import { Dialog } from '@rneui/themed';

export default function ErrorDialog(props) {
    const [dialogViewState, setDialogViewState] = useState(false);

    React.useEffect(() => {
        setDialogViewState(props.status);
    }, [props.status])

    return (
        <Dialog
            isVisible={dialogViewState}
            onBackdropPress={() => setDialogViewState(false)}
        >
        <Dialog.Title title={props.title}/>
            <Text>{props.text}</Text>
            <Dialog.Actions>
                <Dialog.Button title="Ok" onPress={() => {props.closeDialog()}} status="primary"/>
            </Dialog.Actions>
        </Dialog>
    )
}