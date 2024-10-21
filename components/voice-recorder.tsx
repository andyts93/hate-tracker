import { useEffect, useRef, useState } from "react";
import { MdSettingsVoice } from "react-icons/md";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { IoStopSharp } from "react-icons/io5";

import AudioPlayer from "./audio-player";

interface VoiceRecorderProps {
  className?: string;
  onRecorded: (audioUrl: string | undefined) => void;
}

export default function VoiceRecorder({
  className,
  onRecorded,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>(new Array<Blob>());
  const [seconds, setSeconds] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      setAudioUrl(undefined);
      setSeconds(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });

        setAudioUrl(URL.createObjectURL(audioBlob));
        if (intervalRef.current) clearInterval(intervalRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    onRecorded(audioUrl || undefined);
  }, [audioUrl]);

  return (
    <div className={className}>
      <div className="flex items-center justify-end gap-4">
        <div className="flex-1 h-[30px]">
          {audioUrl ? (
            <AudioPlayer blobDuration={seconds} src={audioUrl} />
          ) : isRecording && mediaRecorderRef.current ? (
            <LiveAudioVisualizer
              height={30}
              mediaRecorder={mediaRecorderRef.current}
              width={300}
            />
          ) : (
            <p className="flex items-center h-full">Add an audio note</p>
          )}
        </div>
        <button
          className="rounded-full p-1"
          style={{ backgroundColor: isRecording ? "red" : "green" }}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <IoStopSharp /> : <MdSettingsVoice />}
        </button>
      </div>
    </div>
  );
}
