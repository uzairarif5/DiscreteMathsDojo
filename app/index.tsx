import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';
import { Dekko_400Regular } from '@expo-google-fonts/dekko';
import { fontColor1, fontColor2, pageBackground } from "./constants";
import { router } from 'expo-router';
import React from "react";

export default function Page() {

  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular, Dekko_400Regular
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  let bodyContent = <View style={{paddingTop:20}}>
    <Text style={{... styles.title, color: fontColor1, alignSelf: "flex-start"}}>Discrete</Text>
    <Text style={{... styles.title, color: fontColor2, alignSelf: "flex-end"}}>Maths</Text>
    <Text style={styles.subtitle}>Improve Your Skills</Text>
    <View style={styles.linkContainer}>
      <FormattedLink href={"/logic"}>Logic</FormattedLink>
      <FormattedLink href={"/set_theory"}>Set Theory</FormattedLink>
      <FormattedLink href={"/combinatorics"}>Combinatorics</FormattedLink>
      <FormattedLink href={"/number_theory"}>Number Theory</FormattedLink>
      <FormattedLink href={"/number_theory_part_2"}>Number Theory (part 2)</FormattedLink>
    </View>
    <StyledButton route={"/contact"} text={"Contact"} />
    <StyledButton route={"/other_stuff"} text={"Other Stuff From Creator"}/>

  </View>;

  return (
    Platform.OS === "ios" ?
    <SafeAreaView style={{... styles.main}}>
      {bodyContent}
    </SafeAreaView> :
    <View style={{... styles.main}}>
      {bodyContent}
    </View>
  );
}

function FormattedLink(props){
  let dots = " .........................................................................................." +
  "......................................................................................................" +
  "......................................................................................................";
  return <Link style={styles.formattedLink} numberOfLines={1} href={props.href} ellipsizeMode="clip">
    {props.children+dots}
  </Link>
}

const StyledButton = (props) => {

  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Pressable onPress={()=>{router.push(props.route)}} style={styles.button}>
      <Text style={styles.buttonText}>{props.text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width:"100%",
    maxWidth: 800,
    alignSelf:"center",
  },
  title: {
    fontSize: 90,
    fontFamily: 'Acme_400Regular',
    textShadowColor: 'black',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    lineHeight: 100,
    paddingLeft: 20,
    paddingRight: 20,
  },
  subtitle: {
    fontSize: 36,
    lineHeight: 40,
    width: "100%",
    textAlign:"center",
    fontFamily: 'Acme_400Regular',
  },
  linkContainer: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  formattedLink: {
    fontSize: 22,
    fontFamily: 'Acme_400Regular',
    lineHeight: 46,
    paddingLeft: 24,
    paddingRight: 24,
  },
  button: {
    borderColor: "black",
    borderWidth: 2,
    borderStyle:"solid",
    borderRadius: 5,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
    boxShadow: [{color: "black", offsetX: 2, offsetY: 2}],
    backgroundColor: pageBackground,
    padding: 3,
  },
  buttonText: {
    fontFamily: 'Acme_400Regular',
    fontSize: 18,
    textAlign:"center"
  }
});
