import { View, StyleSheet, SafeAreaView, Platform, Pressable, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';
import { router } from 'expo-router';
import { pageBackground } from "../constants";

const Topic = () => {
  const { topic } = useLocalSearchParams() as { topic:string};
  
  let bodyContent = <ScrollView>
    <Image
      style={styles.imageStyle}
      contentFit='contain'
      source={{uri: `https://raw.githubusercontent.com/uzairarif5/DiscreteMathsContent/master/${topic}/image.png?dateForNoCache=${Date.now()}`}}
    />
    <LinksComp topic={topic} />
    <View style={{width: "100%", height: 40}}></View>
  </ScrollView>;

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
    fetch(`https://raw.githubusercontent.com/uzairarif5/DiscreteMathsContent/master/${props.topic}/order.json`) 
    .then(response => response.json())
    .then(res => changeTC(res));

    return null;
  }
  
  return <View style={styles.chaptersContainer}>
    {topicContent.map((item, num) => {
      return <StyledButton text={item} route={`${props.topic}/${item.replaceAll("'","")}`} key={num}/>;
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
      <Text style={styles.buttonText}>{props.text.replaceAll("_"," ")}</Text>
      <Text style={styles.buttonText}>{"> "}</Text>
    </Pressable>
  )
}

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    width:"100%",
    position: "absolute",
    alignItems:"center",
    aspectRatio:1,
    height:"100%"
  },
  imageStyle:{
    width:"100%",
    maxWidth: 800,
    aspectRatio: 2000/1045,
    marginTop: 30,
    marginBottom: 30,
    height: undefined
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