async function verifyAuthPages() {
  console.log('Testing dedicated two-page setup for /login and /register...');
  
  // 1. Verify /login dedicated page
  const resLogin = await fetch('http://localhost:9000/login');
  console.log('/login status:', resLogin.status);
  const textLogin = await resLogin.text();

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const loginHasEmojis = emojiRegex.test(textLogin);
  const loginHasLoginForm = textLogin.includes('id="login-form"');
  const loginHasRegisterForm = textLogin.includes('id="register-form"');
  const loginLinksToRegister = textLogin.includes('href="/register"');
  const loginHasNestedScroll = textLogin.includes('overflow-y: auto');

  console.log('/login has login form:', loginHasLoginForm);
  console.log('/login excludes register form (dedicated page):', !loginHasRegisterForm);
  console.log('/login links to /register:', loginLinksToRegister);
  console.log('/login contains emojis:', loginHasEmojis);
  console.log('/login has nested scrollbar:', loginHasNestedScroll);

  // 2. Verify /register dedicated page
  const resRegister = await fetch('http://localhost:9000/register');
  console.log('\n/register status:', resRegister.status);
  const textRegister = await resRegister.text();

  const regHasEmojis = emojiRegex.test(textRegister);
  const regHasRegisterForm = textRegister.includes('id="register-form"');
  const regHasLoginForm = textRegister.includes('id="login-form"');
  const regLinksToLogin = textRegister.includes('href="/login"');
  const regHasOrgBox = textRegister.includes('id="organizer-fields-box"');
  const regHasFamiliarIcons = textRegister.includes('fa-building-user') && textRegister.includes('fa-heart');
  const regHasNestedScroll = textRegister.includes('overflow-y: auto');

  console.log('/register has register form:', regHasRegisterForm);
  console.log('/register excludes login form (dedicated page):', !regHasLoginForm);
  console.log('/register links to /login:', regLinksToLogin);
  console.log('/register has organizer fields box:', regHasOrgBox);
  console.log('/register has familiar icons:', regHasFamiliarIcons);
  console.log('/register contains emojis:', regHasEmojis);
  console.log('/register has nested scrollbar:', regHasNestedScroll);

  const passed = resLogin.status === 200 &&
                 resRegister.status === 200 &&
                 loginHasLoginForm &&
                 !loginHasRegisterForm &&
                 loginLinksToRegister &&
                 !loginHasEmojis &&
                 !loginHasNestedScroll &&
                 regHasRegisterForm &&
                 !regHasLoginForm &&
                 regLinksToLogin &&
                 regHasOrgBox &&
                 regHasFamiliarIcons &&
                 !regHasEmojis &&
                 !regHasNestedScroll;

  if (passed) {
    console.log('\n✅ ALL TWO-PAGE AUTH CHECKS PASSED: /login and /register are completely separate dedicated pages with zero emojis and no nested scrollbars!');
  } else {
    console.error('\n❌ Check failed!');
    process.exit(1);
  }
}

verifyAuthPages();
