import { View, StyleSheet, SafeAreaView, Platform, Pressable, Text } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';
import { router } from 'expo-router';
import { pageBackground } from "../constants";

const Topic = () => {
  const { topic } = useLocalSearchParams() as { topic:string};
  
  let bodyContent = <>
    <Image
      style={styles.imageStyle}
      contentFit='contain'
      source={{uri: `https://raw.githubusercontent.com/uzairarif5/DiscreteMathsContent/master/${topic}/image.png?dateForNoCache=${Date.now()}`}}
    />
    <LinksComp topic={topic} />
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

export default Topic

function LinksComp(props){
  const [topicContent, changeTC] = useState(null);

  if(!topicContent){
    fetch(`https://api.github.com/repos/uzairarif5/DiscreteMathsContent/contents/${props.topic}`) 
    .then(response => response.json())
    .then(res => changeTC(res));

    return null;
  }
  
  return <View style={styles.chaptersContainer}>
    {topicContent.map((item, num) => {
      return ((item["name"] === "image.png") || (item["name"] === "order.json")) ?
      null :
      <StyledButton text={item["name"].replaceAll("_"," ")} route={`${props.topic}/${item["name"]}`} key={num}/>
    })}
  </View>

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
      <Text style={styles.buttonText}>{"> "}</Text>
    </Pressable>
  )
}

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    width:"100%",
    position:"absolute",
    alignItems:"center",
    aspectRatio:1,
  },
  imageStyle:{
    width:"100%",
    maxWidth: 800,
    height: undefined,
    aspectRatio: 2000/1045,
    marginTop: 30,
    marginBottom: 30
  },
  chaptersContainer:{
    width:"100%",
  },
  button: {
    borderColor: "black",
    borderWidth: 2,
    borderStyle:"solid",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 0,
    backgroundColor: pageBackground,
    padding: 3,
    marginLeft: 25,
    marginRight: 25,
    flexDirection: "row",
    justifyContent:"space-between"
  },
  buttonText: {
    fontFamily: 'Acme_400Regular',
    fontSize: 18,
  }
})