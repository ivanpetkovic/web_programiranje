async function getRandomNumber() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const number = Math.ceil(Math.random() * 10);
      resolve(number);
    }, 500);
  });
}

async function getAsyncArray() {
  const n = [];
  n[0] = await getRandomNumber();
  n[1] = await getRandomNumber();
  n[2] = await getRandomNumber();
  return n;
}

console.log("brojevi " + (await getAsyncArray()));

Promise.all([getRandomNumber(), getRandomNumber(), getRandomNumber()]).then(
  (array) => {
    console.log("brojevi u paraleli " + array);
  }
);
