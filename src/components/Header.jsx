export default function Header() {
  return (
    <header className="mb-10 text-center">
      <img src="/heading.png" alt="PokéLens" className="mx-auto mt-12 wiggle-hover hover:cursor-pointer"/>

      <p className="mt-4 text-lg text-white pixel-font">
         your personal pokédex powered by PokéAPI.
      </p>
    </header>
  );
}