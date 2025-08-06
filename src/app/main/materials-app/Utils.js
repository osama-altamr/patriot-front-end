export const materialType = {
  glass: "glass",
aluminum: "aluminum",
stone: "stone",
};
export const materialGlassType = {
  float: "float",
tempered: "tempered",
laminated: "laminated",
annealed: "annealed",
};
export const toMaterialTypeTitle = (type) => {
  switch (type) {
    case materialType.glass:
      return "GLASS";
case materialType.aluminum:
      return "ALUMINUM";
case materialType.stone:
      return "STONE";
  }
  return "GLASS";
};
export const toMaterialGlassTypeTitle = (glassType) => {
  switch (glassType) {
    case materialGlassType.float:
      return "FLOAT";
case materialGlassType.tempered:
      return "TEMPERED";
case materialGlassType.laminated:
      return "LAMINATED";
case materialGlassType.annealed:
      return "ANNEALED";
  }
  return "FLOAT";
};
export const toMaterialTypeColor = (type) => {
  switch (type) {
    case materialType.glass:
      return "bg-blue-500";
case materialType.aluminum:
      return "bg-blue-500";
case materialType.stone:
      return "bg-blue-500";
  }
  return "bg-blue-500";
};
export const toMaterialGlassTypeColor = (glassType) => {
  switch (glassType) {
    case materialGlassType.float:
      return "bg-blue-500";
case materialGlassType.tempered:
      return "bg-blue-500";
case materialGlassType.laminated:
      return "bg-blue-500";
case materialGlassType.annealed:
      return "bg-blue-500";
  }
  return "bg-blue-500";
};