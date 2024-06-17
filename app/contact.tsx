import { StyleSheet, Text, View, Platform, SafeAreaView } from 'react-native';
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';

const contact = () => {
  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  let bodyContent = <>
    <Text style={{... styles.title}}>Fill This Form</Text>
  </>;

  return (
    Platform.OS === "ios" ?
    <SafeAreaView style={styles.main}>
      {bodyContent}
    </SafeAreaView> :
    <View style={styles.main}>
      {bodyContent}
    </View>
  );
}

export default contact

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    width:"100%",
  },
  title: {
    fontSize: 22,
    lineHeight: 40,
    width: "100%",
    textAlign:"center",
    fontFamily: 'Acme_400Regular',
    paddingTop: 40,
    paddingBottom: 40
  },
})