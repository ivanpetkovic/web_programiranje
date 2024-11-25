function outer() {
  let i = 0;
  const funcArray = [];
  for ( i = 0; i < 5; i++) {
    funcArray[i] = (function(curr) {
      // console.log('i= ' + curr);
      return () => {console.log('i=' + curr)};
    })(i);
  }
  return funcArray;
}
const fa = outer();
fa[0]();
fa[1]();
fa[2]();
