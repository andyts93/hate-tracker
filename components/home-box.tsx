interface HomeBoxProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function HomeBox({ title, description, icon }: HomeBoxProps) {
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg shadow-brutal shadow-gray-900/40 gap-4">
      <div className="flex justify-start mb-8">
        <div className="p-6 rounded-2xl shadow-brutal-sm shadow-slate-800 bg-black">
          {icon}
        </div>
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-slate-300 text-md font-light">{description}</p>
    </div>
  );
}
