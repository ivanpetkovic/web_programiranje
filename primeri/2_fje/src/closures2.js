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


// fja viseg reda
function counter(x) {
    let a = x;

    function add(y) {
        a += y;
        console.log(a);
    }
    return add;
}

const c1 = counter(1);

for (var i = 0; i < 3; i++) {
  const el = document.createElement("button");
  el.innerText = "Click " + i;
  document.body.appendChild(el);
  //setTimeout(((j) => () => console.log(j))(i), 0); // 0 1 2
  el.onclick = ((i) => () => console.log(i))(i);
}