export default function VideoEmbed({ title, src }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200">
      <iframe
        title={title}
        src={src}
        className="h-[320px] w-full"
        allow="fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
