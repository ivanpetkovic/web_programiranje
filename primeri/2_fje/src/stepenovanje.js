

const pow = function pow(stepen) {
    return function(x) {
        return Math.pow(x, stepen);
    }
}

const kvadriraj = pow(2);
console.log(kvadriraj(3));
