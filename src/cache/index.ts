
const NAMESPACE = "rpg.v1";

interface CachedData {
    gameId: string;
    userKey: string;
}

let cache: Partial<CachedData> = {};

try {
    cache = JSON.parse(localStorage.getItem(NAMESPACE)) || {}
} catch (e) {}

console.log(cache)

export function save<Key extends keyof CachedData>(key: Key, value: CachedData[Key]) {
    cache[key] = value;
    localStorage.setItem(NAMESPACE, JSON.stringify(cache));
}

export function load<Key extends keyof CachedData>(key: Key, isObj: boolean = false): CachedData[Key] | null {
    return key in cache ? cache[key] : null;
}