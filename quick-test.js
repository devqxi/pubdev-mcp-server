// Quick test of pub.dev API endpoints
import fetch from 'node-fetch';

async function testPubDevAPI() {
  console.log('Testing pub.dev API endpoints...\n');

  // Test 1: Get package info
  try {
    console.log('1. Testing package info for "http" package:');
    const response = await fetch('https://pub.dev/api/packages/http');
    const data = await response.json();
    console.log(`✅ Package: ${data.name}, Version: ${data.latest.version}`);
    console.log(`   Description: ${data.latest.pubspec?.description?.substring(0, 100)}...`);
  } catch (error) {
    console.log('❌ Package info test failed:', error.message);
  }

  // Test 2: Search packages
  try {
    console.log('\n2. Testing package search:');
    const response = await fetch('https://pub.dev/api/search?q=flutter&sort=top');
    const data = await response.json();
    console.log(`✅ Search results: ${data.packages.length} packages found`);
    console.log(`   Top result: ${data.packages[0]?.package}`);
  } catch (error) {
    console.log('❌ Package search test failed:', error.message);
  }

  // Test 3: Get package versions
  try {
    console.log('\n3. Testing package versions for "flutter":');
    const response = await fetch('https://pub.dev/api/packages/flutter/versions');
    const data = await response.json();
    console.log(`✅ Versions available: ${data.versions.length}`);
    console.log(`   Latest: ${data.versions[0]?.version}`);
  } catch (error) {
    console.log('❌ Package versions test failed:', error.message);
  }
}

testPubDevAPI();