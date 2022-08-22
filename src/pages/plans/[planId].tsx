import { Fragment } from "react";
import type { GetServerSideProps, NextPage } from "next";

import { Summary } from "../../components/Summary";
import { Recipe } from "../../components/Recipe";
import { ShoppingList } from "../../components/ShoppingList";

import { fetchPlan } from "../../util/plan";
import type { Plan, Recipe as RecipeT } from "../../util/plan";

function anchorForRecipe(recipe: RecipeT): string {
  return recipe.name.replace(/\s/g, "");
}

function Header({
  level,
  id,
  children,
}: {
  level: 2 | 3;
  id?: string;
  children: string;
}) {
  if (level === 2) {
    return (
      <h2 id={id} className="text-3xl pb-5 pt-8 first:pt-0">
        {children}
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3 id={id} className="text-xl pb-5 font-semibold pt-8 first:pt-0">
        {children}
      </h3>
    );
  }

  throw new Error("not implemented");
}

function TocLink({
  href,
  children,
}: {
  href: string;
  children: string | JSX.Element;
}) {
  return (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      {children}
    </a>
  );
}

const PlanPage: NextPage<{ plan: Plan }> = ({ plan }) => {
  const recipeIds = new Set(
    Object.values(plan.meals).flatMap((meal) => meal.recipes)
  );

  const recipes = [...recipeIds].map((recipeId) => plan.recipes[recipeId]);

  return (
    <div className="p-5">
      <ul className="list-disc list-inside">
        <li>
          <TocLink href="#summary">Summary</TocLink>
        </li>
        <li>
          <TocLink href="#shoppingList">Shopping List</TocLink>
        </li>
        <li>
          <TocLink href="#recipes">Recipes</TocLink>
          <ul className="list-disc list-inside pl-8">
            {recipes.map((r) => (
              <li key={r.name}>
                <TocLink href={`#${anchorForRecipe(r)}`}>{r.name}</TocLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <Header level={2} id="summary">
        Summary
      </Header>
      <Summary plan={plan} />
      <Header level={2} id="shoppingList">
        Shopping List
      </Header>
      <ShoppingList plan={plan} />
      <Header level={2} id="recipes">
        Recipes
      </Header>
      <p>Each recipe is for 1 serving.</p>
      {recipes
        .filter((r) => !r.trivial)
        .map((r) => (
          <Fragment key={r.name}>
            <Header level={3} id={anchorForRecipe(r)}>
              {r.name}
            </Header>
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
