import { MainStore } from './MainStore';

class RootStore {
    public mainStore: MainStore;

    constructor() {
        this.mainStore = new MainStore();
    }
}

export { RootStore };
