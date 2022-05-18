import { StatusBar } from 'expo-status-bar';
import { Button, Icon } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import Home from './screens/Home';
import PortfolioListView from './screens/PortfolioListView';
import PortfolioContentListView from './screens/PortfolioContentListView';
import StockView from './screens/StockView';

const Tab = createBottomTabNavigator();

/* Back button for header with tab bar 
  --> Helps user to navigate without needing to have all tabs on the bottom bar
*/

const backButton = () => {
  const navigation = useNavigation();
  return (
    <Button
      icon={
        <Icon
          name="chevron-left"
          type="font-awesome"
          color="black"
          size={25}
          iconStyle={{ marginRight: 10 }}
        />
      }
      title="Takaisin"
      buttonStyle={{ backgroundColor: 'white' }}
      titleStyle={{ color: 'black' }}
      onPress={() => navigation.goBack()}
    />
  )
}

/* All the tabs */

function MainBar({ navigation, route }) {
  return (
    <Tab.Navigator backBehavior='history' initialRouteName='Koti'>
      <Tab.Screen name="Koti" component={Home}
        options={{
          tabBarLabel: 'Koti',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen name="PortfolioList" component={PortfolioListView}
        options={{
          tabBarLabel: 'Salkkusi',
          headerTitle: "Salkkusi",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="PortfolioContent" component={PortfolioContentListView}
        options={{
          tabBarLabel: 'Salkkusi sisältö',
          headerTitle: "Salkkusi sisältö",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={size} />
          ),
          tabBarBadge: 0,
          tabBarButton: () => {
            return null
          },
          headerLeft: backButton
        }}
      />
      <Tab.Screen name="StockContent" component={StockView}
        options={{
          tabBarLabel: 'Osakenäkymä',
          headerTitle: "Osakenäkymä",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={size} />
          ),
          tabBarBadge: 2,
          tabBarButton: () => {
            return null
          },
          headerLeft: backButton
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MainBar />
    </NavigationContainer>
  );
}