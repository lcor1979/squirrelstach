
export interface Nut {
	id: number;
	name: string;
	notes: string;
	quantity: Quantity;
	category: string;
}

export interface Quantity {
	amount: number;
	unit: string;
}
