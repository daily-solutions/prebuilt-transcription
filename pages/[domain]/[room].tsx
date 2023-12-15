// pages/[domain]/[room].tsx
import DailyIframe, {
  DailyCall,
  DailyEventObjectAppMessage,
  DailyEventObjectFatalError,
} from "@daily-co/daily-js";
import { useRef } from "react";
import type { NextPage } from "next";
import CallFrame from "../../components/CallFrame";
import Head from "next/head";
import Header from "../../components/Header";
import styles from "../../styles/Room.module.css";
import Transcription from "../../components/Transcription";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export interface transcriptMsg {
  name: string;
  text: string;
  timestamp: string;
}

const Room: NextPage = ({ }) => {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [callFrame, setCallFrame] = useState<DailyCall>();
  const callFrameRef = useRef<DailyCall | null>(null);

  const [newMsg, setNewMsg] = useState<transcriptMsg>({
    name: "",
    text: "",
    timestamp: "",
  });
  const [error, setError] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      const domain = router.query.domain;
      const room = router.query.room;
      const t = router.query.t;

      if (domain && room) {
        let url: string = `https://${domain}.daily.co/${room}`;
        const hasToken: boolean = t ? true : false;
        setHasToken(hasToken);
        if (t) {
          url += `?t=${t}`;
        }
        setUrl(url);
        startCall(url);

      }
    }
  }, [router.isReady]);

  const startCall = useCallback((url: string) => {
    if (!callFrameRef.current) {
      const iframe = document.getElementById("callFrame");
      const newCallFrame = DailyIframe.wrap(iframe as HTMLIFrameElement, {
        showLeaveButton: true,
      });
      callFrameRef.current = newCallFrame;
      setCallFrame(newCallFrame);

      newCallFrame.join({
        url: url,
      });

      newCallFrame.on("error", (ev: DailyEventObjectFatalError | undefined) => {
        setError(ev?.errorMsg ?? "Something went wrong");
      });

      newCallFrame.on("joined-meeting", (ev) => {
        let ownerCheck = ev?.participants.local.owner as boolean;
        setIsOwner(ownerCheck);
      });

      newCallFrame.on("transcription-started", () => {
        console.log("transcription has started")
        setIsTranscribing(true);
      });

      newCallFrame.on("transcription-stopped", () => {
        console.log("transcription has stopped")
        setIsTranscribing(false);
      });

      newCallFrame.on("transcription-error", (ev) => {
        console.log("! transcription error = ", ev)
      });

      newCallFrame.on(
        "app-message",
        (msg: DailyEventObjectAppMessage | undefined) => {
          const data = msg?.data;
          if (msg?.fromId === "transcription" && data?.is_final) {
            const local = newCallFrame.participants().local;
            const name: string =
              local.session_id === data.session_id
                ? local.user_name
                : newCallFrame.participants()[data.session_id].user_name;
            const text: string = data.text;
            const timestamp: string = data.timestamp;

            if (name.length && text.length && timestamp.length) {
              setNewMsg({ name, text, timestamp });
            }
            setIsTranscribing(true);
          }
        }
      );
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>🎙️ Daily Prebuilt + Transcription 🎙️</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header
        error={error}
        isTranscribing={isTranscribing}
        owner={isOwner}
        token={hasToken}
      />
      <main className={styles.main}>
        <div className={styles.callFrameContainer}>
          <CallFrame />
        </div>
        <div className={styles.transcription}>
          <Transcription
            callFrame={callFrame}
            newMsg={newMsg}
            owner={isOwner}
            isTranscribing={isTranscribing}
          />
        </div>
      </main>
    </div>
  );
};

export default Room;