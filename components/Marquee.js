import { MARQUEE } from '@/lib/content';

const ROW2 = ['Reels', 'Edits', 'Colour Grade', 'Direction', 'Sound Design', 'Storytelling', 'Hyderabad'];

function Row({ items, sep }) {
  const line = (
    <span>
      {items.map((t, i) => (
        <span key={i}>
          {t} <i>{sep}</i>{' '}
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {line}
        {line}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <>
      <Row items={MARQUEE} sep="✦" />
      <Row items={ROW2} sep="●" />
    </>
  );
}
