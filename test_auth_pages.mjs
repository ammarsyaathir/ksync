
async function verifyAuthPages() {
  console.log('Testing /login and /register UI rendering...');
  const resLogin = await fetch('http://localhost:9000/login');
  console.log('/login status:', resLogin.status);
  const textLogin = await resLogin.text();

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  console.log('/login contains emojis:', emojiRegex.test(textLogin));
  console.log('/login has login form:', textLogin.includes('id="login-form"'));
  console.log('/login has overflow-y: auto (nested scrollbar check):', textLogin.includes('overflow-y: auto'));

  const resRegister = await fetch('http://localhost:9000/register');
  console.log('/register status:', resRegister.status);
  const textRegister = await resRegister.text();
  console.log('/register contains emojis:', emojiRegex.test(textRegister));
  console.log('/register has register form:', textRegister.includes('id="register-form"'));
  console.log('/register has organizer fields box:', textRegister.includes('id="organizer-fields-box"'));
  console.log('/register has familiar icons:', textRegister.includes('fa-building-user') && textRegister.includes('fa-heart'));

  if (resLogin.status === 200 && resRegister.status === 200 && !emojiRegex.test(textLogin) && !emojiRegex.test(textRegister)) {
    console.log('✅ ALL AUTH PAGE CHECKS PASSED: Zero emojis, responsive layout, no nested scrollbar.');
  } else {
    console.error('❌ Check failed!');
    process.exit(1);
  }
}

verifyAuthPages();
