import { Table } from "./Table";
import { Plan, Recipe } from "../util/plan";
import { formatPlainDate } from "../util/formatPlainDate";

type Report = {
  [date: string]: {
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
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

    const recipes = meal.recipes.map((id) => plan.recipes[id]);

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
    <ul className="list-disc list-inside">
      {recipes.map(({ name }) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export function Summary({ plan }: { plan: Plan }) {
  const byDateAndMeal = getByDateAndMeal(plan);

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Th className="w-40">Date</Table.Th>
          <Table.Th>Breakfast</Table.Th>
          <Table.Th>Lunch</Table.Th>
          <Table.Th>Dinner</Table.Th>
          <Table.Th className="w-28 text-right">Cal</Table.Th>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(getByDateAndMeal(plan))
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, meals], i) => (
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
              <Table.Td className="text-right">
                {Math.round(meals.totalCal)}
              </Table.Td>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
}
