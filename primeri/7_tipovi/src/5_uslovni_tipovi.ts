// PRIMER 1

interface User {
    id: number;
    name: string;
}

// Ako je T broj, vrati User, u suprotnom vrati User[]
type ApiResponse<T> = T extends number ? User : User[];

function getUserData<T extends number | undefined>(id?: T): ApiResponse<T> {
    throw "implementacija nebitna za primer";
}

const singleUser = getUserData(1);      // Tip je: User
const allUsers = getUserData();         // Tip je: User[]

// PRIMER 2

type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// Tumačenje:
// Ako je T tipa Promise, "izvuci" ono što je unutra i nazovi to U. 
// Vrati U. Ako nije Promise, vrati originalni tip T.

type Result = UnpackPromise<Promise<string>>; // Result je string

