import { Plan, Recipe } from "../util/plan";
import { Amount } from "./Amount";
import { Table } from "./Table";

export function Recipe({ recipe, plan }: { recipe: Recipe; plan: Plan }) {
  const ingredients = recipe.ingredients.map((id) => plan.ingredients[id]);

  const totalCalories = ingredients.reduce(
    (acc, { kcal }) => acc + (kcal || 0),
    0
  );

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Th className="w-28 text-right"></Table.Th>
          <Table.Th className="w-80">Ingredient</Table.Th>
          <Table.Th className="text-right">Cal</Table.Th>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ingredients.map((ingredient) => (
          <Table.Row key={ingredient.name}>
            <Table.Td className="text-right">
              <Amount quantity={ingredient.quantity} units={ingredient.units} />
            </Table.Td>
            <Table.Td>{ingredient.name}</Table.Td>
            <Table.Td className="text-right">{ingredient.kcal || ""}</Table.Td>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Td />
          <Table.Td />
          <Table.Td className="text-right">
            <span className="font-semibold">
              Total: {Math.round(totalCalories)}
            </span>
          </Table.Td>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}
