
export default function(db, DataTypes) {
    let entry = db.define('entry', {
        entryDate: DataTypes.DATE,
        glucoseLevel: DataTypes.DECIMAL(8,3),
        exerciseCarbs: DataTypes.DECIMAL(8,3),
        insulinShort: DataTypes.DECIMAL(8,3)
    });

    return entry;
}

