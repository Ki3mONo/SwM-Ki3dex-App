import type { Pokemon, PokemonSpecies } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

interface PokemonListResponse {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
}

export interface PaginatedPokemons {
  pokemons: Pokemon[];
  next: string | null;
}

export async function fetchPokemonList(nextUrl?: string): Promise<PaginatedPokemons> {
  const url = nextUrl ?? `${BASE_URL}/pokemon?limit=20&offset=0`;
  const listRes = await fetch(url);
  if (!listRes.ok) throw new Error(`List fetch failed ${listRes.status}`);
  const { results, next } = (await listRes.json()) as PokemonListResponse;

  const pokemons: Pokemon[] = await Promise.all(
    results.map(async ({ name, url }) => {
      const detailRes = await fetch(url);
      if (!detailRes.ok) throw new Error(`Detail fetch failed for ${name}`);
      const detail = await detailRes.json();

      let sprite = detail.sprites.front_default;
      if (!sprite) {
        sprite = detail.sprites.other?.['official-artwork']?.front_default || '';
      }

      return {
        id: detail.id,
        name: detail.name,
        types: detail.types.map((t: any) => t.type.name),
        sprites: { front_default: sprite },
        height: detail.height,
        weight: detail.weight,
        species: detail.species,
      };
    })
  );

  return { pokemons, next };
}

export async function fetchPokemonDetail(id: string): Promise<{ pokemon: Pokemon; species: PokemonSpecies }> {
  const pokemonRes = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!pokemonRes.ok) throw new Error(`Pokemon fetch failed ${pokemonRes.status}`);
  const pokemon = await pokemonRes.json();

  const speciesRes = await fetch(pokemon.species.url);
  if (!speciesRes.ok) throw new Error(`Species fetch failed ${speciesRes.status}`);
  const species = await speciesRes.json();

  let sprite = pokemon.sprites.front_default;
  if (!sprite) {
    sprite = pokemon.sprites.other?.['official-artwork']?.front_default || '';
  }

  const formattedPokemon: Pokemon = {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((t: any) => t.type.name),
    sprites: { 
      front_default: sprite,
      other: pokemon.sprites.other 
    },
    height: pokemon.height,
    weight: pokemon.weight,
    species: pokemon.species,
  };

  return { pokemon: formattedPokemon, species };
}
