
import * as food from './food'

const foodItemFields = [ 'name', 'carbs', 'foodId', 'quantity', 'unit' ];
const entryFields = [ 'entryDate', 'glucoseLevel', 'exerciseCarbs', 'insulinShort'];
   
export function queryAll(userId, db) {
    return db.User.find({
        include: [ { model: db.Entry, as: 'Entries', include: [ { model: db.Food, as: 'Foods' } ] } ],
        where: { firstName: 'Bex', lastName: 'Hill' }
        //where: { id: userId }
    }).then((user) => {
        let entries = [];
        
        user.Entries.forEach(entry => {
            let newEntry = { foodItems: [] };
            entryFields.forEach(field => newEntry[field] = entry[field]);
            entry.Foods.forEach(food => {
                let newFoodItem = {};
                foodItemFields.forEach(foodItem => newFoodItem[foodItem] = food[foodItem]);
                newEntry.foodItems.push(newFoodItem);
            });
        });
        return userEntries;
    });
}

export function create(entry, userId, db) {
    return food.queryAll(userId, db).then(userFoods => {
        return db.db.transaction(t => {
            //create userFood id map
            let userFoodMap = new Map();
            let foodNameSet = new Set();
            let newFoodItems = [];
            userFoods.Foods.forEach(food => {
                userFoodMap.set(food.Id, food);
                foodNameSet.set(food.name);
            });
            
            //do a bunch of validation
            entry.foodItems.forEach(food => {
                //make sure all food items with id's exist against this user
                if (food.id && !userFoodMap.has(food.Id)) throw new Error(`food does not exist with id: ${food.id}`);
                //all passed items need to hand in quantity and carbs    
                if (!food.carbs || !food.quantity) throw new Error(`food must have quantity and carbs`);
                //all food items without an id need a name and unit
                if (!food.id && (!food.name || !food.unit)) throw new Error(`food must have a name or unit if an id is not specified`);
                //duplicate item name check
                if (!food.id) {
                    if (foodNameSet.has(food.name)) throw new Error(`a food with this name exists or is already going to be created`);
                    foodNameSet.set(food.name);
                    newFoodItems.push(food);
                }
            });
            
            return food.createRecords(newFoodItems, userFoods.id, db, t).then(newItems => {
                console.log(newItems);
            });
        });                       
    });
}

