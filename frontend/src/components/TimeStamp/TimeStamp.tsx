import { useEffect, useState } from "react";
import useQuestionStore from "../../data/GetData";
import { getTimeByMs } from "../../utils";
import { useNavigate } from "react-router-dom";

const defaultCountdown = {
  minutes: 0,
  seconds: 0,
};

function TimeStamp() {
  const [countDown, setCountDown] = useState<{ minutes: number; seconds: number }>(defaultCountdown);
  const [startTime, setStartTime] = useState(true);
  const { totalTime, setTimeStamp } = useQuestionStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!totalTime) {
      setTimeStamp(new Date(new Date().getTime() + 60 * 60000).getTime());
    }
  }, [totalTime, setTimeStamp]);

  useEffect(() => {
    let intervalId: number;
    if (startTime && totalTime) {
      intervalId = window.setInterval(() => {
        const timeNext = getTimeByMs(totalTime);

        if (timeNext) {
          setCountDown(timeNext);
        } else {
          clearInterval(intervalId);
          setStartTime(false);
          navigate("/finish");
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, totalTime, navigate]);

  return (
    <div className="mx-auto flex max-w-fit items-center space-x-3 text-neutral-700 ring-[1px] ring-neutral-400 rounded-lg p-3 text-xs font-semibold">
      <span>{String(countDown.minutes).padStart(2, "0")}</span>
      <span>Minutes</span>
      <span>{String(countDown.seconds).padStart(2, "0")}</span>
      <span>Seconds</span>
    </div>
  );
}

export default TimeStamp;
