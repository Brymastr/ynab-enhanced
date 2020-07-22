let x, y, z;

function run1() {
  return {
    x: 'x',
    y: 'y',
    z: 'z',
  };
}

function run2() {
  return ['x', 'y', 'z'];
}

// ({ x, y, z } = run1());
// console.log(x, y, z);

[x, y, z] = run2();
console.log(x, y, z);
