import { Fragment } from "react";
import type { GetServerSideProps, NextPage } from "next";

import { Summary } from "../../components/Summary";
import { Recipe } from "../../components/Recipe";
import { ShoppingList } from "../../components/ShoppingList";

import { fetchPlan } from "../../util/plan";
import type { Plan, Recipe as RecipeT } from "../../util/plan";
import { Badge } from "../../components/Badge";

function anchorForRecipe(recipe: RecipeT): string {
  return recipe.name.replace(/\s/g, "");
}

function Header({
  level,
  id,
  children,
  className = "",
}: {
  level: 2 | 3;
  id?: string;
  children: any;
  className?: string;
}) {
  if (level === 2) {
    return (
      <h2 id={id} className={`text-3xl px-5 pb-5 pt-8 first:pt-0 ${className}`}>
        {children}
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3
        id={id}
        className={`text-xl px-5 pb-5 font-semibold pt-8 first:pt-0 ${className}`}
      >
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
    <div className="">
      <ul className="list-disc list-inside p-5">
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
      {recipes
        .filter((r) => !r.trivial)
        .map((r) => (
          <Fragment key={r.name}>
            <Header
              level={3}
              id={anchorForRecipe(r)}
              className="flex items-center"
            >
              <Badge className="text-xs mr-3 flex-shrink-0">1 serving</Badge>{" "}
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
