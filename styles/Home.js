import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems:'center',
        margin: 0
      },
      image : {
          flex: 2,
          justifyContent: "center",
          resizeMode: "cover"
      },
      list: {
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#fff",
          alignItems: "center",
      },
})