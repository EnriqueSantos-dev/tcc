const samplePrompts = [
  "Como posso realizar minha matrícula?",
  "Como posso solicitar uma revisão de prova?",
  "Como acompanhar o status da minha matrícula?"
];

type EmptyChatScreenProps = {
  onSelectSamplePrompt: (value: string) => void;
};

export default function EmptyChatScreen({
  onSelectSamplePrompt
}: EmptyChatScreenProps) {
  return (
    <div className="grid h-full place-content-center space-y-6">
      <div className="col-span-3 flex flex-col items-center justify-center">
        <h2 className="text-center text-xl font-semibold text-foreground">
          Bem-vindo ao Chatbot SIGAA
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {samplePrompts.map((prompt) => (
          <button
            key={prompt}
            className="ring-primary-500 flex items-center justify-center space-x-2 rounded-lg bg-neutral-800 p-4 text-center text-sm font-medium text-foreground shadow-sm hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            onClick={() => onSelectSamplePrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
