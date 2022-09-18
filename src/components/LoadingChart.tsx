export const LoadingChart = ({pulse = false, text}: {pulse?: boolean, text: string}) => {
  return (
    <div className={`w-full h-[400px] bg-slate-50 flex justify-center items-center ${pulse ? 'animate-pulse' : ''}`}>
      <div className="uppercase text-slate-300 font-semibold text-sm">{text}</div>
    </div>
  );
};
