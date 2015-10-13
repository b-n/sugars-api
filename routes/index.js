
import food from './food'
import entry from './entry'

export default class {
    
    constructor(db, express) {
        this.food = new food(db, express);
        this.entry = new entry(db, express);
        
        this.routes = new express.Router();
    }

    getRoutes() {
        
        this.routes.use('/food', this.food.getRoute());
        this.routes.use('/entry', this.entry.getRoute());

        return this.routes;
    }    


}


