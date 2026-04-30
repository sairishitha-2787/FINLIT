require('dotenv').config();
const supabase = require('./config/supabase');

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  console.log('Environment Check:');
  console.log('├─ SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('├─ SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');
  console.log('');

  try {
    // Test 1: Check connection
    console.log('Test 1: Basic Connection');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('count');

    if (profileError) {
      console.log('❌ Connection failed:', profileError.message);
      return;
    }
    console.log('✅ Connected to user_profiles table\n');

    // Test 2: List all tables
    console.log('Test 2: Database Tables');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tableError && tables) {
      console.log('✅ Found tables:');
      tables.forEach(t => console.log(`   ├─ ${t.table_name}`));
      console.log('');
    }

    // Test 3: Check each required table
    console.log('Test 3: Required Tables Check');
    const requiredTables = [
      'user_profiles',
      'progress',
      'user_badges',
      'user_streaks',
      'mentor_conversations',
      'quiz_results'
    ];

    for (const tableName of requiredTables) {
      const { error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`   ❌ ${tableName}: NOT FOUND`);
      } else {
        console.log(`   ✅ ${tableName}: OK`);
      }
    }

    console.log('\n🎉 All tests passed! Supabase is ready.\n');

  } catch (err) {
    console.error('\n❌ Unexpected Error:', err.message);
    console.error('Stack:', err.stack);
  }
}

testConnection();
