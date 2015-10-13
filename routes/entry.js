
export default class {

    constructor(db, express) {
        this.db = db; 
        this.route = new express.Router();
    }

    getRoute() {
        this.route.get('/', (req,res) => this.list);
        return this.route;
    }

    list(req, res) {
        this.db.Entry.findAll().then(function(food) {
            res.status(200).send(food);
        });
    }

}
