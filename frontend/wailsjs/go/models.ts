export namespace main {
	
	export class Block {
	    id: string;
	    pageId: string;
	    created_at: number;
	    type: string;
	    data?: string;
	
	    static createFrom(source: any = {}) {
	        return new Block(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.pageId = source["pageId"];
	        this.created_at = source["created_at"];
	        this.type = source["type"];
	        this.data = source["data"];
	    }
	}
	export class Page {
	    id: string;
	    created_at: number;
	    name: string;
	    chatMessages: string;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new Page(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.created_at = source["created_at"];
	        this.name = source["name"];
	        this.chatMessages = source["chatMessages"];
	        this.type = source["type"];
	    }
	}

}

