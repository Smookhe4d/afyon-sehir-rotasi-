import {routes as sourceRoutes} from "./routes";
import {placeListFull as sourcePlaces} from "./placesFull";
import {badgeDefs as sourceBadges} from "./badges";
import type {Place, Route} from "./types";
import type {Locale} from "@/i18n/routing";
import enContent from "@/messages/content/en.json";
import en from "@/messages/en.json";
import tr from "@/messages/tr.json";

const routeTranslations = enContent.routes as Record<string, Partial<Route> & {stopNotes?: Record<string, string>}>;
const placeTranslations = enContent.places as Record<string, Partial<Place>>;
const englishRoutes: Route[] = sourceRoutes.map(route => ({...route, ...routeTranslations[route.slug],
  stops: route.stops.map(stop => ({...stop, ...(stop.note ? {note: routeTranslations[route.slug]?.stopNotes?.[stop.placeId] ?? stop.note} : {})}))}));
const englishPlaces: Place[] = sourcePlaces.map(place => ({...place, ...placeTranslations[place.id]}));
const englishPlaceMap = Object.fromEntries(englishPlaces.map(place => [place.id, place]));
const turkishPlaceMap = Object.fromEntries(sourcePlaces.map(place => [place.id, place]));

export function getContent(locale: Locale) {
  const messages = locale === "en" ? en : tr;
  const routes = locale === "en" ? englishRoutes : sourceRoutes;
  const placeListFull = locale === "en" ? englishPlaces : sourcePlaces;
  const placesFull = locale === "en" ? englishPlaceMap : turkishPlaceMap;
  const getPlace = (id: string) => placesFull[id];
  return {locale, routes, getRoute: (slug: string) => routes.find(route => route.slug === slug),
    routeStops: (route: Route) => route.stops.map(stop => ({...stop, place: getPlace(stop.placeId)})),
    placeListFull, placeList: placeListFull, placesFull, places: placesFull, getPlace,
    categoryLabels: messages.labels.categories, scopeLabels: messages.labels.scopes,
    modeLabels: messages.labels.modes, difficultyLabels: messages.labels.difficulty,
    badgeDefs: sourceBadges.map(badge => ({...badge, ...messages.badges[badge.id as keyof typeof messages.badges]}))};
}
