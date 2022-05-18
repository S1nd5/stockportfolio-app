import React, { useState } from 'react';
import { Button, Overlay, Icon, Input } from '@rneui/themed';
import { Text, KeyboardAvoidingView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ErrorDialog from '../components/ErrorDialog';
import { styles } from '../styles/AddPortfolio';

export default function OverlayForm(props) {

  const [overlayViewState, setOverlayViewState] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [dialogStatus, setDialogStatus] = useState(false);
  const [dialogText, setDialogText] = useState('');

  React.useEffect(() => {
    setOverlayViewState(props.status);
  }, [props.status])

  const handleCreation = () => {
    if (!formValues.portfolioName || formValues.portfolioName.length < 5) {
      setDialogText("Salkun nimi on virheellinen tai liian lyhyt.")
      setDialogStatus(true);
      return;
    }
    if (!formValues.portfolioType) {
      setDialogText("Ole hyvä ja määritä salkun tyyppi.")
      setDialogStatus(true);
      return;
    }
    // Insert portfolio
    props.callbackFunction(formValues);
    setFormValues({});
  }

  return (
    <KeyboardAvoidingView>
      <Overlay overlayStyle={styles.main} isVisible={overlayViewState} onBackdropPress={() => { props.closeOverlay() }} fullScreen={true}>
        <ErrorDialog status={dialogStatus} closeDialog={() => { setDialogStatus(false) }} title={'Uuden salkun luonti'} text={dialogText} />
        <Text style={styles.textPrimary}>{props.title}</Text>
        <Text style={styles.textSecondary}>
          {props.text}
        </Text>
        <Input
          placeholder='Salkun nimi'
          leftIcon={{ type: 'font-awesome', name: 'briefcase' }}
          onChangeText={(value) => { setFormValues({ ...formValues, portfolioName: value }) }}
        />
        <RNPickerSelect onValueChange={(value) => { setFormValues({ ...formValues, portfolioType: value }) }}
          placeholder={{ label: "Valitse salkkusi tyyppi", value: null }}
          items={[
            { label: 'Osakesäästötili', value: 'OST' },
            { label: 'Arvo-osuustili', value: 'AOT' },
          ]}
          style={styles}
        />
        <Button
          icon={
            <Icon
              name="plus"
              type="font-awesome"
              color="white"
              size={25}
              iconStyle={{ marginRight: 10 }}
            />
          }
          title="Luo salkku"
          onPress={handleCreation}
          buttonStyle={{ backgroundColor: 'green' }}
          titleStyle={{ color: 'white', fontWeight: 'bold' }}
          style={styles.addButton}
        />
        <Button
          icon={
            <Icon
              name="arrow-left"
              type="font-awesome"
              color="white"
              size={25}
              iconStyle={{ marginRight: 10 }}
            />
          }
          title="Peruuta"
          style={styles.cancelButton}
          buttonStyle={{ backgroundColor: 'red' }}
          titleStyle={{ color: 'white', fontWeight: 'bold' }}
          onPress={() => { props.closeOverlay() }}
        />
      </Overlay>
    </KeyboardAvoidingView>
  )
}