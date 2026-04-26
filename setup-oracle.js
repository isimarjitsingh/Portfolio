// Oracle Database Setup Helper
// This script helps verify Oracle connection and setup

const oracledb = require('oracledb');
require('dotenv').config();

async function testOracleConnection() {
    console.log('Testing Oracle Database Connection...\n');
    
    try {
        // Check environment variables
        console.log('Environment Variables:');
        console.log('ORACLE_CONNECTION_STRING:', process.env.ORACLE_CONNECTION_STRING || 'Not set');
        console.log('ORACLE_USER:', process.env.ORACLE_USER || 'Not set');
        console.log('ORACLE_PASSWORD:', process.env.ORACLE_PASSWORD ? '***' : 'Not set');
        console.log('');

        // Test connection
        console.log('Attempting to connect to Oracle Database...');
        const connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_CONNECTION_STRING
        });

        console.log('✅ Successfully connected to Oracle Database!');
        
        // Get Oracle version
        const result = await connection.execute(
            'SELECT version FROM product_component_version WHERE product LIKE \'Oracle%\'',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        if (result.rows.length > 0) {
            console.log('📊 Oracle Version:', result.rows[0].VERSION);
        }

        // Check if tables exist
        console.log('\n🔍 Checking database tables...');
        
        const tables = ['users', 'students', 'teachers', 'classes', 'subjects', 'attendance', 'grades', 'enrollments', 'departments'];
        
        for (const table of tables) {
            try {
                const result = await connection.execute(
                    `SELECT COUNT(*) as count FROM ${table}`,
                    [],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                console.log(`✅ ${table}: ${result.rows[0].COUNT} records`);
            } catch (err) {
                if (err.message.includes('ORA-00942')) {
                    console.log(`❌ ${table}: Table does not exist`);
                } else {
                    console.log(`⚠️  ${table}: Error - ${err.message}`);
                }
            }
        }

        await connection.close();
        console.log('\n✅ Connection test completed successfully!');
        
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Ensure Oracle Database is running');
        console.log('2. Check connection string format (hostname:port/service_name)');
        console.log('3. Verify username and password');
        console.log('4. Check network connectivity');
        console.log('5. Ensure Oracle client is properly installed');
        
        if (err.message.includes('ORA-12541')) {
            console.log('   - TNS:no listener - Check if Oracle listener is running');
        } else if (err.message.includes('ORA-12154')) {
            console.log('   - TNS:could not resolve the connect identifier - Check connection string');
        } else if (err.message.includes('ORA-01017')) {
            console.log('   - Invalid username/password - Check credentials');
        } else if (err.message.includes('DPI-1047')) {
            console.log('   - Cannot locate Oracle Client library - Install Oracle Instant Client');
        }
        
        process.exit(1);
    }
}

async function runSetup() {
    console.log('🚀 Starting Oracle Setup for School Management System\n');
    
    // Check if .env file exists
    const fs = require('fs');
    if (!fs.existsSync('.env')) {
        console.log('❌ .env file not found!');
        console.log('📝 Please copy .env.example to .env and update with your Oracle credentials:');
        console.log('   cp .env.example .env');
        console.log('   Then edit .env with your database details\n');
        process.exit(1);
    }
    
    await testOracleConnection();
    console.log('\n🎉 Oracle setup verification complete!');
    console.log('📚 Next steps:');
    console.log('   1. If tables don\'t exist, run: sqlplus your_user/your_pass@your_db @database/setup.sql');
    console.log('   2. Start the application: npm start');
    console.log('   3. Open http://localhost:3000 in your browser');
}

// Run the setup
if (require.main === module) {
    runSetup().catch(err => {
        console.error('Setup failed:', err);
        process.exit(1);
    });
}

module.exports = { testOracleConnection };
