import { Idx } from "../../constant";



interface OptionProps {
  value: string;
  idx: number;
  handleClick?: (value: string) => void;
  trueAnswer: string;
  userAnswer?: { answer: string } | null;
  summary: boolean;
}

function Option({ value, idx, handleClick, trueAnswer, userAnswer, summary } : OptionProps) {
  return (
    <div
      style={
        userAnswer?.answer !== trueAnswer &&
          userAnswer?.answer === value &&
          summary
          ? {
            background: "rgb(254 202 202 / 1)",
            color: "rgb(180 62 62 / 1)",
          }
          : {}
      }
      className={`flex items-center space-x-3 mb-5 text-neutral-600 bg-neutral-200/50 rounded-full py-3 px-3  text-xs md:text-sm active:text-neutral-50 active:bg-primary-500  ${!summary &&
        "md:hover:bg-primary-500 md:hover:text-neutral-50 cursor-pointer"
        } ${trueAnswer === value && summary
          ? "bg-success-100 text-success-700 font-semibold"
          : "font-medium "
        }`}
      onClick={() => handleClick && handleClick(value)}
    >
      <p>{Idx[idx]}.</p>

      <p>{value}</p>
    </div>
  );
}

export default Option;
