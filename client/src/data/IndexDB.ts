const equipmentStore = 'equipment';
const setStore = 'set';
const read = 'readonly';
const write = 'readwrite';

class IndexDB {
	private dbName:string;
	private db:IDBDatabase|null;
	private version:number;

	constructor(databaseName:string, databaseVersion:number) {
		this.dbName = databaseName;
		this.version = databaseVersion;
		this.db = null;
		this.openDB();
	}

	public isOpen() {
		return this.db ? true : false;
	}

	private async openDB() {
		console.log(`Opening ${this.dbName} v${this.version}`)
		let request = window.indexedDB.open(this.dbName, this.version);
		request.onerror = () => {
			// use request.errorcode
			console.log(
				`Error opening IndexedDB (${this.dbName}, ${this.version}): ${request.error}`);
		};
		request.onsuccess = event => {
			this.db = request.result;
		};
		request.onupgradeneeded = event => {
			/**
			 * NOTE:
			 * Upgrades will occur with even-numbered patches, when the previous
			 * raid and tome gear is obsolete. This allows a good opportunity to
			 * clean the user's storage of old data.
			 */
			let db = request.result;
			// delete the previous objectStore(s)
			if(db.objectStoreNames.length > 0) {
				db.deleteObjectStore(equipmentStore);
				db.deleteObjectStore(setStore);
			}
			// create new objectStore(s)
			let store = [db.createObjectStore(equipmentStore, {keyPath: 'id'}),
				db.createObjectStore(setStore, {keyPath: 'id'})];
			store[0].transaction.oncomplete = event => {
				console.log(`store 0 complete:`,event);
			}
			store[1].transaction.oncomplete = event => {
				console.log(`store 1 complete:`,event);
			}
		}
	}

	public getItem(tableName:string, id:string) {
		return new Promise((resolve, reject) => {
			if(!this.db) return {error: 'Database is null'};
			const transaction = this.db.transaction(tableName, read);
			const store = transaction.objectStore(tableName);
			const result = store.get(id);
			transaction.oncomplete = event => {
				resolve(result.result);
			}
		})
	}

	public async setItem(tableName:string, item:any) {
		if(!this.db) return {error: 'Database is null'};
		const transaction = this.db.transaction(tableName, write);
		const store = transaction.objectStore(tableName);
		const result = await store.put(item);
		return result;
	}
}

export { IndexDB };