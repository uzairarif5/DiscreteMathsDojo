import { View, StyleSheet, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFonts, Dekko_400Regular } from '@expo-google-fonts/dekko';
import { Acme_400Regular } from '@expo-google-fonts/acme';
import { pageBackground } from '../../constants';
import { WebView } from 'react-native-webview';

var cacheType: "default" | "no-store";
if((!process.env.NODE_ENV || process.env.NODE_ENV === 'development'))
  cacheType = "no-store";
else cacheType = "default";

const stackScreenOptions = {
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
}

const Topic = () => {
  const { topic, chapter } = useLocalSearchParams() as { topic: string, chapter: string};
  const [text, changeText] = useState(null); 
  const [counter, changeCounter] = useState(-1);

  let [fontsLoaded, fontError] = useFonts({Dekko_400Regular, Acme_400Regular});

  if (!fontsLoaded && !fontError) return null;

  if(!text) {
    fetch(
      `https://raw.githubusercontent.com/uzairarif5/DiscreteMathsContent/master/${topic}/${chapter}.json`,
      {cache: cacheType}
    ) 
    .then(response => response.json())
    .then(res => changeText(res));
    return null;
  }

  return (
    <>
      <Stack.Screen options={{
        ...stackScreenOptions,
        headerTitle: chapter.replaceAll("_"," ")
      }} />
      <BodyContent counter={counter} text={text}/>
      <NextButton changeCounter={changeCounter} counter={counter}/>
      {counter > 0 ? <BackButton changeCounter={changeCounter} counter={counter}/> : null}
      <View style={{width: "100%", height:40}}></View>
    </>
  );
}

export default Topic

type bodyContentChangeAnsType = React.Dispatch<string | null>
type bodyContentCurAnsStateType = [string  | null, bodyContentChangeAnsType]

function BodyContent(props){
  const [curAns, changeAns]: bodyContentCurAnsStateType = useState(null);

  useEffect(()=>{
    changeAns(null);
  }, [props.counter]);

  if(props.counter > -1){
    let questionAnswerArr = props.text.slice(1);
    //counter variable will always increment when next button is pressed
    let curPos = props.counter % questionAnswerArr.length;
    if(curAns){
      return getWebView(`
        <div style="min-height: 85vh">
          ${questionAnswerArr[curPos][0]}
        </div>
        <p style="font-size:26px"><u>Answer:</u></p>
        ${curAns}
      `);
    }
    else{
      if (questionAnswerArr[curPos].length > 1)
        if(questionAnswerArr[curPos][1].slice(0,5) === "FETCH")
          fetchAnswer(changeAns, questionAnswerArr[curPos][1].slice(6));
        else changeAns(questionAnswerArr[curPos][1]);
      else changeAns("<p>Answer not available right now.</p>");
      return  getWebView(`<div style="min-height: 100vh"></div>`);
    };
  }
  else return getWebView(props.text[0]);
}

const NextButton = (props) => {

  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <View style={styles.buttonOutside}>
      <Pressable onPress={()=>{props.changeCounter(val => val +1)}} style={styles.button}>
        <Text style={styles.buttonText}>
          {(props.counter > -1) ? "Next Question ->" : "Start Practice ->"}
        </Text>
      </Pressable>
    </View>
  )
}

const BackButton = (props) => {

  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <View>
      <Pressable onPress={()=>{props.changeCounter(val => val -1)}} style={styles.button}>
        <Text style={styles.buttonText}>{"<- Back"}</Text>
      </Pressable>
    </View>
  )
}

function fetchAnswer(changeAns: bodyContentChangeAnsType, link: string){
  let linkPieces = link.split("/");
  fetch("https://www.deriveit.net/infoStore/getArticleContent", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({topic: linkPieces[0], subTopic: linkPieces[1], article: linkPieces[2]}),
    cache: cacheType
  })
  .then(res => res.json())
  .then(res => {
    let newArr = res[1].slice(1).map(elem => {
      if(elem[0] == "pmain") return `<p>${elem[1]}</p>`;
      else if (elem[0] == "displayFormula") return `<div>${elem[1]}</div>`;
      else return "<p>ERROR RENDER THIS: please report</p>";
    });
    changeAns(newArr.join(""));
  })
  .catch(() => changeAns("<p>Answer not available right now.</p>"));
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

        div{
          max-width: 100%;
          overflow-x: scroll;
        }
        a, a:visited{
          color: #000; /* Fallback for older browsers */
          color: rgba(0,0,0,0.5);
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
    marginBottom: 10,
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
