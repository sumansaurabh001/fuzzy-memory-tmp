

export function deepClone(a) {
  return JSON.parse(JSON.stringify(a));
}


export function arrayDiffById(a:any[], b:any[]) {
  // Make hashtable of ids in B
  var bIds = {};
  b.forEach((obj) => {
    bIds[obj.id] = obj;
  });

// Return all elements in A, unless in B
  return a.filter((obj) => {
    return !(obj.id in bIds);
  });
}
