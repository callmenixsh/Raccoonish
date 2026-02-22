export default function SecretButtons({ buttonStates, handleButtonClick }) {
  const colors = [
    'bg-teal-300',
    'bg-violet-300',
    'bg-lime-300',
    'bg-indigo-300',
    'bg-amber-300',
    'bg-emerald-300',
    'bg-rose-300',
    'bg-fuchsia-300',
    'bg-cyan-300',
  ];
  const leverRadius = [
    'rounded-tl-2xl', 'rounded-none', 'rounded-tr-2xl',
    'rounded-none', 'rounded-none', 'rounded-none',
    'rounded-bl-2xl', 'rounded-none', 'rounded-br-2xl',
  ];
  return (
    <div className="grid grid-cols-3 mb-8 w-fit">
      {buttonStates.slice(0, 9).map((active, idx) => (
        <button
          key={idx}
          className={`w-20 h-20 border-2 border-slate-400 transition font-bold text-lg shadow-lg ${active ? colors[idx % colors.length] : 'bg-white dark:bg-black'} ${leverRadius[idx]} hover:scale-105`}
          onClick={() => {
            try { new Audio('/click.wav').play(); } catch(e) {}
            handleButtonClick(idx);
          }}
          aria-label={`Lever ${idx+1}`}
        >
        </button>
      ))}
    </div>
  );
}