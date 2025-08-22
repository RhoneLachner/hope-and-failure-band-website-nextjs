#!/usr/bin/env node

/**
 * Database Performance Index Migration Script
 *
 * This script applies performance indexes to the PostgreSQL database
 * for optimizing frequently used queries.
 *
 * Usage: node scripts/applyPerformanceIndexes.js
 */

const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

async function applyPerformanceIndexes() {
    const prisma = new PrismaClient();

    try {
        console.log('🚀 Starting database performance optimization...');

        // Read the SQL migration file
        const migrationPath = path.join(
            __dirname,
            '../src/database/performance-migration.sql'
        );
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        // Split SQL commands properly
        const commands = migrationSQL
            .split(';')
            .map((cmd) => cmd.trim())
            .filter(
                (cmd) =>
                    cmd.length > 0 &&
                    !cmd.startsWith('--') &&
                    !cmd.startsWith('ANALYZE')
            );

        console.log(
            `📊 Applying ${commands.length} performance optimizations...`
        );

        for (const command of commands) {
            try {
                if (command.trim()) {
                    console.log(`   Executing: ${command.substring(0, 50)}...`);
                    await prisma.$executeRawUnsafe(command);
                }
            } catch (error) {
                // Log but continue - some indexes might already exist
                if (error.message.includes('already exists')) {
                    console.log(`   ⚠️  Index already exists - skipping`);
                } else {
                    console.error(
                        `   ❌ Error executing command: ${error.message}`
                    );
                    throw error;
                }
            }
        }

        console.log('✅ Database performance optimization completed!');
        console.log('');
        console.log('📈 Applied optimizations:');
        console.log('   • Events: Indexed by date, isPast status');
        console.log('   • Videos: Indexed by display order, YouTube ID');
        console.log('   • Lyrics: Indexed by display order, instrumental flag');
        console.log('   • Inventory: Indexed by title');
        console.log('   • All tables: Optimized creation/update timestamps');
        console.log('');
        console.log('🎯 Expected performance improvements:');
        console.log('   • Faster event date sorting');
        console.log('   • Improved video/lyrics ordering');
        console.log('   • Optimized admin operations');
        console.log('   • Better query planner optimization');
    } catch (error) {
        console.error('❌ Database performance optimization failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the migration
if (require.main === module) {
    applyPerformanceIndexes()
        .then(() => {
            console.log('🎉 Database is now optimized for peak performance!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Migration failed:', error);
            process.exit(1);
        });
}

module.exports = { applyPerformanceIndexes };
