const { prisma } = require('../services/databaseService');

// Initial inventory data for seeding
const INITIAL_INVENTORY = [
    {
        id: 'judith-shirt',
        title: 'HOPE & FAILURE\nJUDITH PRINT SHIRT',
        price: 0.5,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        inventory: {
            XS: 0,
            S: 5,
            M: 15,
            L: 20,
            XL: 8,
            XXL: 5,
            XXXL: 0,
        },
    },
    {
        id: 'judith-tote',
        title: 'HOPE & FAILURE\nJUDITH PRINT TOTE',
        price: 0.5,
        inventory: {
            'one-size': 10,
        },
    },
];

// Initialize inventory in database if not exists
async function initializeInventory() {
    try {
        const existingInventory = await prisma.inventory.findMany();

        if (existingInventory.length === 0) {
            console.log('🌱 Seeding initial inventory data...');

            for (const item of INITIAL_INVENTORY) {
                await prisma.inventory.create({
                    data: {
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        sizes: item.sizes || [],
                        inventory: item.inventory,
                    },
                });
            }

            console.log('✅ Initial inventory data seeded successfully');
        }
    } catch (error) {
        console.error('❌ Error initializing inventory:', error);
    }
}

// Inventory operations
async function getInventory() {
    try {
        const inventory = await prisma.inventory.findMany();

        // Convert array to object format for backwards compatibility
        const inventoryObj = {};
        inventory.forEach((item) => {
            inventoryObj[item.id] = {
                id: item.id,
                title: item.title,
                price: item.price,
                sizes: item.sizes,
                inventory: item.inventory,
            };
        });

        return inventoryObj;
    } catch (error) {
        console.error('❌ Error fetching inventory:', error);
        return {};
    }
}

async function updateInventory(productId, size, newQuantity) {
    try {
        const item = await prisma.inventory.findUnique({
            where: { id: productId },
        });

        if (item && size) {
            const updatedInventory = { ...item.inventory };
            updatedInventory[size] = newQuantity;

            await prisma.inventory.update({
                where: { id: productId },
                data: { inventory: updatedInventory },
            });

            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error updating inventory:', error);
        return false;
    }
}

async function decrementInventory(productId, size, quantity) {
    try {
        const item = await prisma.inventory.findUnique({
            where: { id: productId },
        });

        if (item && item.inventory) {
            const currentStock = item.inventory[size] || 0;
            const newStock = Math.max(0, currentStock - quantity);

            const updatedInventory = { ...item.inventory };
            updatedInventory[size] = newStock;

            await prisma.inventory.update({
                where: { id: productId },
                data: { inventory: updatedInventory },
            });

            console.log(
                `📦 Inventory decremented: ${productId}: ${currentStock} → ${newStock} (-${quantity})`
            );

            return {
                productId,
                size,
                previousStock: currentStock,
                newStock,
                decremented: quantity,
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error decrementing inventory:', error);
        return null;
    }
}

module.exports = {
    initializeInventory,
    getInventory,
    updateInventory,
    decrementInventory,
};
