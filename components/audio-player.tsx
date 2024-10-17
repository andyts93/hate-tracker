import { useRef, useState } from "react";
import { IoStopSharp, IoPlaySharp } from "react-icons/io5";

interface AudioPlayerProps {
  src?: string;
  blobDuration?: number;
}

export default function AudioPlayer({ src, blobDuration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(blobDuration || 0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  const onLoadMetadata = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;

      if (!isNaN(audioDuration) && audioDuration !== Infinity) {
        setDuration(audioDuration);
      }
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (event.target.valueAsNumber / 100) * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-start space-x-2 h-full">
      <button onClick={togglePlay}>
        {isPlaying ? <IoStopSharp /> : <IoPlaySharp />}
      </button>
      <div className="flex flex-col">
        <input
          className="bg-red-500 h-2 accent-black"
          type="range"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
        />
        <div className="flex justify-between text-xs mt-1 font-light">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        className="hidden"
        preload="metadata"
        src={src}
        onDurationChange={onLoadMetadata}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={onLoadMetadata}
        onTimeUpdate={onTimeUpdate}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}
