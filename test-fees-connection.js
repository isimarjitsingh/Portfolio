// Oracle Database Connection Test for Student Fees Management System
// This script helps verify Oracle connection and setup

const oracledb = require('oracledb');
require('dotenv').config();

async function testFeesDatabaseConnection() {
    console.log('🔍 Testing Student Fees Management System Database Connection...\n');
    
    try {
        // Check environment variables
        console.log('📋 Environment Variables:');
        console.log('ORACLE_CONNECTION_STRING:', process.env.ORACLE_CONNECTION_STRING || '❌ Not set');
        console.log('ORACLE_USER:', process.env.ORACLE_USER || '❌ Not set');
        console.log('ORACLE_PASSWORD:', process.env.ORACLE_PASSWORD ? '✅ Set' : '❌ Not set');
        console.log('');

        // Test connection
        console.log('🔌 Attempting to connect to Oracle Database...');
        const connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_CONNECTION_STRING,
            poolMax: 10,
            poolMin: 2,
            poolIncrement: 2,
            poolTimeout: 60
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

        // Check if fees tables exist
        console.log('\n🔍 Checking Student Fees Database Tables...');
        
        const tables = [
            'users', 'academic_years', 'classes', 'students',
            'fee_categories', 'fee_structures', 'fee_assignments',
            'fee_concessions', 'payment_methods', 'fee_receipts',
            'fee_payments', 'payment_history', 'fee_reminders'
        ];
        
        let tableCount = 0;
        for (const table of tables) {
            try {
                const result = await connection.execute(
                    `SELECT COUNT(*) as count FROM ${table}`,
                    [],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                console.log(`✅ ${table}: ${result.rows[0].COUNT} records`);
                tableCount++;
            } catch (err) {
                if (err.message.includes('ORA-00942')) {
                    console.log(`❌ ${table}: Table does not exist`);
                } else if (err.message.includes('ORA-00904')) {
                    console.log(`⚠️  ${table}: Table exists but has structure issues`);
                } else {
                    console.log(`⚠️  ${table}: Error - ${err.message}`);
                }
            }
        }

        console.log(`\n📈 Tables Found: ${tableCount}/${tables.length}`);

        // Test sample queries
        console.log('\n🧪 Testing Sample Queries...');
        
        try {
            const studentCount = await connection.execute(
                'SELECT COUNT(*) as count FROM students WHERE status = \'Active\'',
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(`✅ Active Students: ${studentCount.rows[0].COUNT}`);
        } catch (err) {
            console.log('❌ Error querying students:', err.message);
        }

        try {
            const receiptCount = await connection.execute(
                'SELECT COUNT(*) as count FROM fee_receipts WHERE status = \'Paid\'',
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(`✅ Paid Receipts: ${receiptCount.rows[0].COUNT}`);
        } catch (err) {
            console.log('❌ Error querying receipts:', err.message);
        }

        try {
            const totalFees = await connection.execute(
                'SELECT NVL(SUM(total_fee), 0) as total FROM students WHERE status = \'Active\'',
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            console.log(`✅ Total Fees: ₹${totalFees.rows[0].TOTAL.toLocaleString('en-IN')}`);
        } catch (err) {
            console.log('❌ Error calculating total fees:', err.message);
        }

        await connection.close();
        console.log('\n✅ Connection test completed successfully!');
        
        // Provide next steps
        console.log('\n🎯 Next Steps:');
        if (tableCount < tables.length) {
            console.log('   1️⃣ Some tables are missing. Run the setup script:');
            console.log('      sqlplus your_user/your_pass@your_db @database/fees-setup.sql');
        }
        console.log('   2️⃣ Start the application: node fees-server-fixed.js');
        console.log('   3️⃣ Open http://localhost:3000 in your browser');
        
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        console.log('\n🔧 Troubleshooting Tips:');
        console.log('   1. Ensure Oracle Database is running');
        console.log('   2. Check connection string format (hostname:port/service_name)');
        console.log('   3. Verify username and password');
        console.log('   4. Check network connectivity');
        console.log('   5. Ensure Oracle client is properly installed');
        
        if (err.message.includes('ORA-12541')) {
            console.log('   ⚠️  TNS:no listener - Check if Oracle listener is running');
        } else if (err.message.includes('ORA-12154')) {
            console.log('   ⚠️  TNS:could not resolve the connect identifier - Check connection string');
        } else if (err.message.includes('ORA-01017')) {
            console.log('   ⚠️  Invalid username/password - Check credentials');
        } else if (err.message.includes('DPI-1047')) {
            console.log('   ⚠️  Cannot locate Oracle Client library - Install Oracle Instant Client');
        } else if (err.message.includes('DPI-1080')) {
            console.log('   ⚠️  Oracle Client library version mismatch - Update Oracle client');
        }
        
        process.exit(1);
    }
}

async function testAPIEndpoints() {
    console.log('🌐 Testing API Endpoints...\n');
    
    const baseUrl = 'http://localhost:3000';
    
    try {
        // Test health endpoint
        console.log('🏥 Testing health endpoint...');
        const healthResponse = await fetch(`${baseUrl}/api/health`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health Check:', healthData);
        } else {
            console.log('❌ Health check failed:', healthResponse.status);
        }
        
        // Test dashboard stats
        console.log('📊 Testing dashboard stats...');
        const statsResponse = await fetch(`${baseUrl}/api/dashboard/stats`);
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            console.log('✅ Dashboard Stats:', statsData);
        } else {
            console.log('❌ Dashboard stats failed:', statsResponse.status);
        }
        
        // Test students endpoint
        console.log('👨‍🎓 Testing students endpoint...');
        const studentsResponse = await fetch(`${baseUrl}/api/students`);
        if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            console.log(`✅ Students: Found ${studentsData.length} students`);
        } else {
            console.log('❌ Students endpoint failed:', studentsResponse.status);
        }
        
        console.log('\n✅ API endpoints test completed!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('\n🔧 API Troubleshooting:');
        console.log('   1. Ensure the server is running: node fees-server-fixed.js');
        console.log('   2. Check if server is listening on port 3000');
        console.log('   3. Verify database connection in server logs');
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Student Fees Management System Tests\n');
    
    // Test database connection first
    await testFeesDatabaseConnection();
    
    // Wait a bit then test API endpoints
    console.log('\n⏱️  Waiting 3 seconds before testing API endpoints...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await testAPIEndpoints();
    
    console.log('\n🎉 All tests completed!');
}

// Run the tests
if (require.main === module) {
    runTests().catch(err => {
        console.error('💥 Test suite failed:', err);
        process.exit(1);
    });
}

module.exports = { testFeesDatabaseConnection, testAPIEndpoints };
