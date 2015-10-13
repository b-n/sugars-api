
export default function(db, DataTypes) {
    let foodentry = db.define('foodEntry', {
        quantity: DataTypes.DECIMAL(8,3),
        carbs: DataTypes.INTEGER
    });
    return foodentry;
}


