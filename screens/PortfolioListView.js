import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Card, Button, Icon, Badge, ListItem, FAB } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dialogi from '../components/Dialog';
import AddPortfolio from './AddPortfolio';

export default function Portfolio() {
    const screenWidth = Dimensions.get("window").width;
    const [portfolioData, setPortfolioData] = useState([]);
    const [targetItem, setTargetItem] = useState({});
    const [dialogStatus, setDialogStatus] = useState(false);
    const [overlayStatus, setOverlayStatus] = useState(false);
    const navigation = useNavigation();
    const db = SQLite.openDatabase('stockportfolio.db');

    /* SQLite database functionatility */

    const updateData = () => {
        db.transaction(tx => {
            tx.executeSql('select p_id, p_name, p_type from portfolios as p', [], (_, { rows }) => {
                setPortfolioData(rows._array)
            }
            );
        })
    }

    const removePortfolio = (id) => {
        db.transaction(
            tx => tx.executeSql('delete from portfolios where p_id = ?;', [id]), null, updateData
        )
    }

    const savePortfolio = (portfolio) => {
        db.transaction(tx => {
            tx.executeSql('insert into portfolios (p_name, p_type) values(?,?);',
                [portfolio.portfolioName, portfolio.portfolioType]);
        }, null, updateData)
    }

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists portfolios (p_id integer primary key not null, p_name varchar, p_type varchar);');
        }, null, updateData)
        db.transaction(tx => {
            tx.executeSql('drop table owned_stocks');
        }, null, null)
        db.transaction(tx => {
            tx.executeSql('create table if not exists owned_stocks (s_id integer primary key not null, s_name varchar not null, s_symbol varchar not null, s_isin varchar not null, s_currency varchar not null, s_sector varchar not null, s_sector_fin varchar not null, s_icb varchar not null, s_price not null, s_amount int not null, s_bought_date varchar, s_portfolio_id integer not null);');
        }, null, null)
    }, [])

    /* Screen View Methods */

    /* Opens overlay for portfolio creation */
    const addNewPortfolio = () => {
        setOverlayStatus(true);
    }

    /* Opens portfolio content view */
    const openPortfolio = (item) => {
        navigation.setParams({ portfolio: item });
        navigation.navigate("PortfolioContent", { portfolio: item });
    }

    /* Opens dialog for confirming deletion of portfolio */
    const deletePortfolio = (item) => {
        setTargetItem(item);
        setDialogStatus(true);
    }

    /* Callback function for executing the deletion after confiming in the dialog */
    const executeCreation = (portfolioData) => {
        setOverlayStatus(false);
        savePortfolio(portfolioData);
    }

    /* Callback function for executing the deletion after confirming in the dialog */
    const executeDelete = (item) => {
        setDialogStatus(false);
        removePortfolio(item.p_id);
    }

    /* FlatList Render Item */

    const renderItem = ({ item }) => (
        <ListItem.Swipeable key={item.p_id} bottomDivider onPress={() => { openPortfolio(item) }}
            rightContent={(reset) => (
                <Button
                    title="Poista"
                    onPress={() => deletePortfolio(item)}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
            )}
        >
            <MaterialCommunityIcons name="briefcase" color="green" />
            <ListItem.Content>
                <ListItem.Title>{item.p_name}</ListItem.Title>
            </ListItem.Content>
            <Badge
                value={`${item.p_type}`}
                textStyle={{ color: 'white' }}
            />
            <ListItem.Chevron />
        </ListItem.Swipeable>
    );

    /* Main Rendering */

    return (
        <View>
            <Card containerStyle={{ marginBottom: 30, width: screenWidth - 30 }}>
                <Card.Title>Salkut</Card.Title>
                <Card.Divider />
                <FlatList style={{ width: "100%" }} data={portfolioData} renderItem={renderItem} keyExtractor={item => item.p_id}></FlatList>
                <Dialogi item={targetItem} status={dialogStatus} closeDialog={() => { setDialogStatus(false) }} title={'Salkun poisto'} text={`Olet poistamassa salkkua: ${targetItem.p_name}`} callbackFunction={executeDelete} />
                <AddPortfolio status={overlayStatus} closeOverlay={() => { setOverlayStatus(false) }} title={'Uuden salkun lisäys'} text={'Voit luoda tässä näkymässä uuden salkun.'} callbackFunction={executeCreation} />
            </Card>
            <FAB title="Lisää salkku" onPress={() => { addNewPortfolio() }} />
        </View>
    );
}