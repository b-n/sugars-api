
import * as entry from '../src/entry'

export default class {

    constructor(db, express) {
        this.db = db; 
        this.route = new express.Router();
    }

    getRoute() {
        this.route.get('/', (req,res) => this.list(req, res));
        this.route.post('/', (req, res) => this.create(req, res));
        return this.route;
    }

    list(req, res) {
         entry.queryAll(null, this.db).then((result) => {
            res.status(200).send(result);    
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }

    create(req, res) {
        
    }

}
