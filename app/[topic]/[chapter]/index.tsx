import { View, StyleSheet, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFonts, Dekko_400Regular } from '@expo-google-fonts/dekko';
import { Acme_400Regular } from '@expo-google-fonts/acme';
import { pageBackground } from '../../constants';
import { WebView } from 'react-native-webview';

const Topic = () => {
  const { topic, chapter } = useLocalSearchParams() as { topic: string, chapter: string};
  const [text, changeText] = useState(null); 
  const [counter, increaseCount] = useState(-1);

  let [fontsLoaded, fontError] = useFonts({Dekko_400Regular, Acme_400Regular});

  if (!fontsLoaded && !fontError) return null;

  if(!text) {
    fetch(`https://raw.githubusercontent.com/uzairarif5/DiscreteMathsContent/master/${topic}/${chapter}/1.json?dateForNoCache=${Date.now()}`) 
    .then(response => response.json())
    .then(res => changeText(res));

    return null;
  }

  let bodyContent = null
  let qArr = text[1];
  let aArr = text[2];
  if(counter > -1){
    bodyContent = getWebView(`<div style="min-height: 80vh">${qArr[counter % qArr.length]}</div><br/><p><u>Answer:</u></p>${aArr[counter % aArr.length]}`);
  }
  else{
    bodyContent = getWebView(text[0]);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: chapter.replaceAll("_"," "),
          headerTitleStyle: {
            fontFamily: "Acme_400Regular",
            color:"black",
            fontSize: 25
          },
          headerStyle: {
            backgroundColor: pageBackground
          },
          headerTintColor:"#000",
          headerBackTitleVisible: false,
          contentStyle:{
            borderTopColor: "black",
            borderTopWidth: 2,
            backgroundColor: pageBackground
          }
        }}
      />
      {bodyContent}
      <StyledButton increaseCount={increaseCount} count={counter}/>
    </>
  );
}

export default Topic

const StyledButton = (props) => {

  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <View style={styles.buttonOutside}>
      <Pressable onPress={()=>{props.increaseCount(val => val+1)}} style={styles.button}>
        <Text style={styles.buttonText}>
          {(props.count > -1) ? "More Questions ->" : "Start Practice ->"}
        </Text>
      </Pressable>
    </View>
  )
}

function getWebView(text){
  return <WebView
    originWhitelist={['*']}
    source={{ html: `
    <!DOCTYPE html>
    <html style="background-color: ${pageBackground};">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Dekko&display=swap" rel="stylesheet">
      <style>
        body, p{
          font-family: "Dekko";
          font-size: 22px;
        }
      </style>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <script type="text/javascript" async src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"></script>
      </head>
      <body>${text}</body>
    </html>
    ` , baseUrl: ''}}
    style={{width:"100%", backgroundColor: pageBackground}}
  />
}


export const styles = StyleSheet.create({
  main: {
    flex: 1,
    width:"100%",
    position:"absolute",
    alignItems:"center",
    aspectRatio:1,
  },
  buttonOutside:{
    width:"100%",
    borderTopColor:"black",
    borderTopWidth: 2
  },
  button: {
    marginTop: 10,
    marginBottom: 40,
    marginLeft: 30,
    marginRight: 30,
    borderColor: "black",
    borderWidth: 2,
    borderStyle:"solid",
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    shadowRadius: 0,
    padding: 3,
    backgroundColor: pageBackground,
  },
  buttonText: {
    fontFamily: 'Acme_400Regular',
    fontSize: 18,
    textAlign:"center",
  }
})
