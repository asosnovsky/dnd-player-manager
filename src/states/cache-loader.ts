import { load } from "@/cache";
import { games } from '@/db';
import { genGameId, joinGame } from '@/states/methods';
import { goTo, PAGES } from '@/components/router/history';
import Notifier from '@/components/layouts/Notifier';

(async () => {

    const c_gameId = load("gameId");
    const c_userKey = load("userKey");
    
    if (c_gameId) {
        Notifier.notify("Detected existing session...")
        Notifier.notify("Attempting to load...", 500)
        try {
            if ( c_userKey === "host" ) {
                await genGameId(games.child(c_gameId));
            }   else    {
                await joinGame(c_gameId, c_userKey);
            }
            goTo(PAGES.GAME_OVERVIEW)
        }   catch (e) {
            console.error(e);
            Notifier.notify("Failed to load saved session...");
            goTo(PAGES.HOME)
        }
    }
})()