import type { GetDomainsResponse } from "~/api-client";

type Domains = GetDomainsResponse["data"];

export class DomainStore {

    private static readonly data = reactive<Domains>([]);

    static async use() {
        return this.data;
    }

    static set(newData: Domains) {
        this.data.splice(0, this.data.length);
        this.data.push(...newData);
    }

    static async fetchAndSet() {
        const result = await useAPI().getDomains({});
        if (result.success) {
            this.set(result.data);
        }
    }

    static async getByID(id: string) {
        const existing = this.data.find(d => d.id === Number(id));
        if (existing) {
            return existing;
        } else {
            const result = await useAPI().getDomain({ id: Number(id) });
            if (result.success) {
                this.data.push(result.data);
                return result.data;
            }
        }
        return null;
    }

    static clear() {
        this.data.splice(0, this.data.length);
    }
}
