
import * as food from '../src/food'
//import * as util from '../src/server-util'

export default class {
    
    constructor(db, express) {
        this.db = db;
        this.route = new express.Router();
    }
    
    getRoute() {
        this.route.get('/', (req, res) => this.list(req, res));
        this.route.get('/:id', (req, res) => this.detail(req, res));
        this.route.post('/', (req, res) => this.create(req, res));
        this.route.put('/:id', (req, res) => this.update(req, res));
        this.route.delete('/:id', (req,res) => this.destroy(req, res));
        return this.route;
    }

    list(req, res) {
        food.queryAll(null, this.db).then((result) => {
            res.status(200).send(result.Food);    
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }
    
    detail(req, res) {
        food.queryRecord(req.params.id, null, this.db).then((result) => {
            res.status(200).send(result.Foods[0]);    
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }
    
    create(req, res) {
        food.createRecords(req.body, null, this.db).then((result) => {
            res.status(200).send({status: 'success', item: result });
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }

    destroy(req, res) {
        food.dropRecord(req.params.id, null, this.db).then((result) => {
            res.status(200).send({ status: 'success'}); 
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }
    
    update(req, res) {
        food.updateRecord(req.params.id, req.body, null, this.db).then((result) => {
            res.status(200).send({ status: 'success', item: result }); 
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }
   
}
