import { View, StyleSheet, Text, Pressable, Linking } from 'react-native'
import React, { useRef, useState } from 'react'
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

export default function Topic(){
  const { topic, chapter } = useLocalSearchParams() as { topic: string, chapter: string};
  const [contentArr, changeCArr] = useState(null); 
  const [counter, changeCounter] = useState(-1);

  let [fontsLoaded, fontError] = useFonts({Dekko_400Regular, Acme_400Regular});

  if (!fontsLoaded && !fontError) return null;

  if(!contentArr) {
    fetch(
      `https://raw.githubusercontent.com/uzairarif5/DiscreteMathsContent/master/${topic}/${chapter}.json`,
      {cache: cacheType}
    ) 
    .then(response => response.json())
    .then(res => changeCArr(res));
    return null;
  }

  return (
    <>
      <Stack.Screen options={{
        ...stackScreenOptions,
        headerTitle: chapter.replaceAll("_"," ")
      }} />
      <BodyContent counter={counter} contentArr={contentArr}/>
      <NextButton changeCounter={changeCounter} counter={counter}/>
      {counter > 0 ? <BackButton changeCounter={changeCounter} counter={counter}/> : null}
      <View style={{width: "100%", height:40}}></View>
    </>
  );
}

function BodyContent(props: {counter: number, contentArr: [string, ...[string, string][]]}){
  if(props.counter > -1)
    return <QASection
      key={props.counter}
      counter={props.counter}
      questionAnswerArr={props.contentArr.slice(1) as [[string, string]]}
    />
  else
    //otherwise render the first content (or the information section)
    return getWebView(props.contentArr[0] as string); 
}

const NextButton = (props) => {
  
  let [fontsLoaded, fontError] = useFonts({
    Acme_400Regular
  });
  
  if (!fontsLoaded && !fontError) return null;
  
  return (
    <View style={styles.buttonOutside}>
      <Pressable onPress={()=>{props.changeCounter((val: number) => val +1)}} style={styles.button}>
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

type bodyContentCurAnsStateType = [string  | null, bodyContentChangeAnsType]
function QASection(props: {counter: number, questionAnswerArr: [[string, string]]}){
  const [curAns, changeAns]: bodyContentCurAnsStateType = useState(null);
  const linkFlag = useRef(false);
  const curPos = props.counter % props.questionAnswerArr.length;
  const pure_link = props.questionAnswerArr[curPos][1].slice("FETCH:".length);

  //render 100vh empty div first (else case), and the answer will also be fetched
  //render both q and a together (if case)
  if (!curAns){
    try{
      if(props.questionAnswerArr[curPos][1].slice(0,6) === "FETCH:"){
        linkFlag.current = true
        fetchAnswerFromDeriveit(changeAns, pure_link);
      }else changeAns(props.questionAnswerArr[curPos][1]);
    }
    catch { changeAns("<p>Error rendering answer, please report this.</p>"); }
    return null;
  }

  return getWebView(`
    <div style="min-height: 85vh">
      ${props.questionAnswerArr[curPos][0]}
    </div>
    <p style="font-size:26px"><u>Answer:</u></p>
    ${curAns}
  `, pure_link);
  
}

type bodyContentChangeAnsType = React.Dispatch<string | null>
function fetchAnswerFromDeriveit(changeAns: bodyContentChangeAnsType, link: string){
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
      else return "<p>Error rendering this part, please report this.</p>";
    });
    changeAns(newArr.join(""));
  })
  .catch(() => changeAns("<p>Error fetching the answer, please report this.</p>"));
}

function getWebView(text: string, link: string | null = null){
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
        <script>
          //Split the website link and delete empty strings
          const linkSplit = "${link}".split("/").filter(item => item);
          window.onload = ()=>{
            const listEl = document.getElementById("testList");
            for (let el of document.getElementsByTagName("a")){
              if(el.attributes.href.nodeValue.substring(0,4) === "www.") continue;
              let valueSplit = el.attributes.href.nodeValue.split("/").filter(item => item && item != ".." && item != ".");
              let vsLen = valueSplit.length;
              let cloneLinkSplit = [...linkSplit];
              let clsLen = cloneLinkSplit.length;
              for(let i = 0; i < vsLen; i++)
                cloneLinkSplit[clsLen-vsLen+i] = valueSplit[i];
              el.setAttribute("href", "https://www.deriveit.net/" + cloneLinkSplit.join("/"));
            }
          }
        </script>
      </head>
      <body>${text}</body>
    </html>
    ` , baseUrl: ''}}
    style={{width:"100%", backgroundColor: pageBackground}}
    onShouldStartLoadWithRequest={(event)=>{
      if (event.url.slice(0, 4) === 'http'){
        Linking.openURL(event.url);
        return false;
      }
      else return true;
    }}
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
