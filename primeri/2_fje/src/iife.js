
(function (message) {
    console.log(message);
  })("hi");

const makeCounter = (start) =>
  (function (countStart) {
    function increase() {
      countStart++;
      console.log("inc " + countStart);
    }

    function decrease() {
      countStart--;
      console.log("dec " + countStart);
    }
    return {
      increase,
      decrease,
    };
  })(start);

const counter2 = makeCounter(10);
const counter3 = makeCounter(5);
counter2.increase();
counter2.increase();
counter2.increase();
counter3.increase();
counter2.decrease();
