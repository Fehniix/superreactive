import { SuperReactive } from "../lib/SuperReactive";

class Endpoint2 {
	public srInstance: SuperReactive;

	public constructor() {
		this.srInstance = new SuperReactive();
	}
}

export default new Endpoint2();