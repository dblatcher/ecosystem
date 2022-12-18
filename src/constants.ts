export enum Action {
  searchForFood,
  goToFood,
  eat,
  layEgg,
  wander,
}

export const actionToString = (action: Action): string => {
  switch (action) {
    case Action.searchForFood:
      return "searchForFood";
    case Action.goToFood:
      return "goToFood";
    case Action.eat:
      return "eat";
    case Action.layEgg:
      return "layEgg";
    case Action.wander:
      return "wander";
  }
};
