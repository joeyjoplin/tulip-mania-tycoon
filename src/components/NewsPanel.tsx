interface NewsPanelProps {
  newsEvent: string;
}

export const NewsPanel = ({ newsEvent }: NewsPanelProps) => {
  if (!newsEvent) return null;

  return (
    <div className="pixel-border bg-accent/20 p-3 text-center animate-fade-in">
      <p className="text-xs">📰 {newsEvent}</p>
    </div>
  );
};
