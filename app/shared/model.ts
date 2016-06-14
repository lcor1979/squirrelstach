
export class Nut {
	id: number;
	name: string;
	notes: string;
	quantity: Quantity;
	category: string;

	constructor() {
		this.quantity = new Quantity();
	}
}

export class Quantity {
	amount: number;
	unit: string;
}
