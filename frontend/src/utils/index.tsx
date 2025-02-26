import dayjs, { Dayjs } from "dayjs";

export function getTimeByMs(time: string | number | Date | Dayjs) {
  const currTime = dayjs();
  const futTIme = dayjs(time);

  if (currTime.isAfter(futTIme)) return;

  return {
    minutes: getMinuteByMs(currTime, futTIme),
    seconds: getSecondByMs(currTime, futTIme),
  };
}

function getSecondByMs(currTime: Dayjs, futTime: Dayjs): number {
  const timeDif = futTime.diff(currTime, "second") % 60;
  return timeDif;
}

function getMinuteByMs(currTime: Dayjs, futTime: Dayjs): number {
  return futTime.diff(currTime, "minute");
}
