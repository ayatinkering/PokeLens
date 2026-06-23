import { pokemonTypeColors } from "../utils/index";

export default function TypeCard({ type }) {
  return (
    <div
      className="
        px-3
        py-1
        rounded-full
        text-xs
      "
      style={{
        color: pokemonTypeColors?.[type]?.color,
        background: pokemonTypeColors?.[type]?.background,
      }}
    >
      {type}
    </div>
  );
}