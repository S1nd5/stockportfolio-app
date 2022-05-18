import React, { useState } from 'react';
import { API_KEY } from "react-native-dotenv";
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { Card, Icon, Badge, Tab, TabView, Skeleton } from '@rneui/themed';
import { LineChart } from "react-native-chart-kit";
import { styles } from '../styles/StockView';

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.4,
    color: (opacity = 1) => `rgba(98, 89, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

export default function PortfolioList({ navigation, route }) {
    const screenWidth = Dimensions.get("window").width;
    const [targetStock, setTargetStock] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [index, setIndex] = React.useState(0);
    const [liveStockData, setLiveStockData] = useState({});
    const [chartData, setChartData] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
            'X-RapidAPI-Key': API_KEY
        }
    };

    const dataReady = (data) => {
        setLiveStockData(data);
        setLoadingData(false);
    }

    const generateChartData = (liveData) => {
        const months = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
        let data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    color: (opacity = 1) => `rgba(98, 89, 255, ${opacity})`, // optional
                    strokeWidth: 2 // optional
                }
            ],
            legend: ["Kurssikehitys YTD"], // optional
            xAxisLabel: "€"
        };
        let i = 0;
        data.datasets.data = liveData.chart.result[0].indicators.adjclose[0];
        liveData.chart.result[0].indicators.adjclose[0].adjclose.forEach((value) => {
            data.datasets[0].data.push(value);
            data.labels.push(months[i]);
            i++;
        })
        setChartData(data);
    }

    const chartDataReady = (data) => {
        generateChartData(data);
        setLoadingChart(false);
    }

    const getChartData = (stockSymbol) => {
        fetch(`https://yh-finance.p.rapidapi.com/stock/v3/get-chart?interval=1mo&symbol=${stockSymbol}.HE&range=ytd&region=FI&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`, options)
            .then(response => response.json())
            .then(response => chartDataReady(response))
            .catch(err => console.error(err));
    }

    const getLiveData = (stockSymbol) =>
        fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=${stockSymbol}.HE&region=FI`, options)
            .then(response => response.json())
            .then(response => dataReady(response))
            .catch(err => console.error(err));

    React.useEffect(() => {
        setCurrentStock(route.params.stock);
        getLiveData(route.params.stock.s_symbol);
        getChartData(route.params.stock.s_symbol);
    }, [route.params.stock])

    /* General Rendering */

    const OnlineDataRender = () => {
        let preSign = "+";
        let color = "green";
        let status = "success";
        if (liveStockData.price.regularMarketChange.fmt.includes("-")) {
            status = "error";
            preSign = "";
            color = "red";
        }
        return (
            <View>
                <Card containerStyle={{ marginBottom: 30, height: 260 }}>
                    <Card.Title>Arvonkehitys</Card.Title>
                    <Card.Divider />
                    <Text style={styles.cardStockText}><Icon type="font-awesome" name="calculator" /> Markkina-arvo: {parseFloat(liveStockData.price.regularMarketPrice.raw * currentStock.s_amount).toFixed(2)}€</Text>
                    <Text style={styles.cardStockText}><Icon type="font-awesome" name="arrow-up" /> Kokonaiskehitys: {parseFloat((liveStockData.price.regularMarketPrice.raw * currentStock.s_amount) - (currentStock.s_price * currentStock.s_amount)).toFixed(2)}€</Text>
                    <Text style={styles.cardStockText}><Icon type="font-awesome" name="globe" /> Kurssi: {liveStockData.price.regularMarketPrice.fmt} €
                        <Text style={{ color: color }}> {preSign}{liveStockData.price.regularMarketChange.fmt}
                            <Badge
                                value={`${preSign}${liveStockData.price.regularMarketChangePercent.fmt}`}
                                status={status}
                            />
                        </Text></Text>
                    <Text style={styles.cardStockText}><Icon type="font-awesome" name="repeat" /> Vaihto: {liveStockData.price.regularMarketVolume.fmt}</Text>
                </Card>
            </View>
        )
    }

    return (
        <View style={styles.scrollView} showsVerticalScrollIndicator={true}>
            <Card containerStyle={{ marginBottom: 30, width: screenWidth - 30, height: 160 }}>
                <Card.Title>{currentStock.s_name} - Omistuksesi</Card.Title>
                <Card.Divider />
                <Text style={styles.cardStockText}><Icon type="font-awesome" name="file" /> Osakkeiden määrä: {currentStock.s_amount} </Text>
                <Text style={styles.cardStockText}><Icon type="font-awesome" name="euro" />   Yksikköhinta: {parseFloat(currentStock.s_price).toFixed(2)} / kpl</Text>
                <Text style={styles.cardStockText}><Icon type="font-awesome" name="calculator" /> Hankinta-arvo: {parseFloat(currentStock.s_price * currentStock.s_amount).toFixed(2)}€</Text>
            </Card>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                indicatorStyle={{
                    backgroundColor: 'white',
                    height: 2,
                }}
                containerStyle={{ height: 60 }}
                variant="primary"
                scrollable={true}
            >
                <Tab.Item
                    title="Kehitys YTD"
                    titleStyle={{ fontSize: 10 }}
                    icon={{ name: 'pulse', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Arvonkehitys"
                    titleStyle={{ fontSize: 10 }}
                    icon={{ name: 'speedometer', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Osake"
                    titleStyle={{ fontSize: 10 }}
                    icon={{ name: 'document', type: 'ionicon', color: 'white' }}
                />
                <Tab.Item
                    title="Yritys"
                    titleStyle={{ fontSize: 10 }}
                    icon={{ name: 'business', type: 'ionicon', color: 'white' }}
                />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ width: '100%' }}>
                    <Card containerStyle={{ marginBottom: 30, height: 260 }}>
                        {loadingChart == false
                            ? <LineChart
                                data={chartData}
                                width={screenWidth - 60}
                                height={200}
                                chartConfig={chartConfig}
                            />
                            : <Skeleton width={'100%'} height={220} />
                        }
                    </Card>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    {loadingData == false
                        ? <OnlineDataRender />
                        : <Skeleton width={'100%'} height={120} />
                    }
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    <Card containerStyle={{ marginBottom: 30, height: 260 }}>
                        <Card.Title>Osake</Card.Title>
                        <Card.Divider />
                        <Text style={styles.stockText}>Nimi: {currentStock.s_name}</Text>
                        <Text style={styles.stockText}>Symboli / Ticker: {currentStock.s_symbol}</Text>
                        <Text style={styles.stockText}>ISIN-koodi: {currentStock.s_isin}</Text>
                        <Text style={styles.stockText}>ICB-koodi: {currentStock.s_icb}</Text>
                        <Text style={styles.stockText}>Sektori (EN): {currentStock.s_sector}</Text>
                        <Text style={styles.stockText}>Sektori (FI): {currentStock.s_sector_fin}</Text>
                    </Card>
                </TabView.Item>
                <TabView.Item style={{ width: '100%' }}>
                    {loadingData == false
                        ? <Card containerStyle={{ marginBottom: 30, height: 260 }}>
                            <Card.Title>Yritys</Card.Title>
                            <Card.Divider />
                            <Text style={styles.stockText}>P/E: {liveStockData.defaultKeyStatistics.forwardPE.fmt || ''}</Text>
                            <Text style={styles.stockText}>P/B: {liveStockData.defaultKeyStatistics.priceToBook.fmt || ''}</Text>
                            <Text style={styles.stockText}>EV/Ebit: {liveStockData.defaultKeyStatistics.enterpriseToEbitda.fmt || ''}</Text>
                            <Text style={styles.stockText}>Beta: {liveStockData.defaultKeyStatistics.beta.fmt || ''}</Text>
                            <Text style={styles.stockText}>EPS {liveStockData.defaultKeyStatistics.trailingEps.fmt || ''}</Text>
                            <Text style={styles.stockText}>Ebitda: {liveStockData.financialData.ebitdaMargins.fmt || ''}</Text>
                            <Text style={styles.stockText}>Liikevoitto: {liveStockData.financialData.profitMargins.fmt || ''}</Text>
                            <Text style={styles.stockText}>Suositushinta (mediaani): {liveStockData.financialData.targetMedianPrice.fmt || ''} €</Text>
                            <Text style={styles.stockText}>Suositus: {liveStockData.financialData.recommendationKey || ''}</Text>
                        </Card>
                        : <Skeleton width={'100%'} height={120} />
                    }
                </TabView.Item>
            </TabView>
        </View>
    )
}