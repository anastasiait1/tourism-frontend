type PlaceholderPageProps = { title: string };

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <p className="eyebrow">GETAWAYMAP</p>
      <h1>{title}</h1>
      <p>Этот экран будет реализован на следующем этапе разработки.</p>
    </section>
  );
}
