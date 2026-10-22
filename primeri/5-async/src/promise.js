
function placeBet(target) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const number = Math.ceil(Math.random() * 14);
            if (number > target) {
                reject(`Number ${number} > target ${target}` );
            } else {
                resolve(number);
            }
        }, 500);
    });
}

placeBet(10).then((number) => {
    console.log(number);
    return placeBet(10);
}).then((number) => {
    console.log(number);
    return placeBet(10);
}).then((number) => {
    console.log("Win!");
}).catch((reason) => {
    console.error("⚠", reason);
})