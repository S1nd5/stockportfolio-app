# Stockportfolio App [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://www.gnu.org/licenses/mit-3.0)

Stockportfolio App on mobiiliapplikaatio sijoitusten kirjaamiseen ja ylläpitoon varten. Käyttäjä voi luoda sovellukseen osakesalkkuja, jonka tyyppi voi olla arvo-osuustili tai osakesäästötili. Salkun sisään voi lisätä ja sieltä voi poistaa osakkeita. Sovellus on yhteydessä rajapintayhteydellä (REST) Yahoo Finance APIi:n, joka tarjoaa reaaliaikaiset kurssit ja muita lisätietoja yrityksistä käyttäjän nähtäville.

Kaikki data tallennetaan paikallisesti käyttäjän laitteelle (SQLite.)

## Authors

- [@S1nd5](https://www.github.com/S1nd5)

## Features

- Manage portfolios (add, remove)
- Manage stocks (add, remove)
- Calculations for profit/loss with current stock price
- Realtime stock prices (Yahoo Finance API)
- Extra information about business (Yahoo Finance API)

## Todo

- More statistics
- Support for multiple purchases of stocks (meaning the same stock wont show twice, but details about the second purchase exists)

## Dependencies

```bash
"dependencies": {
    "@react-native-picker/picker": "^2.4.1",
    "@react-navigation/bottom-tabs": "^6.3.1",
    "@react-navigation/native": "^6.0.10",
    "@rneui/base": "^4.0.0-rc.1",
    "@rneui/themed": "^4.0.0-rc.1",
    "expo": "~44.0.0",
    "expo-dev-client": "~0.8.5",
    "expo-sqlite": "~10.1.0",
    "expo-status-bar": "~1.2.0",
    "react": "17.0.1",
    "react-dom": "17.0.1",
    "react-native": "0.64.3",
    "react-native-autocomplete-input": "^5.1.0",
    "react-native-chart-kit": "^6.12.0",
    "react-native-date-picker": "^4.2.1",
    "react-native-modal-datetime-picker": "^13.1.2",
    "react-native-picker-select": "^8.0.4",
    "react-native-safe-area-context": "^4.2.4",
    "react-native-svg": "^12.3.0",
    "react-native-vector-icons": "^9.1.0",
    "react-native-web": "0.17.1",
    "react-navigation": "^4.4.4"
  }
  ```

## Demo

- [Expo address](https://expo.dev/@S1nd5/)

## Environment Variables

To run this project, you will need to at least add the following environment variables to your .env file:

rapidAPI Token

`API_KEY` = RapidAPI (Yahoo Finance, X-RapidAPI-Key)

## Run Locally

Clone the project

```bash
  git clone https://github.com/S1nd5/stockportfolio-app.git
```

Go to the project directory

```bash
  cd stockportfolio-app
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  expo start
```
    
## Images

<details><summary>Coming soon</summary>
</details>

## Related

Here are some pages related to this project

- [RapidApi: Yahoo Finance API](https://rapidapi.com/apidojo/api/yh-finance/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
