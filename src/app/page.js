"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import hipanda from "/public/hipanda.json";
import avatar from "/public/avatar.png";
import rabbit from "/public/rabbit.png";
import pandapal from "/public/pandapal.png";
import thinking from "/public/thinking.png";
import writing from "/public/writing.png";
import Image from "next/image";
import ".//globals.css";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [loadingImage, setLoadingImage] = useState(1);

  useEffect(() => {
    const storedConversation = localStorage.getItem("conversation");

    if (storedConversation) {
      setConversation(JSON.parse(storedConversation));

      // Sätt showIntro till false om konversationen inte är tom
      if (JSON.parse(storedConversation).length > 0) {
        setShowIntro(false);
      }
    }
  }, []);

  // Uppdatera lokal lagring varje gång konversationen ändras
  useEffect(() => {
    localStorage.setItem("conversation", JSON.stringify(conversation));
  }, [conversation]);

  // Använd useEffect för att hantera showIntro-tillståndet baserat på konversationens längd
  useEffect(() => {
    if (conversation.length > 0) {
      setShowIntro(false);
    } else {
      setShowIntro(true);
    }
  }, [conversation]);

  function getDisplayRole(roles) {
    switch (roles) {
      case "user":
        return "You";
      case "assistant":
        return "Panda";
      default:
        return roles;
    }
  }

  function ConversationLine({ role, content }) {
    const displayRole = getDisplayRole(role);
    return (
      <div className="flex items-start gap-2">
        {displayRole === "Panda" && (
          <div>
            <Image
              src={avatar}
              alt="Panda Avatar"
              className="h-12 w-10 ml-1 rounded-md  border-2 border-white"
            />
          </div>
        )}
        {displayRole === "You" && (
          <div>
            <Image
              src={rabbit}
              alt="Rabbit Avatar"
              className="h-12 w-10 ml-1 rounded-md  border-2 border-white"
            />
          </div>
        )}
        <div className="text-start flex flex-col">
          <div className="mb-1">
            <p>{role}:</p>
          </div>
          <div className="w-80">{content}</div>
        </div>
      </div>
    );
  }
  async function generatePositiveQuote() {
    try {
      setIsLoading(true);
      const positiveQuotePrompt = `Generate a positive and motivational quote`;
      const response = await axios.post(
        "https://whispering-thicket-03323-f95e6deef2d1.herokuapp.com/api/generate-positive-quote",
        {
          prompt: positiveQuotePrompt,
        }
      );

      console.log(response);

      const generatedQuote = response.data.generatedQuote;
      const newConversation = [
        ...conversation,
        { role: `assistant`, content: generatedQuote },
      ];
      setConversation(newConversation);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendMessage() {
    try {
      setIsLoading(true);

      console.log("Request to server:", { input, conversation });
      const updatedUserConversation = [
        ...conversation,
        { role: "user", content: input },
      ];

      setConversation(updatedUserConversation);

      const serverResponse = await axios.post(
        "https://whispering-thicket-03323-f95e6deef2d1.herokuapp.com/api/send-message",
        {
          input,
          conversation,
        }
      );

      console.log("Full server response:", serverResponse);

      const { response, conversation: updatedConversation } =
        serverResponse.data;

      console.log("Updated conversation from server:", updatedConversation);

      const newConversation = [
        ...updatedUserConversation,
        { role: "assistant", content: response },
      ];

      console.log("New conversation to be set:", newConversation);

      setConversation(newConversation);
      setResponse(response);
      setInput("");

      localStorage.setItem("conversation", JSON.stringify(newConversation));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  function handleDeleteMessages() {
    setConversation([]);
    setResponse("");
    setInput("");

    localStorage.removeItem("conversation");
  }
  return (
    <main className="flex min-h-screen text-white font-mono bg-sky-300 md:items-center md:flex-col md:justify-center">
      <div className="text-center md:flex md:flex-col md:items-center md:w-full md:gap-4">
        <div className="translate-x-8">
          <Image
            src={pandapal}
            alt="PandaPal Logo"
            className="h-fit w-fit md:h-1/3 md:w-full md:-translate-x-10 "
          />
        </div>
        {showIntro && (
          <div className=" md:flex md:flex-col md:items-center">
            <p>What´s on your mind today?</p>
            <Lottie
              className="md:w-1/3 -translate-x-5  "
              animationData={hipanda}
            />
            <button
              className="bg-[#F6AACB] hover:bg-pink-200 px-2 text-sm  mb-4 rounded-lg py-2"
              onClick={generatePositiveQuote}
            >
              Give me a positive quote
            </button>
          </div>
        )}
        {!showIntro && (
          <>
            <button
              className="bg-pink-400 hover:bg-pink-500 px-4 mb-4 rounded-lg py-2"
              onClick={handleDeleteMessages}
            >
              Delete Messages
            </button>
            <div className="flex flex-col items-start justify-evenly">
              <div className="flex flex-col justify-start gap-2">
                {conversation &&
                  conversation.map((message, index) => (
                    <ConversationLine
                      key={index}
                      role={getDisplayRole(message.role)}
                      content={message.content}
                    />
                  ))}

                {isLoading && (
                  <div>
                    <Image
                      src={thinking}
                      alt="Thinking Image"
                      width={90}
                      height={120}
                      className={`loading-image ${isLoading ? "animate" : ""}`}
                    />
                    <p>Loading.....</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col md:flex-row w-full justify-center p-6 items-center gap-2  md:translate-x-12">
          <textarea
            className="text-black px-5 md:w-96 w-60 py-2 rounded-xl resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-pink-300 hover:bg-pink-200 px-4 rounded-xl py-2 md:px-8"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
