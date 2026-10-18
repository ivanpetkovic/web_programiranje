# Displej sobe mašina prati kutiju pushom koji čas ne imenuje

Oba displeja stoje na statičkom sajtu. Displej sobe mašina pokazuje trenutnu temperaturu kutije. Displej sobe prekidača menja se tek čitanjem, pa se razilaze dok se ne pritisne „Pročitaj”.

Browser može da crta trenutnu vrednost samo ako je dobije. Kutija zato šalje stranici temperaturu i režim jednosmernim pushom. Taj dovod puni displej sobe mašina i kretanje lopatica. Displej sobe prekidača ga ne čita. SSE je dovoljan jer je smer jedan. WebSocket bi bio isti skelet, a crtežu ne treba drugi smer.

Čas taj dovod ne imenuje. U Network panelu za gradivo gledaju se čitanje i komanda. Push jeste veza browsera ka kutiji, pa DevTools ima i njen red; čas na njega ne pokazuje. Na času 8 SSE i WebSocket ostaju imena načina da displej sobe prekidača sam sazna broj. Primer taj displej i dalje hrani čitanjem.
