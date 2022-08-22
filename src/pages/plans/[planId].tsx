import { Fragment } from "react";
import type { GetServerSideProps, NextPage } from "next";

import { Summary } from "../../components/Summary";
import { Recipe } from "../../components/Recipe";
import { ShoppingList } from "../../components/ShoppingList";

import { fetchPlan } from "../../util/plan";
import type { Plan } from "../../util/plan";

function Header({ level, children }: { level: 2 | 3; children: string }) {
  if (level === 2) {
    return <h2 className="text-3xl pb-5 pt-8 first:pt-0">{children}</h2>;
  }

  if (level === 3) {
    return (
      <h3 className="text-xl pb-5 font-semibold pt-8 first:pt-0">{children}</h3>
    );
  }

  throw new Error("not implemented");
}

const PlanPage: NextPage<{ plan: Plan }> = ({ plan }) => {
  const recipeIds = new Set(
    Object.values(plan.meals).flatMap((meal) => meal.recipes)
  );

  const recipes = [...recipeIds].map((recipeId) => plan.recipes[recipeId]);

  return (
    <div className="p-5">
      <Header level={2}>Summary</Header>
      <Summary plan={plan} />
      <Header level={2}>Shopping List</Header>
      <ShoppingList plan={plan} />
      <Header level={2}>Recipes</Header>
      <p>Each recipe is for 1 serving.</p>
      {recipes
        .filter((r) => !r.trivial)
        .map((r) => (
          <Fragment key={r.name}>
            <Header level={3}>{r.name}</Header>
            <Recipe recipe={r} plan={plan} />
          </Fragment>
        ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const plan = await fetchPlan(context.params?.planId as string);

  return { props: { plan } };
};

export default PlanPage;
