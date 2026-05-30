import { useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MenuItem from './MenuItem';
import MenuFilters from './MenuFilters';
import { selectFilteredMenu } from './menuSlice';
import { getMenu } from '../../services/apiRestaurant';

export default function Menu() {
  const pizzas   = useLoaderData();
  const filtered = useSelector(selectFilteredMenu(pizzas));

  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <MenuFilters />

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-stone-500">
          Nenhuma pizza encontrada. Tente outros filtros. 🍕
        </p>
      )}

      <ul className="divide-y divide-stone-200">
        {filtered.map((pizza) => (
          <MenuItem pizza={pizza} key={pizza.id} />
        ))}
      </ul>
    </main>
  );
}

// ✅ Loader original do Jonas
export async function loader() {
  const pizzas = await getMenu();
  return pizzas;
}