import Image from "next/image";
import dbData from "../data/db.json";
import { useEffect, useRef, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { IoClose, IoEllipse, IoMic, IoSend } from "react-icons/io5";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styled from "styled-components";
import useSound from "use-sound";
import botLogo from "../assets/images/botLogo.png";
import { IsBot, IsUser } from "./";

const SendSoundUrl = "/sounds/boop.mp3";
const MicSoundUrl = "/sounds/tap.mp3";

export default function Home() {
  const messagesEndRef = useRef(null);

  const [botOpen, setBotOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const [playMsgSend] = useSound(SendSoundUrl);
  const [playMicRec] = useSound(MicSoundUrl);
  const [userInput, setUserInput] = useState("");
  const [userData, setUserData] = useState([]);
  const [fetchData, setFetchData] = useState(
    "Hi, I am Ubot 😊. How can I help you?"
  );
  // test
  const [userArr, setUserArr] = useState([]);
  const [botArr, setBotArr] = useState([]);
  // test
  const {
    transcript,
    listening,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userInput.replace(/\s{2,}/g, " ").trim() === "") {
      return;
    } else {
      setUserInput("");
      getMessage();
      createArr();
      playMsgSend();
    }
  };

  // useEffect(() => {
  // 	(async () => {
  // 		const res = await fetch(`http://localhost:4000/${userInput}`);
  // 		const data = await res.json();
  // 		const reply = data[0].conversation;
  // 		setFetchData(reply);
  // 		// console.log('reply in effect--> ',replyn);
  // 	})();
  // }, [userInput]);

  const getMessage = async () => {
    const response = dbData[userInput.toLowerCase()];
    const data = await response;

    // // create new arr from get data
    // const newArr = [...userData, data[0].conversation];
    // setUserData(newArr);
    // console.table(newArr);
    // console.log(newArr[newArr.length - 1]);

    // // setFetchData(data[0].conversation);
    // setFetchData(newArr[newArr.length - 1]);
    // // console.log('fet', fetchData);
    // // console.log(data[0].conversation);

    if (response && response.length > 0 && response[0].conversation) {
      const newArr = [...userData, response[0].conversation];
      setUserData(newArr);
      setFetchData(response[0].conversation);
    } else {
      // Handle case when there is no matching response
      const defaultResponse = "Sorry, I can't answer that.";
      const newArr = [...userData, defaultResponse];
      setUserData(newArr);
      setFetchData(defaultResponse);
    }
  };

  const createArr = () => {
    // .....// test user msg.......
    const newRec = { userInput };
    const newArr = [...userArr, newRec];
    setUserArr(newArr);
    // console.log(newArr);
    // .....// test user msg.......

    // .....// test bot msg.......
    const newBotRec = { fetchData };
    const newBotArr = [...botArr, newBotRec];
    setBotArr(newBotArr);
    // console.log(newBotArr);
    // .....// test bot msg.......

    const newRecord = { userInput, fetchData };
    console.log(newRecord);
    const newArray = [...userData, newRecord];
    setUserData(newArray);
    // console.table(newArray);
  };
  const recStart = () => {
    playMicRec();
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: "en-IN" });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setUserInput(transcript);
  }, [transcript]);

  useEffect(scrollToBottom, [userData]);

  if (!isMicrophoneAvailable) {
    console.log("Microphone is not available");
  }

  if (!browserSupportsSpeechRecognition) {
    return <h1>Browser does support speech recognition.</h1>;
  }
