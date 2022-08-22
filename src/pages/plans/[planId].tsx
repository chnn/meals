import { Fragment } from "react";
import type { GetServerSideProps, NextPage } from "next";

import { Summary } from "../../components/Summary";
import { Recipe } from "../../components/Recipe";
import { ShoppingList } from "../../components/ShoppingList";

import { fetchPlan } from "../../util/plan";
import type { Plan, Recipe as RecipeT } from "../../util/plan";
import { formatPlainDate } from "../../util/formatPlainDate";

function anchorForRecipe(recipe: RecipeT): string {
  return recipe.name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s/g, "-")
    .toLowerCase();
}

function Header({
  level,
  id,
  children,
  className = "",
}: {
  level: 1 | 2 | 3;
  id?: string;
  children: any;
  className?: string;
}) {
  if (level === 1) {
    return (
      <h1 id={id} className={`text-4xl px-5 pb-5 pt-8 first:pt-0 ${className}`}>
        {id ? <a href={`#${id}`}>{children}</a> : children}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 id={id} className={`text-3xl px-5 pb-5 pt-8 first:pt-0 ${className}`}>
        {id ? <a href={`#${id}`}>{children}</a> : children}
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3
        id={id}
        className={`text-xl px-5 pb-5 font-semibold pt-8 first:pt-0 ${className}`}
      >
        {id ? <a href={`#${id}`}>{children}</a> : children}
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

  const recipes = [...recipeIds]
    .map((recipeId) => plan.recipes[recipeId])
    .filter((r) => !r.trivial)
    .sort((a, b) => a.name.localeCompare(b.name));

  const dates = Object.values(plan.meals)
    .map((m) => m.date)
    .sort();
  const earliestDate = dates[0];
  const latestDate = dates[dates.length - 1];

  return (
    <div className="">
      <Header level={1} className="mt-5">
        Meal Plan
        <div className="text-xl mt-3">
          {plan.name ? `${plan.name}, ` : ""}
          {formatPlainDate(earliestDate)} &ndash; {formatPlainDate(latestDate)}
        </div>
      </Header>
      <ul className="list-disc list-inside px-5">
        <li>
          <TocLink href="#summary">Summary</TocLink>
        </li>
        <li>
          <TocLink href="#shopping-list">Shopping List</TocLink>
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
      <Header level={2} id="shopping-list">
        Shopping List
      </Header>
      <ShoppingList plan={plan} />
      <Header level={2} id="recipes">
        Recipes
      </Header>
      {recipes.map((r) => (
        <Fragment key={r.name}>
          <Header level={3} id={anchorForRecipe(r)} className="pb-1">
            {r.name}
          </Header>
          <div className="uppercase text-xs font-medium bg-indigo-50 text-slate-800 py-0.5 px-1 rounded-lg inline-block ml-5">
            {r.servings} serving
          </div>
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
