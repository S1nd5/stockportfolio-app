import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, ImageBackground, Dimensions } from 'react-native';
import { Card, Badge, ListItem } from '@rneui/themed';

import Image from '../images/banking_pattern.jpg';
import { styles } from '../styles/Home';

export default function Home() {
    const screenWidth = Dimensions.get("window").width;

    /* Mock Data */
    
    let data = [
        { id: "HEL", name: "OMXH25", title: "Helsinki", points: 4920.59, points_up: 14.56, percentage_up: 0.30 },
        { id: "STO", name: "OMXS30", title: "Stockholm", points: 2097.9, points_up: 5.035, percentage_up: 0.24 }
    ]

    /* Flatlist Render Item */

    const renderItem = ({ item }) => (
        <ListItem key="omxh25">
            <ListItem.Content>
                <ListItem.Title style={{ paddingBottom: 10 }}>{item.name} {item.title}</ListItem.Title>
                <ListItem.Subtitle>
                    <Text><Badge value={`${parseFloat(item.points, 3)}`} status="primary" /></Text>
                    <Text><Badge value={`+${parseFloat(item.points_up, 3)}%`} status="success" /></Text>
                    <Text><Badge value={`+${parseFloat(item.percentage_up, 3)}%`} status="success" /></Text>
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );

    /* Main Rendering */

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ImageBackground source={Image} resizeMode="cover" style={styles.image}>
                <Card containerStyle={{ marginBottom: 30, width: screenWidth - 30 }}>
                    <Card.Title>Indeksit</Card.Title>
                    <Card.Divider />
                    <FlatList style={{ width: "100%" }} data={data} renderItem={renderItem} keyExtractor={item => item.id}></FlatList>
                </Card>
                <Card containerStyle={{ marginBottom: 30, width: screenWidth - 30 }}>
                    <Card.Title>Tervetuloa</Card.Title>
                    <Card.Divider />
                    <Text>Tämä on sovellus, jossa voit ylläpitää sijoitussalkkujasi. Voit hallinnoida salkkuja "Salkkusi" -välilehdellä, josta onnistuu luonti tai poisto. Kun olet tehnyt salkun pääset salkun sisältä lisäämään ja hallitsemaan sen osakkeita. Salkun sisällä olevista osakkeista on tarjolla lisätietoja.</Text>
                </Card>
            </ImageBackground>
        </View>
    )
}