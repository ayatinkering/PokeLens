import { useEffect, useState } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils/index'
import TypeCard from './TypeCard'
import Modal from './Modal'

export default function PokeCard(props) {
    const {selectedPokemon,closeModal,} = props;

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    const { name, height, abilities, stats, types, moves } = data || {}

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }

        // check cache for move
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('Found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) { return }
        // check if the selected pokemon information is available in the cache
        // 1. define the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        // 2. check if the selected pokemon is in the cache, otherwise fetch from the API

        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache')
            return
        }

        // we passed all the cache stuff to no avail and now need to fetch the data from the api

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log('Fetched pokemon data')
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

        // if we fetch from the api, make sure to save the information to the cache for next time
    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }


    return (
  <Modal handleCloseModal={closeModal}>
    <div
      className="
        bg-zinc-950
        border
        border-zinc-700
        rounded-2xl
        w-[1200px]
        h-[700px]
        p-8
        flex
        gap-10
      "
    >

      {/* LEFT */}

      <div className="w-1/2 relative">

        <img
          src="/pokedex.png"
          alt="pokedex"
          className="w-full"
        />

        <img
  src={
    data.sprites.other.home.front_default
    ||
    data.sprites.other["official-artwork"].front_default
  }
  alt={name}
  className="
    absolute
    top-[110px]
    left-[80px]
    w-[240px]
  "
/>

        <p
          className="
            absolute
            bottom-[92px]
            left-[145px]
            text-black
            font-bold
            text-lg
          "
        >
          {name}
        </p>

      </div>

      {/* RIGHT */}

      <div className="w-1/2 overflow-y-auto">

        <p className="text-zinc-500">
          #{getFullPokedexNumber(selectedPokemon)}
        </p>

        <h2 className="text-4xl font-bold mb-4">
          {name}
        </h2>

        <div className="flex gap-2 mb-8">
          {types.map((typeObj, index) => (
            <TypeCard
              key={index}
              type={typeObj.type.name}
            />
          ))}
        </div>

        <h3 className="text-xl font-bold mb-4">
          Stats
        </h3>

        <div className="space-y-3 mb-8">
          {stats.map((statObj) => (
            <div
              key={statObj.stat.name}
              className="
                flex
                justify-between
                border-b
                border-zinc-800
                pb-2
              "
            >
              <p>
                {statObj.stat.name}
              </p>

              <p>
                {statObj.base_stat}
              </p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold mb-4">
          Moves
        </h3>

        <div
          className="
            grid
            grid-cols-2
            gap-2
          "
        >
          {moves.slice(0, 40).map((moveObj) => (
            <button
              key={moveObj.move.name}
              onMouseEnter={() =>
                fetchMoveData(
                  moveObj.move.name,
                  moveObj.move.url
                )
              }
              className="
                bg-zinc-900
                px-3
                py-2
                rounded-lg
                text-left
              "
            >
              {moveObj.move.name}
            </button>
          ))}
        </div>

        {skill && (
          <div
            className="
              mt-6
              p-4
              border
              border-zinc-700
              rounded-xl
            "
          >
            <h4 className="font-bold mb-2">
              {skill.name}
            </h4>

            <p className="text-zinc-300">
              {skill.description}
            </p>
          </div>
        )}

      </div>

    </div>
  </Modal>
);
}