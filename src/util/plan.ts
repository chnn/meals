import airtable from "airtable";

export type Meal = {
  date: string;
  meal: "breakfast" | "lunch" | "dinner";
  recipes: string[];
  servings: number;
};

export type Recipe = {
  name: string;
  ingredients: string[];
  trivial: boolean;
  servings: number;
};

export type Ingredient = {
  name: string;
  quantity: number | null;
  units: string | null;
  kcal: number | null;
  comment: string;
  nonShopping: boolean;
};

export type Plan = {
  name: string | null;
  meals: { [mealId: string]: Meal };
  recipes: { [recipeId: string]: Recipe };
  ingredients: { [ingredientId: string]: Ingredient };
};

const MEAL_DEFAULTS = {
  servings: 0,
  recipes: [],
};

const RECIPE_DEFAULTS = {
  ingredients: [],
};

const INGREDIENT_DEFAULTS = {
  quantity: null,
  units: null,
  nonShopping: false,
};

export async function fetchPlan(planId: string): Promise<Plan> {
  const base = airtable.base(process.env.AIRTABLE_BASE!);

  const planResp = await base.table("plans").find(planId);

  const mealsResp = await base
    .table("meals")
    .select({ filterByFormula: `plan_id = '${planId}'` })
    .firstPage();

  const meals = mealsResp.reduce(
    (acc, val) => ({
      ...acc,
      [val.id]: {
        id: val.id,
        ...MEAL_DEFAULTS,
        ...val.fields,
      },
    }),
    {}
  );

  // TODO: Fetch just the recipes and ingredients used by the current plan ID
  const recipesResp = await base.table("recipes").select().firstPage();
  const recipes = recipesResp.reduce(
    (acc, val) => ({
      ...acc,
      [val.id]: {
        id: val.id,
        ...RECIPE_DEFAULTS,
        ...val.fields,
      },
    }),
    {}
  );

  const ingredientsResp = await base.table("ingredients").select().firstPage();
  const ingredients = ingredientsResp.reduce(
    (acc, val) => ({
      ...acc,
      [val.id]: {
        id: val.id,
        ...INGREDIENT_DEFAULTS,
        ...val.fields,
        nonShopping: !!val.fields["non_shopping"],
      },
    }),
    {}
  );

  return {
    name: (planResp.fields.name as string | void) || null,
    meals,
    recipes,
    ingredients,
  };
}
