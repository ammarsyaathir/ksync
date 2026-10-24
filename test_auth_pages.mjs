async function verifyDoubleSliderAuth() {
  console.log('Testing Interactive & Responsive Double Slider for /login and /register...\n');
  
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  // 1. Verify /login
  console.log('--- Step 1: Checking GET /login ---');
  const resLogin = await fetch('http://localhost:9000/login');
  console.log('/login status:', resLogin.status);
  const textLogin = await resLogin.text();

  const loginHasSliderCard = textLogin.includes('id="auth-slider-card"');
  const loginHasRightPanelActive = textLogin.includes('auth-slider-card right-panel-active');
  const loginHasLoginForm = textLogin.includes('id="login-form"');
  const loginHasRegisterForm = textLogin.includes('id="register-form"');
  const loginHasOverlay = textLogin.includes('class="overlay-slider-container');
  const loginHasGlassNav = textLogin.includes('glass-nav');
  const loginHasOverflowAuto = textLogin.includes('overflow-y: auto') || textLogin.includes('overflow-y:scroll');
  const loginHasEmojis = emojiRegex.test(textLogin);
  const loginHasFaIcons = textLogin.includes('fa-building-user') && textLogin.includes('fa-heart') && textLogin.includes('fa-crown');

  console.log('Has #auth-slider-card:', loginHasSliderCard);
  console.log('Is right-panel-active FALSE initially (Sign In mode):', !loginHasRightPanelActive);
  console.log('Has Sign In form (#login-form):', loginHasLoginForm);
  console.log('Has Sign Up form (#register-form):', loginHasRegisterForm);
  console.log('Has Double Slider overlay track:', loginHasOverlay);
  console.log('Has fixed glass navigation (glass-nav):', loginHasGlassNav);
  console.log('Inner panel nested scrollbar eliminated (no overflow-y: auto):', !loginHasOverflowAuto);
  console.log('Zero emojis (uses familiar FontAwesome icons):', !loginHasEmojis);
  console.log('Has familiar FontAwesome icons:', loginHasFaIcons);

  // 2. Verify /register
  console.log('\n--- Step 2: Checking GET /register ---');
  const resRegister = await fetch('http://localhost:9000/register');
  console.log('/register status:', resRegister.status);
  const textRegister = await resRegister.text();

  const regHasSliderCard = textRegister.includes('id="auth-slider-card"');
  const regHasRightPanelActive = textRegister.includes('auth-slider-card right-panel-active');
  const regHasRegisterForm = textRegister.includes('id="register-form"');
  const regHasLoginForm = textRegister.includes('id="login-form"');
  const regHasOrgBox = textRegister.includes('id="organizer-fields-box"');
  const regHasOverlay = textRegister.includes('class="overlay-slider-container');
  const regHasGlassNav = textRegister.includes('glass-nav');
  const regHasOverflowAuto = textRegister.includes('overflow-y: auto') || textRegister.includes('overflow-y:scroll');
  const regHasEmojis = emojiRegex.test(textRegister);
  const regHasFaIcons = textRegister.includes('fa-building-user') && textRegister.includes('fa-heart');

  console.log('Has #auth-slider-card:', regHasSliderCard);
  console.log('Is right-panel-active TRUE on /register (Sign Up mode):', regHasRightPanelActive);
  console.log('Has Sign Up form (#register-form):', regHasRegisterForm);
  console.log('Has Sign In form (#login-form):', regHasLoginForm);
  console.log('Has organizer fields drawer (#organizer-fields-box):', regHasOrgBox);
  console.log('Has Double Slider overlay track:', regHasOverlay);
  console.log('Has fixed glass navigation (glass-nav):', regHasGlassNav);
  console.log('Inner panel nested scrollbar eliminated (no overflow-y: auto):', !regHasOverflowAuto);
  console.log('Zero emojis (uses familiar FontAwesome icons):', !regHasEmojis);
  console.log('Has familiar FontAwesome icons:', regHasFaIcons);

  // 3. Controller functions verification
  console.log('\n--- Step 3: Checking Double Slider Controller Functions ---');
  const hasSetAuthMode = textLogin.includes('function setAuthMode(');
  const hasToggleAccountType = textLogin.includes('function toggleAccountType(');
  const hasFillCreds = textLogin.includes('function fillCreds(');

  console.log('Includes setAuthMode controller:', hasSetAuthMode);
  console.log('Includes toggleAccountType controller:', hasToggleAccountType);
  console.log('Includes 1-click demo fillCreds controller:', hasFillCreds);

  const passed = resLogin.status === 200 &&
                 resRegister.status === 200 &&
                 loginHasSliderCard &&
                 !loginHasRightPanelActive &&
                 loginHasLoginForm &&
                 loginHasRegisterForm &&
                 loginHasOverlay &&
                 loginHasGlassNav &&
                 !loginHasOverflowAuto &&
                 !loginHasEmojis &&
                 loginHasFaIcons &&
                 regHasSliderCard &&
                 regHasRightPanelActive &&
                 regHasRegisterForm &&
                 regHasLoginForm &&
                 regHasOrgBox &&
                 regHasOverlay &&
                 regHasGlassNav &&
                 !regHasOverflowAuto &&
                 !regHasEmojis &&
                 regHasFaIcons &&
                 hasSetAuthMode &&
                 hasToggleAccountType &&
                 hasFillCreds;

  if (passed) {
    console.log('\n🎉 ALL CHECKS PASSED: Responsive Double Slider successfully unified across /login and /register with zero inner scrollbars and zero emojis!');
  } else {
    console.error('\n❌ Verification failed!');
    process.exit(1);
  }
}

verifyDoubleSliderAuth();
