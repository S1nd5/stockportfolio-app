import React, { useState } from 'react';
import { API_KEY } from "react-native-dotenv";
import { View, FlatList, Dimensions } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Card, Button, Badge, ListItem, FAB, Skeleton } from '@rneui/themed';
import Dialogi from '../components/Dialog';
import AddStock from './AddStock';

export default function PortfolioList({ navigation, route }) {
    const screenWidth = Dimensions.get("window").width;
    const [targetStock, setTargetStock] = useState({});
    const [dialogStatus, setDialogStatus] = useState(false);
    const [overlayStatus, setOverlayStatus] = useState(false);
    const [portfolioContent, setPortfolioContent] = useState([]);
    const [currentPortfolio, setCurrentPortfolio] = useState({});
    const [loading, setLoading] = useState(true);
    const db = SQLite.openDatabase('stockportfolio.db');

    /* API Header options
        Reads the API_KEY from .env file
    */

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
            'X-RapidAPI-Key': API_KEY
        }
    };

    /* SQLite database functionatility
        Fetching, Updates, Inserts, Deletes.
    */

    const updateData = (marketData) => {
        db.transaction(tx => {
            tx.executeSql('select * from owned_stocks WHERE s_portfolio_id = ?', [route.params.portfolio.p_id], async (_, { rows }) => {
                if (rows._array.length > 0) {
                    let symbolList = "";
                    rows._array.map((stock) => {
                        symbolList = symbolList + "%2C" + stock.s_symbol + ".HE,"
                    })
                    await fetch(`https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=FI&symbols=${symbolList}`, options)
                        .then(response => response.json())
                        .then(response => {
                            response.quoteResponse.result.map((marketStock) => {
                                let symbol = marketStock.symbol.split(".");
                                let currentEquivalent = rows._array.find((e) => e.s_symbol === symbol[0]);
                                currentEquivalent.totalValue = parseFloat(marketStock.regularMarketPrice * currentEquivalent.s_amount).toFixed(2);
                                currentEquivalent.totalProfit = parseFloat((marketStock.regularMarketPrice * currentEquivalent.s_amount) - currentEquivalent.s_amount * currentEquivalent.s_price).toFixed(2);
                            })
                            setPortfolioContent(rows._array)
                            setLoading(false);
                        })
                        .catch(err => console.error(err));
                } else {
                    setPortfolioContent(rows._array)
                    setLoading(false);
                }
            }
            );
        })
    }

    /* Removes stock from the portfolio */

    const removeStock = (id) => {
        db.transaction(
            tx => tx.executeSql('delete from owned_stocks where s_id = ?;', [id]), null, updateData
        )
    }

    /* Inserts a stock to the portfolio */

    const saveStock = (stock, selectedStock) => {
        db.transaction(tx => {
            tx.executeSql('insert into owned_stocks (s_name, s_symbol, s_isin, s_currency, s_sector, s_sector_fin, s_icb, s_price, s_amount, s_bought_date, s_portfolio_id) values(?,?,?,?,?,?,?,?,?,?,?);',
                [selectedStock.name, selectedStock.symbol, selectedStock.ISIN, selectedStock.currency, selectedStock.Sector, selectedStock.Sector_FI, selectedStock.ICB_Code, stock.stockPrice.replace(",", "."), stock.stockAmount, null, route.params.portfolio.p_id]);
        }, null, updateData)
    }

    React.useEffect(() => {
        setLoading(true);
        setCurrentPortfolio(route.params.portfolio);
        updateData();
    }, [route.params.portfolio])

    /* Screen View Methods */

    const addNewStock = () => {
        setOverlayStatus(true);
    }

    /* Opens detailed view of a specific stock */

    const openStock = (item) => {
        navigation.setParams({ stock: item });
        navigation.navigate("StockContent", { stock: item });
    }

    /* Opens confirmation dialog for deleting stock */

    const deleteStock = (item) => {
        setTargetStock(item);
        setDialogStatus(true);
    }

    /* Callback function for executing the deletion after confiming in the dialog */
    const executeCreation = (stockData, selectedStock) => {
        setOverlayStatus(false);
        saveStock(stockData, selectedStock);
    }

    /* Callback function for executing the deletion after confirming in the dialog */
    const executeDelete = (item) => {
        setDialogStatus(false);
        removeStock(item.s_id);
    }

    /* Flatlist Render Item */

    const renderItem = ({ item }) => {

        let preSign = "+";
        let color = "green";
        let status = "success";
        if (item.totalProfit < 0) {
            status = "error";
            preSign = "";
            color = "red";
        }

        return (
            <ListItem.Swipeable key={item.s_id} bottomDivider onPress={() => { openStock(item) }}
                rightContent={(reset) => (
                    <Button
                        title="Poista"
                        onPress={() => deleteStock(item)}
                        icon={{ name: 'delete', color: 'white' }}
                        buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                    />
                )}
            >
                <ListItem.Content>
                    <ListItem.Title>{item.s_name} {item.s_amount} kpl</ListItem.Title>
                </ListItem.Content>
                <Badge
                    value={`${parseFloat(item.totalValue, 3)}€`}
                    textStyle={{ color: 'white' }}
                />
                <Badge
                    value={`${preSign}${parseFloat(item.totalProfit, 3)}€`}
                    textStyle={{ color: 'white' }}
                    color={color}
                    status={status}
                />
                <ListItem.Chevron />
            </ListItem.Swipeable>
        )
    };

    /* General Rendering */

    return (
        <View>
            <Card containerStyle={{ marginBottom: 30, width: screenWidth - 30 }}>
                <Card.Title>{currentPortfolio.p_name}</Card.Title>
                <Card.Divider />
                {loading == false
                    ? <FlatList style={{ width: "100%" }} data={portfolioContent} renderItem={renderItem} keyExtractor={item => item.s_id}></FlatList>
                    : <Skeleton width={'100%'} height={400} />
                }
                <Dialogi item={targetStock} status={dialogStatus} closeDialog={() => { setDialogStatus(false) }} title={'Osakkeen poisto salkusta'} text={`Olet poistamassa osaketta ${targetStock.s_name}`} callbackFunction={executeDelete} />
                <AddStock portfolio={currentPortfolio} status={overlayStatus} closeOverlay={() => { setOverlayStatus(false) }} title={'Uuden osakkeen lisäys'} text={'Voit lisätä tässä uuden osakkeen salkkuusi. Mikäli osake on jo salkussa, sen osuudet kasvavat.'} callbackFunction={executeCreation} />
            </Card>
            {loading == false
                ? <FAB title="Lisää osake" onPress={() => { addNewStock() }} />
                : <Skeleton width={'100%'} height={40} />
            }
        </View>
    )
}