import { VisuallyHidden } from "react-aria";
import { Table } from "./Table";
import { Plan, Recipe } from "../util/plan";
import { formatPlainDate } from "../util/formatPlainDate";

type RecipeWithServings = Recipe & { servings: number };

type Report = {
  [date: string]: {
    breakfast: RecipeWithServings[];
    lunch: RecipeWithServings[];
    dinner: RecipeWithServings[];
    totalCal: number;
  };
};

function getByDateAndMeal(plan: Plan): Report {
  const result: ReturnType<typeof getByDateAndMeal> = {};

  for (const meal of Object.values(plan.meals)) {
    if (!result[meal.date]) {
      result[meal.date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        totalCal: 0,
      };
    }

    const recipes: RecipeWithServings[] = meal.recipes.map((id) => ({
      ...plan.recipes[id],
      servings: meal.servings,
    }));

    result[meal.date][meal.meal].push(...recipes);
    result[meal.date][meal.meal].sort((a, b) => a.name.localeCompare(b.name));
    result[meal.date].totalCal += recipes
      .flatMap((r) => r.ingredients)
      .map((id) => plan.ingredients[id])
      .reduce((acc, ing) => acc + (ing.kcal || 0), 0);
  }

  return result;
}

function MealList({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul>
      {recipes.map(({ name, servings }) => (
        <li key={name} className="flex items-center justify-start">
          <div className="uppercase font-medium bg-indigo-50 text-slate-700 px-1 text-xs rounded-lg mr-1 mt-[2px]">
            <span aria-hidden>{servings}&times;</span>
            <VisuallyHidden>{servings} servings</VisuallyHidden>
          </div>{" "}
          {name}
        </li>
      ))}
    </ul>
  );
}

export function Summary({ plan }: { plan: Plan }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Th className="w-40">Date</Table.Th>
          <Table.Th className="w-[22rem]">Breakfast</Table.Th>
          <Table.Th className="w-[22rem]">Lunch</Table.Th>
          <Table.Th className="w-[22rem]">Dinner</Table.Th>
          <Table.Th className="w-28" numeric>
            Cal
          </Table.Th>
          <Table.Th />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(getByDateAndMeal(plan))
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, meals]) => (
            <Table.Row key={date}>
              <Table.Td>{formatPlainDate(date, { dayOfWeek: true })}</Table.Td>
              <Table.Td>
                <MealList recipes={meals.breakfast} />
              </Table.Td>
              <Table.Td>
                <MealList recipes={meals.lunch} />
              </Table.Td>
              <Table.Td>
                <MealList recipes={meals.dinner} />
              </Table.Td>
              <Table.Td numeric>{Math.round(meals.totalCal)}</Table.Td>
              <Table.Td />
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
}
