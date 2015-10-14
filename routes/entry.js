
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
        this.db.Entry.findAll().then(function(food) {
            res.status(200).send(food);
        });
    }

    create(req, res) {
        
    }

}
