/* eslint-disable default-case */
export const materialType = {
	glass: 'glass',
};
export const materialGlassType = {
	float: 'float',
	tempered: 'tempered',
	laminated: 'laminated',
	annealed: 'annealed'
};
export const toMaterialTypeTitle = (type) => {
	switch (type) {
		case materialType.glass:
			return 'GLASS';
		default:
			return 'GLASS';
	}
};
export const toMaterialGlassTypeTitle = (glassType) => {
	switch (glassType) {
		case materialGlassType.float:
			return 'FLOAT';
		case materialGlassType.tempered:
			return 'TEMPERED';
		case materialGlassType.laminated:
			return 'LAMINATED';
		case materialGlassType.annealed:
			return 'ANNEALED';
		default:
			return 'FLOAT';
	}
};
export const toMaterialTypeColor = (type) => {
	switch (type) {
		case materialType.glass:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
export const toMaterialGlassTypeColor = (glassType) => {
	switch (glassType) {
		case materialGlassType.float:
			return 'bg-blue-500';
		case materialGlassType.tempered:
			return 'bg-blue-500';
		case materialGlassType.laminated:
			return 'bg-blue-500';
		case materialGlassType.annealed:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
