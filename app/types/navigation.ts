export type RouteParamList = {
  HomeStack: undefined;
  Home: undefined;
  NewEntry: undefined;

  Analytics: undefined;
  Tracker: undefined;
};

const RouteName = {
  HomeStack: "HomeStack",
  Home: "Home",
  NewEntry: "NewEntry",
  
  Analytics: "Analytics",
  Tracker: "Tracker",
} as const;
export default RouteName;
