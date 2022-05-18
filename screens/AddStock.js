import React, { useState } from 'react';
import { Button, Overlay, Icon, Input } from '@rneui/themed';
import { Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ErrorDialog from '../components/ErrorDialog';
import AutocompleteInput from 'react-native-autocomplete-input';
import { nasdaq_helsinki } from '../data/stockdata';
import { styles } from '../styles/AddStock';

export default function OverlayForm(props) {

  const [overlayViewState, setOverlayViewState] = useState(false);
  const [datepickerStatus, setDatepickerStatus] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [formValues, setFormValues] = useState({ stockDate: new Date() });
  const [selectedValue, setSelectedValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    setOverlayViewState(props.status);
  }, [props.status])

  const handleDateConfirm = (date) => {
    setFormValues({ ...formValues, stockDate: date });
    setDatepickerStatus(false);
  }

  const findStock = (query) => {
    if (query) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      setFilteredData(
        nasdaq_helsinki.filter((stock) => stock.name.search(regex) >= 0)
      );
    } else {
      setFilteredData([]);
    }
  };

  const handleCreation = () => {
    if (!formValues.stockName) {
      setDialogText("Osaketta ei ole valittu.")
      setDialogStatus(true);
      return;
    }
    if (!formValues.stockPrice) {
      setDialogText("Osakkeen hintaa ei ole annettu.")
      setDialogStatus(true);
      return;
    }
    if (!formValues.stockAmount) {
      setDialogText("Osakkeiden määrää ei ole annettu.")
      setDialogStatus(true);
      return;
    }
    if (!formValues.stockDate) {
      setDialogText("Osakkeiden ostopäivää ei ole valittu.")
      setDialogStatus(true);
      return;
    }
    if (!selectedValue) {
      setDialogText("Osaketta ei ole valittu.")
      setDialogStatus(true);
      return;
    }
    // Insert stock
    setDialogText("")
    props.callbackFunction(formValues, selectedValue);
    setFormValues({ stockDate: new Date() });
    setSelectedValue('');
    setOverlayViewState(false);
  }

  return (
    <KeyboardAvoidingView>
      <Overlay overlayStyle={styles.main} isVisible={overlayViewState} onBackdropPress={() => { props.closeOverlay() }} fullScreen={true}>
        <ErrorDialog status={dialogStatus} closeDialog={() => { setDialogStatus(false) }} title={'Osakkeen lisäys salkkuun'} text={dialogText} />
        <Text style={styles.textPrimary}>{props.title}</Text>
        <Text style={styles.textSecondary}>
          {props.text}
        </Text>
        <Input
          placeholder='Salkun nimi'
          leftIcon={{ type: 'font-awesome', name: 'briefcase' }}
          value={props.portfolio.p_name}
          disabled
        />
        <Input
          placeholder='Osakkeen nimi'
          leftIcon={{ type: 'font-awesome', name: 'file' }}
          value={formValues.stockName}
          disabled
        />
        <AutocompleteInput
          editable={true}
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          data={filteredData}
          defaultValue={
            JSON.stringify(selectedValue) === '{}' ?
              '' :
              selectedValue.name
          }
          onChangeText={(text) => findStock(text)}
          placeholder="Syötä osakkeen nimi"
          flatListProps={{
            keyboardShouldPersistTaps: 'always',
            keyExtractor: item => item.symbol,
            renderItem: ({ item }) => (
              <TouchableOpacity key={item.isin} onPress={() => {
                setSelectedValue(item)
                setFormValues({ ...formValues, stockName: item.name })
                setFilteredData([]);
              }}>
                <Text style={styles.autocompleteText}>{item.name}</Text>
              </TouchableOpacity>
            )
          }}
        />
        <Input
          placeholder='Osakkeen hankintahinta'
          keyboardType='numeric'
          leftIcon={{ type: 'font-awesome', name: 'tag' }}
          onChangeText={(value) => { setFormValues({ ...formValues, stockPrice: value }) }}
        />
        <Input
          keyboardType='numeric'
          placeholder='Osakkeen kappalemäärä (kpl)'
          leftIcon={{ type: 'font-awesome', name: 'tag' }}
          onChangeText={(value) => { setFormValues({ ...formValues, stockAmount: value }) }}
        />
        <Input
          placeholder='Osakkeiden ostopäivä'
          leftIcon={{ type: 'font-awesome', name: 'calendar' }}
          value={formValues.stockDate.toLocaleDateString()}
          disabled
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
          title="Valitse ostopäivämäärä"
          onPress={() => { setDatepickerStatus(true) }}
        />
        <DateTimePickerModal
          isVisible={datepickerStatus}
          mode="date"
          onConfirm={handleDateConfirm}
          date={formValues.stockDate}
          onCancel={() => { setDatepickerStatus(false) }}
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
          title="Lisää osake"
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