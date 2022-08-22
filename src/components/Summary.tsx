import { Temporal } from "temporal-polyfill";

import { Table } from "./Table";
import { Plan } from "../util/plan";

const DAY_LABELS: Record<number, string> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

const MONTH_LABELS: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const formatPlainDate = (isoString: string): string => {
  const plainDate = Temporal.PlainDate.from(isoString);
  const formattedDate = `${DAY_LABELS[plainDate.dayOfWeek]}, ${
    MONTH_LABELS[plainDate.month]
  } ${plainDate.day}`;

  return formattedDate;
};

function getByDateAndMeal(plan: Plan): {
  [date: string]: { [meal: string]: Array<{ name: string; servings: number }> };
} {
  const result: ReturnType<typeof getByDateAndMeal> = {};

  for (const meal of Object.values(plan.meals)) {
    if (!result[meal.date]) {
      result[meal.date] = {};
    }

    if (!result[meal.date][meal.meal]) {
      result[meal.date][meal.meal] = [];
    }

    const recipeTitles = meal.recipes
      .map((id) => plan.recipes[id])
      .map((r) => ({ name: r.name, servings: meal.servings }));

    result[meal.date][meal.meal].push(...recipeTitles);
    result[meal.date][meal.meal].sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

export function Summary({ plan }: { plan: Plan }) {
  const byDateAndMeal = getByDateAndMeal(plan);

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Th className="w-40">Date</Table.Th>
          <Table.Th className="w-1/4">Breakfast</Table.Th>
          <Table.Th className="w-1/4">Lunch</Table.Th>
          <Table.Th className="w-1/4">Dinner</Table.Th>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(getByDateAndMeal(plan))
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, meals], i) => (
            <Table.Row key={date}>
              <Table.Td>{formatPlainDate(date)}</Table.Td>
              <Table.Td>
                <ul className="list-disc">
                  {meals.breakfast?.map(({ name, servings }) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </Table.Td>
              <Table.Td>
                <ul className="list-disc">
                  {meals.lunch?.map(({ name, servings }) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </Table.Td>
              <Table.Td>
                <ul className="list-disc">
                  {meals.dinner?.map(({ name, servings }) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </Table.Td>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
}
